var video = document.getElementsByTagName('video')[0],
    test1 = 'video/mp4; codecs="avc1"',
    test2 = 'video/mp4; codecs="avc1.4D401E"';

console.info('yo!', new Date());
console.info('- Can play ' + test1 + '?');
console.info(video.canPlayType(test1));
console.info('- Can play ' + test2 + '?');
console.info(video.canPlayType(test2));

module Qoollo.StreamCentre {    

    export const player = new Player(<HTMLVideoElement>document.getElementById('video-player'));

    class Logger {

        private logs: string[] = [];
        private startTime: Date = new Date();

        public log(msg: string) {
            var diff = new Date().getTime() - this.startTime.getTime(),
                h = Math.floor(diff / 3600000),
                m = Math.floor((diff - h * 60 * 60 * 1000) / 60000),
                s = Math.floor((diff - m * 60 * 1000 - h * 60 * 60 * 1000) / 1000),
                ms = Math.floor(diff - s * 1000 - m * 60 * 1000 - h * 60 * 60 * 1000),
                diffStr = this.padZeroes(h, 2) + ':' + this.padZeroes(m, 2) + ':' + this.padZeroes(s, 2) + '.' + this.padZeroes(ms, 3);
            this.logs.push(diffStr + ' ' + msg);
            this.printToConsole();
        }

        private printToConsole() {
            console.group('StreamCentreVideoPlayer logs');
            this.logs.forEach(function (l) { console.log(l) });
            console.groupEnd();
        }

        private padZeroes(value: string|number, count: number) {
            var res = '' + value;
            while (res.length < count) {
                res = '0' + res;
            }
            return res;
        }
    }

    /**
     * @class
     *  Wraps HTMLVideoElement and dash.js to provide useful player API.
     *
     * @param {HTMLVideoElement} element
     */
    class Player {
        private logger: Logger;
        private mediaPlayer: DashJs.IMediaPlayer;
        private element: HTMLVideoElement;

        constructor(element: HTMLVideoElement) {
            this.element = element;
            this.logger = new Logger();

            this.mediaPlayer = dashjs.MediaPlayer().create();
            this.subscribeMediaPlayerEvents();
        }

        public initialize(url: string) {
            this.mediaPlayer.initialize(this.element, url, false);
            this.logger.log('initialize("' + url + '")');
        }

        public play() {
            this.mediaPlayer.play();
            this.logger.log('play()');
        }

        public pause() {
            this.mediaPlayer.pause();
            this.logger.log('pause()');
        }

        /**
         * @param {Number|String} offsetSec 
         *  A relative time, in seconds, based on the return value of the {@link module:MediaPlayer#duration duration()} method is expected
         */
        public seek(offsetSec: number|string) {
            if (typeof offsetSec === 'string') {
                if ((<string>offsetSec).indexOf(',') !== -1)
                    offsetSec = (<string>offsetSec).replace(',', '.');
                offsetSec = Number(offsetSec);
            }
            if (isNaN((<number>offsetSec)))
                console.error('Argument error in seek(offsetSec). Failed to convert "offsetSec" argument to Number.');

            this.mediaPlayer.seek(<number>offsetSec);
            this.logger.log('seek(' + offsetSec + ')');
        }

        private subscribeMediaPlayerEvents() {
            [
                dashjs.MediaPlayer.events.ERROR,
                dashjs.MediaPlayer.events.STREAM_INITIALIZED,
                dashjs.MediaPlayer.events.CAN_PLAY,
                dashjs.MediaPlayer.events.PLAYBACK_PLAYING,
                dashjs.MediaPlayer.events.PLAYBACK_PAUSED,
                dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED,
                dashjs.MediaPlayer.events.PLAYBACK_ENDED
            ].forEach(e => this.mediaPlayer.on(e, ev => this.onMediaPlayerEvent(ev)));
        }

        private onMediaPlayerEvent(e: DashJs.IMediaPlayerEvent) {
            switch (e.type) {
                case dashjs.MediaPlayer.events.ERROR:
                    if (e.event.id === 'codec') {
                        this.showCodecNotSupported();
                    }
                    this.logger.log('Event: ' + e.type);
                    this.executeCallback(e);
                    break;
                case dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED:
                    this.executeCallback(e);
                    break;
                default:
                    this.logger.log('Event: ' + e.type);
                    this.executeCallback(e);
                    break;
            }
        }

        private executeCallback(e: DashJs.IMediaPlayerEvent) {
            if (typeof BrowserCallback !== 'undefined' && BrowserCallback.call) {
                BrowserCallback.call('handleDashJsEvent', e);
            }
        }

        private showCodecNotSupported() {
            var banner = document.getElementById('codec-not-supported');
            banner.classList.remove('hidden');
            this.element.classList.add('hidden');
        }
    }
}