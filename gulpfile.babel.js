import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

// Options
const $ = gulpLoadPlugins({
  pattern: ['gulp-*']
});
const SRC = './src';
const DIST = './dist';

gulp.task('typescript', () => {
  const project = $.typescript.createProject('tsconfig.json');
  const tsResult = project.src().pipe($.typescript(project));
  return tsResult.js.pipe(gulp.dest(`${DIST}/js/app`));

});