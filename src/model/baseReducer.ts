/** @module Model:base */

import {
  combineReducers
} from 'redux';
import { isNil } from 'lodash';
import { PhotoCollageModelState } from '../type';
import { photoCollageAttributesReducer } from './photoCollageAttributes';
import { photoCollageReducer } from './photoCollage';
import { photoCollageSpecsReducer } from './photoCollageSpecs';
import { photoCollectionReducer } from './photoCollection';
import { photoPlayerReducer } from './photoPlayer';

// -----------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------

// none

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------

export const photoCollageModelReducer = combineReducers<PhotoCollageModelState>({
  photoCollage: photoCollageReducer,
  photoCollageAttributes: photoCollageAttributesReducer,
  photoCollageSpecs: photoCollageSpecsReducer,
  photoCollection: photoCollectionReducer,
  photoPlayer: photoPlayerReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

export const isValidPhotoCollageModelState = (state: any): boolean => {
  return !isNil(state);
  // TEDTODO - add remaining properties
  // && state.hasOwnProperty('template') && isValidTemplateState(state.template);
};

export const isValidPhotoCollageModelStateShallow = (state: any): boolean => {
  return !isNil(state);
  // TEDTODO - add remaining properties
  // && state.hasOwnProperty('template');
};