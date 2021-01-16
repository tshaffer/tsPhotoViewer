import {
  cloneDeep,
  isNil,
} from 'lodash';

import * as fs from 'fs';

import {
  CollageSpec,
  PhotoCollageState,
  CollageItemSpec,
  PhotoInCollection
} from '../type';
import {
  setActivePopulatedPhotoCollage,
  setPhotoCollageSpec as setPhotoCollageUniqueId,
  startPhotoPlayback,
  stopPhotoPlayback,
  enterFullScreenDisplay,
  exitFullScreenDisplay,
  setPriorPopulatedPhotoCollage,
} from '../model';
import {
  getTimeBetweenUpdates,
  getActivePhotoCollageSpec,
  getPhotosRootDirectory,
  getPhotoCollection,
  getPhotosInCollage,
} from '../selector';
import {
  getFilePathFromPhotoInCollection,
  getRelativeFilePathFromPhotoInCollection
} from '../utility';

let playbackTimer: any = null;

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getCollagePhoto = (state: PhotoCollageState, landscape: boolean): PhotoInCollection => {

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
          return photoInCollection;
        }
      }
    }
  }
};

const getCollagePhotos = (state: PhotoCollageState): CollageItemSpec[] => {

  const photosInCollage: CollageItemSpec[] = [];

  const photoCollageSpec: CollageSpec | null = getActivePhotoCollageSpec(state);
  if (!isNil(photoCollageSpec)) {
    const { collageItemSpecs } = photoCollageSpec;
    for (const photosInCollageSpec of collageItemSpecs) {
      const { width, height } = photosInCollageSpec;
      const photoInCollection: PhotoInCollection = getCollagePhoto(state, width >= height);
      const filePath: string = getRelativeFilePathFromPhotoInCollection(getPhotosRootDirectory(state), photoInCollection);

      const populatedPhotoInCollage: CollageItemSpec = cloneDeep(photosInCollageSpec);
      populatedPhotoInCollage.fileName = photoInCollection.fileName;
      populatedPhotoInCollage.filePath = filePath;
      photosInCollage.push(populatedPhotoInCollage);
    }
  }

  return photosInCollage;
};

const getNextCollagePhotos = () => {

  return ((dispatch: any, getState: any) => {

    // before getting next set of photos, save current set of photos
    const photoCollageSpec: CollageSpec | null = getActivePhotoCollageSpec(getState());
    if (!isNil(photoCollageSpec)) {
      const photosInCollageSpec: CollageItemSpec[] = getPhotosInCollage(getState());
      dispatch(setPriorPopulatedPhotoCollage(photosInCollageSpec));
    }

    const photosInCollage: CollageItemSpec[] = getCollagePhotos(getState());
    dispatch(setPopulatedPhotoCollage(photosInCollage));
  });
};

export const setPopulatedPhotoCollage = (photosInCollage: CollageItemSpec[]) => {
  return ((dispatch: any, getState: any) => {
    dispatch(setActivePopulatedPhotoCollage(photosInCollage));
    const filePaths: string[] = photosInCollage.map((photoInCollage) => {
      return photoInCollage.filePath!;
    });
    const photosInCollageUniqueId = filePaths.join('|');
    dispatch(setPhotoCollageUniqueId(photosInCollageUniqueId));
  });
};

const timeoutHandler = (dispatch: any) => {
  dispatch(getNextCollagePhotos());
};

export const startPlayback = () => {
  return ((dispatch: any, getState: any): any => {
    dispatch(startPhotoPlayback());
    dispatch(getNextCollagePhotos());
    playbackTimer = setInterval(timeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch);
  });
};

export const restartPlayback = () => {
  return ((dispatch: any, getState: any): any => {
    dispatch(startPhotoPlayback());
    playbackTimer = setInterval(timeoutHandler, getTimeBetweenUpdates(getState()) * 1000, dispatch);
  });
};

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
    dispatch(enterFullScreenDisplay());
  });
};

// TODO - naming consistency
export const exitFullScreenPlayback = () => {
  return ((dispatch: any, getState: any): any => {
    dispatch(exitFullScreenDisplay());
  });
};
