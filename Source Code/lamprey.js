var baseURL = "<%= baseURL %>";

window.Lamprey.bootstrapper.loadScripts([
    baseURL + "/jquery.min.js",
    baseURL + "/underscore-min.js", 
    baseURL + "/backbone-min.js"
  ], initLamprey );


function initLamprey() {
  // Load CSS
  $("head").append('<link type="text/css" rel="stylesheet" media="all" href="' + baseURL + '/lamprey.css" />');
  
  $.get(baseURL + "/lamprey.html", function (data) {
    $('body').append(_.template(data.toString(), {}));
    $('body').css('overflow', 'hidden');
    $('#lamprey').animate({
        right: '0'
      }, 500);
    $("#lamprey-cancel").click(function () {
      $('#lamprey').animate({
          right: '-' + $("#lamprey").outerWidth()
        }, 500, function () {
          $('#lamprey').remove();
        });
    });
  })
  .error(function () { alert("Error loading Lamprey UI.")});
}


