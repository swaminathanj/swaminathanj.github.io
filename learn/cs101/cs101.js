// Copyright 2015 Owen Astrachan, Drew Hilton, Susan Rodger, Robert Duvall
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Created by Nick Parlante
// Updated by Robert Duvall


// Manage Student data
var globalCustomFiles = { };

// editor data
var globalEditor = null;
var globalSaveNeeded = false;

// depends on having an "output" div for printing
var globalRunId = 'editor';
var globalCurrentImage = null;
var globalLastCanvas = null;
var globalCanvasCount = 0;
var globalImageCodeCount = 0;


// Bottleneck to put in the data:xxx per filename
function addCustomData (filename, data) {
    console.log('saving custom data: ' + filename);
    globalCustomFiles[filename.toLowerCase().trim()] = data;
}

// Bottleneck to retrieve data, or null
// Not case sensitive
function getCustomData (filename) {
    filename = filename.toLowerCase().trim();
    if (filename in globalCustomFiles) {
        console.log('found in custom data: ' + filename);
        return globalCustomFiles[filename];
    } else {
        console.log('NOT found in custom data: ' + filename);
        return null;
    }
}

// NEEDED?
function removeCustomData (filename) {
    filename = filename.toLowerCase();
    if (filename in globalCustomFiles) {
        delete globalCustomFiles[filename];
    }
}


// setup ace editor and other tools needed by the page so it is not copied in the HTML
function loadTools (codeText) {
    // setup editor and add styling and options here
    // var langTools = ace.require('ace/ext/language_tools');
    globalEditor = ace.edit('editor');
    globalEditor.setShowPrintMargin(false);
    var session = globalEditor.getSession();
    session.setMode('ace/mode/javascript');
    session.setUseWrapMode(true);
    session.on('change', function (evt) {
        globalSaveNeeded = true;
    });
    //globalEditor.setValue(codeText);
    //globalEditor.removeAllListeners('mousedown');
    // BUGBUG: can't seem to turn off default drop behavior :(
    //globalEditor.container.addEventListener('drop', dropImageOnEditor, false);
    //    window.globalEditor.setOptions({
    //       enableBasicAutocompletion: true,
    //        enableSnippets: true,
    //        enableLiveAutocompletion: true
    //    });
    //    document.getElementById('#resizable').resizable({
    //        resize: function( event, ui ) {
    //            editor.resize();
    //        }
    //    });
    // preload the images in the thumbnail drawer
    var images = document.getElementsByClassName('thumb');
    for (var i = 0; i < images.length; i++) {
        addCustomData(images[i].title, new SimpleImage(images[i]));
    }
    // Prevent users from losing work when leaving the page
    window.onbeforeunload = function() {
        if (globalSaveNeeded) {
            return 'Warning: there are unsaved changes to your code, are you sure you want to leave this page?';
        }
        else {
            return null;
        }
    }
}


function upload (evt) {
    handleFileSelect(evt.target.files, window.globalAcceptedFileType);
}


function setCurrentImage (evt) {
    window.globalCurrentImage = new SimpleImage(evt.target.toDataURL());
    var popup = document.createElement('div');
    popup.id = 'PopUp';
    popup.style = 'position: absolute;';
    document.body.appendChild(popup);
}

function unsetCurrentImage (evt) {
    window.globalCurrentImage = null;
    var popup = document.getElementById('PopUp');
    document.body.removeChild(popup);
}

function displayPixel (evt) {
    console.log('mouse = ' + evt.offsetX + ', ' + evt.offsetY);
    if (window.globalCurrentImage) {
        var popup = document.getElementById('PopUp');
        popup.style.left = evt.pageX + 'px';
        popup.style.top = evt.pageY + 'px';
        var x = evt.offsetX + ((evt.target.parentElement.scrollLeft) ? evt.target.parentElement.scrollLeft : 0);
        var y = evt.offsetY + ((evt.target.parentElement.scrollTop) ? evt.target.parentElement.scrollTop : 0);
        popup.innerHTML = '<span>location = (' + x + ', ' + y + ')<br>pixel = [' + window.globalCurrentImage.getPixel(x, y) + ']</span>';
    }
}

