(function() {
    var URL = "<%= baseURL %>/lamprey.js";
    window.add_js = function(s) {
        var k = (document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script'));
        k.src = s;
        k.type = 'text/javascript';
    };
    window.Lamprey = window.Lamprey || {};
    add_js(URL);
})()