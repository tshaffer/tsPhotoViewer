/** @module Types:base */

/** @internal */
/** @private */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/** @internal */
/** @private */
export interface PhotoCollageModelState {
  photoCollage: PhotoCollageItem[];
  photoCollageAttributes: PhotoCollageAttributes;
  photoCollageSpecs: PhotoCollageSpec[];
  photoCollection: PhotoCollection;
  photoPlayer: PhotoPlayer;

}

/** @internal */
/** @private */
export const createModel = (
  photoCollage: PhotoCollageItem[],
  photoCollageAttributes: PhotoCollageAttributes,
  photoCollageSpecs: PhotoCollageSpec[],
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
  photoCollageSpecs: PhotoCollageSpec[];
  photoCollage: PhotoCollageItem[];
  photoCollection: PhotoCollection;
  photoPlayer: PhotoPlayer;
}

export interface PhotoCollageAttributes {
  photosRootDirectory: string;
  photoCollageSpecIndex: number;
}

export interface PhotoCollageSpec {
  collageWidth: number;
  collageHeight: number;
  photosInCollageSpecs: PhotoInCollageSpec[];
}

export interface PhotoInCollageSpec {
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
  photosInCollage: PhotoInCollageSpec[];
  priorPhotosInCollage: PhotoInCollageSpec[];
  selectedDisplayedPhoto: DisplayedPhoto | null;
}

export interface DisplayedPhoto {
  x: number;
  y: number;
  width: number;
  height: number;
  photoSpec: PhotoInCollageSpec;
}
