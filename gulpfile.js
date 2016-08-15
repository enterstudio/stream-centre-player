const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const ts          = require("gulp-typescript");

const paths = {
    src: {
        html: "src/index.html",
        js: "src/player.ts",
        css: "src/player.css"
    },
    libs: {
        dashjs: "node_modules/dashjs/dist/dash.all.min.js"
    },
    dest: "dist"
};

const tsProject = ts.createProject("tsconfig.json");

// Static server
gulp.task('default', ['build'], () => {
    browserSync.init({
        server: {
            baseDir: paths.dest
        }
    });

    gulp.watch(paths.src.html, ['build:html']);
    gulp.watch(paths.src.css, ['build:css']);
    gulp.watch(paths.src.js, ['build:js']);
});

gulp.task('build', ['build:libs', 'build:html', 'build:js', 'build:css']);

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
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
});

gulp.task('build:html', () => {
    return gulp.src([
            paths.src.html,
        ])
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream());
});
