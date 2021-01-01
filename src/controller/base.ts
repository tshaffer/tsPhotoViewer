import {
  PhotoCollageModelState,
  createModel,
  PhotoCollageAttributes,
  PhotoCollageItem,
  PhotoCollageSpec,
  PhotoCollection,
  PhotoPlayer,
} from '../type';

// -----------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------

export const fetchModelAsync = (): Promise<PhotoCollageModelState> => {
  console.log('foo');
  return new Promise((resolve) => {
    const photoCollage: PhotoCollageItem[] = [];
    const photoCollageAttributes: PhotoCollageAttributes = {
      photosRootDirectory: '',
      photoCollageSpecIndex: 0,
    };
    const photoCollageSpecs: PhotoCollageSpec[] = [];
    const photoCollection: PhotoCollection = {
      mediaItemsById: {},
      albums: {},
      photosInCollection: [],
    };
    const photoPlayer: PhotoPlayer = {
      playbackActive: false,
      fullScreenDisplay: false,
      timeBetweenUpdates: 5,
      photoCollageSpec: '',
      photosInCollage: [],
      priorPhotosInCollage: [],
      selectedDisplayedPhoto: null,
    };
    const model = createModel(
      photoCollage,
      photoCollageAttributes,
      photoCollageSpecs,
      photoCollection,
      photoPlayer,
    );
    resolve(model);
  });
};

// -----------------------------------------------------------------------
// Controller Methods
// -----------------------------------------------------------------------