function scrollPixel (evt) {
    // do nothing
}

// support dragging and dropping files
function allowDrop (evt) {
    evt.preventDefault();
}

function drop (evt) {
    evt.preventDefault();
    handleFileSelect(evt.dataTransfer.files, window.globalAcceptedFileType);
}

function handleFileSelect (files, type) {
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        if (f.type.match(type)) {
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    var img = new SimpleImage(e.target.result);
                    addCustomData(theFile.name, img);
                    var thumbnail = function () {
                        // Render thumbnail with title
                        var div = document.createElement('div');
                        var src = e.target.result;
                        div.id = 'list';
                        div.innerHTML = ['<img class="thumb" src="', src,
                                         '" title="', escape(theFile.name),
                                         '"/>', '<br>', theFile.name,
                                         '<br>[', img.width, 'x', img.height, ']'].join('');
                        document.getElementById('preview-row').appendChild(div);
                    };
                    if (img.complete()) {
                        thumbnail();
                    }
                    else {
                        setTimeout(function() {
                            thumbnail();
                        }, 100);
                    }
                };
            })(f);
            // Read in the image file as a data:xxx into the .result
            reader.readAsDataURL(f);
        }
    }
}

function dropImageOnEditor (evt) {
    globalImageCodeCount++;
    var imgName = lastElement(evt.dataTransfer.getData('Text'));
    var code = 'var image' + globalImageCodeCount + ' = new SimpleImage("' + imgName + '");\n';
    window.globalEditor.session.insert({ row: 0, column: 0 }, code);
    return false;
}


// allow user to download edited code
function download (text, name, type) {
    var save = document.createElement('a');
    if (text === '') {
        save.href = 'data:image/png;' + getOutputCanvas().toDataURL();
    }
    else {
        save.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(text);
        window.globalSaveNeeded = false;
    }
    save.download = name;
    // set hidden so the element does not disrupt page
    save.visibility = 'hidden';
    save.display = 'none';
    // append to page
    document.body.appendChild(save);
    // trigger a click
    save.click();
    document.body.removeChild(save);
}

// allow user to reload previously saved code
function upload (type) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text';
    input.multiple = false;
    input.onchange = function () {
        var reader = new FileReader();
        reader.onload = function() {
            window.globalEditor.setValue(reader.result);
            document.body.removeChild(input);
        };
        reader.readAsText(input.files[0]);
    };
    // set hidden so the element does not disrupt page
    input.visibility = 'hidden';
    input.display = 'none';
    // append to page
    document.body.appendChild(input);
    // trigger a click
    input.click();
}

function toggleImageView () {
    var button = document.getElementById('toggle');
    var output = getOutput();
    var canvas = getOutputCanvas();
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    var newWidth = canvas.width;
    var newHeight = canvas.height;
    if (button.innerHTML == '[See Image Original Size]') {
        button.innerHTML = '[See Image Fit To Window]';
        newWidth = canvas.origWidth;
        newHeight = canvas.origHeight;
    }
    else {
        button.innerHTML = '[See Image Original Size]';
        canvas.origWidth = canvas.width;
        canvas.origHeight = canvas.height;
        var wDiff = oldWidth - output.clientWidth;
        var hDiff = oldHeight - output.clientHeight;
        if (wDiff > hDiff) {
            newWidth = output.clientWidth - 20;
            newHeight = Math.min(Math.floor(newHeight * output.clientWidth / oldWidth), output.clientHeight - 20);
        }
        else {
            newHeight = output.clientHeight - 20;
            newWidth = Math.min(Math.floor(newWidth * output.clientHeight / oldHeight), output.clientWidth - 20);
        }
    }
    console.log('trigger: ' + oldWidth + 'x' + oldHeight + ' to ' + newWidth + 'x' + newHeight);
    var img = new SimpleImage(canvas);
    img.setSize(newWidth, newHeight);
    img.drawTo(canvas);
}


