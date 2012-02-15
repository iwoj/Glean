var baseURL = "<%= baseURL %>";

window.Lamprey.bootstrapper.loadScripts([
    baseURL + "/jquery.min.js",
    baseURL + "/underscore-min.js", 
    baseURL + "/backbone-min.js"
  ], initLamprey );


function resize() {
  var fixedHeightElementsTotalHeight = 200;
  //$("#lamprey-instructions").is(":visible")
  $("#lamprey-regex").height($(window).height()/2 - fixedHeightElementsTotalHeight);
  $("#lamprey-html").height($(window).height()/2 - fixedHeightElementsTotalHeight);
}

function initLamprey() {
  // Load CSS
  $("head").append('<link type="text/css" rel="stylesheet" media="all" href="' + baseURL + '/lamprey.css" />');
  
//  resize();
  
  $.get(baseURL + "/lamprey.html", function (data) {
    $('body').append(_.template(data.toString(), {}));
    $('#lamprey').animate({
        right: '0'
      }, 250);
    $("#lamprey-cancel").click(function () {
      $('#lamprey').animate({
          right: '-' + $("#lamprey").outerWidth()
        }, 250, function () {
          $('#lamprey').remove();
        });
    });
    $(document).mouseup(function(event) {
      if (!$("#lamprey").has(event.target).length) {
        checkSelection();
      }
    });
    checkSelection();
  })
  .error(function () { alert("Error loading Lamprey UI.")});
}

function escapeRegEx(s) {
    return s.replace(/[\[\]{}()*+?.,\\\/^$|#]/g, "\\$&");
}

function checkSelection() {
  var selection = getSelectionText();
  if (selection != "") {
    $("#lamprey-instructions").fadeOut();
    var selectionHTML = getSelectionHTML();
    $("#lamprey-regex").text("/" + escapeRegEx(selectionHTML) + "/");
    $("#lamprey-html").text(selectionHTML);
  }
}


function getSelectionText() {
    if (window.getSelection) {
        return window.getSelection();
        
    // IE
    } else if (document.selection) {
        return document.selection.createRange();
    }
}


function getSelectionHTML() {
    if (document.selection && document.selection.createRange) return (document.selection.createRange()).htmlText;
    if (window.getSelection) {
        var sel = window.getSelection();
        var html = "";
        
        // for (var i = 0; i < sel.rangeCount; i++) {
        //     var d = document.createElement("span");
        //     var r = sel.getRangeAt(i);
        //     var parent_element = r.commonAncestorContainer;
        //     var prev_html = parent_element.innerHTML;
        //     r.surroundContents(d);
        //     html += d.innerHTML;
        //     parent_element.innerHTML = prev_html;
        // }
        
        var range = sel.getRangeAt(0);
        var startContainer = range.startContainer;
        var spanNode = startContainer.ownerDocument.createElement("layer");
        var docfrag = range.cloneContents();
        spanNode.appendChild(docfrag);
        //range.insertNode(spanNode);
        html = trimOuterTags(spanNode.innerHTML);
        $(spanNode).remove();
        
        return html;
    }
    return null;
}


function trimOuterTags(s) {
  s = s.replace(/^(<[^>]*>)/, "");
  s = s.replace(/(<[^>]*>)$/, "");
  return s;
}


