var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var revRewrite = require('gulp-rev-rewrite');
var browserSync = require('browser-sync').create();
var modRewrite = require('connect-modrewrite');

/** load config file based on enviroment */
var config = {
    srcFolder: './src/',
    distFolder: './public/build/'
};

/**
 *  1. Concatenates the JS and CSS files in bundle.js and style.css respectively
 *  2. Copies all other HTML and image files into public/build folder
 *  3. Updates the index.html code to point to the latest js and css files.
 */
gulp.task('compile-code', gulp.series(function () {
    return Promise.all([
        new Promise(function (resolve, reject) {
            gulp.src([
                './src/assets/js/*.js',
                './src/app.js',
                './src/config.js',
                './src/controllers/*.js',
                './src/services/*.js',
                './src/directives/directive.js'])
                .pipe(concat('bundle.js'))
                .pipe(rev())
                .pipe(gulp.dest(config.distFolder + 'assets/js'))
                .pipe(rev.manifest('./rev-manifest.json', {
                    merge: true
                }))
                .on('error', reject)
                .pipe(gulp.dest('./'))
                .on('end', resolve);
        }),
        new Promise(function (resolve, reject) {
            gulp.src(['./src/assets/css/*.css'])
                .pipe(concat('style.css'))
                .pipe(cleanCss())
                .pipe(rev())
                .pipe(gulp.dest(config.distFolder + 'assets/css'))
                .pipe(rev.manifest('./rev-manifest.json', {
                    merge: true
                }))
                .on('error', reject)
                .pipe(gulp.dest('./'))
                .on('end', resolve);
        }),
        new Promise(function (resolve, reject) {
            gulp.src(['./src/assets/img/*'])
                .on('error', reject)
                .pipe(gulp.dest(config.distFolder + 'assets/img'))
                .on('end', resolve);
        }),
        new Promise(function (resolve, reject) {
            gulp.src(['./src/views/*.html'])
                .on('error', reject)
                .pipe(gulp.dest(config.distFolder + 'views/'))
                .on('end', resolve);
        }),
        new Promise(function (resolve, reject) {
            gulp.src(['./src/robots.txt'])
                .on('error', reject)
                .pipe(gulp.dest(config.distFolder))
                .on('end', resolve);
        })
    ]).then(function () {
        gulp.src(config.srcFolder + '/index.html')
            .pipe(revRewrite({ manifest: gulp.src('./rev-manifest.json') }))
            .pipe(gulp.dest(config.distFolder))
            .pipe(browserSync.reload({
                stream: true
            }))
            .pipe(gulp.dest(config.distFolder));
    });
}));

// Observes the file changes and executes the tasks when need to update the local browser
gulp.task('watch', gulp.series('compile-code', function () {
    browserSync.init({
        server: {
            baseDir: config.distFolder + '',
            middleware: [
                modRewrite(['!\.html|\.js|\.jpg|\.mp4|\.mp3|\.gif|\.svg\|.css|\.png$ /index.html [L]'])
            ]
        },
        browser: 'chrome'
    });

    var watcher = gulp.watch([
        './src/views/*.html',
        './src/index.html',
        './src/assets/css/*.css',
        './src/**/*.js'],
        gulp.series('compile-code'));

    watcher.on('change', async function (path, stats) {
        browserSync.notify("Compiling, please wait!");
        browserSync.reload();
    });
}));

gulp.task('build', gulp.series('compile-code'));
gulp.task('default', gulp.series('watch'));
