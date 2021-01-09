import {
  PhotoCollageModelState,
  createModel,
  PhotoCollageAttributes,
  CollageSpec,
  PhotoCollection,
  PhotoPlayer,
  Photo,
} from '../type';

// -----------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------

export const fetchModelAsync = (): Promise<PhotoCollageModelState> => {
  console.log('foo');
  return new Promise((resolve) => {
    const photoCollage: Photo[] = [];
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
      // selectedDisplayedPhoto: null,
      photosByCanvas: [],
      fetchingCanvasIndex: -1,
      displayingCanvasIndex: -1,
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
