// NodeJS Script that builds the bookmarklet.

var fs = require('fs');
var sys = require('sys');
var _ = require('underscore');


fs.readFile('../Source Code/bookmarklet.txt', function(err,bookmarkletCode){
  if(err) {
    console.error("Could not open file: %s", err);
    process.exit(1);
  }
  
  fs.readFile('../Source Code/example.html', function(err,htmlPage){
    if(err) {
      console.error("Could not open file: %s", err);
      process.exit(1);
    }
    
    // Remove whitespace, encode URI characters, prepend javascript link code.
    var bookmarkletURL = "javascript:" + escape(bookmarkletCode.toString().replace(/\s+/g," "));
    
    // Put it into the template.
    var renderedHTML = _.template(htmlPage.toString(), { bookmarkletURL: bookmarkletURL});
    
    fs.writeFile('../Build Products/bookmarklet.html', renderedHTML, function(err){
      if(err) {
        console.error("Could not write to file: %s", err);
        process.exit(1);
      }
    });

    console.log("Built bookmarklet.");
  }); 
});

