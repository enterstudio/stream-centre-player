
declare module DashJs {
    interface IDashJsGlobal {
        MediaPlayer: IMediaPlayerModule;
    }

    interface IMediaPlayerModule {
        (): IMediaPlayerFactory;
        events: IMediaPlayerEvents;
    }

    interface IMediaPlayerFactory {
        create(): IMediaPlayer;
    }

    interface IMediaPlayer {
        /**
         * Upon creating the MediaPlayer you must call initialize before you call anything else. There is one exception to this rule. It is crucial to call extend() with all your extensions prior to calling initialize.
         * @param {HTMLVideoElement} view Optional arg to set the video element. See attachView()
         * @param {HTMLVideoElement} source Optional arg to set the media source. See attachSource()
         * @param {HTMLVideoElement} autoPlay Optional arg to set auto play. See setAutoPlay()
         */
        initialize(view?: HTMLVideoElement, source?: string, autoPlay?: boolean): void;

        /**
         * The play method initiates playback of the media defined by the attachSource() method. This method will call play on the native Video Element.
         */
        play(): void;

        /**
         * This method will call pause on the native Video Element.
         */
        pause(): void;

        /**
         * Sets the currentTime property of the attached video element. If it is a live stream with a timeShiftBufferLength, then the DVR window offset will be automatically calculated.
         */
        seek(value: number): void;

        /**
         * Duration of the media's playback, in seconds.
         * @returns {number} The current duration of the media.
         */
        duration(): number

        /**
         * Use the on method to listen for public events found in MediaPlayer.events. See MediaPlayerEvents
         * @param {string} type See MediaPlayerEvents
         * @param {Function} type callback method when the event fires.
         * @param {Object} type context of the listener so it can be removed properly.
         */
        on(type: string, listener: (e?: IMediaPlayerEvent) => any, scope?: Object): void;
    }

    interface IMediaPlayerEvents {
        BUFFER_EMPTY: string;
        BUFFER_LEVEL_STATE_CHANGED: string;
        BUFFER_LOADED: string;
        CAN_PLAY: string;
        ERROR: string;
        LOG: string;
        MANIFEST_LOADED: string;
        METRIC_ADDED: string;
        METRIC_CHANGED: string;
        METRIC_UPDATED: string;
        METRICS_CHANGED: string;
        PERIOD_SWITCH_COMPLETED: string;
        PERIOD_SWITCH_STARTED: string;
        PLAYBACK_ENDED: string;
        PLAYBACK_ERROR: string;
        PLAYBACK_METADATA_LOADED: string;
        PLAYBACK_PAUSED: string;
        PLAYBACK_PLAYING: string;
        PLAYBACK_PROGRESS: string;
        PLAYBACK_RATE_CHANGED: string;
        PLAYBACK_SEEKED: string;
        PLAYBACK_SEEKING: string;
        PLAYBACK_STARTED: string;
        PLAYBACK_TIME_UPDATED: string;
        QUALITY_CHANGE_COMPLETE: string;
        QUALITY_CHANGE_START: string;
        STREAM_INITIALIZED: string;
        TEXT_TRACK_ADDED: string;
        TEXT_TRACKS_ADDED: string;
    }

    interface IMediaPlayerEvent { 
        type: string;
        event: { 
            id: string 
        } 
    }
}

declare var dashjs: DashJs.IDashJsGlobal;
