import { PhotoCollageModelAction } from './baseAction';
import { CollageSpec } from '../type';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_PHOTO_COLLAGE_SPECS = 'ADD_PHOTO_COLLAGE_SPECS';

// ------------------------------------
// Actions
// ------------------------------------
type AddPhotosCollageSpecsPayload = CollageSpec[];
type AddPhotoCollageSpecsAction = PhotoCollageModelAction<AddPhotosCollageSpecsPayload>;

export const addPhotosCollageSpecs = (
  photoCollageSpecs: CollageSpec[],
): AddPhotoCollageSpecsAction => {
  return {
    type: ADD_PHOTO_COLLAGE_SPECS,
    payload: photoCollageSpecs,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: CollageSpec[] = [];

export const photoCollageSpecsReducer = (
  state: CollageSpec[] = initialState,
  action: AddPhotoCollageSpecsAction,
): CollageSpec[] => {
  switch (action.type) {
    case ADD_PHOTO_COLLAGE_SPECS: {
      return action.payload;
    }
    default:
      return state;
  }
};

