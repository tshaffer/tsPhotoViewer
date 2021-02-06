import {
  isNil,
} from 'lodash';

import * as fs from 'fs';

import {
  CollageSpec,
  PhotoCollageState,
  PhotoInCollection,
  Photo
} from '../type';
import {
  startPhotoPlayback,
  stopPhotoPlayback,
  setCollagePhotos,
  setFetchingCanvasIndex,
  setDisplayingCanvasIndex,
  setCanvasIndices,
  enterFullScreenDisplay,
  exitFullScreenDisplay,
} from '../model';
import {
  getTimeBetweenUpdates,
  getActivePhotoCollageSpec,
  getPhotosRootDirectory,
  getPhotoCollection,
  getDisplayingCanvasIndex,
  getSelectedPhotoIndex,
} from '../selector';
import {
  getFilePathFromPhotoInCollection,
  getRelativeFilePathFromPhotoInCollection
} from '../utility';

let playbackTimer: ReturnType<typeof setTimeout>;

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getRandomPhoto = (state: PhotoCollageState, landscape: boolean): Photo => {

  const photoCollection = getPhotoCollection(state);
  const photosInCollection: PhotoInCollection[] = photoCollection.photosInCollection!;

  const numPhotos = photosInCollection.length;

  for (; ;) {
    const randomInt = getRandomInt(numPhotos);
    const photoInCollection: PhotoInCollection = photosInCollection[randomInt];
    if (!isNil(photoInCollection.height)) {
      const landscapeOrientation: boolean = photoInCollection.width! >= photoInCollection.height;
      if (landscape === landscapeOrientation) {
        const filePath: string = getFilePathFromPhotoInCollection(getPhotosRootDirectory(state), photoInCollection);
        if (fs.existsSync(filePath)) {
          const photo: Photo = {
            ...photoInCollection,
            filePath
          };
          return photo;
        }
      }
    }
  }
};

const getCollagePhotos = (state: PhotoCollageState): Photo[] => {

  const photosInCollage: Photo[] = [];

  const photoCollageSpec: CollageSpec | null = getActivePhotoCollageSpec(state);
  if (!isNil(photoCollageSpec)) {
    const { collageItemSpecs: photosInCollageSpecs } = photoCollageSpec;
    for (const photosInCollageSpec of photosInCollageSpecs) {
      const { width, height } = photosInCollageSpec;
      const photo: Photo = getRandomPhoto(state, width >= height);
      photo.relativeFilePath = getRelativeFilePathFromPhotoInCollection(getPhotosRootDirectory(state), photo);
      // TEDTODO - is the clone required?
      // const populatedPhotoInCollage: CollageItemSpec = cloneDeep(photosInCollageSpec);
      // populatedPhotoInCollage.fileName = photo.fileName;
      // populatedPhotoInCollage.filePath = relativeFilePath;

      // test - fixes bug where playback on device failed.
      photo.filePath = photo.relativeFilePath;

      photosInCollage.push(photo);
    }
  }

  return photosInCollage;
};

export const retrieveCollagePhotos = (canvasIndex: number) => {
  return ((dispatch: any, getState: any) => {
    const photosInCollage: Photo[] = getCollagePhotos(getState());
    dispatch(setCollagePhotos(canvasIndex, photosInCollage));
  });
};

export const startPlaybackFirstTime = () => {
  return ((dispatch: any, getState: any): any => {

    // ensure that nothing is displayed until data is loaded
    dispatch(setDisplayingCanvasIndex(-1));

    // retrieve and display 1st canvas
    dispatch(setFetchingCanvasIndex(0));
    dispatch(retrieveCollagePhotos(0));
    dispatch(setDisplayingCanvasIndex(0));

    // retrieve data for 2nd canvas
    dispatch(setFetchingCanvasIndex(1));
    dispatch(retrieveCollagePhotos(1));

    dispatch(startPhotoPlayback());
    const photoCollageState: PhotoCollageState = getState();

    // start timer
    playbackTimer = setInterval(playbackTimeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch, getState);
  });
};

const playbackTimeoutHandler = (dispatch: any, getState: any) => {
  
  // swap displayed canvas; start fetching data for the next set
  const state: PhotoCollageState = getState();
  const currentDisplayingCanvasIndex: number = getDisplayingCanvasIndex(state);
  const nextDisplayingCanvasIndex: number = currentDisplayingCanvasIndex == 0 ? 1 : 0;
  const nextFetchingCanvasIndex: number = currentDisplayingCanvasIndex == 0 ? 0 : 1; 

  // console.log('invoke setCanvasIndices');
  dispatch(setCanvasIndices(nextFetchingCanvasIndex, nextDisplayingCanvasIndex));
  // console.log('return from setCanvasIndices, invoke retrieveCollagePhotos');
  dispatch(retrieveCollagePhotos(nextFetchingCanvasIndex));
  // console.log('return from retrieveCollagePhotos');
};

export const resumePlayback = () => {
  return ((dispatch: any, getState: any): any => {
    dispatch(startPhotoPlayback());
    playbackTimer = setInterval(playbackTimeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch, getState);
  });
};


// export const startPlayback = () => {
//   return ((dispatch: any, getState: any): any => {
//     dispatch(startPhotoPlayback());
//     // dispatch(getNextCollagePhotos());
//     playbackTimer = setInterval(timeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch);
//   });
// };

// export const restartPlayback = () => {
//   return ((dispatch: any, getState: any): any => {
//     dispatch(startPhotoPlayback());
//     playbackTimer = setInterval(timeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch);
//   });
// };

export const stopPlayback = () => {
  return ((dispatch: any, getState: any): any => {
    dispatch(stopPhotoPlayback());
    if (!isNil(playbackTimer)) {
      clearInterval(playbackTimer);
    }
  });
};

// TODO - naming consistency
// TODO - this function is unnecessary I think - just call model directly
export const enterFullScreenPlayback = () => {
  return ((dispatch: any, getState: any): any => {

    const selectedPhotoIndex: number = getSelectedPhotoIndex(getState());
    if (selectedPhotoIndex < 0) {
      return;
    }
    dispatch(enterFullScreenDisplay());
  });
};

// // TODO - naming consistency
export const exitFullScreenPlayback = () => {
  return ((dispatch: any, getState: any): any => {
    dispatch(exitFullScreenDisplay());
  });
};
