import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cloneDeep, isNil } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';

import { photoCollageRuntimeConfiguration } from '../config';

import {
  PhotoCollageState,
  CollageSpec,
  PhotoCollection,
  DisplayedPhoto,
  Photo,
  TsRect,
  RenderedPhoto,
} from '../type';
import {
  startPlaybackFirstTime,
} from '../controller';

import {
  getFullScreenDisplay,
  getActivePhotoCollageSpec,
  getPhotoCollection,
  getSelectedPhotoIndex,
  getDisplayingCanvasIndex,
  getFetchingCanvasIndex,
  getPhotos,
  getSelectionRectangle,
} from '../selector';
import {
  setRenderedPhotoRect,
  setSelectionRectangle,
} from '../model';

let uncachedPhotosInCollage: Photo[] = [];
let photoImages: DisplayedPhoto[] = [];
let displayedSelectionX = -1;
let displayedSelectionY = -1;
let displayedSelectionWidth = -1;
let displayedSelectionHeight = -1;

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

/** @internal */
/** @private */
// export interface PhotoCollageCanvasPropsFromParent {
//   onSelectPhoto: any;
// }

/** @internal */
/** @private */
// export interface PhotoCollageCanvasComponentState {
//   // selectedPhoto: DisplayedPhoto | null;
// }

