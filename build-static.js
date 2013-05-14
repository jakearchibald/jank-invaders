// All the files needed for the static version
var manifest = [
  '/',
  '/static/css/all.css',
  '/static/css/fonts/akashi.ttf',
  '/static/css/imgs/metal.jpg',
  '/static/css/imgs/nebula.jpg',
  '/static/css/imgs/stars.png',
  '/static/js/all.js',
  '/static/js/all.js.map',
  '/static/js/qrcode.js',
  '/static/js/q.js',
  '/static/js/EventEmitter.js',
  '/static/js/ji/index.js',
  '/static/js/ji/utils.js',
  '/static/js/ji/Ship.js',
  '/static/js/ji/Flash.js',
  '/static/js/ji/Shot.js',
  '/static/js/ji/Explosion.js',
  '/static/js/ji/Level.js',
  '/static/js/ji/Intro.js',
  '/static/js/ji/Summary.js',
  '/static/js/main.js',
  '/static/imgs/particle-sprites.png',
  '/static/imgs/ships.png'
];
var server = 'http://localhost:3000';

var fs = require('fs');
var path = require('path');
var http = require('http');
var Q = require('q');

function mkdirDeep(pathToMake) {
  return pathToMake.split('/').reduce(function(pathSoFar, nextPathPart) {
    pathSoFar = path.join(pathSoFar, nextPathPart);
    
    if (!fs.existsSync(pathSoFar)) {
      fs.mkdirSync(pathSoFar, 0755);
    }
    
    return pathSoFar;
  }, __dirname);
}

function deleteDir(path) {
  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteDir(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

module.exports = function(done) {
  // remove current dir
  fs.readdirSync('build').forEach(function(file) {
    if (file[0] == '.') { return; }
    file = 'build/' + file;
    if (fs.statSync(file).isDirectory()) {
      deleteDir(file);
    }
    else {
      fs.unlinkSync(file);
    }
  });

  var promises = manifest.map(function(urlPath) {
    var pathParts = urlPath.split('/').slice(1);
    var fileName = pathParts[pathParts.length - 1] || 'index.html';
    var dir = pathParts.slice(0, -1).join('/');
    var deferred = new Q.defer();

    if (dir) {
      mkdirDeep('build/' + dir);
    }

    var staticFile = fs.createWriteStream(path.join('build', dir, fileName), {
      flags: 'w',
      mode: 0644
    });

    staticFile.on('error', function(err) {
      deferred.reject(err);
    });

    staticFile.on('close', deferred.resolve.bind(deferred));

    http.get(server + urlPath, function(res) {
      res.pipe(staticFile);
    });

    return deferred.promise;
  });

  Q.all(promises).then(done, function(err) {
    throw err;
  });
};