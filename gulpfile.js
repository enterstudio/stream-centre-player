const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const ts          = require("gulp-typescript");
const browserify  = require("browserify");
const source      = require('vinyl-source-stream');
const tsify       = require("tsify");
const watchify    = require("watchify");
const gutil       = require("gulp-util");
const runSequence = require('run-sequence');
const clean       = require("gulp-clean");

const paths = {
    src: {
        html: "src/index.html",
        js: "src/main.ts",
        css: "src/player.css"
    },
    libs: {
        dashjs: "node_modules/dashjs/dist/dash.all.min.js"
    },
    dest: "dist"
};

var browserified = null;

function createBrowserifiedBundle(debug, watch) {
    if (browserified === null) {
        debug = !!debug;
        browserified = browserify({
            basedir: '.',
            debug: debug,
            entries: [paths.src.js],
            cache: {},
            packageCache: {}
        }).plugin(tsify);

        watch = !!watch;
        if (watch) {
            browserified = watchify(browserified);
        }
    }
}

function bundle() {    
    return browserified
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
}

gulp.task('default', ['watch']);

gulp.task('watch', () => {
    createBrowserifiedBundle(true, true);
    return runSequence(
        'build',
        () => {
            browserSync.init({
                server: {
                    baseDir: paths.dest
                }
            });

            gulp.watch(paths.src.html, ['build:html']);
            gulp.watch(paths.src.css, ['build:css']);
            browserified.on("update", bundle);
            browserified.on("log", gutil.log);
        }
    );
});

gulp.task('build', (cb) => {
    runSequence(
        'clean',
        ['build:libs', 'build:html', 'build:js', 'build:css'],
        cb
    );
});

gulp.task('build:libs', () => {
    return gulp.src([
            paths.libs.dashjs,
        ])
        .pipe(gulp.dest(paths.dest));
});

gulp.task('build:css', () => {
    return gulp.src([
            paths.src.css,
        ])
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
});

gulp.task('build:js', () => {
    createBrowserifiedBundle(false, false);
    bundle();
});

gulp.task('build:html', () => {
    return gulp.src([
            paths.src.html,
        ])
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
});

gulp.task('clean', () => {
    return gulp.src(paths.dest, {read: false})
        .pipe(clean());
});
