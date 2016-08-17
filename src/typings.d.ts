/// <reference path="dashjs.d.ts" />

/**
 * Externally added object with function for js code to perform callback to
 * external environment. 
 */
declare var BrowserCallback: {
    call: (...args: any[]) => any
}

declare var require: (module: string) => any;