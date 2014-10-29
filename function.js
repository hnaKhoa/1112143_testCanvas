// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs

// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);

// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }

var v;
var c;
var context;
var back;
var backcontext;
var cw;
var ch;

var normal;
var laplace;
var canny;
var grayscale;
var emboss;

var textarea;
//function startRead()
//{
//    var file = document.getElementById('file').files[0];
//    v = document.getElementById('v');

//    var source = document.createElement('source');
//    source.setAttribute('src', file.name);
//    source.setAttribute('type','video/mp4');
//    v.appendChild(source);
//    v.load();
//    c = document.getElementById('c');
//    context = c.getContext('2d');
//    back = document.createElement('canvas');
//    backcontext = back.getContext('2d');

//    cw = v.clientWidth;
//    ch = v.clientHeight;

//    c.width = cw;
//    c.height = ch;

//    back.width = cw;
//    back.height = ch;

//    v.addEventListener('play', function () {
//        var weights = [0];
//        normal= setInterval(function(){ draw(v, context, backcontext, cw, ch,weights)},0);
//    }, false);
    
//}

document.addEventListener('DOMContentLoaded', function () {
    v = document.getElementById('v');
    c = document.getElementById('c');
    context = c.getContext('2d');
    back = document.createElement('canvas');
    backcontext = back.getContext('2d');

    cw = v.clientWidth;
    ch = v.clientHeight;

    c.width = cw;
    c.height = ch;

    back.width = cw;
    back.height = ch;

    v.addEventListener('play', function () {
        var weights = [0];
        normal= setInterval(function(){ draw(v, context, backcontext, cw, ch,weights)},0);
    }, false);

}, false);



function draw(v, c,pixels, w1, h1,weights) {
    if(v.paused || v.ended) return false;
    // First, draw it into the backing canvas
    pixels.drawImage(v,0,0,w1,h1);
    var idata = pixels.getImageData(0, 0, w1, h1);

    var src = idata.data;
    var dst = src;

    if(weights.length==1){
        if (weights[0] == 0) {
            c.putImageData(idata, 0, 0);
            return false;
        }
        if (weights[0] == 1) {
            for (var i = 0; i < src.length; i += 4) {
                var r = src[i];
                var g = src[i + 1];
                var b = src[i + 2];
                var brightness = (3 * r + 4 * g + b) >>> 3;
                dst[i] = brightness;
                dst[i + 1] = brightness;
                dst[i + 2] = brightness;
            }

        }
    }

    
    
    idata.data = ConvolutionFilter(src,dst,w1,h1,weights);
    c.putImageData(idata, 0, 0);
}

function ConvolutionFilter(src, dst, w1, h1, weights)
{
    var sw = w1;
    var sh = h1;
    // pad output by the convolution matrix
    var w = sw;
    var h = sh;
    
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    // go through the destination image pixels
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            var r = 0, g = 0, b = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = sy + cy - halfSide;
                    var scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = (scy * sw + scx) * 4;
                        var wt = weights[cy * side + cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff + 1] * wt;
                        b += src[srcOff + 2] * wt;

                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
        }
    }
    return dst;
}

function Normal()
{
    var weights = [0];
    
    clearAllInterval();
    normal = setInterval(function () { draw(v, context, backcontext, cw, ch, weights) }, 0);
}

function Grayscale()
{
    var weights = [1];
    clearAllInterval();
    grayscale = setInterval(function () { draw(v, context, backcontext, cw, ch, weights) }, 0);
}

function LaplaceFilter()
{
    var weights = [-1, -1, -1,
                   -1,  9, -1,
                   -1, -1, -1];
    textarea = document.getElementById('taShowFilter');
    textarea.textContent = "Two dimension filter box:\n"+'['+weights.toString()+']';
    clearAllInterval();
    laplace = setInterval(function () { draw(v, context, backcontext, cw, ch, weights) }, 0);
}

function CannyFilter()
{

    var weights = [-1, 0, 1,
                   -2, 0, 2,
                   -1, 0, 1];
    textarea = document.getElementById('taShowFilter');
    textarea.textContent = "Two dimension filter box:\n" + '[' + weights.toString() + ']';
    clearAllInterval();
    canny = setInterval(function () { draw(v, context, backcontext, cw, ch, weights) }, 0);
}

function EmbossFilter()
{
    var weights = [-2,-2, 0,
                   -2, 6, 0,
                    0, 0, 0];
    textarea = document.getElementById('taShowFilter');
    textarea.textContent = "Two dimension filter box:\n" + '[' + weights.toString() + ']';
    clearAllInterval();
    emboss = setInterval(function () { draw(v, context, backcontext, cw, ch, weights) }, 0);
}

function clearAllInterval()
{
    clearInterval(normal);
    clearInterval(laplace);
    clearInterval(canny);
    clearInterval(grayscale);
    clearInterval(emboss);
}
