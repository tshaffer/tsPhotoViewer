import { cloneDeep } from 'lodash';
import { PhotoCollageModelAction } from './baseAction';
import { PhotoCollageItem } from '../type';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_PHOTO_TO_COLLAGE = 'ADD_PHOTO_TO_COLLAGE';

// ------------------------------------
// Actions
// ------------------------------------
type AddPhotoToCollagePayload = PhotoCollageItem;
type AddPhotoToCollageAction = PhotoCollageModelAction<AddPhotoToCollagePayload>;

export const addPhotoToCollage = (
  photo: PhotoCollageItem,
): AddPhotoToCollageAction => {
  return {
    type: ADD_PHOTO_TO_COLLAGE,
    payload: photo,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: PhotoCollageItem[] = [];

export const photoCollageReducer = (
  state: PhotoCollageItem[] = initialState,
  action: AddPhotoToCollageAction
): PhotoCollageItem[] => {
  switch (action.type) {
    case ADD_PHOTO_TO_COLLAGE: {
      const photoCollage = cloneDeep(state) as PhotoCollageItem[];
      photoCollage.push(action.payload);
      return photoCollage;
    }
    default:
      return state;
  }
};

