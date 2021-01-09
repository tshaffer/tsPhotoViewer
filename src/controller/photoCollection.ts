import isomorphicPath from 'isomorphic-path';
import * as fs from 'fs';
// import * as sizeOf from 'image-size';

import {
//   // getPhotoCollection,
  getPhotosRootDirectory
} from '../selector';
import {
  PhotoCollageState,
  PhotoCollection,
  PhotoInCollection,
} from '../type';
import { setPhotoCollection } from '../model';
// import { getFilePathFromPhotoInCollection } from '../utilities';
// import { isNil, isNumber } from 'lodash';

import { photoCollageRuntimeConfiguration } from '../config';

export function readPhotoCollection(): any {
  console.log('readPhotoCollection invoked');

  return ((dispatch: any, getState: any) => {

    console.log('readPhotoCollection dispatched');

    const state: PhotoCollageState = getState();

    const photosRootDirectory = getPhotosRootDirectory(state);
    const photoCollectionManifestPath: string = isomorphicPath.join(photoCollageRuntimeConfiguration.volumeSpec, photosRootDirectory, photoCollageRuntimeConfiguration.photosManifestFileName);
    const data = fs.readFileSync(photoCollectionManifestPath);
    const photoCollection: PhotoCollection = JSON.parse(data.toString()) as PhotoCollection;
    photoCollection.photosInCollection = [];

    const { mediaItemsById, photosInCollection } = photoCollection;
    for (const mediaItemId in mediaItemsById) {
      if (Object.prototype.hasOwnProperty.call(mediaItemsById, mediaItemId)) {
        const photoInCollection: PhotoInCollection = mediaItemsById[mediaItemId];
        // TEDTODO - check to see if file exists before adding
        photosInCollection.push(photoInCollection);
      }
    }
    console.log(photosInCollection.length);

    dispatch(setPhotoCollection(photoCollection));
  });
}

// export function updateImageSizes() {

//   console.log('updateImageSizes invoked');

//   return ((dispatch: any, getState: any) => {

//     console.log('updateImageSizes dispatched');

//     const state: PhotoCollageState = getState();

//     const photosRootDirectory = getPhotosRootDirectory(state);

//     const photoCollection: PhotoCollection = getPhotoCollection(state);
//     photoCollection.photosInCollection!.forEach((photoInCollection: PhotoInCollection) => {
//       const filePath = getFilePathFromPhotoInCollection(photosRootDirectory, photoInCollection);
//       if (fs.pathExistsSync(filePath)) {
//         const dimensions = sizeOf(filePath);
//         if (isNil(dimensions.width) || isNil(dimensions.height)) {
//           console.log('isNil: ' + filePath);
//         }
//         if (!isNumber(dimensions.height)) {
//           console.log('!isNumber: ' + filePath);
//         }
//         photoInCollection.width = dimensions.width;
//         photoInCollection.height = dimensions.height;
//       }
//       else {
//         if (!isNumber(photoInCollection.height) || !isNumber(photoInCollection.width)) {
//           console.log(filePath);
//         }
//       }
//     });

//     console.log('updateImageSizes: all photos updated');

//     dispatch(setPhotoCollection(photoCollection));

//     fsSaveObjectAsLocalJsonFile(photoCollection, '/Users/tedshaffer/Documents/ShafferotoBackup/mediaItems/updatedPhotoCollectionManifest2.json');

//     console.log('updateImageSizes complete');
//   });
// }

// function fsSaveObjectAsLocalJsonFile(data: object, fullPath: string) {
//   const jsonString = JSON.stringify(data, null, 2);
//   console.log('invoke fs.writeFileSync');
//   console.log(fullPath);
//   fs.writeFileSync(fullPath, jsonString);
// }