// Evaluate code
// MY versions of Nick's code (takes editor text instead of element ID)
function evaluateInput (text) {
    window.globalRunId = 'editor';  // hack: set state used by printing
    window.globalPrintText = '';
    var images = extractImages(text);
    if (preloadImages(images) === images.length) {
        evaluateShow(text);
    }
}

// Wrap evaluate() with logic to show error messages.
// Prints/line-selects on error output.
function evaluateShow (text) {
    try {
        clearOutput();
        var e = evaluateText(text);
        if (e) {
            var numLines = text.split(/\r\n|\r|\n/).length;
            print('<font color=red>Error:</font>');
            if (e.userLine > 0 && e.userLine <= numLines) {
                // BUGBUG: fix this
                //var editor = document.getElementById(window.globalRunId);
                //selectLine(ta, e.userLine);
                print('<font color=red>Line ' + e.userLine + '</font>');
                globalEditor.scrollToLine(e.userLine, true, false, function() {});
            }
            print(e.message);
        }
    }
    catch (e) {
        alert('Low level evaluation error:' + e);
    }
}

// Eval given code.
// For code errors, returns an error object with
// .userError true and .line .message set.
// Otherwise returns null.
function evaluateText (text) {
    try {
        eval(text);
        return null;
    }
    catch (e) {
        e.userError = true;
        e.userLine = extractLine(e);
        return e;
    }
}


function extractLine (e) {
    // likely IE < 10
    if (!e.stack) {
        return -1;
    }
    console.log(e.stack.toString());
    // Safari: try .line attribute which is what we want.
    if (e.line) {
        return e.line;
    }
    // Firefox: try .lineNumber (non-standard, and iffy)
    //if (e.lineNumber) {
    //    return e.lineNumber;
    //}
    // seems to work for multiple browsers
    var frameRE = /:(\d+):/g;
    var stack = e.stack.toString().split(/\r\n|\n|\r/);
    for (var i=0; i < stack.length; i++) {
        var frame = stack[i];
        if (frame.indexOf('eval') != -1) {
            // we want the last one on the line
            var last = -1;
            var matches;
            while ((matches = frameRE.exec(frame)) !== null) {
                last = matches[1];
            }
            return last;
        }
    }
    // BUGBUG: unable to get line number
    console.log('Unable to get line number!');
    return -1;
}

// Callback for image load error case .. put up some UI
function errorImage (filename) {
    // alert('problem loading image:' + img.src);
    alert('Could not find image named ' + filename +
          '.\nAre you sure it is spelled correctly and has the correct extension?');
    console.log('problem loading image: ' + filename);
}

