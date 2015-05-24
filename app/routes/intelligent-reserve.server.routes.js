'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  labs = require('../../app/controllers/labs.server.controller'),
  // fs = require('fs'),
  path = require('path'),
  excel2json = require('excel-to-json'),
  labsInfo = require('../../app/controllers/labs-info.server.controller'),
  intelligentReserve = require('../../app/controllers/intelligent-reserve.server.controller'),
  multer  = require('multer');

module.exports = function(app) {

  app.route('/upload/excels')
    .post(users.requiresLogin, [multer({
        dest: '/uploads/',
        onFileUploadStart: function (file, req, res) {
          console.log(file.fieldname + ' is starting ...');
        },
        onFileUploadComplete: function(file, req, res){
          // console.log('file is uploaded.');
          // console.log(file.fieldname + ' uploaded to  ' + file.path);
          // var data = fs.readFileSync(file.path, 'binary');
          // console.log(data);
          // var path = file.path;
          // console.log(path);
          var xlsx = require('xlsx');
          var data = xlsx.readFile(file.path);
          // console.log(console.log(JSON.stringify(convertToJSON(data))));
          // res.json(data);
          // function convertToJSON(array) {
          //   // console.log(array);
          //   // var first = array[0].join();
          //   // var headers = first.split(',');

          //   var jsonData = [];
          //   for ( var i = 1, length = array.length; i < length; i++ )
          //   {

          //     var myRow = array[i].join();
          //     var row = myRow.split(',');

          //     var data = {};
          //     for ( var x = 0; x < row.length; x++ )
          //     {
          //       data[headers[x]] = row[x];
          //     }
          //     jsonData.push(data);

          //   }
          //   return jsonData;
          // }
          var xlsxj = require('xlsx-to-json');
          xlsxj({
            input: file.path,
            output: 'output.json'
          }, function(err, result) {
            if(err) {
              console.error(err);
            }else {
              res.json(result);
            }
          });
        }
      }), intelligentReserve.create])
    .get(labs.list);


  app.param('labId', labs.labByID);
};
