var browserSync = require("browser-sync");
var gulp        = require("gulp");
var ghPages     = require("gulp-gh-pages");
var rename      = require("gulp-rename");
var mocha       = require("gulp-spawn-mocha");
var webpack     = require("gulp-webpack");

/*
*   Build tasks
*/
gulp.task("run-tests", function () {
    var stream = gulp.src("./tests/unit/**/*.jsx")
        .pipe(mocha({
            compilers: ".:./tests/compiler.js",
            reporter: "mochawesome",
            noExit: true,
            env: {
                NODE_PATH: "./src/",
                MOCHAWESOME_REPORTDIR: "./builds/tests/",
                MOCHAWESOME_REPORTNAME: "index"
            }
        }))
        .on("error", function (err) {
            /*
            *   Failing tests raise an error in the pipeline. This causes the
            *   watch to stop (which in turn makes the process exit).
            *   Therefore, when fails occur, manually reload the browser and
            *   end the stream.
            */
            browserSync.reload();
            stream.end();
        })
        .pipe(reload({stream: true}));
    return stream;
});
gulp.task("build-example-html", function () {
    return gulp.src("./example/main.html")
        .pipe(rename("index.html"))
        .pipe(gulp.dest("./builds/example/"))
        .pipe(reload({stream: true}));
});
gulp.task("build-example-js", function () {
    return gulp.src("./example/main.jsx")
        .pipe(webpack({
            module: {
                loaders: [{
                    test: /\.jsx$/,
                    loader: "jsx-loader"
                }]
            },
        }))
        .pipe(rename("app.js"))
        .pipe(gulp.dest("./builds/example/assets/js/"))
        .pipe(reload({stream: true}));
});

/*
*   Setup the development environment
*/
var reload = browserSync.reload;
gulp.task("dev", ["run-tests", "build-example-html", "build-example-js"], function() {
    browserSync({
        server: {
            baseDir: "./builds/",
            directory: true
        },
        port: 8080,
        ghostMode: false,
        injectChanges: false,
        notify: false
    });
    gulp.watch([
        "./src/**/*.jsx",
        "./src/**/*.js",
        "./tests/unit/**/*.jsx",
        "./tests/unit/**/*.js",
        "./example/main.html",
        "./example/main.jsx"
    ], [
        "run-tests",
        "build-example-html",
        "build-example-js"
    ]);
});

/*
*   Task to deploy to github pages
*/
gulp.task("gh-pages", ["run-tests", "build-example-html", "build-example-js"], function() {
    return gulp.src("./builds/**/*").pipe(ghPages());
});

/*
*   Default task
*/
gulp.task("default", ["dev"]);
