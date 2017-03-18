/**
 * Automatic some task.
 *
 * @author Nguyen Trương <me@nguyentd.me>
 * @copyright (c) 2017 Nguyen Truong
 * @license MIT
 */

'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const nodemon = require('gulp-nodemon')
const sass = require('gulp-sass')
const browserify = require('gulp-browserify')
const uglify = require('gulp-uglify')

const BS_RELOAD_DELAY = 500

gulp.task('lazy-server', callback => {
  let callbackCalled = false

  return nodemon({
    script: 'index.js',
    env: { 'NODE_ENV': 'development' },
    ignore: [
      'node_modules/',
      'public/',
      'resources/',
      'gulpfile.js'
    ]
  }).on('start', () => {
    // ensures the 'start' event only got called once
    if (!callbackCalled) {
      callback()
    }
    callbackCalled = true
  }).on('restart', () => {
    // reload browsers after nodemon restart
    setTimeout(() => {
      browserSync.reload({
        stream: false
      })
    }, BS_RELOAD_DELAY)
  })
})

gulp.task('lazy-browser', [ 'lazy-server' ], () => {
  browserSync.init({
    proxy: 'localhost:3000',
    port: 9000
  })
})

gulp.task('js', () => {
  return gulp.src('./resources/js/**/*.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
})

// ensures the 'js' task is complete before reloading browsers
gulp.task('js-watch', [ 'js' ], done => {
  browserSync.reload()
  done()
})

gulp.task('sass', () => {
  return gulp.src('./resources/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream())
})

gulp.task('build', [ 'js', 'sass' ])

gulp.task('default', [ 'lazy-browser' ], () => {
  gulp.watch('./resources/js/**/*.js', [ 'js-watch' ])
  gulp.watch('./resources/sass/**/*.scss', [ 'sass', browserSync.reload ])
  gulp.watch('./resources/views/**/*.html').on('change', browserSync.reload)
})
