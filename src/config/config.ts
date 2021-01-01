import { PhotoCollageConfig } from '../type';
import * as dotenv from 'dotenv';
import { isNil } from 'lodash';

export let photoCollageConfig: PhotoCollageConfig;

export const readConfig = (pathToConfigFile: string): void => {

  try {
    // const rawConfig = dotenv.config({ path: pathToConfigFile }).parsed;
    const configOutput: dotenv.DotenvConfigOutput = dotenv.config({ path: pathToConfigFile });
    const parsedConfig: dotenv.DotenvParseOutput | undefined = configOutput.parsed;

    if (!isNil(parsedConfig)) {
      photoCollageConfig = {
        volumeSpec: parsedConfig.volumeSpec,
        photosRootDirectory: parsedConfig.photosRootDirectory,
        photosManifestFileName: parsedConfig.photosManifestFileName,
        screenWidth: parseInt(parsedConfig.screenWidth, 10),
        screenHeight: parseInt(parsedConfig.screnHeight, 10),
        collageWidth: parseInt(parsedConfig.collageWidth, 10),
        collageHeight: parseInt(parsedConfig.collageHeight, 10),
      };
      console.log('readConfig, config: ', photoCollageConfig);
    }
  }
  catch (err) {
    console.log('Dotenv config error: ' + err.message);
  }
};
