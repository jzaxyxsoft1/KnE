/**
 * Created by Administrator on 14-2-10.
 */
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
exports.pos = function (req, res) {
    res.set({'Access-Control-Allow-Origin': '*'});
    var _d = new Date();
    _d = (_d.getFullYear().toString() + (_d.getMonth() + 1) + _d.getDate());
    var p = req.body['p'];
    var fPath = "/upload/" + p + '/' + _d;
    checkPath(fPath);
    var filePath = req.files.file.path;
    var extName = path.extname(req.files.file.name);
    var fileUrl = fPath + '/' + path.basename(filePath) + extName;
    var newPath = __dirname + "/../public" + fileUrl;
    fs.readFile(filePath, function (err, data) {
        fs.writeFile(newPath, data, function (err) {
            fs.unlink(req.files.file.path, function (e) {})
            res.send(fileUrl);
        });
    });
}
exports.ckpost=function (req,res){
    res.set({'Access-Control-Allow-Origin': '*'});
    var _d = new Date();
    _d = (_d.getFullYear().toString() + (_d.getMonth() + 1) + _d.getDate());
    var p = req.body['p'];
    var fPath = "/upload/" + p + '/' + _d;
    checkPath(fPath);
    var filePath = req.files.file.path;
    var extName = path.extname(req.files.file.name);
    var fileUrl = fPath + '/' + path.basename(filePath) + extName;
    var newPath = __dirname + "/../public" + fileUrl;
    fs.readFile(filePath, function (err, data) {
        fs.writeFile(newPath, data, function (err) {
            fs.unlink(req.files.file.path, function (e) {})
            res.send(fileUrl);
        });
    });
}
function checkPath(path) {
    if (!fs.existsSync(__dirname + '/../public' + path)) {
        mkdirp.sync(__dirname + '/../public' + path);
    }
}