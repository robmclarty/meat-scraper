var express = require('express');
var noodle = require('noodlejs');

var port = process.env.PORT || 3000;

var app = express();

app.get('/', function (req, res) {
  var itemURIs = [];
  var items = [];
  var rootURL = 'http://us.battle.net';

  noodle
    .query({
      url: rootURL + '/d3/en/item/',
      type: 'html',
      selector: '#equipment ul.list-items li a',
      extract: 'href'
    })
    .then(function (results) {
      var names = [];

      itemURIs = results.results[0].results;
      
      itemURIs.forEach(function (itemURI) {
        noodle
          .query({
            url: rootURL + itemURI,
            type: 'html',
            selector: '.item-details .item-details-text h3 a',
            extract: 'text'
          })
          .then(function (results) {
            names = results.results[0].results;
            items.concat(names);
            console.log(itemURI);
            //console.log(results);
            console.log(names);
          });
      });

      res.send(JSON.stringify(items));
    }, function (error) {
      console.log(error);
    });

  noodle.stopCache();
});

app.listen(port);
console.log('Server started on port ' + port);
