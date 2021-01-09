/** @module Types:base */

/** @internal */
/** @private */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/** @internal */
/** @private */
export interface PhotoCollageModelState {
  photoCollection: PhotoCollection;
  photoCollageSpecs: CollageSpec[];
  photoCollageAttributes: PhotoCollageAttributes;
  photoPlayer: PhotoPlayer;
  populatedPhotoCollage: Photo[];  // populated photo collage
}

/** @internal */
/** @private */
export const createModel = (
  populatedPhotoCollage: Photo[],
  photoCollageAttributes: PhotoCollageAttributes,
  photoCollageSpecs: CollageSpec[],
  photoCollection: PhotoCollection,
  photoPlayer: PhotoPlayer,
): PhotoCollageModelState => {
  return {
    populatedPhotoCollage,
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
  // fileName?: string;
  // filePath?: string;
}

// export interface PhotoCollageItem {
//   filePath: string;
// }

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
  width: number | null;
}

export interface Photo extends PhotoInCollection {
  filePath: string;
  relativeFilePath?: string;
}

export interface DisplayedPhoto extends Photo {
  x: number;
  y: number;
}

export type PhotosInCollageSpec = CollageItemSpec[];

export interface PhotoPlayer {
  playbackActive: boolean;
  fullScreenDisplay: boolean;
  timeBetweenUpdates: number;
  photoCollageSpecName: string;
  photosByCanvas: Array<Array<Photo>>;
  
  // selectedDisplayedPhoto: DisplayedPhoto | null;
  fetchingCanvasIndex: number;
  displayingCanvasIndex: number;
}

