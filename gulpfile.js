"use strict"
const gulp = require('gulp');
const ts = require('gulp-typescript');
gulp.task('build:server', () => {
   let tsProyect = ts.createProject('tsconfig.json');
   let tsResult = gulp.src('server/**/*.ts')
      .pipe(tsProyect());
   return tsResult.js
      .pipe(gulp.dest('dist'));
});
gulp.task('watch', ['build:server'], () => {
   gulp.watch('server/**/*.ts', ['build:server']);
});
gulp.task('default', ['watch']);
