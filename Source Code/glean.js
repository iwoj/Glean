var DEBUG = true;

var baseURL = "<%= baseURL %>";

window.Glean.bootstrapper.loadScripts([
    baseURL + "/jquery.min.js",
    baseURL + "/underscore-min.js", 
    baseURL + "/backbone-min.js",
    baseURL + "/xregexp-min.js"
  ], initGlean );



function initGlean() {
  // Load CSS
  $("head").append('<link type="text/css" rel="stylesheet" media="all" href="' + baseURL + '/glean.css" />');
  
  // Load HTML and open tray
  $.get(baseURL + "/glean.html", function (data) {
    $('body').append(_.template(data.toString(), {}));
    
    registerEvents();
    openTray();
    checkSelection();
  })
  .error(function () { alert("Error loading Glean UI.")});
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
    $("#glean-instructions").fadeOut();
    var regEx = escapeRegEx(getSelectionHTML(0));
    $("#glean-regex").text("/" + regEx + "/");
    regEx.isMultiline ? $("#glean-regex").append("m") : true ;
    $("#glean-html").text(getSelectionHTML({snapToParent: true}));
    $("#glean-matching-groups").html(
      getSelectionHTML({snapToParent: false})
    );
  }
}



function matchWebpage() {
  var html = document.documentElement.outerHTML;
  XRegExp.forEach(html, new RegExp(trimSlashes($("#glean-regex").text())), function(match, i) {
    
    var gleanStartIndex = html.indexOf('<div id="glean"')
    var gleanEndIndex = gleanStartIndex + $("#glean")[0].outerHTML.length
    
    if (match.index < gleanStartIndex || match.index > gleanEndIndex) {
      if (DEBUG) console.log("match.index: " + match.index)
      if (DEBUG) console.log("gleanStartIndex: " + gleanStartIndex)
      if (DEBUG) console.log("gleanEndIndex: " + gleanEndIndex)
      //alert(match.index)
      setSelection(match.index, match.index + match[0].length)
    }
       // http://stackoverflow.com/questions/4183401/can-you-set-and-or-change-the-users-text-selection-in-javascript
       // http://xregexp.com/api/
  })
}


function setSelection(startIndex, endIndex) {
  // find element in startIndex
  // determine offset
  // same for end index
  // setselection, appending the selection range to previous select ranges, if any exist
  
  var range = document.createRange();
  range.setStart(document.getElementByOffset(startIndex), startIndex);
  range.setEnd(document.getElementByOffset(endIndex), endIndex);
  
    // if (window.getSelection && document.createRange) {
    //     var sel = window.getSelection();
    //     var range = document.createRange();
    //     range.selectNodeContents(el);
    //     sel.removeAllRanges();
    //     sel.addRange(range);
    // } else if (document.selection && document.body.createTextRange) {
    //     var textRange = document.body.createTextRange();
    //     textRange.moveToElementText(el);
    //     textRange.select();
    // }
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




function registerEvents() {
  $("#glean-cancel").click(function () {
    $('#glean').animate({
        right: '-' + $("#glean").outerWidth()
      }, 250, function () {
        $('#glean').remove();
      });
  });
  
  $("#glean-regex").blur(function () {
    matchWebpage();
  });
  
  $(document).mouseup(function(event) {
    if (!$("#glean").has(event.target).length) {
      checkSelection();
    }
  });
}




function openTray() {
  $('#glean').animate({
      right: '0'
    }, 250);
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




function resize() {
  var fixedHeightElementsTotalHeight = 200;
  var windowHeight = $(window).height();
  $("#glean-regex").height(windowHeight/2 - fixedHeightElementsTotalHeight);
  $("#glean-html").height(windowHeight/2 - fixedHeightElementsTotalHeight);
}



function trimSlashes(s) {
  s = s.replace(/^\//, "");
  s = s.replace(/\/$/, "");
  return s;
}


function trimOuterTags(s) {
  s = s.replace(/^(<[^>]*>)/, "");
  s = s.replace(/(<[^>]*>)$/, "");
  return s;
}


document.getElementByOffset = function(targetOffset) {
  // traverse DOM tree
  function searchDOM (element, currentOffset) {
    if (targetOffset > currentOffset && targetOffset < currentOffset + element.outerHTML.length) {
      for(var i = 0; i < element.children.length; i++) {
        var nextElementOffset = element.outerHTML.indexOf(element.children[i].outerHTML);
        var nextElementLength = element.children[i].outerHTML.length;
        if (targetOffset > currentOffset + nextElementOffset && targetOffset < currentOffset + nextElementOffset + nextElementLength)
          return arguments.callee(element.children[i], currentOffset+nextElementOffset);
      }
      return element
    }
  }
  return searchDOM(document.all[0], 0, targetOffset)
}


