import { cloneDeep } from 'lodash';
import { Action } from 'redux';
import {
  PhotoPlayer,
  Photo
} from '../type';
import { PhotoCollageModelAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const START_PHOTO_PLAYBACK = 'START_PHOTO_PLAYBACK';
const STOP_PHOTO_PLAYBACK = 'STOP_PHOTO_PLAYBACK';
const SET_SELECTED_PHOTO_INDEX = 'SET_SELECTED_PHOTO_INDEX';
const ENTER_FULL_SCREEN_DISPLAY = 'ENTER_FULL_SCREEN_PLAYBACK';
const EXIT_FULL_SCREEN_DISPLAY = 'EXIT_FULL_SCREEN_PLAYBACK';
const SET_TIME_BETWEEN_UPDATES = 'SET_TIME_BETWEEN_UPDATES';
const SET_PHOTO_COLLAGE_SPEC = 'SET_PHOTO_COLLAGE_SPEC';

const SET_CANVAS_COLLAGE_PHOTOS_SET = 'SET_CANVAS_COLLAGE_PHOTOS_SET';

const SET_FETCHING_CANVAS_INDEX = 'SET_FETCHING_CANVAS_INDEX';
const SET_DISPLAYING_CANVAS_INDEX = 'SET_DISPLAYING_CANVAS_INDEX';

// ------------------------------------
// Actions
// ------------------------------------

export const startPhotoPlayback = (
): Action => {
  return {
    type: START_PHOTO_PLAYBACK,
  };
};

export const stopPhotoPlayback = (
): Action => {
  return {
    type: STOP_PHOTO_PLAYBACK,
  };
};

export const enterFullScreenDisplay = (
): Action => {
  return {
    type: ENTER_FULL_SCREEN_DISPLAY,
  };
};

export const exitFullScreenDisplay = (
): Action => {
  return {
    type: EXIT_FULL_SCREEN_DISPLAY,
  };
};

type SetTimeBetweenUpdatesPayload = number;
type SetTimeBetweenUpdatesAction = PhotoCollageModelAction<SetTimeBetweenUpdatesPayload>;

export const setTimeBetweenUpdates = (
  timeBetweenUpdates: number,
): SetTimeBetweenUpdatesAction => {
  return {
    type: SET_TIME_BETWEEN_UPDATES,
    payload: timeBetweenUpdates,
  };
};

type SetPhotoCollageSpecPayload = string;
type SetPhotoCollageSpecAction = PhotoCollageModelAction<SetPhotoCollageSpecPayload>;

export const setPhotoCollageSpec = (
  photoCollageSpec: string,
): SetPhotoCollageSpecAction => {
  return {
    type: SET_PHOTO_COLLAGE_SPEC,
    payload: photoCollageSpec,
  };
};

interface SetCanvasCollagePhotosSetPayload {
  canvasIndex: number;
  photos: Photo[];
}
type SetCanvasCollagePhotosSetAction = PhotoCollageModelAction<SetCanvasCollagePhotosSetPayload>;

export const setCollagePhotos = (
  canvasIndex: number,
  photos: Photo[]
): SetCanvasCollagePhotosSetAction => {
  return {
    type: SET_CANVAS_COLLAGE_PHOTOS_SET,
    payload: {
      canvasIndex,
      photos,
    }
  };
};

type SetCanvasIndexPayload = number;
type SetCanvasIndexAction = PhotoCollageModelAction<SetCanvasIndexPayload>;

let lastDateTime: number;

export const setFetchingCanvasIndex = (
  canvasIndex: number,
): SetCanvasIndexAction => {
  const currentDateTime = Date.now();
  lastDateTime = currentDateTime;
  return {
    type: SET_FETCHING_CANVAS_INDEX,
    payload: canvasIndex,
  };
};

export const setDisplayingCanvasIndex = (
  canvasIndex: number,
): SetCanvasIndexAction => {
  return {
    type: SET_DISPLAYING_CANVAS_INDEX,
    payload: canvasIndex,
  };
};

export type SetSelectedPhotoIndex = number;
type SetSelectedPhotoIndexAction = PhotoCollageModelAction<SetSelectedPhotoIndex>;

export const setSelectedPhotoIndex = (
  selectedPhotoIndex: number,
): SetSelectedPhotoIndexAction => {
  return {
    type: SET_SELECTED_PHOTO_INDEX,
    payload: selectedPhotoIndex,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: PhotoPlayer = {
  playbackActive: false,
  selectedPhotoIndex: -1,
  fullScreenDisplay: false,
  timeBetweenUpdates: 5,
  photosByCanvas: [],
  // selectedPhotoIndex: null,
  fetchingCanvasIndex: -1,
  displayingCanvasIndex: -1,
};

export const photoPlayerReducer = (
  state: PhotoPlayer = initialState,
  action: Action & SetTimeBetweenUpdatesAction & SetPhotoCollageSpecAction & SetCanvasCollagePhotosSetAction,
): PhotoPlayer => {
  switch (action.type) {
    case START_PHOTO_PLAYBACK: {
      return {
        ...state,
        playbackActive: true,
      };
    }
    case STOP_PHOTO_PLAYBACK: {
      return {
        ...state,
        playbackActive: false,
      };
    }
    case ENTER_FULL_SCREEN_DISPLAY: {
      return {
        ...state,
        fullScreenDisplay: true,
      };
    }
    case EXIT_FULL_SCREEN_DISPLAY: {
      return {
        ...state,
        fullScreenDisplay: false,
      };
    }
    case SET_TIME_BETWEEN_UPDATES: {
      return {
        ...state,
        timeBetweenUpdates: action.payload,
      };
    }
    case SET_CANVAS_COLLAGE_PHOTOS_SET: {
      const { canvasIndex, photos } = action.payload;

      const newState = cloneDeep(state);
      newState.photosByCanvas[canvasIndex] = photos;
      return newState;
    }
    case SET_SELECTED_PHOTO_INDEX: {
      return {
        ...state,
        selectedPhotoIndex: action.payload,
      };
    }
    case SET_FETCHING_CANVAS_INDEX: {
      return {
        ...state,
        fetchingCanvasIndex: action.payload,
      };
    }
    case SET_DISPLAYING_CANVAS_INDEX: {
      return {
        ...state,
        displayingCanvasIndex: action.payload,
      };
    }
    default:
      return state;
  }
};
