
export class Logger {

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