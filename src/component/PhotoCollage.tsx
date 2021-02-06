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

import Fullscreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';
// import Info from '@material-ui/icons/Info';
// import ArrowUpward from '@material-ui/icons/ArrowUpward';
// import ArrowDownward from '@material-ui/icons/ArrowDownward';

import { isNil } from 'lodash';

import {
  PhotoCollageState,
  DisplayedPhoto,
  CollageItemSpec,
  ToolbarItem,
} from '../type';
import PhotoCollageCanvas from './PhotoCollageCanvas';

import {
  //   restartPlayback,
  //   startPlayback,
  resumePlayback,
  stopPlayback,
  enterFullScreenPlayback,
  exitFullScreenPlayback,
  //   // setPopulatedPhotoCollage,
} from '../controller';
import {
  getPlaybackActive,
  getFullScreenDisplay,
  getSelectedPhotoIndex,
  getActiveToolbarItem,
} from '../selector';
import {
  // enterFullScreenDisplay,
  setActiveToolbarItem,
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
  activeToolbarItem: ToolbarItem;
  selectedPhotoIndex: number;
  fullScreenDisplay: boolean;
  priorPhotosInCollage: CollageItemSpec[];
  // onRestartPlayback: () => any;
  // onStartPlayback: () => any;
  onResumePlayback: () => any;
  onStopPlayback: () => any;
  onSetSelectedPhotoIndex: (selectedPhotoIndex: number) => any;
  onEnterFullScreenPlayback: () => any;
  onExitFullScreenPlayback: () => any;
  onSetActiveToolbarItem: (activeToolbarItem: ToolbarItem) => any;
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

const PhotoCollage = (props: PhotoCollageProps) => {

  const [open, setOpen] = React.useState(false);

  const [_selectedPhoto, setSelectedPhoto] = React.useState<DisplayedPhoto | undefined>(undefined);

  const classes = useStyles();

  const resetEventHandlers = (): void => {
    if (platform === 'BrightSign') {
      // (irReceiver as any).removeEventListener('remotedown', handleRemoteDown);
      // (irReceiver as any).addEventListener('remotedown', handleRemoteDown);
      (irReceiver as any).onremotedown = null;
      irReceiver.onremotedown = (e: any) => {
        handleRemoteDown(e);
      };
    }
  };

  const getBackIcon = () => {

    if (props.activeToolbarItem === ToolbarItem.Back) {
      return (
        <IconButton
          id={'back'}
          onClick={handleBack}>
          <ArrowBack
            fontSize='large'
            style={{ color: 'green' }}
          />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          id={'back'}
          onClick={handleBack}>
          <ArrowBack
            fontSize='large'
          />
        </IconButton>
      );
    }
  };

  const getPauseOrPlaybackIcon = () => {

    if (props.activeToolbarItem === ToolbarItem.PlayPause) {
      return (
        <IconButton
          id={'1'}
          onClick={handlePlay}>
          <PlayArrow style={{ color: 'green' }} />
        </IconButton>
      );
    } else {
      return (
        <IconButton
          id={'1'}
          onClick={handlePlay}>
          <PlayArrow />
        </IconButton>
      );
    }

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

    if (props.fullScreenDisplay) {
      return (
        <IconButton
          id={'fullScreenExit'}
          onClick={handleExitFullScreenDisplay}>
          <FullscreenExit />
        </IconButton>
      );
    }
    else {
      if (props.activeToolbarItem === ToolbarItem.FullScreen) {
        return (
          <IconButton
            id={'fullScreenDisplay'}
            onClick={handleDisplayFullScreen}>
            <Fullscreen
              style={{ color: 'green' }}
            />
          </IconButton>
        );
      } else {
        return (
          <IconButton
            id={'fullScreenDisplay'}
            onClick={handleDisplayFullScreen}>
            <Fullscreen />
          </IconButton>
        );
      }
    }
  };

  const handleRemoteDown = (e: any) => {
    console.log('############ handleRemotedown: ' + e.irType + ' - ' + e.code);
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
    if (props.playbackActive) {
      props.onStopPlayback();
      props.onSetSelectedPhotoIndex(-1);
      props.onSetActiveToolbarItem(ToolbarItem.PlayPause);
    } else {
      switch (props.activeToolbarItem) {
        case ToolbarItem.Back:
          console.log('execute Back');
          break;
        case ToolbarItem.PlayPause:
        default:
          props.onResumePlayback();
          break;
        case ToolbarItem.FullScreen:
          props.onEnterFullScreenPlayback();
          break;
      }
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
    props.onResumePlayback();
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
    props.onExitFullScreenPlayback();
  };

  const handleArrowLeft = () => {

    if (props.playbackActive) {
      return;
    }

    let selectedPhotoIndex: number = props.selectedPhotoIndex as number;
    if (selectedPhotoIndex < 0) {
      switch (props.activeToolbarItem) {
        case ToolbarItem.PlayPause:
          props.onSetActiveToolbarItem(ToolbarItem.Back);
          break;
        case ToolbarItem.FullScreen:
          props.onSetActiveToolbarItem(ToolbarItem.PlayPause);
          break;
      }
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

    if (props.playbackActive) {
      return;
    }

    let selectedPhotoIndex: number = props.selectedPhotoIndex as number;
    if (selectedPhotoIndex < 0) {
      switch (props.activeToolbarItem) {
        case ToolbarItem.Back:
          props.onSetActiveToolbarItem(ToolbarItem.PlayPause);
          break;
        case ToolbarItem.PlayPause:
          props.onSetActiveToolbarItem(ToolbarItem.FullScreen);
          break;
      }
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

    if (props.playbackActive) {
      return;
    }

    let selectedPhotoIndex: number = props.selectedPhotoIndex as number;
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

    if (props.playbackActive) {
      return;
    }

    let selectedPhotoIndex: number = props.selectedPhotoIndex as number;
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
    if (props.playbackActive) {
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

  resetEventHandlers();

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
  return {
    playbackActive: getPlaybackActive(state),
    activeToolbarItem: getActiveToolbarItem(state),
    selectedPhotoIndex: getSelectedPhotoIndex(state),
    fullScreenDisplay: getFullScreenDisplay(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onResumePlayback: resumePlayback,
    onStopPlayback: stopPlayback,
    onSetSelectedPhotoIndex: setSelectedPhotoIndex,
    onEnterFullScreenPlayback: enterFullScreenPlayback,
    onExitFullScreenPlayback: exitFullScreenPlayback,
    onSetActiveToolbarItem: setActiveToolbarItem,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCollage);
