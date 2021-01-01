import { PhotoCollageModelAction } from './baseAction';
import { PhotoCollection } from '../type';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_PHOTO_COLLECTION = 'SET_PHOTO_COLLECTION';

// ------------------------------------
// Actions
// ------------------------------------
export type SetPhotoCollectionAction = PhotoCollageModelAction<PhotoCollection>;

export const setPhotoCollection = (
  photoCollection: PhotoCollection,
): SetPhotoCollectionAction => {
  return {
    type: SET_PHOTO_COLLECTION,
    payload: photoCollection,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: PhotoCollection = {
  mediaItemsById: {},
  albums: {},
  photosInCollection: [],
};

export const photoCollectionReducer = (
  state: PhotoCollection = initialState,
  action: SetPhotoCollectionAction
): PhotoCollection => {
  switch (action.type) {
    case SET_PHOTO_COLLECTION: {
      return {
        mediaItemsById: action.payload.mediaItemsById,
        albums: action.payload.albums,
        photosInCollection: action.payload.photosInCollection,
      };
    }
    default:
      return state;
  }
};

