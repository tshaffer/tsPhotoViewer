/** @module Model:base */

import {
  Action,
  // Dispatch,
  // ActionCreator,
} from 'redux';

// -----------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------

/** @internal */
/** @private */
interface PhotoCollageModelBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: unknown;
  error?: boolean;
  meta?: {};
}

/** @internal */
/** @private */
export interface PhotoCollageModelAction<T> extends PhotoCollageModelBaseAction {
  type: string;
  payload: T;
  error?: boolean;
  meta?: {};
}
