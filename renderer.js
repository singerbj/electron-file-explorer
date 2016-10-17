/*global process,__dirname,require,$*/
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var fs = require('fs');
var util = require('util');
var exec = require('child_process').exec;

// var seperator = '/';
// if (process.platform === 'win32') {

// }

var currentDir = '/';
var upDir = '/';
process.chdir('/');

var getFilesForDir = function (dir, goingUpDir) {
    if (!dir) {
        dir = '/';
    }
    var upDirArray;
    if (goingUpDir === 'true' || goingUpDir === true) {
        upDirArray = upDir.split('/');
        upDirArray = upDirArray.splice(0, upDirArray.length - 1);
    } else {
        upDirArray = currentDir.split('/');
        upDirArray = upDirArray.splice(0, upDirArray.length);
    }

    upDir = '/' + upDirArray.join('/');

    dir = dir.replace(/\/\/+/g, '/');
    upDir = upDir.replace(/\/\/+/g, '/');

    console.log(upDir, dir);

    $('.currentDir').text(dir);

    currentDir = dir;
    $('.items').empty();
    fs.readdir(dir, function (err, items) {
        if (err) {
            console.error(err);
        } else {
            $('.items').append('<div><i class="fa fa-level-up" aria-hidden="true"></i>&nbsp;&nbsp;<a href class="folder-link" data-file="' + upDir + '" data-updir="true">..</a></div>');
            var files = [];
            var folders = [];
            items.forEach(function (item) {
                var path;
                if (currentDir[currentDir.length - 1] !== '/') {
                    path = currentDir + '/' + item;
                } else {
                    path = currentDir + item;
                }
                if (item.indexOf('.') < 0) {
                    folders.push('<div><i class="fa fa-folder" aria-hidden="true">&nbsp;&nbsp;</i><a href class="folder-link" data-file="' + path + '">' + item + '</a></div>');
                } else {
                    files.push('<div><i class="fa fa-file" aria-hidden="true">&nbsp;&nbsp;</i><a href class="file-link" data-file="' + path + '">' + item + '</a></div>');
                }
            });

            folders.forEach(function (folder) {
                $('.items').append(folder);
            });
            files.forEach(function (file) {
                $('.items').append(file);
            });
        }
    });
};

getFilesForDir();

$('body').click(function (e) {
    e.preventDefault();
    var tgt = $(e.target);
    if (tgt.hasClass('folder-link')) {
        getFilesForDir(tgt.data('file'), tgt.data('updir'));
    } else if (tgt.hasClass('file-link')) {
        // console.log(getCommandLine() + ' ' + tgt.data('file'));
        // exec(getCommandLine() + ' ' + tgt.data('file'));
        var shell = require('electron').shell;
        // var path = require('path');

        var r;
        if (process.platform === "win32" || process.platform === "win64") {
            r = shell.openItem(tgt.data('file').replace(/\//, "\\"));
        } else {
            r = shell.openItem(tgt.data('file'));
        }

        console.log(r, tgt.data('file'));
    }
});
