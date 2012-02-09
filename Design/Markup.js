(function() {
    window.add_js = function(s) {
        var k = (document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script'));
        k.src = s;
        k.type = 'text/javascript';
        k.markup = 'd5b0e65e-edce-11e0-96c6-fac11f1adc9e'
    };
    window.MarkUp = window.MarkUp || {};
    add_js('http://api.markup.io/bootstrap.js?v=1&' ((new Date)))
})()