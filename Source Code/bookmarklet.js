(function () {
    var lampreyURL = "<%= baseURL %>";
    window.Lamprey = window.Lamprey || {};
    window.Lamprey.bootstrapper = window.Lamprey.bootstrapper || {};
    window.Lamprey.bootstrapper.loadScripts = function (scriptArray, onComplete) {
        var numberOfLoadedScripts = 0;
        for (var i = 0; i < scriptArray.length; i++) {
            var s = (document.getElementsByTagName('head')[0] || document.body).appendChild(document.createElement('script'));
            s.src = scriptArray[i];
            s.type = 'text/javascript';
            s.onload = function () {
                numberOfLoadedScripts++;
                if (numberOfLoadedScripts == scriptArray.length) {
                  onComplete.call();
                }
            };
        }
    };
    window.Lamprey.bootstrapper.loadScripts([lampreyURL + "/lamprey.js?" + (new Date())], function () {});
})()
