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
} from '../type';
import {
  // enterFullScreenPlayback,
  // startPlayback,
  startPlaybackFirstTime,
  // stopPlayback,
} from '../controller';

import {
  getFullScreenDisplay,
  getActivePhotoCollageSpec,
  getPhotoCollection,
  getSelectedPhotoIndex,
  // getSelectedDisplayedPhoto,
  getDisplayingCanvasIndex,
  getFetchingCanvasIndex,
  getPhotos,
  getSelectionRectangle,
} from '../selector';
import {
  // setSelectedDisplayedPhoto
  setSelectionRectangle,
} from '../model';

let uncachedPhotosInCollage: Photo[] = [];

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
export interface PhotoCollageCanvasComponentState {
  // selectedPhoto: DisplayedPhoto | null;
}

/** @internal */
/** @private */
// export interface PhotoCollageCanvasProps extends PhotoCollageCanvasPropsFromParent {
export interface PhotoCollageCanvasProps {
  displayingCanvasIndex: number;
  fetchingCanvasIndex: number;
  selectedPhotoIndex: number;
  selectionRectangle: TsRect | null,
  fullScreenDisplay: boolean;
  // selectedDisplayPhoto: DisplayedPhoto | null;
  photoCollection: PhotoCollection;
  photoCollageSpec: CollageSpec | null;
  photos: Photo[] | null;
  onStartPlayback: () => any;
  onStartPlaybackFirstTime: () => any;
  onStopPlayback: () => any;
  // onSetSelectedDisplayedPhoto: (selectedDisplayPhoto: DisplayedPhoto | null) => any;
  onEnterFullScreenPlayback: () => any;
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

let photoImages: DisplayedPhoto[] = [];

// let doubleClickTimer: ReturnType<typeof setTimeout>;

const PhotoCollageCanvas = (props: PhotoCollageCanvasProps) => {

  const classes = useStyles();

  // Equivalent to old componentDidMount
  React.useEffect(props.onStartPlaybackFirstTime, []);

  // const getPhotoAtLocation = (pageX: any, pageY: any): DisplayedPhoto | null => {

  //   const elem = canvasRefs[props.displayingCanvasIndex];
  //   if (isNil(elem)) {
  //     return null;
  //   }

  //   const elemLeft = elem.offsetLeft + elem.clientLeft;
  //   const elemTop = elem.offsetTop + elem.clientTop;

  //   const x = pageX - elemLeft;
  //   const y = pageY - elemTop;

  //   let selectedPhotoImage: DisplayedPhoto | null = null;

  //   for (const photoImage of photoImages) {
  //     if (y > photoImage.y && y < photoImage.y + photoImage.height
  //       && x > photoImage.x && x < photoImage.x + photoImage.width) {
  //       selectedPhotoImage = photoImage;
  //       break;
  //     }
  //   }

  //   return selectedPhotoImage;
  // };

  // const handleSingleClick = (event: any) => {
  //   const selectedPhoto: DisplayedPhoto | null = getPhotoAtLocation(event.pageX, event.pageY);
  //   console.log('handleSingleClick, selectedPhoto is:');
  //   console.log(selectedPhoto);
  // };

  // const handleDoubleClick = (event: any) => {
  //   const selectedPhoto: DisplayedPhoto | null = getPhotoAtLocation(event.pageX, event.pageY);
  //   console.log('handleDoubleClick, selectedPhoto is:');
  //   console.log(selectedPhoto);

  //   if (!isNil(selectedPhoto)) {
  //     props.onStopPlayback();
  //   }
  //   props.onSetSelectedDisplayedPhoto(selectedPhoto);
  //   props.onEnterFullScreenPlayback();
  // };

  // const handleClick = (event: any) => {
  //   clearTimeout(doubleClickTimer);
  //   if (event.detail === 1) {
  //     doubleClickTimer = setTimeout(() => {
  //       console.log('SINGLE CLICK');
  //       handleSingleClick(event);
  //     }, 200);

  //   } else if (event.detail === 2) {
  //     console.log('DOUBLE CLICK');
  //     handleDoubleClick(event);
  //   }
  // };

  const setCanvasRef = (element: HTMLCanvasElement) => {
    if (!isNil(element)) {
      const canvasIndex = parseInt(element.id, 10);
      canvasRefs[canvasIndex] = element;
      canvasContexts[canvasIndex] = element.getContext('2d');
    }
  };

  const renderPhoto = (
    filePath: string,
    drawBorder: boolean,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {

    if (isNil(props.photos)) {
      return;
    }

    if (uncachedPhotosInCollage.length === 0 || props.photos[0].filePath! !== uncachedPhotosInCollage[0].filePath!) {
      uncachedPhotosInCollage = cloneDeep(props.photos);
    }

    const fetchingCanvasIndex = props.fetchingCanvasIndex;

    const photo: HTMLImageElement = new Image();
    photo.id = filePath;
    photo.onload = () => {

      const filePathsInCollage: string[] = uncachedPhotosInCollage.map((photoInCollage) => {
        return isNil(photoInCollage.filePath) ? '' : photoInCollage.filePath;
      });

      const filePathWithoutUrlScheme: string = photo.id.substring(8);

      if (filePathsInCollage.indexOf(filePathWithoutUrlScheme) >= 0) {
        scaleAndDrawImage(fetchingCanvasIndex, photo, drawBorder, x, y, width, height);
      }
    };
    photo.src = filePath;
  };

  const scaleAndDrawImage = (
    fetchingCanvasIndex: number,
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
    if (!isNil(canvasContexts[fetchingCanvasIndex])) {
      const displayingCanvasContext = canvasContexts[fetchingCanvasIndex] as CanvasRenderingContext2D;
      if (props.fetchingCanvasIndex !== fetchingCanvasIndex) {
        debugger;
      }
      const imageX = x + xOnCanvas;
      const imageY = y + yOnCanvas;
      const imageWidth = photo.width * scale;
      const imageHeight = photo.height * scale;
      displayingCanvasContext.drawImage(photo, imageX, imageY, imageWidth, imageHeight);

      if (imageSelected) {

        console.log('drawImage: ', imageX, imageY, imageWidth, imageHeight);
        console.log(scale, photo.width, photo.height);
  
        const xStart = imageX - 2;
        const yStart = imageY - 2;
        const width = imageWidth + 4;
        const height = imageHeight + 4;
        const imageRect: TsRect = {
          x: xStart,
          y: yStart,
          width,
          height
        };
        drawSelectionRectangle(true, imageRect);

        props.onSetSelectionRectangle(imageRect);
      }
    }
  };

  const drawSelectionRectangle = (draw: boolean, selectionRectangle: TsRect): void => {

    // console.log('drawSelectionRectangle');
    // console.log(draw);
    // console.log(selectionRectangle);

    const { x, y, width, height } = selectionRectangle;
    let strokeStyle: string;
    if (draw) {
      strokeStyle = 'red';
    } else {
      strokeStyle = 'white';
    }

    for (let canvasIndex = 0; canvasIndex < 2; canvasIndex++) {
      const context = canvasContexts[canvasIndex] as CanvasRenderingContext2D;
      context.beginPath();
      context.rect(x, y, width, height);
      context.strokeStyle = strokeStyle;
      context.stroke();
    }
  };

  const getScaledCoordinates = (x: number, y: number, width: number, height: number, collageWidth: number, collageHeight: number, totalCollageWidth: number, totalCollageHeight: number): any => {

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

    if (isNil(props.photos)) {
      return;
    }

    // erase old selection
    const selectionRectangle: TsRect | null = props.selectionRectangle;
    if (!isNil(selectionRectangle)) {
      drawSelectionRectangle(false, selectionRectangle);
    }

    const photosInCollage: Photo[] = props.photos;
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

        // console.log('index:', index);
        // console.log(photoInCollage);
        // console.log(screenCoordinates);

        photoImages.push({
          x: screenCoordinates.x,
          y: screenCoordinates.y,
          ...photoInCollage,
        });

        renderPhoto(
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

  // const renderFullScreenPhoto = () => {

  //   const selectedPhoto: DisplayedPhoto | null = props.selectedDisplayPhoto;
  //   if (isNil(selectedPhoto)) {
  //     return;
  //   }

  //   const photoSpec: PhotoInCollageSpec = selectedPhoto.photoSpec;
  //   if (isNil(photoSpec.filePath)) {
  //     return;
  //   }

  //   const filePath = photoSpec.filePath;

  //   const screenCoordinates = getScaledCoordinates(0, 0, photoCollageConfig.collageWidth, photoCollageConfig.collageHeight, photoCollageConfig.collageWidth, photoCollageConfig.collageHeight, photoCollageConfig.collageWidth, photoCollageConfig.collageHeight);

  //   photoImages.push({
  //     x: 0,
  //     y: 0,
  //     width: screenCoordinates.width,
  //     height: screenCoordinates.height,
  //     photoSpec,
  //   });

  //   renderPhoto(
  //     'file:///' + filePath,
  //     screenCoordinates.x,
  //     screenCoordinates.y,
  //     screenCoordinates.width,
  //     screenCoordinates.height);
  // };

  const renderPhotoCollage = () => {

    if (isNil(props.photoCollageSpec) ||
      isNil(props.photoCollection) ||
      isNil(props.photoCollection!.photosInCollection) ||
      props.photoCollection.photosInCollection.length === 0) {
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
      if (!isNil(canvasContext)) {
        displayingCanvasContext.imageSmoothingEnabled = false;
        canvasContext.imageSmoothingEnabled = false;
        // TEDTODO - I never understood this
        if (props.displayingCanvasIndex !== props.fetchingCanvasIndex) {
          canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
        }
        if (props.fullScreenDisplay) {
          console.log('renderFullScreenPhoto');
          // renderFullScreenPhoto();
        } else {
          renderPhotoCollage();
        }
      }
    }
  }

  /*
      onClick={handleClick}
  */

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
  // console.log('PhotoCollageCanvas.tsx#mapStateToProps');
  const displayingCanvasIndex: number = getDisplayingCanvasIndex(state);
  const fetchingCanvasIndex: number = getFetchingCanvasIndex(state);
  return {
    displayingCanvasIndex,
    fetchingCanvasIndex,
    fullScreenDisplay: getFullScreenDisplay(state),
    photoCollection: getPhotoCollection(state),
    photoCollageSpec: getActivePhotoCollageSpec(state),
    photos: getPhotos(state, fetchingCanvasIndex),
    selectedPhotoIndex: getSelectedPhotoIndex(state),
    selectionRectangle: getSelectionRectangle(state),
    // selectedDisplayPhoto: getSelectedDisplayedPhoto(state),
    // onSelectPhoto: ownProps.onSelectPhoto,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    // onStartPlayback: startPlayback,
    onStartPlaybackFirstTime: startPlaybackFirstTime,
    onSetSelectionRectangle: setSelectionRectangle,
    // onStopPlayback: stopPlayback,
    // onSetSelectedDisplayedPhoto: setSelectedDisplayedPhoto,
    // onEnterFullScreenPlayback: enterFullScreenPlayback,
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
  const photosAreIdentical = photosAreEqual(prevProps.photos, nextProps.photos);
  propsAreEqual = propsAreEqual && photosAreIdentical;
  return propsAreEqual;
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PhotoCollageCanvas, propsAreEqual));
