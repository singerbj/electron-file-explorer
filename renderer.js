/*global process,__dirname,require,$*/
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var fs = require('fs');

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

    currentDir = dir;
    $('.items').empty();
    fs.readdir(dir, function (err, items) {
        if (err) {
            console.error(err);
        } else {
            $('.items').append('<li><a href class="folder-link" data-file="' + upDir + '" data-updir="true">..</a></li>');
            items.forEach(function (item) {
                var path;
                if (currentDir[currentDir.length - 1] !== '/') {
                    path = currentDir + '/' + item;
                } else {
                    path = currentDir + item;
                }
                if (item.indexOf('.') < 0) {
                    $('.items').append('<li><a href class="folder-link" data-file="' + path + '">' + item + '</a></li>');
                } else {
                    $('.items').append('<li>' + item + '</li>');
                }
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
    }
});
