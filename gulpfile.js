var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templateCache = require('gulp-angular-templatecache');
var watch = require('gulp-watch');
var shell = require('gulp-shell');

// Sass + autoprefixer + sourcemaps
// http://fettblog.eu/blog/2014/04/10/gulp-sass-autoprefixer-sourcemaps/
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');

var paths = {
  sass: ['./scss/**/*.scss'],
  templates: ['./www/templates/**/*.html'],
  ts: [
    './www/ts/*.ts',
    './www/templates/**/*.ts'
  ]
};

gulp.task('serve', shell.task(['ionic serve']));
gulp.task('compile', shell.task(['tsc']));

gulp.task('cache', function () {
    gulp.src('./www/templates/**/*.html')
        .pipe(templateCache('templatescache.js', { module:'templatescache', standalone:true, root: 'templates/' }))
        .pipe(gulp.dest('./www/templates/'));
});

gulp.task('default', ['serve']);

gulp.task('sass', function(done) {
    sass('./scss/ionic.app.scss', {sourcemap: true, style: 'compact'})
        .pipe(prefix("last 5 version"))
        .pipe(sourcemaps.write('.'))
        // .pipe(minifyCss({
        //   keepSpecialComments: 0
        // }))
        // .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'));
    done();
});

gulp.task('watch', function() {
  gulp.watch(paths.templates, ['cache']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.ts, ['compile']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
