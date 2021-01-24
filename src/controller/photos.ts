import {
  CollageSpec,
} from '../type';
import { photoCollageRuntimeConfiguration } from '../config';

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
    console.log(photoCollageRuntimeConfiguration);

    dispatch(setPhotosRootDirectory(photoCollageRuntimeConfiguration.photosRootDirectory));

    dispatch(readPhotoCollection());

    // one time operation to update the manifest with the correct dimensions
    // dispatch(updateImageSizes());

    dispatch(addPhotoCollageSpecs());
    dispatch(setPhotoCollageSpecIndex(0));
  });
}

const addPhotoCollageSpecs = () => {
  return ((dispatch: any, getState: any) => {
    const photoCollageSpec: CollageSpec = {
      collageWidth: 16,
      collageHeight: 10,
      collageItemSpecs: [
        {                   // 0 = topLeft
          x: 0,
          y: 0,
          width: 6,
          height: 4,
        },
        {                   // 1 = topMiddle
          x: 6,
          y: 0,
          width: 4,
          height: 6,
        },
        {                   // 2 = topRight
          x: 10,
          y: 0,
          width: 6,
          height: 4,
        },
        {                   // 3 = bottomLeft
          x: 1,
          y: 4,
          width: 4,
          height: 6,
        },
        {                   // 4 = bottomMiddle
          x: 5,
          y: 6,
          width: 6,
          height: 4,
        },
        {                   // 5 = bottomRight
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
