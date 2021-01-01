import {
  DisplayedPhoto,
  PhotoCollageState, PhotoInCollageSpec,
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
  return state.photoPlayer.photoCollageSpec;
};

export const getPhotosInCollage = (state: PhotoCollageState): PhotoInCollageSpec[] => {
  return state.photoPlayer.photosInCollage;
};

export const getSelectedDisplayedPhoto = (state: PhotoCollageState): DisplayedPhoto | null => {
  return state.photoPlayer.selectedDisplayedPhoto;
};

export const getPriorPhotosInCollage = (state: PhotoCollageState): PhotoInCollageSpec[] => {
  return state.photoPlayer.priorPhotosInCollage;
};
