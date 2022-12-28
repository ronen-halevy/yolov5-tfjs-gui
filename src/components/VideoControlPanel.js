import React, { Component } from 'react';
import Player from '../Player';

export default class VideoControlPanel extends Component {
  constructor(props) {
    super(props);
    // todo add to config
    const height = 416;
    const width = 416;
    this.player = new Player(this.playCallback, height, width);

    this.state = {
      isVideoOn: false,
      isVideoPaused: false,
      videoRate: 1,
      fps: 0,
      currentTime: 0.0,
      duration: 0.0,
    };
  }

  findFps() {
    var thisLoop = new Date();
    const fps = (1000 / (thisLoop - this.lastLoop))
      .toFixed(2)
      .toString()
      .padStart(5, '0');

    this.lastLoop = thisLoop;
    return fps;
  }
  playCallback = (frame, currentTime, duration) => {
    if (frame) {
      this.props.frameCallback(frame);
      // avoid if image:
      if (duration) {
        const fps = this.findFps();
        this.setState({
          fps: fps,
          currentTime: currentTime.toFixed(1),
          duration: duration.toFixed(1),
        });
      }
    } else {
      // return nulls when completed:
      this.setPlayerStates(false, false);
    }
  };

  feedAnimationControl = () => {
    this.player.getAnimationControl()();
  };
  onClickVideoSpeed = (e) => {
    const rate =
      this.state.videoRate * 2 > 2.0 ? 0.5 : this.state.videoRate * 2;
    this.player.setPlaybackRate(rate);
    this.setState({ videoRate: rate });
  };
  // onClickVideoSpeed1 = (e) => {
  //   const speed = videoRate * 2 > 2.0 ? 0.5 : videoRate * 2;
  //   playbackRate = parseFloat(speed);
  // };

  onClickPlay = () => {
    this.player.setDataUrl(this.props.dataUrl, this.props.dataType);
    const isVideoOn = this.player.onClickPlay();

    this.setPlayerStates(isVideoOn, false);
    // const pause = res ? false : true;
  };
  setPlayerStates = (isVideoOn, isVideoPaused) => {
    this.setState({ isVideoOn: isVideoOn });
    // const pause = res ? false : true;
    this.setState({ isVideoPaused: isVideoPaused });
  };
  pause = () => {
    console.log('pause!!!!');
    const res = this.player.pauseResumeVideo();
    console.log('pause res', res);
    this.setState({ isVideoPaused: res });
  };
  updateVideoDuration = (e) => {
    this.setState({ currentTime: parseFloat(e.target.value) });
    this.player.setCurrentTime(e.target.value);
    // videoRef.current.currentTime = parseFloat(e.target.value);
  };
  render() {
    const {
      // onClickVideoSpeed,
      videoSpeed,
      // fps,
      currentDurationOfVideo,
      durationOfVideo,
      // isVideoOn,
      // pauseResumeVideo,
      // isVideoPaused,

      // onClickPlay,
    } = this.props;
    const onClickPlay = this.onClickPlay;
    return (
      <div className='row'>
        {/* Speed button */}
        <div className='col-4  text-center position-relative mb-1'></div>
        {/* Pause resume button */}
        <div className='col-4 text-center'>
          <span
            className='badge text-bg-dark mx-2'
            onClick={this.state.isVideoOn ? this.pause : () => {}}
          >
            {this.state.isVideoPaused ? 'resume' : 'pasue'}
          </span>
        </div>
        {/* Run-stop button */}
        <div className='col-4  text-center'>
          <span
            className='btn btn btn-dark  btn-lg  mb-1 position-relative badge '
            onClick={onClickPlay}
          >
            {' '}
            {!this.state.isVideoOn ? (
              <div>play </div>
            ) : (
              <div>
                Stop{' '}
                <span className='position-absolute top-0  start-50 translate-middle badge rounded-pill bg-success'>
                  Running
                </span>
              </div>
            )}
          </span>
        </div>
        {true && (
          <div className='col bg-warning bg-gradient'>
            <div class='container'>
              <div class='row'>
                <div class='col-sm text-center'>
                  {' '}
                  <span
                    className='badge text-bg-dark  position-relative'
                    onClick={this.onClickVideoSpeed}
                  >
                    {' '}
                    speed
                    <span className='position-absolute top-0 start-50 translate-middle badge rounded-pill bg-success '>
                      x{this.state.videoRate}
                    </span>
                  </span>
                </div>
                <div class='col-sm text-center'>
                  {' '}
                  <span className='badge text-bg-light   position-relative'>
                    <span className=' '>fps: {this.state.fps}</span>
                  </span>
                </div>
                <div class='col-sm text-center'>
                  {' '}
                  <span className='badge text-bg-light  position-relative'>
                    <span className=''>
                      {this.state.currentTime}/{this.state.duration}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <input
              type='range'
              className='form-range'
              min='0'
              max={this.state.duration}
              // step='0.5'
              id='customRange3'
              value={this.state.currentTime}
              onChange={this.updateVideoDuration}
            />
          </div>
        )}
      </div>
    );
  }
}
