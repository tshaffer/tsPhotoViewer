import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';
import Replay from '@material-ui/icons/Replay';
import Fullscreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';
import Info from '@material-ui/icons/Info';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

import { isNil } from 'lodash';

import {
  PhotoCollageState,
  DisplayedPhoto,
  PhotoInCollageSpec,
} from '../type';
import PhotoCollageCanvas from './PhotoCollageCanvas';

import {
  restartPlayback,
  startPlayback,
  stopPlayback,
  enterFullScreenPlayback,
  exitFullScreenPlayback,
  setPopulatedPhotoCollage,
} from '../controller';
import {
  getPlaybackActive,
  getFullScreenDisplay,
  getPriorPhotosInCollage,
} from '../selector';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export interface PhotoCollageProps {
  playbackActive: boolean;
  fullScreenDisplay: boolean;
  priorPhotosInCollage: PhotoInCollageSpec[];
  onRestartPlayback: () => any;
  onStartPlayback: () => any;
  onStopPlayback: () => any;
  onEnterFullScreenPlayback: () => any;
  onExitFullScreenPlayback: () => any;
  onSetPopulatedPhotoCollage: (photosInCollage: PhotoInCollageSpec[]) => any;
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
          <p>{selectedPhoto.photoSpec.fileName}</p>
          <p>{selectedPhoto.photoSpec.filePath}</p>
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

  const handleClose = (resumePlayback: boolean) => {
    setOpen(false);
    if (resumePlayback) {
      props.onStartPlayback();
    }
  };

  const handleSelectPhoto = (selectedPhoto: DisplayedPhoto) => {
    setSelectedPhoto(selectedPhoto);
    setOpen(true);
  };

  const handlePlay = () => {
    setOpen(false);
    props.onStartPlayback();
  };

  const handlePause = () => {
    setSelectedPhoto(undefined);
    setOpen(false);
    props.onStopPlayback();
  };

  const handleReplay = () => {

    // get state of playback, restore at end of handler

    props.onStopPlayback();

    // get prior photos
    const priorPhotosInCollage: PhotoInCollageSpec[] = props.priorPhotosInCollage;
    if (priorPhotosInCollage.length === 0) {
      console.log('no prior photos');
      return;
    }
    else {
      // set current photos to prior photos
      props.onSetPopulatedPhotoCollage(priorPhotosInCollage);

      // cause them to get displayed
      // restart full playback as appropriate
      // TODO - probably starts playback
      props.onRestartPlayback();
    }
  };

  const handleDisplayFullScreen = () => {
    props.onEnterFullScreenPlayback();
  };

  const handleExitFullScreenDisplay = () => {
    props.onExitFullScreenPlayback();
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

  const getPauseOrPlaybackIcon = () => {

    if (props.playbackActive) {
      return (
        <IconButton
          id={'0'}
          onClick={handlePause}>
          <PauseCircleFilled />
        </IconButton>
      );
    }
    else {
      return (
        <IconButton
          id={'1'}
          onClick={handlePlay}>
          <PlayArrow />
        </IconButton>
      );
    }
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
      return (
        <IconButton
          id={'fullScreenDisplay'}
          onClick={handleDisplayFullScreen}>
          <Fullscreen />
        </IconButton>
      );
    }
  };

  const renderToolbar = () => {
    return (
      <div className={classes.toolbarDiv}>
        <IconButton
          id={'replay'}
          onClick={handleReplay}>
          <Replay />
        </IconButton>
        {getPauseOrPlaybackIcon()}
        {getFullScreenOrFullScreenExitIcon()}
      </div>
    );
  };

  return (
    <div className={classes.parentDiv}>
      <div className={classes.photoCollageDiv}>
        <PhotoCollageCanvas
          onSelectPhoto={handleSelectPhoto}
        />
        {renderDialog()}
      </div >
      {renderToolbar()}
    </div>
  );

};

function mapStateToProps(state: PhotoCollageState, ownProps: any): Partial<PhotoCollageProps> {
  return {
    playbackActive: getPlaybackActive(state),
    fullScreenDisplay: getFullScreenDisplay(state),
    priorPhotosInCollage: getPriorPhotosInCollage(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onStartPlayback: startPlayback,
    onRestartPlayback: restartPlayback,
    onStopPlayback: stopPlayback,
    onEnterFullScreenPlayback: enterFullScreenPlayback,
    onExitFullScreenPlayback: exitFullScreenPlayback,
    onSetPopulatedPhotoCollage: setPopulatedPhotoCollage,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCollage);
