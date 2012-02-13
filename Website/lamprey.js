var baseURL = "http://lamprey";

window.Lamprey.bootstrapper.loadScripts([
    baseURL + "/jquery.min.js",
    baseURL + "/underscore-min.js", 
    baseURL + "/backbone-min.js"
  ], initLamprey );


function initLamprey() {
  // Load CSS
  $("head").append('<link type="text/css" rel="stylesheet" media="all" href="' + baseURL + '/lamprey.css" />');
  // document.getElementsByTagName('head')[0].innerHTML += ('<link type="text/css" rel="stylesheet" media="all" href="' + baseURL + '/lamprey.css" />');
  $.get(baseURL + "/lamprey.html", function(data) {
    $('body').append(_.template(data.toString(), {}));
    $('body').css('overflow', 'hidden');
    $('#lamprey').animate({
        right: '0'
      }, 500, function() {
        // Animation complete.
      });
  })
  .error(function() { alert("Error loading Lamprey UI.")});
}