var video = document.getElementsByTagName('video')[0],
    test1 = 'video/mp4; codecs="avc1"',
    test2 = 'video/mp4; codecs="avc1.4D401E"';

console.info('yo!', new Date());
console.info('- Can play ' + test1 + '?');
console.info(video.canPlayType(test1));
console.info('- Can play ' + test2 + '?');
console.info(video.canPlayType(test2));

var Qoollo;
+function (Qoollo) {
    +function (StreamCentre) {

        /**
         * @class
         *  Wraps HTMLVideoElement and dash.js to provide useful player API.
         *
         * @param {HTMLVideoElement} element
         */
        function Player(element) {
            var mediaPlayer = dashjs.MediaPlayer().create(),
                self = this;
				
			mediaPlayer.on('error', onMediaPlayerError);

            this.initialize = function initialize(url) {
                mediaPlayer.initialize(element, url, false);
            }

            this.play = function play() {
                mediaPlayer.play();
            }

            this.pause = function pause() {
                mediaPlayer.pause();
            }

            /**
             * @param {Number|String} offsetSec 
             *  A relative time, in seconds, based on the return value of the {@link module:MediaPlayer#duration duration()} method is expected
             */
            this.seek = function seek(offsetSec) {
                if (typeof offsetSec === 'string') {
                    if (offsetSec.indexOf(',') !== -1)
                        offsetSec = offsetSec.replace(',', '.');
                    offsetSec = Number(offsetSec);
                }
                if (isNaN(offsetSec))
                    console.error('Argument error in seek(offsetSec). Failed to convert "offsetSec" argument to Number.');

                mediaPlayer.seek(offsetSec);
            }
			
			function onMediaPlayerError(e) {
				console.error('MediaPlayer error: ', e);
				if (e && e.event && e.event.id) {
					if (e.event.id === 'codec')
						showCodecNotSupported();
				}
			}
			
			function showCodecNotSupported() {
				var banner = document.getElementById('codec-not-supported');
				banner.classList.remove('hidden');
				element.classList.add('hidden');
			}
        }
        StreamCentre.player = new Player(document.getElementById('video-player'));

    }(Qoollo.StreamCentre || (Qoollo.StreamCentre = {}))
}(Qoollo || (Qoollo = {}));