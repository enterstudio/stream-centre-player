require("dashjs");
import { EventEmitter } from './EventEmitter';
import { Logger } from "./Logger";

export interface IPlayerSettings {
    controls?: boolean;
    poster?: string;
}

function getDefaultSettings(): IPlayerSettings {
    return {
        controls: false,
        poster: null,
    };
}

/**
 *  Wraps HTMLVideoElement and dash.js to provide useful player API.
 */
export class Player extends EventEmitter {
    private logger: Logger;
    private mediaPlayer: DashJs.IMediaPlayer;
    private element: HTMLVideoElement;
    private settings: IPlayerSettings;

    constructor(element: HTMLVideoElement, settings: IPlayerSettings = getDefaultSettings()) {
        super();
        this.element = element;
        this.settings = settings;
        this.logger = new Logger();

        this.element.controls = !!this.settings.controls;
        this.element.poster = this.settings.poster;
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

    public getDuration(): number {
        return this.mediaPlayer.duration();
    }

    public getCurrentTime(): number {
        return this.mediaPlayer.time();
    }

    private convertErrorEventToString(e: DashJs.IMediaPlayerErrorEvent): string {
        let err: string = '',
            success: boolean = false;
        try {
            err = this.tryConvertErrorEventToString(e);
            success = err.length > 0;
        } catch (ex) {
            err + 'Failed to parse error reason. ';
        }
        if (!success) {
            for (let f in e) {
                if (e.hasOwnProperty(f)) {
                    err += e[f];
                }
            }
        }
        return err;
    }

    private tryConvertErrorEventToString(e: DashJs.IMediaPlayerErrorEvent): string {
        let res: string = '';
        switch (e.error) {
            case 'capability':
                res += 'Capability error. '
                if (e.event === 'mediasource') {
                    res += 'Media source is not supported.';
                } else if (e.event === 'encryptedmedia') {
                    res += 'Media content is encrypted. This is not supported.';
                } else {
                    res += 'Unknown error.';
                }
                break;
            case 'download':
                res += `Download error [${e.event.id}]. GET ${e.event.url} ${e.event.request.status} (${e.event.request.statusText})`;
                break;
            case 'manifestError':
                res += 'Manifest error. ';
                if (e.event.id === 'nostreamscomposed') {
                    res += 'No streams composed. ';
                }
                res += e.event.message;
                break;
            case 'cc':
                res += 'Subtitles error. ';
                if (e.event.id === 'parse') {
                    res += 'Failed to parse subtitles. ';
                }
                res += e.event.message;
                break;
            case 'mediasource':
                res += `Media source error. ${e.event}`;
                break;
            case 'key_session':
            case 'key_message':
                res += `Media source protection error (${e.error}). ${e.event}`;
                break;
            default:
                break;
        }
        return res;
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
                this.logger.log('Event: ' + e.type);
                this.dispatchEvent("error", {
                    type: 'error',
                    error: this.convertErrorEventToString(<DashJs.IMediaPlayerErrorEvent>e),
                    errorType: e.event.id === 'codec' ? 'CodecNotSupported' : null
                });
                break;
            case dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED:
                this.dispatchEvent("playbacktimechange", {
                    type: 'playbacktimechange',
                    time: e['time'],
                    timeToEnd: e['timeToEnd'],
                    description: 'All units are specified in seconds'
                });
                break;
            default:
                this.logger.log('Event: ' + e.type);
                break;
        }
    }
}