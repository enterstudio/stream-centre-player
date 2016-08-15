import { Player } from "./Player";

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
}