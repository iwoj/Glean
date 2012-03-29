var baseURL = "<%= baseURL %>";

window.Lamprey.bootstrapper.loadScripts([
    baseURL + "/jquery.min.js",
    baseURL + "/underscore-min.js", 
    baseURL + "/backbone-min.js"
  ], initLamprey );

function resize() {
  var fixedHeightElementsTotalHeight = 200;
  //$("#lamprey-instructions").is(":visible")
  var windowHeight = $(window).height();
  $("#lamprey-regex").height(windowHeight/2 - fixedHeightElementsTotalHeight);
  $("#lamprey-html").height(windowHeight/2 - fixedHeightElementsTotalHeight);
}

function initLamprey() {
  // Load CSS
  $("head").append('<link type="text/css" rel="stylesheet" media="all" href="' + baseURL + '/lamprey.css" />');
  
  // resize();
  
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
  s = s.replace(/[\[\]{}()*+?.\\\/^$|#]/g, "\\$&");
  s = s.replace(/\n/g, "\\n");
  s = s.replace(/\r/g, "\\r");
  s.isMultiline = true;
  return s;
}

function checkSelection() {
  var selection = getSelectionText();
  if (selection != "") {
    $("#lamprey-instructions").fadeOut();
    var regEx = escapeRegEx(getSelectionHTML(0));
    $("#lamprey-regex").text("/" + regEx + "/");
    regEx.isMultiline ? $("#lamprey-regex").append("m") : true ;
    $("#lamprey-html").text(getSelectionHTML({snapToParent: true}));
    $("#lamprey-matching-groups").html(
      getSelectionHTML({snapToParent: false})
    );
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
        var range = sel.getRangeAt(0);
        var startContainer = range.startContainer;
        var endContainer = range.endContainer;
        var startOffset = range.startOffset;
        var endOffset = range.endOffset;
        
        if (arguments[0]["snapToParent"]) {
          // Set Expanded Range
          range2 = document.createRange();
          range2.setStartBefore(startContainer.parentNode.parentNode, 0);
          range2.setEndAfter(endContainer.parentNode.parentNode, endContainer.parentNode.parentNode.childNodes.length);
          sel.removeAllRanges();
          sel.addRange(range2);
          
          var html = getHTMLFromRange(range2, false);
          
          // Reset Selection
          range2.setStart(startContainer, startOffset);
          range2.setEnd(endContainer, endOffset);
          sel.removeAllRanges();
          sel.addRange(range2);
          
          return html;
        }
        else {
          return getHTMLFromRange(range, true);
        }
    }
    return null;
}


function getHTMLFromRange(range, trim) {
  var spanNode = range.startContainer.ownerDocument.createElement("layer");
  var docfrag = range.cloneContents();
  spanNode.appendChild(docfrag);
  //range.insertNode(spanNode);
  var html;
  trim ? html = trimOuterTags(spanNode.innerHTML) : html = spanNode.innerHTML;
  $(spanNode).remove();
  return html;
}


function trimOuterTags(s) {
  s = s.replace(/^(<[^>]*>)/, "");
  s = s.replace(/(<[^>]*>)$/, "");
  return s;
}


