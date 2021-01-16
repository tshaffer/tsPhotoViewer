import {
  PhotoCollageState,
  createModel,
  PhotoCollageAttributes,
  CollageSpec,
  PhotoCollection,
  PhotoPlayer,
} from '../type';

// -----------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------

export const fetchModelAsync = (): Promise<PhotoCollageState> => {
  console.log('foo');
  return new Promise((resolve) => {
    const photoCollageAttributes: PhotoCollageAttributes = {
      photosRootDirectory: '',
      photoCollageSpecIndex: 0,
    };
    const photoCollageSpecs: CollageSpec[] = [];
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
