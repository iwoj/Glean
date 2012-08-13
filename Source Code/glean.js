var DEBUG = true;

var baseURL = "<%= baseURL %>";

window.Glean.bootstrapper.loadScripts([
    baseURL + "/jquery.min.js",
    baseURL + "/underscore-min.js", 
    baseURL + "/backbone-min.js"
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
  var html = removeHighlights($("body").html());
  html = html.replace(/<textarea id="glean-regex">.*?<\/textarea>/, "<textarea id=\"glean-regex\">" + $("#glean-regex").val() + "</textarea>");
  var gleanStartIndex = html.indexOf('<div id="glean"');
  var gleanEndIndex = gleanStartIndex + $("#glean")[0].outerHTML.length;
  var regexp = new RegExp(trimSlashes($("#glean-regex").val()), "g");
  var matchRanges = [];
  
  while(result = regexp.exec(html)) {
    if (result.index < gleanStartIndex || result.index > gleanEndIndex) {
      matchRanges.push([result.index, result.index + result[0].length]);
    }
  }
  
  $("body").html(addHighlights(html, matchRanges));
  registerEvents(); // Event handlers need to be rebuilt after the new html is loaded
}


function setSelection(startIndex, endIndex) {
  var selection = window.getSelection();
  var range = document.createRange();
  var html = $("body").html();
  var startElement = document.getElementByOffset(startIndex);
  var endElement = document.getElementByOffset(endIndex);
  
  range.setStart(startElement, startIndex - html.indexOf(startElement.outerHTML));
  range.setEnd(endElement, endElement - html.indexOf(endElement.outerHTML));
  
  selection.addRange(range);
  
  selectElement(startElement, endElement);
  
}



function getSelectionText() {
    if (window.getSelection) {
        return window.getSelection();
        
    // IE
    } else if (document.selection) {
        return document.selection.createRange();
    }
}



function removeHighlights(html) {
  return html.replace(/<span class="glean-highlight">(.+?)<\/span>/g, "$1");
}



// Assume that the ranges are in sequential order and non-overlapping.
//
// This is all fucked up and needs to be rewritten.
//
function addHighlights(html, ranges) {
  var openTag = "<span class=\"glean-highlight\">";
  var closeTag = "</span>";
  var tagLength = (openTag.length + closeTag.length);
  var offset = 0;
  
  for (var j = 0; j < ranges.length; j++) {
    var middleSegment = html.slice(ranges[j][0], ranges[j][1]);
    
    // The length of the HTML file changes as highlights are added, so we need this offset.
    
    var middleSegmentOffset = 0;
    if (isUnspannable(middleSegment)) {
      var segmentArray = findSpannableSegments(middleSegment);
      middleSegment = addHighlights(middleSegment, segmentArray);
      middleSegmentOffset = tagLength * segmentArray.length;
    }

    html = html.slice(0, ranges[j][0] + offset) + openTag + middleSegment + closeTag + html.slice(ranges[j][1] + offset + middleSegmentOffset);
    offset += tagLength + middleSegmentOffset;
  }
  return html;
}



function findSpannableSegments(html) {
  var spannableSegments = [];
  var lastTagEndIndex = 0;
  var segmentCount = 0;
  var regexp = new RegExp(unspannableTagsRegExp(), "ig");
  
  while (result = regexp.exec(html)) {
    spannableSegments[segmentCount] = [lastTagEndIndex, result.index];
    lastTagEndIndex = result.index + result[0].length;
    segmentCount++;
  }
  if (lastTagEndIndex != html.length) {
    spannableSegments[spannableSegments.length] = [lastTagEndIndex, spannableSegments.length];
  }
  return spannableSegments;
}



function isUnspannable(middleSegment) {
  return new RegExp(unspannableTagsRegExp(), "i").test(middleSegment);
}


function unspannableTagsRegExp() {
  var unspannableTags = ["<p>","<div>","<table>","<td>","<tr>"];
  $.each(unspannableTags, function(i, tag) {
    unspannableTags[i] = tag.replace(/</g, "<\s?\\/?\s?");
    unspannableTags[i] = tag.replace(/>/g, ".*?>");
  })
  return "(" + unspannableTags.join("|") + ")";
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
  
  $("#glean-regex").keyup(function (event) {
    var ignoreKeys = [37, 38, 39, 40];
    if (ignoreKeys.indexOf(event.which) == -1)
      matchWebpage();
  });
  
  $(document).mousedown(function(event) {
    if (!document.getElementById("glean").contains(event.target))
      $("body").html(removeHighlights($("body").html()));
  });
  
  $(document).mouseup(function(event) {
    if (!$("#glean").has(event.target).length) {
      checkSelection();
      matchWebpage();
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

function selectElement(element, element2) {
    if (window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(element);
        range.setStart(element, 5);
        range.setEnd(element2, 5);
        
        sel.addRange(range);
    } else if (document.selection) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(element);
        textRange.select();
    }
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

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

