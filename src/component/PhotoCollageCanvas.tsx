import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cloneDeep, isNil } from 'lodash';

import { photoCollageRuntimeConfiguration } from '../config';

import {
  PhotoCollageState,
  CollageSpec,
  PhotoCollection,
  DisplayedPhoto,
  CollageItemSpec,
  Photo,
} from '../type';
// import {
//   enterFullScreenPlayback,
//   startPlayback,
//   stopPlayback,
// } from '../controller';

import {
  getFullScreenDisplay,
  getActivePhotoCollageSpec,
  getPhotoCollection,
  // getPhotosInCollage,
  // getSelectedDisplayedPhoto,
  // getPriorPhotosInCollage,
  getPhotos,
} from '../selector';
// import {
//   setSelectedDisplayedPhoto
// } from '../model';

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
  selectedPhoto: DisplayedPhoto | null;
}

/** @internal */
/** @private */
// export interface PhotoCollageCanvasProps extends PhotoCollageCanvasPropsFromParent {
export interface PhotoCollageCanvasProps {
  fullScreenDisplay: boolean;
  // selectedDisplayPhoto: DisplayedPhoto | null;
  photoCollection: PhotoCollection;
  photoCollageSpec: CollageSpec | null;
  photos: Photo[] | null;
  // photosInCollage: CollageItemSpec[];
  priorPhotosInCollage: CollageItemSpec[];
  onStartPlayback: () => any;
  onStopPlayback: () => any;
  // onSetSelectedDisplayedPhoto: (selectedDisplayPhoto: DisplayedPhoto | null) => any;
  onEnterFullScreenPlayback: () => any;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

let canvasRef: any = null;
let ctx: any = null;
let photoImages: DisplayedPhoto[] = [];

let doubleClickTimer: ReturnType<typeof setTimeout>;

const PhotoCollageCanvas = (props: PhotoCollageCanvasProps) => {

  // Equivalent to old componentDidMount
  React.useEffect(props.onStartPlayback, []);

  // const getPhotoAtLocation = (pageX: any, pageY: any): DisplayedPhoto | null => {

  //   const elem = canvasRef;
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

  const setCanvasRef = (element: any) => {
    if (!isNil(element)) {
      canvasRef = element;
      ctx = element.getContext('2d');
    }
  };

  const renderPhoto = (filePath: string, x: number, y: number, width: number, height: number) => {

    if (isNil(props.photos)) {
      return;
    }

    if (uncachedPhotosInCollage.length === 0 || props.photos[0].filePath! !== uncachedPhotosInCollage[0].filePath!) {
      uncachedPhotosInCollage = cloneDeep(props.photos);
    }

    const photo: HTMLImageElement = new Image();
    photo.id = filePath;
    photo.onload = () => {
      const filePathsInCollage: string[] = uncachedPhotosInCollage.map((photoInCollage) => {
        return isNil(photoInCollage.filePath) ? '' : photoInCollage.filePath;
      });
      // TEDTODO - may not work for BrightSign
      const filePathWithoutUrlScheme: string = photo.id.substring(8);
      if (filePathsInCollage.indexOf(filePathWithoutUrlScheme) >= 0) {
        scaleToFit(photo, x, y, width, height);
      }
    };
    photo.src = filePath;
  };

  const scaleToFit = (photo: HTMLImageElement, xOnCanvas: number, yOnCanvas: number, widthOnCanvas: number, heightOnCanvas: number) => {
    const scale = Math.min(widthOnCanvas / photo.width, heightOnCanvas / photo.height);
    const x = (widthOnCanvas / 2) - (photo.width / 2) * scale;
    const y = (heightOnCanvas / 2) - (photo.height / 2) * scale;
    ctx.drawImage(photo, x + xOnCanvas, y + yOnCanvas, photo.width * scale, photo.height * scale);
  };

  const getScaledCoordinates = (x: number, y: number, width: number, height: number, collageWidth: number, collageHeight: number, totalCollageWidth: number, totalCollageHeight: number): any => {
    const screenX = (x / collageWidth) * totalCollageWidth;
    const screenY = (y / collageHeight) * totalCollageHeight;
    return {
      x: screenX,
      y: screenY,
      width: (width / collageWidth) * totalCollageWidth,
      height: (height / collageHeight) * totalCollageHeight,
    };
  };

  // const handleClick = (e: any) => {

  //   const elem = canvasRef;
  //   const elemLeft = elem.offsetLeft + elem.clientLeft;
  //   const elemTop = elem.offsetTop + elem.clientTop;

  //   const x = e.pageX - elemLeft;
  //   const y = e.pageY - elemTop;

  //   for (const photoImage of photoImages) {
  //     if (y > photoImage.y && y < photoImage.y + photoImage.height
  //       && x > photoImage.x && x < photoImage.x + photoImage.width) {
  //       props.onStopPlayback();
  //       props.onSelectPhoto(photoImage);
  //       return;
  //     }
  //   }
  // };

  const renderPhotosInCollage = () => {

    if (isNil(props.photos)) {
      return;
    }

    const photosInCollage: Photo[] = props.photos;

    // const photosInCollage: CollageItemSpec[] = props.photosInCollage;
    if (photosInCollage.length === 0) {
      return;
    }

    photoImages = [];
    // const { collageWidth, collageHeight, collageItemSpecs } = props.photoCollageSpec!;
    const { collageWidth, collageHeight, collageItemSpecs } = props.photoCollageSpec!;
    let index = 0;
    for (const collageItemSpec of collageItemSpecs) {
      const { x, y, width, height } = collageItemSpec;
      // for (const photosInCollageSpec of photosInCollageSpecs) {
      //   const { x, y, width, height } = photosInCollageSpec;

      if (!isNil(photosInCollage[index].filePath)) {
        const filePath = photosInCollage[index].filePath!;

        const screenCoordinates = getScaledCoordinates(x, y, width, height, collageWidth, collageHeight, photoCollageRuntimeConfiguration.collageWidth, photoCollageRuntimeConfiguration.collageHeight);

        // const screenCoordinates = getScaledCoordinates(x, y, width, height, collageWidth, collageHeight, photoCollageRuntimeConfiguration.collageWidth, photoCollageRuntimeConfiguration.collageHeight);

        photoImages.push({
          x: screenCoordinates.x,
          y: screenCoordinates.y,
          ...photosInCollage[index],
          // width: screenCoordinates.width,
          // height: screenCoordinates.height,
          // photoSpec: photosInCollage[index],
        });

        renderPhoto(
          'file:///' + filePath,
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

  //   const photoSpec: CollageItemSpec = selectedPhoto.photoSpec;
  //   if (isNil(photoSpec.filePath)) {
  //     return;
  //   }

  //   const filePath = photoSpec.filePath;

  //   const screenCoordinates = getScaledCoordinates(0, 0, photoCollageRuntimeConfiguration.collageWidth, photoCollageRuntimeConfiguration.collageHeight, photoCollageRuntimeConfiguration.collageWidth, photoCollageRuntimeConfiguration.collageHeight, photoCollageRuntimeConfiguration.collageWidth, photoCollageRuntimeConfiguration.collageHeight);

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

  if (!isNil(canvasRef) && !isNil(ctx)) {
    const context = ctx;
    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, canvasRef.width, canvasRef.height);
    if (props.fullScreenDisplay) {
      // renderFullScreenPhoto();
    } else {
      renderPhotoCollage();
    }
  }

  /*
      <div
        onClick={handleClick}
      >
  */
  return (
    <div>
      <canvas
        id='collageCanvas'
        width={photoCollageRuntimeConfiguration.collageWidth.toString()}
        height={photoCollageRuntimeConfiguration.collageHeight.toString()}
        ref={setCanvasRef}
      />
    </div >
  );
};

// function mapStateToProps(state: PhotoCollageState, ownProps: PhotoCollageCanvasPropsFromParent): Partial<PhotoCollageCanvasProps> {
function mapStateToProps(state: PhotoCollageState): Partial<PhotoCollageCanvasProps> {
  return {
    fullScreenDisplay: getFullScreenDisplay(state),
    photoCollection: getPhotoCollection(state),
    photoCollageSpec: getActivePhotoCollageSpec(state),
    photos: getPhotos(state, 0),
    // photos: getPhotos(state, fetchingCanvasIndex),
    // photos: [],
    // photosInCollage: getPhotosInCollage(state),
    // priorPhotosInCollage: getPriorPhotosInCollage(state),
    // selectedDisplayPhoto: getSelectedDisplayedPhoto(state),
    // onSelectPhoto: ownProps.onSelectPhoto,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    // onStartPlayback: startPlayback,
    // onStopPlayback: stopPlayback,
    // onSetSelectedDisplayedPhoto: setSelectedDisplayedPhoto,
    // onEnterFullScreenPlayback: enterFullScreenPlayback,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCollageCanvas);
