var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    minifyCss = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyHtml = require('gulp-htmlmin'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    argv = require('yargs').argv;

var sourceRoot = './src/';
var outputRoot = './build/';

var scssFiles = [
    sourceRoot + 'sass/*.scss'
];

gulp.task('scss', function (cb) {
   gulp.src(scssFiles)
        .pipe(gulpIf(!argv.production,sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(gulp.dest(outputRoot + 'css'));
        cb();
});

gulp.task('minifyHtml', function (cb) {
    return gulp.src([sourceRoot + '*.html', sourceRoot + '**/*.html'])
        .pipe(minifyHtml({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(outputRoot));
});

gulp.task('clean', function (cb) {
    try {
        var targets = [outputRoot + '**/*.*'],
            paths = del.sync(targets);
        gutil.log('Deleted files/folders:\n', paths.join('\n'));
    } catch (e) {
        gutil.log('Error - cleanOutputFiles');
    }
    cb()
});

gulp.task('default', gulp.series('clean', gulp.parallel('scss', 'minifyHtml')));