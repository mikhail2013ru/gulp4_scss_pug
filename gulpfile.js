let preprocessor = 'scss';

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const sass         = require('gulp-sass')(require('sass'));
const scss         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss     = require('gulp-clean-css');
const imagemin     = require('gulp-imagemin-fix');
const newer        = require('gulp-newer');
const del          = require('del');
const rigger       = require('gulp-rigger');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const jshint       = require('gulp-jshint');
const beep         = require('beepbeep');
// const pug          = require('gulp-pug');
// const fileinclude = require('gulp-file-include');

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
    .pipe(plumber({ errorHandler: onError }))
    .pipe( jshint())
    // .pipe(jshint.reporter('jshint-stylish', {beep: true}))
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream())
}

// function fileInclude() {
//     return src('app/templates/**/*.html')
//     // return src('app/index.html')
//     // return src('app/**/*.html')
//     .pipe(fileinclude({
//       prefix: '@@',
//       basepath: '@file'
//     }))
//     .pipe(dest('app/'));
// }
function html() {
    return src(['app/views/**/index.html', "!app/views/blocks/*.html"])
    .pipe(rigger())
    .pipe(dest('app/'))
    .on("end", browserSync.reload);
}

function styles() {
    return src('app/' + preprocessor + '/main.' + preprocessor + '')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(eval(preprocessor)())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleancss(( { level: { 1: { specialComments: 0 } }, format: 'beautify' } )))
    .pipe(dest('app/style/'))
    .pipe(browserSync.stream())
}

function images() {
    return src('app/img/src/**/*')
    .pipe(newer('app/img/dest/'))
    .pipe(imagemin())
    .pipe(dest('app/img/dest/'))
}

// function pug2html() {
//     return src('app/pug/index.pug')
//     .pipe(plumber())
//     .pipe(pug({
//         // ?????? ???? ?????????? ??????????????????????????
//         pretty: true
//     }))
//     .pipe(plumber.stop())
//     .pipe(dest('app'))
// }

function cleanimg() {
    return del('app/img/dest/**/*')
}

function onError(err) {
    notify.onError({
        title:    "Error in " + err.plugin,
        message: err.message
    })(err);
    beep(2);
    this.emit('end');
}

function startwatch() {
    watch('app/**/' + preprocessor + '/**/*', styles);
    watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
    watch('app/**/*.html').on('change', browserSync.reload);
    watch(['app/views/index.html', '!app/views/blocks/**/*.html'], html);
    watch('app/img/src/**/*', images);
    // watch('app/**/*.html').on('change', browserSync.reload);
    // watch('app/**/*.pug', pug2html);
}

exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.html        = html;
// exports.pug2html    = pug2html;
// exports.fileInclude    = fileInclude;

exports.default     = parallel(styles, scripts, browsersync, startwatch);