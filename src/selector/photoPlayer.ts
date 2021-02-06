import { isNil } from 'lodash';
import {
  PhotoCollageState,
  // Photo,
  TsRect,
  RenderedPhoto,
  ToolbarItem,
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

export const getPhotos = (state: PhotoCollageState, canvasIndex: number): RenderedPhoto[] => {
  return state.photoPlayer.photosByCanvas[canvasIndex];
};

export const getSelectionRectangle = (state: PhotoCollageState): TsRect | null => {
  if (isNil(state.photoPlayer.selectedRectangle)) {
    return null;
  }
  return state.photoPlayer.selectedRectangle;
};

export const getSelectedPhotoIndex = (state: PhotoCollageState): number => {
  return state.photoPlayer.selectedPhotoIndex;
};

export const getFetchingCanvasIndex = (state: PhotoCollageState): number => {
  return state.photoPlayer.fetchingCanvasIndex;
};

export const getDisplayingCanvasIndex = (state: PhotoCollageState): number => {
  return state.photoPlayer.displayingCanvasIndex;
};

export const getActiveToolbarItem = (state: PhotoCollageState): ToolbarItem => {
  return state.photoPlayer.activeToolbarItem;
};
