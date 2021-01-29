import * as React from 'react';
import { KeyboardEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// https://iconify.design/icon-sets/mdi/play-pause.html
// import { Icon, InlineIcon } from '@iconify/react';
// import playPause from '@iconify-icons/mdi/play-pause';

import ArrowBack from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
// import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';
// import Replay from '@material-ui/icons/Replay';

// import Fullscreen from '@material-ui/icons/Fullscreen';
// import FullscreenExit from '@material-ui/icons/FullscreenExit';
// import Info from '@material-ui/icons/Info';
// import ArrowUpward from '@material-ui/icons/ArrowUpward';
// import ArrowDownward from '@material-ui/icons/ArrowDownward';

import { isNil } from 'lodash';

import {
  PhotoCollageState,
  DisplayedPhoto,
  CollageItemSpec,
} from '../type';
import PhotoCollageCanvas from './PhotoCollageCanvas';

import {
  //   restartPlayback,
  //   startPlayback,
  stopPlayback,
  //   enterFullScreenPlayback,
  //   exitFullScreenPlayback,
  //   // setPopulatedPhotoCollage,
} from '../controller';
import {
  getPlaybackActive,
  getFullScreenDisplay,
  getSelectedPhotoIndex,
} from '../selector';
import {
  setSelectedPhotoIndex,
} from '../model';
import {
  irReceiver,
  platform
} from '../index';

const IrRemoteEnter = 7311380;
const IrRemoteRight = 7311377;
const IrRemoteLeft = 7311376;
const IrRemoteUp = 7311378;
const IrRemoteDown = 7311379;

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export interface PhotoCollageProps {
  playbackActive: boolean;
  selectedPhotoIndex: number;
  fullScreenDisplay: boolean;
  priorPhotosInCollage: CollageItemSpec[];
  // onRestartPlayback: () => any;
  // onStartPlayback: () => any;
  onStopPlayback: () => any;
  onSetSelectedPhotoIndex: (selectedPhotoIndex: number) => any;
  // onEnterFullScreenPlayback: () => any;
  // onExitFullScreenPlayback: () => any;
  // onSetPopulatedPhotoCollage: (photosInCollage: PhotoInCollageSpec[]) => any;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

const useStyles = makeStyles({
  parentDiv: {
    position: 'relative',
    // height: '1080px',
    height: '100%',
  },
  photoCollageDiv: {
    // height: '1020px',   // not clear that this is relevant / used / required
  },
  /*  
  old approach
     position: 'absolute',
     margin: 'auto',
     width: '200px',
     bottom: 0,
  omitted
    -webkit-transform: 'translateX(-50%)',
  */
  toolbarDiv: {
    position: 'absolute',
    left: '50%',
    bottom: '0px',
    transform: 'translateX(-50%)',
  },
  hidePhotos: {
    display: 'none',
  },
  showPhotos: {
    display: 'block',
  }
});

interface PhotoDialogProps {
  open: boolean;
  selectedPhoto: DisplayedPhoto;
  onClose: (resumePlayback: boolean) => void;
}

const PhotoDialog = (props: PhotoDialogProps) => {

  const { onClose, selectedPhoto, open } = props;

  const handleCloseStayPaused = () => {
    onClose(false);
  };

  const handleCloseResumePlayback = () => {
    onClose(true);
  };

  /*
          <p>{selectedPhoto.photoSpec.fileName}</p>
          <p>{selectedPhoto.photoSpec.filePath}</p>
  */
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCloseResumePlayback}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Eat pizza?'}</DialogTitle>
        <DialogContent>
          <p>Selected photo:</p>
          <p>Width</p>
          <p>{selectedPhoto.width}</p>
          <p>Height</p>
          <p>{selectedPhoto.height}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStayPaused} color='primary'>
            Close
          </Button>
          <Button onClick={handleCloseResumePlayback} color='primary' autoFocus>
            Resume Playback
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

let globalProps: Partial<PhotoCollageProps>;

const PhotoCollage = (props: PhotoCollageProps) => {

  const [open, setOpen] = React.useState(false);

  const [_selectedPhoto, setSelectedPhoto] = React.useState<DisplayedPhoto | undefined>(undefined);

  const classes = useStyles();

  const initialize = (): any => {
    // console.log('initialize');
    if (platform === 'BrightSign') {
      // irReceiver.onremotedown = handleRemoteDown;
      irReceiver.onremotedown = (e: any) => {
        handleRemoteDown(e);
      };
    }
  };

  // // React.useEffect(initialize, []);
  // React.useEffect(() => {
  //   // register eventListener on each state update
  //   console.log('useEffect invoked, call initialize');
  //   initialize();

  //   return () => {
  //     // unregister eventListener
  //     console.log('unregister the listener');
  //   };
  // }, []);

  const getBackIcon = () => {
    return (
      <IconButton
        id={'back'}
        onClick={handleBack}>
        <ArrowBack
          fontSize='large'
        />
      </IconButton>
    );
  };

  const getPauseOrPlaybackIcon = () => {

    return (
      <IconButton
        id={'1'}
        onClick={handlePlay}>
        <PlayArrow />
      </IconButton>
    );

    // <Icon icon={playPause} height="2em" />

    // return (
    //   <Icon
    //     icon={playPause}
    //     height='2em'
    //   />
    // );

    // if (props.playbackActive) {
    //   return (
    //     <IconButton
    //       id={'0'}
    //       onClick={handlePause}>
    //       <PauseCircleFilled />
    //     </IconButton>
    //   );
    // }
    // else {
    //   return (
    //     <IconButton
    //       id={'1'}
    //       onClick={handlePlay}>
    //       <PlayArrow />
    //     </IconButton>
    //   );
    // }
  };

  const getFullScreenOrFullScreenExitIcon = () => {

    return null;

    // if (props.fullScreenDisplay) {
    //   return (
    //     <IconButton
    //       id={'fullScreenExit'}
    //       onClick={handleExitFullScreenDisplay}>
    //       <FullscreenExit />
    //     </IconButton>
    //   );
    // }
    // else {
    //   return (
    //     <IconButton
    //       id={'fullScreenDisplay'}
    //       onClick={handleDisplayFullScreen}>
    //       <Fullscreen />
    //     </IconButton>
    //   );
    // }
  };

  const handleRemoteDown = (e: any) => {
    // console.log('############ handleRemotedown: ' + e.irType + ' - ' + e.code);
    // console.log('props.playbackActive');
    // console.log(props['playbackActive']);
    // if (!isNil(globalProps)) {
    //   console.log('globalProps.playbackActive (by accessing two ways)');
    //   console.log(globalProps.playbackActive);
    //   console.log(globalProps['playbackActive']);
    // }
    switch (e.code) {
      case IrRemoteEnter:
        console.log('invoke handleEnter');
        handleEnter();
        break;
      case IrRemoteRight:
        console.log('invoke handleArrowRight');
        handleArrowRight();
        break;
      case IrRemoteLeft:
        console.log('invoke handleArrowLeft');
        handleArrowLeft();
        break;
      case IrRemoteUp:
        console.log('invoke handleArrowUp');
        handleArrowUp();
        break;
      case IrRemoteDown:
        console.log('invoke handleArrowDown');
        handleArrowDown();
        break;
      default:
        break;
    }
  };

  const handleEnter = () => {
    // console.log('handleEnter invoked, set globalProps');
    // globalProps = props;
    // console.log(globalProps);
    // console.log(props.playbackActive);
    if (globalProps.playbackActive) {
      props.onStopPlayback();
      props.onSetSelectedPhotoIndex(-1);
    }
  };

  const handleClose = (resumePlayback: boolean) => {
    setOpen(false);
    // if (resumePlayback) {
    //   props.onStartPlayback();
    // }
  };

  // const handleSelectPhoto = (selectedPhoto: DisplayedPhoto) => {
  //   setSelectedPhoto(selectedPhoto);
  //   setOpen(true);
  // };

  const handlePlay = () => {
    setOpen(false);
    // props.onStartPlayback();
  };

  const handlePause = () => {
    setSelectedPhoto(undefined);
    setOpen(false);
    // props.onStopPlayback();
  };

  const handleBack = () => {

    // get state of playback, restore at end of handler

    // props.onStopPlayback();

    // get prior photos
    // const priorPhotosInCollage: PhotoInCollageSpec[] = props.priorPhotosInCollage;
    // if (priorPhotosInCollage.length === 0) {
    //   console.log('no prior photos');
    //   return;
    // }
    // else {
    //   // set current photos to prior photos
    //   props.onSetPopulatedPhotoCollage(priorPhotosInCollage);

    //   // cause them to get displayed
    //   // restart full playback as appropriate
    //   // TODO - probably starts playback
    //   props.onRestartPlayback();
    // }
  };

  const handleDisplayFullScreen = () => {
    // props.onEnterFullScreenPlayback();
  };

  const handleExitFullScreenDisplay = () => {
    // props.onExitFullScreenPlayback();
  };

  const handleArrowLeft = () => {
    let selectedPhotoIndex: number = globalProps.selectedPhotoIndex as number;
    if (selectedPhotoIndex < 0) {
      // select different item in toolbar
      return;
    } else {
      switch (selectedPhotoIndex) {
        case 0:
        case 3:
          selectedPhotoIndex += 2;
          break;
        case 1:
        case 2:
        case 4:
        case 5:
          selectedPhotoIndex -= 1;
          break;
      }
    }
    props.onSetSelectedPhotoIndex(selectedPhotoIndex);
  };

  const handleArrowRight = () => {
    let selectedPhotoIndex: number = globalProps.selectedPhotoIndex as number;
    if (selectedPhotoIndex < 0) {
      // select different item in toolbar
      return;
    } else {
      switch (selectedPhotoIndex) {
        case 0:
        case 1:
        case 3:
        case 4:
          selectedPhotoIndex += 1;
          break;
        case 2:
        case 5:
          selectedPhotoIndex -= 2;
          break;
      }
    }
    props.onSetSelectedPhotoIndex(selectedPhotoIndex);
  };

  const handleArrowUp = () => {
    let selectedPhotoIndex: number = globalProps.selectedPhotoIndex as number;
    if (selectedPhotoIndex < 0) {
      selectedPhotoIndex = 4;
    } else {
      switch (selectedPhotoIndex) {
        case 0:
        case 1:
        case 2:
        default:
          selectedPhotoIndex += 3;
          break;
        case 3:
        case 4:
        case 5:
          selectedPhotoIndex -= 3;
      }
    }
    props.onSetSelectedPhotoIndex(selectedPhotoIndex);
  };

  const handleArrowDown = () => {
    let selectedPhotoIndex: number = globalProps.selectedPhotoIndex as number;
    if (selectedPhotoIndex < 0) {
      // ????
      return;
    } else {
      switch (selectedPhotoIndex) {
        case 3:
        case 4:
        case 5:
          selectedPhotoIndex -= 3;
          break;
        case 0:
        case 1:
        case 2:
          selectedPhotoIndex += 3;
      }
    }
    props.onSetSelectedPhotoIndex(selectedPhotoIndex);
  };

  const handleKeyPress = (keyboardEvent: React.KeyboardEvent) => {

    // console.log('handleKeyPress invoked');
    // console.log(keyboardEvent.key.toLowerCase());

    switch (keyboardEvent.key.toLowerCase()) {
      case 'enter':
        handleEnter();
        break;
      case 'arrowleft':
        handleArrowLeft();
        break;
      case 'arrowright':
        handleArrowRight();
        break;
      case 'arrowup':
        handleArrowUp();
        break;
      case 'arrowdown':
        handleArrowDown();
        break;
      default:
        break;
    }
  };

  const renderDialog = () => {

    const selectedPhoto: DisplayedPhoto | undefined = _selectedPhoto;

    if (isNil(selectedPhoto)) {
      return null;
    }
    return (
      <PhotoDialog
        selectedPhoto={selectedPhoto}
        open={open}
        onClose={handleClose}
      />
    );

  };

  const renderToolbar = () => {
    if (globalProps.playbackActive) {
      return null;
    }

    return (
      <div className={classes.toolbarDiv}>
        {getBackIcon()}
        {getPauseOrPlaybackIcon()}
        {getFullScreenOrFullScreenExitIcon()}
      </div>
    );
  };

  console.log('re-render:', globalProps.playbackActive);

  if (!isNil(irReceiver.onremotedown)) {
    console.log('irReceiver.onremotedown exists');
    if (!isNil((irReceiver as any).addEventListener)) {
      console.log('irReceiver.addEventListener exists');
      if (!isNil((irReceiver as any).removeEventListener)) {
        console.log('irReceiver.removeEventListener exists');
      } else {
        console.log('irReceiver.removeEventListener does not exist');
      }
    } else {
      console.log('irReceiver.addEventListener does not exist');
    }
  }
  else {
    console.log('irReceiver.onremotedown exists');
  }

  if (platform === 'BrightSign') {
    (irReceiver as any).onremotedown = null;
    irReceiver.onremotedown = (e: any) => {
      handleRemoteDown(e);
    };
  }

  return (
    <div className={classes.parentDiv}>
      <div
        className={classes.photoCollageDiv}
        onKeyDown={handleKeyPress}
        tabIndex={0}
      >
        <PhotoCollageCanvas />
        {renderDialog()}
      </div >
      {renderToolbar()}
    </div>
  );

};

function mapStateToProps(state: PhotoCollageState, ownProps: any): Partial<PhotoCollageProps> {
  // console.log('PhotoCollage.tsx#mapStateToProps', getPlaybackActive(state));
  // console.log(getPlaybackActive(state));
  globalProps = {
    playbackActive: getPlaybackActive(state),
    selectedPhotoIndex: getSelectedPhotoIndex(state),
    fullScreenDisplay: getFullScreenDisplay(state),
  };
  return {
    playbackActive: getPlaybackActive(state),
    selectedPhotoIndex: getSelectedPhotoIndex(state),
    fullScreenDisplay: getFullScreenDisplay(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    // onStartPlayback: startPlayback,
    // onRestartPlayback: restartPlayback,
    onStopPlayback: stopPlayback,
    onSetSelectedPhotoIndex: setSelectedPhotoIndex,
    // onEnterFullScreenPlayback: enterFullScreenPlayback,
    // onExitFullScreenPlayback: exitFullScreenPlayback,
    // onSetPopulatedPhotoCollage: setPopulatedPhotoCollage,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCollage);
