/** @module Types:base */

/** @internal */
/** @private */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/** @internal */
/** @private */
export const createModel = (
  photoCollageAttributes: PhotoCollageAttributes,
  photoCollageSpecs: CollageSpec[],
  photoCollection: PhotoCollection,
  photoPlayer: PhotoPlayer,
): PhotoCollageState => {
  return {
    photoCollageAttributes,
    photoCollageSpecs,
    photoCollection,
    photoPlayer,
  };
};

// units are in pixels
export interface PhotoCollageRuntimeConfiguration {
  volumeSpec: string;
  photosRootDirectory: string;
  photosManifestFileName: string;
  collageWidth: number;
  collageHeight: number;
  screenWidth: number;
  screenHeight: number;
}

export interface PhotoCollageState {
  photoCollageAttributes: PhotoCollageAttributes;
  photoCollageSpecs: CollageSpec[];
  photoCollection: PhotoCollection;
  photoPlayer: PhotoPlayer;
}

export interface PhotoCollageAttributes {
  photosRootDirectory: string;
  photoCollageSpecIndex: number;
}

// dimensions are in collage units, i.e. device independent
export interface CollageSpec {
  collageWidth: number;
  collageHeight: number;
  collageItemSpecs: CollageItemSpec[];
}

// dimensions are in collage units, i.e. device independent
export interface CollageItemSpec {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PhotoCollection {
  mediaItemsById: PhotosCollectionLUT;
  albums: any;
  photosInCollection: PhotoInCollection[] | null;
}

export interface PhotosCollectionLUT { [id: string]: PhotoInCollection; }

// dimensions are in pixels
export interface PhotoInCollection {
  id: string;
  fileName: string;
  height: number;
  width: number | null;   // TEDTODO - can I remove null?
}

export interface Photo extends PhotoInCollection {
  filePath: string;
  relativeFilePath?: string;
}

export interface RenderedPhoto extends Photo {
  rectX?: number;
  rectY?: number;
  rectWidth?: number;
  rectHeight?: number;
}

export interface DisplayedPhoto extends Photo {
  x: number;
  y: number;
}

export interface PhotoPlayer {
  playbackActive: boolean;
  selectedPhotoIndex: number;
  selectedRectangle: TsRect | null;
  fullScreenDisplay: boolean;
  timeBetweenUpdates: number;
  photosByCanvas: Array<Array<RenderedPhoto>>;
  fetchingCanvasIndex: number;
  displayingCanvasIndex: number;
  activeToolbarItem: ToolbarItem;
}

export interface TsRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum ToolbarItem {
  Back = 'Back',
  PlayPause = 'PlayPause',
  FullScreen = 'FullScreen',
  Grid = 'Grid',
  None = 'None',
}

