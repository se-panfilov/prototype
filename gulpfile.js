var gulp = require('gulp'), concat, rename, uglify, jade, sourcemaps, changed, minifyHTML, cachebreaker, stylus,
    minifyCss, nib, jshint, size, templateCache, ngAnnotate, connect;

var src = {
    stylesDirs: [
        'static/src/common_styles/**/*.styl',
        'static/src/modules/**/*.styl',
        'static/src/pages/**/*.styl',
        'static/src/partials/**/*.styl',
        'static/*.styl'
    ],
    jade: {
        templatesDir: 'templates/**/*.jade',
        staticDirs: {
            main: [
                'static/*.jade'
            ],
            templates: [
                'static/src/pages/**/*.jade',
                'static/src/partials/**/*.jade',
                'static/src/modules/**/*.jade'
            ]
        }
    },
    jsDir: 'static/src/**/*.js'
};

var dest = {
    staticDir: 'static',
    dist: 'static/dist',
    templatesDir: 'templates'
};

gulp.task('lint', function () {
    jshint = jshint || require('gulp-jshint');

    return gulp.src(src.jsDir)
        .pipe(jshint({
            globalstrict: true,
            strict: false,
            globals: {
                angular: true,
                localStorage: true,
                console: true
            }
        }))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js', function () {
    sourcemaps = sourcemaps || require('gulp-sourcemaps');
    uglify = uglify || require('gulp-uglify');
    rename = rename || require('gulp-rename');
    ngAnnotate = ngAnnotate || require('gulp-ng-annotate');
    changed = changed || require('gulp-changed');
    concat = concat || require('gulp-concat');

    return gulp.src([src.jsDir])
        .pipe(changed(dest.staticDir))
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({remove: true, add: true, single_quotes: true}))
        .pipe(gulp.dest(dest.dist))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({basename: 'app.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest.dist))
        ;
});

gulp.task('jade_static', function () {
    templateCache = templateCache || require('gulp-angular-templatecache');
    changed = changed || require('gulp-changed');
    minifyHTML = minifyHTML || require('gulp-minify-html');
    jade = jade || require('gulp-jade');
    concat = concat || require('gulp-concat');

    return gulp.src(src.jade.staticDirs.templates)
        .pipe(changed(dest.staticDir, {extension: '.html'}))
        .pipe(jade({pretty: false}))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(templateCache({
            module: 'app.templates',
            standalone: true
        }))
        .pipe(concat('app_templates.js'))
        .pipe(gulp.dest(dest.dist))

});

gulp.task('jade_static_main', function () {
    cachebreaker = cachebreaker || require('gulp-cache-breaker');
    changed = changed || require('gulp-changed');
    minifyHTML || require('gulp-minify-html');
    jade = jade || require('gulp-jade');

    return gulp.src(src.jade.staticDirs.main, {base: 'static'})
        .pipe(changed(dest.staticDir, {extension: '.html'}))
        .pipe(jade({pretty: false}))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(cachebreaker('static'))
        .pipe(gulp.dest('static'));
});

gulp.task('jade', function () {
    gulp.start('jade_static');
    gulp.start('jade_static_main');
});

gulp.task('stylus', function () {
    stylus = stylus || require('gulp-stylus');
    minifyCss = minifyCss || require('gulp-minify-css');
    nib = nib || require('nib');
    changed = changed || require('gulp-changed');
    concat = concat || require('gulp-concat');

    return gulp.src(src.stylesDirs, {base: 'static'})
        .pipe(changed(dest.dist))
        .pipe(concat('app.min.styl'))
        .pipe(stylus({use: [nib()], compress: true}))
        .pipe(minifyCss())
        .pipe(gulp.dest(dest.dist));
});

gulp.task('purify_css', function () {
    return purifyCss({
        src: ['static/index.html', 'static/dist/app.min.js', 'static/dist/app_templates.js', 'static/dist/vendor.min.js'],
        css: ['static/dist/vendor.min.css'],
        output: 'static/dist/vendor.purified.min.css'
    });
});

function purifyCss(settings) {
    var fs = require('fs');
    var purify = require('purify-css');
    var pure = purify(settings.src, settings.css, {write: false, info: true});

    fs.writeFile(settings.output, pure, function (err) {
        if (err) return err;
    });
}

gulp.task('vendor_js', function () {
    sourcemaps = sourcemaps || require('gulp-sourcemaps');
    uglify = uglify || require('gulp-uglify');
    rename = rename || require('gulp-rename');
    concat = concat || require('gulp-concat');

    return gulp.src([
        'static/bower_components/jquery/dist/jquery.js',
        'static/bower_components/angular/angular.js',
        'static/bower_components/angular-animate/angular-animate.js',
        'static/bower_components/angular-bootstrap/ui-bootstrap.js',
        'static/bower_components/angular-loading-bar/build/loading-bar.js',
        'static/bower_components/angular-resource/angular-resource.js',
        'static/bower_components/angular-ui/build/angular-ui.js',
        'static/bower_components/angular-ui-router/release/angular-ui-router.js',
        'static/bower_components/angular-ui-router-anim-in-out/anim-in-out.js',
        'static/bower_components/AngularJS-Toaster/toaster.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dest.dist))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({basename: 'vendor.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest.dist))
});

gulp.task('vendor_css', function () {
    minifyCss = minifyCss || require('gulp-minify-css');
    var concatVendorCss = require('gulp-concat-css');

    gulp.src([
        'static/libs/bower_components/bootstrap/dist/css/bootstrap.min.css',
        'static/libs/bower_components/angular-ui-router-anim-in-out/css/anim-in-out.css',
        'static/libs/bower_components/angularjs-toaster/toaster.css',
        'static/libs/bower_components/angular-loading-bar/build/loading-bar.min.css'
    ], {base: 'static/dist'})
        .pipe(concatVendorCss('vendor.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(dest.dist));
});

gulp.task('config', function () {
    var ngConstant = require('gulp-ng-constant');

    return gulp.src('static/url_map.json')
        .pipe(ngConstant({
            name: 'app.config.url_map'
        }))
        .pipe(gulp.dest(dest.staticDir + '/src/modules/'));
});

gulp.task('webserver', function () {
    connect = connect || require('gulp-connect');

    connect.server({
        root: [__dirname],
        port: 8001,
        livereload: true
    });
});

gulp.task('watch', function () {
    var watch = require('gulp-watch');

    gulp.watch(src.jade.staticDirs.main, ['jade_static_main']);
    gulp.watch(src.jade.staticDirs.templates, ['jade_static']);

    gulp.watch(src.stylesDirs, ['stylus']);
    gulp.watch([src.jsDir], ['js']);
});

gulp.task('build_vendor', function () {
    gulp.start('vendor_js');
    gulp.start('vendor_css');
    gulp.start('purify_css');
});

gulp.task('build', function () {
    gulp.start('config');
    gulp.start('jade');
    gulp.start('js');
    gulp.start('stylus');
    gulp.start('purify_css');
});

gulp.task('default', function () {
    gulp.start('build');
    gulp.start('watch');
});

