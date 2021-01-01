import { 
  PhotoCollageSpec, 
} from '../type';
import { photoCollageConfig } from '../config';

import { addPhotosCollageSpecs, setPhotoCollageSpecIndex, setPhotosRootDirectory } from '../model';
import {
  readPhotoCollection,
  // updateImageSizes,
} from './photoCollection';


export function init(): any {
  console.log('init invoked');
  return ((dispatch: any, getState: any) => {
    console.log('init dispatched');

    console.log('main.ts:');
    console.log(photoCollageConfig);

    dispatch(setPhotosRootDirectory(photoCollageConfig.photosRootDirectory));

    dispatch(readPhotoCollection());

    // one time operation to update the manifest with the correct dimensions
    // dispatch(updateImageSizes());

    dispatch(addPhotoCollageSpecs());
    dispatch(setPhotoCollageSpecIndex(0));
  });
}

const addPhotoCollageSpecs = () => {
  return ((dispatch: any, getState: any) => {
    const photoCollageSpec: PhotoCollageSpec = {
      collageWidth: 16,
      collageHeight: 10,
      photosInCollageSpecs: [
        {
          x: 0,
          y: 0,
          width: 6,
          height: 4,
        },
        {
          x: 6,
          y: 0,
          width: 4,
          height: 6,
        },
        {
          x: 10,
          y: 0,
          width: 6,
          height: 4,
        },
        {
          x: 1,
          y: 4,
          width: 4,
          height: 6,
        },
        {
          x: 5,
          y: 6,
          width: 6,
          height: 4,
        },
        {
          x: 11,
          y: 4,
          width: 4,
          height: 6,
        },
      ],

    };
    console.log(photoCollageSpec);
    dispatch(addPhotosCollageSpecs([photoCollageSpec]));
  });
};
