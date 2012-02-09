// NodeJS Script that builds the bookmarklet.

var fs = require('fs');
var sys = require('sys');
var _und = require('underscore-min');


fs.readFile('../Source Code/bookmarklet.txt', function(err,data){
  if(err) {
    console.error("Could not open file: %s", err);
    process.exit(1);
  }
  
  fs.readFile('../Source Code/test1.html', function(err,data){
    if(err) {
      console.error("Could not open file: %s", err);
      process.exit(1);
    }
    
    // Remove whitespace, encode URI characters and prepend javascript link code.
    var bookmarkletURL = "javascript:" + escape(data.toString().replace(/\s+/g," "));

    fs.writeFile('../Build Products/bookmarklet.html', bookmarkletURL, function(err){
      if(err) {
        console.error("Could not write to file: %s", err);
        process.exit(1);
      }
    });

    console.log("Built bookmarklet.");
    
  });  
});

