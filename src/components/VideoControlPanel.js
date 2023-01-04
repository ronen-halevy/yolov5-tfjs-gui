import React, { Component } from 'react';
import ModelSelectionPanel from './ModelSelectionPanel';
import ConfigurationsPanel from './ConfigurationsPanel';
import DataSourceSelectionPanel from './DataSourceSelectionPanel';

//import VfbfStreamer from 'https://cdn.jsdelivr.net/gh/ronen-halevy/vfbf-streamer/VfbfStreamer.min.js';
import VfbfStreamer from '../VfbfStreamer.js';

import YoloPredictor from '../yolov3/YoloV3temp.js';
import Render from '../yolov3/Render.js';

// import YoloPredictor from 'https://cdn.jsdelivr.net/gh/ronen-halevy/yolov3-tfjs/src/yolov3/YoloV3temp.min.js';

export default class VideoControlPanel extends Component {
  constructor(props) {
    super(props);

    this.vfbfStreamer = new VfbfStreamer(
      this.playCallback,
      this.videoEndedCallback
    );

    this.state = {
      isVideoPlaying: false,
      videoRate: 1,
      fps: 0,
      currentTime: 0.0,
      duration: 0.0,
      scale: 0.5,
    };
    this.canvasRefVideo = React.createRef();
    this.isReady = false;
  }

  componentDidMount() {
    this.yoloPredictor = new YoloPredictor();
    this.yoloPredictor.setAnimationCallback(this.feedAnimationControl);

    this.draw = new Render(this.canvasRefVideo.current);
    this.isReady = true;
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
  videoEndedCallback = () => {
    this.setState({ isVideoPlaying: false });
  };

  playCallback = (frame, currentTime, duration) => {
    this.yoloPredictor.detectFrameVideo(frame).then((reasultArrays) => {
      if (duration) {
        var imageHeight = frame.videoHeight * this.state.scale;
        var imageWidth = frame.videoWidth * this.state.scale;
      } else {
        var imageHeight = frame.height * this.state.scale;
        var imageWidth = frame.width * this.state.scale;
      }
      let [selBboxes, scores, classIndices] = reasultArrays;
      this.draw.renderOnImage(
        frame,
        selBboxes,
        scores,
        classIndices,
        this.classNames,
        imageWidth,
        imageHeight
      );
      // avoid if image (not a video):
      if (duration) {
        const fps = this.findFps();
        this.setState({
          fps: fps,
          currentTime: currentTime.toFixed(1),
          duration: duration.toFixed(1),
        });
        this.feedAnimationControl();
      }
    });
  };

  feedAnimationControl = () => {
    this.vfbfStreamer.getAnimationControl()();
  };
  onClickVideoSpeed = (e) => {
    const rate =
      this.state.videoRate * 2 > 2.0 ? 0.5 : this.state.videoRate * 2;
    this.vfbfStreamer.setPlaybackRate(rate);
    this.setState({ videoRate: rate });
  };
  onClickScale = (e) => {
    const scale = this.state.scale * 2 > 2.0 ? 0.125 : this.state.scale * 2;
    this.setState({ scale: scale });
  };

  onClickPlay = () => {
    if (this.dataType == 'video') {
      var isVideoPlaying = this.vfbfStreamer.playVideo(
        this.dataUrl
        // this.props.dataType
      );
    } else {
      var isVideoPlaying = this.vfbfStreamer.playImage(this.props.dataUrl);
    }
    this.setState({ isVideoPlaying: isVideoPlaying });
  };

  updateVideoDuration = (e) => {
    this.setState({ currentTime: parseFloat(e.target.value) });
    this.vfbfStreamer.setCurrentTime(e.target.value);
  };

  onLoadModel = (model, anchors, classNames) => {
    this.yoloPredictor.setModelParams(model, anchors, classNames.length);

    this.classNames = classNames;
  };

  setScoreTHR = (val) => {
    this.yoloPredictor.setScoreTHR(val);
  };
  setIouTHR = (val) => {
    this.yoloPredictor.setIouTHR(val);
  };
  setMaxBoxes = (val) => {
    this.yoloPredictor.setMaxBoxes(val);
  };

  onClickSetDataSource = (url, type) => {
    this.dataUrl = url;
    this.dataType = type;
  };

  render() {
    const {} = this.props;
    const onClickPlay = this.onClickPlay;
    return (
      <div className='container '>
        <div className='col '>
          {this.isReady && (
            <ModelSelectionPanel onLoadModel={this.onLoadModel} />
          )}

          <div className='configButtons mt-3 border border-1 border-secondary position-relative'>
            <span className='position-absolute top-0  start-50 translate-middle badge rounded-pill bg-primary'>
              Configurations
            </span>
            <div className='row mb-2'>
              <ConfigurationsPanel
                setScoreTHR={this.setScoreTHR}
                setIouTHR={this.setIouTHR}
                setMaxBoxes={this.setMaxBoxes}
              />
            </div>
          </div>

          <div className='dataSource mt-3 border border-1 border-secondary position-relative '>
            <span className='position-absolute top-0  start-50 translate-middle badge rounded-pill bg-primary  '>
              Data Source Selection
            </span>
            <DataSourceSelectionPanel
              onClickSetDataSource={this.onClickSetDataSource}
            />
          </div>

          {/* <div className='controlVideo  border border-1 border-secondary position-relative'> */}
          <div className=' row text-center'>
            <div className=' col'>
              <div className=' col-sm text-center badge rounded-pill bg-primary text-center'>
                Video Control
              </div>
            </div>
          </div>

          {/* </div> */}

          <div className='col bg-warning bg-gradient'>
            <div className='container'>
              <div className='row'>
                <div className='col-3  text-center '>
                  <div className='col  text-center '>
                    <span
                      className='btn btn btn-dark  btn-lg  mb-1 position-relative badge '
                      onClick={onClickPlay}
                    >
                      {' '}
                      {!this.state.isVideoPlaying ? (
                        <div>play</div>
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
                </div>
                {/* scale button */}

                <div className='col-2 text-center'>
                  {' '}
                  <span
                    className='badge text-bg-dark  position-relative'
                    onClick={this.onClickScale}
                  >
                    {' '}
                    scale
                    <span className='position-absolute top-0 start-50 translate-middle badge rounded-pill bg-success '>
                      x{this.state.scale}
                    </span>
                  </span>
                </div>
                {/* Speed button */}

                <div className='col-2 text-center'>
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

                <div className='col-2 text-center'>
                  {' '}
                  <span className='badge text-bg-light   position-relative'>
                    <span className=' '>fps: {this.state.fps}</span>
                  </span>
                </div>
                <div className='col-3 text-center'>
                  <span className='badge text-bg-light  position-relative'>
                    <span className='text-center'>
                      {this.state.currentTime}/{this.state.duration}
                    </span>
                  </span>
                </div>
              </div>
              <input
                type='range'
                className='form-range'
                min='0'
                max={this.state.duration}
                step='0.1'
                id='customRange3'
                value={this.state.currentTime}
                onChange={this.updateVideoDuration}
              />
            </div>
          </div>
          <label className='btn btn-dark   badge ' onClick={this.onClickPlay}>
            {!this.state.isVideoPlaying ? 'Play' : 'Stop'}
            <canvas
              className='visible'
              ref={this.canvasRefVideo}
              width=''
              height=''
            />
          </label>
        </div>
      </div>
    );
  }
}
