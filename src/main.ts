import { Player } from "./Player";

var video = document.getElementsByTagName('video')[0],
    tests = [ 'video/mp4; codecs="avc1"', 'video/mp4; codecs="avc1.4D401E"' ];

console.group('StreamCentre VideoPlayer initialize');
tests.forEach(t => {
    console.log(`- Can play ${t}?`);
    console.log(`- ${video.canPlayType(t)}`);
});

module Qoollo.StreamCentre { 
    export const player = new Player(<HTMLVideoElement>document.getElementById('video-player'));
}

console.groupEnd();
