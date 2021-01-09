import { PhotoCollageRuntimeConfiguration } from '../type';
import * as dotenv from 'dotenv';
import { isNil } from 'lodash';

export let photoCollageRuntimeConfiguration: PhotoCollageRuntimeConfiguration;

export const readConfig = (pathToConfigFile: string): void => {

  try {
    const configOutput: dotenv.DotenvConfigOutput = dotenv.config({ path: pathToConfigFile });
    const parsedConfig: dotenv.DotenvParseOutput | undefined = configOutput.parsed;

    if (!isNil(parsedConfig)) {
      photoCollageRuntimeConfiguration = {
        volumeSpec: parsedConfig.volumeSpec,
        photosRootDirectory: parsedConfig.photosRootDirectory,
        photosManifestFileName: parsedConfig.photosManifestFileName,
        screenWidth: parseInt(parsedConfig.screenWidth, 10),
        screenHeight: parseInt(parsedConfig.screenHeight, 10),
        collageWidth: parseInt(parsedConfig.collageWidth, 10),
        collageHeight: parseInt(parsedConfig.collageHeight, 10),
      };
      console.log('readConfig, config: ', photoCollageRuntimeConfiguration);
    }
  }
  catch (err) {
    console.log('Dotenv config error: ' + err.message);
  }
};
