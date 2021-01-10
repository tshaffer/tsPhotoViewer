import isomorphicPath from 'isomorphic-path';
import { PhotoInCollection } from '../type';
import { photoCollageRuntimeConfiguration } from '../config';

export function getFilePathFromPhotoInCollection(photosRootDirectory: string, photoInCollection: PhotoInCollection): string {
  const dirPath = isomorphicPath.join(photoCollageRuntimeConfiguration.volumeSpec, photosRootDirectory, getRelativePathFromHash(photoInCollection.id));
  const filePath = isomorphicPath.join(dirPath, photoInCollection.id + '.jpg');
  return filePath;
}

export function getRelativeFilePathFromPhotoInCollection(photosRootDirectory: string, photoInCollection: PhotoInCollection): string {
  const dirPath = isomorphicPath.join(photosRootDirectory, getRelativePathFromHash(photoInCollection.id));
  const filePath = isomorphicPath.join(dirPath, photoInCollection.id + '.jpg');
  return filePath;
}

function getRelativePathFromHash(hash: string): string {
  return isomorphicPath.join(hash.charAt(hash.length - 2), hash.charAt(hash.length - 1));
}

