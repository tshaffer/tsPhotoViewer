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

export interface CollageSpec {
  collageWidth: number;
  collageHeight: number;
  collageItemSpecs: CollageItemSpec[];
}

export interface CollageItemSpec {
  x: number;
  y: number;
  width: number;
  height: number;
  fileName?: string;
  filePath?: string;
}

export interface PhotoCollageItem {
  filePath: string;
}

export interface PhotoCollection {
  mediaItemsById: PhotosCollectionLUT;
  albums: any;
  photosInCollection: PhotoInCollection[] | null;
}

export interface PhotosCollectionLUT { [id: string]: PhotoInCollection; }

export interface PhotoInCollection {
  id: string;
  fileName: string;
  height: number;
  width: number | null;
}

export interface PhotoPlayer {
  playbackActive: boolean;
  fullScreenDisplay: boolean;
  timeBetweenUpdates: number;
  photoCollageSpec: string;
  photosInCollage: CollageItemSpec[];
  priorPhotosInCollage: CollageItemSpec[];
  selectedDisplayedPhoto: DisplayedPhoto | null;
}

export interface DisplayedPhoto {
  x: number;
  y: number;
  width: number;
  height: number;
  photoSpec: CollageItemSpec;
}
