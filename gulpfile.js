let preprocessor = 'scss';

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const sass         = require('gulp-sass')(require('sass'));
const scss         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss     = require('gulp-clean-css');

function browsersync() {
    browserSync.init({
        server: { baseDir: 'app/' },
        notify: false,
        online: true
    })
}

function scripts() {
    return src([
        // 'list: files.js',
        'app/js/script.js'
    ])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream())
}

function styles() {
    return src('app/' + preprocessor + '/main.' + preprocessor + '')
    .pipe(eval(preprocessor)())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleancss(( { level: { 1: { specialComments: 0 } }, format: 'beautify' } )))
    .pipe(dest('app/style/'))
    .pipe(browserSync.stream())
}

function startwatch() {
    watch('app/**/' + preprocessor + '/**/*', styles)
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts)
}

exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles      = styles;

exports.default     = parallel(styles, scripts, browsersync, startwatch);