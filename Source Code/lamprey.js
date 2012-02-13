var baseURL = getBaseURL();

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


function getBaseURL() {
    var url = location.href;  // entire url including querystring - also: window.location.href;
    var baseURL = url.substring(0, url.indexOf('/', 14));

    if (baseURL.indexOf('http://localhost') != -1) {
        // Base Url for localhost
        var url = location.href;  // window.location.href;
        var pathname = location.pathname;  // window.location.pathname;
        var index1 = url.indexOf(pathname);
        var index2 = url.indexOf("/", index1 + 1);
        var baseLocalUrl = url.substr(0, index2);

        return baseLocalUrl + "/";
    }
    else {
        // Root Url for domain name
        return baseURL + "/";
    }
}