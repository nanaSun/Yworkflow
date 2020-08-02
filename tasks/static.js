/**
 * 处理其他静态资源
 * @type {[type]}
 */
'use strict'

var PROJECT_CONFIG = require('../yworkflow').getConfig(); //载入项目基础配置
if (!PROJECT_CONFIG.tasks.static) {
    return;
}
var PROJECT_ABS_PATH = PROJECT_CONFIG.absPath;
var TASK_CONFIG = PROJECT_CONFIG.tasks.static;
var path = require('path');

// var src = path.join(PROJECT_ABS_PATH, TASK_CONFIG.src);
// var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.dest);

var gulp = require('gulp');
var path = require('path');
var chalk = require('chalk');
var plugins = require('gulp-load-plugins')();
var runSequence = require('gulp4-run-sequence');

var changedDeps = require('./plugins/gulp-changed-deps/');

var staticFiles = [];
var staticTasks = [];

// 将处理文件全部拷贝到输出目录
gulp.task('static', function(done) {

    Object.keys(TASK_CONFIG.copyDirect).forEach(function (key) {
        var src = path.join(PROJECT_ABS_PATH, key);
        var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.copyDirect[key]);

        var taskName = 'static(' + key + ')';
        staticFiles.push(src);
        staticTasks.push(taskName);
        // 将处理文件全部拷贝到输出目录
        gulp.task(taskName, function () {
            return gulp.src(src)
                .pipe(plugins.changed(dest))
                .pipe(gulp.dest(dest));
        });
    });
    if (PROJECT_CONFIG.debug) {
        // 监听文件，触发文件拷贝
        gulp.watch(staticFiles, gulp.series(...staticTasks));
    }
    staticTasks.push(done);
    runSequence.apply(runSequence, staticTasks);
});

gulp.task('static:build', function(done) {
    Object.keys(TASK_CONFIG.copyDirect).forEach(function (key) {
        var src = path.join(PROJECT_ABS_PATH, key);
        var dest = path.join(PROJECT_ABS_PATH, TASK_CONFIG.copyDirect[key]);

        var taskName = 'static(' + key + ')';
        staticFiles.push(src);
        staticTasks.push(taskName);
        // 将处理文件全部拷贝到输出目录
        gulp.task(taskName, function () {
            return gulp.src(src)
                .pipe(gulp.dest(dest));
        });
    });
    staticTasks.push(done);
    runSequence.apply(runSequence, staticTasks);
});

