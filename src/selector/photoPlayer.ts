import {
  // DisplayedPhoto,
  PhotoCollageState, CollageItemSpec, PhotosInCollageSpec,
} from '../type';

export const getPlaybackActive = (state: PhotoCollageState): boolean => {
  return state.photoPlayer.playbackActive;
};

export const getFullScreenDisplay = (state: PhotoCollageState): boolean => {
  return state.photoPlayer.fullScreenDisplay;
};

export const getTimeBetweenUpdates = (state: PhotoCollageState): number => {
  return state.photoPlayer.timeBetweenUpdates;
};

export const getPhotoCollageFilesSpec = (state: PhotoCollageState): string => {
  return state.photoPlayer.photoCollageSpecName;
};

// export const getPhotosInCollage = (state: PhotoCollageState): PhotoInCollageSpec[] => {
//   return state.photoPlayer.photosInCollage;
// };

// export const getSelectedDisplayedPhoto = (state: PhotoCollageState): DisplayedPhoto | null => {
//   return state.photoPlayer.selectedDisplayedPhoto;
// };

export const getFetchingCanvasIndex = (state: PhotoCollageState): number => {
  return state.photoPlayer.fetchingCanvasIndex;
};

export const getDisplayingCanvasIndex = (state: PhotoCollageState): number => {
  return state.photoPlayer.displayingCanvasIndex;
};

export const getCanvasCollagePhotosSet = (state: PhotoCollageState, index: number): PhotosInCollageSpec | null => {
  if (index < 0 || index >= state.photoPlayer.photos.length) {
    return null;
  }
  return state.photoPlayer.photos[index];
};
