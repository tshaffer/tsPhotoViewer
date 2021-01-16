import {
  // cloneDeep,
  isNil,
} from 'lodash';

import * as fs from 'fs';

import {
  CollageSpec,
  PhotoCollageState,
  // CollageItemSpec,
  PhotoInCollection,
  Photo
} from '../type';
// import {
//   setActivePopulatedPhotoCollage,
//   setPhotoCollageSpec as setPhotoCollageUniqueId,
//   startPhotoPlayback,
//   stopPhotoPlayback,
//   enterFullScreenDisplay,
//   exitFullScreenDisplay,
//   setPriorPopulatedPhotoCollage,
// } from '../model';
import {
  getTimeBetweenUpdates,
  getActivePhotoCollageSpec,
  getPhotosRootDirectory,
  getPhotoCollection,
  // getPhotosInCollage,
} from '../selector';
import {
  getFilePathFromPhotoInCollection,
  getRelativeFilePathFromPhotoInCollection
} from '../utility';

let playbackTimer: any = null;

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

// const getCollagePhoto = (state: PhotoCollageState, landscape: boolean): PhotoInCollection => {

//   const photoCollection = getPhotoCollection(state);
//   const photosInCollection: PhotoInCollection[] = photoCollection.photosInCollection!;

//   const numPhotos = photosInCollection.length;

//   for (; ;) {
//     const randomInt = getRandomInt(numPhotos);
//     const photoInCollection: PhotoInCollection = photosInCollection[randomInt];
//     if (!isNil(photoInCollection.height)) {
//       const landscapeOrientation: boolean = photoInCollection.width! >= photoInCollection.height;
//       if (landscape === landscapeOrientation) {
//         const filePath: string = getFilePathFromPhotoInCollection(getPhotosRootDirectory(state), photoInCollection);
//         if (fs.existsSync(filePath)) {
//           return photoInCollection;
//         }
//       }
//     }
//   }
// };

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
      photosInCollage.push(photo);
    }
  }

  return photosInCollage;
};


// const getCollagePhotos = (state: PhotoCollageState): CollageItemSpec[] => {

//   const photosInCollage: CollageItemSpec[] = [];

//   const photoCollageSpec: CollageSpec | null = getActivePhotoCollageSpec(state);
//   if (!isNil(photoCollageSpec)) {
//     const { collageItemSpecs } = photoCollageSpec;
//     for (const photosInCollageSpec of collageItemSpecs) {
//       const { width, height } = photosInCollageSpec;
//       const photoInCollection: PhotoInCollection = getCollagePhoto(state, width >= height);
//       const filePath: string = getRelativeFilePathFromPhotoInCollection(getPhotosRootDirectory(state), photoInCollection);

//       const populatedPhotoInCollage: CollageItemSpec = cloneDeep(photosInCollageSpec);
//       populatedPhotoInCollage.fileName = photoInCollection.fileName;
//       populatedPhotoInCollage.filePath = filePath;
//       photosInCollage.push(populatedPhotoInCollage);
//     }
//   }

//   return photosInCollage;
// };

// const getNextCollagePhotos = () => {

//   return ((dispatch: any, getState: any) => {

//     // before getting next set of photos, save current set of photos
//     const photoCollageSpec: CollageSpec | null = getActivePhotoCollageSpec(getState());
//     if (!isNil(photoCollageSpec)) {
//       const photosInCollageSpec: CollageItemSpec[] = getPhotosInCollage(getState());
//       dispatch(setPriorPopulatedPhotoCollage(photosInCollageSpec));
//     }

//     const photosInCollage: CollageItemSpec[] = getCollagePhotos(getState());
//     dispatch(setPopulatedPhotoCollage(photosInCollage));
//   });
// };

// export const retrieveCollagePhotos = (canvasIndex: number) => {
export const retrieveCollagePhotos = () => {
  return ((dispatch: any, getState: any) => {
    const photosInCollage: Photo[] = getCollagePhotos(getState());
    // dispatch(setCollagePhotos(canvasIndex, photosInCollage));
  });
};


// export const setPopulatedPhotoCollage = (photosInCollage: CollageItemSpec[]) => {
//   return ((dispatch: any, getState: any) => {
//     dispatch(setActivePopulatedPhotoCollage(photosInCollage));
//     const filePaths: string[] = photosInCollage.map((photoInCollage) => {
//       return photoInCollage.filePath!;
//     });
//     const photosInCollageUniqueId = filePaths.join('|');
//     dispatch(setPhotoCollageUniqueId(photosInCollageUniqueId));
//   });
// };

const timeoutHandler = (dispatch: any) => {
  // dispatch(getNextCollagePhotos());
  // dispatch(retrieveCollagePhotos(nextFetchingCanvasIndex));
  dispatch(retrieveCollagePhotos());
};

export const startPlaybackFirstTime = () => {
  return ((dispatch: any, getState: any): any => {

    dispatch(retrieveCollagePhotos());

    // // ensure that nothing is displayed until data is loaded
    // dispatch(setDisplayingCanvasIndex(-1));

    // // retrieve and display 1st canvas
    // dispatch(setFetchingCanvasIndex(0));
    // dispatch(retrieveCollagePhotos(0));
    // dispatch(setDisplayingCanvasIndex(0));

    // // retrieve data for 2nd canvas
    // dispatch(setFetchingCanvasIndex(1));
    // dispatch(retrieveCollagePhotos(1));

    // start timer
    // playbackTimer = setInterval(playbackTimeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch, getState);
    playbackTimer = setInterval(timeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch, getState);
  });
};


// const playbackTimeoutHandler = (dispatch: any, getState: any) => {
  
//   // swap displayed canvas; start fetching data for the next set
//   const state: PhotoCollageState = getState();
//   const currentDisplayingCanvasIndex: number = getDisplayingCanvasIndex(state);
//   const nextDisplayingCanvasIndex: number = currentDisplayingCanvasIndex == 0 ? 1 : 0;
//   const nextFetchingCanvasIndex: number = currentDisplayingCanvasIndex == 0 ? 0 : 1; 

//   dispatch(setDisplayingCanvasIndex(nextDisplayingCanvasIndex));
//   dispatch(setFetchingCanvasIndex(nextFetchingCanvasIndex));
//   dispatch(retrieveCollagePhotos(nextFetchingCanvasIndex));
// };

// export const startPlayback = () => {
//   return ((dispatch: any, getState: any): any => {
//     dispatch(startPhotoPlayback());
//     dispatch(getNextCollagePhotos());
//     playbackTimer = setInterval(timeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch);
//   });
// };

// export const restartPlayback = () => {
//   return ((dispatch: any, getState: any): any => {
//     dispatch(startPhotoPlayback());
//     playbackTimer = setInterval(timeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch);
//   });
// };

// export const stopPlayback = () => {
//   return ((dispatch: any, getState: any): any => {
//     dispatch(stopPhotoPlayback());
//     if (!isNil(playbackTimer)) {
//       clearInterval(playbackTimer);
//     }
//   });
// };

// TODO - naming consistency
// TODO - this function is unnecessary I think - just call model directly
// export const enterFullScreenPlayback = () => {
//   return ((dispatch: any, getState: any): any => {
//     dispatch(enterFullScreenDisplay());
//   });
// };

// TODO - naming consistency
// export const exitFullScreenPlayback = () => {
//   return ((dispatch: any, getState: any): any => {
//     dispatch(exitFullScreenDisplay());
//   });
// };
