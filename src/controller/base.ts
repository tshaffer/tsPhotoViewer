import {
  PhotoCollageState,
  createModel,
  PhotoCollageAttributes,
  CollageSpec,
  PhotoCollection,
  PhotoPlayer,
  ToolbarItem,
  // Photo,
} from '../type';

// -----------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------

export const fetchModelAsync = (): Promise<PhotoCollageState> => {
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
      selectedPhotoIndex: -1,
      selectedRectangle: null,
      fullScreenDisplay: false,
      timeBetweenUpdates: 5,
      photosByCanvas: [],
      fetchingCanvasIndex: -1,
      displayingCanvasIndex: -1,
      activeToolbarItem: ToolbarItem.None,
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
