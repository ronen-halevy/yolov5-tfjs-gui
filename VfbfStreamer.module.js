class VfbfStreamer {
	/**
	 * Brief description of the class here
	 * @extends ParentClassNameHereIfAny
	 */
	constructor(frameCallback, endedCallback) {
		this.videoObject = document.createElement('video');
		this.frameCallback = frameCallback;
		this.endedCallback = endedCallback;
	}

	stopVideo = () => {
		this.videoObject.pause();
		this.videoObject.currentTime = 0;
	};

	setPlaybackRate = (rate) => {
		this.videoObject.playbackRate = parseFloat(rate);
	};

	setCurrentTime(value) {
		this.videoObject.currentTime = value;
	}

	animationControl = () => {
		var id = window.requestAnimationFrame(() =>
			this.frameCallback(
				this.videoObject,
				this.videoObject.currentTime,
				this.videoObject.duration
			)
		);
		if (
			this.videoObject.currentTime >= this.videoObject.duration ||
			this.videoObject.paused
		) {
			cancelAnimationFrame(id);
			this.endedCallback();
		}
	};

	playVideo = (url) => {
		if (!this.videoObject.paused) {
			// pause if playing
			this.videoObject.pause();
			return false;
		}

		if (url != this.dataUrl) {
			// if new video - restart.
			this.videoObject.currentTime = 0;
		}
		this.dataUrl = url;

		if (this.videoObject.currentTime) {
			// resume
			this.videoObject.play();
			this.frameCallback(
				this.videoObject,
				this.videoObject.currentTime,
				this.videoObject.duration
			);
			return true;
		} else {
			// start new video
			this.videoObject.preload = 'auto';
			this.videoObject.crossOrigin = 'anonymous';
			this.videoObject.src = url;
			this.videoObject.play();

			new Promise((resolve) => {
				this.videoObject.onloadedmetadata = () => {
					resolve();
				};
			}).then(() => {
				this.durationOfVideo = this.videoObject.duration;
				this.frameCallback(
					this.videoObject,
					this.videoObject.currentTime,
					this.videoObject.duration
				);
			});
			return true;
		}
	};
}

const streamer = { VfbfStreamer: VfbfStreamer };
module.exports = streamer;