/** @internal */
/** @private */
// export interface PhotoCollageCanvasProps extends PhotoCollageCanvasPropsFromParent {
export interface PhotoCollageCanvasProps {
  displayingCanvasIndex: number;
  fetchingCanvasIndex: number;
  selectedPhotoIndex: number;
  selectionRectangle: TsRect | null,
  fullScreenDisplay: boolean;
  photoCollection: PhotoCollection;
  photoCollageSpec: CollageSpec | null;
  photos: RenderedPhoto[] | null;
  displayedPhotos: RenderedPhoto[] | null;
  onStartPlayback: () => any;
  onStartPlaybackFirstTime: () => any;
  onStopPlayback: () => any;
  onEnterFullScreenPlayback: () => any;
  onSetRenderedPhotoRect: (
    canvasIndex: number,
    photoIndex: number,
    rectX: number,
    rectY: number,
    rectWidth: number,
    rectHeight: number,
  ) => any;
  onSetSelectionRectangle: (selectionRectangle: TsRect) => any;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

const useStyles = makeStyles({
  hideCanvas: {
    display: 'none',
  },
  showCanvas: {
    display: 'block',
  },
  overflowHidden: {
    overflow: 'hidden',
  }
});


const canvasRefs: (HTMLCanvasElement | null)[] = [];
canvasRefs.push(null);
canvasRefs.push(null);

const canvasContexts: (CanvasRenderingContext2D | null)[] = [];
canvasContexts.push(null);
canvasContexts.push(null);

const PhotoCollageCanvas = (props: PhotoCollageCanvasProps) => {

  const classes = useStyles();

  // Equivalent to old componentDidMount
  React.useEffect(props.onStartPlaybackFirstTime, []);

  const setCanvasRef = (element: HTMLCanvasElement) => {
    if (!isNil(element)) {
      const canvasIndex = parseInt(element.id, 10);
      canvasRefs[canvasIndex] = element;
      canvasContexts[canvasIndex] = element.getContext('2d');
    }
  };

  const eraseSelection = (): void => {
    if (displayedSelectionX < 0) {
      return;
    }

    const context = canvasContexts[props.displayingCanvasIndex] as CanvasRenderingContext2D;
    context.beginPath();
    context.rect(displayedSelectionX, displayedSelectionY, displayedSelectionWidth, displayedSelectionHeight);
    context.strokeStyle = 'white';
    context.lineWidth = 3.0;
    context.stroke();
  };

  const renderSelection = (): void => {
    if (props.selectedPhotoIndex < 0 || isNil(props.displayedPhotos)) {
      return;
    }

    const renderedPhotos: RenderedPhoto[] = props.displayedPhotos as RenderedPhoto[];

    const selectedPhoto: RenderedPhoto = renderedPhotos[props.selectedPhotoIndex];
    const { rectX, rectY, rectWidth, rectHeight } = selectedPhoto;
    displayedSelectionX = rectX!;
    displayedSelectionY = rectY!;
    displayedSelectionWidth = rectWidth!;
    displayedSelectionHeight = rectHeight!;

    const context = canvasContexts[props.displayingCanvasIndex] as CanvasRenderingContext2D;
    context.beginPath();
    context.rect(rectX!, rectY!, rectWidth!, rectHeight!);
    context.strokeStyle = 'red';
    context.lineWidth = 2.0;
    context.stroke();
  };

  const fullScreenRenderPhoto = (
    canvasIndex: number,
    photoInCollageIndex: number,
    filePath: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {

    const photos: Photo[] = props.photos as Photo[];

    if (uncachedPhotosInCollage.length === 0 || photos[0].filePath! !== uncachedPhotosInCollage[0].filePath!) {
      uncachedPhotosInCollage = cloneDeep(photos);
    }

    const photo: HTMLImageElement = new Image();
    photo.id = filePath;
    (photo as any).photoInCollageIndex = photoInCollageIndex;
    photo.onload = () => {

      const filePathsInCollage: string[] = uncachedPhotosInCollage.map((photoInCollage) => {
        return isNil(photoInCollage.filePath) ? '' : photoInCollage.filePath;
      });

      const filePathWithoutUrlScheme: string = photo.id.substring(8);

      // **** this fails for full screen images!!
      // if (filePathsInCollage.indexOf(filePathWithoutUrlScheme) >= 0) {
      fullScreenScaleAndDrawImage(canvasIndex, photo, x, y, width, height);
      // }
    };
    photo.src = filePath;
  };

  const fullScreenScaleAndDrawImage = (
    canvasIndex: number,
    photo: HTMLImageElement,
    xOnCanvas: number,
    yOnCanvas: number,
    widthOnCanvas: number,
    heightOnCanvas: number
  ) => {
    const scale = Math.min(widthOnCanvas / photo.width, heightOnCanvas / photo.height);
    const x = (widthOnCanvas / 2) - (photo.width / 2) * scale;
    const y = (heightOnCanvas / 2) - (photo.height / 2) * scale;
    if (!isNil(canvasContexts[canvasIndex])) {
      const canvasContext = canvasContexts[canvasIndex] as CanvasRenderingContext2D;
      const imageX = x + xOnCanvas;
      const imageY = y + yOnCanvas;
      const imageWidth = photo.width * scale;
      const imageHeight = photo.height * scale;
      canvasContext.drawImage(photo, imageX, imageY, imageWidth, imageHeight);

      // I don't think makes sense for a full screen photo
      props.onSetRenderedPhotoRect(canvasIndex, (photo as any).photoInCollageIndex, imageX, imageY, imageWidth, imageHeight);
    }
  };
  // ** end of full screen


  const renderPhoto = (
    canvasIndex: number,
    photoInCollageIndex: number,
    filePath: string,
    drawBorder: boolean,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {

    const photos: Photo[] = props.photos as Photo[];

    if (uncachedPhotosInCollage.length === 0 || photos[0].filePath! !== uncachedPhotosInCollage[0].filePath!) {
      uncachedPhotosInCollage = cloneDeep(photos);
    }

    // const fetchingCanvasIndex = props.fetchingCanvasIndex;

    const photo: HTMLImageElement = new Image();
    photo.id = filePath;
    (photo as any).photoInCollageIndex = photoInCollageIndex;
    photo.onload = () => {

      const filePathsInCollage: string[] = uncachedPhotosInCollage.map((photoInCollage) => {
        return isNil(photoInCollage.filePath) ? '' : photoInCollage.filePath;
      });

      const filePathWithoutUrlScheme: string = photo.id.substring(8);

      // **** this fails for full screen images!!
      if (filePathsInCollage.indexOf(filePathWithoutUrlScheme) >= 0) {
        scaleAndDrawImage(canvasIndex, photo, drawBorder, x, y, width, height);
      }
    };
    photo.src = filePath;
  };

  const scaleAndDrawImage = (
    canvasIndex: number,
    photo: HTMLImageElement,
    imageSelected: boolean,
    xOnCanvas: number,
    yOnCanvas: number,
    widthOnCanvas: number,
    heightOnCanvas: number
  ) => {
    const scale = Math.min(widthOnCanvas / photo.width, heightOnCanvas / photo.height);
    const x = (widthOnCanvas / 2) - (photo.width / 2) * scale;
    const y = (heightOnCanvas / 2) - (photo.height / 2) * scale;
    if (!isNil(canvasContexts[canvasIndex])) {
      const canvasContext = canvasContexts[canvasIndex] as CanvasRenderingContext2D;
      const imageX = x + xOnCanvas;
      const imageY = y + yOnCanvas;
      const imageWidth = photo.width * scale;
      const imageHeight = photo.height * scale;
      canvasContext.drawImage(photo, imageX, imageY, imageWidth, imageHeight);

      props.onSetRenderedPhotoRect(canvasIndex, (photo as any).photoInCollageIndex, imageX, imageY, imageWidth, imageHeight);

    }
  };

  const getScaledCoordinates = (x: number, y: number, width: number, height: number, collageWidth: number, collageHeight: number, totalCollageWidth: number, totalCollageHeight: number): TsRect => {

    let screenX = (x / collageWidth) * totalCollageWidth;
    let screenY = (y / collageHeight) * totalCollageHeight;
    let screenWidth = (width / collageWidth) * totalCollageWidth;
    let screenHeight = (height / collageHeight) * totalCollageHeight;

    screenX += 2;
    screenY += 2;
    screenHeight -= 4;
    screenWidth -= 4;

    return {
      x: screenX,
      y: screenY,
      width: screenWidth,
      height: screenHeight,
    };
  };

  const renderPhotosInCollage = () => {

    const photosInCollage: Photo[] = props.photos as Photo[];
    if (photosInCollage.length === 0) {
      return;
    }

    // TEDTODO - this is where I need to match up the collage spec with the photos
    // iterate through each spec item; get the corresponding photo; render it
    photoImages = [];
    const { collageWidth, collageHeight, collageItemSpecs } = props.photoCollageSpec!;
    let index = 0;
    for (const collageItemSpec of collageItemSpecs) {
      const { x, y, width, height } = collageItemSpec;

      if (!isNil(photosInCollage[index].filePath)) {
        const photoInCollage: Photo = photosInCollage[index];
        const filePath = photoInCollage.filePath!;

        const screenCoordinates = getScaledCoordinates(x, y, width, height, collageWidth, collageHeight, photoCollageRuntimeConfiguration.collageWidth, photoCollageRuntimeConfiguration.collageHeight);

        photoImages.push({
          x: screenCoordinates.x,
          y: screenCoordinates.y,
          ...photoInCollage,
        });

        renderPhoto(
          props.fetchingCanvasIndex,
          index,
          'file:///' + filePath,
          index === props.selectedPhotoIndex,
          screenCoordinates.x,
          screenCoordinates.y,
          screenCoordinates.width,
          screenCoordinates.height);
      }

      index++;
    }
  };

  const renderFullScreenPhoto = () => {

    const selectedPhotoIndex = props.selectedPhotoIndex;
    if (props.selectedPhotoIndex < 0) {
      return;
    }
    
    const displayedPhotos: RenderedPhoto[] | null = props.displayedPhotos;
    if (isNil(displayedPhotos)) {
      return;
    }

    const renderedPhoto: RenderedPhoto = displayedPhotos[selectedPhotoIndex];
    const filePath = renderedPhoto.filePath;

    const { collageWidth, collageHeight, collageItemSpecs } = props.photoCollageSpec!;
    const screenCoordinates = getScaledCoordinates(0, 0, collageWidth, collageHeight, collageWidth, collageHeight, photoCollageRuntimeConfiguration.collageWidth, photoCollageRuntimeConfiguration.collageHeight);

    fullScreenRenderPhoto(
      props.displayingCanvasIndex,
      0,
      'file:///' + filePath,
      screenCoordinates.x,
      screenCoordinates.y,
      screenCoordinates.width,
      screenCoordinates.height);
  };

  const renderPhotoCollage = () => {

    if (isNil(props.photoCollageSpec) ||
      isNil(props.photoCollection) ||
      isNil(props.photoCollection!.photosInCollection) ||
      props.photoCollection.photosInCollection.length === 0 ||
      isNil(props.photos)) {
      return;
    }

    renderPhotosInCollage();
  };

  const displayingCanvasIndex: number = props.displayingCanvasIndex;
  const fetchingCanvasIndex: number = props.fetchingCanvasIndex;

  if (fetchingCanvasIndex >= 0) {
    const canvasRef = canvasRefs[fetchingCanvasIndex];
    const canvasContext = canvasContexts[fetchingCanvasIndex];
    const displayingCanvasContext = canvasContexts[displayingCanvasIndex];
    if (!isNil(canvasRef) && !isNil(displayingCanvasContext) && !isNil(canvasContext)) {
      displayingCanvasContext.imageSmoothingEnabled = false;
      canvasContext.imageSmoothingEnabled = false;
      // TEDTODO - I never understood this
      if (props.displayingCanvasIndex !== props.fetchingCanvasIndex) {
        canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
      }
      if (props.fullScreenDisplay) {
        displayingCanvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
        console.log('renderFullScreenPhoto');
        renderFullScreenPhoto();
      } else {
        eraseSelection();
        renderPhotoCollage();
        renderSelection();
      }
    }
  }

  return (
    <div
      className={classes.overflowHidden}
    >
      <canvas
        id='0'
        className={displayingCanvasIndex === 0 ? classes.showCanvas : classes.hideCanvas}
        width={photoCollageRuntimeConfiguration.collageWidth.toString()}
        height={photoCollageRuntimeConfiguration.collageHeight.toString()}
        ref={setCanvasRef}
      />
      <canvas
        id='1'
        className={displayingCanvasIndex === 1 ? classes.showCanvas : classes.hideCanvas}
        width={photoCollageRuntimeConfiguration.collageWidth.toString()}
        height={photoCollageRuntimeConfiguration.collageHeight.toString()}
        ref={setCanvasRef}
      />
    </div>
  );
};

function mapStateToProps(state: PhotoCollageState): Partial<PhotoCollageCanvasProps> {
  const displayingCanvasIndex: number = getDisplayingCanvasIndex(state);
  const fetchingCanvasIndex: number = getFetchingCanvasIndex(state);

  return {
    displayingCanvasIndex,
    fetchingCanvasIndex,
    fullScreenDisplay: getFullScreenDisplay(state),
    photoCollection: getPhotoCollection(state),
    photoCollageSpec: getActivePhotoCollageSpec(state),
    photos: getPhotos(state, fetchingCanvasIndex),
    displayedPhotos: getPhotos(state, displayingCanvasIndex),
    selectedPhotoIndex: getSelectedPhotoIndex(state),
    selectionRectangle: getSelectionRectangle(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onStartPlaybackFirstTime: startPlaybackFirstTime,
    onSetRenderedPhotoRect: setRenderedPhotoRect,
    onSetSelectionRectangle: setSelectionRectangle,
  }, dispatch);
};

const photosAreEqual = (prevPhotos: Photo[] | null, nextPhotos: Photo[] | null): boolean => {
  if (isNil(prevPhotos)) {
    if (isNil(nextPhotos)) {
      return true;
    }
    else {
      return false;
    }
  } else if (isNil(nextPhotos)) {
    return false;
  }
  const prevRealPhotos = prevPhotos as Photo[];
  const nextRealPhotos = nextPhotos as Photo[];
  if (prevRealPhotos.length !== nextRealPhotos.length) {
    return false;
  }
  for (let i = 0; i < prevRealPhotos.length; i++) {
    if (prevRealPhotos[i].id !== nextRealPhotos[i].id) {
      return false;
    }
  }
  return true;
};

const propsAreEqual = (prevProps: PhotoCollageCanvasProps, nextProps: PhotoCollageCanvasProps) => {
  let propsAreEqual: boolean = true;
  propsAreEqual = propsAreEqual &&
    prevProps.displayingCanvasIndex === nextProps.displayingCanvasIndex;
  propsAreEqual = propsAreEqual &&
    prevProps.fetchingCanvasIndex === nextProps.fetchingCanvasIndex;
  propsAreEqual = propsAreEqual &&
    prevProps.selectedPhotoIndex === nextProps.selectedPhotoIndex;
  propsAreEqual = propsAreEqual &&
    prevProps.fullScreenDisplay === nextProps.fullScreenDisplay;
  const photosAreIdentical = photosAreEqual(prevProps.photos, nextProps.photos);
  propsAreEqual = propsAreEqual && photosAreIdentical;
  return propsAreEqual;
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PhotoCollageCanvas, propsAreEqual));
