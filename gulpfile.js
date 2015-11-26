var gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	sass = require('gulp-ruby-sass'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	watch = require('gulp-watch'),
	stringify = require('stringify'),
	watchify = require('watchify'),
	browserify = require('browserify'),
	reactify = require('reactify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	colors = require('colors');

var files = ['app/src/**/*.js', '!app/src/vendor/**/*'];

gulp.task('sass', function () {
	return sass('./app/styles/**/*.scss')
		.pipe(gulp.dest('./app/build/styles'));
});

var bundle = function (bundler, filename) {
	return function () {
		console.log('writing [', colors.green(filename), ']');
		return bundler.bundle()
		// log errors if they happen
		.on('error', function (error) {
			console.error(error.message);
			// console.error(error.filename, error.lineNumber)
		})
		.pipe(source(filename))
		.pipe(gulp.dest('./app/build/src/'));
	};
};

var bundler = watchify(browserify('./app/src/app.js', watchify.args));
// add any other browserify options or transforms here
bundler.transform(reactify)
	.transform(stringify(['.html']));

gulp.task('browserify-watchify', bundle(bundler, 'bundle.js')); // so you can run `gulp js` to build the file
bundler.on('update', bundle(bundler, 'bundle.js')); // on any dep update, runs the bundler
bundler.on('log', console.log);

gulp.task('watch', function() {
	// watch scss files
	gulp.watch('app/styles/**/*.scss', ['sass']);

	gulp.watch(files, ['jshint']);
});
 
gulp.task('browserify', function() {
	return watchify(browserify('./app/src/app.js'), watchify.args)
		// Register handlebars transform
		.transform(hbsfy)
		.transform(reactify)
		.transform(stringify(['.html']))
		.bundle()
		//Pass desired output filename to vinyl-source-stream
		.pipe(source('bundle.js'))
		// Start piping stream to tasks!
		.pipe(gulp.dest('./app/build/src/'));
});

gulp.task('browserify-minify', function() {
	return browserify('./app/src/app.js')
		// Register handlebars transform
		.transform(reactify)
		.transform(stringify(['.html']))
		.bundle()
		//Pass desired output filename to vinyl-source-stream
		.pipe(source('bundle-minified.js'))
		// minify
		.pipe(buffer())
		.pipe(uglify())
		// Start piping stream to tasks!
		.pipe(gulp.dest('./app/build/src/'));
});

gulp.task('jshint', function () {
	gulp.src(files)
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['sass', 'browserify-watchify', 'watch']);
gulp.task('build', ['browserify-watchify', 'sass']);