// Returns array of urls to load
function extractImages (code) {
    var result = [];
    var re = /SimpleImage\(\s*("|')(.*?)("|')\s*\)/g;
    while (ar = re.exec(code)) {
        // Used to screen out data: urls here, but that messed up the .loaded attr, strangely
        result.push(ar[2]);
    }
    return result;
}

// Calls load image once for each name, ignoring the result.
// Upon load, causes the globalEvalFn to be run.
function preloadImages (names) {
    for (var i=0; i < names.length; i++) {
        if (loadImage(names[i]) === null) {
            errorImage(names[i]);
            return i;
        }
    }
    return names.length;
}

// Adds a hidden img for the given filename like "flowers.jpg" to the output area
// (starting it to be loaded) and returns a pointer to the img. Uses a cache
// per filename. Will use custom images stored in window.customImages by name.
function loadImage (filename) {
    return getCustomData(filename);
}

// Returns img element inside output with the given src if found, or null.
// Given filename should be the last part of the path, e.g. "flowers.jpg"
function getImageBySrc (filename) {
    return getImageInHTML('src', filename);
}

function getOutputCanvas () {
    return getImageInHTML('imgData', 'true');
}

function getImageInHTML (attr, value) {
    var output = getOutput();
    var children = output.childNodes;
    for (var i = 0; i < children.length; i++) {
        var imgsrc = children[i].getAttribute(attr);  // can be huge for data: case
        if (imgsrc && imgsrc.length < 1000 && lastElement(imgsrc) == value) {
            return children[i];
        }
    }
    return null;
}

function makeCanvas (prefix, visible) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', prefix + globalCanvasCount);
    if (! visible) {
        canvas.setAttribute('style', 'display:none');
    }
    canvas.innerHTML = 'Your browser does not support HTML5.'
    globalCanvasCount++;
    return canvas;
}

// Returns the current global output element to use -- uses
// globalRunId, so uses the correct output area for the current run.
// Could add "throw" logic to detect errors here.
function getOutput() {
    return document.getElementById(window.globalRunId + '-output');
}

function getDebugOutput() {
    return document.getElementById('debug-output');
}

// Clears the current output.
function clearOutput () {
    var output = getOutput();
    output.innerHTML = '';
    var debug = getDebugOutput();
    debug.innerHTML = '';
    // reset button text
    var button = document.getElementById('toggle');
    button.innerHTML = '[See Image Fit to Window]';
    // should work, but isn't
    // button.innerHTML = window.globalToggleButtonText;
}

// Print any number of things, separated by spaces and ending with a carriage return.
function print () {
    printTo(getOutput(), arguments);
}

function debug () {
    printTo(getDebugOutput(), arguments);
}

function printTo (output, values) {
    for (var i=0; i < values.length; i++) {
        printOne(output, values[i], i==values.length-1);
    }
    printOne(output, '<br>');
}

// Low level print-one-thing. The something can be a string, number, htmlImage or SimpleImage.
// Optional 2nd argument isLast, true if this is the last thing, so no spacer to follow.
function printOne (output, something) {
    // If there's a .getString() function, use it (Row SimplePixel Histogram)
    // This spares us from depending on instanceof/classname.
    if (something.getString) {
        something = something.getString();
    }
    if (typeof something == 'string' || typeof something == 'number') {  // note: instanceof and String is a no-go
        var p = document.createElement('text');
        var spacer = (something == '<br>') ? '' : ' ';
        p.innerHTML = something + spacer;  // by using innerHTML here, markup in the string works.
        output.appendChild(p);
        // 2014 accumulate text output
        if (something == '<br>') {
            something = '\n';
            spacer = '';
        }
        if (arguments.length == 2 && arguments[1]) spacer = ''; // edge case: no spacer for last item
        window.globalPrintText += something + spacer;
    }
    else if (something instanceof HTMLImageElement) {
        var copy = something.cloneNode(true);
        copy.setAttribute('style', '');
        copy.setAttribute('id', '');
        // used to create <p> here to put on new line.
        //var p = document.createElement('p');
        //p.appendChild(copy);
        output.appendChild(copy);
    }
    else if (something.drawTo) {
        var canvas = makeCanvas('canvas', visible=true);
        // maybe later, but flakey now
        //canvas.setAttribute('onMouseOver', 'setCurrentImage(event)');
        //canvas.setAttribute('onMouseOut', 'unsetCurrentImage(event)');
        //canvas.setAttribute('onMouseMove', 'displayPixel(event)');
        //output.setAttribute('onScroll', 'scrollPixel(event)');
        // 2014 jsinput-hack
        // Mark the canvas as the right sort to save.
        canvas.setAttribute('imgData', true);
        something.drawTo(canvas);
        output.appendChild(canvas);
        window.globalLastCanvas = canvas;
    }
    else {
        alert('bad print with: ' + something);
    }
}

// Basic CS 101 Utilities
// Returns last-element of path, extract filename from path
function lastElement (path) {
    var i = path.lastIndexOf('/');
    if (i > 0) return path.substr(i+1);
    else       return path;
}
