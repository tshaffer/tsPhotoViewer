/** @module Types:base */

/** @internal */
/** @private */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/** @internal */
/** @private */
export interface PhotoCollageModelState {
  photoCollage: Photo[];
  photoCollageAttributes: PhotoCollageAttributes;
  photoCollageSpecs: CollageSpec[];
  photoCollection: PhotoCollection;
  photoPlayer: PhotoPlayer;

}

/** @internal */
/** @private */
export const createModel = (
  photoCollage: Photo[],
  photoCollageAttributes: PhotoCollageAttributes,
  photoCollageSpecs: CollageSpec[],
  photoCollection: PhotoCollection,
  photoPlayer: PhotoPlayer,
): PhotoCollageModelState => {
  return {
    photoCollage,
    photoCollageAttributes,
    photoCollageSpecs,
    photoCollection,
    photoPlayer,
  };
};

// units are in pixels
export interface PhotoCollageConfig {
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
  photoCollage: Photo[];
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
  photosInCollageSpecs: CollageItemSpec[];
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

export type PhotosInCollageSpec = CollageItemSpec[];

export interface PhotoPlayer {
  playbackActive: boolean;
  fullScreenDisplay: boolean;
  timeBetweenUpdates: number;
  photoCollageSpecName: string;
  photos: PhotosInCollageSpec[];
  // selectedDisplayedPhoto: DisplayedPhoto | null;
  fetchingCanvasIndex: number;
  displayingCanvasIndex: number;
}

// coordinates and dimensions are in pixels
// export interface DisplayedPhoto {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   photoSpec: CollageItemSpec;
// }
