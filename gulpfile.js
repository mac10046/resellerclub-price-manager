var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var revRewrite = require('gulp-rev-rewrite');
var browserSync = require('browser-sync').create();
var modRewrite = require('connect-modrewrite');
var sourcemaps = require('gulp-sourcemaps');
var argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    del = require('del');

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

gulp.task('clean', gulp.series(function() {
    del('public/**');
}));

gulp.task('compile-code', gulp.series(function() {
    return Promise.all([
        new Promise(function(resolve, reject) {
            gulp.src([
                    './src/assets/js/*.js',
                    './src/app.js',
                    './src/config.js',
                    './src/controllers/*.js',
                    './src/services/*.js',
                    './src/directives/directive.js'
                ])
                .pipe(gulpif(!argv.production, sourcemaps.init()))
                .pipe(concat('bundle.js'))
                .pipe(rev())
                .pipe(gulpif(!argv.production, sourcemaps.write('.')))
                .pipe(gulp.dest(config.distFolder + 'assets/js'))
                .pipe(rev.manifest('./rev-manifest.json', {
                    merge: true
                }))
                .on('error', reject)
                .pipe(gulp.dest('./'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(['./src/assets/css/*.css'])
                .pipe(gulpif(!argv.production, sourcemaps.init()))
                .pipe(concat('style.css'))
                .pipe(cleanCss())
                .pipe(rev())
                .pipe(gulpif(!argv.production, sourcemaps.write('.')))
                .pipe(gulp.dest(config.distFolder + 'assets/css'))
                .pipe(rev.manifest('./rev-manifest.json', {
                    merge: true
                }))
                .on('error', reject)
                .pipe(gulp.dest('./'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(['./src/assets/img/*'])
                .pipe(rev())
                .pipe(gulp.dest(config.distFolder + 'assets/img'))
                .pipe(rev.manifest('./rev-manifest.json', {
                    merge: true
                }))
                .on('error', reject)
                .pipe(gulp.dest('./'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(['./src/views/*.html'])
                .pipe(rev())
                .pipe(gulp.dest(config.distFolder + 'views/'))
                .pipe(rev.manifest('./rev-manifest.json', {
                    merge: true
                }))
                .on('error', reject)
                .pipe(gulp.dest('./'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(['./src/robots.txt'])
                .on('error', reject)
                .pipe(gulp.dest(config.distFolder))
                .on('end', resolve);
        })
    ]).then(function() {
        Promise.all([
            new Promise(function(resolve, reject) {
                gulp.src([config.distFolder + 'assets/js/*.js'])
                    .pipe(revRewrite({ manifest: gulp.src('./rev-manifest.json') }))
                    .pipe(gulp.dest(config.distFolder + 'assets/js/'));
            }),
            new Promise(function(resolve, reject) {
                gulp.src([config.distFolder + 'assets/css/*.css'])
                    .pipe(revRewrite({ manifest: gulp.src('./rev-manifest.json') }))
                    .pipe(gulp.dest(config.distFolder + 'assets/css/'));
            }),
            new Promise(function(resolve, reject) {
                gulp.src([config.distFolder + 'views/*.html'])
                    .pipe(revRewrite({ manifest: gulp.src('./rev-manifest.json') }))
                    .pipe(gulp.dest(config.distFolder + 'views/'));
            }),
            new Promise(function(resolve, reject) {
                gulp.src([config.srcFolder + '/index.html'])
                    .pipe(revRewrite({ manifest: gulp.src('./rev-manifest.json') }))
                    .pipe(gulp.dest(config.distFolder))
                    .pipe(browserSync.reload({
                        stream: true
                    }))
                    .pipe(gulp.dest(config.distFolder));
            })
        ]).then(response => {
            console.log('build process completed');
        }).catch(error => {
            console.log('File Revision process has failed to complete, due to:');
            console.log(error);
        });

    }).catch(error => {
        console.log('Build tool has failed to compile, due to:');
        console.log(error);
    });
}));

// Observes the file changes and executes the tasks when need to update the local browser
gulp.task('watch', gulp.series('compile-code', function() {
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
            './src/**/*.js'
        ],
        gulp.series('compile-code'));

    watcher.on('change', async function(path, stats) {
        browserSync.notify("Compiling, please wait!");
        browserSync.reload();
    });
}));

gulp.task('build', gulp.series('compile-code'));
gulp.task('default', gulp.series('watch'));