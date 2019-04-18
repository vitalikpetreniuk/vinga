'use strict';

// This is example of task function

const gulp = tars.packages.gulp;
const consolidate = tars.packages.consolidate;
const plumber = tars.packages.plumber;
const notifier = tars.helpers.notifier;

const tarsConfig = tars.config;
// Include browserSync, if you need to reload browser:
// const browserSync = tars.packages.browserSync;

/**
 * Task description
 */
module.exports = () => {
    return gulp.task('pagelist', () => {
        var pages = require('../../../markup/index.yaml');
        
        return gulp.src(__dirname + '/index.html')
            .pipe(plumber({
                errorHandler: function (error) {
                    notifier.error('An error occurred while something.', error);
                }
            }))
            .pipe(consolidate('lodash', {
                pages: pages
            }))
            // Do stuff here, like
            // .pipe(less())
            .pipe(gulp.dest(`${tars.config.devPath}`))

            // If you need to reload browser, uncomment the row below
            // .pipe(browserSync.reload({ stream:true }))
            .pipe(
                // You can change text of success message
                notifier.success('Example task has been finished')
            );

        // You can return callback, if you can't return pipe
        // done(null);
    });
};
