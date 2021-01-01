import {
  PhotoCollageState,
  PhotoCollageAttributes,
  PhotoCollection,
  PhotoCollageSpec
} from '../type';

export const getPhotoCollageAttributes = (state: PhotoCollageState): PhotoCollageAttributes => {
  return state.photoCollageAttributes;
};

export const getPhotosRootDirectory = (state: PhotoCollageState): string => {
  return getPhotoCollageAttributes(state).photosRootDirectory;
};

export const getPhotoCollection = (state: PhotoCollageState): PhotoCollection => {
  return state.photoCollection;
};

export const getActivePhotoCollageSpec = (state: PhotoCollageState): PhotoCollageSpec | null => {
  if ((state.photoCollageAttributes.photoCollageSpecIndex < 0)
    || (state.photoCollageAttributes.photoCollageSpecIndex >= state.photoCollageSpecs.length)) {
    return null;
  }

  return state.photoCollageSpecs[state.photoCollageAttributes.photoCollageSpecIndex];
};
