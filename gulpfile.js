var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');





function minimiza_css() {
    gulp.src('styles.css')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./prod/'));
}


//Tarea que minimiza CSSs esperando que se actualice versión y se pase a sass
gulp.task('styles-deploy', function() {
    minimiza_css();
});

gulp.task('html-deploy', function() {
  return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('prod'));
});

gulp.task('deploy-js', function () {
	gulp.src(['Explosion.js','Player.js','Ball.js','tiny_music.js','player-small.js','Game.js'])
	  .pipe(concat('tiny_dudevolley.min.js'))
	  .pipe(uglify())
	  .pipe(gulp.dest('prod/'));
});




gulp.task('deploy', ['html-deploy', 'styles-deploy', 'deploy-js']);
