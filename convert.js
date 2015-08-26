var toJSON = require('shp2json'),
    fs = require('fs'),
    Stream = require('stream').Stream,
    archiver = require('archiver'),
    read = require('fs-readdir-recursive');


var files = read(__dirname + '/linework-sets');

// get each unique file name and add to fileStrings array
var check = '';
var fileStrings = [];
files.forEach(function(file) {
  var slicedFileName = file.replace(/\.[^/.]+$/, "");
  if(file.indexOf('/\shp/') > -1 && check.indexOf(slicedFileName) == -1 && file.indexOf('.xml') == -1) {
    check += slicedFileName;
    fileStrings.push(slicedFileName);
  }
});

var count = 0;
fileStrings.forEach(function(string) {
  var archiveArray = []
  files.forEach(function(file) {
    var slicedFileName = file.replace(/\.[^/.]+$/, "");
    if(slicedFileName == string) {
      obj = { expand: true, cwd: __dirname + '/linework-sets/', src: [file] }
      archiveArray.push(obj);
    }
  });
  archiveArray.push({ expand: true, cwd: __dirname + '/linework-sets/', src: [string + '.shp.xml'] }); // push .xml file as well
  archiveName = string;
  zip(archiveArray, string);
  count++;
});

// zip up set of files for the array 
function zip(array, string) {
  // console.log(array);
  // console.log(name)
  var output = fs.createWriteStream('./temp/' + string + '/' + count + '.zip');
  var archive = archiver('zip');
  archive.pipe(output);

  output.on('close', function(){
    console.log(this);
  });
  archive.on('error', function(err) {
    throw err;
  });

  archive.bulk(array);
  archive.finalize();
}





// var inStream = fs.createReadStream('./linework-sets/elmer-casual/shp/shapefile.zip');
// var outStream = new Stream;

// var data = '';
// outStream.write = function (buf) {
//     data += buf;
// };

// outStream.end = function() {
//   var json = data;
//   console.log(json);
//   fs.writeFile('./temp/temp.json', json, function(e){
//     console.log('file writing complete');
//   });
// }

// toJSON(inStream).pipe(outStream);
