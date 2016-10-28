/**
 * @fileOverview Favico animations
 * @author Miroslav Magda, http://blog.ejci.net
 * @version 0.2.1
 */

/**
 * Create new favico instance
 * @param {Object} Options
 * @return {Object} Favico object
 * @example
 * var favico = new Favico({
 *    bgColor : '#d00',
 *    textColor : '#fff',
 *    type : 'circle',
 *    animation : 'slide',
 * });
 */
var Favico = (function(opt) {'use strict';
    opt = (opt) ? opt : {};
    var _def = {
        bgColor : '#d00',
        textColor : '#fff',
        type : 'circle',
        animation : 'slide',
        elementId : false
    };
    var _opt, _orig, _h, _w, _canvas, _context, _img, _ready, _lastBadge, _running, _readyCb, _stop, _browser;

    var _queue = [];
    _readyCb = function() {
    };
    _ready = _stop = false;
    /**
     * Initialize favico
     */
    var init = function() {
        //merge initial options
        _opt = merge(_def, opt);
        _opt.bgColor = hexToRgb(_opt.bgColor);
        _opt.textColor = hexToRgb(_opt.textColor);
        _opt.animation = (animation.types['' + _opt.animation]) ? _opt.animation : _def.animation;
        _opt.type = (type['' + _opt.type]) ? _opt.type : _def.type;
        try {
            _orig = link.getIcon();
            //create temp canvas
            _canvas = document.createElement('canvas');
            //create temp image
            _img = document.createElement('img');
            _img.setAttribute('src', _orig.getAttribute('href'));
            //get width/height
            _img.onload = function() {
                _h = (_img.height > 0) ? _img.height : 32;
                _w = (_img.width > 0) ? _img.width : 32;
                _canvas.height = _h;
                _canvas.width = _w;
                _context = _canvas.getContext('2d');
                icon.ready();
            };
            _browser = {};
            _browser.ff = (/firefox/i.test(navigator.userAgent.toLowerCase()));
            _browser.chrome = (/chrome/i.test(navigator.userAgent.toLowerCase()));
            _browser.opera = (/opera/i.test(navigator.userAgent.toLowerCase()));
            _browser.ie = (/msie/i.test(navigator.userAgent.toLowerCase())) || (/trident/i.test(navigator.userAgent.toLowerCase()));
            _browser.supported = (_browser.chrome || _browser.ff || _browser.opera);
        } catch(e) {
            throw 'Error initializing favico...';
        }

    };
    /**
     * Icon namespace
     */
    var icon = {};
    /**
     * Icon is ready (reset icon) and start animation (if ther is any)
     */
    icon.ready = function() {
        _ready = true;
        icon.reset();
        _readyCb();
    };
    /**
     * Reset icon to default state
     */
    icon.reset = function() {
        //reset
        _queue = [];
        _lastBadge = false;
        _context.clearRect(0, 0, _w, _h);
        _context.drawImage(_img, 0, 0, _w, _h);
        link.setIcon(_canvas);
    };
    /**
     * Start animation
     */
    icon.start = function() {
        if (!_ready || _running) {
            return;
        }
        var finished = function() {
            _lastBadge = _queue[0];
            _running = false;
            if (_queue.length > 0) {
                _queue.shift();
                icon.start();
            } else {

            }
        };
        if (_queue.length > 0) {
            _running = true;
            if (_lastBadge) {
                animation.run(_lastBadge.options, function() {
                    animation.run(_queue[0].options, function() {
                        finished();
                    }, false);
                }, true);
            } else {
                animation.run(_queue[0].options, function() {
                    finished();
                }, false);
            }
        }
    };

    /**
     * Badge types
     */
    var type = {};
    var options = function(opt) {
        opt.n = Math.abs(opt.n);
        opt.x = _w * opt.x;
        opt.y = _h * opt.y;
        opt.w = _w * opt.w;
        opt.h = _h * opt.h;
        return opt;
    };
    /**
     * Generate circle
     * @param {Object} opt Badge options
     */
    type.circle = function(opt) {
        opt = options(opt);
        var more = (opt.n > 9);
        if (more) {
            opt.x = opt.x - opt.w * .4;
            opt.w = opt.w * 1.4;
        }
        _context.clearRect(0, 0, _w, _h);
        _context.drawImage(_img, 0, 0, _w, _h);
        _context.beginPath();
        _context.font = "bold " + Math.floor(opt.h) + "px sans-serif";
        _context.textAlign = 'center';
        if (more) {
            _context.moveTo(opt.x + opt.w / 2, opt.y);
            _context.lineTo(opt.x + opt.w - opt.h / 2, opt.y);
            _context.quadraticCurveTo(opt.x + opt.w, opt.y, opt.x + opt.w, opt.y + opt.h / 2);
            _context.lineTo(opt.x + opt.w, opt.y + opt.h - opt.h / 2);
            _context.quadraticCurveTo(opt.x + opt.w, opt.y + opt.h, opt.x + opt.w - opt.h / 2, opt.y + opt.h);
            _context.lineTo(opt.x + opt.h / 2, opt.y + opt.h);
            _context.quadraticCurveTo(opt.x, opt.y + opt.h, opt.x, opt.y + opt.h - opt.h / 2);
            _context.lineTo(opt.x, opt.y + opt.h / 2);
            _context.quadraticCurveTo(opt.x, opt.y, opt.x + opt.h / 2, opt.y);
        } else {
            _context.arc(opt.x + opt.w / 2, opt.y + opt.h / 2, opt.h / 2, 0, 2 * Math.PI);
        }
        _context.fillStyle = 'rgba(' + _opt.bgColor.r + ',' + _opt.bgColor.g + ',' + _opt.bgColor.b + ',' + opt.o + ')';
        _context.fill();
        _context.closePath();
        _context.beginPath();
        _context.stroke();
        _context.fillStyle = 'rgba(' + _opt.textColor.r + ',' + _opt.textColor.g + ',' + _opt.textColor.b + ',' + opt.o + ')';
        _context.fillText((more) ? '9+' : opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
        _context.closePath();
    };
    /**
     * Generate rectangle
     * @param {Object} opt Badge options
     */
    type.rectangle = function(opt) {
        opt = options(opt);
        var more = (opt.n > 9);
        if (more) {
            opt.x = Math.floor(opt.x - opt.w * .4);
            opt.w = Math.floor(opt.w * 1.4);
        }
        _context.clearRect(0, 0, _w, _h);
        _context.drawImage(_img, 0, 0, _w, _h);
        _context.beginPath();
        _context.font = "bold " + Math.floor(opt.h) + "px sans-serif";
        _context.textAlign = 'center';
        _context.fillStyle = 'rgba(' + _opt.bgColor.r + ',' + _opt.bgColor.g + ',' + _opt.bgColor.b + ',' + opt.o + ')';
        _context.fillRect(opt.x, opt.y, opt.w, opt.h);
        _context.fillStyle = 'rgba(' + _opt.textColor.r + ',' + _opt.textColor.g + ',' + _opt.textColor.b + ',' + opt.o + ')';
        _context.fillText((more) ? '9+' : opt.n, Math.floor(opt.x + opt.w / 2), Math.floor(opt.y + opt.h - opt.h * 0.15));
        _context.closePath();
    };

    /**
     * Set badge
     */
    var badge = function(number, animType) {
        _readyCb = function() {
            try {
                if (number > 0) {
                    if (animation.types['' + animType]) {
                        _opt.animation = animType;
                    }
                    _queue.push({
                        type : 'badge',
                        options : {
                            n : number
                        }
                    });
                    if (_queue.length > 100) {
                        throw 'Too many badges requests in queue...';
                        return;
                    }
                    icon.start();
                } else {
                    icon.reset();
                }
            } catch(e) {
                throw 'Error setting badge...';
            }
        };
        if (_ready) {
            _readyCb();
        }
    };

    /**
     * Set image as icon
     */
    var image = function(imageElement) {
        _readyCb = function() {
            try {
                var w = imageElement.width;
                var h = imageElement.height;
                var newImg = document.createElement('img');
                var ratio = (w / _w < h / _h) ? (w / _w) : (h / _h);
                newImg.setAttribute('src', imageElement.getAttribute('src'));
                newImg.height = (h / ratio);
                newImg.width = (w / ratio);
                _context.clearRect(0, 0, _w, _h);
                _context.drawImage(newImg, 0, 0, _w, _h);
                link.setIcon(_canvas);
            } catch(e) {
                throw 'Error setting image...';
            }
        };
        if (_ready) {
            _readyCb();
        }
    };
    /**
     * Set video as icon
     */
    var video = function(videoElement) {
        _readyCb = function() {
            try {
                if (videoElement === 'stop') {
                    _stop = true;
                    icon.reset();
                    _stop = false;
                    return;
                }
                var w = videoElement.width;
                var h = videoElement.height;
                var ratio = (w / _w < h / _h) ? (w / _w) : (h / _h);

                videoElement.addEventListener('play', function() {
                    drawVideo(this);
                }, false);

            } catch(e) {
                throw 'Error setting video...';
            }
        };
        if (_ready) {
            _readyCb();
        }
    };
    /**
     * Set video as icon
     */
    var webcam = function(action) {
        //UR
        if (!window.URL || !window.URL.createObjectURL) {
            window.URL = window.URL || {};
            window.URL.createObjectURL = function(obj) {
                return obj;
            };
        }
        if (_browser.supported) {
            var newVideo = false;
            navigator.getUserMedia = navigator.getUserMedia || navigator.oGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
            _readyCb = function() {
                try {
                    if (action === 'stop') {
                        _stop = true;
                        icon.reset();
                        _stop = false;
                        return;
                    }
                    newVideo = document.createElement('video');
                    newVideo.width = _w;
                    newVideo.height = _h;
                    navigator.getUserMedia({
                        video : true,
                        audio : false
                    }, function(stream) {
                        newVideo.src = URL.createObjectURL(stream);
                        newVideo.play();
                        drawVideo(newVideo);
                    }, function() {
                    });
                } catch(e) {
                    throw 'Error setting webcam...';
                }
            };
            if (_ready) {
                _readyCb();
            }
        }

    };

    /**
     * Draw video to context and repeat :)
     */
    function drawVideo(video) {
        if (video.paused || video.ended || _stop) {
            return false;
        }
        //nasty hack for FF webcam (Thanks to Julian Ćwirko, kontakt@redsunmedia.pl)
        try {
            _context.clearRect(0, 0, _w, _h);
            _context.drawImage(video, 0, 0, _w, _h);
        } catch(e) {

        }
        setTimeout(drawVideo, animation.duration, video);
        link.setIcon(_canvas);
    }

    var link = {};
    /**
     * Get icon from HEAD tag or create a new <link> element
     */
    link.getIcon = function() {
        var elm = false;
        //get link element
        var getLink = function() {
            var link = document.getElementsByTagName('head')[0].getElementsByTagName('link');
            for (var l = link.length, i = (l - 1); i >= 0; i--) {
                if ((/icon/i).test(link[i].getAttribute('rel'))) {
                    return link[i];
                }
            }
            return false;
        };
        if (_opt.elementId) {
            //if img element identified by elementId
            elm = document.getElementById(_opt.elementId);
            elm.setAttribute('href', elm.getAttribute('src'));
        } else {
            //if link element
            elm = getLink();
            if (elm === false) {
                elm = document.createElement('link');
                elm.setAttribute('rel', 'icon');
                document.getElementsByTagName('head')[0].appendChild(elm);
            }
        }
        elm.setAttribute('type', 'image/png');
        //misspelled "image"
        return elm;
    };
    link.setIcon = function(canvas) {
        var url = canvas.toDataURL('image/png');
        if (_opt.elementId) {
            //if is attached to element (image)
            document.getElementById(_opt.elementId).setAttribute('src', url);
        } else {
            //if is attached to fav icon
            if (_browser.ff || _browser.opera) {
                //for FF we need to "recreate" element, atach to dom and remove old <link>
                var originalType = _orig.getAttribute('rel');
                var old = _orig;
                _orig = document.createElement('link');
                //_orig.setAttribute('rel', originalType);
                if (_browser.opera) {
                    _orig.setAttribute('rel', 'icon');
                }
                _orig.setAttribute('rel', 'icon');
                _orig.setAttribute('type', 'image/png');
                document.getElementsByTagName('head')[0].appendChild(_orig);
                _orig.setAttribute('href', url);
                if (old.parentNode) {
                    old.parentNode.removeChild(old);
                }
            } else {
                _orig.setAttribute('href', url);
            }
        }
    };

    //http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb#answer-5624139
    //HEX to RGB convertor
    function hexToRgb(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r : parseInt(result[1], 16),
            g : parseInt(result[2], 16),
            b : parseInt(result[3], 16)
        } : false;
    };
    /**
     * Merge options
     */
    function merge(def, opt) {
        var mergedOpt = {};
        for (var attrname in def) {
            mergedOpt[attrname] = def[attrname];
        }
        for (var attrname in opt) {
            mergedOpt[attrname] = opt[attrname];
        }
        return mergedOpt;
    }

    /**
     * @namespace animation
     */
    var animation = {};
    /**
     * Animation "frame" duration
     */
    animation.duration = 40;
    /**
     * Animation types (none,fade,pop,slide)
     */
    animation.types = {};
    animation.types.fade = [{
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.0
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.1
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.2
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.3
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.4
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.5
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.6
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.7
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.8
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 0.9
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1.0
    }];
    animation.types.none = [{
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1
    }];
    animation.types.pop = [{
        x : 1,
        y : 1,
        w : 0,
        h : 0,
        o : 1
    }, {
        x : 0.9,
        y : 0.9,
        w : 0.1,
        h : 0.1,
        o : 1
    }, {
        x : 0.8,
        y : 0.8,
        w : 0.2,
        h : 0.2,
        o : 1
    }, {
        x : 0.7,
        y : 0.7,
        w : 0.3,
        h : 0.3,
        o : 1
    }, {
        x : 0.6,
        y : 0.6,
        w : 0.4,
        h : 0.4,
        o : 1
    }, {
        x : 0.5,
        y : 0.5,
        w : 0.5,
        h : 0.5,
        o : 1
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1
    }];
    animation.types.popFade = [{
        x : 0.75,
        y : 0.75,
        w : 0,
        h : 0,
        o : 0
    }, {
        x : 0.65,
        y : 0.65,
        w : 0.1,
        h : 0.1,
        o : 0.2
    }, {
        x : 0.6,
        y : 0.6,
        w : 0.2,
        h : 0.2,
        o : 0.4
    }, {
        x : 0.55,
        y : 0.55,
        w : 0.3,
        h : 0.3,
        o : 0.6
    }, {
        x : 0.50,
        y : 0.50,
        w : 0.4,
        h : 0.4,
        o : 0.8
    }, {
        x : 0.45,
        y : 0.45,
        w : 0.5,
        h : 0.5,
        o : 0.9
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1
    }];
    animation.types.slide = [{
        x : 0.4,
        y : 1,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.9,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.9,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.8,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.7,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.6,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.5,
        w : 0.6,
        h : 0.6,
        o : 1
    }, {
        x : 0.4,
        y : 0.4,
        w : 0.6,
        h : 0.6,
        o : 1
    }];
    /**
     * Run animation
     * @param {Object} opt Animation options
     * @param {Object} cb Callabak after all steps are done
     * @param {Object} revert Reverse order? true|false
     * @param {Object} step Optional step number (frame bumber)
     */
    animation.run = function(opt, cb, revert, step) {
        var animationType = animation.types[_opt.animation];
        if (revert === true) {
            step = ( typeof step !== 'undefined') ? step : animationType.length - 1;
        } else {
            step = ( typeof step !== 'undefined') ? step : 0;
        }
        cb = (cb) ? cb : function() {
        };
        if ((step < animationType.length) && (step >= 0)) {
            type[_opt.type](merge(opt, animationType[step]));
            setTimeout(function() {
                if (revert) {
                    step = step - 1;
                } else {
                    step = step + 1;
                }
                animation.run(opt, cb, revert, step);
            }, animation.duration);

            link.setIcon(_canvas);
        } else {
            cb();
            return;
        }
    };
    //auto init
    init();
    return {
        badge : badge,
        video : video,
        image : image,
        webcam : webcam,
        reset : icon.reset
    };
});


