/*1415405305,,JIT Construction: v1486784,en_US*/

/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
try {
(function(a,b,c,d){var e=a._fbq||(a._fbq=[]);if(e.push!==Array.prototype.push)return;var f=/^\d+$/,g='https://www.facebook.com/tr/',h={},i=[],j=c.href,k=b.referrer;function l(u){var v=[];for(var w=0,x=u.length;w<x;w++)v.push(u[w][0]+'='+encodeURIComponent(u[w][1]));return v.join('&');}function m(u,v){var w=function(){if(u.detachEvent){u.detachEvent('onload',w);}else u.onload=null;v();};if(u.attachEvent){u.attachEvent('onload',w);}else u.onload=w;}function n(u,v){var w='fb'+Math.random().toString().replace('.',''),x=b.createElement('form');x.method='post';x.action=u;x.target=w;x.acceptCharset='utf-8';x.style.display='none';var y=!!(a.attachEvent&&!a.addEventListener),z=y?'<iframe name="'+w+'">':'iframe',aa=b.createElement(z);aa.src='javascript:false';aa.id=w;aa.name=w;x.appendChild(aa);m(aa,function(){for(var ba=0,ca=v.length;ba<ca;ba++){var da=b.createElement('input');da.name=v[ba][0];da.value=v[ba][1];x.appendChild(da);}m(aa,function(){x.parentNode.removeChild(x);});x.submit();});b.body.appendChild(x);}h.addPixelId=function(u){i.push(u);};h.track=function(u,v){var w=typeof u;if(w!=='string'&&w!=='number')return false;if(f.test(u)){o(null,u,v);return true;}for(var x=0,y=i.length;x<y;x++)o(i[x],u,v);return i.length>0;};function o(u,v,w){var x=[];x.push(['id',u]);x.push(['ev',v]);x.push(['dl',j]);x.push(['rl',k]);x.push(['ts',new Date().valueOf()]);if(w&&typeof w==='object')for(var y in w)if(w.hasOwnProperty(y)){var z=w[y],aa=(z===null)?'null':typeof z;if(aa in {number:1,string:1,boolean:1}){x.push(['cd['+encodeURIComponent(y)+']',z]);}else if(aa==='object'){z=(typeof JSON==='undefined')?String(z):JSON.stringify(z);x.push(['cd['+encodeURIComponent(y)+']',z]);}}var ba=l(x);if(1024>(g+'?'+ba).length){var ca=new Image();ca.src=g+'?'+ba;}else n(g,x);}var p=function(u){if(Object.prototype.toString.call(u)!=='[object Array]')return false;var v=u.shift();if(!v)return false;var w=h[v];if(typeof w!=='function')return false;if(a._fbds){var x=a._fbds.pixelId;if(f.test(x)){i.push(x);delete a._fbds.pixelId;}}return w.apply(h,u);};for(var q=0,r=e.length;q<r;++q)p(e[q]);e.push=p;if(e.disablePushState===true)return;if(!d.pushState||!d.replaceState)return;var s=function(){k=j;j=c.href;e.push(['track','PixelInitialized']);},t=function(u,v,w){var x=u[v];u[v]=function(){var y=x.apply(this,arguments);w.apply(this,arguments);return y;};};t(d,'pushState',s);t(d,'replaceState',s);a.addEventListener('popstate',s,false);})(window,document,location,history);} catch (e) {new Image().src="http:\/\/www.facebook.com\/" + 'common/scribe_endpoint.php?c=jssdk_error&m='+encodeURIComponent('{"error":"LOAD", "extra": {"name":"'+e.name+'","line":"'+(e.lineNumber||e.line)+'","script":"'+(e.fileName||e.sourceURL||e.script)+'","stack":"'+(e.stackTrace||e.stack)+'","revision":"1486784","message":"'+e.message+'"}}');}