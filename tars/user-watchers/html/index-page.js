'use strict';

const gulp = tars.packages.gulp;
const gutil = tars.packages.gutil;
const chokidar = tars.packages.chokidar;
const watcherLog = tars.helpers.watcherLog;

/**
 * This is an example of watcher
 */
module.exports = function () {
    return chokidar.watch(
        '/* String of path pattern or array of strings */',
        Object.assign(tars.options.watch)
    ).on('all', function (event, watchedPath) {
        watcherLog(event, watchedPath);
        // You could start as many tasks as you need
        gulp.start('list-pages:watch');
    });
};
