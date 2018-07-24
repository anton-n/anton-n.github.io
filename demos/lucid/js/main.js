	!function(root, factory) {
	    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
	    define([], function() {
	        return root.svg4everybody = factory();
	    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory() : root.svg4everybody = factory();
	}(this, function() {
	    /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
	    function embed(parent, svg, target) {
	        // if the target exists
	        if (target) {
	            // create a document fragment to hold the contents of the target
	            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
	            // conditionally set the viewBox on the svg
	            viewBox && svg.setAttribute("viewBox", viewBox);
	            // copy the contents of the clone into the fragment
	            for (// clone the target
	            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
	                fragment.appendChild(clone.firstChild);
	            }
	            // append the fragment into the svg
	            parent.appendChild(fragment);
	        }
	    }
	    function loadreadystatechange(xhr) {
	        // listen to changes in the request
	        xhr.onreadystatechange = function() {
	            // if the request is ready
	            if (4 === xhr.readyState) {
	                // get the cached html document
	                var cachedDocument = xhr._cachedDocument;
	                // ensure the cached html document based on the xhr response
	                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), 
	                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
	                xhr._embeds.splice(0).map(function(item) {
	                    // get the cached target
	                    var target = xhr._cachedTarget[item.id];
	                    // ensure the cached target
	                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), 
	                    // embed the target into the svg
	                    embed(item.parent, item.svg, target);
	                });
	            }
	        }, // test the ready state change immediately
	        xhr.onreadystatechange();
	    }
	    function svg4everybody(rawopts) {
	        function oninterval() {
	            // while the index exists in the live <use> collection
	            for (// get the cached <use> index
	            var index = 0; index < uses.length; ) {
	                // get the current <use>
	                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
	                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)), 
	                svg && src) {
	                    // if running with legacy support
	                    if (nosvg) {
	                        // create a new fallback image
	                        var img = document.createElement("img");
	                        // force display in older IE
	                        img.style.cssText = "display:inline-block;height:100%;width:100%", // set the fallback size using the svg size
	                        img.setAttribute("width", svg.getAttribute("width") || svg.clientWidth), img.setAttribute("height", svg.getAttribute("height") || svg.clientHeight), 
	                        // set the fallback src
	                        img.src = fallback(src, svg, use), // replace the <use> with the fallback image
	                        parent.replaceChild(img, use);
	                    } else {
	                        if (polyfill) {
	                            if (!opts.validate || opts.validate(src, svg, use)) {
	                                // remove the <use> element
	                                parent.removeChild(use);
	                                // parse the src and get the url and id
	                                var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
	                                // if the link is external
	                                if (url.length) {
	                                    // get the cached xhr request
	                                    var xhr = requests[url];
	                                    // ensure the xhr request exists
	                                    xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), 
	                                    xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
	                                    xhr._embeds.push({
	                                        parent: parent,
	                                        svg: svg,
	                                        id: id
	                                    }), // prepare the xhr ready state change event
	                                    loadreadystatechange(xhr);
	                                } else {
	                                    // embed the local id into the svg
	                                    embed(parent, svg, document.getElementById(id));
	                                }
	                            } else {
	                                // increase the index when the previous value was not "valid"
	                                ++index, ++numberOfSvgUseElementsToBypass;
	                            }
	                        }
	                    }
	                } else {
	                    // increase the index when the previous value was not "valid"
	                    ++index;
	                }
	            }
	            // continue the interval
	            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
	        }
	        var nosvg, fallback, opts = Object(rawopts);
	        // configure the fallback method
	        fallback = opts.fallback || function(src) {
	            return src.replace(/\?[^#]+/, "").replace("#", ".").replace(/^\./, "") + ".png" + (/\?[^#]+/.exec(src) || [ "" ])[0];
	        }, // set whether to shiv <svg> and <use> elements and use image fallbacks
	        nosvg = "nosvg" in opts ? opts.nosvg : /\bMSIE [1-8]\b/.test(navigator.userAgent), 
	        // conditionally shiv <svg> and <use>
	        nosvg && (document.createElement("svg"), document.createElement("use"));
	        // set whether the polyfill will be activated or not
	        var polyfill, olderIEUA = /\bMSIE [1-8]\.0\b/, newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
	        polyfill = "polyfill" in opts ? opts.polyfill : olderIEUA.test(navigator.userAgent) || newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
	        // create xhr requests object
	        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
	        // conditionally start the interval if the polyfill is active
	        polyfill && oninterval();
	    }
	    function getSVGAncestor(node) {
	        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
	        return svg;
	    }
	    return svg4everybody;
	});
	// -----------------------------------------------

	/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
	!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.2.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=Array.isArray(d)))?(e?(e=!1,f=c&&Array.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext;function B(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()}var C=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,D=/^.[^:#\[\.,]*$/;function E(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):D.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(E(this,a||[],!1))},not:function(a){return this.pushStack(E(this,a||[],!0))},is:function(a){return!!E(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var F,G=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,H=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||F,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:G.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),C.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};H.prototype=r.fn,F=r(d);var I=/^(?:parents|prev(?:Until|All))/,J={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function K(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return K(a,"nextSibling")},prev:function(a){return K(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return B(a,"iframe")?a.contentDocument:(B(a,"template")&&(a=a.content||a),r.merge([],a.childNodes))}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(J[a]||r.uniqueSort(e),I.test(a)&&e.reverse()),this.pushStack(e)}});var L=/[^\x20\t\r\n\f]+/g;function M(a){var b={};return r.each(a.match(L)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?M(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=e||a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function N(a){return a}function O(a){throw a}function P(a,b,c,d){var e;try{a&&r.isFunction(e=a.promise)?e.call(a).done(b).fail(c):a&&r.isFunction(e=a.then)?e.call(a,b,c):b.apply(void 0,[a].slice(d))}catch(a){c.apply(void 0,[a])}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,N,e),g(f,c,O,e)):(f++,j.call(a,g(f,c,N,e),g(f,c,O,e),g(f,c,N,c.notifyWith))):(d!==N&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==O&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:N,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:N)),c[2][3].add(g(0,a,r.isFunction(d)?d:O))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(P(a,g.done(h(c)).resolve,g.reject,!b),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)P(e[c],h(c),g.reject);return g.promise()}});var Q=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&Q.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var R=r.Deferred();r.fn.ready=function(a){return R.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||R.resolveWith(d,[r]))}}),r.ready.then=R.then;function S(){d.removeEventListener("DOMContentLoaded",S),
	a.removeEventListener("load",S),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",S),a.addEventListener("load",S));var T=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)T(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},U=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function V(){this.expando=r.expando+V.uid++}V.uid=1,V.prototype={cache:function(a){var b=a[this.expando];return b||(b={},U(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){Array.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(L)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var W=new V,X=new V,Y=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Z=/[A-Z]/g;function $(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:Y.test(a)?JSON.parse(a):a)}function _(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Z,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=$(c)}catch(e){}X.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return X.hasData(a)||W.hasData(a)},data:function(a,b,c){return X.access(a,b,c)},removeData:function(a,b){X.remove(a,b)},_data:function(a,b,c){return W.access(a,b,c)},_removeData:function(a,b){W.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=X.get(f),1===f.nodeType&&!W.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),_(f,d,e[d])));W.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){X.set(this,a)}):T(this,function(b){var c;if(f&&void 0===b){if(c=X.get(f,a),void 0!==c)return c;if(c=_(f,a),void 0!==c)return c}else this.each(function(){X.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){X.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=W.get(a,b),c&&(!d||Array.isArray(c)?d=W.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return W.get(a,c)||W.access(a,c,{empty:r.Callbacks("once memory").add(function(){W.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=W.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var aa=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ba=new RegExp("^(?:([+-])=|)("+aa+")([a-z%]*)$","i"),ca=["Top","Right","Bottom","Left"],da=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},ea=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function fa(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&ba.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var ga={};function ha(a){var b,c=a.ownerDocument,d=a.nodeName,e=ga[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),ga[d]=e,e)}function ia(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=W.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&da(d)&&(e[f]=ha(d))):"none"!==c&&(e[f]="none",W.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ia(this,!0)},hide:function(){return ia(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){da(this)?r(this).show():r(this).hide()})}});var ja=/^(?:checkbox|radio)$/i,ka=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,la=/^$|\/(?:java|ecma)script/i,ma={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ma.optgroup=ma.option,ma.tbody=ma.tfoot=ma.colgroup=ma.caption=ma.thead,ma.th=ma.td;function na(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&B(a,b)?r.merge([a],c):c}function oa(a,b){for(var c=0,d=a.length;c<d;c++)W.set(a[c],"globalEval",!b||W.get(b[c],"globalEval"))}var pa=/<|&#?\w+;/;function qa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(pa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ka.exec(f)||["",""])[1].toLowerCase(),i=ma[h]||ma._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=na(l.appendChild(f),"script"),j&&oa(g),c){k=0;while(f=g[k++])la.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var ra=d.documentElement,sa=/^key/,ta=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ua=/^([^.]*)(?:\.(.+)|)/;function va(){return!0}function wa(){return!1}function xa(){try{return d.activeElement}catch(a){}}function ya(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ya(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=wa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(ra,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(L)||[""],j=b.length;while(j--)h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.hasData(a)&&W.get(a);if(q&&(i=q.events)){b=(b||"").match(L)||[""],j=b.length;while(j--)if(h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&W.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(W.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==xa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===xa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&B(this,"input"))return this.click(),!1},_default:function(a){return B(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?va:wa,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:wa,isPropagationStopped:wa,isImmediatePropagationStopped:wa,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=va,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=va,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=va,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&sa.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&ta.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return ya(this,a,b,c,d)},one:function(a,b,c,d){return ya(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=wa),this.each(function(){r.event.remove(this,a,c,b)})}});var za=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Aa=/<script|<style|<link/i,Ba=/checked\s*(?:[^=]|=\s*.checked.)/i,Ca=/^true\/(.*)/,Da=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ea(a,b){return B(a,"table")&&B(11!==b.nodeType?b:b.firstChild,"tr")?r(">tbody",a)[0]||a:a}function Fa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Ga(a){var b=Ca.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ha(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(W.hasData(a)&&(f=W.access(a),g=W.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}X.hasData(a)&&(h=X.access(a),i=r.extend({},h),X.set(b,i))}}function Ia(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ja.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ja(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Ba.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ja(f,b,c,d)});if(m&&(e=qa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(na(e,"script"),Fa),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,na(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Ga),l=0;l<i;l++)j=h[l],la.test(j.type||"")&&!W.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Da,""),k))}return a}function Ka(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(na(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&oa(na(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(za,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=na(h),f=na(a),d=0,e=f.length;d<e;d++)Ia(f[d],g[d]);if(b)if(c)for(f=f||na(a),g=g||na(h),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);else Ha(a,h);return g=na(h,"script"),g.length>0&&oa(g,!i&&na(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(U(c)){if(b=c[W.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[W.expando]=void 0}c[X.expando]&&(c[X.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ka(this,a,!0)},remove:function(a){return Ka(this,a)},text:function(a){return T(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.appendChild(a)}})},prepend:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(na(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return T(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!Aa.test(a)&&!ma[(ka.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(na(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ja(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(na(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var La=/^margin/,Ma=new RegExp("^("+aa+")(?!px)[a-z%]+$","i"),Na=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",ra.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,ra.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Oa(a,b,c){var d,e,f,g,h=a.style;return c=c||Na(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&Ma.test(g)&&La.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Pa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Qa=/^(none|table(?!-c[ea]).+)/,Ra=/^--/,Sa={position:"absolute",visibility:"hidden",display:"block"},Ta={letterSpacing:"0",fontWeight:"400"},Ua=["Webkit","Moz","ms"],Va=d.createElement("div").style;function Wa(a){if(a in Va)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ua.length;while(c--)if(a=Ua[c]+b,a in Va)return a}function Xa(a){var b=r.cssProps[a];return b||(b=r.cssProps[a]=Wa(a)||a),b}function Ya(a,b,c){var d=ba.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Za(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ca[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ca[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ca[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ca[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ca[f]+"Width",!0,e)));return g}function $a(a,b,c){var d,e=Na(a),f=Oa(a,b,e),g="border-box"===r.css(a,"boxSizing",!1,e);return Ma.test(f)?f:(d=g&&(o.boxSizingReliable()||f===a.style[b]),"auto"===f&&(f=a["offset"+b[0].toUpperCase()+b.slice(1)]),f=parseFloat(f)||0,f+Za(a,b,c||(g?"border":"content"),d,e)+"px")}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Oa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=Ra.test(b),j=a.style;return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:j[b]:(f=typeof c,"string"===f&&(e=ba.exec(c))&&e[1]&&(c=fa(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(j[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i?j.setProperty(b,c):j[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b),i=Ra.test(b);return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Oa(a,b,d)),"normal"===e&&b in Ta&&(e=Ta[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Qa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?$a(a,b,d):ea(a,Sa,function(){return $a(a,b,d)})},set:function(a,c,d){var e,f=d&&Na(a),g=d&&Za(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=ba.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Ya(a,c,g)}}}),r.cssHooks.marginLeft=Pa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Oa(a,"marginLeft"))||a.getBoundingClientRect().left-ea(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ca[d]+b]=f[d]||f[d-2]||f[0];return e}},La.test(a)||(r.cssHooks[a+b].set=Ya)}),r.fn.extend({css:function(a,b){return T(this,function(a,b,c){var d,e,f={},g=0;if(Array.isArray(b)){for(d=Na(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function _a(a,b,c,d,e){return new _a.prototype.init(a,b,c,d,e)}r.Tween=_a,_a.prototype={constructor:_a,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=_a.propHooks[this.prop];return a&&a.get?a.get(this):_a.propHooks._default.get(this)},run:function(a){var b,c=_a.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):_a.propHooks._default.set(this),this}},_a.prototype.init.prototype=_a.prototype,_a.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},_a.propHooks.scrollTop=_a.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=_a.prototype.init,r.fx.step={};var ab,bb,cb=/^(?:toggle|show|hide)$/,db=/queueHooks$/;function eb(){bb&&(d.hidden===!1&&a.requestAnimationFrame?a.requestAnimationFrame(eb):a.setTimeout(eb,r.fx.interval),r.fx.tick())}function fb(){return a.setTimeout(function(){ab=void 0}),ab=r.now()}function gb(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ca[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function hb(a,b,c){for(var d,e=(kb.tweeners[b]||[]).concat(kb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function ib(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&da(a),q=W.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],cb.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=W.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ia([a],!0),j=a.style.display||j,k=r.css(a,"display"),ia([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=W.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ia([a],!0),m.done(function(){p||ia([a]),W.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=hb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function jb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],Array.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kb(a,b,c){var d,e,f=0,g=kb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=ab||fb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(i||h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:ab||fb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jb(k,j.opts.specialEasing);f<g;f++)if(d=kb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,hb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j}r.Animation=r.extend(kb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return fa(c.elem,a,ba.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(L);for(var c,d=0,e=a.length;d<e;d++)c=a[d],kb.tweeners[c]=kb.tweeners[c]||[],kb.tweeners[c].unshift(b)},prefilters:[ib],prefilter:function(a,b){b?kb.prefilters.unshift(a):kb.prefilters.push(a)}}),r.speed=function(a,b,c){var d=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off?d.duration=0:"number"!=typeof d.duration&&(d.duration in r.fx.speeds?d.duration=r.fx.speeds[d.duration]:d.duration=r.fx.speeds._default),null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){r.isFunction(d.old)&&d.old.call(this),d.queue&&r.dequeue(this,d.queue)},d},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(da).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=kb(this,r.extend({},a),f);(e||W.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=W.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&db.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=W.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gb(b,!0),a,d,e)}}),r.each({slideDown:gb("show"),slideUp:gb("hide"),slideToggle:gb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(ab=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),ab=void 0},r.fx.timer=function(a){r.timers.push(a),r.fx.start()},r.fx.interval=13,r.fx.start=function(){bb||(bb=!0,eb())},r.fx.stop=function(){bb=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var lb,mb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return T(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?lb:void 0)),void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),
	null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&B(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(L);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),lb={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=mb[b]||r.find.attr;mb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=mb[g],mb[g]=e,e=null!=c(a,b,d)?g:null,mb[g]=f),e}});var nb=/^(?:input|select|textarea|button)$/i,ob=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return T(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):nb.test(a.nodeName)||ob.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function pb(a){var b=a.match(L)||[];return b.join(" ")}function qb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,qb(this)))});if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,qb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,qb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(L)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=qb(this),b&&W.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":W.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+pb(qb(c))+" ").indexOf(b)>-1)return!0;return!1}});var rb=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":Array.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(rb,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:pb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!B(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(Array.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var sb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!sb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,sb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(W.get(h,"events")||{})[b.type]&&W.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&U(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!U(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=W.access(d,b);e||d.addEventListener(a,c,!0),W.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=W.access(d,b)-1;e?W.access(d,b,e):(d.removeEventListener(a,c,!0),W.remove(d,b))}}});var tb=a.location,ub=r.now(),vb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(Array.isArray(b))r.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(Array.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!ja.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:Array.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}});var Bb=/%20/g,Cb=/#.*$/,Db=/([?&])_=[^&]*/,Eb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Fb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Gb=/^(?:GET|HEAD)$/,Hb=/^\/\//,Ib={},Jb={},Kb="*/".concat("*"),Lb=d.createElement("a");Lb.href=tb.href;function Mb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(L)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nb(a,b,c,d){var e={},f=a===Jb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Ob(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Pb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Qb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:tb.href,type:"GET",isLocal:Fb.test(tb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Ob(Ob(a,r.ajaxSettings),b):Ob(r.ajaxSettings,a)},ajaxPrefilter:Mb(Ib),ajaxTransport:Mb(Jb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Eb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||tb.href)+"").replace(Hb,tb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(L)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Lb.protocol+"//"+Lb.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Nb(Ib,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Gb.test(o.type),f=o.url.replace(Cb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(Bb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(vb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Db,"$1"),n=(vb.test(f)?"&":"?")+"_="+ub++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Kb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Nb(Jb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Pb(o,y,d)),v=Qb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Rb={0:200,1223:204},Sb=r.ajaxSettings.xhr();o.cors=!!Sb&&"withCredentials"in Sb,o.ajax=Sb=!!Sb,r.ajaxTransport(function(b){var c,d;if(o.cors||Sb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Rb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Tb=[],Ub=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Tb.pop()||r.expando+"_"+ub++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Ub.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ub.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Ub,"$1"+e):b.jsonp!==!1&&(b.url+=(vb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Tb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=C.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=qa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=pb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length},r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),b=f.ownerDocument,c=b.documentElement,e=b.defaultView,{top:d.top+e.pageYOffset-c.clientTop,left:d.left+e.pageXOffset-c.clientLeft}):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),B(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||ra})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return T(this,function(a,d,e){var f;return r.isWindow(a)?f=a:9===a.nodeType&&(f=a.defaultView),void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Pa(o.pixelPosition,function(a,c){if(c)return c=Oa(a,b),Ma.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return T(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.holdReady=function(a){a?r.readyWait++:r.ready(!0)},r.isArray=Array.isArray,r.parseJSON=JSON.parse,r.nodeName=B,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Vb=a.jQuery,Wb=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Wb),b&&a.jQuery===r&&(a.jQuery=Vb),r},b||(a.jQuery=a.$=r),r});
	!function(n,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.device=e():n.device=e()}(window,function(){return function(n){var e={};function o(t){if(e[t])return e[t].exports;var i=e[t]={i:t,l:!1,exports:{}};return n[t].call(i.exports,i,i.exports,o),i.l=!0,i.exports}return o.m=n,o.c=e,o.d=function(n,e,t){o.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:t})},o.r=function(n){Object.defineProperty(n,"__esModule",{value:!0})},o.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return o.d(e,"a",e),e},o.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},o.p="",o(o.s=1)}([function(n,e,o){"use strict";o.r(e);var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},i=window.device,r={},a=[];window.device=r;var c=window.document.documentElement,d=window.navigator.userAgent.toLowerCase(),u=["googletv","viera","smarttv","internet.tv","netcast","nettv","appletv","boxee","kylo","roku","dlnadoc","roku","pov_tv","hbbtv","ce-html"];function l(n){return-1!==d.indexOf(n)}function s(n){return c.className.match(new RegExp(n,"i"))}function f(n){var e=null;s(n)||(e=c.className.replace(/^\s+|\s+$/g,""),c.className=e+" "+n)}function b(n){s(n)&&(c.className=c.className.replace(" "+n,""))}function p(){r.landscape()?(b("portrait"),f("landscape"),w("landscape")):(b("landscape"),f("portrait"),w("portrait")),h()}function w(n){for(var e in a)a[e](n)}r.macos=function(){return l("mac")},r.ios=function(){return r.iphone()||r.ipod()||r.ipad()},r.iphone=function(){return!r.windows()&&l("iphone")},r.ipod=function(){return l("ipod")},r.ipad=function(){return l("ipad")},r.android=function(){return!r.windows()&&l("android")},r.androidPhone=function(){return r.android()&&l("mobile")},r.androidTablet=function(){return r.android()&&!l("mobile")},r.blackberry=function(){return l("blackberry")||l("bb10")||l("rim")},r.blackberryPhone=function(){return r.blackberry()&&!l("tablet")},r.blackberryTablet=function(){return r.blackberry()&&l("tablet")},r.windows=function(){return l("windows")},r.windowsPhone=function(){return r.windows()&&l("phone")},r.windowsTablet=function(){return r.windows()&&l("touch")&&!r.windowsPhone()},r.fxos=function(){return(l("(mobile")||l("(tablet"))&&l(" rv:")},r.fxosPhone=function(){return r.fxos()&&l("mobile")},r.fxosTablet=function(){return r.fxos()&&l("tablet")},r.meego=function(){return l("meego")},r.cordova=function(){return window.cordova&&"file:"===location.protocol},r.nodeWebkit=function(){return"object"===t(window.process)},r.mobile=function(){return r.androidPhone()||r.iphone()||r.ipod()||r.windowsPhone()||r.blackberryPhone()||r.fxosPhone()||r.meego()},r.tablet=function(){return r.ipad()||r.androidTablet()||r.blackberryTablet()||r.windowsTablet()||r.fxosTablet()},r.desktop=function(){return!r.tablet()&&!r.mobile()},r.television=function(){for(var n=0;n<u.length;){if(l(u[n]))return!0;n++}return!1},r.portrait=function(){return screen.orientation&&Object.prototype.hasOwnProperty.call(window,"onorientationchange")?screen.orientation.type.includes("portrait"):window.innerHeight/window.innerWidth>1},r.landscape=function(){return screen.orientation&&Object.prototype.hasOwnProperty.call(window,"onorientationchange")?screen.orientation.type.includes("landscape"):window.innerHeight/window.innerWidth<1},r.noConflict=function(){return window.device=i,this},r.ios()?r.ipad()?f("ios ipad tablet"):r.iphone()?f("ios iphone mobile"):r.ipod()&&f("ios ipod mobile"):r.macos()?f("macos desktop"):r.android()?r.androidTablet()?f("android tablet"):f("android mobile"):r.blackberry()?r.blackberryTablet()?f("blackberry tablet"):f("blackberry mobile"):r.windows()?r.windowsTablet()?f("windows tablet"):r.windowsPhone()?f("windows mobile"):f("windows desktop"):r.fxos()?r.fxosTablet()?f("fxos tablet"):f("fxos mobile"):r.meego()?f("meego mobile"):r.nodeWebkit()?f("node-webkit"):r.television()?f("television"):r.desktop()&&f("desktop"),r.cordova()&&f("cordova"),r.onChangeOrientation=function(n){"function"==typeof n&&a.push(n)};var m="resize";function y(n){for(var e=0;e<n.length;e++)if(r[n[e]]())return n[e];return"unknown"}function h(){r.orientation=y(["portrait","landscape"])}Object.prototype.hasOwnProperty.call(window,"onorientationchange")&&(m="orientationchange"),window.addEventListener?window.addEventListener(m,p,!1):window.attachEvent?window.attachEvent(m,p):window[m]=p,p(),r.type=y(["mobile","tablet","desktop"]),r.os=y(["ios","iphone","ipad","ipod","android","blackberry","windows","fxos","meego","television"]),h(),e.default=r},function(n,e,o){n.exports=o(0)}]).default});
	//# sourceMappingURL=current-device.min.js.map
	/*
	     _ _      _       _
	 ___| (_) ___| | __  (_)___
	/ __| | |/ __| |/ /  | / __|
	\__ \ | | (__|   < _ | \__ \
	|___/_|_|\___|_|\_(_)/ |___/
	                   |__/
	
	 Version: 1.8.0
	  Author: Ken Wheeler
	 Website: http://kenwheeler.github.io
	    Docs: http://kenwheeler.github.io/slick
	    Repo: http://github.com/kenwheeler/slick
	  Issues: http://github.com/kenwheeler/slick/issues
	
	 */
	/* global window, document, define, jQuery, setInterval, clearInterval */
	;(function(factory) {
	    'use strict';
	    if (typeof define === 'function' && define.amd) {
	        define(['jquery'], factory);
	    } else if (typeof exports !== 'undefined') {
	        module.exports = factory(require('jquery'));
	    } else {
	        factory(jQuery);
	    }
	
	}(function($) {
	    'use strict';
	    var Slick = window.Slick || {};
	
	    Slick = (function() {
	
	        var instanceUid = 0;
	
	        function Slick(element, settings) {
	
	            var _ = this, dataSettings;
	
	            _.defaults = {
	                accessibility: true,
	                adaptiveHeight: false,
	                appendArrows: $(element),
	                appendDots: $(element),
	                arrows: true,
	                asNavFor: null,
	                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
	                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
	                autoplay: false,
	                autoplaySpeed: 3000,
	                centerMode: false,
	                centerPadding: '50px',
	                cssEase: 'ease',
	                customPaging: function(slider, i) {
	                    return $('<button type="button" />').text(i + 1);
	                },
	                dots: false,
	                dotsClass: 'slick-dots',
	                draggable: true,
	                easing: 'linear',
	                edgeFriction: 0.35,
	                fade: false,
	                focusOnSelect: false,
	                focusOnChange: false,
	                infinite: true,
	                initialSlide: 0,
	                lazyLoad: 'ondemand',
	                mobileFirst: false,
	                pauseOnHover: true,
	                pauseOnFocus: true,
	                pauseOnDotsHover: false,
	                respondTo: 'window',
	                responsive: null,
	                rows: 1,
	                rtl: false,
	                slide: '',
	                slidesPerRow: 1,
	                slidesToShow: 1,
	                slidesToScroll: 1,
	                speed: 500,
	                swipe: true,
	                swipeToSlide: false,
	                touchMove: true,
	                touchThreshold: 5,
	                useCSS: true,
	                useTransform: true,
	                variableWidth: false,
	                vertical: false,
	                verticalSwiping: false,
	                waitForAnimate: true,
	                zIndex: 1000
	            };
	
	            _.initials = {
	                animating: false,
	                dragging: false,
	                autoPlayTimer: null,
	                currentDirection: 0,
	                currentLeft: null,
	                currentSlide: 0,
	                direction: 1,
	                $dots: null,
	                listWidth: null,
	                listHeight: null,
	                loadIndex: 0,
	                $nextArrow: null,
	                $prevArrow: null,
	                scrolling: false,
	                slideCount: null,
	                slideWidth: null,
	                $slideTrack: null,
	                $slides: null,
	                sliding: false,
	                slideOffset: 0,
	                swipeLeft: null,
	                swiping: false,
	                $list: null,
	                touchObject: {},
	                transformsEnabled: false,
	                unslicked: false
	            };
	
	            $.extend(_, _.initials);
	
	            _.activeBreakpoint = null;
	            _.animType = null;
	            _.animProp = null;
	            _.breakpoints = [];
	            _.breakpointSettings = [];
	            _.cssTransitions = false;
	            _.focussed = false;
	            _.interrupted = false;
	            _.hidden = 'hidden';
	            _.paused = true;
	            _.positionProp = null;
	            _.respondTo = null;
	            _.rowCount = 1;
	            _.shouldClick = true;
	            _.$slider = $(element);
	            _.$slidesCache = null;
	            _.transformType = null;
	            _.transitionType = null;
	            _.visibilityChange = 'visibilitychange';
	            _.windowWidth = 0;
	            _.windowTimer = null;
	
	            dataSettings = $(element).data('slick') || {};
	
	            _.options = $.extend({}, _.defaults, settings, dataSettings);
	
	            _.currentSlide = _.options.initialSlide;
	
	            _.originalSettings = _.options;
	
	            if (typeof document.mozHidden !== 'undefined') {
	                _.hidden = 'mozHidden';
	                _.visibilityChange = 'mozvisibilitychange';
	            } else if (typeof document.webkitHidden !== 'undefined') {
	                _.hidden = 'webkitHidden';
	                _.visibilityChange = 'webkitvisibilitychange';
	            }
	
	            _.autoPlay = $.proxy(_.autoPlay, _);
	            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
	            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
	            _.changeSlide = $.proxy(_.changeSlide, _);
	            _.clickHandler = $.proxy(_.clickHandler, _);
	            _.selectHandler = $.proxy(_.selectHandler, _);
	            _.setPosition = $.proxy(_.setPosition, _);
	            _.swipeHandler = $.proxy(_.swipeHandler, _);
	            _.dragHandler = $.proxy(_.dragHandler, _);
	            _.keyHandler = $.proxy(_.keyHandler, _);
	
	            _.instanceUid = instanceUid++;
	
	            // A simple way to check for HTML strings
	            // Strict HTML recognition (must start with <)
	            // Extracted from jQuery v1.11 source
	            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
	
	
	            _.registerBreakpoints();
	            _.init(true);
	
	        }
	
	        return Slick;
	
	    }());
	
	    Slick.prototype.activateADA = function() {
	        var _ = this;
	
	        _.$slideTrack.find('.slick-active').attr({
	            'aria-hidden': 'false'
	        }).find('a, input, button, select').attr({
	            'tabindex': '0'
	        });
	
	    };
	
	    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {
	
	        var _ = this;
	
	        if (typeof(index) === 'boolean') {
	            addBefore = index;
	            index = null;
	        } else if (index < 0 || (index >= _.slideCount)) {
	            return false;
	        }
	
	        _.unload();
	
	        if (typeof(index) === 'number') {
	            if (index === 0 && _.$slides.length === 0) {
	                $(markup).appendTo(_.$slideTrack);
	            } else if (addBefore) {
	                $(markup).insertBefore(_.$slides.eq(index));
	            } else {
	                $(markup).insertAfter(_.$slides.eq(index));
	            }
	        } else {
	            if (addBefore === true) {
	                $(markup).prependTo(_.$slideTrack);
	            } else {
	                $(markup).appendTo(_.$slideTrack);
	            }
	        }
	
	        _.$slides = _.$slideTrack.children(this.options.slide);
	
	        _.$slideTrack.children(this.options.slide).detach();
	
	        _.$slideTrack.append(_.$slides);
	
	        _.$slides.each(function(index, element) {
	            $(element).attr('data-slick-index', index);
	        });
	
	        _.$slidesCache = _.$slides;
	
	        _.reinit();
	
	    };
	
	    Slick.prototype.animateHeight = function() {
	        var _ = this;
	        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
	            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
	            _.$list.animate({
	                height: targetHeight
	            }, _.options.speed);
	        }
	    };
	
	    Slick.prototype.animateSlide = function(targetLeft, callback) {
	
	        var animProps = {},
	            _ = this;
	
	        _.animateHeight();
	
	        if (_.options.rtl === true && _.options.vertical === false) {
	            targetLeft = -targetLeft;
	        }
	        if (_.transformsEnabled === false) {
	            if (_.options.vertical === false) {
	                _.$slideTrack.animate({
	                    left: targetLeft
	                }, _.options.speed, _.options.easing, callback);
	            } else {
	                _.$slideTrack.animate({
	                    top: targetLeft
	                }, _.options.speed, _.options.easing, callback);
	            }
	
	        } else {
	
	            if (_.cssTransitions === false) {
	                if (_.options.rtl === true) {
	                    _.currentLeft = -(_.currentLeft);
	                }
	                $({
	                    animStart: _.currentLeft
	                }).animate({
	                    animStart: targetLeft
	                }, {
	                    duration: _.options.speed,
	                    easing: _.options.easing,
	                    step: function(now) {
	                        now = Math.ceil(now);
	                        if (_.options.vertical === false) {
	                            animProps[_.animType] = 'translate(' +
	                                now + 'px, 0px)';
	                            _.$slideTrack.css(animProps);
	                        } else {
	                            animProps[_.animType] = 'translate(0px,' +
	                                now + 'px)';
	                            _.$slideTrack.css(animProps);
	                        }
	                    },
	                    complete: function() {
	                        if (callback) {
	                            callback.call();
	                        }
	                    }
	                });
	
	            } else {
	
	                _.applyTransition();
	                targetLeft = Math.ceil(targetLeft);
	
	                if (_.options.vertical === false) {
	                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
	                } else {
	                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
	                }
	                _.$slideTrack.css(animProps);
	
	                if (callback) {
	                    setTimeout(function() {
	
	                        _.disableTransition();
	
	                        callback.call();
	                    }, _.options.speed);
	                }
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.getNavTarget = function() {
	
	        var _ = this,
	            asNavFor = _.options.asNavFor;
	
	        if ( asNavFor && asNavFor !== null ) {
	            asNavFor = $(asNavFor).not(_.$slider);
	        }
	
	        return asNavFor;
	
	    };
	
	    Slick.prototype.asNavFor = function(index) {
	
	        var _ = this,
	            asNavFor = _.getNavTarget();
	
	        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
	            asNavFor.each(function() {
	                var target = $(this).slick('getSlick');
	                if(!target.unslicked) {
	                    target.slideHandler(index, true);
	                }
	            });
	        }
	
	    };
	
	    Slick.prototype.applyTransition = function(slide) {
	
	        var _ = this,
	            transition = {};
	
	        if (_.options.fade === false) {
	            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
	        } else {
	            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
	        }
	
	        if (_.options.fade === false) {
	            _.$slideTrack.css(transition);
	        } else {
	            _.$slides.eq(slide).css(transition);
	        }
	
	    };
	
	    Slick.prototype.autoPlay = function() {
	
	        var _ = this;
	
	        _.autoPlayClear();
	
	        if ( _.slideCount > _.options.slidesToShow ) {
	            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
	        }
	
	    };
	
	    Slick.prototype.autoPlayClear = function() {
	
	        var _ = this;
	
	        if (_.autoPlayTimer) {
	            clearInterval(_.autoPlayTimer);
	        }
	
	    };
	
	    Slick.prototype.autoPlayIterator = function() {
	
	        var _ = this,
	            slideTo = _.currentSlide + _.options.slidesToScroll;
	
	        if ( !_.paused && !_.interrupted && !_.focussed ) {
	
	            if ( _.options.infinite === false ) {
	
	                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
	                    _.direction = 0;
	                }
	
	                else if ( _.direction === 0 ) {
	
	                    slideTo = _.currentSlide - _.options.slidesToScroll;
	
	                    if ( _.currentSlide - 1 === 0 ) {
	                        _.direction = 1;
	                    }
	
	                }
	
	            }
	
	            _.slideHandler( slideTo );
	
	        }
	
	    };
	
	    Slick.prototype.buildArrows = function() {
	
	        var _ = this;
	
	        if (_.options.arrows === true ) {
	
	            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
	            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');
	
	            if( _.slideCount > _.options.slidesToShow ) {
	
	                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
	                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
	
	                if (_.htmlExpr.test(_.options.prevArrow)) {
	                    _.$prevArrow.prependTo(_.options.appendArrows);
	                }
	
	                if (_.htmlExpr.test(_.options.nextArrow)) {
	                    _.$nextArrow.appendTo(_.options.appendArrows);
	                }
	
	                if (_.options.infinite !== true) {
	                    _.$prevArrow
	                        .addClass('slick-disabled')
	                        .attr('aria-disabled', 'true');
	                }
	
	            } else {
	
	                _.$prevArrow.add( _.$nextArrow )
	
	                    .addClass('slick-hidden')
	                    .attr({
	                        'aria-disabled': 'true',
	                        'tabindex': '-1'
	                    });
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.buildDots = function() {
	
	        var _ = this,
	            i, dot;
	
	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$slider.addClass('slick-dotted');
	
	            dot = $('<ul />').addClass(_.options.dotsClass);
	
	            for (i = 0; i <= _.getDotCount(); i += 1) {
	                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
	            }
	
	            _.$dots = dot.appendTo(_.options.appendDots);
	
	            _.$dots.find('li').first().addClass('slick-active');
	
	        }
	
	    };
	
	    Slick.prototype.buildOut = function() {
	
	        var _ = this;
	
	        _.$slides =
	            _.$slider
	                .children( _.options.slide + ':not(.slick-cloned)')
	                .addClass('slick-slide');
	
	        _.slideCount = _.$slides.length;
	
	        _.$slides.each(function(index, element) {
	            $(element)
	                .attr('data-slick-index', index)
	                .data('originalStyling', $(element).attr('style') || '');
	        });
	
	        _.$slider.addClass('slick-slider');
	
	        _.$slideTrack = (_.slideCount === 0) ?
	            $('<div class="slick-track"/>').appendTo(_.$slider) :
	            _.$slides.wrapAll('<div class="slick-track"/>').parent();
	
	        _.$list = _.$slideTrack.wrap(
	            '<div class="slick-list"/>').parent();
	        _.$slideTrack.css('opacity', 0);
	
	        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
	            _.options.slidesToScroll = 1;
	        }
	
	        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');
	
	        _.setupInfinite();
	
	        _.buildArrows();
	
	        _.buildDots();
	
	        _.updateDots();
	
	
	        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);
	
	        if (_.options.draggable === true) {
	            _.$list.addClass('draggable');
	        }
	
	    };
	
	    Slick.prototype.buildRows = function() {
	
	        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;
	
	        newSlides = document.createDocumentFragment();
	        originalSlides = _.$slider.children();
	
	        if(_.options.rows > 0) {
	
	            slidesPerSection = _.options.slidesPerRow * _.options.rows;
	            numOfSlides = Math.ceil(
	                originalSlides.length / slidesPerSection
	            );
	
	            for(a = 0; a < numOfSlides; a++){
	                var slide = document.createElement('div');
	                for(b = 0; b < _.options.rows; b++) {
	                    var row = document.createElement('div');
	                    for(c = 0; c < _.options.slidesPerRow; c++) {
	                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
	                        if (originalSlides.get(target)) {
	                            row.appendChild(originalSlides.get(target));
	                        }
	                    }
	                    slide.appendChild(row);
	                }
	                newSlides.appendChild(slide);
	            }
	
	            _.$slider.empty().append(newSlides);
	            _.$slider.children().children().children()
	                .css({
	                    'width':(100 / _.options.slidesPerRow) + '%',
	                    'display': 'inline-block'
	                });
	
	        }
	
	    };
	
	    Slick.prototype.checkResponsive = function(initial, forceUpdate) {
	
	        var _ = this,
	            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
	        var sliderWidth = _.$slider.width();
	        var windowWidth = window.innerWidth || $(window).width();
	
	        if (_.respondTo === 'window') {
	            respondToWidth = windowWidth;
	        } else if (_.respondTo === 'slider') {
	            respondToWidth = sliderWidth;
	        } else if (_.respondTo === 'min') {
	            respondToWidth = Math.min(windowWidth, sliderWidth);
	        }
	
	        if ( _.options.responsive &&
	            _.options.responsive.length &&
	            _.options.responsive !== null) {
	
	            targetBreakpoint = null;
	
	            for (breakpoint in _.breakpoints) {
	                if (_.breakpoints.hasOwnProperty(breakpoint)) {
	                    if (_.originalSettings.mobileFirst === false) {
	                        if (respondToWidth < _.breakpoints[breakpoint]) {
	                            targetBreakpoint = _.breakpoints[breakpoint];
	                        }
	                    } else {
	                        if (respondToWidth > _.breakpoints[breakpoint]) {
	                            targetBreakpoint = _.breakpoints[breakpoint];
	                        }
	                    }
	                }
	            }
	
	            if (targetBreakpoint !== null) {
	                if (_.activeBreakpoint !== null) {
	                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
	                        _.activeBreakpoint =
	                            targetBreakpoint;
	                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
	                            _.unslick(targetBreakpoint);
	                        } else {
	                            _.options = $.extend({}, _.originalSettings,
	                                _.breakpointSettings[
	                                    targetBreakpoint]);
	                            if (initial === true) {
	                                _.currentSlide = _.options.initialSlide;
	                            }
	                            _.refresh(initial);
	                        }
	                        triggerBreakpoint = targetBreakpoint;
	                    }
	                } else {
	                    _.activeBreakpoint = targetBreakpoint;
	                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
	                        _.unslick(targetBreakpoint);
	                    } else {
	                        _.options = $.extend({}, _.originalSettings,
	                            _.breakpointSettings[
	                                targetBreakpoint]);
	                        if (initial === true) {
	                            _.currentSlide = _.options.initialSlide;
	                        }
	                        _.refresh(initial);
	                    }
	                    triggerBreakpoint = targetBreakpoint;
	                }
	            } else {
	                if (_.activeBreakpoint !== null) {
	                    _.activeBreakpoint = null;
	                    _.options = _.originalSettings;
	                    if (initial === true) {
	                        _.currentSlide = _.options.initialSlide;
	                    }
	                    _.refresh(initial);
	                    triggerBreakpoint = targetBreakpoint;
	                }
	            }
	
	            // only trigger breakpoints during an actual break. not on initialize.
	            if( !initial && triggerBreakpoint !== false ) {
	                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
	            }
	        }
	
	    };
	
	    Slick.prototype.changeSlide = function(event, dontAnimate) {
	
	        var _ = this,
	            $target = $(event.currentTarget),
	            indexOffset, slideOffset, unevenOffset;
	
	        // If target is a link, prevent default action.
	        if($target.is('a')) {
	            event.preventDefault();
	        }
	
	        // If target is not the <li> element (ie: a child), find the <li>.
	        if(!$target.is('li')) {
	            $target = $target.closest('li');
	        }
	
	        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
	        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;
	
	        switch (event.data.message) {
	
	            case 'previous':
	                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
	                if (_.slideCount > _.options.slidesToShow) {
	                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
	                }
	                break;
	
	            case 'next':
	                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
	                if (_.slideCount > _.options.slidesToShow) {
	                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
	                }
	                break;
	
	            case 'index':
	                var index = event.data.index === 0 ? 0 :
	                    event.data.index || $target.index() * _.options.slidesToScroll;
	
	                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
	                $target.children().trigger('focus');
	                break;
	
	            default:
	                return;
	        }
	
	    };
	
	    Slick.prototype.checkNavigable = function(index) {
	
	        var _ = this,
	            navigables, prevNavigable;
	
	        navigables = _.getNavigableIndexes();
	        prevNavigable = 0;
	        if (index > navigables[navigables.length - 1]) {
	            index = navigables[navigables.length - 1];
	        } else {
	            for (var n in navigables) {
	                if (index < navigables[n]) {
	                    index = prevNavigable;
	                    break;
	                }
	                prevNavigable = navigables[n];
	            }
	        }
	
	        return index;
	    };
	
	    Slick.prototype.cleanUpEvents = function() {
	
	        var _ = this;
	
	        if (_.options.dots && _.$dots !== null) {
	
	            $('li', _.$dots)
	                .off('click.slick', _.changeSlide)
	                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
	                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));
	
	            if (_.options.accessibility === true) {
	                _.$dots.off('keydown.slick', _.keyHandler);
	            }
	        }
	
	        _.$slider.off('focus.slick blur.slick');
	
	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
	            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
	
	            if (_.options.accessibility === true) {
	                _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
	                _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
	            }
	        }
	
	        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
	        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
	        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
	        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);
	
	        _.$list.off('click.slick', _.clickHandler);
	
	        $(document).off(_.visibilityChange, _.visibility);
	
	        _.cleanUpSlideEvents();
	
	        if (_.options.accessibility === true) {
	            _.$list.off('keydown.slick', _.keyHandler);
	        }
	
	        if (_.options.focusOnSelect === true) {
	            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
	        }
	
	        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);
	
	        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);
	
	        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);
	
	        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
	
	    };
	
	    Slick.prototype.cleanUpSlideEvents = function() {
	
	        var _ = this;
	
	        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
	        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
	
	    };
	
	    Slick.prototype.cleanUpRows = function() {
	
	        var _ = this, originalSlides;
	
	        if(_.options.rows > 0) {
	            originalSlides = _.$slides.children().children();
	            originalSlides.removeAttr('style');
	            _.$slider.empty().append(originalSlides);
	        }
	
	    };
	
	    Slick.prototype.clickHandler = function(event) {
	
	        var _ = this;
	
	        if (_.shouldClick === false) {
	            event.stopImmediatePropagation();
	            event.stopPropagation();
	            event.preventDefault();
	        }
	
	    };
	
	    Slick.prototype.destroy = function(refresh) {
	
	        var _ = this;
	
	        _.autoPlayClear();
	
	        _.touchObject = {};
	
	        _.cleanUpEvents();
	
	        $('.slick-cloned', _.$slider).detach();
	
	        if (_.$dots) {
	            _.$dots.remove();
	        }
	
	        if ( _.$prevArrow && _.$prevArrow.length ) {
	
	            _.$prevArrow
	                .removeClass('slick-disabled slick-arrow slick-hidden')
	                .removeAttr('aria-hidden aria-disabled tabindex')
	                .css('display','');
	
	            if ( _.htmlExpr.test( _.options.prevArrow )) {
	                _.$prevArrow.remove();
	            }
	        }
	
	        if ( _.$nextArrow && _.$nextArrow.length ) {
	
	            _.$nextArrow
	                .removeClass('slick-disabled slick-arrow slick-hidden')
	                .removeAttr('aria-hidden aria-disabled tabindex')
	                .css('display','');
	
	            if ( _.htmlExpr.test( _.options.nextArrow )) {
	                _.$nextArrow.remove();
	            }
	        }
	
	
	        if (_.$slides) {
	
	            _.$slides
	                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
	                .removeAttr('aria-hidden')
	                .removeAttr('data-slick-index')
	                .each(function(){
	                    $(this).attr('style', $(this).data('originalStyling'));
	                });
	
	            _.$slideTrack.children(this.options.slide).detach();
	
	            _.$slideTrack.detach();
	
	            _.$list.detach();
	
	            _.$slider.append(_.$slides);
	        }
	
	        _.cleanUpRows();
	
	        _.$slider.removeClass('slick-slider');
	        _.$slider.removeClass('slick-initialized');
	        _.$slider.removeClass('slick-dotted');
	
	        _.unslicked = true;
	
	        if(!refresh) {
	            _.$slider.trigger('destroy', [_]);
	        }
	
	    };
	
	    Slick.prototype.disableTransition = function(slide) {
	
	        var _ = this,
	            transition = {};
	
	        transition[_.transitionType] = '';
	
	        if (_.options.fade === false) {
	            _.$slideTrack.css(transition);
	        } else {
	            _.$slides.eq(slide).css(transition);
	        }
	
	    };
	
	    Slick.prototype.fadeSlide = function(slideIndex, callback) {
	
	        var _ = this;
	
	        if (_.cssTransitions === false) {
	
	            _.$slides.eq(slideIndex).css({
	                zIndex: _.options.zIndex
	            });
	
	            _.$slides.eq(slideIndex).animate({
	                opacity: 1
	            }, _.options.speed, _.options.easing, callback);
	
	        } else {
	
	            _.applyTransition(slideIndex);
	
	            _.$slides.eq(slideIndex).css({
	                opacity: 1,
	                zIndex: _.options.zIndex
	            });
	
	            if (callback) {
	                setTimeout(function() {
	
	                    _.disableTransition(slideIndex);
	
	                    callback.call();
	                }, _.options.speed);
	            }
	
	        }
	
	    };
	
	    Slick.prototype.fadeSlideOut = function(slideIndex) {
	
	        var _ = this;
	
	        if (_.cssTransitions === false) {
	
	            _.$slides.eq(slideIndex).animate({
	                opacity: 0,
	                zIndex: _.options.zIndex - 2
	            }, _.options.speed, _.options.easing);
	
	        } else {
	
	            _.applyTransition(slideIndex);
	
	            _.$slides.eq(slideIndex).css({
	                opacity: 0,
	                zIndex: _.options.zIndex - 2
	            });
	
	        }
	
	    };
	
	    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {
	
	        var _ = this;
	
	        if (filter !== null) {
	
	            _.$slidesCache = _.$slides;
	
	            _.unload();
	
	            _.$slideTrack.children(this.options.slide).detach();
	
	            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);
	
	            _.reinit();
	
	        }
	
	    };
	
	    Slick.prototype.focusHandler = function() {
	
	        var _ = this;
	
	        _.$slider
	            .off('focus.slick blur.slick')
	            .on('focus.slick blur.slick', '*', function(event) {
	
	            event.stopImmediatePropagation();
	            var $sf = $(this);
	
	            setTimeout(function() {
	
	                if( _.options.pauseOnFocus ) {
	                    _.focussed = $sf.is(':focus');
	                    _.autoPlay();
	                }
	
	            }, 0);
	
	        });
	    };
	
	    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {
	
	        var _ = this;
	        return _.currentSlide;
	
	    };
	
	    Slick.prototype.getDotCount = function() {
	
	        var _ = this;
	
	        var breakPoint = 0;
	        var counter = 0;
	        var pagerQty = 0;
	
	        if (_.options.infinite === true) {
	            if (_.slideCount <= _.options.slidesToShow) {
	                 ++pagerQty;
	            } else {
	                while (breakPoint < _.slideCount) {
	                    ++pagerQty;
	                    breakPoint = counter + _.options.slidesToScroll;
	                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
	                }
	            }
	        } else if (_.options.centerMode === true) {
	            pagerQty = _.slideCount;
	        } else if(!_.options.asNavFor) {
	            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
	        }else {
	            while (breakPoint < _.slideCount) {
	                ++pagerQty;
	                breakPoint = counter + _.options.slidesToScroll;
	                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
	            }
	        }
	
	        return pagerQty - 1;
	
	    };
	
	    Slick.prototype.getLeft = function(slideIndex) {
	
	        var _ = this,
	            targetLeft,
	            verticalHeight,
	            verticalOffset = 0,
	            targetSlide,
	            coef;
	
	        _.slideOffset = 0;
	        verticalHeight = _.$slides.first().outerHeight(true);
	
	        if (_.options.infinite === true) {
	            if (_.slideCount > _.options.slidesToShow) {
	                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
	                coef = -1
	
	                if (_.options.vertical === true && _.options.centerMode === true) {
	                    if (_.options.slidesToShow === 2) {
	                        coef = -1.5;
	                    } else if (_.options.slidesToShow === 1) {
	                        coef = -2
	                    }
	                }
	                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
	            }
	            if (_.slideCount % _.options.slidesToScroll !== 0) {
	                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
	                    if (slideIndex > _.slideCount) {
	                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
	                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
	                    } else {
	                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
	                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
	                    }
	                }
	            }
	        } else {
	            if (slideIndex + _.options.slidesToShow > _.slideCount) {
	                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
	                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
	            }
	        }
	
	        if (_.slideCount <= _.options.slidesToShow) {
	            _.slideOffset = 0;
	            verticalOffset = 0;
	        }
	
	        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
	            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
	        } else if (_.options.centerMode === true && _.options.infinite === true) {
	            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
	        } else if (_.options.centerMode === true) {
	            _.slideOffset = 0;
	            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
	        }
	
	        if (_.options.vertical === false) {
	            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
	        } else {
	            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
	        }
	
	        if (_.options.variableWidth === true) {
	
	            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
	                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
	            } else {
	                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
	            }
	
	            if (_.options.rtl === true) {
	                if (targetSlide[0]) {
	                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
	                } else {
	                    targetLeft =  0;
	                }
	            } else {
	                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
	            }
	
	            if (_.options.centerMode === true) {
	                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
	                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
	                } else {
	                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
	                }
	
	                if (_.options.rtl === true) {
	                    if (targetSlide[0]) {
	                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
	                    } else {
	                        targetLeft =  0;
	                    }
	                } else {
	                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
	                }
	
	                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
	            }
	        }
	
	        return targetLeft;
	
	    };
	
	    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {
	
	        var _ = this;
	
	        return _.options[option];
	
	    };
	
	    Slick.prototype.getNavigableIndexes = function() {
	
	        var _ = this,
	            breakPoint = 0,
	            counter = 0,
	            indexes = [],
	            max;
	
	        if (_.options.infinite === false) {
	            max = _.slideCount;
	        } else {
	            breakPoint = _.options.slidesToScroll * -1;
	            counter = _.options.slidesToScroll * -1;
	            max = _.slideCount * 2;
	        }
	
	        while (breakPoint < max) {
	            indexes.push(breakPoint);
	            breakPoint = counter + _.options.slidesToScroll;
	            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
	        }
	
	        return indexes;
	
	    };
	
	    Slick.prototype.getSlick = function() {
	
	        return this;
	
	    };
	
	    Slick.prototype.getSlideCount = function() {
	
	        var _ = this,
	            slidesTraversed, swipedSlide, centerOffset;
	
	        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;
	
	        if (_.options.swipeToSlide === true) {
	            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
	                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
	                    swipedSlide = slide;
	                    return false;
	                }
	            });
	
	            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;
	
	            return slidesTraversed;
	
	        } else {
	            return _.options.slidesToScroll;
	        }
	
	    };
	
	    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {
	
	        var _ = this;
	
	        _.changeSlide({
	            data: {
	                message: 'index',
	                index: parseInt(slide)
	            }
	        }, dontAnimate);
	
	    };
	
	    Slick.prototype.init = function(creation) {
	
	        var _ = this;
	
	        if (!$(_.$slider).hasClass('slick-initialized')) {
	
	            $(_.$slider).addClass('slick-initialized');
	
	            _.buildRows();
	            _.buildOut();
	            _.setProps();
	            _.startLoad();
	            _.loadSlider();
	            _.initializeEvents();
	            _.updateArrows();
	            _.updateDots();
	            _.checkResponsive(true);
	            _.focusHandler();
	
	        }
	
	        if (creation) {
	            _.$slider.trigger('init', [_]);
	        }
	
	        if (_.options.accessibility === true) {
	            _.initADA();
	        }
	
	        if ( _.options.autoplay ) {
	
	            _.paused = false;
	            _.autoPlay();
	
	        }
	
	    };
	
	    Slick.prototype.initADA = function() {
	        var _ = this,
	                numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
	                tabControlIndexes = _.getNavigableIndexes().filter(function(val) {
	                    return (val >= 0) && (val < _.slideCount);
	                });
	
	        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
	            'aria-hidden': 'true',
	            'tabindex': '-1'
	        }).find('a, input, button, select').attr({
	            'tabindex': '-1'
	        });
	
	        if (_.$dots !== null) {
	            _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
	                var slideControlIndex = tabControlIndexes.indexOf(i);
	
	                $(this).attr({
	                    'role': 'tabpanel',
	                    'id': 'slick-slide' + _.instanceUid + i,
	                    'tabindex': -1
	                });
	
	                if (slideControlIndex !== -1) {
	                   var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex
	                   if ($('#' + ariaButtonControl).length) {
	                     $(this).attr({
	                         'aria-describedby': ariaButtonControl
	                     });
	                   }
	                }
	            });
	
	            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
	                var mappedSlideIndex = tabControlIndexes[i];
	
	                $(this).attr({
	                    'role': 'presentation'
	                });
	
	                $(this).find('button').first().attr({
	                    'role': 'tab',
	                    'id': 'slick-slide-control' + _.instanceUid + i,
	                    'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
	                    'aria-label': (i + 1) + ' of ' + numDotGroups,
	                    'aria-selected': null,
	                    'tabindex': '-1'
	                });
	
	            }).eq(_.currentSlide).find('button').attr({
	                'aria-selected': 'true',
	                'tabindex': '0'
	            }).end();
	        }
	
	        for (var i=_.currentSlide, max=i+_.options.slidesToShow; i < max; i++) {
	          if (_.options.focusOnChange) {
	            _.$slides.eq(i).attr({'tabindex': '0'});
	          } else {
	            _.$slides.eq(i).removeAttr('tabindex');
	          }
	        }
	
	        _.activateADA();
	
	    };
	
	    Slick.prototype.initArrowEvents = function() {
	
	        var _ = this;
	
	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	            _.$prevArrow
	               .off('click.slick')
	               .on('click.slick', {
	                    message: 'previous'
	               }, _.changeSlide);
	            _.$nextArrow
	               .off('click.slick')
	               .on('click.slick', {
	                    message: 'next'
	               }, _.changeSlide);
	
	            if (_.options.accessibility === true) {
	                _.$prevArrow.on('keydown.slick', _.keyHandler);
	                _.$nextArrow.on('keydown.slick', _.keyHandler);
	            }
	        }
	
	    };
	
	    Slick.prototype.initDotEvents = function() {
	
	        var _ = this;
	
	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
	            $('li', _.$dots).on('click.slick', {
	                message: 'index'
	            }, _.changeSlide);
	
	            if (_.options.accessibility === true) {
	                _.$dots.on('keydown.slick', _.keyHandler);
	            }
	        }
	
	        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {
	
	            $('li', _.$dots)
	                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
	                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));
	
	        }
	
	    };
	
	    Slick.prototype.initSlideEvents = function() {
	
	        var _ = this;
	
	        if ( _.options.pauseOnHover ) {
	
	            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
	            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
	
	        }
	
	    };
	
	    Slick.prototype.initializeEvents = function() {
	
	        var _ = this;
	
	        _.initArrowEvents();
	
	        _.initDotEvents();
	        _.initSlideEvents();
	
	        _.$list.on('touchstart.slick mousedown.slick', {
	            action: 'start'
	        }, _.swipeHandler);
	        _.$list.on('touchmove.slick mousemove.slick', {
	            action: 'move'
	        }, _.swipeHandler);
	        _.$list.on('touchend.slick mouseup.slick', {
	            action: 'end'
	        }, _.swipeHandler);
	        _.$list.on('touchcancel.slick mouseleave.slick', {
	            action: 'end'
	        }, _.swipeHandler);
	
	        _.$list.on('click.slick', _.clickHandler);
	
	        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));
	
	        if (_.options.accessibility === true) {
	            _.$list.on('keydown.slick', _.keyHandler);
	        }
	
	        if (_.options.focusOnSelect === true) {
	            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
	        }
	
	        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));
	
	        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));
	
	        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);
	
	        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
	        $(_.setPosition);
	
	    };
	
	    Slick.prototype.initUI = function() {
	
	        var _ = this;
	
	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$prevArrow.show();
	            _.$nextArrow.show();
	
	        }
	
	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$dots.show();
	
	        }
	
	    };
	
	    Slick.prototype.keyHandler = function(event) {
	
	        var _ = this;
	         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
	        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
	            if (event.keyCode === 37 && _.options.accessibility === true) {
	                _.changeSlide({
	                    data: {
	                        message: _.options.rtl === true ? 'next' :  'previous'
	                    }
	                });
	            } else if (event.keyCode === 39 && _.options.accessibility === true) {
	                _.changeSlide({
	                    data: {
	                        message: _.options.rtl === true ? 'previous' : 'next'
	                    }
	                });
	            }
	        }
	
	    };
	
	    Slick.prototype.lazyLoad = function() {
	
	        var _ = this,
	            loadRange, cloneRange, rangeStart, rangeEnd;
	
	        function loadImages(imagesScope) {
	
	            $('img[data-lazy]', imagesScope).each(function() {
	
	                var image = $(this),
	                    imageSource = $(this).attr('data-lazy'),
	                    imageSrcSet = $(this).attr('data-srcset'),
	                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
	                    imageToLoad = document.createElement('img');
	
	                imageToLoad.onload = function() {
	
	                    image
	                        .animate({ opacity: 0 }, 100, function() {
	
	                            if (imageSrcSet) {
	                                image
	                                    .attr('srcset', imageSrcSet );
	
	                                if (imageSizes) {
	                                    image
	                                        .attr('sizes', imageSizes );
	                                }
	                            }
	
	                            image
	                                .attr('src', imageSource)
	                                .animate({ opacity: 1 }, 200, function() {
	                                    image
	                                        .removeAttr('data-lazy data-srcset data-sizes')
	                                        .removeClass('slick-loading');
	                                });
	                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
	                        });
	
	                };
	
	                imageToLoad.onerror = function() {
	
	                    image
	                        .removeAttr( 'data-lazy' )
	                        .removeClass( 'slick-loading' )
	                        .addClass( 'slick-lazyload-error' );
	
	                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);
	
	                };
	
	                imageToLoad.src = imageSource;
	
	            });
	
	        }
	
	        if (_.options.centerMode === true) {
	            if (_.options.infinite === true) {
	                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
	                rangeEnd = rangeStart + _.options.slidesToShow + 2;
	            } else {
	                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
	                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
	            }
	        } else {
	            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
	            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
	            if (_.options.fade === true) {
	                if (rangeStart > 0) rangeStart--;
	                if (rangeEnd <= _.slideCount) rangeEnd++;
	            }
	        }
	
	        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
	
	        if (_.options.lazyLoad === 'anticipated') {
	            var prevSlide = rangeStart - 1,
	                nextSlide = rangeEnd,
	                $slides = _.$slider.find('.slick-slide');
	
	            for (var i = 0; i < _.options.slidesToScroll; i++) {
	                if (prevSlide < 0) prevSlide = _.slideCount - 1;
	                loadRange = loadRange.add($slides.eq(prevSlide));
	                loadRange = loadRange.add($slides.eq(nextSlide));
	                prevSlide--;
	                nextSlide++;
	            }
	        }
	
	        loadImages(loadRange);
	
	        if (_.slideCount <= _.options.slidesToShow) {
	            cloneRange = _.$slider.find('.slick-slide');
	            loadImages(cloneRange);
	        } else
	        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
	            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
	            loadImages(cloneRange);
	        } else if (_.currentSlide === 0) {
	            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
	            loadImages(cloneRange);
	        }
	
	    };
	
	    Slick.prototype.loadSlider = function() {
	
	        var _ = this;
	
	        _.setPosition();
	
	        _.$slideTrack.css({
	            opacity: 1
	        });
	
	        _.$slider.removeClass('slick-loading');
	
	        _.initUI();
	
	        if (_.options.lazyLoad === 'progressive') {
	            _.progressiveLazyLoad();
	        }
	
	    };
	
	    Slick.prototype.next = Slick.prototype.slickNext = function() {
	
	        var _ = this;
	
	        _.changeSlide({
	            data: {
	                message: 'next'
	            }
	        });
	
	    };
	
	    Slick.prototype.orientationChange = function() {
	
	        var _ = this;
	
	        _.checkResponsive();
	        _.setPosition();
	
	    };
	
	    Slick.prototype.pause = Slick.prototype.slickPause = function() {
	
	        var _ = this;
	
	        _.autoPlayClear();
	        _.paused = true;
	
	    };
	
	    Slick.prototype.play = Slick.prototype.slickPlay = function() {
	
	        var _ = this;
	
	        _.autoPlay();
	        _.options.autoplay = true;
	        _.paused = false;
	        _.focussed = false;
	        _.interrupted = false;
	
	    };
	
	    Slick.prototype.postSlide = function(index) {
	
	        var _ = this;
	
	        if( !_.unslicked ) {
	
	            _.$slider.trigger('afterChange', [_, index]);
	
	            _.animating = false;
	
	            if (_.slideCount > _.options.slidesToShow) {
	                _.setPosition();
	            }
	
	            _.swipeLeft = null;
	
	            if ( _.options.autoplay ) {
	                _.autoPlay();
	            }
	
	            if (_.options.accessibility === true) {
	                _.initADA();
	
	                if (_.options.focusOnChange) {
	                    var $currentSlide = $(_.$slides.get(_.currentSlide));
	                    $currentSlide.attr('tabindex', 0).focus();
	                }
	            }
	
	        }
	
	    };
	
	    Slick.prototype.prev = Slick.prototype.slickPrev = function() {
	
	        var _ = this;
	
	        _.changeSlide({
	            data: {
	                message: 'previous'
	            }
	        });
	
	    };
	
	    Slick.prototype.preventDefault = function(event) {
	
	        event.preventDefault();
	
	    };
	
	    Slick.prototype.progressiveLazyLoad = function( tryCount ) {
	
	        tryCount = tryCount || 1;
	
	        var _ = this,
	            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
	            image,
	            imageSource,
	            imageSrcSet,
	            imageSizes,
	            imageToLoad;
	
	        if ( $imgsToLoad.length ) {
	
	            image = $imgsToLoad.first();
	            imageSource = image.attr('data-lazy');
	            imageSrcSet = image.attr('data-srcset');
	            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
	            imageToLoad = document.createElement('img');
	
	            imageToLoad.onload = function() {
	
	                if (imageSrcSet) {
	                    image
	                        .attr('srcset', imageSrcSet );
	
	                    if (imageSizes) {
	                        image
	                            .attr('sizes', imageSizes );
	                    }
	                }
	
	                image
	                    .attr( 'src', imageSource )
	                    .removeAttr('data-lazy data-srcset data-sizes')
	                    .removeClass('slick-loading');
	
	                if ( _.options.adaptiveHeight === true ) {
	                    _.setPosition();
	                }
	
	                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
	                _.progressiveLazyLoad();
	
	            };
	
	            imageToLoad.onerror = function() {
	
	                if ( tryCount < 3 ) {
	
	                    /**
	                     * try to load the image 3 times,
	                     * leave a slight delay so we don't get
	                     * servers blocking the request.
	                     */
	                    setTimeout( function() {
	                        _.progressiveLazyLoad( tryCount + 1 );
	                    }, 500 );
	
	                } else {
	
	                    image
	                        .removeAttr( 'data-lazy' )
	                        .removeClass( 'slick-loading' )
	                        .addClass( 'slick-lazyload-error' );
	
	                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);
	
	                    _.progressiveLazyLoad();
	
	                }
	
	            };
	
	            imageToLoad.src = imageSource;
	
	        } else {
	
	            _.$slider.trigger('allImagesLoaded', [ _ ]);
	
	        }
	
	    };
	
	    Slick.prototype.refresh = function( initializing ) {
	
	        var _ = this, currentSlide, lastVisibleIndex;
	
	        lastVisibleIndex = _.slideCount - _.options.slidesToShow;
	
	        // in non-infinite sliders, we don't want to go past the
	        // last visible index.
	        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
	            _.currentSlide = lastVisibleIndex;
	        }
	
	        // if less slides than to show, go to start.
	        if ( _.slideCount <= _.options.slidesToShow ) {
	            _.currentSlide = 0;
	
	        }
	
	        currentSlide = _.currentSlide;
	
	        _.destroy(true);
	
	        $.extend(_, _.initials, { currentSlide: currentSlide });
	
	        _.init();
	
	        if( !initializing ) {
	
	            _.changeSlide({
	                data: {
	                    message: 'index',
	                    index: currentSlide
	                }
	            }, false);
	
	        }
	
	    };
	
	    Slick.prototype.registerBreakpoints = function() {
	
	        var _ = this, breakpoint, currentBreakpoint, l,
	            responsiveSettings = _.options.responsive || null;
	
	        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {
	
	            _.respondTo = _.options.respondTo || 'window';
	
	            for ( breakpoint in responsiveSettings ) {
	
	                l = _.breakpoints.length-1;
	
	                if (responsiveSettings.hasOwnProperty(breakpoint)) {
	                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;
	
	                    // loop through the breakpoints and cut out any existing
	                    // ones with the same breakpoint number, we don't want dupes.
	                    while( l >= 0 ) {
	                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
	                            _.breakpoints.splice(l,1);
	                        }
	                        l--;
	                    }
	
	                    _.breakpoints.push(currentBreakpoint);
	                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
	
	                }
	
	            }
	
	            _.breakpoints.sort(function(a, b) {
	                return ( _.options.mobileFirst ) ? a-b : b-a;
	            });
	
	        }
	
	    };
	
	    Slick.prototype.reinit = function() {
	
	        var _ = this;
	
	        _.$slides =
	            _.$slideTrack
	                .children(_.options.slide)
	                .addClass('slick-slide');
	
	        _.slideCount = _.$slides.length;
	
	        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
	            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
	        }
	
	        if (_.slideCount <= _.options.slidesToShow) {
	            _.currentSlide = 0;
	        }
	
	        _.registerBreakpoints();
	
	        _.setProps();
	        _.setupInfinite();
	        _.buildArrows();
	        _.updateArrows();
	        _.initArrowEvents();
	        _.buildDots();
	        _.updateDots();
	        _.initDotEvents();
	        _.cleanUpSlideEvents();
	        _.initSlideEvents();
	
	        _.checkResponsive(false, true);
	
	        if (_.options.focusOnSelect === true) {
	            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
	        }
	
	        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);
	
	        _.setPosition();
	        _.focusHandler();
	
	        _.paused = !_.options.autoplay;
	        _.autoPlay();
	
	        _.$slider.trigger('reInit', [_]);
	
	    };
	
	    Slick.prototype.resize = function() {
	
	        var _ = this;
	
	        if ($(window).width() !== _.windowWidth) {
	            clearTimeout(_.windowDelay);
	            _.windowDelay = window.setTimeout(function() {
	                _.windowWidth = $(window).width();
	                _.checkResponsive();
	                if( !_.unslicked ) { _.setPosition(); }
	            }, 50);
	        }
	    };
	
	    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {
	
	        var _ = this;
	
	        if (typeof(index) === 'boolean') {
	            removeBefore = index;
	            index = removeBefore === true ? 0 : _.slideCount - 1;
	        } else {
	            index = removeBefore === true ? --index : index;
	        }
	
	        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
	            return false;
	        }
	
	        _.unload();
	
	        if (removeAll === true) {
	            _.$slideTrack.children().remove();
	        } else {
	            _.$slideTrack.children(this.options.slide).eq(index).remove();
	        }
	
	        _.$slides = _.$slideTrack.children(this.options.slide);
	
	        _.$slideTrack.children(this.options.slide).detach();
	
	        _.$slideTrack.append(_.$slides);
	
	        _.$slidesCache = _.$slides;
	
	        _.reinit();
	
	    };
	
	    Slick.prototype.setCSS = function(position) {
	
	        var _ = this,
	            positionProps = {},
	            x, y;
	
	        if (_.options.rtl === true) {
	            position = -position;
	        }
	        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
	        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';
	
	        positionProps[_.positionProp] = position;
	
	        if (_.transformsEnabled === false) {
	            _.$slideTrack.css(positionProps);
	        } else {
	            positionProps = {};
	            if (_.cssTransitions === false) {
	                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
	                _.$slideTrack.css(positionProps);
	            } else {
	                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
	                _.$slideTrack.css(positionProps);
	            }
	        }
	
	    };
	
	    Slick.prototype.setDimensions = function() {
	
	        var _ = this;
	
	        if (_.options.vertical === false) {
	            if (_.options.centerMode === true) {
	                _.$list.css({
	                    padding: ('0px ' + _.options.centerPadding)
	                });
	            }
	        } else {
	            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
	            if (_.options.centerMode === true) {
	                _.$list.css({
	                    padding: (_.options.centerPadding + ' 0px')
	                });
	            }
	        }
	
	        _.listWidth = _.$list.width();
	        _.listHeight = _.$list.height();
	
	
	        if (_.options.vertical === false && _.options.variableWidth === false) {
	            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
	            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));
	
	        } else if (_.options.variableWidth === true) {
	            _.$slideTrack.width(5000 * _.slideCount);
	        } else {
	            _.slideWidth = Math.ceil(_.listWidth);
	            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
	        }
	
	        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
	        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
	
	    };
	
	    Slick.prototype.setFade = function() {
	
	        var _ = this,
	            targetLeft;
	
	        _.$slides.each(function(index, element) {
	            targetLeft = (_.slideWidth * index) * -1;
	            if (_.options.rtl === true) {
	                $(element).css({
	                    position: 'relative',
	                    right: targetLeft,
	                    top: 0,
	                    zIndex: _.options.zIndex - 2,
	                    opacity: 0
	                });
	            } else {
	                $(element).css({
	                    position: 'relative',
	                    left: targetLeft,
	                    top: 0,
	                    zIndex: _.options.zIndex - 2,
	                    opacity: 0
	                });
	            }
	        });
	
	        _.$slides.eq(_.currentSlide).css({
	            zIndex: _.options.zIndex - 1,
	            opacity: 1
	        });
	
	    };
	
	    Slick.prototype.setHeight = function() {
	
	        var _ = this;
	
	        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
	            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
	            _.$list.css('height', targetHeight);
	        }
	
	    };
	
	    Slick.prototype.setOption =
	    Slick.prototype.slickSetOption = function() {
	
	        /**
	         * accepts arguments in format of:
	         *
	         *  - for changing a single option's value:
	         *     .slick("setOption", option, value, refresh )
	         *
	         *  - for changing a set of responsive options:
	         *     .slick("setOption", 'responsive', [{}, ...], refresh )
	         *
	         *  - for updating multiple values at once (not responsive)
	         *     .slick("setOption", { 'option': value, ... }, refresh )
	         */
	
	        var _ = this, l, item, option, value, refresh = false, type;
	
	        if( $.type( arguments[0] ) === 'object' ) {
	
	            option =  arguments[0];
	            refresh = arguments[1];
	            type = 'multiple';
	
	        } else if ( $.type( arguments[0] ) === 'string' ) {
	
	            option =  arguments[0];
	            value = arguments[1];
	            refresh = arguments[2];
	
	            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {
	
	                type = 'responsive';
	
	            } else if ( typeof arguments[1] !== 'undefined' ) {
	
	                type = 'single';
	
	            }
	
	        }
	
	        if ( type === 'single' ) {
	
	            _.options[option] = value;
	
	
	        } else if ( type === 'multiple' ) {
	
	            $.each( option , function( opt, val ) {
	
	                _.options[opt] = val;
	
	            });
	
	
	        } else if ( type === 'responsive' ) {
	
	            for ( item in value ) {
	
	                if( $.type( _.options.responsive ) !== 'array' ) {
	
	                    _.options.responsive = [ value[item] ];
	
	                } else {
	
	                    l = _.options.responsive.length-1;
	
	                    // loop through the responsive object and splice out duplicates.
	                    while( l >= 0 ) {
	
	                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {
	
	                            _.options.responsive.splice(l,1);
	
	                        }
	
	                        l--;
	
	                    }
	
	                    _.options.responsive.push( value[item] );
	
	                }
	
	            }
	
	        }
	
	        if ( refresh ) {
	
	            _.unload();
	            _.reinit();
	
	        }
	
	    };
	
	    Slick.prototype.setPosition = function() {
	
	        var _ = this;
	
	        _.setDimensions();
	
	        _.setHeight();
	
	        if (_.options.fade === false) {
	            _.setCSS(_.getLeft(_.currentSlide));
	        } else {
	            _.setFade();
	        }
	
	        _.$slider.trigger('setPosition', [_]);
	
	    };
	
	    Slick.prototype.setProps = function() {
	
	        var _ = this,
	            bodyStyle = document.body.style;
	
	        _.positionProp = _.options.vertical === true ? 'top' : 'left';
	
	        if (_.positionProp === 'top') {
	            _.$slider.addClass('slick-vertical');
	        } else {
	            _.$slider.removeClass('slick-vertical');
	        }
	
	        if (bodyStyle.WebkitTransition !== undefined ||
	            bodyStyle.MozTransition !== undefined ||
	            bodyStyle.msTransition !== undefined) {
	            if (_.options.useCSS === true) {
	                _.cssTransitions = true;
	            }
	        }
	
	        if ( _.options.fade ) {
	            if ( typeof _.options.zIndex === 'number' ) {
	                if( _.options.zIndex < 3 ) {
	                    _.options.zIndex = 3;
	                }
	            } else {
	                _.options.zIndex = _.defaults.zIndex;
	            }
	        }
	
	        if (bodyStyle.OTransform !== undefined) {
	            _.animType = 'OTransform';
	            _.transformType = '-o-transform';
	            _.transitionType = 'OTransition';
	            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
	        }
	        if (bodyStyle.MozTransform !== undefined) {
	            _.animType = 'MozTransform';
	            _.transformType = '-moz-transform';
	            _.transitionType = 'MozTransition';
	            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
	        }
	        if (bodyStyle.webkitTransform !== undefined) {
	            _.animType = 'webkitTransform';
	            _.transformType = '-webkit-transform';
	            _.transitionType = 'webkitTransition';
	            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
	        }
	        if (bodyStyle.msTransform !== undefined) {
	            _.animType = 'msTransform';
	            _.transformType = '-ms-transform';
	            _.transitionType = 'msTransition';
	            if (bodyStyle.msTransform === undefined) _.animType = false;
	        }
	        if (bodyStyle.transform !== undefined && _.animType !== false) {
	            _.animType = 'transform';
	            _.transformType = 'transform';
	            _.transitionType = 'transition';
	        }
	        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
	    };
	
	
	    Slick.prototype.setSlideClasses = function(index) {
	
	        var _ = this,
	            centerOffset, allSlides, indexOffset, remainder;
	
	        allSlides = _.$slider
	            .find('.slick-slide')
	            .removeClass('slick-active slick-center slick-current')
	            .attr('aria-hidden', 'true');
	
	        _.$slides
	            .eq(index)
	            .addClass('slick-current');
	
	        if (_.options.centerMode === true) {
	
	            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
	
	            centerOffset = Math.floor(_.options.slidesToShow / 2);
	
	            if (_.options.infinite === true) {
	
	                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
	                    _.$slides
	                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');
	
	                } else {
	
	                    indexOffset = _.options.slidesToShow + index;
	                    allSlides
	                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');
	
	                }
	
	                if (index === 0) {
	
	                    allSlides
	                        .eq(allSlides.length - 1 - _.options.slidesToShow)
	                        .addClass('slick-center');
	
	                } else if (index === _.slideCount - 1) {
	
	                    allSlides
	                        .eq(_.options.slidesToShow)
	                        .addClass('slick-center');
	
	                }
	
	            }
	
	            _.$slides
	                .eq(index)
	                .addClass('slick-center');
	
	        } else {
	
	            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {
	
	                _.$slides
	                    .slice(index, index + _.options.slidesToShow)
	                    .addClass('slick-active')
	                    .attr('aria-hidden', 'false');
	
	            } else if (allSlides.length <= _.options.slidesToShow) {
	
	                allSlides
	                    .addClass('slick-active')
	                    .attr('aria-hidden', 'false');
	
	            } else {
	
	                remainder = _.slideCount % _.options.slidesToShow;
	                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;
	
	                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {
	
	                    allSlides
	                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');
	
	                } else {
	
	                    allSlides
	                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');
	
	                }
	
	            }
	
	        }
	
	        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
	            _.lazyLoad();
	        }
	    };
	
	    Slick.prototype.setupInfinite = function() {
	
	        var _ = this,
	            i, slideIndex, infiniteCount;
	
	        if (_.options.fade === true) {
	            _.options.centerMode = false;
	        }
	
	        if (_.options.infinite === true && _.options.fade === false) {
	
	            slideIndex = null;
	
	            if (_.slideCount > _.options.slidesToShow) {
	
	                if (_.options.centerMode === true) {
	                    infiniteCount = _.options.slidesToShow + 1;
	                } else {
	                    infiniteCount = _.options.slidesToShow;
	                }
	
	                for (i = _.slideCount; i > (_.slideCount -
	                        infiniteCount); i -= 1) {
	                    slideIndex = i - 1;
	                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
	                        .attr('data-slick-index', slideIndex - _.slideCount)
	                        .prependTo(_.$slideTrack).addClass('slick-cloned');
	                }
	                for (i = 0; i < infiniteCount  + _.slideCount; i += 1) {
	                    slideIndex = i;
	                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
	                        .attr('data-slick-index', slideIndex + _.slideCount)
	                        .appendTo(_.$slideTrack).addClass('slick-cloned');
	                }
	                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
	                    $(this).attr('id', '');
	                });
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.interrupt = function( toggle ) {
	
	        var _ = this;
	
	        if( !toggle ) {
	            _.autoPlay();
	        }
	        _.interrupted = toggle;
	
	    };
	
	    Slick.prototype.selectHandler = function(event) {
	
	        var _ = this;
	
	        var targetElement =
	            $(event.target).is('.slick-slide') ?
	                $(event.target) :
	                $(event.target).parents('.slick-slide');
	
	        var index = parseInt(targetElement.attr('data-slick-index'));
	
	        if (!index) index = 0;
	
	        if (_.slideCount <= _.options.slidesToShow) {
	
	            _.slideHandler(index, false, true);
	            return;
	
	        }
	
	        _.slideHandler(index);
	
	    };
	
	    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {
	
	        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
	            _ = this, navTarget;
	
	        sync = sync || false;
	
	        if (_.animating === true && _.options.waitForAnimate === true) {
	            return;
	        }
	
	        if (_.options.fade === true && _.currentSlide === index) {
	            return;
	        }
	
	        if (sync === false) {
	            _.asNavFor(index);
	        }
	
	        targetSlide = index;
	        targetLeft = _.getLeft(targetSlide);
	        slideLeft = _.getLeft(_.currentSlide);
	
	        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;
	
	        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
	            if (_.options.fade === false) {
	                targetSlide = _.currentSlide;
	                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
	                    _.animateSlide(slideLeft, function() {
	                        _.postSlide(targetSlide);
	                    });
	                } else {
	                    _.postSlide(targetSlide);
	                }
	            }
	            return;
	        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
	            if (_.options.fade === false) {
	                targetSlide = _.currentSlide;
	                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
	                    _.animateSlide(slideLeft, function() {
	                        _.postSlide(targetSlide);
	                    });
	                } else {
	                    _.postSlide(targetSlide);
	                }
	            }
	            return;
	        }
	
	        if ( _.options.autoplay ) {
	            clearInterval(_.autoPlayTimer);
	        }
	
	        if (targetSlide < 0) {
	            if (_.slideCount % _.options.slidesToScroll !== 0) {
	                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
	            } else {
	                animSlide = _.slideCount + targetSlide;
	            }
	        } else if (targetSlide >= _.slideCount) {
	            if (_.slideCount % _.options.slidesToScroll !== 0) {
	                animSlide = 0;
	            } else {
	                animSlide = targetSlide - _.slideCount;
	            }
	        } else {
	            animSlide = targetSlide;
	        }
	
	        _.animating = true;
	
	        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);
	
	        oldSlide = _.currentSlide;
	        _.currentSlide = animSlide;
	
	        _.setSlideClasses(_.currentSlide);
	
	        if ( _.options.asNavFor ) {
	
	            navTarget = _.getNavTarget();
	            navTarget = navTarget.slick('getSlick');
	
	            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
	                navTarget.setSlideClasses(_.currentSlide);
	            }
	
	        }
	
	        _.updateDots();
	        _.updateArrows();
	
	        if (_.options.fade === true) {
	            if (dontAnimate !== true) {
	
	                _.fadeSlideOut(oldSlide);
	
	                _.fadeSlide(animSlide, function() {
	                    _.postSlide(animSlide);
	                });
	
	            } else {
	                _.postSlide(animSlide);
	            }
	            _.animateHeight();
	            return;
	        }
	
	        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
	            _.animateSlide(targetLeft, function() {
	                _.postSlide(animSlide);
	            });
	        } else {
	            _.postSlide(animSlide);
	        }
	
	    };
	
	    Slick.prototype.startLoad = function() {
	
	        var _ = this;
	
	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$prevArrow.hide();
	            _.$nextArrow.hide();
	
	        }
	
	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$dots.hide();
	
	        }
	
	        _.$slider.addClass('slick-loading');
	
	    };
	
	    Slick.prototype.swipeDirection = function() {
	
	        var xDist, yDist, r, swipeAngle, _ = this;
	
	        xDist = _.touchObject.startX - _.touchObject.curX;
	        yDist = _.touchObject.startY - _.touchObject.curY;
	        r = Math.atan2(yDist, xDist);
	
	        swipeAngle = Math.round(r * 180 / Math.PI);
	        if (swipeAngle < 0) {
	            swipeAngle = 360 - Math.abs(swipeAngle);
	        }
	
	        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
	            return (_.options.rtl === false ? 'left' : 'right');
	        }
	        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
	            return (_.options.rtl === false ? 'left' : 'right');
	        }
	        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
	            return (_.options.rtl === false ? 'right' : 'left');
	        }
	        if (_.options.verticalSwiping === true) {
	            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
	                return 'down';
	            } else {
	                return 'up';
	            }
	        }
	
	        return 'vertical';
	
	    };
	
	    Slick.prototype.swipeEnd = function(event) {
	
	        var _ = this,
	            slideCount,
	            direction;
	
	        _.dragging = false;
	        _.swiping = false;
	
	        if (_.scrolling) {
	            _.scrolling = false;
	            return false;
	        }
	
	        _.interrupted = false;
	        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;
	
	        if ( _.touchObject.curX === undefined ) {
	            return false;
	        }
	
	        if ( _.touchObject.edgeHit === true ) {
	            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
	        }
	
	        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {
	
	            direction = _.swipeDirection();
	
	            switch ( direction ) {
	
	                case 'left':
	                case 'down':
	
	                    slideCount =
	                        _.options.swipeToSlide ?
	                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
	                            _.currentSlide + _.getSlideCount();
	
	                    _.currentDirection = 0;
	
	                    break;
	
	                case 'right':
	                case 'up':
	
	                    slideCount =
	                        _.options.swipeToSlide ?
	                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
	                            _.currentSlide - _.getSlideCount();
	
	                    _.currentDirection = 1;
	
	                    break;
	
	                default:
	
	
	            }
	
	            if( direction != 'vertical' ) {
	
	                _.slideHandler( slideCount );
	                _.touchObject = {};
	                _.$slider.trigger('swipe', [_, direction ]);
	
	            }
	
	        } else {
	
	            if ( _.touchObject.startX !== _.touchObject.curX ) {
	
	                _.slideHandler( _.currentSlide );
	                _.touchObject = {};
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.swipeHandler = function(event) {
	
	        var _ = this;
	
	        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
	            return;
	        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
	            return;
	        }
	
	        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
	            event.originalEvent.touches.length : 1;
	
	        _.touchObject.minSwipe = _.listWidth / _.options
	            .touchThreshold;
	
	        if (_.options.verticalSwiping === true) {
	            _.touchObject.minSwipe = _.listHeight / _.options
	                .touchThreshold;
	        }
	
	        switch (event.data.action) {
	
	            case 'start':
	                _.swipeStart(event);
	                break;
	
	            case 'move':
	                _.swipeMove(event);
	                break;
	
	            case 'end':
	                _.swipeEnd(event);
	                break;
	
	        }
	
	    };
	
	    Slick.prototype.swipeMove = function(event) {
	
	        var _ = this,
	            edgeWasHit = false,
	            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;
	
	        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;
	
	        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
	            return false;
	        }
	
	        curLeft = _.getLeft(_.currentSlide);
	
	        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
	        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
	
	        _.touchObject.swipeLength = Math.round(Math.sqrt(
	            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));
	
	        verticalSwipeLength = Math.round(Math.sqrt(
	            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
	
	        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
	            _.scrolling = true;
	            return false;
	        }
	
	        if (_.options.verticalSwiping === true) {
	            _.touchObject.swipeLength = verticalSwipeLength;
	        }
	
	        swipeDirection = _.swipeDirection();
	
	        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
	            _.swiping = true;
	            event.preventDefault();
	        }
	
	        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
	        if (_.options.verticalSwiping === true) {
	            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
	        }
	
	
	        swipeLength = _.touchObject.swipeLength;
	
	        _.touchObject.edgeHit = false;
	
	        if (_.options.infinite === false) {
	            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
	                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
	                _.touchObject.edgeHit = true;
	            }
	        }
	
	        if (_.options.vertical === false) {
	            _.swipeLeft = curLeft + swipeLength * positionOffset;
	        } else {
	            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
	        }
	        if (_.options.verticalSwiping === true) {
	            _.swipeLeft = curLeft + swipeLength * positionOffset;
	        }
	
	        if (_.options.fade === true || _.options.touchMove === false) {
	            return false;
	        }
	
	        if (_.animating === true) {
	            _.swipeLeft = null;
	            return false;
	        }
	
	        _.setCSS(_.swipeLeft);
	
	    };
	
	    Slick.prototype.swipeStart = function(event) {
	
	        var _ = this,
	            touches;
	
	        _.interrupted = true;
	
	        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
	            _.touchObject = {};
	            return false;
	        }
	
	        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
	            touches = event.originalEvent.touches[0];
	        }
	
	        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
	        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
	
	        _.dragging = true;
	
	    };
	
	    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {
	
	        var _ = this;
	
	        if (_.$slidesCache !== null) {
	
	            _.unload();
	
	            _.$slideTrack.children(this.options.slide).detach();
	
	            _.$slidesCache.appendTo(_.$slideTrack);
	
	            _.reinit();
	
	        }
	
	    };
	
	    Slick.prototype.unload = function() {
	
	        var _ = this;
	
	        $('.slick-cloned', _.$slider).remove();
	
	        if (_.$dots) {
	            _.$dots.remove();
	        }
	
	        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
	            _.$prevArrow.remove();
	        }
	
	        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
	            _.$nextArrow.remove();
	        }
	
	        _.$slides
	            .removeClass('slick-slide slick-active slick-visible slick-current')
	            .attr('aria-hidden', 'true')
	            .css('width', '');
	
	    };
	
	    Slick.prototype.unslick = function(fromBreakpoint) {
	
	        var _ = this;
	        _.$slider.trigger('unslick', [_, fromBreakpoint]);
	        _.destroy();
	
	    };
	
	    Slick.prototype.updateArrows = function() {
	
	        var _ = this,
	            centerOffset;
	
	        centerOffset = Math.floor(_.options.slidesToShow / 2);
	
	        if ( _.options.arrows === true &&
	            _.slideCount > _.options.slidesToShow &&
	            !_.options.infinite ) {
	
	            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	
	            if (_.currentSlide === 0) {
	
	                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
	                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	
	            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
	
	                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
	                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	
	            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
	
	                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
	                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.updateDots = function() {
	
	        var _ = this;
	
	        if (_.$dots !== null) {
	
	            _.$dots
	                .find('li')
	                    .removeClass('slick-active')
	                    .end();
	
	            _.$dots
	                .find('li')
	                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
	                .addClass('slick-active');
	
	        }
	
	    };
	
	    Slick.prototype.visibility = function() {
	
	        var _ = this;
	
	        if ( _.options.autoplay ) {
	
	            if ( document[_.hidden] ) {
	
	                _.interrupted = true;
	
	            } else {
	
	                _.interrupted = false;
	
	            }
	
	        }
	
	    };
	
	    $.fn.slick = function() {
	        var _ = this,
	            opt = arguments[0],
	            args = Array.prototype.slice.call(arguments, 1),
	            l = _.length,
	            i,
	            ret;
	        for (i = 0; i < l; i++) {
	            if (typeof opt == 'object' || typeof opt == 'undefined')
	                _[i].slick = new Slick(_[i], opt);
	            else
	                ret = _[i].slick[opt].apply(_[i].slick, args);
	            if (typeof ret != 'undefined') return ret;
	        }
	        return _;
	    };
	
	}));
	/* jquery.nicescroll
	-- version 3.7.6
	-- copyright 2017-07-19 InuYaksa*2017
	-- licensed under the MIT
	--
	-- https://nicescroll.areaaperta.com/
	-- https://github.com/inuyaksa/jquery.nicescroll
	--
	*/
	
	/* jshint expr: true */
	
	(function (factory) {
	  if (typeof define === 'function' && define.amd) {
	    // AMD. Register as anonymous module.
	    define(['jquery'], factory);
	  } else if (typeof exports === 'object') {
	    // Node/CommonJS.
	    module.exports = factory(require('jquery'));
	  } else {
	    // Browser globals.
	    factory(jQuery);
	  }
	}(function (jQuery) {
	
	  "use strict";
	
	  // globals
	  var domfocus = false,
	    mousefocus = false,
	    tabindexcounter = 0,
	    ascrailcounter = 2000,
	    globalmaxzindex = 0;
	
	  var $ = jQuery,       // sandbox
	    _doc = document,
	    _win = window,
	    $window = $(_win);
	
	  var delegatevents = [];
	
	  // http://stackoverflow.com/questions/2161159/get-script-path
	  function getScriptPath() {
	    var scripts = _doc.currentScript || (function () { var s = _doc.getElementsByTagName('script'); return (s.length) ? s[s.length - 1] : false; })();
	    var path = scripts ? scripts.src.split('?')[0] : '';
	    return (path.split('/').length > 0) ? path.split('/').slice(0, -1).join('/') + '/' : '';
	  }
	
	  // based on code by Paul Irish https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/  
	  var setAnimationFrame = _win.requestAnimationFrame || _win.webkitRequestAnimationFrame || _win.mozRequestAnimationFrame || false;
	  var clearAnimationFrame = _win.cancelAnimationFrame || _win.webkitCancelAnimationFrame || _win.mozCancelAnimationFrame || false;
	
	  if (!setAnimationFrame) {
	    var anilasttime = 0;
	    setAnimationFrame = function (callback, element) {
	      var currTime = new Date().getTime();
	      var timeToCall = Math.max(0, 16 - (currTime - anilasttime));
	      var id = _win.setTimeout(function () { callback(currTime + timeToCall); },
	        timeToCall);
	      anilasttime = currTime + timeToCall;
	      return id;
	    };
	    clearAnimationFrame = function (id) {
	      _win.clearTimeout(id);
	    };
	  } else {
	    if (!_win.cancelAnimationFrame) clearAnimationFrame = function (id) { };
	  }
	
	  var ClsMutationObserver = _win.MutationObserver || _win.WebKitMutationObserver || false;
	
	  var now = Date.now || function () { return new Date().getTime(); };
	
	  var _globaloptions = {
	    zindex: "auto",
	    cursoropacitymin: 0,
	    cursoropacitymax: 1,
	    cursorcolor: "#424242",
	    cursorwidth: "6px",
	    cursorborder: "1px solid #fff",
	    cursorborderradius: "5px",
	    scrollspeed: 40,
	    mousescrollstep: 9 * 3,
	    touchbehavior: false,   // deprecated
	    emulatetouch: false,    // replacing touchbehavior
	    hwacceleration: true,
	    usetransition: true,
	    boxzoom: false,
	    dblclickzoom: true,
	    gesturezoom: true,
	    grabcursorenabled: true,
	    autohidemode: true,
	    background: "",
	    iframeautoresize: true,
	    cursorminheight: 32,
	    preservenativescrolling: true,
	    railoffset: false,
	    railhoffset: false,
	    bouncescroll: true,
	    spacebarenabled: true,
	    railpadding: {
	      top: 0,
	      right: 0,
	      left: 0,
	      bottom: 0
	    },
	    disableoutline: true,
	    horizrailenabled: true,
	    railalign: "right",
	    railvalign: "bottom",
	    enabletranslate3d: true,
	    enablemousewheel: true,
	    enablekeyboard: true,
	    smoothscroll: true,
	    sensitiverail: true,
	    enablemouselockapi: true,
	    //      cursormaxheight:false,
	    cursorfixedheight: false,
	    directionlockdeadzone: 6,
	    hidecursordelay: 400,
	    nativeparentscrolling: true,
	    enablescrollonselection: true,
	    overflowx: true,
	    overflowy: true,
	    cursordragspeed: 0.3,
	    rtlmode: "auto",
	    cursordragontouch: false,
	    oneaxismousemode: "auto",
	    scriptpath: getScriptPath(),
	    preventmultitouchscrolling: true,
	    disablemutationobserver: false,
	    enableobserver: true,
	    scrollbarid: false
	  };
	
	  var browserdetected = false;
	
	  var getBrowserDetection = function () {
	
	    if (browserdetected) return browserdetected;
	
	    var _el = _doc.createElement('DIV'),
	      _style = _el.style,
	      _agent = navigator.userAgent,
	      _platform = navigator.platform,
	      d = {};
	
	    d.haspointerlock = "pointerLockElement" in _doc || "webkitPointerLockElement" in _doc || "mozPointerLockElement" in _doc;
	
	    d.isopera = ("opera" in _win); // 12-
	    d.isopera12 = (d.isopera && ("getUserMedia" in navigator));
	    d.isoperamini = (Object.prototype.toString.call(_win.operamini) === "[object OperaMini]");
	
	    d.isie = (("all" in _doc) && ("attachEvent" in _el) && !d.isopera); //IE10-
	    d.isieold = (d.isie && !("msInterpolationMode" in _style)); // IE6 and older
	    d.isie7 = d.isie && !d.isieold && (!("documentMode" in _doc) || (_doc.documentMode === 7));
	    d.isie8 = d.isie && ("documentMode" in _doc) && (_doc.documentMode === 8);
	    d.isie9 = d.isie && ("performance" in _win) && (_doc.documentMode === 9);
	    d.isie10 = d.isie && ("performance" in _win) && (_doc.documentMode === 10);
	    d.isie11 = ("msRequestFullscreen" in _el) && (_doc.documentMode >= 11); // IE11+
	
	    d.ismsedge = ("msCredentials" in _win);  // MS Edge 14+
	
	    d.ismozilla = ("MozAppearance" in _style);
	
	    d.iswebkit = !d.ismsedge && ("WebkitAppearance" in _style);
	
	    d.ischrome = d.iswebkit && ("chrome" in _win);
	    d.ischrome38 = (d.ischrome && ("touchAction" in _style)); // behavior changed in touch emulation    
	    d.ischrome22 = (!d.ischrome38) && (d.ischrome && d.haspointerlock);
	    d.ischrome26 = (!d.ischrome38) && (d.ischrome && ("transition" in _style)); // issue with transform detection (maintain prefix)
	
	    d.cantouch = ("ontouchstart" in _doc.documentElement) || ("ontouchstart" in _win); // with detection for Chrome Touch Emulation    
	    d.hasw3ctouch = (_win.PointerEvent || false) && ((navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)); //IE11 pointer events, following W3C Pointer Events spec
	    d.hasmstouch = (!d.hasw3ctouch) && (_win.MSPointerEvent || false); // IE10 pointer events
	
	    d.ismac = /^mac$/i.test(_platform);
	
	    d.isios = d.cantouch && /iphone|ipad|ipod/i.test(_platform);
	    d.isios4 = d.isios && !("seal" in Object);
	    d.isios7 = d.isios && ("webkitHidden" in _doc);  //iOS 7+
	    d.isios8 = d.isios && ("hidden" in _doc);  //iOS 8+
	    d.isios10 = d.isios && _win.Proxy;  //iOS 10+
	
	    d.isandroid = (/android/i.test(_agent));
	
	    d.haseventlistener = ("addEventListener" in _el);
	
	    d.trstyle = false;
	    d.hastransform = false;
	    d.hastranslate3d = false;
	    d.transitionstyle = false;
	    d.hastransition = false;
	    d.transitionend = false;
	
	    d.trstyle = "transform";
	    d.hastransform = ("transform" in _style) || (function () {
	      var check = ['msTransform', 'webkitTransform', 'MozTransform', 'OTransform'];
	      for (var a = 0, c = check.length; a < c; a++) {
	        if (_style[check[a]] !== undefined) {
	          d.trstyle = check[a];
	          break;
	        }
	      }
	      d.hastransform = (!!d.trstyle);
	    })();
	
	    if (d.hastransform) {
	      _style[d.trstyle] = "translate3d(1px,2px,3px)";
	      d.hastranslate3d = /translate3d/.test(_style[d.trstyle]);
	    }
	
	    d.transitionstyle = "transition";
	    d.prefixstyle = '';
	    d.transitionend = "transitionend";
	
	    d.hastransition = ("transition" in _style) || (function () {
	
	      d.transitionend = false;
	      var check = ['webkitTransition', 'msTransition', 'MozTransition', 'OTransition', 'OTransition', 'KhtmlTransition'];
	      var prefix = ['-webkit-', '-ms-', '-moz-', '-o-', '-o', '-khtml-'];
	      var evs = ['webkitTransitionEnd', 'msTransitionEnd', 'transitionend', 'otransitionend', 'oTransitionEnd', 'KhtmlTransitionEnd'];
	      for (var a = 0, c = check.length; a < c; a++) {
	        if (check[a] in _style) {
	          d.transitionstyle = check[a];
	          d.prefixstyle = prefix[a];
	          d.transitionend = evs[a];
	          break;
	        }
	      }
	      if (d.ischrome26) d.prefixstyle = prefix[1];  // always use prefix
	
	      d.hastransition = (d.transitionstyle);
	
	    })();
	
	    function detectCursorGrab() {
	      var lst = ['grab', '-webkit-grab', '-moz-grab'];
	      if ((d.ischrome && !d.ischrome38) || d.isie) lst = []; // force setting for IE returns false positive and chrome cursor bug
	      for (var a = 0, l = lst.length; a < l; a++) {
	        var p = lst[a];
	        _style.cursor = p;
	        if (_style.cursor == p) return p;
	      }
	      return 'url(https://cdnjs.cloudflare.com/ajax/libs/slider-pro/1.3.0/css/images/openhand.cur),n-resize'; // thanks to https://cdnjs.com/ for the openhand cursor!
	    }
	    d.cursorgrabvalue = detectCursorGrab();
	
	    d.hasmousecapture = ("setCapture" in _el);
	
	    d.hasMutationObserver = (ClsMutationObserver !== false);
	
	    _el = null; //memory released
	
	    browserdetected = d;
	
	    return d;
	  };
	
	  var NiceScrollClass = function (myopt, me) {
	
	    var self = this;
	
	    this.version = '3.7.6';
	    this.name = 'nicescroll';
	
	    this.me = me;
	
	    var $body = $("body");
	
	    var opt = this.opt = {
	      doc: $body,
	      win: false
	    };
	
	    $.extend(opt, _globaloptions);  // clone opts
	
	    // Options for internal use
	    opt.snapbackspeed = 80;
	
	    if (myopt || false) {
	      for (var a in opt) {
	        if (myopt[a] !== undefined) opt[a] = myopt[a];
	      }
	    }
	
	    if (opt.disablemutationobserver) ClsMutationObserver = false;
	
	    this.doc = opt.doc;
	    this.iddoc = (this.doc && this.doc[0]) ? this.doc[0].id || '' : '';
	    this.ispage = /^BODY|HTML/.test((opt.win) ? opt.win[0].nodeName : this.doc[0].nodeName);
	    this.haswrapper = (opt.win !== false);
	    this.win = opt.win || (this.ispage ? $window : this.doc);
	    this.docscroll = (this.ispage && !this.haswrapper) ? $window : this.win;
	    this.body = $body;
	    this.viewport = false;
	
	    this.isfixed = false;
	
	    this.iframe = false;
	    this.isiframe = ((this.doc[0].nodeName == 'IFRAME') && (this.win[0].nodeName == 'IFRAME'));
	
	    this.istextarea = (this.win[0].nodeName == 'TEXTAREA');
	
	    this.forcescreen = false; //force to use screen position on events
	
	    this.canshowonmouseevent = (opt.autohidemode != "scroll");
	
	    // Events jump table    
	    this.onmousedown = false;
	    this.onmouseup = false;
	    this.onmousemove = false;
	    this.onmousewheel = false;
	    this.onkeypress = false;
	    this.ongesturezoom = false;
	    this.onclick = false;
	
	    // Nicescroll custom events
	    this.onscrollstart = false;
	    this.onscrollend = false;
	    this.onscrollcancel = false;
	
	    this.onzoomin = false;
	    this.onzoomout = false;
	
	    // Let's start!  
	    this.view = false;
	    this.page = false;
	
	    this.scroll = {
	      x: 0,
	      y: 0
	    };
	    this.scrollratio = {
	      x: 0,
	      y: 0
	    };
	    this.cursorheight = 20;
	    this.scrollvaluemax = 0;
	
	    // http://dev.w3.org/csswg/css-writing-modes-3/#logical-to-physical
	    // http://dev.w3.org/csswg/css-writing-modes-3/#svg-writing-mode
	    if (opt.rtlmode == "auto") {
	      var target = this.win[0] == _win ? this.body : this.win;
	      var writingMode = target.css("writing-mode") || target.css("-webkit-writing-mode") || target.css("-ms-writing-mode") || target.css("-moz-writing-mode");
	
	      if (writingMode == "horizontal-tb" || writingMode == "lr-tb" || writingMode === "") {
	        this.isrtlmode = (target.css("direction") == "rtl");
	        this.isvertical = false;
	      } else {
	        this.isrtlmode = (writingMode == "vertical-rl" || writingMode == "tb" || writingMode == "tb-rl" || writingMode == "rl-tb");
	        this.isvertical = (writingMode == "vertical-rl" || writingMode == "tb" || writingMode == "tb-rl");
	      }
	    } else {
	      this.isrtlmode = (opt.rtlmode === true);
	      this.isvertical = false;
	    }
	    //    this.checkrtlmode = false;
	
	    this.scrollrunning = false;
	
	    this.scrollmom = false;
	
	    this.observer = false;  // observer div changes
	    this.observerremover = false;  // observer on parent for remove detection
	    this.observerbody = false;  // observer on body for position change
	
	    if (opt.scrollbarid !== false) {
	      this.id = opt.scrollbarid;
	    } else {
	      do {
	        this.id = "ascrail" + (ascrailcounter++);
	      } while (_doc.getElementById(this.id));
	    }
	
	    this.rail = false;
	    this.cursor = false;
	    this.cursorfreezed = false;
	    this.selectiondrag = false;
	
	    this.zoom = false;
	    this.zoomactive = false;
	
	    this.hasfocus = false;
	    this.hasmousefocus = false;
	
	    //this.visibility = true;
	    this.railslocked = false;  // locked by resize
	    this.locked = false;  // prevent lost of locked status sets by user
	    this.hidden = false; // rails always hidden
	    this.cursoractive = true; // user can interact with cursors
	
	    this.wheelprevented = false; //prevent mousewheel event
	
	    this.overflowx = opt.overflowx;
	    this.overflowy = opt.overflowy;
	
	    this.nativescrollingarea = false;
	    this.checkarea = 0;
	
	    this.events = []; // event list for unbind
	
	    this.saved = {};  // style saved
	
	    this.delaylist = {};
	    this.synclist = {};
	
	    this.lastdeltax = 0;
	    this.lastdeltay = 0;
	
	    this.detected = getBrowserDetection();
	
	    var cap = $.extend({}, this.detected);
	
	    this.canhwscroll = (cap.hastransform && opt.hwacceleration);
	    this.ishwscroll = (this.canhwscroll && self.haswrapper);
	
	    if (!this.isrtlmode) {
	      this.hasreversehr = false;
	    } else if (this.isvertical) { // RTL mode with reverse horizontal axis
	      this.hasreversehr = !(cap.iswebkit || cap.isie || cap.isie11);
	    } else {
	      this.hasreversehr = !(cap.iswebkit || (cap.isie && !cap.isie10 && !cap.isie11));
	    }
	
	    this.istouchcapable = false; // desktop devices with touch screen support
	
	    //## Check WebKit-based desktop with touch support
	    //## + Firefox 18 nightly build (desktop) false positive (or desktop with touch support)
	
	    if (!cap.cantouch && (cap.hasw3ctouch || cap.hasmstouch)) {  // desktop device with multiple input
	      this.istouchcapable = true;
	    } else if (cap.cantouch && !cap.isios && !cap.isandroid && (cap.iswebkit || cap.ismozilla)) {
	      this.istouchcapable = true;
	    }
	
	    //## disable MouseLock API on user request
	    if (!opt.enablemouselockapi) {
	      cap.hasmousecapture = false;
	      cap.haspointerlock = false;
	    }
	
	    this.debounced = function (name, fn, tm) {
	      if (!self) return;
	      var dd = self.delaylist[name] || false;
	      if (!dd) {
	        self.delaylist[name] = {
	          h: setAnimationFrame(function () {
	            self.delaylist[name].fn.call(self);
	            self.delaylist[name] = false;
	          }, tm)
	        };
	        fn.call(self);
	      }
	      self.delaylist[name].fn = fn;
	    };
	
	
	    this.synched = function (name, fn) {
	      if (self.synclist[name]) self.synclist[name] = fn;
	      else {
	        self.synclist[name] = fn;
	        setAnimationFrame(function () {
	          if (!self) return;
	          self.synclist[name] && self.synclist[name].call(self);
	          self.synclist[name] = null;
	        });
	      }
	    };
	
	    this.unsynched = function (name) {
	      if (self.synclist[name]) self.synclist[name] = false;
	    };
	
	    this.css = function (el, pars) { // save & set
	      for (var n in pars) {
	        self.saved.css.push([el, n, el.css(n)]);
	        el.css(n, pars[n]);
	      }
	    };
	
	    this.scrollTop = function (val) {
	      return (val === undefined) ? self.getScrollTop() : self.setScrollTop(val);
	    };
	
	    this.scrollLeft = function (val) {
	      return (val === undefined) ? self.getScrollLeft() : self.setScrollLeft(val);
	    };
	
	    // derived by by Dan Pupius www.pupius.net
	    var BezierClass = function (st, ed, spd, p1, p2, p3, p4) {
	
	      this.st = st;
	      this.ed = ed;
	      this.spd = spd;
	
	      this.p1 = p1 || 0;
	      this.p2 = p2 || 1;
	      this.p3 = p3 || 0;
	      this.p4 = p4 || 1;
	
	      this.ts = now();
	      this.df = ed - st;
	    };
	    BezierClass.prototype = {
	      B2: function (t) {
	        return 3 * (1 - t) * (1 - t) * t;
	      },
	      B3: function (t) {
	        return 3 * (1 - t) * t * t;
	      },
	      B4: function (t) {
	        return t * t * t;
	      },
	      getPos: function () {
	        return (now() - this.ts) / this.spd;
	      },
	      getNow: function () {
	        var pc = (now() - this.ts) / this.spd;
	        var bz = this.B2(pc) + this.B3(pc) + this.B4(pc);
	        return (pc >= 1) ? this.ed : this.st + (this.df * bz) | 0;
	      },
	      update: function (ed, spd) {
	        this.st = this.getNow();
	        this.ed = ed;
	        this.spd = spd;
	        this.ts = now();
	        this.df = this.ed - this.st;
	        return this;
	      }
	    };
	
	    //derived from http://stackoverflow.com/questions/11236090/
	    function getMatrixValues() {
	      var tr = self.doc.css(cap.trstyle);
	      if (tr && (tr.substr(0, 6) == "matrix")) {
	        return tr.replace(/^.*\((.*)\)$/g, "$1").replace(/px/g, '').split(/, +/);
	      }
	      return false;
	    }
	
	    if (this.ishwscroll) {    // hw accelerated scroll
	
	      this.doc.translate = {
	        x: 0,
	        y: 0,
	        tx: "0px",
	        ty: "0px"
	      };
	
	      //this one can help to enable hw accel on ios6 http://indiegamr.com/ios6-html-hardware-acceleration-changes-and-how-to-fix-them/
	      if (cap.hastranslate3d && cap.isios) this.doc.css("-webkit-backface-visibility", "hidden"); // prevent flickering http://stackoverflow.com/questions/3461441/      
	
	      this.getScrollTop = function (last) {
	        if (!last) {
	          var mtx = getMatrixValues();
	          if (mtx) return (mtx.length == 16) ? -mtx[13] : -mtx[5]; //matrix3d 16 on IE10
	          if (self.timerscroll && self.timerscroll.bz) return self.timerscroll.bz.getNow();
	        }
	        return self.doc.translate.y;
	      };
	
	      this.getScrollLeft = function (last) {
	        if (!last) {
	          var mtx = getMatrixValues();
	          if (mtx) return (mtx.length == 16) ? -mtx[12] : -mtx[4]; //matrix3d 16 on IE10
	          if (self.timerscroll && self.timerscroll.bh) return self.timerscroll.bh.getNow();
	        }
	        return self.doc.translate.x;
	      };
	
	      this.notifyScrollEvent = function (el) {
	        var e = _doc.createEvent("UIEvents");
	        e.initUIEvent("scroll", false, false, _win, 1);
	        e.niceevent = true;
	        el.dispatchEvent(e);
	      };
	
	      var cxscrollleft = (this.isrtlmode) ? 1 : -1;
	
	      if (cap.hastranslate3d && opt.enabletranslate3d) {
	        this.setScrollTop = function (val, silent) {
	          self.doc.translate.y = val;
	          self.doc.translate.ty = (val * -1) + "px";
	          self.doc.css(cap.trstyle, "translate3d(" + self.doc.translate.tx + "," + self.doc.translate.ty + ",0)");
	          if (!silent) self.notifyScrollEvent(self.win[0]);
	        };
	        this.setScrollLeft = function (val, silent) {
	          self.doc.translate.x = val;
	          self.doc.translate.tx = (val * cxscrollleft) + "px";
	          self.doc.css(cap.trstyle, "translate3d(" + self.doc.translate.tx + "," + self.doc.translate.ty + ",0)");
	          if (!silent) self.notifyScrollEvent(self.win[0]);
	        };
	      } else {
	        this.setScrollTop = function (val, silent) {
	          self.doc.translate.y = val;
	          self.doc.translate.ty = (val * -1) + "px";
	          self.doc.css(cap.trstyle, "translate(" + self.doc.translate.tx + "," + self.doc.translate.ty + ")");
	          if (!silent) self.notifyScrollEvent(self.win[0]);
	        };
	        this.setScrollLeft = function (val, silent) {
	          self.doc.translate.x = val;
	          self.doc.translate.tx = (val * cxscrollleft) + "px";
	          self.doc.css(cap.trstyle, "translate(" + self.doc.translate.tx + "," + self.doc.translate.ty + ")");
	          if (!silent) self.notifyScrollEvent(self.win[0]);
	        };
	      }
	    } else {    // native scroll
	
	      this.getScrollTop = function () {
	        return self.docscroll.scrollTop();
	      };
	      this.setScrollTop = function (val) {
	        self.docscroll.scrollTop(val);
	      };
	
	      this.getScrollLeft = function () {
	        var val;
	        if (!self.hasreversehr) {
	          val = self.docscroll.scrollLeft();
	        } else if (self.detected.ismozilla) {
	          val = self.page.maxw - Math.abs(self.docscroll.scrollLeft());
	        } else {
	          val = self.page.maxw - self.docscroll.scrollLeft();
	        }
	        return val;
	      };
	      this.setScrollLeft = function (val) {
	        return setTimeout(function () {
	          if (!self) return;
	          if (self.hasreversehr) {
	            if (self.detected.ismozilla) {
	              val = -(self.page.maxw - val);
	            } else {
	              val = self.page.maxw - val;
	            }
	          }
	          return self.docscroll.scrollLeft(val);
	        }, 1);
	      };
	    }
	
	    this.getTarget = function (e) {
	      if (!e) return false;
	      if (e.target) return e.target;
	      if (e.srcElement) return e.srcElement;
	      return false;
	    };
	
	    this.hasParent = function (e, id) {
	      if (!e) return false;
	      var el = e.target || e.srcElement || e || false;
	      while (el && el.id != id) {
	        el = el.parentNode || false;
	      }
	      return (el !== false);
	    };
	
	    function getZIndex() {
	      var dom = self.win;
	      if ("zIndex" in dom) return dom.zIndex(); // use jQuery UI method when available
	      while (dom.length > 0) {
	        if (dom[0].nodeType == 9) return false;
	        var zi = dom.css('zIndex');
	        if (!isNaN(zi) && zi !== 0) return parseInt(zi);
	        dom = dom.parent();
	      }
	      return false;
	    }
	
	    //inspired by http://forum.jquery.com/topic/width-includes-border-width-when-set-to-thin-medium-thick-in-ie
	    var _convertBorderWidth = {
	      "thin": 1,
	      "medium": 3,
	      "thick": 5
	    };
	
	    function getWidthToPixel(dom, prop, chkheight) {
	      var wd = dom.css(prop);
	      var px = parseFloat(wd);
	      if (isNaN(px)) {
	        px = _convertBorderWidth[wd] || 0;
	        var brd = (px == 3) ? ((chkheight) ? (self.win.outerHeight() - self.win.innerHeight()) : (self.win.outerWidth() - self.win.innerWidth())) : 1; //DON'T TRUST CSS
	        if (self.isie8 && px) px += 1;
	        return (brd) ? px : 0;
	      }
	      return px;
	    }
	
	    this.getDocumentScrollOffset = function () {
	      return {
	        top: _win.pageYOffset || _doc.documentElement.scrollTop,
	        left: _win.pageXOffset || _doc.documentElement.scrollLeft
	      };
	    };
	
	    this.getOffset = function () {
	      if (self.isfixed) {
	        var ofs = self.win.offset();  // fix Chrome auto issue (when right/bottom props only)
	        var scrl = self.getDocumentScrollOffset();
	        ofs.top -= scrl.top;
	        ofs.left -= scrl.left;
	        return ofs;
	      }
	      var ww = self.win.offset();
	      if (!self.viewport) return ww;
	      var vp = self.viewport.offset();
	      return {
	        top: ww.top - vp.top,
	        left: ww.left - vp.left
	      };
	    };
	
	    this.updateScrollBar = function (len) {
	      var pos, off;
	      if (self.ishwscroll) {
	        self.rail.css({
	          height: self.win.innerHeight() - (opt.railpadding.top + opt.railpadding.bottom)
	        });
	        if (self.railh) self.railh.css({
	          width: self.win.innerWidth() - (opt.railpadding.left + opt.railpadding.right)
	        });
	      } else {
	        var wpos = self.getOffset();
	        pos = {
	          top: wpos.top,
	          left: wpos.left - (opt.railpadding.left + opt.railpadding.right)
	        };
	        pos.top += getWidthToPixel(self.win, 'border-top-width', true);
	        pos.left += (self.rail.align) ? self.win.outerWidth() - getWidthToPixel(self.win, 'border-right-width') - self.rail.width : getWidthToPixel(self.win, 'border-left-width');
	
	        off = opt.railoffset;
	        if (off) {
	          if (off.top) pos.top += off.top;
	          if (off.left) pos.left += off.left;
	        }
	
	        if (!self.railslocked) self.rail.css({
	          top: pos.top,
	          left: pos.left,
	          height: ((len) ? len.h : self.win.innerHeight()) - (opt.railpadding.top + opt.railpadding.bottom)
	        });
	
	        if (self.zoom) {
	          self.zoom.css({
	            top: pos.top + 1,
	            left: (self.rail.align == 1) ? pos.left - 20 : pos.left + self.rail.width + 4
	          });
	        }
	
	        if (self.railh && !self.railslocked) {
	          pos = {
	            top: wpos.top,
	            left: wpos.left
	          };
	          off = opt.railhoffset;
	          if (off) {
	            if (off.top) pos.top += off.top;
	            if (off.left) pos.left += off.left;
	          }
	          var y = (self.railh.align) ? pos.top + getWidthToPixel(self.win, 'border-top-width', true) + self.win.innerHeight() - self.railh.height : pos.top + getWidthToPixel(self.win, 'border-top-width', true);
	          var x = pos.left + getWidthToPixel(self.win, 'border-left-width');
	          self.railh.css({
	            top: y - (opt.railpadding.top + opt.railpadding.bottom),
	            left: x,
	            width: self.railh.width
	          });
	        }
	
	      }
	    };
	
	    this.doRailClick = function (e, dbl, hr) {
	      var fn, pg, cur, pos;
	
	      if (self.railslocked) return;
	
	      self.cancelEvent(e);
	
	      if (!("pageY" in e)) {
	        e.pageX = e.clientX + _doc.documentElement.scrollLeft;
	        e.pageY = e.clientY + _doc.documentElement.scrollTop;
	      }
	
	      if (dbl) {
	        fn = (hr) ? self.doScrollLeft : self.doScrollTop;
	        cur = (hr) ? ((e.pageX - self.railh.offset().left - (self.cursorwidth / 2)) * self.scrollratio.x) : ((e.pageY - self.rail.offset().top - (self.cursorheight / 2)) * self.scrollratio.y);
	        self.unsynched("relativexy");
	        fn(cur|0);
	      } else {
	        fn = (hr) ? self.doScrollLeftBy : self.doScrollBy;
	        cur = (hr) ? self.scroll.x : self.scroll.y;
	        pos = (hr) ? e.pageX - self.railh.offset().left : e.pageY - self.rail.offset().top;
	        pg = (hr) ? self.view.w : self.view.h;
	        fn((cur >= pos) ? pg : -pg);
	      }
	
	    };
	
	    self.newscrolly = self.newscrollx = 0;
	
	    self.hasanimationframe = ("requestAnimationFrame" in _win);
	    self.hascancelanimationframe = ("cancelAnimationFrame" in _win);
	
	    self.hasborderbox = false;
	
	    this.init = function () {
	
	      self.saved.css = [];
	
	      if (cap.isoperamini) return true; // SORRY, DO NOT WORK!
	      if (cap.isandroid && !("hidden" in _doc)) return true; // Android 3- SORRY, DO NOT WORK!
	
	      opt.emulatetouch = opt.emulatetouch || opt.touchbehavior;  // mantain compatibility with "touchbehavior"      
	
	      self.hasborderbox = _win.getComputedStyle && (_win.getComputedStyle(_doc.body)['box-sizing'] === "border-box");
	
	      var _scrollyhidden = { 'overflow-y': 'hidden' };
	      if (cap.isie11 || cap.isie10) _scrollyhidden['-ms-overflow-style'] = 'none';  // IE 10 & 11 is always a world apart!
	
	      if (self.ishwscroll) {
	        this.doc.css(cap.transitionstyle, cap.prefixstyle + 'transform 0ms ease-out');
	        if (cap.transitionend) self.bind(self.doc, cap.transitionend, self.onScrollTransitionEnd, false); //I have got to do something usefull!!
	      }
	
	      self.zindex = "auto";
	      if (!self.ispage && opt.zindex == "auto") {
	        self.zindex = getZIndex() || "auto";
	      } else {
	        self.zindex = opt.zindex;
	      }
	
	      if (!self.ispage && self.zindex != "auto" && self.zindex > globalmaxzindex) {
	        globalmaxzindex = self.zindex;
	      }
	
	      if (self.isie && self.zindex === 0 && opt.zindex == "auto") { // fix IE auto == 0
	        self.zindex = "auto";
	      }
	
	      if (!self.ispage || !cap.isieold) {
	
	        var cont = self.docscroll;
	        if (self.ispage) cont = (self.haswrapper) ? self.win : self.doc;
	
	        self.css(cont, _scrollyhidden);
	
	        if (self.ispage && (cap.isie11 || cap.isie)) { // IE 7-11
	          self.css($("html"), _scrollyhidden);
	        }
	
	        if (cap.isios && !self.ispage && !self.haswrapper) self.css($body, {
	          "-webkit-overflow-scrolling": "touch"
	        }); //force hw acceleration
	
	        var cursor = $(_doc.createElement('div'));
	        cursor.css({
	          position: "relative",
	          top: 0,
	          "float": "right",
	          width: opt.cursorwidth,
	          height: 0,
	          'background-color': opt.cursorcolor,
	          border: opt.cursorborder,
	          'background-clip': 'padding-box',
	          '-webkit-border-radius': opt.cursorborderradius,
	          '-moz-border-radius': opt.cursorborderradius,
	          'border-radius': opt.cursorborderradius
	        });
	
	        cursor.addClass('nicescroll-cursors');
	
	        self.cursor = cursor;
	
	        var rail = $(_doc.createElement('div'));
	        rail.attr('id', self.id);
	        rail.addClass('nicescroll-rails nicescroll-rails-vr');
	
	        var v, a, kp = ["left", "right", "top", "bottom"];  //**
	        for (var n in kp) {
	          a = kp[n];
	          v = opt.railpadding[a] || 0;
	          v && rail.css("padding-" + a, v + "px");
	        }
	
	        rail.append(cursor);
	
	        rail.width = Math.max(parseFloat(opt.cursorwidth), cursor.outerWidth());
	        rail.css({
	          width: rail.width + "px",
	          zIndex: self.zindex,
	          background: opt.background,
	          cursor: "default"
	        });
	
	        rail.visibility = true;
	        rail.scrollable = true;
	
	        rail.align = (opt.railalign == "left") ? 0 : 1;
	
	        self.rail = rail;
	
	        self.rail.drag = false;
	
	        var zoom = false;
	        if (opt.boxzoom && !self.ispage && !cap.isieold) {
	          zoom = _doc.createElement('div');
	
	          self.bind(zoom, "click", self.doZoom);
	          self.bind(zoom, "mouseenter", function () {
	            self.zoom.css('opacity', opt.cursoropacitymax);
	          });
	          self.bind(zoom, "mouseleave", function () {
	            self.zoom.css('opacity', opt.cursoropacitymin);
	          });
	
	          self.zoom = $(zoom);
	          self.zoom.css({
	            cursor: "pointer",
	            zIndex: self.zindex,
	            backgroundImage: 'url(' + opt.scriptpath + 'zoomico.png)',
	            height: 18,
	            width: 18,
	            backgroundPosition: '0 0'
	          });
	          if (opt.dblclickzoom) self.bind(self.win, "dblclick", self.doZoom);
	          if (cap.cantouch && opt.gesturezoom) {
	            self.ongesturezoom = function (e) {
	              if (e.scale > 1.5) self.doZoomIn(e);
	              if (e.scale < 0.8) self.doZoomOut(e);
	              return self.cancelEvent(e);
	            };
	            self.bind(self.win, "gestureend", self.ongesturezoom);
	          }
	        }
	
	        // init HORIZ
	
	        self.railh = false;
	        var railh;
	
	        if (opt.horizrailenabled) {
	
	          self.css(cont, {
	            overflowX: 'hidden'
	          });
	
	          cursor = $(_doc.createElement('div'));
	          cursor.css({
	            position: "absolute",
	            top: 0,
	            height: opt.cursorwidth,
	            width: 0,
	            backgroundColor: opt.cursorcolor,
	            border: opt.cursorborder,
	            backgroundClip: 'padding-box',
	            '-webkit-border-radius': opt.cursorborderradius,
	            '-moz-border-radius': opt.cursorborderradius,
	            'border-radius': opt.cursorborderradius
	          });
	
	          if (cap.isieold) cursor.css('overflow', 'hidden');  //IE6 horiz scrollbar issue
	
	          cursor.addClass('nicescroll-cursors');
	
	          self.cursorh = cursor;
	
	          railh = $(_doc.createElement('div'));
	          railh.attr('id', self.id + '-hr');
	          railh.addClass('nicescroll-rails nicescroll-rails-hr');
	          railh.height = Math.max(parseFloat(opt.cursorwidth), cursor.outerHeight());
	          railh.css({
	            height: railh.height + "px",
	            'zIndex': self.zindex,
	            "background": opt.background
	          });
	
	          railh.append(cursor);
	
	          railh.visibility = true;
	          railh.scrollable = true;
	
	          railh.align = (opt.railvalign == "top") ? 0 : 1;
	
	          self.railh = railh;
	
	          self.railh.drag = false;
	
	        }
	
	        if (self.ispage) {
	
	          rail.css({
	            position: "fixed",
	            top: 0,
	            height: "100%"
	          });
	
	          rail.css((rail.align) ? { right: 0 } : { left: 0 });
	
	          self.body.append(rail);
	          if (self.railh) {
	            railh.css({
	              position: "fixed",
	              left: 0,
	              width: "100%"
	            });
	
	            railh.css((railh.align) ? { bottom: 0 } : { top: 0 });
	
	            self.body.append(railh);
	          }
	        } else {
	          if (self.ishwscroll) {
	            if (self.win.css('position') == 'static') self.css(self.win, { 'position': 'relative' });
	            var bd = (self.win[0].nodeName == 'HTML') ? self.body : self.win;
	            $(bd).scrollTop(0).scrollLeft(0);  // fix rail position if content already scrolled
	            if (self.zoom) {
	              self.zoom.css({
	                position: "absolute",
	                top: 1,
	                right: 0,
	                "margin-right": rail.width + 4
	              });
	              bd.append(self.zoom);
	            }
	            rail.css({
	              position: "absolute",
	              top: 0
	            });
	            rail.css((rail.align) ? { right: 0 } : { left: 0 });
	            bd.append(rail);
	            if (railh) {
	              railh.css({
	                position: "absolute",
	                left: 0,
	                bottom: 0
	              });
	              railh.css((railh.align) ? { bottom: 0 } : { top: 0 });
	              bd.append(railh);
	            }
	          } else {
	            self.isfixed = (self.win.css("position") == "fixed");
	            var rlpos = (self.isfixed) ? "fixed" : "absolute";
	
	            if (!self.isfixed) self.viewport = self.getViewport(self.win[0]);
	            if (self.viewport) {
	              self.body = self.viewport;
	              if (!(/fixed|absolute/.test(self.viewport.css("position")))) self.css(self.viewport, {
	                "position": "relative"
	              });
	            }
	
	            rail.css({
	              position: rlpos
	            });
	            if (self.zoom) self.zoom.css({
	              position: rlpos
	            });
	            self.updateScrollBar();
	            self.body.append(rail);
	            if (self.zoom) self.body.append(self.zoom);
	            if (self.railh) {
	              railh.css({
	                position: rlpos
	              });
	              self.body.append(railh);
	            }
	          }
	
	          if (cap.isios) self.css(self.win, {
	            '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
	            '-webkit-touch-callout': 'none'
	          }); // prevent grey layer on click
	
	          if (opt.disableoutline) {
	            if (cap.isie) self.win.attr("hideFocus", "true"); // IE, prevent dotted rectangle on focused div
	            if (cap.iswebkit) self.win.css('outline', 'none');  // Webkit outline
	          }
	
	        }
	
	        if (opt.autohidemode === false) {
	          self.autohidedom = false;
	          self.rail.css({
	            opacity: opt.cursoropacitymax
	          });
	          if (self.railh) self.railh.css({
	            opacity: opt.cursoropacitymax
	          });
	        } else if ((opt.autohidemode === true) || (opt.autohidemode === "leave")) {
	          self.autohidedom = $().add(self.rail);
	          if (cap.isie8) self.autohidedom = self.autohidedom.add(self.cursor);
	          if (self.railh) self.autohidedom = self.autohidedom.add(self.railh);
	          if (self.railh && cap.isie8) self.autohidedom = self.autohidedom.add(self.cursorh);
	        } else if (opt.autohidemode == "scroll") {
	          self.autohidedom = $().add(self.rail);
	          if (self.railh) self.autohidedom = self.autohidedom.add(self.railh);
	        } else if (opt.autohidemode == "cursor") {
	          self.autohidedom = $().add(self.cursor);
	          if (self.railh) self.autohidedom = self.autohidedom.add(self.cursorh);
	        } else if (opt.autohidemode == "hidden") {
	          self.autohidedom = false;
	          self.hide();
	          self.railslocked = false;
	        }
	
	        if (cap.cantouch || self.istouchcapable || opt.emulatetouch || cap.hasmstouch) {
	
	          self.scrollmom = new ScrollMomentumClass2D(self);
	
	          var delayedclick = null;
	
	          self.ontouchstart = function (e) {
	
	            if (self.locked) return false;
	
	            //if (e.pointerType && e.pointerType != 2 && e.pointerType != "touch") return false;
	            if (e.pointerType && (e.pointerType === 'mouse' || e.pointerType === e.MSPOINTER_TYPE_MOUSE)) return false;  // need test on surface!!
	
	            self.hasmoving = false;
	
	            if (self.scrollmom.timer) {
	              self.triggerScrollEnd();
	              self.scrollmom.stop();
	            }
	
	            if (!self.railslocked) {
	              var tg = self.getTarget(e);
	
	              if (tg) {
	                var skp = (/INPUT/i.test(tg.nodeName)) && (/range/i.test(tg.type));
	                if (skp) return self.stopPropagation(e);
	              }
	
	              var ismouse = (e.type === "mousedown");
	
	              if (!("clientX" in e) && ("changedTouches" in e)) {
	                e.clientX = e.changedTouches[0].clientX;
	                e.clientY = e.changedTouches[0].clientY;
	              }
	
	              if (self.forcescreen) {
	                var le = e;
	                e = {
	                  "original": (e.original) ? e.original : e
	                };
	                e.clientX = le.screenX;
	                e.clientY = le.screenY;
	              }
	
	              self.rail.drag = {
	                x: e.clientX,
	                y: e.clientY,
	                sx: self.scroll.x,
	                sy: self.scroll.y,
	                st: self.getScrollTop(),
	                sl: self.getScrollLeft(),
	                pt: 2,
	                dl: false,
	                tg: tg
	              };
	
	              if (self.ispage || !opt.directionlockdeadzone) {
	
	                self.rail.drag.dl = "f";
	
	              } else {
	
	                var view = {
	                  w: $window.width(),
	                  h: $window.height()
	                };
	
	                var page = self.getContentSize();
	
	                var maxh = page.h - view.h;
	                var maxw = page.w - view.w;
	
	                if (self.rail.scrollable && !self.railh.scrollable) self.rail.drag.ck = (maxh > 0) ? "v" : false;
	                else if (!self.rail.scrollable && self.railh.scrollable) self.rail.drag.ck = (maxw > 0) ? "h" : false;
	                else self.rail.drag.ck = false;
	
	              }
	
	              if (opt.emulatetouch && self.isiframe && cap.isie) {
	                var wp = self.win.position();
	                self.rail.drag.x += wp.left;
	                self.rail.drag.y += wp.top;
	              }
	
	              self.hasmoving = false;
	              self.lastmouseup = false;
	              self.scrollmom.reset(e.clientX, e.clientY);
	
	              if (tg&&ismouse) {
	
	                var ip = /INPUT|SELECT|BUTTON|TEXTAREA/i.test(tg.nodeName);
	                if (!ip) {
	                  if (cap.hasmousecapture) tg.setCapture();
	                  if (opt.emulatetouch) {
	                    if (tg.onclick && !(tg._onclick || false)) { // intercept DOM0 onclick event
	                      tg._onclick = tg.onclick;
	                      tg.onclick = function (e) {
	                        if (self.hasmoving) return false;
	                        tg._onclick.call(this, e);
	                      };
	                    }
	                    return self.cancelEvent(e);
	                  }
	                  return self.stopPropagation(e);
	                }
	
	                if (/SUBMIT|CANCEL|BUTTON/i.test($(tg).attr('type'))) {
	                  self.preventclick = {
	                    "tg": tg,
	                    "click": false
	                  };
	                }
	
	              }
	            }
	
	          };
	
	          self.ontouchend = function (e) {
	
	            if (!self.rail.drag) return true;
	
	            if (self.rail.drag.pt == 2) {
	              //if (e.pointerType && e.pointerType != 2 && e.pointerType != "touch") return false;
	              if (e.pointerType && (e.pointerType === 'mouse' || e.pointerType === e.MSPOINTER_TYPE_MOUSE)) return false;
	
	              self.rail.drag = false;
	
	              var ismouse = (e.type === "mouseup");
	
	              if (self.hasmoving) {
	                self.scrollmom.doMomentum();
	                self.lastmouseup = true;
	                self.hideCursor();
	                if (cap.hasmousecapture) _doc.releaseCapture();
	                if (ismouse) return self.cancelEvent(e);
	              }
	
	            }
	            else if (self.rail.drag.pt == 1) {
	              return self.onmouseup(e);
	            }
	
	          };
	
	          var moveneedoffset = (opt.emulatetouch && self.isiframe && !cap.hasmousecapture);
	
	          var locktollerance = opt.directionlockdeadzone * 0.3 | 0;
	
	          self.ontouchmove = function (e, byiframe) {
	
	            if (!self.rail.drag) return true;
	
	            if (e.targetTouches && opt.preventmultitouchscrolling) {
	              if (e.targetTouches.length > 1) return true; // multitouch
	            }
	
	            //if (e.pointerType && e.pointerType != 2 && e.pointerType != "touch") return false;
	            if (e.pointerType && (e.pointerType === 'mouse' || e.pointerType === e.MSPOINTER_TYPE_MOUSE)) return true;
	
	            if (self.rail.drag.pt == 2) {
	
	              if (("changedTouches" in e)) {
	                e.clientX = e.changedTouches[0].clientX;
	                e.clientY = e.changedTouches[0].clientY;
	              }
	
	              var ofy, ofx;
	              ofx = ofy = 0;
	
	              if (moveneedoffset && !byiframe) {
	                var wp = self.win.position();
	                ofx = -wp.left;
	                ofy = -wp.top;
	              }
	
	              var fy = e.clientY + ofy;
	              var my = (fy - self.rail.drag.y);
	              var fx = e.clientX + ofx;
	              var mx = (fx - self.rail.drag.x);
	
	              var ny = self.rail.drag.st - my;
	
	              if (self.ishwscroll && opt.bouncescroll) {
	                if (ny < 0) {
	                  ny = Math.round(ny / 2);
	                } else if (ny > self.page.maxh) {
	                  ny = self.page.maxh + Math.round((ny - self.page.maxh) / 2);
	                }
	              } else {
	                if (ny < 0) {
	                  ny = 0;
	                  fy = 0;
	                }
	                else if (ny > self.page.maxh) {
	                  ny = self.page.maxh;
	                  fy = 0;
	                }
	                if (fy === 0 && !self.hasmoving) {
	                  if (!self.ispage) self.rail.drag = false;
	                  return true;
	                }
	              }
	
	              var nx = self.getScrollLeft();
	
	              if (self.railh && self.railh.scrollable) {
	                nx = (self.isrtlmode) ? mx - self.rail.drag.sl : self.rail.drag.sl - mx;
	
	                if (self.ishwscroll && opt.bouncescroll) {
	                  if (nx < 0) {
	                    nx = Math.round(nx / 2);
	                  } else if (nx > self.page.maxw) {
	                    nx = self.page.maxw + Math.round((nx - self.page.maxw) / 2);
	                  }
	                } else {
	                  if (nx < 0) {
	                    nx = 0;
	                    fx = 0;
	                  }
	                  if (nx > self.page.maxw) {
	                    nx = self.page.maxw;
	                    fx = 0;
	                  }
	                }
	
	              }
	
	
	              if (!self.hasmoving) {
	
	                if (self.rail.drag.y === e.clientY && self.rail.drag.x === e.clientX) return self.cancelEvent(e);  // prevent first useless move event 
	
	                var ay = Math.abs(my);
	                var ax = Math.abs(mx);
	                var dz = opt.directionlockdeadzone;
	
	                if (!self.rail.drag.ck) {
	                  if (ay > dz && ax > dz) self.rail.drag.dl = "f";
	                  else if (ay > dz) self.rail.drag.dl = (ax > locktollerance) ? "f" : "v";
	                  else if (ax > dz) self.rail.drag.dl = (ay > locktollerance) ? "f" : "h";
	                }
	                else if (self.rail.drag.ck == "v") {
	                  if (ax > dz && ay <= locktollerance) {
	                    self.rail.drag = false;
	                  }
	                  else if (ay > dz) self.rail.drag.dl = "v";
	
	                }
	                else if (self.rail.drag.ck == "h") {
	
	                  if (ay > dz && ax <= locktollerance) {
	                    self.rail.drag = false;
	                  }
	                  else if (ax > dz) self.rail.drag.dl = "h";
	
	                }
	
	                if (!self.rail.drag.dl) return self.cancelEvent(e);
	
	                self.triggerScrollStart(e.clientX, e.clientY, 0, 0, 0);
	                self.hasmoving = true;
	              }
	
	              if (self.preventclick && !self.preventclick.click) {
	                self.preventclick.click = self.preventclick.tg.onclick || false;
	                self.preventclick.tg.onclick = self.onpreventclick;
	              }
	
	              if (self.rail.drag.dl) {
	                if (self.rail.drag.dl == "v") nx = self.rail.drag.sl;
	                else if (self.rail.drag.dl == "h") ny = self.rail.drag.st;
	              }
	
	              self.synched("touchmove", function () {
	                if (self.rail.drag && (self.rail.drag.pt == 2)) {
	                  if (self.prepareTransition) self.resetTransition();
	                  if (self.rail.scrollable) self.setScrollTop(ny);
	                  self.scrollmom.update(fx, fy);
	                  if (self.railh && self.railh.scrollable) {
	                    self.setScrollLeft(nx);
	                    self.showCursor(ny, nx);
	                  } else {
	                    self.showCursor(ny);
	                  }
	                  if (cap.isie10) _doc.selection.clear();
	                }
	              });
	
	              return self.cancelEvent(e);
	
	            }
	            else if (self.rail.drag.pt == 1) { // drag on cursor
	              return self.onmousemove(e);
	            }
	
	          };
	
	          self.ontouchstartCursor = function (e, hronly) {
	            if (self.rail.drag && self.rail.drag.pt != 3) return;
	            if (self.locked) return self.cancelEvent(e);
	            self.cancelScroll();
	            self.rail.drag = {
	              x: e.touches[0].clientX,
	              y: e.touches[0].clientY,
	              sx: self.scroll.x,
	              sy: self.scroll.y,
	              pt: 3,
	              hr: (!!hronly)
	            };
	            var tg = self.getTarget(e);
	            if (!self.ispage && cap.hasmousecapture) tg.setCapture();
	            if (self.isiframe && !cap.hasmousecapture) {
	              self.saved.csspointerevents = self.doc.css("pointer-events");
	              self.css(self.doc, { "pointer-events": "none" });
	            }
	            return self.cancelEvent(e);
	          };
	
	          self.ontouchendCursor = function (e) {
	            if (self.rail.drag) {
	              if (cap.hasmousecapture) _doc.releaseCapture();
	              if (self.isiframe && !cap.hasmousecapture) self.doc.css("pointer-events", self.saved.csspointerevents);
	              if (self.rail.drag.pt != 3) return;
	              self.rail.drag = false;
	              return self.cancelEvent(e);
	            }
	          };
	
	          self.ontouchmoveCursor = function (e) {
	            if (self.rail.drag) {
	              if (self.rail.drag.pt != 3) return;
	
	              self.cursorfreezed = true;
	
	              if (self.rail.drag.hr) {
	                self.scroll.x = self.rail.drag.sx + (e.touches[0].clientX - self.rail.drag.x);
	                if (self.scroll.x < 0) self.scroll.x = 0;
	                var mw = self.scrollvaluemaxw;
	                if (self.scroll.x > mw) self.scroll.x = mw;
	              } else {
	                self.scroll.y = self.rail.drag.sy + (e.touches[0].clientY - self.rail.drag.y);
	                if (self.scroll.y < 0) self.scroll.y = 0;
	                var my = self.scrollvaluemax;
	                if (self.scroll.y > my) self.scroll.y = my;
	              }
	
	              self.synched('touchmove', function () {
	                if (self.rail.drag && (self.rail.drag.pt == 3)) {
	                  self.showCursor();
	                  if (self.rail.drag.hr) self.doScrollLeft(Math.round(self.scroll.x * self.scrollratio.x), opt.cursordragspeed);
	                  else self.doScrollTop(Math.round(self.scroll.y * self.scrollratio.y), opt.cursordragspeed);
	                }
	              });
	
	              return self.cancelEvent(e);
	            }
	
	          };
	
	        }
	
	        self.onmousedown = function (e, hronly) {
	          if (self.rail.drag && self.rail.drag.pt != 1) return;
	          if (self.railslocked) return self.cancelEvent(e);
	          self.cancelScroll();
	          self.rail.drag = {
	            x: e.clientX,
	            y: e.clientY,
	            sx: self.scroll.x,
	            sy: self.scroll.y,
	            pt: 1,
	            hr: hronly || false
	          };
	          var tg = self.getTarget(e);
	
	          if (cap.hasmousecapture) tg.setCapture();
	          if (self.isiframe && !cap.hasmousecapture) {
	            self.saved.csspointerevents = self.doc.css("pointer-events");
	            self.css(self.doc, {
	              "pointer-events": "none"
	            });
	          }
	          self.hasmoving = false;
	          return self.cancelEvent(e);
	        };
	
	        self.onmouseup = function (e) {
	          if (self.rail.drag) {
	            if (self.rail.drag.pt != 1) return true;
	
	            if (cap.hasmousecapture) _doc.releaseCapture();
	            if (self.isiframe && !cap.hasmousecapture) self.doc.css("pointer-events", self.saved.csspointerevents);
	            self.rail.drag = false;
	            self.cursorfreezed = false;
	            if (self.hasmoving) self.triggerScrollEnd();
	            return self.cancelEvent(e);
	          }
	        };
	
	        self.onmousemove = function (e) {
	          if (self.rail.drag) {
	            if (self.rail.drag.pt !== 1) return;
	
	            if (cap.ischrome && e.which === 0) return self.onmouseup(e);
	
	            self.cursorfreezed = true;
	
	            if (!self.hasmoving) self.triggerScrollStart(e.clientX, e.clientY, 0, 0, 0);
	
	            self.hasmoving = true;
	
	            if (self.rail.drag.hr) {
	              self.scroll.x = self.rail.drag.sx + (e.clientX - self.rail.drag.x);
	              if (self.scroll.x < 0) self.scroll.x = 0;
	              var mw = self.scrollvaluemaxw;
	              if (self.scroll.x > mw) self.scroll.x = mw;
	            } else {
	              self.scroll.y = self.rail.drag.sy + (e.clientY - self.rail.drag.y);
	              if (self.scroll.y < 0) self.scroll.y = 0;
	              var my = self.scrollvaluemax;
	              if (self.scroll.y > my) self.scroll.y = my;
	            }
	
	            self.synched('mousemove', function () {
	
	              if (self.cursorfreezed) {
	                self.showCursor();
	
	                if (self.rail.drag.hr) {
	                  self.scrollLeft(Math.round(self.scroll.x * self.scrollratio.x));
	                } else {
	                  self.scrollTop(Math.round(self.scroll.y * self.scrollratio.y));
	                }
	
	              }
	            });
	
	            return self.cancelEvent(e);
	          }
	          else {
	            self.checkarea = 0;
	          }
	        };
	
	        if (cap.cantouch || opt.emulatetouch) {
	
	          self.onpreventclick = function (e) {
	            if (self.preventclick) {
	              self.preventclick.tg.onclick = self.preventclick.click;
	              self.preventclick = false;
	              return self.cancelEvent(e);
	            }
	          };
	
	          self.onclick = (cap.isios) ? false : function (e) {  // it needs to check IE11 ???
	            if (self.lastmouseup) {
	              self.lastmouseup = false;
	              return self.cancelEvent(e);
	            } else {
	              return true;
	            }
	          };
	
	          if (opt.grabcursorenabled && cap.cursorgrabvalue) {
	            self.css((self.ispage) ? self.doc : self.win, {
	              'cursor': cap.cursorgrabvalue
	            });
	            self.css(self.rail, {
	              'cursor': cap.cursorgrabvalue
	            });
	          }
	
	        } else {
	
	          var checkSelectionScroll = function (e) {
	            if (!self.selectiondrag) return;
	
	            if (e) {
	              var ww = self.win.outerHeight();
	              var df = (e.pageY - self.selectiondrag.top);
	              if (df > 0 && df < ww) df = 0;
	              if (df >= ww) df -= ww;
	              self.selectiondrag.df = df;
	            }
	            if (self.selectiondrag.df === 0) return;
	
	            var rt = -(self.selectiondrag.df*2/6)|0;
	            self.doScrollBy(rt);
	
	            self.debounced("doselectionscroll", function () {
	              checkSelectionScroll();
	            }, 50);
	          };
	
	          if ("getSelection" in _doc) { // A grade - Major browsers
	            self.hasTextSelected = function () {
	              return (_doc.getSelection().rangeCount > 0);
	            };
	          } else if ("selection" in _doc) { //IE9-
	            self.hasTextSelected = function () {
	              return (_doc.selection.type != "None");
	            };
	          } else {
	            self.hasTextSelected = function () { // no support
	              return false;
	            };
	          }
	
	          self.onselectionstart = function (e) {
	            //  More testing - severe chrome issues           
	            /* 
	                          if (!self.haswrapper&&(e.which&&e.which==2)) {  // fool browser to manage middle button scrolling
	                            self.win.css({'overflow':'auto'});
	                            setTimeout(function(){
	                              self.win.css({'overflow':'hidden'});
	                            },10);                
	                            return true;
	                          }            
	            */
	            if (self.ispage) return;
	            self.selectiondrag = self.win.offset();
	          };
	
	          self.onselectionend = function (e) {
	            self.selectiondrag = false;
	          };
	          self.onselectiondrag = function (e) {
	            if (!self.selectiondrag) return;
	            if (self.hasTextSelected()) self.debounced("selectionscroll", function () {
	              checkSelectionScroll(e);
	            }, 250);
	          };
	        }
	
	        if (cap.hasw3ctouch) { //IE11+
	          self.css((self.ispage) ? $("html") : self.win, { 'touch-action': 'none' });
	          self.css(self.rail, {
	            'touch-action': 'none'
	          });
	          self.css(self.cursor, {
	            'touch-action': 'none'
	          });
	          self.bind(self.win, "pointerdown", self.ontouchstart);
	          self.bind(_doc, "pointerup", self.ontouchend);
	          self.delegate(_doc, "pointermove", self.ontouchmove);
	        } else if (cap.hasmstouch) { //IE10
	          self.css((self.ispage) ? $("html") : self.win, { '-ms-touch-action': 'none' });
	          self.css(self.rail, {
	            '-ms-touch-action': 'none'
	          });
	          self.css(self.cursor, {
	            '-ms-touch-action': 'none'
	          });
	          self.bind(self.win, "MSPointerDown", self.ontouchstart);
	          self.bind(_doc, "MSPointerUp", self.ontouchend);
	          self.delegate(_doc, "MSPointerMove", self.ontouchmove);
	          self.bind(self.cursor, "MSGestureHold", function (e) {
	            e.preventDefault();
	          });
	          self.bind(self.cursor, "contextmenu", function (e) {
	            e.preventDefault();
	          });
	        } else if (cap.cantouch) { // smartphones/touch devices
	          self.bind(self.win, "touchstart", self.ontouchstart, false, true);
	          self.bind(_doc, "touchend", self.ontouchend, false, true);
	          self.bind(_doc, "touchcancel", self.ontouchend, false, true);
	          self.delegate(_doc, "touchmove", self.ontouchmove, false, true);
	        }
	
	        if (opt.emulatetouch) {
	          self.bind(self.win, "mousedown", self.ontouchstart, false, true);
	          self.bind(_doc, "mouseup", self.ontouchend, false, true);
	          self.bind(_doc, "mousemove", self.ontouchmove, false, true);
	        }
	
	        if (opt.cursordragontouch || (!cap.cantouch && !opt.emulatetouch)) {
	
	          self.rail.css({
	            cursor: "default"
	          });
	          self.railh && self.railh.css({
	            cursor: "default"
	          });
	
	          self.jqbind(self.rail, "mouseenter", function () {
	            if (!self.ispage && !self.win.is(":visible")) return false;
	            if (self.canshowonmouseevent) self.showCursor();
	            self.rail.active = true;
	          });
	          self.jqbind(self.rail, "mouseleave", function () {
	            self.rail.active = false;
	            if (!self.rail.drag) self.hideCursor();
	          });
	
	          if (opt.sensitiverail) {
	            self.bind(self.rail, "click", function (e) {
	              self.doRailClick(e, false, false);
	            });
	            self.bind(self.rail, "dblclick", function (e) {
	              self.doRailClick(e, true, false);
	            });
	            self.bind(self.cursor, "click", function (e) {
	              self.cancelEvent(e);
	            });
	            self.bind(self.cursor, "dblclick", function (e) {
	              self.cancelEvent(e);
	            });
	          }
	
	          if (self.railh) {
	            self.jqbind(self.railh, "mouseenter", function () {
	              if (!self.ispage && !self.win.is(":visible")) return false;
	              if (self.canshowonmouseevent) self.showCursor();
	              self.rail.active = true;
	            });
	            self.jqbind(self.railh, "mouseleave", function () {
	              self.rail.active = false;
	              if (!self.rail.drag) self.hideCursor();
	            });
	
	            if (opt.sensitiverail) {
	              self.bind(self.railh, "click", function (e) {
	                self.doRailClick(e, false, true);
	              });
	              self.bind(self.railh, "dblclick", function (e) {
	                self.doRailClick(e, true, true);
	              });
	              self.bind(self.cursorh, "click", function (e) {
	                self.cancelEvent(e);
	              });
	              self.bind(self.cursorh, "dblclick", function (e) {
	                self.cancelEvent(e);
	              });
	            }
	
	          }
	
	        }
	
	        if (opt.cursordragontouch && (this.istouchcapable || cap.cantouch)) {
	          self.bind(self.cursor, "touchstart", self.ontouchstartCursor);
	          self.bind(self.cursor, "touchmove", self.ontouchmoveCursor);
	          self.bind(self.cursor, "touchend", self.ontouchendCursor);
	          self.cursorh && self.bind(self.cursorh, "touchstart", function (e) {
	            self.ontouchstartCursor(e, true);
	          });
	          self.cursorh && self.bind(self.cursorh, "touchmove", self.ontouchmoveCursor);
	          self.cursorh && self.bind(self.cursorh, "touchend", self.ontouchendCursor);
	        }
	
	//        if (!cap.cantouch && !opt.emulatetouch) {
	        if (!opt.emulatetouch && !cap.isandroid && !cap.isios) {
	
	          self.bind((cap.hasmousecapture) ? self.win : _doc, "mouseup", self.onmouseup);
	          self.bind(_doc, "mousemove", self.onmousemove);
	          if (self.onclick) self.bind(_doc, "click", self.onclick);
	
	          self.bind(self.cursor, "mousedown", self.onmousedown);
	          self.bind(self.cursor, "mouseup", self.onmouseup);
	
	          if (self.railh) {
	            self.bind(self.cursorh, "mousedown", function (e) {
	              self.onmousedown(e, true);
	            });
	            self.bind(self.cursorh, "mouseup", self.onmouseup);
	          }
	
	          if (!self.ispage && opt.enablescrollonselection) {
	            self.bind(self.win[0], "mousedown", self.onselectionstart);
	            self.bind(_doc, "mouseup", self.onselectionend);
	            self.bind(self.cursor, "mouseup", self.onselectionend);
	            if (self.cursorh) self.bind(self.cursorh, "mouseup", self.onselectionend);
	            self.bind(_doc, "mousemove", self.onselectiondrag);
	          }
	
	          if (self.zoom) {
	            self.jqbind(self.zoom, "mouseenter", function () {
	              if (self.canshowonmouseevent) self.showCursor();
	              self.rail.active = true;
	            });
	            self.jqbind(self.zoom, "mouseleave", function () {
	              self.rail.active = false;
	              if (!self.rail.drag) self.hideCursor();
	            });
	          }
	
	        } else {
	
	          self.bind((cap.hasmousecapture) ? self.win : _doc, "mouseup", self.ontouchend);
	          if (self.onclick) self.bind(_doc, "click", self.onclick);
	
	          if (opt.cursordragontouch) {
	            self.bind(self.cursor, "mousedown", self.onmousedown);
	            self.bind(self.cursor, "mouseup", self.onmouseup);
	            self.cursorh && self.bind(self.cursorh, "mousedown", function (e) {
	              self.onmousedown(e, true);
	            });
	            self.cursorh && self.bind(self.cursorh, "mouseup", self.onmouseup);
	          } else {
	            self.bind(self.rail, "mousedown", function (e) { e.preventDefault(); });  // prevent text selection             
	            self.railh && self.bind(self.railh, "mousedown", function (e) { e.preventDefault(); });
	          }
	
	        }
	
	
	        if (opt.enablemousewheel) {
	          if (!self.isiframe) self.mousewheel((cap.isie && self.ispage) ? _doc : self.win, self.onmousewheel);
	          self.mousewheel(self.rail, self.onmousewheel);
	          if (self.railh) self.mousewheel(self.railh, self.onmousewheelhr);
	        }
	
	        if (!self.ispage && !cap.cantouch && !(/HTML|^BODY/.test(self.win[0].nodeName))) {
	          if (!self.win.attr("tabindex")) self.win.attr({
	            "tabindex": ++tabindexcounter
	          });
	
	          self.bind(self.win, "focus", function (e) {  // better using native events
	            domfocus = (self.getTarget(e)).id || self.getTarget(e) || false;
	            self.hasfocus = true;
	            if (self.canshowonmouseevent) self.noticeCursor();
	          });
	          self.bind(self.win, "blur", function (e) {  // *
	            domfocus = false;
	            self.hasfocus = false;
	          });
	
	          self.bind(self.win, "mouseenter", function (e) {   // *
	            mousefocus = (self.getTarget(e)).id || self.getTarget(e) || false;
	            self.hasmousefocus = true;
	            if (self.canshowonmouseevent) self.noticeCursor();
	          });
	          self.bind(self.win, "mouseleave", function (e) {   // *       
	            mousefocus = false;
	            self.hasmousefocus = false;
	            if (!self.rail.drag) self.hideCursor();
	          });
	
	        }
	
	
	        //Thanks to http://www.quirksmode.org !!
	        self.onkeypress = function (e) {
	          if (self.railslocked && self.page.maxh === 0) return true;
	
	          e = e || _win.event;
	          var tg = self.getTarget(e);
	          if (tg && /INPUT|TEXTAREA|SELECT|OPTION/.test(tg.nodeName)) {
	            var tp = tg.getAttribute('type') || tg.type || false;
	            if ((!tp) || !(/submit|button|cancel/i.tp)) return true;
	          }
	
	          if ($(tg).attr('contenteditable')) return true;
	
	          if (self.hasfocus || (self.hasmousefocus && !domfocus) || (self.ispage && !domfocus && !mousefocus)) {
	            var key = e.keyCode;
	
	            if (self.railslocked && key != 27) return self.cancelEvent(e);
	
	            var ctrl = e.ctrlKey || false;
	            var shift = e.shiftKey || false;
	
	            var ret = false;
	            switch (key) {
	              case 38:
	              case 63233: //safari
	                self.doScrollBy(24 * 3);
	                ret = true;
	                break;
	              case 40:
	              case 63235: //safari
	                self.doScrollBy(-24 * 3);
	                ret = true;
	                break;
	              case 37:
	              case 63232: //safari
	                if (self.railh) {
	                  (ctrl) ? self.doScrollLeft(0) : self.doScrollLeftBy(24 * 3);
	                  ret = true;
	                }
	                break;
	              case 39:
	              case 63234: //safari
	                if (self.railh) {
	                  (ctrl) ? self.doScrollLeft(self.page.maxw) : self.doScrollLeftBy(-24 * 3);
	                  ret = true;
	                }
	                break;
	              case 33:
	              case 63276: // safari
	                self.doScrollBy(self.view.h);
	                ret = true;
	                break;
	              case 34:
	              case 63277: // safari
	                self.doScrollBy(-self.view.h);
	                ret = true;
	                break;
	              case 36:
	              case 63273: // safari                
	                (self.railh && ctrl) ? self.doScrollPos(0, 0) : self.doScrollTo(0);
	                ret = true;
	                break;
	              case 35:
	              case 63275: // safari
	                (self.railh && ctrl) ? self.doScrollPos(self.page.maxw, self.page.maxh) : self.doScrollTo(self.page.maxh);
	                ret = true;
	                break;
	              case 32:
	                if (opt.spacebarenabled) {
	                  (shift) ? self.doScrollBy(self.view.h) : self.doScrollBy(-self.view.h);
	                  ret = true;
	                }
	                break;
	              case 27: // ESC
	                if (self.zoomactive) {
	                  self.doZoom();
	                  ret = true;
	                }
	                break;
	            }
	            if (ret) return self.cancelEvent(e);
	          }
	        };
	
	        if (opt.enablekeyboard) self.bind(_doc, (cap.isopera && !cap.isopera12) ? "keypress" : "keydown", self.onkeypress);
	
	        self.bind(_doc, "keydown", function (e) {
	          var ctrl = e.ctrlKey || false;
	          if (ctrl) self.wheelprevented = true;
	        });
	        self.bind(_doc, "keyup", function (e) {
	          var ctrl = e.ctrlKey || false;
	          if (!ctrl) self.wheelprevented = false;
	        });
	        self.bind(_win, "blur", function (e) {
	          self.wheelprevented = false;
	        });
	
	        self.bind(_win, 'resize', self.onscreenresize);
	        self.bind(_win, 'orientationchange', self.onscreenresize);
	
	        self.bind(_win, "load", self.lazyResize);
	
	        if (cap.ischrome && !self.ispage && !self.haswrapper) { //chrome void scrollbar bug - it persists in version 26
	          var tmp = self.win.attr("style");
	          var ww = parseFloat(self.win.css("width")) + 1;
	          self.win.css('width', ww);
	          self.synched("chromefix", function () {
	            self.win.attr("style", tmp);
	          });
	        }
	
	
	        // Trying a cross-browser implementation - good luck!
	
	        self.onAttributeChange = function (e) {
	          self.lazyResize(self.isieold ? 250 : 30);
	        };
	
	        if (opt.enableobserver) {
	
	          if ((!self.isie11) && (ClsMutationObserver !== false)) {  // IE11 crashes  #568
	            self.observerbody = new ClsMutationObserver(function (mutations) {
	              mutations.forEach(function (mut) {
	                if (mut.type == "attributes") {
	                  return ($body.hasClass("modal-open") && $body.hasClass("modal-dialog") && !$.contains($('.modal-dialog')[0], self.doc[0])) ? self.hide() : self.show();  // Support for Bootstrap modal; Added check if the nice scroll element is inside a modal
	                }
	              });
	              if (self.me.clientWidth != self.page.width || self.me.clientHeight != self.page.height) return self.lazyResize(30);
	            });
	            self.observerbody.observe(_doc.body, {
	              childList: true,
	              subtree: true,
	              characterData: false,
	              attributes: true,
	              attributeFilter: ['class']
	            });
	          }
	
	          if (!self.ispage && !self.haswrapper) {
	
	            var _dom = self.win[0];
	
	            // redesigned MutationObserver for Chrome18+/Firefox14+/iOS6+ with support for: remove div, add/remove content
	            if (ClsMutationObserver !== false) {
	              self.observer = new ClsMutationObserver(function (mutations) {
	                mutations.forEach(self.onAttributeChange);
	              });
	              self.observer.observe(_dom, {
	                childList: true,
	                characterData: false,
	                attributes: true,
	                subtree: false
	              });
	              self.observerremover = new ClsMutationObserver(function (mutations) {
	                mutations.forEach(function (mo) {
	                  if (mo.removedNodes.length > 0) {
	                    for (var dd in mo.removedNodes) {
	                      if (!!self && (mo.removedNodes[dd] === _dom)) return self.remove();
	                    }
	                  }
	                });
	              });
	              self.observerremover.observe(_dom.parentNode, {
	                childList: true,
	                characterData: false,
	                attributes: false,
	                subtree: false
	              });
	            } else {
	              self.bind(_dom, (cap.isie && !cap.isie9) ? "propertychange" : "DOMAttrModified", self.onAttributeChange);
	              if (cap.isie9) _dom.attachEvent("onpropertychange", self.onAttributeChange); //IE9 DOMAttrModified bug
	              self.bind(_dom, "DOMNodeRemoved", function (e) {
	                if (e.target === _dom) self.remove();
	              });
	            }
	          }
	
	        }
	
	        //
	
	        if (!self.ispage && opt.boxzoom) self.bind(_win, "resize", self.resizeZoom);
	        if (self.istextarea) {
	          self.bind(self.win, "keydown", self.lazyResize);
	          self.bind(self.win, "mouseup", self.lazyResize);
	        }
	
	        self.lazyResize(30);
	
	      }
	
	      if (this.doc[0].nodeName == 'IFRAME') {
	        var oniframeload = function () {
	          self.iframexd = false;
	          var doc;
	          try {
	            doc = 'contentDocument' in this ? this.contentDocument : this.contentWindow._doc;
	            var a = doc.domain;
	          } catch (e) {
	            self.iframexd = true;
	            doc = false;
	          }
	
	          if (self.iframexd) {
	            if ("console" in _win) console.log('NiceScroll error: policy restriced iframe');
	            return true; //cross-domain - I can't manage this        
	          }
	
	          self.forcescreen = true;
	
	          if (self.isiframe) {
	            self.iframe = {
	              "doc": $(doc),
	              "html": self.doc.contents().find('html')[0],
	              "body": self.doc.contents().find('body')[0]
	            };
	            self.getContentSize = function () {
	              return {
	                w: Math.max(self.iframe.html.scrollWidth, self.iframe.body.scrollWidth),
	                h: Math.max(self.iframe.html.scrollHeight, self.iframe.body.scrollHeight)
	              };
	            };
	            self.docscroll = $(self.iframe.body);
	          }
	
	          if (!cap.isios && opt.iframeautoresize && !self.isiframe) {
	            self.win.scrollTop(0); // reset position
	            self.doc.height(""); //reset height to fix browser bug
	            var hh = Math.max(doc.getElementsByTagName('html')[0].scrollHeight, doc.body.scrollHeight);
	            self.doc.height(hh);
	          }
	          self.lazyResize(30);
	
	          self.css($(self.iframe.body), _scrollyhidden);
	
	          if (cap.isios && self.haswrapper) {
	            self.css($(doc.body), {
	              '-webkit-transform': 'translate3d(0,0,0)'
	            }); // avoid iFrame content clipping - thanks to http://blog.derraab.com/2012/04/02/avoid-iframe-content-clipping-with-css-transform-on-ios/
	          }
	
	          if ('contentWindow' in this) {
	            self.bind(this.contentWindow, "scroll", self.onscroll); //IE8 & minor
	          } else {
	            self.bind(doc, "scroll", self.onscroll);
	          }
	
	          if (opt.enablemousewheel) {
	            self.mousewheel(doc, self.onmousewheel);
	          }
	
	          if (opt.enablekeyboard) self.bind(doc, (cap.isopera) ? "keypress" : "keydown", self.onkeypress);
	
	          if (cap.cantouch) {
	            self.bind(doc, "touchstart", self.ontouchstart);
	            self.bind(doc, "touchmove", self.ontouchmove);
	          }
	          else if (opt.emulatetouch) {
	            self.bind(doc, "mousedown", self.ontouchstart);
	            self.bind(doc, "mousemove", function (e) {
	              return self.ontouchmove(e, true);
	            });
	            if (opt.grabcursorenabled && cap.cursorgrabvalue) self.css($(doc.body), {
	              'cursor': cap.cursorgrabvalue
	            });
	          }
	
	          self.bind(doc, "mouseup", self.ontouchend);
	
	          if (self.zoom) {
	            if (opt.dblclickzoom) self.bind(doc, 'dblclick', self.doZoom);
	            if (self.ongesturezoom) self.bind(doc, "gestureend", self.ongesturezoom);
	          }
	        };
	
	        if (this.doc[0].readyState && this.doc[0].readyState === "complete") {
	          setTimeout(function () {
	            oniframeload.call(self.doc[0], false);
	          }, 500);
	        }
	        self.bind(this.doc, "load", oniframeload);
	
	      }
	
	    };
	
	    this.showCursor = function (py, px) {
	      if (self.cursortimeout) {
	        clearTimeout(self.cursortimeout);
	        self.cursortimeout = 0;
	      }
	      if (!self.rail) return;
	      if (self.autohidedom) {
	        self.autohidedom.stop().css({
	          opacity: opt.cursoropacitymax
	        });
	        self.cursoractive = true;
	      }
	
	      if (!self.rail.drag || self.rail.drag.pt != 1) {
	        if (py !== undefined && py !== false) {
	          self.scroll.y = (py / self.scrollratio.y) | 0;
	        }
	        if (px !== undefined) {
	          self.scroll.x = (px / self.scrollratio.x) | 0;
	        }
	      }
	
	      self.cursor.css({
	        height: self.cursorheight,
	        top: self.scroll.y
	      });
	      if (self.cursorh) {
	        var lx = (self.hasreversehr) ? self.scrollvaluemaxw - self.scroll.x : self.scroll.x;
	        self.cursorh.css({
	          width: self.cursorwidth,
	          left: (!self.rail.align && self.rail.visibility) ? lx + self.rail.width : lx
	        });
	        self.cursoractive = true;
	      }
	
	      if (self.zoom) self.zoom.stop().css({
	        opacity: opt.cursoropacitymax
	      });
	    };
	
	    this.hideCursor = function (tm) {
	      if (self.cursortimeout) return;
	      if (!self.rail) return;
	      if (!self.autohidedom) return;
	
	      if (self.hasmousefocus && opt.autohidemode === "leave") return;
	      self.cursortimeout = setTimeout(function () {
	        if (!self.rail.active || !self.showonmouseevent) {
	          self.autohidedom.stop().animate({
	            opacity: opt.cursoropacitymin
	          });
	          if (self.zoom) self.zoom.stop().animate({
	            opacity: opt.cursoropacitymin
	          });
	          self.cursoractive = false;
	        }
	        self.cursortimeout = 0;
	      }, tm || opt.hidecursordelay);
	    };
	
	    this.noticeCursor = function (tm, py, px) {
	      self.showCursor(py, px);
	      if (!self.rail.active) self.hideCursor(tm);
	    };
	
	    this.getContentSize =
	      (self.ispage) ?
	        function () {
	          return {
	            w: Math.max(_doc.body.scrollWidth, _doc.documentElement.scrollWidth),
	            h: Math.max(_doc.body.scrollHeight, _doc.documentElement.scrollHeight)
	          };
	        } : (self.haswrapper) ?
	          function () {
	            return {
	              w: self.doc[0].offsetWidth,
	              h: self.doc[0].offsetHeight
	            };
	          } : function () {
	            return {
	              w: self.docscroll[0].scrollWidth,
	              h: self.docscroll[0].scrollHeight
	            };
	          };
	
	    this.onResize = function (e, page) {
	
	      if (!self || !self.win) return false;
	
	      var premaxh = self.page.maxh,
	          premaxw = self.page.maxw,
	          previewh = self.view.h,
	          previeww = self.view.w;
	
	      self.view = {
	        w: (self.ispage) ? self.win.width() : self.win[0].clientWidth,
	        h: (self.ispage) ? self.win.height() : self.win[0].clientHeight
	      };
	
	      self.page = (page) ? page : self.getContentSize();
	
	      self.page.maxh = Math.max(0, self.page.h - self.view.h);
	      self.page.maxw = Math.max(0, self.page.w - self.view.w);
	
	      if ((self.page.maxh == premaxh) && (self.page.maxw == premaxw) && (self.view.w == previeww) && (self.view.h == previewh)) {
	        // test position        
	        if (!self.ispage) {
	          var pos = self.win.offset();
	          if (self.lastposition) {
	            var lst = self.lastposition;
	            if ((lst.top == pos.top) && (lst.left == pos.left)) return self; //nothing to do            
	          }
	          self.lastposition = pos;
	        } else {
	          return self; //nothing to do
	        }
	      }
	
	      if (self.page.maxh === 0) {
	        self.hideRail();
	        self.scrollvaluemax = 0;
	        self.scroll.y = 0;
	        self.scrollratio.y = 0;
	        self.cursorheight = 0;
	        self.setScrollTop(0);
	        if (self.rail) self.rail.scrollable = false;
	      } else {
	        self.page.maxh -= (opt.railpadding.top + opt.railpadding.bottom);
	        self.rail.scrollable = true;
	      }
	
	      if (self.page.maxw === 0) {
	        self.hideRailHr();
	        self.scrollvaluemaxw = 0;
	        self.scroll.x = 0;
	        self.scrollratio.x = 0;
	        self.cursorwidth = 0;
	        self.setScrollLeft(0);
	        if (self.railh) {
	          self.railh.scrollable = false;
	        }
	      } else {
	        self.page.maxw -= (opt.railpadding.left + opt.railpadding.right);
	        if (self.railh) self.railh.scrollable = (opt.horizrailenabled);
	      }
	
	      self.railslocked = (self.locked) || ((self.page.maxh === 0) && (self.page.maxw === 0));
	      if (self.railslocked) {
	        if (!self.ispage) self.updateScrollBar(self.view);
	        return false;
	      }
	
	      if (!self.hidden) {
	        if (!self.rail.visibility) self.showRail();
	        if (self.railh && !self.railh.visibility) self.showRailHr();
	      }
	
	      if (self.istextarea && self.win.css('resize') && self.win.css('resize') != 'none') self.view.h -= 20;
	
	      self.cursorheight = Math.min(self.view.h, Math.round(self.view.h * (self.view.h / self.page.h)));
	      self.cursorheight = (opt.cursorfixedheight) ? opt.cursorfixedheight : Math.max(opt.cursorminheight, self.cursorheight);
	
	      self.cursorwidth = Math.min(self.view.w, Math.round(self.view.w * (self.view.w / self.page.w)));
	      self.cursorwidth = (opt.cursorfixedheight) ? opt.cursorfixedheight : Math.max(opt.cursorminheight, self.cursorwidth);
	
	      self.scrollvaluemax = self.view.h - self.cursorheight - (opt.railpadding.top + opt.railpadding.bottom);
	      if (!self.hasborderbox) self.scrollvaluemax -= self.cursor[0].offsetHeight - self.cursor[0].clientHeight;
	
	      if (self.railh) {
	        self.railh.width = (self.page.maxh > 0) ? (self.view.w - self.rail.width) : self.view.w;
	        self.scrollvaluemaxw = self.railh.width - self.cursorwidth - (opt.railpadding.left + opt.railpadding.right);
	      }
	
	      if (!self.ispage) self.updateScrollBar(self.view);
	
	      self.scrollratio = {
	        x: (self.page.maxw / self.scrollvaluemaxw),
	        y: (self.page.maxh / self.scrollvaluemax)
	      };
	
	      var sy = self.getScrollTop();
	      if (sy > self.page.maxh) {
	        self.doScrollTop(self.page.maxh);
	      } else {
	        self.scroll.y = (self.getScrollTop() / self.scrollratio.y) | 0;
	        self.scroll.x = (self.getScrollLeft() / self.scrollratio.x) | 0;
	        if (self.cursoractive) self.noticeCursor();
	      }
	
	      if (self.scroll.y && (self.getScrollTop() === 0)) self.doScrollTo((self.scroll.y * self.scrollratio.y)|0);
	
	      return self;
	    };
	
	    this.resize = self.onResize;
	
	    var hlazyresize = 0;
	
	    this.onscreenresize = function(e) {
	      clearTimeout(hlazyresize);
	
	      var hiderails = (!self.ispage && !self.haswrapper);
	      if (hiderails) self.hideRails();
	
	      hlazyresize = setTimeout(function () {
	        if (self) {
	          if (hiderails) self.showRails();
	          self.resize();
	        }
	        hlazyresize=0;
	      }, 120);
	    };
	
	    this.lazyResize = function (tm) { // event debounce
	
	      clearTimeout(hlazyresize);
	
	      tm = isNaN(tm) ? 240 : tm;
	
	      hlazyresize = setTimeout(function () {
	        self && self.resize();
	        hlazyresize=0;
	      }, tm);
	
	      return self;
	
	    };
	
	    // derived by MDN https://developer.mozilla.org/en-US/docs/DOM/Mozilla_event_reference/wheel
	    function _modernWheelEvent(dom, name, fn, bubble) {
	      self._bind(dom, name, function (e) {
	        e = e || _win.event;
	        var event = {
	          original: e,
	          target: e.target || e.srcElement,
	          type: "wheel",
	          deltaMode: e.type == "MozMousePixelScroll" ? 0 : 1,
	          deltaX: 0,
	          deltaZ: 0,
	          preventDefault: function () {
	            e.preventDefault ? e.preventDefault() : e.returnValue = false;
	            return false;
	          },
	          stopImmediatePropagation: function () {
	            (e.stopImmediatePropagation) ? e.stopImmediatePropagation() : e.cancelBubble = true;
	          }
	        };
	
	        if (name == "mousewheel") {
	          e.wheelDeltaX && (event.deltaX = -1 / 40 * e.wheelDeltaX);
	          e.wheelDeltaY && (event.deltaY = -1 / 40 * e.wheelDeltaY);
	          !event.deltaY && !event.deltaX && (event.deltaY = -1 / 40 * e.wheelDelta);
	        } else {
	          event.deltaY = e.detail;
	        }
	
	        return fn.call(dom, event);
	      }, bubble);
	    }
	
	
	
	    this.jqbind = function (dom, name, fn) { // use jquery bind for non-native events (mouseenter/mouseleave)
	      self.events.push({
	        e: dom,
	        n: name,
	        f: fn,
	        q: true
	      });
	      $(dom).on(name, fn);
	    };
	
	    this.mousewheel = function (dom, fn, bubble) { // bind mousewheel
	      var el = ("jquery" in dom) ? dom[0] : dom;
	      if ("onwheel" in _doc.createElement("div")) { // Modern browsers support "wheel"
	        self._bind(el, "wheel", fn, bubble || false);
	      } else {
	        var wname = (_doc.onmousewheel !== undefined) ? "mousewheel" : "DOMMouseScroll"; // older Webkit+IE support or older Firefox          
	        _modernWheelEvent(el, wname, fn, bubble || false);
	        if (wname == "DOMMouseScroll") _modernWheelEvent(el, "MozMousePixelScroll", fn, bubble || false); // Firefox legacy
	      }
	    };
	
	    var passiveSupported = false;
	
	    if (cap.haseventlistener) {  // W3C standard event model
	
	      // thanks to https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
	      try { var options = Object.defineProperty({}, "passive", { get: function () { passiveSupported = !0; } }); _win.addEventListener("test", null, options); } catch (err) { }
	
	      this.stopPropagation = function (e) {
	        if (!e) return false;
	        e = (e.original) ? e.original : e;
	        e.stopPropagation();
	        return false;
	      };
	
	      this.cancelEvent = function(e) {
	        if (e.cancelable) e.preventDefault();
	        e.stopImmediatePropagation();
	        if (e.preventManipulation) e.preventManipulation();  // IE10+
	        return false;
	      };      
	
	    } else {
	
	      // inspired from https://gist.github.com/jonathantneal/2415137      
	
	      Event.prototype.preventDefault = function () {
	        this.returnValue = false;
	      };
	
	      Event.prototype.stopPropagation = function () {
	        this.cancelBubble = true;
	      };
	
	      _win.constructor.prototype.addEventListener = _doc.constructor.prototype.addEventListener = Element.prototype.addEventListener = function (type, listener, useCapture) {
	        this.attachEvent("on" + type, listener);
	      };
	      _win.constructor.prototype.removeEventListener = _doc.constructor.prototype.removeEventListener = Element.prototype.removeEventListener = function (type, listener, useCapture) {
	        this.detachEvent("on" + type, listener);
	      };
	
	      // Thanks to http://www.switchonthecode.com !!
	      this.cancelEvent = function (e) {
	        e = e || _win.event;
	        if (e) {          
	          e.cancelBubble = true;
	          e.cancel = true;
	          e.returnValue = false;
	        }  
	        return false;
	      };
	
	      this.stopPropagation = function (e) {
	        e = e || _win.event;
	        if (e) e.cancelBubble = true;
	        return false;
	      };
	
	    }
	
	    this.delegate = function (dom, name, fn, bubble, active) {
	
	      var de = delegatevents[name] || false;
	
	      if (!de) {
	
	        de = {
	          a: [],
	          l: [],
	          f: function (e) {
	            var lst = de.l, l = lst.length - 1;
	            var r = false;
	            for (var a = l; a >= 0; a--) {
	              r = lst[a].call(e.target, e);
	              if (r === false) return false;
	            }
	            return r;
	          }
	        };
	
	        self.bind(dom, name, de.f, bubble, active);
	
	        delegatevents[name] = de;
	
	      }
	
	      if (self.ispage) {
	        de.a = [self.id].concat(de.a);
	        de.l = [fn].concat(de.l);
	      } else {
	        de.a.push(self.id);
	        de.l.push(fn);        
	      }
	
	    };
	
	    this.undelegate = function (dom, name, fn, bubble, active) {
	      var de = delegatevents[name]||false;
	      if (de&&de.l) {  // quick fix #683
	        for (var a=0,l=de.l.length;a<l;a++) {
	          if (de.a[a] === self.id) {
	            de.a.splice(a);
	            de.l.splice(a);
	            if (de.a.length===0) {
	              self._unbind(dom,name,de.l.f);
	              delegatevents[name] = null;
	            }
	          }
	        }
	      }
	    };
	
	    this.bind = function (dom, name, fn, bubble, active) {
	      var el = ("jquery" in dom) ? dom[0] : dom;
	      self._bind(el, name, fn, bubble || false, active || false);
	    };
	
	    this._bind = function (el, name, fn, bubble, active) { // primitive bind
	
	      self.events.push({
	        e: el,
	        n: name,
	        f: fn,
	        b: bubble,
	        q: false
	      });
	
	      (passiveSupported && active) ? el.addEventListener(name, fn, { passive: false, capture: bubble }) : el.addEventListener(name, fn, bubble || false);
	    };
	
	    this._unbind = function (el, name, fn, bub) { // primitive unbind
	      if (delegatevents[name]) self.undelegate(el, name, fn, bub);
	      else el.removeEventListener(name, fn, bub);
	    };
	
	    this.unbindAll = function () {
	      for (var a = 0; a < self.events.length; a++) {
	        var r = self.events[a];
	        (r.q) ? r.e.unbind(r.n, r.f) : self._unbind(r.e, r.n, r.f, r.b);
	      }
	    };
	
	    this.showRails = function () {
	      return self.showRail().showRailHr();
	    };
	
	    this.showRail = function () {
	      if ((self.page.maxh !== 0) && (self.ispage || self.win.css('display') != 'none')) {
	        //self.visibility = true;
	        self.rail.visibility = true;
	        self.rail.css('display', 'block');
	      }
	      return self;
	    };
	
	    this.showRailHr = function () {
	      if (self.railh) {
	        if ((self.page.maxw !== 0) && (self.ispage || self.win.css('display') != 'none')) {
	          self.railh.visibility = true;
	          self.railh.css('display', 'block');
	        }
	      }
	      return self;
	    };
	
	    this.hideRails = function () {
	      return self.hideRail().hideRailHr();
	    };
	
	    this.hideRail = function () {
	      //self.visibility = false;
	      self.rail.visibility = false;
	      self.rail.css('display', 'none');
	      return self;
	    };
	
	    this.hideRailHr = function () {
	      if (self.railh) {
	        self.railh.visibility = false;
	        self.railh.css('display', 'none');
	      }
	      return self;
	    };
	
	    this.show = function () {
	      self.hidden = false;
	      self.railslocked = false;
	      return self.showRails();
	    };
	
	    this.hide = function () {
	      self.hidden = true;
	      self.railslocked = true;
	      return self.hideRails();
	    };
	
	    this.toggle = function () {
	      return (self.hidden) ? self.show() : self.hide();
	    };
	
	    this.remove = function () {
	      self.stop();
	      if (self.cursortimeout) clearTimeout(self.cursortimeout);
	      for (var n in self.delaylist) if (self.delaylist[n]) clearAnimationFrame(self.delaylist[n].h);
	      self.doZoomOut();
	      self.unbindAll();
	
	      if (cap.isie9) self.win[0].detachEvent("onpropertychange", self.onAttributeChange); //IE9 DOMAttrModified bug
	
	      if (self.observer !== false) self.observer.disconnect();
	      if (self.observerremover !== false) self.observerremover.disconnect();
	      if (self.observerbody !== false) self.observerbody.disconnect();
	
	      self.events = null;
	
	      if (self.cursor) {
	        self.cursor.remove();
	      }
	      if (self.cursorh) {
	        self.cursorh.remove();
	      }
	      if (self.rail) {
	        self.rail.remove();
	      }
	      if (self.railh) {
	        self.railh.remove();
	      }
	      if (self.zoom) {
	        self.zoom.remove();
	      }
	      for (var a = 0; a < self.saved.css.length; a++) {
	        var d = self.saved.css[a];
	        d[0].css(d[1], (d[2] === undefined) ? '' : d[2]);
	      }
	      self.saved = false;
	      self.me.data('__nicescroll', ''); //erase all traces
	
	      // memory leak fixed by GianlucaGuarini - thanks a lot!
	      // remove the current nicescroll from the $.nicescroll array & normalize array
	      var lst = $.nicescroll;
	      lst.each(function (i) {
	        if (!this) return;
	        if (this.id === self.id) {
	          delete lst[i];
	          for (var b = ++i; b < lst.length; b++ , i++) lst[i] = lst[b];
	          lst.length--;
	          if (lst.length) delete lst[lst.length];
	        }
	      });
	
	      for (var i in self) {
	        self[i] = null;
	        delete self[i];
	      }
	
	      self = null;
	
	    };
	
	    this.scrollstart = function (fn) {
	      this.onscrollstart = fn;
	      return self;
	    };
	    this.scrollend = function (fn) {
	      this.onscrollend = fn;
	      return self;
	    };
	    this.scrollcancel = function (fn) {
	      this.onscrollcancel = fn;
	      return self;
	    };
	
	    this.zoomin = function (fn) {
	      this.onzoomin = fn;
	      return self;
	    };
	    this.zoomout = function (fn) {
	      this.onzoomout = fn;
	      return self;
	    };
	
	    this.isScrollable = function (e) {
	      var dom = (e.target) ? e.target : e;
	      if (dom.nodeName == 'OPTION') return true;
	      while (dom && (dom.nodeType == 1) && (dom !== this.me[0]) && !(/^BODY|HTML/.test(dom.nodeName))) {
	        var dd = $(dom);
	        var ov = dd.css('overflowY') || dd.css('overflowX') || dd.css('overflow') || '';
	        if (/scroll|auto/.test(ov)) return (dom.clientHeight != dom.scrollHeight);
	        dom = (dom.parentNode) ? dom.parentNode : false;
	      }
	      return false;
	    };
	
	    this.getViewport = function (me) {
	      var dom = (me && me.parentNode) ? me.parentNode : false;
	      while (dom && (dom.nodeType == 1) && !(/^BODY|HTML/.test(dom.nodeName))) {
	        var dd = $(dom);
	        if (/fixed|absolute/.test(dd.css("position"))) return dd;
	        var ov = dd.css('overflowY') || dd.css('overflowX') || dd.css('overflow') || '';
	        if ((/scroll|auto/.test(ov)) && (dom.clientHeight != dom.scrollHeight)) return dd;
	        if (dd.getNiceScroll().length > 0) return dd;
	        dom = (dom.parentNode) ? dom.parentNode : false;
	      }
	      return false;
	    };
	
	    this.triggerScrollStart = function (cx, cy, rx, ry, ms) {
	
	      if (self.onscrollstart) {
	        var info = {
	          type: "scrollstart",
	          current: {
	            x: cx,
	            y: cy
	          },
	          request: {
	            x: rx,
	            y: ry
	          },
	          end: {
	            x: self.newscrollx,
	            y: self.newscrolly
	          },
	          speed: ms
	        };
	        self.onscrollstart.call(self, info);
	      }
	
	    };
	
	    this.triggerScrollEnd = function () {
	      if (self.onscrollend) {
	
	        var px = self.getScrollLeft();
	        var py = self.getScrollTop();
	
	        var info = {
	          type: "scrollend",
	          current: {
	            x: px,
	            y: py
	          },
	          end: {
	            x: px,
	            y: py
	          }
	        };
	
	        self.onscrollend.call(self, info);
	
	      }
	
	    };
	
	    var scrolldiry = 0, scrolldirx = 0, scrolltmr = 0, scrollspd = 1;
	
	    function doScrollRelative(px, py, chkscroll, iswheel) {
	
	      if (!self.scrollrunning) {
	        self.newscrolly = self.getScrollTop();
	        self.newscrollx = self.getScrollLeft();
	        scrolltmr = now();
	      }
	
	      var gap = (now() - scrolltmr);
	      scrolltmr = now();
	
	      if (gap > 350) {
	        scrollspd = 1;
	      } else {
	        scrollspd += (2 - scrollspd) / 10;
	      }
	
	      px = px * scrollspd | 0;
	      py = py * scrollspd | 0;
	
	      if (px) {
	
	        if (iswheel) { // mouse-only
	          if (px < 0) {  // fix apple magic mouse swipe back/forward
	            if (self.getScrollLeft() >= self.page.maxw) return true;
	          } else {
	            if (self.getScrollLeft() <= 0) return true;
	          }
	        }
	
	        var dx = px > 0 ? 1 : -1;
	
	        if (scrolldirx !== dx) {
	          if (self.scrollmom) self.scrollmom.stop();
	          self.newscrollx = self.getScrollLeft();
	          scrolldirx = dx;
	        }
	
	        self.lastdeltax -= px;
	
	      }
	
	      if (py) {
	
	        var chk = (function () {
	          var top = self.getScrollTop();
	          if (py < 0) {
	            if (top >= self.page.maxh) return true;
	          } else {
	            if (top <= 0) return true;
	          }
	        })();
	
	        if (chk) {
	          if (opt.nativeparentscrolling && chkscroll && !self.ispage && !self.zoomactive) return true;
	          var ny = self.view.h >> 1;
	          if (self.newscrolly < -ny) { self.newscrolly = -ny; py = -1; }
	          else if (self.newscrolly > self.page.maxh + ny) { self.newscrolly = self.page.maxh + ny; py = 1; }
	          else py = 0;
	        }
	
	        var dy = py > 0 ? 1 : -1;
	
	        if (scrolldiry !== dy) {
	          if (self.scrollmom) self.scrollmom.stop();
	          self.newscrolly = self.getScrollTop();
	          scrolldiry = dy;
	        }
	
	        self.lastdeltay -= py;
	
	      }
	
	      if (py || px) {
	        self.synched("relativexy", function () {
	
	          var dty = self.lastdeltay + self.newscrolly;
	          self.lastdeltay = 0;
	
	          var dtx = self.lastdeltax + self.newscrollx;
	          self.lastdeltax = 0;
	
	          if (!self.rail.drag) self.doScrollPos(dtx, dty);
	
	        });
	      }
	
	    }
	
	    var hasparentscrollingphase = false;
	
	    function execScrollWheel(e, hr, chkscroll) {
	      var px, py;
	
	      if (!chkscroll && hasparentscrollingphase) return true;
	
	      if (e.deltaMode === 0) { // PIXEL
	        px = -(e.deltaX * (opt.mousescrollstep / (18 * 3))) | 0;
	        py = -(e.deltaY * (opt.mousescrollstep / (18 * 3))) | 0;
	      } else if (e.deltaMode === 1) { // LINE
	        px = -(e.deltaX * opt.mousescrollstep * 50 / 80) | 0;
	        py = -(e.deltaY * opt.mousescrollstep * 50 / 80) | 0;
	      }
	
	      if (hr && opt.oneaxismousemode && (px === 0) && py) { // classic vertical-only mousewheel + browser with x/y support 
	        px = py;
	        py = 0;
	
	        if (chkscroll) {
	          var hrend = (px < 0) ? (self.getScrollLeft() >= self.page.maxw) : (self.getScrollLeft() <= 0);
	          if (hrend) {  // preserve vertical scrolling
	            py = px;
	            px = 0;
	          }
	        }
	
	      }
	
	      // invert horizontal direction for rtl mode
	      if (self.isrtlmode) px = -px;
	
	      var chk = doScrollRelative(px, py, chkscroll, true);
	
	      if (chk) {
	        if (chkscroll) hasparentscrollingphase = true;
	      } else {
	        hasparentscrollingphase = false;
	        e.stopImmediatePropagation();
	        return e.preventDefault();
	      }
	
	    }
	
	    this.onmousewheel = function (e) {
	      if (self.wheelprevented||self.locked) return false;
	      if (self.railslocked) {
	        self.debounced("checkunlock", self.resize, 250);
	        return false;
	      }
	      if (self.rail.drag) return self.cancelEvent(e);
	
	      if (opt.oneaxismousemode === "auto" && e.deltaX !== 0) opt.oneaxismousemode = false; // check two-axis mouse support (not very elegant)
	
	      if (opt.oneaxismousemode && e.deltaX === 0) {
	        if (!self.rail.scrollable) {
	          if (self.railh && self.railh.scrollable) {
	            return self.onmousewheelhr(e);
	          } else {
	            return true;
	          }
	        }
	      }
	
	      var nw = now();
	      var chk = false;
	      if (opt.preservenativescrolling && ((self.checkarea + 600) < nw)) {
	        self.nativescrollingarea = self.isScrollable(e);
	        chk = true;
	      }
	      self.checkarea = nw;
	      if (self.nativescrollingarea) return true; // this isn't my business
	      var ret = execScrollWheel(e, false, chk);
	      if (ret) self.checkarea = 0;
	      return ret;
	    };
	
	    this.onmousewheelhr = function (e) {
	      if (self.wheelprevented) return;
	      if (self.railslocked || !self.railh.scrollable) return true;
	      if (self.rail.drag) return self.cancelEvent(e);
	
	      var nw = now();
	      var chk = false;
	      if (opt.preservenativescrolling && ((self.checkarea + 600) < nw)) {
	        self.nativescrollingarea = self.isScrollable(e);
	        chk = true;
	      }
	      self.checkarea = nw;
	      if (self.nativescrollingarea) return true; // this is not my business
	      if (self.railslocked) return self.cancelEvent(e);
	
	      return execScrollWheel(e, true, chk);
	    };
	
	    this.stop = function () {
	      self.cancelScroll();
	      if (self.scrollmon) self.scrollmon.stop();
	      self.cursorfreezed = false;
	      self.scroll.y = Math.round(self.getScrollTop() * (1 / self.scrollratio.y));
	      self.noticeCursor();
	      return self;
	    };
	
	    this.getTransitionSpeed = function (dif) {
	
	      return 80 + (dif / 72) * opt.scrollspeed |0;
	
	    };
	
	    if (!opt.smoothscroll) {
	      this.doScrollLeft = function (x, spd) { //direct
	        var y = self.getScrollTop();
	        self.doScrollPos(x, y, spd);
	      };
	      this.doScrollTop = function (y, spd) { //direct
	        var x = self.getScrollLeft();
	        self.doScrollPos(x, y, spd);
	      };
	      this.doScrollPos = function (x, y, spd) { //direct
	        var nx = (x > self.page.maxw) ? self.page.maxw : x;
	        if (nx < 0) nx = 0;
	        var ny = (y > self.page.maxh) ? self.page.maxh : y;
	        if (ny < 0) ny = 0;
	        self.synched('scroll', function () {
	          self.setScrollTop(ny);
	          self.setScrollLeft(nx);
	        });
	      };
	      this.cancelScroll = function () { }; // direct
	
	    } else if (self.ishwscroll && cap.hastransition && opt.usetransition && !!opt.smoothscroll) {
	
	      var lasttransitionstyle = '';
	
	      this.resetTransition = function () {
	        lasttransitionstyle = '';
	        self.doc.css(cap.prefixstyle + 'transition-duration', '0ms');
	      };
	
	      this.prepareTransition = function (dif, istime) {
	        var ex = (istime) ? dif : self.getTransitionSpeed(dif);
	        var trans = ex + 'ms';
	        if (lasttransitionstyle !== trans) {
	          lasttransitionstyle = trans;
	          self.doc.css(cap.prefixstyle + 'transition-duration', trans);
	        }
	        return ex;
	      };
	
	      this.doScrollLeft = function (x, spd) { //trans
	        var y = (self.scrollrunning) ? self.newscrolly : self.getScrollTop();
	        self.doScrollPos(x, y, spd);
	      };
	
	      this.doScrollTop = function (y, spd) { //trans
	        var x = (self.scrollrunning) ? self.newscrollx : self.getScrollLeft();
	        self.doScrollPos(x, y, spd);
	      };
	
	      this.cursorupdate = {
	        running: false,
	        start: function () {
	          var m = this;
	
	          if (m.running) return;
	          m.running = true;
	
	          var loop = function () {
	            if (m.running) setAnimationFrame(loop);
	            self.showCursor(self.getScrollTop(), self.getScrollLeft());
	            self.notifyScrollEvent(self.win[0]);
	          };
	
	          setAnimationFrame(loop);
	        },
	        stop: function () {
	          this.running = false;
	        }
	      };
	
	      this.doScrollPos = function (x, y, spd) { //trans
	
	        var py = self.getScrollTop();
	        var px = self.getScrollLeft();
	
	        if (((self.newscrolly - py) * (y - py) < 0) || ((self.newscrollx - px) * (x - px) < 0)) self.cancelScroll(); //inverted movement detection      
	
	        if (!opt.bouncescroll) {
	          if (y < 0) y = 0;
	          else if (y > self.page.maxh) y = self.page.maxh;
	          if (x < 0) x = 0;
	          else if (x > self.page.maxw) x = self.page.maxw;
	        } else {
	          if (y < 0) y = y / 2 | 0;
	          else if (y > self.page.maxh) y = self.page.maxh + (y - self.page.maxh) / 2 | 0;
	          if (x < 0) x = x / 2 | 0;
	          else if (x > self.page.maxw) x = self.page.maxw + (x - self.page.maxw) / 2 | 0;
	        }
	
	        if (self.scrollrunning && x == self.newscrollx && y == self.newscrolly) return false;
	
	        self.newscrolly = y;
	        self.newscrollx = x;
	
	        var top = self.getScrollTop();
	        var lft = self.getScrollLeft();
	
	        var dst = {};
	        dst.x = x - lft;
	        dst.y = y - top;
	
	        var dd = Math.sqrt((dst.x * dst.x) + (dst.y * dst.y)) | 0;
	
	        var ms = self.prepareTransition(dd);
	
	        if (!self.scrollrunning) {
	          self.scrollrunning = true;
	          self.triggerScrollStart(lft, top, x, y, ms);
	          self.cursorupdate.start();
	        }
	
	        self.scrollendtrapped = true;
	
	        if (!cap.transitionend) {
	          if (self.scrollendtrapped) clearTimeout(self.scrollendtrapped);
	          self.scrollendtrapped = setTimeout(self.onScrollTransitionEnd, ms); // simulate transitionend event
	        }
	
	        self.setScrollTop(self.newscrolly);
	        self.setScrollLeft(self.newscrollx);
	
	      };
	
	      this.cancelScroll = function () {
	        if (!self.scrollendtrapped) return true;
	        var py = self.getScrollTop();
	        var px = self.getScrollLeft();
	        self.scrollrunning = false;
	        if (!cap.transitionend) clearTimeout(cap.transitionend);
	        self.scrollendtrapped = false;
	        self.resetTransition();
	        self.setScrollTop(py); // fire event onscroll
	        if (self.railh) self.setScrollLeft(px);
	        if (self.timerscroll && self.timerscroll.tm) clearInterval(self.timerscroll.tm);
	        self.timerscroll = false;
	
	        self.cursorfreezed = false;
	
	        self.cursorupdate.stop();
	        self.showCursor(py, px);
	        return self;
	      };
	
	      this.onScrollTransitionEnd = function () {
	
	        if (!self.scrollendtrapped) return;
	
	        var py = self.getScrollTop();
	        var px = self.getScrollLeft();
	
	        if (py < 0) py = 0;
	        else if (py > self.page.maxh) py = self.page.maxh;
	        if (px < 0) px = 0;
	        else if (px > self.page.maxw) px = self.page.maxw;
	        if ((py != self.newscrolly) || (px != self.newscrollx)) return self.doScrollPos(px, py, opt.snapbackspeed);
	
	        if (self.scrollrunning) self.triggerScrollEnd();
	        self.scrollrunning = false;
	
	        self.scrollendtrapped = false;
	        self.resetTransition();
	        self.timerscroll = false;
	        self.setScrollTop(py); // fire event onscroll        
	        if (self.railh) self.setScrollLeft(px); // fire event onscroll left
	
	        self.cursorupdate.stop();
	        self.noticeCursor(false, py, px);
	
	        self.cursorfreezed = false;
	
	      };
	
	    } else {
	
	      this.doScrollLeft = function (x, spd) { //no-trans
	        var y = (self.scrollrunning) ? self.newscrolly : self.getScrollTop();
	        self.doScrollPos(x, y, spd);
	      };
	
	      this.doScrollTop = function (y, spd) { //no-trans
	        var x = (self.scrollrunning) ? self.newscrollx : self.getScrollLeft();
	        self.doScrollPos(x, y, spd);
	      };
	
	      this.doScrollPos = function (x, y, spd) { //no-trans
	
	        var py = self.getScrollTop();
	        var px = self.getScrollLeft();
	
	        if (((self.newscrolly - py) * (y - py) < 0) || ((self.newscrollx - px) * (x - px) < 0)) self.cancelScroll(); //inverted movement detection
	
	        var clipped = false;
	
	        if (!self.bouncescroll || !self.rail.visibility) {
	          if (y < 0) {
	            y = 0;
	            clipped = true;
	          } else if (y > self.page.maxh) {
	            y = self.page.maxh;
	            clipped = true;
	          }
	        }
	        if (!self.bouncescroll || !self.railh.visibility) {
	          if (x < 0) {
	            x = 0;
	            clipped = true;
	          } else if (x > self.page.maxw) {
	            x = self.page.maxw;
	            clipped = true;
	          }
	        }
	
	        if (self.scrollrunning && (self.newscrolly === y) && (self.newscrollx === x)) return true;
	
	        self.newscrolly = y;
	        self.newscrollx = x;
	
	        self.dst = {};
	        self.dst.x = x - px;
	        self.dst.y = y - py;
	        self.dst.px = px;
	        self.dst.py = py;
	
	        var dd = Math.sqrt((self.dst.x * self.dst.x) + (self.dst.y * self.dst.y)) | 0;
	        var ms = self.getTransitionSpeed(dd);
	
	        self.bzscroll = {};
	
	        var p3 = (clipped) ? 1 : 0.58;
	        self.bzscroll.x = new BezierClass(px, self.newscrollx, ms, 0, 0, p3, 1);
	        self.bzscroll.y = new BezierClass(py, self.newscrolly, ms, 0, 0, p3, 1);
	
	        var loopid = now();
	
	        var loop = function () {
	
	          if (!self.scrollrunning) return;
	          var x = self.bzscroll.y.getPos();
	
	          self.setScrollLeft(self.bzscroll.x.getNow());
	          self.setScrollTop(self.bzscroll.y.getNow());
	
	          if (x <= 1) {
	            self.timer = setAnimationFrame(loop);
	          } else {
	            self.scrollrunning = false;
	            self.timer = 0;
	            self.triggerScrollEnd();
	          }
	
	        };
	
	        if (!self.scrollrunning) {
	          self.triggerScrollStart(px, py, x, y, ms);
	          self.scrollrunning = true;
	          self.timer = setAnimationFrame(loop);
	        }
	
	      };
	
	      this.cancelScroll = function () {
	        if (self.timer) clearAnimationFrame(self.timer);
	        self.timer = 0;
	        self.bzscroll = false;
	        self.scrollrunning = false;
	        return self;
	      };
	
	    }
	
	    this.doScrollBy = function (stp, relative) {
	      doScrollRelative(0, stp);
	    };
	
	    this.doScrollLeftBy = function (stp, relative) {
	      doScrollRelative(stp, 0);
	    };
	
	    this.doScrollTo = function (pos, relative) {
	      var ny = (relative) ? Math.round(pos * self.scrollratio.y) : pos;
	      if (ny < 0) ny = 0;
	      else if (ny > self.page.maxh) ny = self.page.maxh;
	      self.cursorfreezed = false;
	      self.doScrollTop(pos);
	    };
	
	    this.checkContentSize = function () {
	      var pg = self.getContentSize();
	      if ((pg.h != self.page.h) || (pg.w != self.page.w)) self.resize(false, pg);
	    };
	
	    self.onscroll = function (e) {
	      if (self.rail.drag) return;
	      if (!self.cursorfreezed) {
	        self.synched('scroll', function () {
	          self.scroll.y = Math.round(self.getScrollTop() / self.scrollratio.y);
	          if (self.railh) self.scroll.x = Math.round(self.getScrollLeft() / self.scrollratio.x);
	          self.noticeCursor();
	        });
	      }
	    };
	    self.bind(self.docscroll, "scroll", self.onscroll);
	
	    this.doZoomIn = function (e) {
	      if (self.zoomactive) return;
	      self.zoomactive = true;
	
	      self.zoomrestore = {
	        style: {}
	      };
	      var lst = ['position', 'top', 'left', 'zIndex', 'backgroundColor', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'];
	      var win = self.win[0].style;
	      for (var a in lst) {
	        var pp = lst[a];
	        self.zoomrestore.style[pp] = (win[pp] !== undefined) ? win[pp] : '';
	      }
	
	      self.zoomrestore.style.width = self.win.css('width');
	      self.zoomrestore.style.height = self.win.css('height');
	
	      self.zoomrestore.padding = {
	        w: self.win.outerWidth() - self.win.width(),
	        h: self.win.outerHeight() - self.win.height()
	      };
	
	      if (cap.isios4) {
	        self.zoomrestore.scrollTop = $window.scrollTop();
	        $window.scrollTop(0);
	      }
	
	      self.win.css({
	        position: (cap.isios4) ? "absolute" : "fixed",
	        top: 0,
	        left: 0,
	        zIndex: globalmaxzindex + 100,
	        margin: 0
	      });
	      var bkg = self.win.css("backgroundColor");
	      if ("" === bkg || /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(bkg)) self.win.css("backgroundColor", "#fff");
	      self.rail.css({
	        zIndex: globalmaxzindex + 101
	      });
	      self.zoom.css({
	        zIndex: globalmaxzindex + 102
	      });
	      self.zoom.css('backgroundPosition', '0 -18px');
	      self.resizeZoom();
	
	      if (self.onzoomin) self.onzoomin.call(self);
	
	      return self.cancelEvent(e);
	    };
	
	    this.doZoomOut = function (e) {
	      if (!self.zoomactive) return;
	      self.zoomactive = false;
	
	      self.win.css("margin", "");
	      self.win.css(self.zoomrestore.style);
	
	      if (cap.isios4) {
	        $window.scrollTop(self.zoomrestore.scrollTop);
	      }
	
	      self.rail.css({
	        "z-index": self.zindex
	      });
	      self.zoom.css({
	        "z-index": self.zindex
	      });
	      self.zoomrestore = false;
	      self.zoom.css('backgroundPosition', '0 0');
	      self.onResize();
	
	      if (self.onzoomout) self.onzoomout.call(self);
	
	      return self.cancelEvent(e);
	    };
	
	    this.doZoom = function (e) {
	      return (self.zoomactive) ? self.doZoomOut(e) : self.doZoomIn(e);
	    };
	
	    this.resizeZoom = function () {
	      if (!self.zoomactive) return;
	
	      var py = self.getScrollTop(); //preserve scrolling position
	      self.win.css({
	        width: $window.width() - self.zoomrestore.padding.w + "px",
	        height: $window.height() - self.zoomrestore.padding.h + "px"
	      });
	      self.onResize();
	
	      self.setScrollTop(Math.min(self.page.maxh, py));
	    };
	
	    this.init();
	
	    $.nicescroll.push(this);
	
	  };
	
	  // Inspired by the work of Kin Blas
	  // http://webpro.host.adobe.com/people/jblas/momentum/includes/jquery.momentum.0.7.js  
	  var ScrollMomentumClass2D = function (nc) {
	    var self = this;
	    this.nc = nc;
	
	    this.lastx = 0;
	    this.lasty = 0;
	    this.speedx = 0;
	    this.speedy = 0;
	    this.lasttime = 0;
	    this.steptime = 0;
	    this.snapx = false;
	    this.snapy = false;
	    this.demulx = 0;
	    this.demuly = 0;
	
	    this.lastscrollx = -1;
	    this.lastscrolly = -1;
	
	    this.chkx = 0;
	    this.chky = 0;
	
	    this.timer = 0;
	
	    this.reset = function (px, py) {
	      self.stop();
	      self.steptime = 0;
	      self.lasttime = now();
	      self.speedx = 0;
	      self.speedy = 0;
	      self.lastx = px;
	      self.lasty = py;
	      self.lastscrollx = -1;
	      self.lastscrolly = -1;
	    };
	
	    this.update = function (px, py) {
	      var tm = now();
	      self.steptime = tm - self.lasttime;
	      self.lasttime = tm;
	      var dy = py - self.lasty;
	      var dx = px - self.lastx;
	      var sy = self.nc.getScrollTop();
	      var sx = self.nc.getScrollLeft();
	      var newy = sy + dy;
	      var newx = sx + dx;
	      self.snapx = (newx < 0) || (newx > self.nc.page.maxw);
	      self.snapy = (newy < 0) || (newy > self.nc.page.maxh);
	      self.speedx = dx;
	      self.speedy = dy;
	      self.lastx = px;
	      self.lasty = py;
	    };
	
	    this.stop = function () {
	      self.nc.unsynched("domomentum2d");
	      if (self.timer) clearTimeout(self.timer);
	      self.timer = 0;
	      self.lastscrollx = -1;
	      self.lastscrolly = -1;
	    };
	
	    this.doSnapy = function (nx, ny) {
	      var snap = false;
	
	      if (ny < 0) {
	        ny = 0;
	        snap = true;
	      } else if (ny > self.nc.page.maxh) {
	        ny = self.nc.page.maxh;
	        snap = true;
	      }
	
	      if (nx < 0) {
	        nx = 0;
	        snap = true;
	      } else if (nx > self.nc.page.maxw) {
	        nx = self.nc.page.maxw;
	        snap = true;
	      }
	
	      (snap) ? self.nc.doScrollPos(nx, ny, self.nc.opt.snapbackspeed) : self.nc.triggerScrollEnd();
	    };
	
	    this.doMomentum = function (gp) {
	      var t = now();
	      var l = (gp) ? t + gp : self.lasttime;
	
	      var sl = self.nc.getScrollLeft();
	      var st = self.nc.getScrollTop();
	
	      var pageh = self.nc.page.maxh;
	      var pagew = self.nc.page.maxw;
	
	      self.speedx = (pagew > 0) ? Math.min(60, self.speedx) : 0;
	      self.speedy = (pageh > 0) ? Math.min(60, self.speedy) : 0;
	
	      var chk = l && (t - l) <= 60;
	
	      if ((st < 0) || (st > pageh) || (sl < 0) || (sl > pagew)) chk = false;
	
	      var sy = (self.speedy && chk) ? self.speedy : false;
	      var sx = (self.speedx && chk) ? self.speedx : false;
	
	      if (sy || sx) {
	        var tm = Math.max(16, self.steptime); //timeout granularity
	
	        if (tm > 50) { // do smooth
	          var xm = tm / 50;
	          self.speedx *= xm;
	          self.speedy *= xm;
	          tm = 50;
	        }
	
	        self.demulxy = 0;
	
	        self.lastscrollx = self.nc.getScrollLeft();
	        self.chkx = self.lastscrollx;
	        self.lastscrolly = self.nc.getScrollTop();
	        self.chky = self.lastscrolly;
	
	        var nx = self.lastscrollx;
	        var ny = self.lastscrolly;
	
	        var onscroll = function () {
	          var df = ((now() - t) > 600) ? 0.04 : 0.02;
	
	          if (self.speedx) {
	            nx = Math.floor(self.lastscrollx - (self.speedx * (1 - self.demulxy)));
	            self.lastscrollx = nx;
	            if ((nx < 0) || (nx > pagew)) df = 0.10;
	          }
	
	          if (self.speedy) {
	            ny = Math.floor(self.lastscrolly - (self.speedy * (1 - self.demulxy)));
	            self.lastscrolly = ny;
	            if ((ny < 0) || (ny > pageh)) df = 0.10;
	          }
	
	          self.demulxy = Math.min(1, self.demulxy + df);
	
	          self.nc.synched("domomentum2d", function () {
	
	            if (self.speedx) {
	              var scx = self.nc.getScrollLeft();
	              //              if (scx != self.chkx) self.stop();
	              self.chkx = nx;
	              self.nc.setScrollLeft(nx);
	            }
	
	            if (self.speedy) {
	              var scy = self.nc.getScrollTop();
	              //              if (scy != self.chky) self.stop();
	              self.chky = ny;
	              self.nc.setScrollTop(ny);
	            }
	
	            if (!self.timer) {
	              self.nc.hideCursor();
	              self.doSnapy(nx, ny);
	            }
	
	          });
	
	          if (self.demulxy < 1) {
	            self.timer = setTimeout(onscroll, tm);
	          } else {
	            self.stop();
	            self.nc.hideCursor();
	            self.doSnapy(nx, ny);
	          }
	        };
	
	        onscroll();
	
	      } else {
	        self.doSnapy(self.nc.getScrollLeft(), self.nc.getScrollTop());
	      }
	
	    };
	
	  };
	
	
	  // override jQuery scrollTop
	  var _scrollTop = jQuery.fn.scrollTop; // preserve original function
	
	  jQuery.cssHooks.pageYOffset = {
	    get: function (elem, computed, extra) {
	      var nice = $.data(elem, '__nicescroll') || false;
	      return (nice && nice.ishwscroll) ? nice.getScrollTop() : _scrollTop.call(elem);
	    },
	    set: function (elem, value) {
	      var nice = $.data(elem, '__nicescroll') || false;
	      (nice && nice.ishwscroll) ? nice.setScrollTop(parseInt(value)) : _scrollTop.call(elem, value);
	      return this;
	    }
	  };
	
	  jQuery.fn.scrollTop = function (value) {
	    if (value === undefined) {
	      var nice = (this[0]) ? $.data(this[0], '__nicescroll') || false : false;
	      return (nice && nice.ishwscroll) ? nice.getScrollTop() : _scrollTop.call(this);
	    } else {
	      return this.each(function () {
	        var nice = $.data(this, '__nicescroll') || false;
	        (nice && nice.ishwscroll) ? nice.setScrollTop(parseInt(value)) : _scrollTop.call($(this), value);
	      });
	    }
	  };
	
	  // override jQuery scrollLeft
	  var _scrollLeft = jQuery.fn.scrollLeft; // preserve original function
	
	  $.cssHooks.pageXOffset = {
	    get: function (elem, computed, extra) {
	      var nice = $.data(elem, '__nicescroll') || false;
	      return (nice && nice.ishwscroll) ? nice.getScrollLeft() : _scrollLeft.call(elem);
	    },
	    set: function (elem, value) {
	      var nice = $.data(elem, '__nicescroll') || false;
	      (nice && nice.ishwscroll) ? nice.setScrollLeft(parseInt(value)) : _scrollLeft.call(elem, value);
	      return this;
	    }
	  };
	
	  jQuery.fn.scrollLeft = function (value) {
	    if (value === undefined) {
	      var nice = (this[0]) ? $.data(this[0], '__nicescroll') || false : false;
	      return (nice && nice.ishwscroll) ? nice.getScrollLeft() : _scrollLeft.call(this);
	    } else {
	      return this.each(function () {
	        var nice = $.data(this, '__nicescroll') || false;
	        (nice && nice.ishwscroll) ? nice.setScrollLeft(parseInt(value)) : _scrollLeft.call($(this), value);
	      });
	    }
	  };
	
	  var NiceScrollArray = function (doms) {
	    var self = this;
	    this.length = 0;
	    this.name = "nicescrollarray";
	
	    this.each = function (fn) {
	      $.each(self, fn);
	      return self;
	    };
	
	    this.push = function (nice) {
	      self[self.length] = nice;
	      self.length++;
	    };
	
	    this.eq = function (idx) {
	      return self[idx];
	    };
	
	    if (doms) {
	      for (var a = 0; a < doms.length; a++) {
	        var nice = $.data(doms[a], '__nicescroll') || false;
	        if (nice) {
	          this[this.length] = nice;
	          this.length++;
	        }
	      }
	    }
	
	    return this;
	  };
	
	  function mplex(el, lst, fn) {
	    for (var a = 0, l = lst.length; a < l; a++) fn(el, lst[a]);
	  }
	  mplex(
	    NiceScrollArray.prototype, ['show', 'hide', 'toggle', 'onResize', 'resize', 'remove', 'stop', 'doScrollPos'],
	    function (e, n) {
	      e[n] = function () {
	        var args = arguments;
	        return this.each(function () {
	          this[n].apply(this, args);
	        });
	      };
	    }
	  );
	
	  jQuery.fn.getNiceScroll = function (index) {
	    if (index === undefined) {
	      return new NiceScrollArray(this);
	    } else {
	      return this[index] && $.data(this[index], '__nicescroll') || false;
	    }
	  };
	
	  var pseudos = jQuery.expr.pseudos || jQuery.expr[':'];  // jQuery 3 migration
	  pseudos.nicescroll = function (a) {
	    return $.data(a, '__nicescroll') !== undefined;
	  };
	
	  $.fn.niceScroll = function (wrapper, _opt) {
	    if (_opt === undefined && typeof wrapper == "object" && !("jquery" in wrapper)) {
	      _opt = wrapper;
	      wrapper = false;
	    }
	
	    var ret = new NiceScrollArray();
	
	    this.each(function () {
	      var $this = $(this);
	
	      var opt = $.extend({}, _opt); // cloning
	
	      if (wrapper || false) {
	        var wrp = $(wrapper);
	        opt.doc = (wrp.length > 1) ? $(wrapper, $this) : wrp;
	        opt.win = $this;
	      }
	      var docundef = !("doc" in opt);
	      if (!docundef && !("win" in opt)) opt.win = $this;
	
	      var nice = $this.data('__nicescroll') || false;
	      if (!nice) {
	        opt.doc = opt.doc || $this;
	        nice = new NiceScrollClass(opt, $this);
	        $this.data('__nicescroll', nice);
	      }
	      ret.push(nice);
	    });
	
	    return (ret.length === 1) ? ret[0] : ret;
	  };
	
	  _win.NiceScroll = {
	    getjQuery: function () {
	      return jQuery;
	    }
	  };
	
	  if (!$.nicescroll) {
	    $.nicescroll = new NiceScrollArray();
	    $.nicescroll.options = _globaloptions;
	  }
	
	}));


// $(function() {
// 	init();
// })
		// google.maps.event.addDomListener(window, 'load', init);

		function init() {
		// Basic options for a simple Google Map
		// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
		var mapOptions = {
			// How zoomed in you want the map to start at (always required)
			zoom: 11,
			scrollwheel: false,

				// The latitude and longitude to center the map (always required)
			center: new google.maps.LatLng(40.6700, -73.9400), // New York

				// How you would like to style the map. 
				// This is where you would paste any style found on Snazzy Maps.
				styles: [
				{
					"featureType": "administrative",
					"elementType": "labels.text.fill",
					"stylers": [
					{
						"color": "#6195a0"
					}
					]
				},
				{
					"featureType": "administrative.province",
					"elementType": "geometry.stroke",
					"stylers": [
					{
						"visibility": "off"
					}
					]
				},
				{
					"featureType": "landscape",
					"elementType": "geometry",
					"stylers": [
					{
						"lightness": "0"
					},
					{
						"saturation": "0"
					},
					{
						"color": "#f5f5f2"
					},
					{
						"gamma": "1"
					}
					]
				},
				{
					"featureType": "landscape.man_made",
					"elementType": "all",
					"stylers": [
					{
						"lightness": "-3"
					},
					{
						"gamma": "1.00"
					}
					]
				},
				{
					"featureType": "landscape.natural.terrain",
					"elementType": "all",
					"stylers": [
					{
						"visibility": "off"
					}
					]
				},
				{
					"featureType": "poi",
					"elementType": "all",
					"stylers": [
					{
						"visibility": "off"
					}
					]
				},
				{
					"featureType": "poi.park",
					"elementType": "geometry.fill",
					"stylers": [
					{
						"color": "#bae5ce"
					},
					{
						"visibility": "on"
					}
					]
				},
				{
					"featureType": "road",
					"elementType": "all",
					"stylers": [
					{
						"saturation": -100
					},
					{
						"lightness": 45
					},
					{
						"visibility": "simplified"
					}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "all",
					"stylers": [
					{
						"visibility": "simplified"
					}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.fill",
					"stylers": [
					{
						"color": "#ffffff"
					},
					{
						"visibility": "simplified"
					}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "labels.text",
					"stylers": [
					{
						"color": "#4e4e4e"
					}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "labels.text.fill",
					"stylers": [
					{
						"color": "#787878"
					}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "labels.icon",
					"stylers": [
					{
						"visibility": "off"
					}
					]
				},
				{
					"featureType": "transit",
					"elementType": "all",
					"stylers": [
					{
						"visibility": "off"
					}
					]
				},
				{
					"featureType": "transit.station.airport",
					"elementType": "labels.icon",
					"stylers": [
					{
						"hue": "#0a00ff"
					},
					{
						"saturation": "-77"
					},
					{
						"gamma": "0.57"
					},
					{
						"lightness": "0"
					}
					]
				},
				{
					"featureType": "transit.station.rail",
					"elementType": "labels.text.fill",
					"stylers": [
					{
						"color": "#43321e"
					}
					]
				},
				{
					"featureType": "transit.station.rail",
					"elementType": "labels.icon",
					"stylers": [
					{
						"hue": "#ff6c00"
					},
					{
						"lightness": "4"
					},
					{
						"gamma": "0.75"
					},
					{
						"saturation": "-68"
					}
					]
				},
				{
					"featureType": "water",
					"elementType": "all",
					"stylers": [
					{
						"color": "#eaf6f8"
					},
					{
						"visibility": "on"
					}
					]
				},
				{
					"featureType": "water",
					"elementType": "geometry.fill",
					"stylers": [
					{
						"color": "#c7eced"
					}
					]
				},
				{
					"featureType": "water",
					"elementType": "labels.text.fill",
					"stylers": [
					{
						"lightness": "-49"
					},
					{
						"saturation": "-53"
					},
					{
						"gamma": "0.79"
					}
					]
				}
				]
			};

		// Get the HTML DOM element that will contain your map 
		// We are using a div with id="map" seen below in the <body>
		var mapElement = document.getElementById('map');

		// Create the Google Map using our element and options defined above
		var map = new google.maps.Map(mapElement, mapOptions);

		// Let's also add a marker while we're at it
		// var image = "img/g-map-marker.png";
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(40.6700, -73.9400),
			map: map,
			// title: 'Marker',
			// icon: image
		});


		google.maps.event.addDomListener(window, 'resize', function() {
			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center);
		});


		map.addListener('click', function() {
			map.setOptions({
				scrollwheel: true
			});
		});

		map.addListener('drag', function() {
			map.setOptions({
				scrollwheel: true
			});
		});

		map.addListener('mouseout', function() {
			map.setOptions({
				scrollwheel: false
			});
		});

	}


	$(function() {
		init();
		svg4everybody({});
		$('.slider').slick({
			infinite: true,
			slidesToShow: 2,
			dots: true,
			arrows: false,
		});

		if(!device.tablet() && !device.mobile()) {
			$('body').niceScroll({
				autohidemode: false,
				horizrailenabled: false,
				cursorwidth: "10px",
				cursorcolor:"#008ed6",
				cursorborder: "0",
				cursorborderradius: "0",
				background: "#f1f1f1",
				railpadding: { top: 0, right: 0, left: 0, bottom: 0},
			});
			// $('body').getNiceScroll().resize();
		}
		


	});