/** @module Model:base */

import {
  combineReducers
} from 'redux';
import { isNil } from 'lodash';
import { PhotoCollageState } from '../type';
import { photoCollageAttributesReducer } from './photoCollageAttributes';
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

export const photoCollageModelReducer = combineReducers<PhotoCollageState>({
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