// NodeJS Script that builds the bookmarklet.

var fs = require('fs');
var sys = require('sys');
var _ = require('underscore');

var baseURL = "http://localhost";
if (process.argv[2])
  baseURL = process.argv[2];

// ---------------------------------------
// bookmarklet.html
fs.readFile('../Source Code/bookmarklet.js', function(err,bookmarkletCode){
  if(err) {
    console.error("Could not open file: %s", err);
    process.exit(1);
  }
  
  fs.readFile('../Source Code/example.html', function(err,htmlPage){
    if(err) {
      console.error("Could not open file: %s", err);
      process.exit(1);
    }
    
    bookmarkletCode = _.template(bookmarkletCode.toString(), { baseURL: baseURL });
    
    // Remove whitespace, encode URI characters, prepend javascript link code.
    var bookmarkletJavaScriptLink = "javascript:" + escape(bookmarkletCode.toString().replace(/\s+/g," "));
    
    // Put it into the template.
    var renderedHTML = _.template(htmlPage.toString(), 
                                  {
                                    bookmarkletJavaScriptLink: bookmarkletJavaScriptLink, 
                                    baseURL: baseURL
                                  });
    
    fs.writeFile('../Build Products/bookmarklet.html', renderedHTML, function(err){
      if(err) {
        console.error("Could not write to file: %s", err);
        process.exit(1);
      }
    });
    
    console.log("Built bookmarklet.html");
  });
});


// ------------------------------
// lamprey.js
fs.readFile('../Source Code/lamprey.js', function(err,htmlPage){
  if(err) {
    console.error("Could not open file: %s", err);
    process.exit(1);
  }
  
  // Put it into the template.
  var renderedHTML = _.template(htmlPage.toString(), { baseURL: baseURL });
  
  fs.writeFile('../Build Products/lamprey.js', renderedHTML, function(err){
    if(err) {
      console.error("Could not write to file: %s", err);
      process.exit(1);
    }
  });

  console.log("Built lamprey.js");
});
