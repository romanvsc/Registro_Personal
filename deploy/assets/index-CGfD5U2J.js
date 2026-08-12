(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){let t=Object.create(null);for(let n of e.split(`,`))t[n]=1;return e=>e in t}var t={},n=[],r=()=>{},i=()=>!1,a=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),o=e=>e.startsWith(`onUpdate:`),s=Object.assign,c=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},l=Object.prototype.hasOwnProperty,u=(e,t)=>l.call(e,t),d=Array.isArray,f=e=>x(e)===`[object Map]`,p=e=>x(e)===`[object Set]`,m=e=>x(e)===`[object Date]`,h=e=>typeof e==`function`,g=e=>typeof e==`string`,_=e=>typeof e==`symbol`,v=e=>typeof e==`object`&&!!e,y=e=>(v(e)||h(e))&&h(e.then)&&h(e.catch),b=Object.prototype.toString,x=e=>b.call(e),ee=e=>x(e).slice(8,-1),S=e=>x(e)===`[object Object]`,te=e=>g(e)&&e!==`NaN`&&e[0]!==`-`&&``+parseInt(e,10)===e,ne=e(`,key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted`),re=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},ie=/-\w/g,C=re(e=>e.replace(ie,e=>e.slice(1).toUpperCase())),ae=/\B([A-Z])/g,oe=re(e=>e.replace(ae,`-$1`).toLowerCase()),se=re(e=>e.charAt(0).toUpperCase()+e.slice(1)),ce=re(e=>e?`on${se(e)}`:``),w=(e,t)=>!Object.is(e,t),le=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},T=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},ue=e=>{let t=parseFloat(e);return isNaN(t)?e:t},de,fe=()=>de||=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{};function pe(e){if(d(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],i=g(r)?_e(r):pe(r);if(i)for(let e in i)t[e]=i[e]}return t}if(g(e)||v(e))return e}var me=/;(?![^(]*\))/g,he=/:([^]+)/,ge=/\/\*[^]*?\*\//g;function _e(e){let t={};return e.replace(ge,``).split(me).forEach(e=>{if(e){let n=e.split(he);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function E(e){let t=``;if(g(e))t=e;else if(d(e))for(let n=0;n<e.length;n++){let r=E(e[n]);r&&(t+=r+` `)}else if(v(e))for(let n in e)e[n]&&(t+=n+` `);return t.trim()}var ve=`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`,ye=e(ve);ve+``;function be(e){return!!e||e===``}function xe(e,t){if(e.length!==t.length)return!1;let n=!0;for(let r=0;n&&r<e.length;r++)n=Se(e[r],t[r]);return n}function Se(e,t){if(e===t)return!0;let n=m(e),r=m(t);if(n||r)return n&&r?e.getTime()===t.getTime():!1;if(n=_(e),r=_(t),n||r)return e===t;if(n=d(e),r=d(t),n||r)return n&&r?xe(e,t):!1;if(n=v(e),r=v(t),n||r){if(!n||!r||Object.keys(e).length!==Object.keys(t).length)return!1;for(let n in e){let r=e.hasOwnProperty(n),i=t.hasOwnProperty(n);if(r&&!i||!r&&i||!Se(e[n],t[n]))return!1}}return String(e)===String(t)}function Ce(e,t){return e.findIndex(e=>Se(e,t))}var we=e=>!!(e&&e.__v_isRef===!0),D=e=>g(e)?e:e==null?``:d(e)||v(e)&&(e.toString===b||!h(e.toString))?we(e)?D(e.value):JSON.stringify(e,Te,2):String(e),Te=(e,t)=>we(t)?Te(e,t.value):f(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],r)=>(e[Ee(t,r)+` =>`]=n,e),{})}:p(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>Ee(e))}:_(t)?Ee(t):v(t)&&!d(t)&&!S(t)?String(t):t,Ee=(e,t=``)=>_(e)?`Symbol(${e.description??t})`:e,O,De=class{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&O&&(O.active?(this.parent=O,this.index=(O.scopes||(O.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].pause()}for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}let n=this.effects.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}}run(e){if(this._active){let t=O;try{return O=this,e()}finally{O=t}}}on(){++this._on===1&&(this.prevScope=O,O=this)}off(){if(this._on>0&&--this._on===0){if(O===this)O=this.prevScope;else{let e=O;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){let e=this.scopes.slice();for(t=0,n=e.length;t<n;t++)e[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){let e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.parent=void 0}}};function Oe(){return O}var k,ke=new WeakSet,Ae=class{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,O&&(O.active?O.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,ke.has(this)&&(ke.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Pe(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,qe(this),Le(this);let e=k,t=Ue;k=this,Ue=!0;try{return this.fn()}finally{Re(this),k=e,Ue=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Ve(e);this.deps=this.depsTail=void 0,qe(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?ke.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){ze(this)&&this.run()}get dirty(){return ze(this)}},je=0,Me,Ne;function Pe(e,t=!1){if(e.flags|=8,t){e.next=Ne,Ne=e;return}e.next=Me,Me=e}function Fe(){je++}function Ie(){if(--je>0)return;if(Ne){let e=Ne;for(Ne=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;for(;Me;){let t=Me;for(Me=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(t){e||=t}t=n}}if(e)throw e}function Le(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Re(e){let t,n=e.depsTail,r=n;for(;r;){let e=r.prevDep;r.version===-1?(r===n&&(n=e),Ve(r),He(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function ze(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Be(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Be(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Je)||(e.globalVersion=Je,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!ze(e))))return;e.flags|=2;let t=e.dep,n=k,r=Ue;k=e,Ue=!0;try{Le(e);let n=e.fn(e._value);(t.version===0||w(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(e){throw t.version++,e}finally{k=n,Ue=r,Re(e),e.flags&=-3}}function Ve(e,t=!1){let{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)Ve(e,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function He(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var Ue=!0,We=[];function Ge(){We.push(Ue),Ue=!1}function Ke(){let e=We.pop();Ue=e===void 0||e}function qe(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=k;k=void 0;try{t()}finally{k=e}}}var Je=0,Ye=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},Xe=class{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!k||!Ue||k===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==k)t=this.activeLink=new Ye(k,this),k.deps?(t.prevDep=k.depsTail,k.depsTail.nextDep=t,k.depsTail=t):k.deps=k.depsTail=t,Ze(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=k.depsTail,t.nextDep=void 0,k.depsTail.nextDep=t,k.depsTail=t,k.deps===t&&(k.deps=e)}return t}trigger(e){this.version++,Je++,this.notify(e)}notify(e){Fe();try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{Ie()}}};function Ze(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)Ze(e)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var Qe=new WeakMap,$e=Symbol(``),et=Symbol(``),tt=Symbol(``);function A(e,t,n){if(Ue&&k){let t=Qe.get(e);t||Qe.set(e,t=new Map);let r=t.get(n);r||(t.set(n,r=new Xe),r.map=t,r.key=n),r.track()}}function nt(e,t,n,r,i,a){let o=Qe.get(e);if(!o){Je++;return}let s=e=>{e&&e.trigger()};if(Fe(),t===`clear`)o.forEach(s);else{let i=d(e),a=i&&te(n);if(i&&n===`length`){let e=Number(r);o.forEach((t,n)=>{(n===`length`||n===tt||!_(n)&&n>=e)&&s(t)})}else switch((n!==void 0||o.has(void 0))&&s(o.get(n)),a&&s(o.get(tt)),t){case`add`:i?a&&s(o.get(`length`)):(s(o.get($e)),f(e)&&s(o.get(et)));break;case`delete`:i||(s(o.get($e)),f(e)&&s(o.get(et)));break;case`set`:f(e)&&s(o.get($e))}}Ie()}function rt(e){let t=j(e);return t===e?t:(A(t,`iterate`,tt),Ht(e)?t:t.map(Gt))}function it(e){return A(e=j(e),`iterate`,tt),e}function at(e,t){return Vt(e)?Kt(Bt(e)?Gt(t):t):Gt(t)}var ot={__proto__:null,[Symbol.iterator](){return st(this,Symbol.iterator,e=>at(this,e))},concat(...e){return rt(this).concat(...e.map(e=>d(e)?rt(e):e))},entries(){return st(this,`entries`,e=>(e[1]=at(this,e[1]),e))},every(e,t){return lt(this,`every`,e,t,void 0,arguments)},filter(e,t){return lt(this,`filter`,e,t,e=>e.map(e=>at(this,e)),arguments)},find(e,t){return lt(this,`find`,e,t,e=>at(this,e),arguments)},findIndex(e,t){return lt(this,`findIndex`,e,t,void 0,arguments)},findLast(e,t){return lt(this,`findLast`,e,t,e=>at(this,e),arguments)},findLastIndex(e,t){return lt(this,`findLastIndex`,e,t,void 0,arguments)},forEach(e,t){return lt(this,`forEach`,e,t,void 0,arguments)},includes(...e){return dt(this,`includes`,e)},indexOf(...e){return dt(this,`indexOf`,e)},join(e){return rt(this).join(e)},lastIndexOf(...e){return dt(this,`lastIndexOf`,e)},map(e,t){return lt(this,`map`,e,t,void 0,arguments)},pop(){return ft(this,`pop`)},push(...e){return ft(this,`push`,e)},reduce(e,...t){return ut(this,`reduce`,e,t)},reduceRight(e,...t){return ut(this,`reduceRight`,e,t)},shift(){return ft(this,`shift`)},some(e,t){return lt(this,`some`,e,t,void 0,arguments)},splice(...e){return ft(this,`splice`,e)},toReversed(){return rt(this).toReversed()},toSorted(e){return rt(this).toSorted(e)},toSpliced(...e){return rt(this).toSpliced(...e)},unshift(...e){return ft(this,`unshift`,e)},values(){return st(this,`values`,e=>at(this,e))}};function st(e,t,n){let r=it(e),i=r[t]();return r!==e&&!Ht(e)&&(i._next=i.next,i.next=()=>{let e=i._next();return e.done||(e.value=n(e.value)),e}),i}var ct=Array.prototype;function lt(e,t,n,r,i,a){let o=it(e),s=o!==e&&!Ht(e),c=o[t];if(c!==ct[t]){let t=c.apply(e,a);return s?Gt(t):t}let l=n;o!==e&&(s?l=function(t,r){return n.call(this,at(e,t),r,e)}:n.length>2&&(l=function(t,r){return n.call(this,t,r,e)}));let u=c.call(o,l,r);return s&&i?i(u):u}function ut(e,t,n,r){let i=it(e),a=i!==e&&!Ht(e),o=n,s=!1;i!==e&&(a?(s=r.length===0,o=function(t,r,i){return s&&(s=!1,t=at(e,t)),n.call(this,t,at(e,r),i,e)}):n.length>3&&(o=function(t,r,i){return n.call(this,t,r,i,e)}));let c=i[t](o,...r);return s?at(e,c):c}function dt(e,t,n){let r=j(e);A(r,`iterate`,tt);let i=r[t](...n);return(i===-1||i===!1)&&Ut(n[0])?(n[0]=j(n[0]),r[t](...n)):i}function ft(e,t,n=[]){Ge(),Fe();let r=j(e)[t].apply(e,n);return Ie(),Ke(),r}var pt=e(`__proto__,__v_isRef,__isVue`),mt=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!==`arguments`&&e!==`caller`).map(e=>Symbol[e]).filter(_));function ht(e){_(e)||(e=String(e));let t=j(this);return A(t,`has`,e),t.hasOwnProperty(e)}var gt=class{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if(t===`__v_skip`)return e.__v_skip;let r=this._isReadonly,i=this._isShallow;if(t===`__v_isReactive`)return!r;if(t===`__v_isReadonly`)return r;if(t===`__v_isShallow`)return i;if(t===`__v_raw`)return n===(r?i?Pt:Nt:i?Mt:jt).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let a=d(e);if(!r){let e;if(a&&(e=ot[t]))return e;if(t===`hasOwnProperty`)return ht}let o=Reflect.get(e,t,M(e)?e:n);if((_(t)?mt.has(t):pt(t))||(r||A(e,`get`,t),i))return o;if(M(o)){let e=a&&te(t)?o:o.value;return r&&v(e)?Rt(e):e}return v(o)?r?Rt(o):It(o):o}},_t=class extends gt{constructor(e=!1){super(!1,e)}set(e,t,n,r){let i=e[t],a=d(e)&&te(t);if(!this._isShallow){let e=Vt(i);if(!Ht(n)&&!Vt(n)&&(i=j(i),n=j(n)),!a&&M(i)&&!M(n))return e||(i.value=n),!0}let o=a?Number(t)<e.length:u(e,t),s=Reflect.set(e,t,n,M(e)?e:r);return e===j(r)&&s&&(o?w(n,i)&&nt(e,`set`,t,n,i):nt(e,`add`,t,n)),s}deleteProperty(e,t){let n=u(e,t),r=e[t],i=Reflect.deleteProperty(e,t);return i&&n&&nt(e,`delete`,t,void 0,r),i}has(e,t){let n=Reflect.has(e,t);return(!_(t)||!mt.has(t))&&A(e,`has`,t),n}ownKeys(e){return A(e,`iterate`,d(e)?`length`:$e),Reflect.ownKeys(e)}},vt=class extends gt{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}},yt=new _t,bt=new vt,xt=new _t(!0),St=e=>e,Ct=e=>Reflect.getPrototypeOf(e);function wt(e,t,n){return function(...r){let i=this.__v_raw,a=j(i),o=f(a),c=e===`entries`||e===Symbol.iterator&&o,l=e===`keys`&&o,u=i[e](...r),d=n?St:t?Kt:Gt;return!t&&A(a,`iterate`,l?et:$e),s(Object.create(u),{next(){let{value:e,done:t}=u.next();return t?{value:e,done:t}:{value:c?[d(e[0]),d(e[1])]:d(e),done:t}}})}}function Tt(e){return function(...t){return e===`delete`?!1:e===`clear`?void 0:this}}function Et(e,t){let n={get(n){let r=this.__v_raw,i=j(r),a=j(n);e||(w(n,a)&&A(i,`get`,n),A(i,`get`,a));let{has:o}=Ct(i),s=t?St:e?Kt:Gt;if(o.call(i,n))return s(r.get(n));if(o.call(i,a))return s(r.get(a));r!==i&&r.get(n)},get size(){let t=this.__v_raw;return!e&&A(j(t),`iterate`,$e),t.size},has(t){let n=this.__v_raw,r=j(n),i=j(t);return e||(w(t,i)&&A(r,`has`,t),A(r,`has`,i)),t===i?n.has(t):n.has(t)||n.has(i)},forEach(n,r){let i=this,a=i.__v_raw,o=j(a),s=t?St:e?Kt:Gt;return!e&&A(o,`iterate`,$e),a.forEach((e,t)=>n.call(r,s(e),s(t),i))}};return s(n,e?{add:Tt(`add`),set:Tt(`set`),delete:Tt(`delete`),clear:Tt(`clear`)}:{add(e){let n=j(this),r=Ct(n),i=j(e),a=!t&&!Ht(e)&&!Vt(e)?i:e;return r.has.call(n,a)||w(e,a)&&r.has.call(n,e)||w(i,a)&&r.has.call(n,i)||(n.add(a),nt(n,`add`,a,a)),this},set(e,n){!t&&!Ht(n)&&!Vt(n)&&(n=j(n));let r=j(this),{has:i,get:a}=Ct(r),o=i.call(r,e);o||=(e=j(e),i.call(r,e));let s=a.call(r,e);return r.set(e,n),o?w(n,s)&&nt(r,`set`,e,n,s):nt(r,`add`,e,n),this},delete(e){let t=j(this),{has:n,get:r}=Ct(t),i=n.call(t,e);i||=(e=j(e),n.call(t,e));let a=r?r.call(t,e):void 0,o=t.delete(e);return i&&nt(t,`delete`,e,void 0,a),o},clear(){let e=j(this),t=e.size!==0,n=e.clear();return t&&nt(e,`clear`,void 0,void 0,void 0),n}}),[`keys`,`values`,`entries`,Symbol.iterator].forEach(r=>{n[r]=wt(r,e,t)}),n}function Dt(e,t){let n=Et(e,t);return(t,r,i)=>r===`__v_isReactive`?!e:r===`__v_isReadonly`?e:r===`__v_raw`?t:Reflect.get(u(n,r)&&r in t?n:t,r,i)}var Ot={get:Dt(!1,!1)},kt={get:Dt(!1,!0)},At={get:Dt(!0,!1)},jt=new WeakMap,Mt=new WeakMap,Nt=new WeakMap,Pt=new WeakMap;function Ft(e){switch(e){case`Object`:case`Array`:return 1;case`Map`:case`Set`:case`WeakMap`:case`WeakSet`:return 2;default:return 0}}function It(e){return Vt(e)?e:zt(e,!1,yt,Ot,jt)}function Lt(e){return zt(e,!1,xt,kt,Mt)}function Rt(e){return zt(e,!0,bt,At,Nt)}function zt(e,t,n,r,i){if(!v(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let a=i.get(e);if(a)return a;let o=Ft(ee(e));if(o===0)return e;let s=new Proxy(e,o===2?r:n);return i.set(e,s),s}function Bt(e){return Vt(e)?Bt(e.__v_raw):!!(e&&e.__v_isReactive)}function Vt(e){return!!(e&&e.__v_isReadonly)}function Ht(e){return!!(e&&e.__v_isShallow)}function Ut(e){return e?!!e.__v_raw:!1}function j(e){let t=e&&e.__v_raw;return t?j(t):e}function Wt(e){return!u(e,`__v_skip`)&&Object.isExtensible(e)&&T(e,`__v_skip`,!0),e}var Gt=e=>v(e)?It(e):e,Kt=e=>v(e)?Rt(e):e;function M(e){return e?e.__v_isRef===!0:!1}function N(e){return Jt(e,!1)}function qt(e){return Jt(e,!0)}function Jt(e,t){return M(e)?e:new Yt(e,t)}var Yt=class{constructor(e,t){this.dep=new Xe,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?e:j(e),this._value=t?e:Gt(e),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(e){let t=this._rawValue,n=this.__v_isShallow||Ht(e)||Vt(e);e=n?e:j(e),w(e,t)&&(this._rawValue=e,this._value=n?e:Gt(e),this.dep.trigger())}};function P(e){return M(e)?e.value:e}var Xt={get:(e,t,n)=>t===`__v_raw`?e:P(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let i=e[t];return M(i)&&!M(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function Zt(e){return Bt(e)?e:new Proxy(e,Xt)}var Qt=class{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new Xe(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Je-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&k!==this)return Pe(this,!0),!0}get value(){let e=this.dep.track();return Be(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}};function $t(e,t,n=!1){let r,i;return h(e)?r=e:(r=e.get,i=e.set),new Qt(r,i,n)}var en={},tn=new WeakMap,nn=void 0;function rn(e,t=!1,n=nn){if(n){let t=tn.get(n);t||tn.set(n,t=[]),t.push(e)}}function an(e,n,i=t){let{immediate:a,deep:o,once:s,scheduler:l,augmentJob:u,call:f}=i,p=e=>o?e:Ht(e)||o===!1||o===0?on(e,1):on(e),m,g,_,v,y=!1,b=!1;if(M(e)?(g=()=>e.value,y=Ht(e)):Bt(e)?(g=()=>p(e),y=!0):d(e)?(b=!0,y=e.some(e=>Bt(e)||Ht(e)),g=()=>e.map(e=>{if(M(e))return e.value;if(Bt(e))return p(e);if(h(e))return f?f(e,2):e()})):g=h(e)?n?f?()=>f(e,2):e:()=>{if(_){Ge();try{_()}finally{Ke()}}let t=nn;nn=m;try{return f?f(e,3,[v]):e(v)}finally{nn=t}}:r,n&&o){let e=g,t=o===!0?1/0:o;g=()=>on(e(),t)}let x=Oe(),ee=()=>{m.stop(),x&&x.active&&c(x.effects,m)};if(s&&n){let e=n;n=(...t)=>{let n=e(...t);return ee(),n}}let S=b?Array(e.length).fill(en):en,te=e=>{if(!(!(m.flags&1)||!m.dirty&&!e)){if(n){let t=m.run();if(e||o||y||(b?t.some((e,t)=>w(e,S[t])):w(t,S))){_&&_();let e=nn;nn=m;try{let e=[t,S===en?void 0:b&&S[0]===en?[]:S,v];S=t,f?f(n,3,e):n(...e)}finally{nn=e}}}else m.run()}};return u&&u(te),m=new Ae(g),m.scheduler=l?()=>l(te,!1):te,v=e=>rn(e,!1,m),_=m.onStop=()=>{let e=tn.get(m);if(e){if(f)f(e,4);else for(let t of e)t();tn.delete(m)}},n?a?te(!0):S=m.run():l?l(te.bind(null,!0),!0):m.run(),ee.pause=m.pause.bind(m),ee.resume=m.resume.bind(m),ee.stop=ee,ee}function on(e,t=1/0,n){if(t<=0||!v(e)||e.__v_skip||(n||=new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,M(e))on(e.value,t,n);else if(d(e))for(let r=0;r<e.length;r++)on(e[r],t,n);else if(p(e)||f(e))e.forEach(e=>{on(e,t,n)});else if(S(e)){for(let r in e)on(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&on(e[r],t,n)}return e}function sn(e,t,n,r){try{return r?e(...r):e()}catch(e){ln(e,t,n)}}function cn(e,t,n,r){if(h(e)){let i=sn(e,t,n,r);return i&&y(i)&&i.catch(e=>{ln(e,t,n)}),i}if(d(e)){let i=[];for(let a=0;a<e.length;a++)i.push(cn(e[a],t,n,r));return i}}function ln(e,n,r,i=!0){let a=n?n.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:s}=n&&n.appContext.config||t;if(n){let t=n.parent,i=n.proxy,a=`https://vuejs.org/error-reference/#runtime-${r}`;for(;t;){let n=t.ec;if(n){for(let t=0;t<n.length;t++)if(n[t](e,i,a)===!1)return}t=t.parent}if(o){Ge(),sn(o,null,10,[e,i,a]),Ke();return}}un(e,r,a,i,s)}function un(e,t,n,r=!0,i=!1){if(i)throw e;console.error(e)}var F=[],dn=-1,fn=[],pn=null,mn=0,hn=Promise.resolve(),gn=null;function _n(e){let t=gn||hn;return e?t.then(this?e.bind(this):e):t}function vn(e){let t=dn+1,n=F.length;for(;t<n;){let r=t+n>>>1,i=F[r],a=wn(i);a<e||a===e&&i.flags&2?t=r+1:n=r}return t}function yn(e){if(!(e.flags&1)){let t=wn(e),n=F[F.length-1];!n||!(e.flags&2)&&t>=wn(n)?F.push(e):F.splice(vn(t),0,e),e.flags|=1,bn()}}function bn(){gn||=hn.then(Tn)}function xn(e){if(!d(e))pn&&e.id===-1?pn.splice(mn+1,0,e):e.flags&1||(fn.push(e),e.flags|=1);else for(let t=0;t<e.length;t++)fn.push(e[t]);bn()}function Sn(e,t,n=dn+1){for(;n<F.length;n++){let t=F[n];if(t&&t.flags&2){if(e&&t.id!==e.uid)continue;F.splice(n,1),n--,t.flags&4&&(t.flags&=-2),t(),t.flags&4||(t.flags&=-2)}}}function Cn(e){if(fn.length){let e=[...new Set(fn)].sort((e,t)=>wn(e)-wn(t));if(fn.length=0,pn){for(let t=0;t<e.length;t++)pn.push(e[t]);return}for(pn=e,mn=0;mn<pn.length;mn++){let e=pn[mn];e.flags&4&&(e.flags&=-2),e.flags&8||e(),e.flags&=-2}pn=null,mn=0}}var wn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Tn(e){try{for(dn=0;dn<F.length;dn++){let e=F[dn];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),sn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;dn<F.length;dn++){let e=F[dn];e&&(e.flags&=-2)}dn=-1,F.length=0,Cn(e),gn=null,(F.length||fn.length)&&Tn(e)}}var En=null,Dn=null;function On(e){let t=En;return En=e,Dn=e&&e.type.__scopeId||null,t}function kn(e,t=En,n){if(!t||e._n)return e;let r=(...n)=>{r._d&&Bi(-1);let i=On(t),a=Ii.length,o;try{o=e(...n)}finally{for(let e=Ii.length;e>a;e--)Ri();On(i),r._d&&Bi(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function An(e,n){if(En===null)return e;let r=ba(En),i=e.dirs||=[];for(let e=0;e<n.length;e++){let[a,o,s,c=t]=n[e];a&&(h(a)&&(a={mounted:a,updated:a}),a.deep&&on(o),i.push({dir:a,instance:r,value:o,oldValue:void 0,arg:s,modifiers:c}))}return e}function jn(e,t,n,r){let i=e.dirs,a=t&&t.dirs;for(let o=0;o<i.length;o++){let s=i[o];a&&(s.oldValue=a[o].value);let c=s.dir[r];c&&(Ge(),cn(c,n,8,[e.el,s,e,t]),Ke())}}function Mn(e,t){if(W){let n=W.provides,r=W.parent&&W.parent.provides;r===n&&(n=W.provides=Object.create(r)),n[e]=t}}function Nn(e,t,n=!1){let r=aa();if(r||Wr){let i=Wr?Wr._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(i&&e in i)return i[e];if(arguments.length>1)return n&&h(t)?t.call(r&&r.proxy):t}}var Pn=Symbol.for(`v-scx`),Fn=()=>Nn(Pn);function In(e,t,n){return Ln(e,t,n)}function Ln(e,n,i=t){let{immediate:a,deep:o,flush:c,once:l}=i,u=s({},i),d=n&&a||!n&&c!==`post`,f;if(da){if(c===`sync`){let e=Fn();f=e.__watcherHandles||=[]}else if(!d){let e=()=>{};return e.stop=r,e.resume=r,e.pause=r,e}}let p=W;u.call=(e,t,n)=>cn(e,p,t,n);let m=!1;c===`post`?u.scheduler=e=>{L(e,p&&p.suspense)}:c!==`sync`&&(m=!0,u.scheduler=(e,t)=>{t?e():yn(e)}),u.augmentJob=e=>{n&&(e.flags|=4),m&&(e.flags|=2,p&&(e.id=p.uid,e.i=p))};let h=an(e,n,u);return da&&(f?f.push(h):d&&h()),h}function Rn(e,t,n){let r=this.proxy,i=g(e)?e.includes(`.`)?zn(r,e):()=>r[e]:e.bind(r,r),a;h(t)?a=t:(a=t.handler,n=t);let o=ca(this),s=Ln(i,a.bind(r),n);return o(),s}function zn(e,t){let n=t.split(`.`);return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}var Bn=Symbol(`_vte`),Vn=e=>e.__isTeleport,Hn=Symbol(`_leaveCb`);function Un(e){let t=e[0];if(e.length>1){for(let n of e)if(n.type!==Pi){t=n;break}}return t}function Wn(e){if(!$n(e))return Vn(e.type)&&e.children?Un(e.children):e;if(e.component)return e.component.subTree;let{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&h(n.default))return n.default()}}function Gn(e,t){if(e.shapeFlag&6&&e.component){e.transition=t;let n=e.component.subTree;Gn(Vn(n.type)&&Wn(n)||n,t)}else e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Kn(e,t){return h(e)?s({name:e.name},t,{setup:e}):e}function qn(e){e.ids=[e.ids[0]+e.ids[2]+++`-`,0,0]}function Jn(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}var Yn=new WeakMap;function Xn(e,n,r,a,o=!1){if(d(e)){e.forEach((e,t)=>Xn(e,n&&(d(n)?n[t]:n),r,a,o));return}if(Qn(a)&&!o){a.shapeFlag&512&&a.type.__asyncResolved&&a.component.subTree.component&&Xn(e,n,r,a.component.subTree);return}let s=a.shapeFlag&4?ba(a.component):a.el,l=o?null:s,{i:f,r:p}=e,m=n&&n.r,_=f.refs===t?f.refs={}:f.refs,v=f.setupState,y=j(v),b=v===t?i:e=>!Jn(_,e)&&u(y,e),x=(e,t)=>!(t&&Jn(_,t));if(m!=null&&m!==p){if(Zn(n),g(m))_[m]=null,b(m)&&(v[m]=null);else if(M(m)){let e=n;x(m,e.k)&&(m.value=null),e.k&&(_[e.k]=null)}}if(h(p))sn(p,f,12,[l,_]);else{let t=g(p),n=M(p);if(t||n){let i=()=>{if(e.f){let n=t?b(p)?v[p]:_[p]:x(p)||!e.k?p.value:_[e.k];if(o)d(n)&&c(n,s);else if(d(n))n.includes(s)||n.push(s);else if(t)_[p]=[s],b(p)&&(v[p]=_[p]);else{let t=[s];x(p,e.k)&&(p.value=t),e.k&&(_[e.k]=t)}}else t?(_[p]=l,b(p)&&(v[p]=l)):n&&(x(p,e.k)&&(p.value=l),e.k&&(_[e.k]=l))};if(l){let t=()=>{i(),Yn.delete(e)};t.id=-1,Yn.set(e,t),L(t,r)}else Zn(e),i()}}}function Zn(e){let t=Yn.get(e);t&&(t.flags|=8,Yn.delete(e))}fe().requestIdleCallback,fe().cancelIdleCallback;var Qn=e=>!!e.type.__asyncLoader,$n=e=>e.type.__isKeepAlive;function er(e,t){nr(e,`a`,t)}function tr(e,t){nr(e,`da`,t)}function nr(e,t,n=W){let r=e.__wdc||=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent}return e()};if(ir(t,r,n),n){let e=n.parent;for(;e&&e.parent;)$n(e.parent.vnode)&&rr(r,t,n,e),e=e.parent}}function rr(e,t,n,r){let i=ir(t,e,r,!0);dr(()=>{c(r[t],i)},n)}function ir(e,t,n=W,r=!1){if(n){let i=n[e]||(n[e]=[]),a=t.__weh||=(...r)=>{Ge();let i=ca(n),a=cn(t,n,e,r);return i(),Ke(),a};return r?i.unshift(a):i.push(a),a}}var ar=e=>(t,n=W)=>{(!da||e===`sp`)&&ir(e,(...e)=>t(...e),n)},or=ar(`bm`),sr=ar(`m`),cr=ar(`bu`),lr=ar(`u`),ur=ar(`bum`),dr=ar(`um`),fr=ar(`sp`),pr=ar(`rtg`),mr=ar(`rtc`);function hr(e,t=W){ir(`ec`,e,t)}var gr=`components`;function _r(e,t){return yr(gr,e,!0,t)||e}var vr=Symbol.for(`v-ndc`);function yr(e,t,n=!0,r=!1){let i=En||W;if(i){let n=i.type;if(e===gr){let e=xa(n,!1);if(e&&(e===t||e===C(t)||e===se(C(t))))return n}let a=br(i[e]||n[e],t)||br(i.appContext[e],t);return!a&&r?n:a}}function br(e,t){return e&&(e[t]||e[C(t)]||e[se(C(t))])}function xr(e,t,n,r){let i,a=n&&n[r],o=d(e);if(o||g(e)){let n=o&&Bt(e),r=!1,s=!1;n&&(r=!Ht(e),s=Vt(e),e=it(e)),i=Array(e.length);for(let n=0,o=e.length;n<o;n++)i[n]=t(r?s?Kt(Gt(e[n])):Gt(e[n]):e[n],n,void 0,a&&a[n])}else if(typeof e==`number`){i=Array(e);for(let n=0;n<e;n++)i[n]=t(n+1,n,void 0,a&&a[n])}else if(v(e)){if(e[Symbol.iterator])i=Array.from(e,(e,n)=>t(e,n,void 0,a&&a[n]));else{let n=Object.keys(e);i=Array(n.length);for(let r=0,o=n.length;r<o;r++){let o=n[r];i[r]=t(e[o],o,r,a&&a[r])}}}else i=[];return n&&(n[r]=i),i}var Sr=e=>e?ua(e)?ba(e):Sr(e.parent):null,Cr=s(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>Sr(e.parent),$root:e=>Sr(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Mr(e),$forceUpdate:e=>e.f||=()=>{yn(e.update)},$nextTick:e=>e.n||=_n.bind(e.proxy),$watch:e=>Rn.bind(e)}),wr=(e,n)=>e!==t&&!e.__isScriptSetup&&u(e,n),Tr={get({_:e},n){if(n===`__v_skip`)return!0;let{ctx:r,setupState:i,data:a,props:o,accessCache:s,type:c,appContext:l}=e;if(n[0]!==`$`){let e=s[n];if(e!==void 0)switch(e){case 1:return i[n];case 2:return a[n];case 4:return r[n];case 3:return o[n]}else if(wr(i,n))return s[n]=1,i[n];else if(a!==t&&u(a,n))return s[n]=2,a[n];else if(u(o,n))return s[n]=3,o[n];else if(r!==t&&u(r,n))return s[n]=4,r[n];else Dr&&(s[n]=0)}let d=Cr[n],f,p;if(d)return n===`$attrs`&&A(e.attrs,`get`,``),d(e);if((f=c.__cssModules)&&(f=f[n]))return f;if(r!==t&&u(r,n))return s[n]=4,r[n];if(p=l.config.globalProperties,u(p,n))return p[n]},set({_:e},n,r){let{data:i,setupState:a,ctx:o}=e;return wr(a,n)?(a[n]=r,!0):i!==t&&u(i,n)?(i[n]=r,!0):u(e.props,n)||n[0]===`$`&&n.slice(1)in e?!1:(o[n]=r,!0)},has({_:{data:e,setupState:n,accessCache:r,ctx:i,appContext:a,props:o,type:s}},c){let l;return!!(r[c]||e!==t&&c[0]!==`$`&&u(e,c)||wr(n,c)||u(o,c)||u(i,c)||u(Cr,c)||u(a.config.globalProperties,c)||(l=s.__cssModules)&&l[c])},defineProperty(e,t,n){return n.get==null?u(n,`value`)&&this.set(e,t,n.value,null):e._.accessCache[t]=0,Reflect.defineProperty(e,t,n)}};function Er(e){return d(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}var Dr=!0;function Or(e){let t=Mr(e),n=e.proxy,i=e.ctx;Dr=!1,t.beforeCreate&&Ar(t.beforeCreate,e,`bc`);let{data:a,computed:o,methods:s,watch:c,provide:l,inject:u,created:f,beforeMount:p,mounted:m,beforeUpdate:g,updated:_,activated:y,deactivated:b,beforeDestroy:x,beforeUnmount:ee,destroyed:S,unmounted:te,render:ne,renderTracked:re,renderTriggered:ie,errorCaptured:C,serverPrefetch:ae,expose:oe,inheritAttrs:se,components:ce,directives:w,filters:le}=t;if(u&&kr(u,i,null),s)for(let e in s){let t=s[e];h(t)&&(i[e]=t.bind(n))}if(a){let t=a.call(n,n);v(t)&&(e.data=It(t))}if(Dr=!0,o)for(let e in o){let t=o[e],a=G({get:h(t)?t.bind(n,n):h(t.get)?t.get.bind(n,n):r,set:!h(t)&&h(t.set)?t.set.bind(n):r});Object.defineProperty(i,e,{enumerable:!0,configurable:!0,get:()=>a.value,set:e=>a.value=e})}if(c)for(let e in c)jr(c[e],i,n,e);if(l){let e=h(l)?l.call(n):l;Reflect.ownKeys(e).forEach(t=>{Mn(t,e[t])})}f&&Ar(f,e,`c`);function T(e,t){d(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n))}if(T(or,p),T(sr,m),T(cr,g),T(lr,_),T(er,y),T(tr,b),T(hr,C),T(mr,re),T(pr,ie),T(ur,ee),T(dr,te),T(fr,ae),d(oe)){if(oe.length){let t=e.exposed||={};oe.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0})})}else e.exposed||={}}ne&&e.render===r&&(e.render=ne),se!=null&&(e.inheritAttrs=se),ce&&(e.components=ce),w&&(e.directives=w),ae&&qn(e)}function kr(e,t,n=r){d(e)&&(e=Lr(e));for(let n in e){let r=e[n],i;i=v(r)?`default`in r?Nn(r.from||n,r.default,!0):Nn(r.from||n):Nn(r),M(i)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e}):t[n]=i}}function Ar(e,t,n){cn(d(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n)}function jr(e,t,n,r){let i=r.includes(`.`)?zn(n,r):()=>n[r];if(g(e)){let n=t[e];h(n)&&In(i,n)}else if(h(e))In(i,e.bind(n));else if(v(e)){if(d(e))e.forEach(e=>jr(e,t,n,r));else{let r=h(e.handler)?e.handler.bind(n):t[e.handler];h(r)&&In(i,r,e)}}}function Mr(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:i,optionsCache:a,config:{optionMergeStrategies:o}}=e.appContext,s=a.get(t),c;return s?c=s:!i.length&&!n&&!r?c=t:(c={},i.length&&i.forEach(e=>Nr(c,e,o,!0)),Nr(c,t,o)),v(t)&&a.set(t,c),c}function Nr(e,t,n,r=!1){let{mixins:i,extends:a}=t;a&&Nr(e,a,n,!0),i&&i.forEach(t=>Nr(e,t,n,!0));for(let i in t)if(!(r&&i===`expose`)){let r=Pr[i]||n&&n[i];e[i]=r?r(e[i],t[i]):t[i]}return e}var Pr={data:Fr,props:zr,emits:zr,methods:Rr,computed:Rr,beforeCreate:I,created:I,beforeMount:I,mounted:I,beforeUpdate:I,updated:I,beforeDestroy:I,beforeUnmount:I,destroyed:I,unmounted:I,activated:I,deactivated:I,errorCaptured:I,serverPrefetch:I,components:Rr,directives:Rr,watch:Br,provide:Fr,inject:Ir};function Fr(e,t){return t?e?function(){return s(h(e)?e.call(this,this):e,h(t)?t.call(this,this):t)}:t:e}function Ir(e,t){return Rr(Lr(e),Lr(t))}function Lr(e){if(d(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function I(e,t){return e?[...new Set([].concat(e,t))]:t}function Rr(e,t){return e?s(Object.create(null),e,t):t}function zr(e,t){return e?d(e)&&d(t)?[...new Set([...e,...t])]:s(Object.create(null),Er(e),Er(t??{})):t}function Br(e,t){if(!e)return t;if(!t)return e;let n=s(Object.create(null),e);for(let r in t)n[r]=I(e[r],t[r]);return n}function Vr(){return{app:null,config:{isNativeTag:i,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Hr=0;function Ur(e,t){return function(n,r=null){h(n)||(n=s({},n)),r!=null&&!v(r)&&(r=null);let i=Vr(),a=new WeakSet,o=[],c=!1,l=i.app={_uid:Hr++,_component:n,_props:r,_container:null,_context:i,_instance:null,version:wa,get config(){return i.config},set config(e){},use(e,...t){return a.has(e)||(e&&h(e.install)?(a.add(e),e.install(l,...t)):h(e)&&(a.add(e),e(l,...t))),l},mixin(e){return i.mixins.includes(e)||i.mixins.push(e),l},component(e,t){return t?(i.components[e]=t,l):i.components[e]},directive(e,t){return t?(i.directives[e]=t,l):i.directives[e]},mount(a,o,s){if(!c){let u=l._ceVNode||H(n,r);return u.appContext=i,s===!0?s=`svg`:s===!1&&(s=void 0),o&&t?t(u,a):e(u,a,s),c=!0,l._container=a,a.__vue_app__=l,ba(u.component)}},onUnmount(e){o.push(e)},unmount(){c&&(cn(o,l._instance,16),e(null,l._container),delete l._container.__vue_app__)},provide(e,t){return i.provides[e]=t,l},runWithContext(e){let t=Wr;Wr=l;try{return e()}finally{Wr=t}}};return l}}var Wr=null,Gr=(e,t)=>t===`modelValue`||t===`model-value`?e.modelModifiers:e[`${t}Modifiers`]||e[`${C(t)}Modifiers`]||e[`${oe(t)}Modifiers`];function Kr(e,n,...r){if(e.isUnmounted)return;let i=e.vnode.props||t,a=r,o=n.startsWith(`update:`),s=o&&Gr(i,n.slice(7));s&&(s.trim&&(a=r.map(e=>g(e)?e.trim():e)),s.number&&(a=r.map(ue)));let c,l=i[c=ce(n)]||i[c=ce(C(n))];!l&&o&&(l=i[c=ce(oe(n))]),l&&cn(l,e,6,a);let u=i[c+`Once`];if(u){if(!e.emitted)e.emitted={};else if(e.emitted[c])return;e.emitted[c]=!0,cn(u,e,6,a)}}var qr=new WeakMap;function Jr(e,t,n=!1){let r=n?qr:t.emitsCache,i=r.get(e);if(i!==void 0)return i;let a=e.emits,o={},c=!1;if(!h(e)){let r=e=>{let n=Jr(e,t,!0);n&&(c=!0,s(o,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return!a&&!c?(v(e)&&r.set(e,null),null):(d(a)?a.forEach(e=>o[e]=null):s(o,a),v(e)&&r.set(e,o),o)}function Yr(e,t){return!e||!a(t)?!1:(t=t.slice(2),t=t===`Once`?t:t.replace(/Once$/,``),u(e,t[0].toLowerCase()+t.slice(1))||u(e,oe(t))||u(e,t))}function Xr(e){let{type:t,vnode:n,proxy:r,withProxy:i,propsOptions:[a],slots:s,attrs:c,emit:l,render:u,renderCache:d,props:f,data:p,setupState:m,ctx:h,inheritAttrs:g}=e,_=On(e),v,y;try{if(n.shapeFlag&4){let e=i||r,t=e;v=Zi(u.call(t,e,d,f,m,p,h)),y=c}else{let e=t;v=Zi(e.length>1?e(f,{attrs:c,slots:s,emit:l}):e(f,null)),y=t.props?c:Zr(c)}}catch(t){Ii.length=0,ln(t,e,1),v=H(Pi)}let b=v;if(y&&g!==!1){let e=Object.keys(y),{shapeFlag:t}=b;e.length&&t&7&&(a&&e.some(o)&&(y=Qr(y,a)),b=Yi(b,y,!1,!0))}return n.dirs&&(b=Yi(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&Gn(Vn(b.type)&&Wn(b)||b,n.transition),v=b,On(_),v}var Zr=e=>{let t;for(let n in e)(n===`class`||n===`style`||a(n))&&((t||={})[n]=e[n]);return t},Qr=(e,t)=>{let n={};for(let r in e)(!o(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function $r(e,t,n){let{props:r,children:i,component:a}=e,{props:o,children:s,patchFlag:c}=t,l=a.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?ei(r,o,l):!!o;if(c&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t];if(ti(o,r,n)&&!Yr(l,n))return!0}}}else return(i||s)&&(!s||!s.$stable)?!0:r===o?!1:r?!o||ei(r,o,l):!!o;return!1}function ei(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){let a=r[i];if(ti(t,e,a)&&!Yr(n,a))return!0}return!1}function ti(e,t,n){let r=e[n],i=t[n];return n===`style`&&v(r)&&v(i)?!Se(r,i):r!==i}function ni({vnode:e,parent:t,suspense:n},r){for(;t;){let n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.suspense.vnode.el=n.el=r,e=n),n===e)(e=t.vnode).el=r,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=r)}var ri={},ii=()=>Object.create(ri),ai=e=>Object.getPrototypeOf(e)===ri;function oi(e,t,n,r=!1){let i={},a=ii();e.propsDefaults=Object.create(null),ci(e,t,i,a);for(let t in e.propsOptions[0])t in i||(i[t]=void 0);e.props=n?r?i:Lt(i):e.type.props?i:a,e.attrs=a}function si(e,t,n,r){let{props:i,attrs:a,vnode:{patchFlag:o}}=e,s=j(i),[c]=e.propsOptions,l=!1;if((r||o>0)&&!(o&16)){if(o&8){let n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let o=n[r];if(Yr(e.emitsOptions,o))continue;let d=t[o];if(c){if(u(a,o))d!==a[o]&&(a[o]=d,l=!0);else{let t=C(o);i[t]=li(c,s,t,d,e,!1)}}else d!==a[o]&&(a[o]=d,l=!0)}}}else{ci(e,t,i,a)&&(l=!0);let r;for(let a in s)(!t||!u(t,a)&&((r=oe(a))===a||!u(t,r)))&&(c?n&&(n[a]!==void 0||n[r]!==void 0)&&(i[a]=li(c,s,a,void 0,e,!0)):delete i[a]);if(a!==s)for(let e in a)(!t||!u(t,e))&&(delete a[e],l=!0)}l&&nt(e.attrs,`set`,``)}function ci(e,n,r,i){let[a,o]=e.propsOptions,s=!1,c;if(n)for(let t in n){if(ne(t))continue;let l=n[t],d;a&&u(a,d=C(t))?!o||!o.includes(d)?r[d]=l:(c||={})[d]=l:Yr(e.emitsOptions,t)||(!(t in i)||l!==i[t])&&(i[t]=l,s=!0)}if(o){let n=j(r),i=c||t;for(let t=0;t<o.length;t++){let s=o[t];r[s]=li(a,n,s,i[s],e,!u(i,s))}}return s}function li(e,t,n,r,i,a){let o=e[n];if(o!=null){let e=u(o,`default`);if(e&&r===void 0){let e=o.default;if(o.type!==Function&&!o.skipFactory&&h(e)){let{propsDefaults:a}=i;if(n in a)r=a[n];else{let o=ca(i);r=a[n]=e.call(null,t),o()}}else r=e;i.ce&&i.ce._setProp(n,r)}o[0]&&(a&&!e?r=!1:o[1]&&(r===``||r===oe(n))&&(r=!0))}return r}var ui=new WeakMap;function di(e,r,i=!1){let a=i?ui:r.propsCache,o=a.get(e);if(o)return o;let c=e.props,l={},f=[],p=!1;if(!h(e)){let t=e=>{p=!0;let[t,n]=di(e,r,!0);s(l,t),n&&f.push(...n)};!i&&r.mixins.length&&r.mixins.forEach(t),e.extends&&t(e.extends),e.mixins&&e.mixins.forEach(t)}if(!c&&!p)return v(e)&&a.set(e,n),n;if(d(c))for(let e=0;e<c.length;e++){let n=C(c[e]);fi(n)&&(l[n]=t)}else if(c)for(let e in c){let t=C(e);if(fi(t)){let n=c[e],r=l[t]=d(n)||h(n)?{type:n}:s({},n),i=r.type,a=!1,o=!0;if(d(i))for(let e=0;e<i.length;++e){let t=i[e],n=h(t)&&t.name;if(n===`Boolean`){a=!0;break}n===`String`&&(o=!1)}else a=h(i)&&i.name===`Boolean`;r[0]=a,r[1]=o,(a||u(r,`default`))&&f.push(t)}}let m=[l,f];return v(e)&&a.set(e,m),m}function fi(e){return e[0]!==`$`&&!ne(e)}var pi=e=>e===`_`||e===`_ctx`||e===`$stable`,mi=e=>d(e)?e.map(Zi):[Zi(e)],hi=(e,t,n)=>{if(t._n)return t;let r=kn((...e)=>mi(t(...e)),n);return r._c=!1,r},gi=(e,t,n)=>{let r=e._ctx;for(let n in e){if(pi(n))continue;let i=e[n];if(h(i))t[n]=hi(n,i,r);else if(i!=null){let e=mi(i);t[n]=()=>e}}},_i=(e,t)=>{let n=mi(t);e.slots.default=()=>n},vi=(e,t,n)=>{for(let r in t)(n||!pi(r))&&(e[r]=t[r])},yi=(e,t,n)=>{let r=e.slots=ii();if(e.vnode.shapeFlag&32){let e=t._;e?(vi(r,t,n),n&&T(r,`_`,e,!0)):gi(t,r)}else t&&_i(e,t)},bi=(e,n,r)=>{let{vnode:i,slots:a}=e,o=!0,s=t;if(i.shapeFlag&32){let e=n._;e?r&&e===1?o=!1:vi(a,n,r):(o=!n.$stable,gi(n,a)),s=n}else n&&(_i(e,n),s={default:1});if(o)for(let e in a)!pi(e)&&s[e]==null&&delete a[e]},L=Mi;function xi(e){return Si(e)}function Si(e,i){let a=fe();a.__VUE__=!0;let{insert:o,remove:s,patchProp:c,createElement:l,createText:u,createComment:d,setText:f,setElementText:p,parentNode:m,nextSibling:h,setScopeId:g=r,insertStaticContent:_}=e,v=(e,t,n,r=null,i=null,a=null,o=void 0,s=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!Wi(e,t)&&(r=Se(e),E(e,i,a,!0),e=null),t.patchFlag===-2&&(c=!1,t.dynamicChildren=null);let{type:l,ref:u,shapeFlag:d}=t;switch(l){case Ni:y(e,t,n,r);break;case Pi:b(e,t,n,r);break;case Fi:e??x(t,n,r,o);break;case R:ce(e,t,n,r,i,a,o,s,c);break;default:d&1?te(e,t,n,r,i,a,o,s,c):d&6?w(e,t,n,r,i,a,o,s,c):(d&64||d&128)&&l.process(e,t,n,r,i,a,o,s,c,D)}u!=null&&i?Xn(u,e&&e.ref,a,t||e,!t):u==null&&e&&e.ref!=null&&Xn(e.ref,null,a,e,!0)},y=(e,t,n,r)=>{if(e==null)o(t.el=u(t.children),n,r);else{let n=t.el=e.el;t.children!==e.children&&f(n,t.children)}},b=(e,t,n,r)=>{e==null?o(t.el=d(t.children||``),n,r):t.el=e.el},x=(e,t,n,r)=>{[e.el,e.anchor]=_(e.children,t,n,r,e.el,e.anchor)},ee=({el:e,anchor:t},n,r)=>{let i;for(;e&&e!==t;)i=h(e),o(e,n,r),e=i;o(t,n,r)},S=({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=h(e),s(e),e=n;s(t)},te=(e,t,n,r,i,a,o,s,c)=>{if(t.type===`svg`?o=`svg`:t.type===`math`&&(o=`mathml`),e==null)re(t,n,r,i,a,o,s,c);else{let n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),ae(e,t,i,a,o,s,c)}finally{n&&n._endPatch()}}},re=(e,t,n,r,i,a,s,u)=>{let d,f,{props:m,shapeFlag:h,transition:g,dirs:_}=e;if(d=e.el=l(e.type,a,m&&m.is,m),h&8?p(d,e.children):h&16&&C(e.children,d,null,r,i,Ci(e,a),s,u),_&&jn(e,null,r,`created`),ie(d,e,e.scopeId,s,r),m){for(let e in m)e!==`value`&&!ne(e)&&c(d,e,null,m[e],a,r);`value`in m&&c(d,`value`,null,m.value,a),(f=m.onVnodeBeforeMount)&&ta(f,r,e)}_&&jn(e,null,r,`beforeMount`);let v=Ti(i,g);v&&g.beforeEnter(d),o(d,t,n),((f=m&&m.onVnodeMounted)||v||_)&&L(()=>{try{f&&ta(f,r,e),v&&g.enter(d),_&&jn(e,null,r,`mounted`)}finally{}},i)},ie=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let t=0;t<r.length;t++)g(e,r[t]);if(i){let n=i.subTree;if(t===n||ji(n.type)&&(n.ssContent===t||n.ssFallback===t)){let t=i.vnode;ie(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},C=(e,t,n,r,i,a,o,s,c=0)=>{for(let l=c;l<e.length;l++){let c=e[l]=s?Qi(e[l]):Zi(e[l]);v(null,c,t,n,r,i,a,o,s)}},ae=(e,n,r,i,a,o,s)=>{let l=n.el=e.el,{patchFlag:u,dynamicChildren:d,dirs:f}=n;u|=e.patchFlag&16;let m=e.props||t,h=n.props||t,g;if(r&&wi(r,!1),(g=h.onVnodeBeforeUpdate)&&ta(g,r,n,e),f&&jn(n,e,r,`beforeUpdate`),r&&wi(r,!0),d&&(!e.dynamicChildren||e.dynamicChildren.length!==d.length)&&(u=0,s=!1,d=null),(m.innerHTML&&h.innerHTML==null||m.textContent&&h.textContent==null)&&p(l,``),d?oe(e.dynamicChildren,d,l,r,i,Ci(n,a),o):s||me(e,n,l,null,r,i,Ci(n,a),o,!1),u>0){if(u&16)se(l,m,h,r,a);else if(u&2&&m.class!==h.class&&c(l,`class`,null,h.class,a),u&4&&c(l,`style`,m.style,h.style,a),u&8){let e=n.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t],i=m[n],o=h[n];(o!==i||n===`value`)&&c(l,n,i,o,a,r)}}u&1&&e.children!==n.children&&p(l,n.children)}else!s&&d==null&&se(l,m,h,r,a);((g=h.onVnodeUpdated)||f)&&L(()=>{g&&ta(g,r,n,e),f&&jn(n,e,r,`updated`)},i)},oe=(e,t,n,r,i,a,o)=>{for(let s=0;s<t.length;s++){let c=e[s],l=t[s],u=c.el&&(c.type===R||!Wi(c,l)||c.shapeFlag&198)?m(c.el):n;v(c,l,u,null,r,i,a,o,!0)}},se=(e,n,r,i,a)=>{if(n!==r){if(n!==t)for(let t in n)!ne(t)&&!(t in r)&&c(e,t,n[t],null,a,i);for(let t in r){if(ne(t))continue;let o=r[t],s=n[t];o!==s&&t!==`value`&&c(e,t,s,o,a,i)}`value`in r&&c(e,`value`,n.value,r.value,a)}},ce=(e,t,n,r,i,a,s,c,l)=>{let d=t.el=e?e.el:u(``),f=t.anchor=e?e.anchor:u(``),{patchFlag:p,dynamicChildren:m,slotScopeIds:h}=t;h&&(c=c?c.concat(h):h),e==null?(o(d,n,r),o(f,n,r),C(t.children||[],n,f,i,a,s,c,l)):p>0&&p&64&&m&&e.dynamicChildren&&e.dynamicChildren.length===m.length?(oe(e.dynamicChildren,m,n,i,a,s,c),(t.key!=null||i&&t===i.subTree)&&Ei(e,t,!0)):me(e,t,n,f,i,a,s,c,l)},w=(e,t,n,r,i,a,o,s,c)=>{t.slotScopeIds=s,e==null?t.shapeFlag&512?i.ctx.activate(t,n,r,o,c):T(t,n,r,i,a,o,c):ue(e,t,c)},T=(e,t,n,r,i,a,o)=>{let s=e.component=ia(e,r,i);if($n(e)&&(s.ctx.renderer=D),fa(s,!1,o),s.asyncDep){if(i&&i.registerDep(s,de,o),!e.el){let r=s.subTree=H(Pi);b(null,r,t,n),e.placeholder=r.el}}else de(s,e,t,n,i,a,o)},ue=(e,t,n)=>{let r=t.component=e.component;if($r(e,t,n)){if(r.asyncDep&&!r.asyncResolved){pe(r,t,n);return}r.next=t,r.update()}else t.el=e.el,r.vnode=t},de=(e,t,n,r,i,a,o)=>{let s=()=>{if(e.isMounted){let{next:t,bu:n,u:r,parent:s,vnode:c}=e;{let n=Oi(e);if(n){t&&(t.el=c.el,pe(e,t,o)),n.asyncDep.then(()=>{L(()=>{e.isUnmounted||l()},i)});return}}let u=t,d;wi(e,!1),t?(t.el=c.el,pe(e,t,o)):t=c,n&&le(n),(d=t.props&&t.props.onVnodeBeforeUpdate)&&ta(d,s,t,c),wi(e,!0);let f=Xr(e),p=e.subTree;e.subTree=f,v(p,f,m(p.el),Se(p),e,i,a),t.el=f.el,u===null&&ni(e,f.el),r&&L(r,i),(d=t.props&&t.props.onVnodeUpdated)&&L(()=>ta(d,s,t,c),i)}else{let o,{el:s,props:c}=t,{bm:l,m:u,parent:d,root:f,type:p}=e,m=Qn(t);if(wi(e,!1),l&&le(l),!m&&(o=c&&c.onVnodeBeforeMount)&&ta(o,d,t),wi(e,!0),s&&Ee){let t=()=>{e.subTree=Xr(e),Ee(s,e.subTree,e,i,null)};m&&p.__asyncHydrate?p.__asyncHydrate(s,e,t):t()}else{f.ce&&f.ce._hasShadowRoot()&&f.ce._injectChildStyle(p,e.parent?e.parent.type:void 0);let o=e.subTree=Xr(e);v(null,o,n,r,e,i,a),t.el=o.el}if(u&&L(u,i),!m&&(o=c&&c.onVnodeMounted)){let e=t;L(()=>ta(o,d,e),i)}(t.shapeFlag&256||d&&Qn(d.vnode)&&d.vnode.shapeFlag&256)&&e.a&&L(e.a,i),e.isMounted=!0,t=n=r=null}};e.scope.on();let c=e.effect=new Ae(s);e.scope.off();let l=e.update=c.run.bind(c),u=e.job=c.runIfDirty.bind(c);u.i=e,u.id=e.uid,c.scheduler=()=>yn(u),wi(e,!0),l()},pe=(e,t,n)=>{t.component=e;let r=e.vnode.props;e.vnode=t,e.next=null,si(e,t.props,r,n),bi(e,t.children,n),Ge(),Sn(e),Ke()},me=(e,t,n,r,i,a,o,s,c=!1)=>{let l=e&&e.children,u=e?e.shapeFlag:0,d=t.children,{patchFlag:f,shapeFlag:m}=t;if(f>0){if(f&128){ge(l,d,n,r,i,a,o,s,c);return}if(f&256){he(l,d,n,r,i,a,o,s,c);return}}m&8?(u&16&&xe(l,i,a),d!==l&&p(n,d)):u&16?m&16?ge(l,d,n,r,i,a,o,s,c):xe(l,i,a,!0):(u&8&&p(n,``),m&16&&C(d,n,r,i,a,o,s,c))},he=(e,t,r,i,a,o,s,c,l)=>{e||=n,t||=n;let u=e.length,d=t.length,f=Math.min(u,d),p;for(p=0;p<f;p++){let n=t[p]=l?Qi(t[p]):Zi(t[p]);v(e[p],n,r,null,a,o,s,c,l)}u>d?xe(e,a,o,!0,!1,f):C(t,r,i,a,o,s,c,l,f)},ge=(e,t,r,i,a,o,s,c,l)=>{let u=0,d=t.length,f=e.length-1,p=d-1;for(;u<=f&&u<=p;){let n=e[u],i=t[u]=l?Qi(t[u]):Zi(t[u]);if(Wi(n,i))v(n,i,r,null,a,o,s,c,l);else break;u++}for(;u<=f&&u<=p;){let n=e[f],i=t[p]=l?Qi(t[p]):Zi(t[p]);if(Wi(n,i))v(n,i,r,null,a,o,s,c,l);else break;f--,p--}if(u>f){if(u<=p){let e=p+1,n=e<d?t[e].el:i;for(;u<=p;)v(null,t[u]=l?Qi(t[u]):Zi(t[u]),r,n,a,o,s,c,l),u++}}else if(u>p)for(;u<=f;)E(e[u],a,o,!0),u++;else{let m=u,h=u,g=new Map;for(u=h;u<=p;u++){let e=t[u]=l?Qi(t[u]):Zi(t[u]);e.key!=null&&g.set(e.key,u)}let _,y=0,b=p-h+1,x=!1,ee=0,S=Array(b);for(u=0;u<b;u++)S[u]=0;for(u=m;u<=f;u++){let n=e[u];if(y>=b){E(n,a,o,!0);continue}let i;if(n.key!=null)i=g.get(n.key);else for(_=h;_<=p;_++)if(S[_-h]===0&&Wi(n,t[_])){i=_;break}i===void 0?E(n,a,o,!0):(S[i-h]=u+1,i>=ee?ee=i:x=!0,v(n,t[i],r,null,a,o,s,c,l),y++)}let te=x?Di(S):n;for(_=te.length-1,u=b-1;u>=0;u--){let e=h+u,n=t[e],f=t[e+1],p=e+1<d?f.el||Ai(f):i;S[u]===0?v(null,n,r,p,a,o,s,c,l):x&&(_<0||u!==te[_]?_e(n,r,p,2):_--)}}},_e=(e,t,n,r,i=null)=>{let{el:a,type:c,transition:l,children:u,shapeFlag:d}=e;if(d&6){_e(e.component.subTree,t,n,r);return}if(d&128){e.suspense.move(t,n,r);return}if(d&64){c.move(e,t,n,D);return}if(c===R){o(a,t,n);for(let e=0;e<u.length;e++)_e(u[e],t,n,r);o(e.anchor,t,n);return}if(c===Fi){ee(e,t,n);return}if(r!==2&&d&1&&l){if(r===0)l.persisted&&!a[Hn]?o(a,t,n):(l.beforeEnter(a),o(a,t,n),L(()=>l.enter(a),i));else{let{leave:r,delayLeave:i,afterLeave:c}=l,u=()=>{e.ctx.isUnmounted?s(a):o(a,t,n)},d=()=>{let e=a._isLeaving||!!a[Hn];a._isLeaving&&a[Hn](!0),l.persisted&&!e?u():r(a,()=>{u(),c&&c()})};i?i(a,u,d):d()}}else o(a,t,n)},E=(e,t,n,r=!1,i=!1)=>{let{type:a,props:o,ref:s,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:d,dirs:f,cacheIndex:p,memo:m}=e;if(d===-2&&(i=!1),s!=null&&(Ge(),Xn(s,null,n,e,!0),Ke()),p!=null&&(t.renderCache[p]=void 0),u&256){t.ctx.deactivate(e);return}let h=u&1&&f,g=!Qn(e),_;if(g&&(_=o&&o.onVnodeBeforeUnmount)&&ta(_,t,e),u&6)be(e.component,n,r);else{if(u&128){e.suspense.unmount(n,r);return}h&&jn(e,null,t,`beforeUnmount`),u&64?e.type.remove(e,t,n,D,r):l&&!l.hasOnce&&(a!==R||d>0&&d&64)?xe(l,t,n,!1,!0):(a===R&&d&384||!i&&u&16)&&xe(c,t,n),r&&ve(e)}let v=m!=null&&p==null;(g&&(_=o&&o.onVnodeUnmounted)||h||v)&&L(()=>{_&&ta(_,t,e),h&&jn(e,null,t,`unmounted`),v&&(e.el=null)},n)},ve=e=>{let{type:t,el:n,anchor:r,transition:i}=e;if(t===R){ye(n,r);return}if(t===Fi){S(e);return}let a=()=>{s(n),i&&!i.persisted&&i.afterLeave&&i.afterLeave()};if(e.shapeFlag&1&&i&&!i.persisted){let{leave:t,delayLeave:r}=i,o=()=>t(n,a);r?r(e.el,a,o):o()}else a()},ye=(e,t)=>{let n;for(;e!==t;)n=h(e),s(e),e=n;s(t)},be=(e,t,n)=>{let{bum:r,scope:i,job:a,subTree:o,um:s,m:c,a:l}=e;ki(c),ki(l),r&&le(r),i.stop(),a&&(a.flags|=8,E(o,e,t,n)),s&&L(s,t),L(()=>{e.isUnmounted=!0},t)},xe=(e,t,n,r=!1,i=!1,a=0)=>{for(let o=a;o<e.length;o++)E(e[o],t,n,r,i)},Se=e=>{if(e.shapeFlag&6)return Se(e.component.subTree);if(e.shapeFlag&128)return e.suspense.next();let t=h(e.anchor||e.el),n=t&&t[Bn];return n?h(n):t},Ce=!1,we=(e,t,n)=>{let r;e==null?t._vnode&&(E(t._vnode,null,null,!0),r=t._vnode.component):v(t._vnode||null,e,t,null,null,null,n),t._vnode=e,Ce||=(Ce=!0,Sn(r),Cn(),!1)},D={p:v,um:E,m:_e,r:ve,mt:T,mc:C,pc:me,pbc:oe,n:Se,o:e},Te,Ee;return i&&([Te,Ee]=i(D)),{render:we,hydrate:Te,createApp:Ur(we,Te)}}function Ci({type:e,props:t},n){return n===`svg`&&e===`foreignObject`||n===`mathml`&&e===`annotation-xml`&&t&&t.encoding&&t.encoding.includes(`html`)?void 0:n}function wi({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Ti(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Ei(e,t,n=!1){let r=e.children,i=t.children;if(d(r)&&d(i))for(let e=0;e<r.length;e++){let t=r[e],a=i[e];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=i[e]=Qi(i[e]),a.el=t.el),!n&&a.patchFlag!==-2&&Ei(t,a)),a.type===Ni&&(a.patchFlag===-1&&(a=i[e]=Qi(a)),a.el=t.el),a.type===Pi&&!a.el&&(a.el=t.el)}}function Di(e){let t=e.slice(),n=[0],r,i,a,o,s,c=e.length;for(r=0;r<c;r++){let c=e[r];if(c!==0){if(i=n[n.length-1],e[i]<c){t[r]=i,n.push(r);continue}for(a=0,o=n.length-1;a<o;)s=a+o>>1,e[n[s]]<c?a=s+1:o=s;c<e[n[a]]&&(a>0&&(t[r]=n[a-1]),n[a]=r)}}for(a=n.length,o=n[a-1];a-->0;)n[a]=o,o=t[o];return n}function Oi(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Oi(t)}function ki(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function Ai(e){if(e.placeholder)return e.placeholder;let t=e.component;return t?Ai(t.subTree):null}var ji=e=>e.__isSuspense;function Mi(e,t){t&&t.pendingBranch?d(e)?t.effects.push(...e):t.effects.push(e):xn(e)}var R=Symbol.for(`v-fgt`),Ni=Symbol.for(`v-txt`),Pi=Symbol.for(`v-cmt`),Fi=Symbol.for(`v-stc`),Ii=[],Li=null;function z(e=!1){Ii.push(Li=e?null:[])}function Ri(){Ii.pop(),Li=Ii[Ii.length-1]||null}var zi=1;function Bi(e,t=!1){zi+=e,e<0&&Li&&t&&(Li.hasOnce=!0)}function Vi(e){return e.dynamicChildren=zi>0?Li||n:null,Ri(),zi>0&&Li&&Li.push(e),e}function B(e,t,n,r,i,a){return Vi(V(e,t,n,r,i,a,!0))}function Hi(e,t,n,r,i){return Vi(H(e,t,n,r,i,!0))}function Ui(e){return e?e.__v_isVNode===!0:!1}function Wi(e,t){return e.type===t.type&&e.key===t.key}var Gi=({key:e})=>e??null,Ki=({ref:e,ref_key:t,ref_for:n})=>(typeof e==`number`&&(e=``+e),e==null?null:g(e)||M(e)||h(e)?{i:En,r:e,k:t,f:!!n}:e);function V(e,t=null,n=null,r=0,i=null,a=e===R?0:1,o=!1,s=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Gi(t),ref:t&&Ki(t),scopeId:Dn,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:a,patchFlag:r,dynamicProps:i,dynamicChildren:null,appContext:null,ctx:En};return s?($i(c,n),a&128&&e.normalize(c)):n&&(c.shapeFlag|=g(n)?8:16),zi>0&&!o&&Li&&(c.patchFlag>0||a&6)&&c.patchFlag!==32&&Li.push(c),c}var H=qi;function qi(e,t=null,n=null,r=0,i=null,a=!1){if((!e||e===vr)&&(e=Pi),Ui(e)){let r=Yi(e,t,!0);return n&&$i(r,n),zi>0&&!a&&Li&&(r.shapeFlag&6?Li[Li.indexOf(e)]=r:Li.push(r)),r.patchFlag=-2,r}if(Sa(e)&&(e=e.__vccOpts),t){t=Ji(t);let{class:e,style:n}=t;e&&!g(e)&&(t.class=E(e)),v(n)&&(Ut(n)&&!d(n)&&(n=s({},n)),t.style=pe(n))}let o=g(e)?1:ji(e)?128:Vn(e)?64:v(e)?4:h(e)?2:0;return V(e,t,n,r,i,o,a,!0)}function Ji(e){return e?Ut(e)||ai(e)?s({},e):e:null}function Yi(e,t,n=!1,r=!1){let{props:i,ref:a,patchFlag:o,children:s,transition:c}=e,l=t?ea(i||{},t):i,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&Gi(l),ref:t&&t.ref?n&&a?d(a)?a.concat(Ki(t)):[a,Ki(t)]:Ki(t):a,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==R?o===-1?16:o|16:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Yi(e.ssContent),ssFallback:e.ssFallback&&Yi(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce};return c&&r&&Gn(u,c.clone(u)),u}function U(e=` `,t=0){return H(Ni,null,e,t)}function Xi(e=``,t=!1){return t?(z(),Hi(Pi,null,e)):H(Pi,null,e)}function Zi(e){return e==null||typeof e==`boolean`?H(Pi):d(e)?H(R,null,e.slice()):Ui(e)?Qi(e):H(Ni,null,String(e))}function Qi(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Yi(e)}function $i(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(d(t))n=16;else if(typeof t==`object`){if(r&65){let n=t.default;n&&(n._c&&(n._d=!1),$i(e,n()),n._c&&(n._d=!0));return}{n=32;let r=t._;!r&&!ai(t)?t._ctx=En:r===3&&En&&(En.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}}else if(h(t)){if(r&65){$i(e,{default:t});return}t={default:t,_ctx:En},n=32}else t=String(t),r&64?(n=16,t=[U(t)]):n=8;e.children=t,e.shapeFlag|=n}function ea(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let e in r)if(e===`class`)t.class!==r.class&&(t.class=E([t.class,r.class]));else if(e===`style`)t.style=pe([t.style,r.style]);else if(a(e)){let n=t[e],i=r[e];i&&n!==i&&!(d(n)&&n.includes(i))?t[e]=n?[].concat(n,i):i:i==null&&n==null&&!o(e)&&(t[e]=i)}else e!==``&&(t[e]=r[e])}return t}function ta(e,t,n,r=null){cn(e,t,7,[n,r])}var na=Vr(),ra=0;function ia(e,n,r){let i=e.type,a=(n?n.appContext:e.appContext)||na,o={uid:ra++,vnode:e,type:i,parent:n,appContext:a,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new De(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:n?n.provides:Object.create(a.provides),ids:n?n.ids:[``,0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:di(i,a),emitsOptions:Jr(i,a),emit:null,emitted:null,propsDefaults:t,inheritAttrs:i.inheritAttrs,ctx:t,data:t,props:t,attrs:t,slots:t,refs:t,setupState:t,setupContext:null,suspense:r,suspenseId:r?r.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=n?n.root:o,o.emit=Kr.bind(null,o),e.ce&&e.ce(o),o}var W=null,aa=()=>W||En,oa,sa;{let e=fe(),t=(t,n)=>{let r;return(r=e[t])||(r=e[t]=[]),r.push(n),e=>{r.length>1?r.forEach(t=>t(e)):r[0](e)}};oa=t(`__VUE_INSTANCE_SETTERS__`,e=>W=e),sa=t(`__VUE_SSR_SETTERS__`,e=>da=e)}var ca=e=>{let t=W;return oa(e),e.scope.on(),()=>{e.scope.off(),oa(t)}},la=()=>{W&&W.scope.off(),oa(null)};function ua(e){return e.vnode.shapeFlag&4}var da=!1;function fa(e,t=!1,n=!1){t&&sa(t);let{props:r,children:i}=e.vnode,a=ua(e);oi(e,r,a,t),yi(e,i,n||t);let o=a?pa(e,t):void 0;return t&&sa(!1),o}function pa(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Tr);let{setup:r}=n;if(r){Ge();let n=e.setupContext=r.length>1?ya(e):null,i=ca(e),a=sn(r,e,0,[e.props,n]),o=y(a);if(Ke(),i(),(o||e.sp)&&!Qn(e)&&qn(e),o){if(a.then(la,la),t)return a.then(n=>{sa(!0);try{ma(e,n,t)}finally{sa(!1)}}).catch(t=>{ln(t,e,0)});e.asyncDep=a}else ma(e,a,t)}else _a(e,t)}function ma(e,t,n){h(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:v(t)&&(e.setupState=Zt(t)),_a(e,n)}var ha,ga;function _a(e,t,n){let i=e.type;if(!e.render){if(!t&&ha&&!i.render){let t=i.template||Mr(e).template;if(t){let{isCustomElement:n,compilerOptions:r}=e.appContext.config,{delimiters:a,compilerOptions:o}=i;i.render=ha(t,s(s({isCustomElement:n,delimiters:a},r),o))}}e.render=i.render||r,ga&&ga(e)}{let t=ca(e);Ge();try{Or(e)}finally{Ke(),t()}}}var va={get(e,t){return A(e,`get`,``),e[t]}};function ya(e){return{attrs:new Proxy(e.attrs,va),slots:e.slots,emit:e.emit,expose:t=>{e.exposed=t||{}}}}function ba(e){return e.exposed?e.exposeProxy||=new Proxy(Zt(Wt(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in Cr)return Cr[n](e)},has(e,t){return t in e||t in Cr}}):e.proxy}function xa(e,t=!0){return h(e)?e.displayName||e.name:e.name||t&&e.__name}function Sa(e){return h(e)&&`__vccOpts`in e}var G=(e,t)=>$t(e,t,da);function Ca(e,t,n){try{Bi(-1);let r=arguments.length;return r===2?v(t)&&!d(t)?Ui(t)?H(e,null,[t]):H(e,t):H(e,null,t):(r>3?n=Array.prototype.slice.call(arguments,2):r===3&&Ui(n)&&(n=[n]),H(e,t,n))}finally{Bi(1)}}var wa=`3.5.41`,Ta=void 0,Ea=typeof window<`u`&&window.trustedTypes;if(Ea)try{Ta=Ea.createPolicy(`vue`,{createHTML:e=>e})}catch{}var Da=Ta?e=>Ta.createHTML(e):e=>e,Oa=`http://www.w3.org/2000/svg`,ka=`http://www.w3.org/1998/Math/MathML`,Aa=typeof document<`u`?document:null,ja=Aa&&Aa.createElement(`template`),Ma={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?Aa.createElementNS(Oa,e):t===`mathml`?Aa.createElementNS(ka,e):n?Aa.createElement(e,{is:n}):Aa.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>Aa.createTextNode(e),createComment:e=>Aa.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Aa.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),!(i===a||!(i=i.nextSibling)););else{ja.innerHTML=Da(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=ja.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},Na=Symbol(`_vtc`);function Pa(e,t,n){let r=e[Na];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var Fa=Symbol(`_vod`),Ia=Symbol(`_vsh`),La=Symbol(``),Ra=/(?:^|;)\s*display\s*:/;function za(e,t,n){let r=e.style,i=g(n),a=!1;if(n&&!i){if(t){if(g(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??Va(r,t,``)}else for(let e in t)n[e]??Va(r,e,``)}for(let i in n){i===`display`&&(a=!0);let o=n[i];o==null?Va(r,i,``):Ga(e,i,!g(t)&&t?t[i]:void 0,o)||Va(r,i,o)}}else if(i){if(t!==n){let e=r[La];e&&(n+=`;`+e),r.cssText=n,a=Ra.test(n)}}else t&&e.removeAttribute(`style`);Fa in e&&(e[Fa]=a?r.display:``,e[Ia]&&(r.display=`none`))}var Ba=/\s*!important$/;function Va(e,t,n){if(d(n))n.forEach(n=>Va(e,t,n));else if(n??=``,t.startsWith(`--`))e.setProperty(t,n);else{let r=Wa(e,t);Ba.test(n)?e.setProperty(oe(r),n.replace(Ba,``),`important`):e[r]=n}}var Ha=[`Webkit`,`Moz`,`ms`],Ua={};function Wa(e,t){let n=Ua[t];if(n)return n;let r=C(t);if(r!==`filter`&&r in e)return Ua[t]=r;r=se(r);for(let n=0;n<Ha.length;n++){let i=Ha[n]+r;if(i in e)return Ua[t]=i}return t}function Ga(e,t,n,r){return e.tagName===`TEXTAREA`&&(t===`width`||t===`height`)&&g(r)&&n===r}var Ka=`http://www.w3.org/1999/xlink`;function qa(e,t,n,r,i,a=ye(t)){r&&t.startsWith(`xlink:`)?n==null?e.removeAttributeNS(Ka,t.slice(6,t.length)):e.setAttributeNS(Ka,t,n):n==null||a&&!be(n)?e.removeAttribute(t):e.setAttribute(t,a?``:_(n)?String(n):n)}function Ja(e,t,n,r,i){if(t===`innerHTML`||t===`textContent`){n!=null&&(e[t]=t===`innerHTML`?Da(n):n);return}let a=e.tagName;if(t===`value`&&a!==`PROGRESS`&&!a.includes(`-`)){let r=a===`OPTION`?e.getAttribute(`value`)||``:e.value,i=n==null?e.type===`checkbox`?`on`:``:String(n);(r!==i||!(`_value`in e))&&(e.value=i),n??e.removeAttribute(t),e._value=n;return}let o=!1;if(n===``||n==null){let r=typeof e[t];r===`boolean`?n=be(n):n==null&&r===`string`?(n=``,o=!0):r===`number`&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(i||t)}function Ya(e,t,n,r){e.addEventListener(t,n,r)}function Xa(e,t,n,r){e.removeEventListener(t,n,r)}var Za=Symbol(`_vei`);function Qa(e,t,n,r,i=null){let a=e[Za]||(e[Za]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=to(t);r?Ya(e,n,a[t]=ao(r,i),s):o&&(Xa(e,n,o,s),a[t]=void 0)}}var $a=/(Once|Passive|Capture)$/,eo=/^on:?(?:Once|Passive|Capture)$/;function to(e){let t,n;for(;(n=e.match($a))&&!eo.test(e);)t||={},e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===`:`?e.slice(3):oe(e.slice(2)),t]}var no=0,ro=Promise.resolve(),io=()=>no||=(ro.then(()=>no=0),Date.now());function ao(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;let r=n.value;if(d(r)){let n=e.stopImmediatePropagation;e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0};let i=r.slice(),a=[e];for(let n=0;n<i.length&&!e._stopped;n++){let e=i[n];e&&cn(e,t,5,a)}}else cn(r,t,5,[e])};return n.value=e,n.attached=io(),n}var oo=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,so=(e,t,n,r,i,s)=>{let c=i===`svg`;t===`class`?Pa(e,r,c):t===`style`?za(e,n,r):a(t)?o(t)||Qa(e,t,n,r,s):(t[0]===`.`?(t=t.slice(1),!0):t[0]===`^`?(t=t.slice(1),!1):co(e,t,r,c))?(Ja(e,t,r),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&qa(e,t,r,c,s,t!==`value`)):e._isVueCE&&(lo(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!g(r)))?Ja(e,C(t),r,s,t):(t===`true-value`?e._trueValue=r:t===`false-value`&&(e._falseValue=r),qa(e,t,r,c))};function co(e,t,n,r){if(r)return!!(t===`innerHTML`||t===`textContent`||t in e&&oo(t)&&h(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return oo(t)&&g(n)?!1:t in e}function lo(e,t){let n=e._def.props;if(!n)return!1;let r=C(t);return Array.isArray(n)?n.some(e=>C(e)===r):Object.keys(n).some(e=>C(e)===r)}var uo=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return d(t)?e=>le(t,e):t};function fo(e){e.target.composing=!0}function po(e){let t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event(`input`)))}var mo=Symbol(`_assign`),ho=Symbol(`_initialValue`);function go(e,t,n){return t&&(e=e.trim()),n&&(e=ue(e)),e}var _o={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e.parentNode&&(e.type===`text`?e[ho]=e.defaultValue.replace(/[\r\n]/g,``):e.type===`textarea`&&(e[ho]=e.defaultValue.replace(/\r\n?/g,`
`))),e[mo]=uo(i);let a=r||i.props&&i.props.type===`number`;Ya(e,t?`change`:`input`,t=>{t.target.composing||e[mo](go(e.value,n,a))}),(n||a)&&Ya(e,`change`,()=>{e.value=go(e.value,n,a)}),t||(Ya(e,`compositionstart`,fo),Ya(e,`compositionend`,po),Ya(e,`change`,po))},mounted(e,{value:t,modifiers:{trim:n,number:r}}){let i=t??``,a=e[ho];delete e[ho],a!==void 0&&(e.type===`text`||e.type===`textarea`)&&e.value!==a?e[mo](go(e.value,n,r)):e.value=i},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:i,number:a}},o){if(e[mo]=uo(o),e.composing)return;let s=(a||e.type===`number`)&&!/^0\d/.test(e.value)?ue(e.value):e.value,c=t??``;if(s===c)return;let l=e.getRootNode();(l instanceof Document||l instanceof ShadowRoot)&&l.activeElement===e&&e.type!==`range`&&(r&&t===n||i&&e.value.trim()===c)||(e.value=c)}},vo={deep:!0,created(e,t,n){e[mo]=uo(n),Ya(e,`change`,()=>{let t=e._modelValue,n=Co(e),r=e.checked,i=e[mo];if(d(t)){let e=Ce(t,n),a=e!==-1;if(r&&!a)i(t.concat(n));else if(!r&&a){let n=[...t];n.splice(e,1),i(n)}}else if(p(t)){let e=new Set(t);r?e.add(n):e.delete(n),i(e)}else i(wo(e,r))})},mounted:yo,beforeUpdate(e,t,n){e[mo]=uo(n),yo(e,t,n)}};function yo(e,{value:t,oldValue:n},r){e._modelValue=t;let i;if(d(t))i=Ce(t,r.props.value)>-1;else if(p(t))i=t.has(r.props.value);else{if(t===n)return;i=Se(t,wo(e,!0))}e.checked!==i&&(e.checked=i)}var bo={created(e,{value:t},n){e.checked=Se(t,n.props.value),e[mo]=uo(n),Ya(e,`change`,()=>{e[mo](Co(e))})},beforeUpdate(e,{value:t,oldValue:n},r){e[mo]=uo(r),t!==n&&(e.checked=Se(t,r.props.value))}},xo={deep:!0,created(e,{value:t,modifiers:{number:n}},r){e._modelValue=t,Ya(e,`change`,()=>{let t=Array.prototype.filter.call(e.options,e=>e.selected).map(e=>n?ue(Co(e)):Co(e));e[mo](e.multiple?p(e._modelValue)?new Set(t):t:t[0]),e._assigning=!0,_n(()=>{e._assigning=!1})}),e[mo]=uo(r)},mounted(e,{value:t}){So(e,t)},beforeUpdate(e,{value:t},n){e._modelValue=t,e[mo]=uo(n)},updated(e,{value:t}){e._assigning||So(e,t)}};function So(e,t){let n=e.multiple,r=d(t);if(!(n&&!r&&!p(t))){for(let i=0,a=e.options.length;i<a;i++){let a=e.options[i],o=Co(a);if(n){if(r){let e=typeof o;a.selected=e===`string`||e===`number`?t.some(e=>String(e)===String(o)):Ce(t,o)>-1}else a.selected=t.has(o)}else if(Se(Co(a),t)){e.selectedIndex!==i&&(e.selectedIndex=i);return}}!n&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function Co(e){return`_value`in e?e._value:e.value}function wo(e,t){let n=t?`_trueValue`:`_falseValue`;return n in e?e[n]:t}var To={created(e,t,n){Do(e,t,n,null,`created`)},mounted(e,t,n){Do(e,t,n,null,`mounted`)},beforeUpdate(e,t,n,r){Do(e,t,n,r,`beforeUpdate`)},updated(e,t,n,r){Do(e,t,n,r,`updated`)}};function Eo(e,t){switch(e){case`SELECT`:return xo;case`TEXTAREA`:return _o;default:switch(t){case`checkbox`:return vo;case`radio`:return bo;default:return _o}}}function Do(e,t,n,r,i){let a=Eo(e.tagName,n.props&&n.props.type)[i];a&&a(e,t,n,r)}var Oo=[`ctrl`,`shift`,`alt`,`meta`],ko={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>`button`in e&&e.button!==0,middle:e=>`button`in e&&e.button!==1,right:e=>`button`in e&&e.button!==2,exact:(e,t)=>Oo.some(n=>e[`${n}Key`]&&!t.includes(n))},Ao=(e,t)=>{if(!e)return e;let n=e._withMods||={},r=t.join(`.`);return n[r]||(n[r]=((n,...r)=>{for(let e=0;e<t.length;e++){let r=ko[t[e]];if(r&&r(n,t))return}return e(n,...r)}))},jo=s({patchProp:so},Ma),Mo;function No(){return Mo||=xi(jo)}var Po=((...e)=>{let t=No().createApp(...e),{mount:n}=t;return t.mount=e=>{let r=Io(e);if(!r)return;let i=t._component;!h(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent=``);let a=n(r,!1,Fo(r));return r instanceof Element&&(r.removeAttribute(`v-cloak`),r.setAttribute(`data-v-app`,``)),a},t});function Fo(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function Io(e){return g(e)?document.querySelector(e):e}function Lo(e){return typeof e==`object`||`displayName`in e||`props`in e||`__vccOpts`in e}function Ro(e){return e.__esModule||e[Symbol.toStringTag]===`Module`||e.default&&Lo(e.default)}var K=Object.assign;function zo(e,t){let n={};for(let r in t){let i=t[r];n[r]=Vo(i)?i.map(e):e(i)}return n}var Bo=()=>{},Vo=Array.isArray;function Ho(e,t){let n={};for(let r in e)n[r]=r in t?t[r]:e[r];return n}var Uo=Symbol(``);function Wo(e,t){return K(Error(),{type:e,[Uo]:!0},t)}function Go(e,t){return e instanceof Error&&Uo in e&&(t==null||!!(e.type&t))}var Ko=Symbol(``),qo=Symbol(``),Jo=Symbol(``),Yo=Symbol(``),Xo=Symbol(``);function Zo(){return Nn(Jo)}function Qo(e){return Nn(Yo)}var $o=typeof document<`u`,es=/#/g,ts=/&/g,ns=/\//g,rs=/=/g,is=/\?/g,as=/\+/g,os=/%5B/g,ss=/%5D/g,cs=/%5E/g,ls=/%60/g,us=/%7B/g,ds=/%7C/g,fs=/%7D/g,ps=/%20/g;function ms(e){return e==null?``:encodeURI(``+e).replace(ds,`|`).replace(os,`[`).replace(ss,`]`)}function hs(e){return ms(e).replace(us,`{`).replace(fs,`}`).replace(cs,`^`)}function gs(e){return ms(e).replace(as,`%2B`).replace(ps,`+`).replace(es,`%23`).replace(ts,`%26`).replace(ls,"`").replace(us,`{`).replace(fs,`}`).replace(cs,`^`)}function _s(e){return gs(e).replace(rs,`%3D`)}function vs(e){return ms(e).replace(es,`%23`).replace(is,`%3F`)}function ys(e){return vs(e).replace(ns,`%2F`)}function bs(e){if(e==null)return null;try{return decodeURIComponent(``+e)}catch{}return``+e}var xs=/\/$/,Ss=e=>e.replace(xs,``);function Cs(e,t,n=`/`){let r,i={},a=``,o=``,s=t.indexOf(`#`),c=t.indexOf(`?`);return c=s>=0&&c>s?-1:c,c>=0&&(r=t.slice(0,c),a=t.slice(c,s>0?s:t.length),i=e(a.slice(1))),s>=0&&(r||=t.slice(0,s),o=t.slice(s,t.length)),r=js(r??t,n),{fullPath:r+a+o,path:r,query:i,hash:bs(o)}}function ws(e,t){let n=t.query?e(t.query):``;return t.path+(n&&`?`)+n+(t.hash||``)}function Ts(e,t){return!t||!e.toLowerCase().startsWith(t.toLowerCase())?e:e.slice(t.length)||`/`}function Es(e,t,n){let r=t.matched.length-1,i=n.matched.length-1;return r>-1&&r===i&&Ds(t.matched[r],n.matched[i])&&Os(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function Ds(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function Os(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(var n in e)if(!ks(e[n],t[n]))return!1;return!0}function ks(e,t){return Vo(e)?As(e,t):Vo(t)?As(t,e):(e&&e.valueOf())===(t&&t.valueOf())}function As(e,t){return Vo(t)?e.length===t.length&&e.every((e,n)=>e===t[n]):e.length===1&&e[0]===t}function js(e,t){if(e.startsWith(`/`))return e;if(!e)return t;let n=t.split(`/`),r=e.split(`/`),i=r[r.length-1];(i===`..`||i===`.`)&&r.push(``);let a=n.length-1,o,s;for(o=0;o<r.length;o++)if(s=r[o],s!==`.`){if(s===`..`)a>1&&a--;else break}return n.slice(0,a).join(`/`)+`/`+r.slice(o).join(`/`)}var Ms={path:`/`,name:void 0,params:{},query:{},hash:``,fullPath:`/`,matched:[],meta:{},redirectedFrom:void 0};function Ns(e){if(!e){if($o){let t=document.querySelector(`base`);e=t&&t.getAttribute(`href`)||`/`,e=e.replace(/^\w+:\/\/[^/]+/,``)}else e=`/`}return e[0]!==`/`&&e[0]!==`#`&&(e=`/`+e),Ss(e)}var Ps=/^[^#]+#/;function Fs(e,t){return e.replace(Ps,`#`)+t}function Is(e,t){let n=document.documentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return{behavior:t.behavior,left:r.left-n.left-(t.left||0),top:r.top-n.top-(t.top||0)}}var Ls=()=>({left:window.scrollX,top:window.scrollY});function Rs(e){let t;if(`el`in e){let n=e.el,r=typeof n==`string`&&n.startsWith(`#`),i=typeof n==`string`?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!i)return;t=Is(i,e)}else t=e;`scrollBehavior`in document.documentElement.style?window.scrollTo(t):window.scrollTo(t.left==null?window.scrollX:t.left,t.top==null?window.scrollY:t.top)}function zs(e,t){return(history.state?history.state.position-t:-1)+e}var Bs=new Map;function Vs(e,t){Bs.set(e,t)}function Hs(e){let t=Bs.get(e);return Bs.delete(e),t}function Us(e){return typeof e==`string`||e&&typeof e==`object`}function Ws(e){return typeof e==`string`||typeof e==`symbol`}function Gs(e){let t={};if(e===``||e===`?`)return t;let n=(e[0]===`?`?e.slice(1):e).split(`&`);for(let e=0;e<n.length;++e){let r=n[e].replace(as,` `),i=r.indexOf(`=`),a=bs(i<0?r:r.slice(0,i)),o=i<0?null:bs(r.slice(i+1));if(a in t){let e=t[a];Vo(e)||(e=t[a]=[e]),e.push(o)}else t[a]=o}return t}function Ks(e){let t=``;for(let n in e){let r=e[n];if(n=_s(n),r==null){r!==void 0&&(t+=(t.length?`&`:``)+n);continue}(Vo(r)?r.map(e=>e&&gs(e)):[r&&gs(r)]).forEach(e=>{e!==void 0&&(t+=(t.length?`&`:``)+n,e!=null&&(t+=`=`+e))})}return t}function qs(e){let t={};for(let n in e){let r=e[n];r!==void 0&&(t[n]=Vo(r)?r.map(e=>e==null?null:``+e):r==null?r:``+r)}return t}function Js(){let e=[];function t(t){return e.push(t),()=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)}}function n(){e=[]}return{add:t,list:()=>e.slice(),reset:n}}function Ys(e,t,n,r,i,a=e=>e()){let o=r&&(r.enterCallbacks[i]=r.enterCallbacks[i]||[]);return()=>new Promise((s,c)=>{let l=e=>{e===!1?c(Wo(4,{from:n,to:t})):e instanceof Error?c(e):Us(e)?c(Wo(2,{from:t,to:e})):(o&&r.enterCallbacks[i]===o&&typeof e==`function`&&o.push(e),s())},u=a(()=>e.call(r&&r.instances[i],t,n,l)),d=Promise.resolve(u);e.length<3&&(d=d.then(l)),d.catch(e=>c(e))})}function Xs(e,t,n,r,i=e=>e()){let a=[];for(let o of e)for(let e in o.components){let s=o.components[e];if(!(t!==`beforeRouteEnter`&&!o.instances[e])){if(Lo(s)){let c=(s.__vccOpts||s)[t];c&&a.push(Ys(c,n,r,o,e,i))}else{let c=s();a.push(()=>c.then(a=>{if(!a)throw Error(`Couldn't resolve component "${e}" at "${o.path}"`);let s=Ro(a)?a.default:a;o.mods[e]=a,o.components[e]=s;let c=(s.__vccOpts||s)[t];return c&&Ys(c,n,r,o,e,i)()}))}}}return a}function Zs(e,t){let n=[],r=[],i=[],a=Math.max(t.matched.length,e.matched.length);for(let o=0;o<a;o++){let a=t.matched[o];a&&(e.matched.find(e=>Ds(e,a))?r.push(a):n.push(a));let s=e.matched[o];s&&(t.matched.find(e=>Ds(e,s))||i.push(s))}return[n,r,i]}var Qs=()=>location.protocol+`//`+location.host;function $s(e,t){let{pathname:n,search:r,hash:i}=t,a=e.indexOf(`#`);if(a>-1){let t=i.includes(e.slice(a))?e.slice(a).length:1,n=i.slice(t);return n[0]!==`/`&&(n=`/`+n),Ts(n,``)}return Ts(n,e)+r+i}function ec(e,t,n,r){let i=[],a=[],o=null,s=({state:a})=>{let s=$s(e,location),c=n.value,l=t.value,u=0;if(a){if(n.value=s,t.value=a,o&&o===c){o=null;return}u=l?a.position-l.position:0}else r(s);i.forEach(e=>{e(n.value,c,{delta:u,type:`pop`,direction:u?u>0?`forward`:`back`:``})})};function c(){o=n.value}function l(e){i.push(e);let t=()=>{let t=i.indexOf(e);t>-1&&i.splice(t,1)};return a.push(t),t}function u(){if(document.visibilityState===`hidden`){let{history:e}=window;if(!e.state)return;e.replaceState(K({},e.state,{scroll:Ls()}),``)}}function d(){for(let e of a)e();a=[],window.removeEventListener(`popstate`,s),window.removeEventListener(`pagehide`,u),document.removeEventListener(`visibilitychange`,u)}return window.addEventListener(`popstate`,s),window.addEventListener(`pagehide`,u),document.addEventListener(`visibilitychange`,u),{pauseListeners:c,listen:l,destroy:d}}function tc(e,t,n,r=!1,i=!1){return{back:e,current:t,forward:n,replaced:r,position:window.history.length,scroll:i?Ls():null}}function nc(e){let{history:t,location:n}=window,r={value:$s(e,n)},i={value:t.state};i.value||a(r.value,{back:null,current:r.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0);function a(r,a,o){let s=e.indexOf(`#`),c=s>-1?(n.host&&document.querySelector(`base`)?e:e.slice(s))+r:Qs()+e+r;try{t[o?`replaceState`:`pushState`](a,``,c),i.value=a}catch(e){console.error(e),n[o?`replace`:`assign`](c)}}function o(e,n){a(e,K({},t.state,tc(i.value.back,e,i.value.forward,!0),n,{position:i.value.position}),!0),r.value=e}function s(e,n){let o=K({},i.value,t.state,{forward:e,scroll:Ls()});a(o.current,o,!0),a(e,K({},tc(r.value,e,null),{position:o.position+1},n),!1),r.value=e}return{location:r,state:i,push:s,replace:o}}function rc(e){e=Ns(e);let t=nc(e),n=ec(e,t.state,t.location,t.replace);function r(e,t=!0){t||n.pauseListeners(),history.go(e)}let i=K({location:``,base:e,go:r,createHref:Fs.bind(null,e)},t,n);return Object.defineProperty(i,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(i,"state",{enumerable:!0,get:()=>t.state.value}),i}var ic={type:0,value:``},ac=/[a-zA-Z0-9_]/;function oc(e){if(!e)return[[]];if(e===`/`)return[[ic]];if(!e.startsWith(`/`))throw Error(`Invalid path "${e}"`);function t(e){throw Error(`ERR (${n})/"${l}": ${e}`)}let n=0,r=n,i=[],a;function o(){a&&i.push(a),a=[]}let s=0,c,l=``,u=``;function d(){l&&=(n===0?a.push({type:0,value:l}):n===1||n===2||n===3?(a.length>1&&(c===`*`||c===`+`)&&t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`),a.push({type:1,value:l,regexp:u,repeatable:c===`*`||c===`+`,optional:c===`*`||c===`?`})):t(`Invalid state to consume buffer`),``)}function f(){l+=c}for(;s<e.length;)switch(c=e[s++],n){case 0:c===`\\`?(r=n,n=4):c===`/`?(l&&d(),o()):c===`:`?(d(),n=1):f();break;case 4:f(),n=r;break;case 1:c===`(`?n=2:ac.test(c)?f():(d(),n=0,c!==`*`&&c!==`?`&&c!==`+`&&s--);break;case 2:c===`)`?u[u.length-1]==`\\`?u=u.slice(0,-1)+c:n=3:u+=c;break;case 3:d(),n=0,c!==`*`&&c!==`?`&&c!==`+`&&s--,u=``;break;default:t(`Unknown state`)}return n===2&&t(`Unfinished custom RegExp for param "${l}"`),d(),o(),i}var sc=`[^/]+?`,cc={sensitive:!1,strict:!1,start:!0,end:!0},lc=/[.+*?^${}()[\]/\\]/g;function uc(e,t){let n=K({},cc,t),r=[],i=n.start?`^`:``,a=[];for(let t of e){let e=t.length?[]:[90];n.strict&&!t.length&&(i+=`/`);for(let r=0;r<t.length;r++){let o=t[r],s=40+(n.sensitive?.25:0);if(o.type===0)r||(i+=`/`),i+=o.value.replace(lc,`\\$&`),s+=40;else if(o.type===1){let{value:e,repeatable:n,optional:c,regexp:l}=o;a.push({name:e,repeatable:n,optional:c});let u=l||sc;if(u!==sc){s+=10;try{RegExp(`(${u})`)}catch(t){throw Error(`Invalid custom RegExp for param "${e}" (${u}): `+t.message)}}let d=n?`((?:${u})(?:/(?:${u}))*)`:`(${u})`;r||(d=c&&t.length<2?`(?:/${d})`:`/`+d),c&&(d+=`?`),i+=d,s+=20,c&&(s+=-8),n&&(s+=-20),u===`.*`&&(s+=-50)}e.push(s)}r.push(e)}if(n.strict&&n.end){let e=r.length-1;r[e][r[e].length-1]+=.7000000000000001}n.strict||(i+=`/?`),n.end?i+=`$`:n.strict&&!i.endsWith(`/`)&&(i+=`(?:/|$)`);let o=new RegExp(i,n.sensitive?``:`i`);function s(e){let t=e.match(o),n={};if(!t)return null;for(let e=1;e<t.length;e++){let r=t[e]||``,i=a[e-1];n[i.name]=r&&i.repeatable?r.split(`/`):r}return n}function c(t){let n=``,r=!1;for(let i of e){(!r||!n.endsWith(`/`))&&(n+=`/`),r=!1;for(let e of i)if(e.type===0)n+=e.value;else if(e.type===1){let{value:a,repeatable:o,optional:s}=e,c=a in t?t[a]:``;if(Vo(c)&&!o)throw Error(`Provided param "${a}" is an array but it is not repeatable (* or + modifiers)`);let l=Vo(c)?c.join(`/`):c;if(!l){if(s)i.length<2&&(n.endsWith(`/`)?n=n.slice(0,-1):r=!0);else throw Error(`Missing required param "${a}"`)}n+=l}}return n||`/`}return{re:o,score:r,keys:a,parse:s,stringify:c}}function dc(e,t){let n=0;for(;n<e.length&&n<t.length;){let r=t[n]-e[n];if(r)return r;n++}return e.length<t.length?e.length===1&&e[0]===80?-1:1:e.length>t.length?t.length===1&&t[0]===80?1:-1:0}function fc(e,t){let n=0,r=e.score,i=t.score;for(;n<r.length&&n<i.length;){let e=dc(r[n],i[n]);if(e)return e;n++}if(Math.abs(i.length-r.length)===1){if(pc(r))return 1;if(pc(i))return-1}return i.length-r.length}function pc(e){let t=e[e.length-1];return e.length>0&&t[t.length-1]<0}var mc={strict:!1,end:!0,sensitive:!1};function hc(e,t,n){let r=K(uc(oc(e.path),n),{record:e,parent:t,children:[],alias:[]});return t&&!r.record.aliasOf==!t.record.aliasOf&&t.children.push(r),r}function gc(e,t){let n=[],r=new Map;t=Ho(mc,t);function i(e){return r.get(e)}function a(e,n,r){let i=!r,s=vc(e);s.aliasOf=r&&r.record;let l=Ho(t,e),u=[s];if(`alias`in e){let t=typeof e.alias==`string`?[e.alias]:e.alias;for(let e of t)u.push(vc(K({},s,{components:r?r.record.components:s.components,path:e,aliasOf:r?r.record:s})))}let d,f;for(let t of u){let{path:u}=t;if(n&&u[0]!==`/`){let e=n.record.path,r=e[e.length-1]===`/`?``:`/`;t.path=n.record.path+(u&&r+u)}if(d=hc(t,n,l),r?r.alias.push(d):(f||=d,f!==d&&f.alias.push(d),i&&e.name&&!bc(d)&&o(e.name)),wc(d)&&c(d),s.children){let e=s.children;for(let t=0;t<e.length;t++)a(e[t],d,r&&r.children[t])}r||=d}return f?()=>{o(f)}:Bo}function o(e){if(Ws(e)){let t=r.get(e);t&&(r.delete(e),n.splice(n.indexOf(t),1),t.children.forEach(o),t.alias.forEach(o))}else{let t=n.indexOf(e);t>-1&&(n.splice(t,1),e.record.name&&r.delete(e.record.name),e.children.forEach(o),e.alias.forEach(o))}}function s(){return n}function c(e){let t=Sc(e,n);n.splice(t,0,e),e.record.name&&!bc(e)&&r.set(e.record.name,e)}function l(e,t){let i,a={},o,s;if(`name`in e&&e.name){if(i=r.get(e.name),!i)throw Wo(1,{location:e});s=i.record.name,a=K(_c(t.params,i.keys.filter(e=>!e.optional).concat(i.parent?i.parent.keys.filter(e=>e.optional):[]).map(e=>e.name)),e.params&&_c(e.params,i.keys.map(e=>e.name))),o=i.stringify(a)}else if(e.path!=null)o=e.path,i=n.find(e=>e.re.test(o)),i&&(a=i.parse(o),s=i.record.name,i.keys.forEach(e=>{e.optional&&!a[e.name]&&delete a[e.name]}));else{if(i=t.name?r.get(t.name):n.find(e=>e.re.test(t.path)),!i)throw Wo(1,{location:e,currentLocation:t});s=i.record.name,a=K({},t.params,e.params),o=i.stringify(a)}let c=[],l=i;for(;l;)c.unshift(l.record),l=l.parent;return{name:s,path:o,params:a,matched:c,meta:xc(c)}}e.forEach(e=>a(e));function u(){n.length=0,r.clear()}return{addRoute:a,resolve:l,removeRoute:o,clearRoutes:u,getRoutes:s,getRecordMatcher:i}}function _c(e,t){let n={};for(let r of t)r in e&&(n[r]=e[r]);return n}function vc(e){let t={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:yc(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:`components`in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(t,"mods",{value:{}}),t}function yc(e){let t={},n=e.props||!1;if(`component`in e)t.default=n;else for(let r in e.components)t[r]=typeof n==`object`?n[r]:n;return t}function bc(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function xc(e){return e.reduce((e,t)=>K(e,t.meta),{})}function Sc(e,t){let n=0,r=t.length;for(;n!==r;){let i=n+r>>1;fc(e,t[i])<0?r=i:n=i+1}let i=Cc(e);return i&&(r=t.lastIndexOf(i,r-1)),r}function Cc(e){let t=e;for(;t=t.parent;)if(wc(t)&&fc(e,t)===0)return t}function wc({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function Tc(e){let t=Nn(Jo),n=Nn(Yo),r=G(()=>{let n=P(e.to);return t.resolve(n)}),i=G(()=>{let{matched:e}=r.value,{length:t}=e,i=e[t-1],a=n.matched;if(!i||!a.length)return-1;let o=a.findIndex(Ds.bind(null,i));if(o>-1)return o;let s=Ac(e[t-2]);return t>1&&Ac(i)===s&&a[a.length-1].path!==s?a.findIndex(Ds.bind(null,e[t-2])):o}),a=G(()=>i.value>-1&&kc(n.params,r.value.params)),o=G(()=>i.value>-1&&i.value===n.matched.length-1&&Os(n.params,r.value.params));function s(n={}){if(Oc(n)){let n=t[P(e.replace)?`replace`:`push`](P(e.to)).catch(Bo);return e.viewTransition&&typeof document<`u`&&`startViewTransition`in document&&document.startViewTransition(()=>n),n}return Promise.resolve()}return{route:r,href:G(()=>r.value.href),isActive:a,isExactActive:o,navigate:s}}function Ec(e){return e.length===1?e[0]:e}var Dc=Kn({name:`RouterLink`,compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:`page`},viewTransition:Boolean},useLink:Tc,setup(e,{slots:t}){let n=It(Tc(e)),{options:r}=Nn(Jo),i=G(()=>({[jc(e.activeClass,r.linkActiveClass,`router-link-active`)]:n.isActive,[jc(e.exactActiveClass,r.linkExactActiveClass,`router-link-exact-active`)]:n.isExactActive}));return()=>{let r=t.default&&Ec(t.default(n));return e.custom?r:Ca(`a`,{"aria-current":n.isExactActive?e.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:i.value},r)}}});function Oc(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&(e.button===void 0||e.button===0)){if(e.currentTarget&&e.currentTarget.getAttribute){let t=e.currentTarget.getAttribute(`target`);if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function kc(e,t){for(let n in t){let r=t[n],i=e[n];if(typeof r==`string`){if(r!==i)return!1}else if(!Vo(i)||i.length!==r.length||r.some((e,t)=>e.valueOf()!==i[t].valueOf()))return!1}return!0}function Ac(e){return e?e.aliasOf?e.aliasOf.path:e.path:``}var jc=(e,t,n)=>e??t??n,Mc=Kn({name:`RouterView`,inheritAttrs:!1,props:{name:{type:String,default:`default`},route:Object},compatConfig:{MODE:3},setup(e,{attrs:t,slots:n}){let r=Nn(Xo),i=G(()=>e.route||r.value),a=Nn(qo,0),o=G(()=>{let e=P(a),{matched:t}=i.value,n;for(;(n=t[e])&&!n.components;)e++;return e}),s=G(()=>i.value.matched[o.value]);Mn(qo,G(()=>o.value+1)),Mn(Ko,s),Mn(Xo,i);let c=N();return In(()=>[c.value,s.value,e.name],([e,t,n],[r,i,a])=>{t&&(t.instances[n]=e,i&&i!==t&&e&&e===r&&(t.leaveGuards.size||(t.leaveGuards=i.leaveGuards),t.updateGuards.size||(t.updateGuards=i.updateGuards))),e&&t&&(!i||!Ds(t,i)||!r)&&(t.enterCallbacks[n]||[]).forEach(t=>t(e))},{flush:`post`}),()=>{let r=i.value,a=e.name,o=s.value,l=o&&o.components[a];if(!l)return Nc(n.default,{Component:l,route:r});let u=o.props[a],d=Ca(l,K({},u?u===!0?r.params:typeof u==`function`?u(r):u:null,t,{onVnodeUnmounted:e=>{e.component.isUnmounted&&(o.instances[a]=null)},ref:c}));return Nc(n.default,{Component:d,route:r})||d}}});function Nc(e,t){if(!e)return null;let n=e(t);return n.length===1?n[0]:n}var Pc=Mc;function Fc(e){let t=gc(e.routes,e),n=e.parseQuery||Gs,r=e.stringifyQuery||Ks,i=e.history,a=Js(),o=Js(),s=Js(),c=qt(Ms),l=Ms;$o&&e.scrollBehavior&&`scrollRestoration`in history&&(history.scrollRestoration=`manual`);let u=zo.bind(null,e=>``+e),d=zo.bind(null,ys),f=zo.bind(null,bs);function p(e,n){let r,i;return Ws(e)?(r=t.getRecordMatcher(e),i=n):i=e,t.addRoute(i,r)}function m(e){let n=t.getRecordMatcher(e);n&&t.removeRoute(n)}function h(){return t.getRoutes().map(e=>e.record)}function g(e){return!!t.getRecordMatcher(e)}function _(e,a){if(a=K({},a||c.value),typeof e==`string`){let r=Cs(n,e,a.path),o=t.resolve({path:r.path},a),s=i.createHref(r.fullPath);return K(r,o,{params:f(o.params),redirectedFrom:void 0,href:s})}let o;if(e.path!=null)o=K({},e,{path:Cs(n,e.path,a.path).path});else{let t=K({},e.params);for(let e in t)t[e]??delete t[e];o=K({},e,{params:d(t)}),a.params=d(a.params)}let s=t.resolve(o,a),l=e.hash||``;s.params=u(f(s.params));let p=ws(r,K({},e,{hash:hs(l),path:s.path})),m=i.createHref(p);return K({fullPath:p,hash:l,query:r===Ks?qs(e.query):e.query||{}},s,{redirectedFrom:void 0,href:m})}function v(e){return typeof e==`string`?Cs(n,e,c.value.path):K({},e)}function y(e,t){if(l!==e)return Wo(8,{from:t,to:e})}function b(e){return S(e)}function x(e){return b(K(v(e),{replace:!0}))}function ee(e,t){let n=e.matched[e.matched.length-1];if(n&&n.redirect){let{redirect:r}=n,i=typeof r==`function`?r(e,t):r;return typeof i==`string`&&(i=i.includes(`?`)||i.includes(`#`)?i=v(i):{path:i},i.params={}),K({query:e.query,hash:e.hash,params:i.path==null?e.params:{}},i)}}function S(e,t){let n=l=_(e),i=c.value,a=e.state,o=e.force,s=e.replace===!0,u=ee(n,i);if(u)return S(K(v(u),{state:typeof u==`object`?K({},a,u.state):a,force:o,replace:s}),t||n);let d=n;d.redirectedFrom=t;let f;return!o&&Es(r,i,n)&&(f=Wo(16,{to:d,from:i}),de(i,i,!0,!1)),(f?Promise.resolve(f):re(d,i)).catch(e=>Go(e)?Go(e,2)?e:ue(e):le(e,d,i)).then(e=>{if(e){if(Go(e,2))return S(K({replace:s},v(e.to),{state:typeof e.to==`object`?K({},a,e.to.state):a,force:o}),t||d)}else e=C(d,i,!0,s,a);return ie(d,i,e),e})}function te(e,t){let n=y(e,t);return n?Promise.reject(n):Promise.resolve()}function ne(e){let t=me.values().next().value;return t&&typeof t.runWithContext==`function`?t.runWithContext(e):e()}function re(e,t){let n,[r,i,s]=Zs(e,t);n=Xs(r.reverse(),`beforeRouteLeave`,e,t);for(let i of r)i.leaveGuards.forEach(r=>{n.push(Ys(r,e,t))});let c=te.bind(null,e,t);return n.push(c),ge(n).then(()=>{n=[];for(let r of a.list())n.push(Ys(r,e,t));return n.push(c),ge(n)}).then(()=>{n=Xs(i,`beforeRouteUpdate`,e,t);for(let r of i)r.updateGuards.forEach(r=>{n.push(Ys(r,e,t))});return n.push(c),ge(n)}).then(()=>{n=[];for(let r of s)if(r.beforeEnter){if(Vo(r.beforeEnter))for(let i of r.beforeEnter)n.push(Ys(i,e,t));else n.push(Ys(r.beforeEnter,e,t))}return n.push(c),ge(n)}).then(()=>(e.matched.forEach(e=>e.enterCallbacks={}),n=Xs(s,`beforeRouteEnter`,e,t,ne),n.push(c),ge(n))).then(()=>{n=[];for(let r of o.list())n.push(Ys(r,e,t));return n.push(c),ge(n)}).catch(e=>Go(e,8)?e:Promise.reject(e))}function ie(e,t,n){s.list().forEach(r=>ne(()=>r(e,t,n)))}function C(e,t,n,r,a){let o=y(e,t);if(o)return o;let s=t===Ms,l=$o?history.state:{};n&&(r||s?i.replace(e.fullPath,K({scroll:s&&l&&l.scroll},a)):i.push(e.fullPath,a)),c.value=e,de(e,t,n,s),ue()}let ae;function oe(){ae||=i.listen((e,t,n)=>{if(!he.listening)return;let r=_(e),a=ee(r,he.currentRoute.value);if(a){S(K(a,{replace:!0,force:!0}),r).catch(Bo);return}l=r;let o=c.value;$o&&Vs(zs(o.fullPath,n.delta),Ls()),re(r,o).catch(e=>Go(e,12)?e:Go(e,2)?(S(K(v(e.to),{force:!0}),r).then(e=>{Go(e,20)&&!n.delta&&n.type===`pop`&&i.go(-1,!1)}).catch(Bo),Promise.reject()):(n.delta&&i.go(-n.delta,!1),le(e,r,o))).then(e=>{e||=C(r,o,!1),e&&(n.delta&&!Go(e,8)?i.go(-n.delta,!1):n.type===`pop`&&Go(e,20)&&i.go(-1,!1)),ie(r,o,e)}).catch(Bo)})}let se=Js(),ce=Js(),w;function le(e,t,n){ue(e);let r=ce.list();return r.length?r.forEach(r=>r(e,t,n)):console.error(e),Promise.reject(e)}function T(){return w&&c.value!==Ms?Promise.resolve():new Promise((e,t)=>{se.add([e,t])})}function ue(e){return w||(w=!e,oe(),se.list().forEach(([t,n])=>e?n(e):t()),se.reset()),e}function de(t,n,r,i){let{scrollBehavior:a}=e;if(!$o||!a)return Promise.resolve();let o=!r&&Hs(zs(t.fullPath,0))||(i||!r)&&history.state&&history.state.scroll||null;return _n().then(()=>a(t,n,o)).then(e=>t===c.value&&e&&Rs(e)).catch(e=>t===c.value&&le(e,t,n))}let fe=e=>i.go(e),pe,me=new Set,he={currentRoute:c,listening:!0,addRoute:p,removeRoute:m,clearRoutes:t.clearRoutes,hasRoute:g,getRoutes:h,resolve:_,options:e,push:b,replace:x,go:fe,back:()=>fe(-1),forward:()=>fe(1),beforeEach:a.add,beforeResolve:o.add,afterEach:s.add,onError:ce.add,isReady:T,install(e){e.component(`RouterLink`,Dc),e.component(`RouterView`,Pc),e.config.globalProperties.$router=he,Object.defineProperty(e.config.globalProperties,"$route",{enumerable:!0,get:()=>P(c)}),$o&&!pe&&c.value===Ms&&(pe=!0,b(i.location).catch(e=>{}));let t={};for(let e in Ms)Object.defineProperty(t,e,{get:()=>c.value[e],enumerable:!0});e.provide(Jo,he),e.provide(Yo,Lt(t)),e.provide(Xo,c);let n=e.unmount;me.add(e),e.unmount=function(){me.delete(e),me.size<1&&(l=Ms,ae&&ae(),ae=null,c.value=Ms,pe=!1,w=!1),n()}}};function ge(e){return e.reduce((e,t)=>e.then(()=>ne(t)),Promise.resolve())}return he}var Ic={agua:{src:`/icons/secondary/agua.png`,character:`Dorito`,context:`NutritionJournal`,role:`Seguimiento de hidratación`},peso:{src:`/icons/secondary/peso.png`,character:`Dorito`,context:`PersonalInsights`,role:`Evolución del peso`},objetivos:{src:`/icons/secondary/objetivos.png`,character:`Dorito`,context:`PersonalInsights`,role:`Objetivos personales`},progreso:{src:`/icons/secondary/progreso.png`,character:`Dorito`,context:`PersonalInsights`,role:`Tendencias y evolución`},racha:{src:`/icons/secondary/racha.png`,character:`Dorito`,context:`PersonalInsights`,role:`Continuidad del registro`},"record-personal":{src:`/icons/secondary/record-personal.png`,character:`Dorito`,context:`TrainingJournal`,role:`Récord personal`},sueno:{src:`/icons/secondary/sueno.png`,character:`Felicia`,context:`MoodJournal`,role:`Sueño y recuperación`},exito:{src:`/icons/secondary/exito.png`,character:`Dorito`,context:`SharedPresentation`,role:`Confirmación positiva`},advertencia:{src:`/icons/secondary/advertencia.png`,character:`Felipa`,context:`SharedPresentation`,role:`Advertencia y control`},error:{src:`/icons/secondary/error.png`,character:`Felipa`,context:`SharedPresentation`,role:`Error o acción fallida`}},Lc=[`src`,`alt`,`aria-hidden`],Rc={__name:`AppIcon`,props:{name:{type:String,required:!0},decorative:{type:Boolean,default:!0}},setup(e){let t=`/registro_gatos/`,n={hoy:`${t}icons/hoy.svg`,comidas:`${t}icons/comidas.svg`,entrenamientos:`${t}icons/entrenamientos.svg`,"estado-animo":`${t}icons/estado-animo.svg`,historial:`${t}icons/historial.svg`,"nuevo-registro":`${t}icons/nuevo-registro.svg`,saludo:`${t}icons/saludo.svg`,...Object.fromEntries(Object.entries(Ic).map(([e,n])=>[e,t+n.src.replace(/^\//,``)]))};return(t,r)=>(z(),B(`img`,{class:`app-icon`,src:n[e.name],alt:e.decorative?``:e.name,"aria-hidden":e.decorative?`true`:void 0},null,8,Lc))}};async function zc(e,t={}){let n=await fetch(e,{credentials:`include`,headers:{"Content-Type":`application/json`,...t.headers||{}},...t}),r=await n.json().catch(()=>({}));if(!n.ok){let e=Error(r.error||`No se pudo completar la autenticación.`);throw e.status=n.status,e}return r}var Bc=`/registro_gatos/api`,Vc={login:(e,t)=>zc(`${Bc}/auth/login`,{method:`POST`,body:JSON.stringify({email:e,password:t})}),current:()=>zc(`${Bc}/auth/me`),logout:()=>zc(`${Bc}/auth/logout`,{method:`POST`})},Hc=N(null),Uc=!1;async function Wc(){if(Uc)return Hc.value;try{Hc.value=(await Vc.current()).user}catch(e){if(e.status!==401)throw e;Hc.value=null}finally{Uc=!0}return Hc.value}async function Gc(e,t){return Hc.value=(await Vc.login(e,t)).user,Uc=!0,Hc.value}async function Kc(){try{await Vc.logout()}finally{Hc.value=null,Uc=!0}}var qc={user:Rt(Hc),restore:Wc,login:Gc,logout:Kc},Jc={key:1,class:`app-shell`},Yc={class:`brand-mark`},Xc={"aria-label":`Navegación principal`},Zc={"aria-hidden":`true`},Qc={class:`sidebar-cat`},$c={__name:`App`,setup(e){let t=N(!1),n=Qo(),r=Zo(),i=qc.user;async function a(){await qc.logout(),await r.push(`/login`)}let o=[{to:`/`,label:`Hoy`,icon:`hoy`},{to:`/registrar/comida`,label:`Comidas`,icon:`comidas`},{to:`/registrar/entrenamiento`,label:`Entrenamientos`,icon:`entrenamientos`},{to:`/registrar/animo`,label:`Estado de ánimo`,icon:`estado-animo`},{to:`/historial`,label:`Historial`,icon:`historial`}];return(e,r)=>{let s=_r(`RouterView`),c=_r(`RouterLink`);return P(n).meta.publicLayout?(z(),Hi(s,{key:0})):(z(),B(`div`,Jc,[V(`button`,{class:`mobile-menu`,"aria-label":`Abrir menú`,onClick:r[0]||=e=>t.value=!t.value},`☰`),V(`aside`,{class:E([`sidebar`,{open:t.value}])},[H(c,{class:`brand`,to:`/`,onClick:r[1]||=e=>t.value=!1},{default:kn(()=>[V(`span`,Yc,[H(Rc,{name:`saludo`})]),r[3]||=V(`span`,null,[V(`strong`,null,`Mi registro`),V(`small`,null,`Un día a la vez`)],-1)]),_:1}),V(`nav`,Xc,[(z(),B(R,null,xr(o,e=>H(c,{key:e.to,to:e.to,onClick:r[2]||=e=>t.value=!1},{default:kn(()=>[V(`span`,Zc,[H(Rc,{name:e.icon},null,8,[`name`])]),U(D(e.label),1)]),_:2},1032,[`to`])),64))]),V(`div`,Qc,[H(Rc,{name:`saludo`}),r[5]||=V(`p`,null,`¿Cómo estuvo tu día?`,-1),H(c,{to:`/registrar/animo`},{default:kn(()=>[...r[4]||=[U(`Cuentaselo a Felicia`,-1)]]),_:1})]),V(`button`,{class:`profile`,type:`button`,title:`Cerrar sesión`,onClick:a},[V(`span`,null,D(P(i)?.name?.slice(0,2).toUpperCase()||`MI`),1),V(`span`,null,[V(`strong`,null,D(P(i)?.name||`Mi cuenta`),1),r[6]||=V(`small`,null,`Cerrar sesión`,-1)]),r[7]||=V(`b`,null,`×`,-1)])],2),V(`main`,null,[H(s)])]))}}};async function el(e,t){let n=await fetch(e,{headers:{Accept:`application/json`},signal:t}),r=await n.json().catch(()=>null);if(!n.ok)throw Error(r?.error||`No se pudieron consultar tus registros.`);if(!Array.isArray(r))throw Error(`El servidor devolvió un formato de registros inválido.`);return r}var tl=`/registro_gatos/api`,nl={listEntryTypes:e=>el(`${tl}/entry-types`,e),listEntries:e=>el(`${tl}/entries`,e)},rl=N([]),il=N([]),al=N(!1),ol=N(``),sl=G(()=>rl.value.length>0),cl=G(()=>{if(!sl.value)return null;let e=rl.value.reduce((e,t)=>e+Number(t.score),0);return Math.round(e/rl.value.length*10)/10}),ll=`/registro_gatos/`;function ul(e){return e<=3?{name:`Felipa`,image:`${ll}cats/felipa-molesta.png`}:e<=7?{name:`Felicia`,image:`${ll}cats/felicia-cansada.png`}:{name:`Dorito`,image:`${ll}cats/dorito-feliz.png`}}async function dl(){al.value=!0,ol.value=``;try{let[e,t]=await Promise.all([nl.listEntryTypes(),nl.listEntries()]);il.value=e,rl.value=t}catch(e){il.value=[],rl.value=[],ol.value=e instanceof Error?e.message:`No se pudieron cargar tus registros.`}finally{al.value=!1}}async function fl(e,t={}){let n=await fetch(e,{headers:{"Content-Type":`application/json`,...t.headers||{}},...t}),r=await n.json().catch(()=>({}));if(!n.ok)throw Error(r.error||`No se pudo conectar con el servidor.`);return r}var pl=`/registro_gatos/api`,ml={listTypes:()=>fl(`${pl}/entry-types`),listEntries:()=>fl(`${pl}/entries`),createEntry:e=>fl(`${pl}/entries`,{method:`POST`,body:JSON.stringify(e)})},hl=N([]),gl=N([]),_l=N(!1),vl=N(``),yl=`/registro_gatos/`;function bl(e){return e<=3?{name:`Felipa`,mood:`malhumorada`,image:`${yl}cats/felipa-molesta.png`,color:`rose`}:e<=7?{name:`Felicia`,mood:`con fiaca`,image:`${yl}cats/felicia-cansada.png`,color:`sage`}:{name:`Dorito`,mood:`feliz`,image:`${yl}cats/dorito-feliz.png`,color:`orange`}}async function xl(){_l.value=!0,vl.value=``;try{let[e,t]=await Promise.all([ml.listTypes(),ml.listEntries()]);gl.value=e,hl.value=t}catch(e){vl.value=e.message}finally{_l.value=!1}}async function Sl(e){vl.value=``;try{await ml.createEntry(e),hl.value=await ml.listEntries()}catch(e){throw vl.value=e.message,e}}var Cl=[`src`,`alt`],wl={__name:`CatScore`,props:{score:{type:Number,required:!0},size:{type:String,default:`md`}},setup(e){let t=e,n=G(()=>bl(t.score));return(t,r)=>(z(),B(`div`,{class:E([`cat-score`,[n.value.color,e.size]])},[V(`img`,{src:n.value.image,alt:`${n.value.name}, ${n.value.mood}`},null,8,Cl),V(`strong`,null,D(e.score),1)],2))}},Tl=(e,t)=>{let n=e.__vccOpts||e;for(let[e,r]of t)n[e]=r;return n},El=[`aria-busy`],Dl={class:`page-header`},Ol={class:`eyebrow`},kl={key:0,class:`soft-label`,role:`status`},Al={key:1,class:`entry-list-empty`,role:`alert`},jl=[`src`],Ml={key:0},Nl={key:1},Pl=[`src`,`alt`],Fl={key:2,class:`scale-legend`},Il={key:0,class:`quick-grid`},Ll={key:1,class:`form-error`,role:`status`},Rl={class:`wellbeing-section`},zl={class:`wellbeing-grid`},Bl={class:`section-heading`},Vl={key:0,class:`entry-list`},Hl={key:1,class:`entry-list-empty`},Ul=[`src`],Wl=Tl({__name:`DashboardView`,setup(e){let t=`/registro_gatos/`,n=new Intl.DateTimeFormat(`es-AR`,{weekday:`long`,day:`numeric`,month:`long`}).format(new Date),r=G(()=>il.value[0]?.slug||``),i=G(()=>il.value.map(e=>({type:e.slug,title:e.name,copy:`Registrá ${e.name.toLowerCase()} y cómo te hizo sentir.`,icon:e.icon})));sr(dl);let a=[{icon:`agua`,label:`Agua`,value:`—`,detail:`Sin registros`,tone:`info`},{icon:`racha`,label:`Racha`,value:`—`,detail:`Sin registros`,tone:`orange`},{icon:`progreso`,label:`Progreso`,value:`—`,detail:`Sin registros`,tone:`success`},{icon:`sueno`,label:`Sueño`,value:`—`,detail:`Sin registros`,tone:`olive`}];return(e,o)=>{let s=_r(`RouterLink`);return z(),B(`div`,{class:`page dashboard-page`,"aria-busy":P(al)},[V(`header`,Dl,[V(`div`,null,[V(`p`,Ol,D(P(n)),1),o[1]||=V(`h1`,null,[U(`Hola, Roman `),V(`span`)],-1),o[2]||=V(`p`,null,`Hoy también cuenta. Registrá cómo viene tu día.`,-1)]),r.value?(z(),Hi(s,{key:0,class:`primary-button`,to:`/registrar/${r.value}`},{default:kn(()=>[H(Rc,{name:`nuevo-registro`}),o[3]||=U(` Nuevo registro`,-1)]),_:1},8,[`to`])):Xi(``,!0)]),P(al)?(z(),B(`p`,kl,`Cargando tus registros…`)):P(ol)?(z(),B(`div`,Al,[V(`img`,{src:P(t)+`cats/felipa-molesta.png`,alt:``},null,8,jl),V(`div`,null,[o[4]||=V(`h3`,null,`No pudimos cargar tus registros`,-1),V(`p`,null,D(P(ol)),1),V(`button`,{class:`primary-button`,type:`button`,onClick:o[0]||=(...e)=>P(dl)&&P(dl)(...e)},`Reintentar`)])])):(z(),B(R,{key:2},[V(`section`,{class:E([`hero-card`,{"is-empty":!P(sl)}])},[P(sl)?(z(),B(`div`,Ml,[o[7]||=V(`span`,{class:`soft-label`},`TU PROMEDIO DE HOY`,-1),V(`h2`,null,[U(D(P(cl))+` `,1),o[5]||=V(`small`,null,`/ 10`,-1)]),V(`p`,null,D(P(ul)(P(cl)).name)+` dice que vas llevando el día `+D(P(cl)>=8?`con toda`:P(cl)>=4?`a tu ritmo`:`con paciencia`)+`.`,1),H(s,{to:`/historial`},{default:kn(()=>[...o[6]||=[U(`Ver evolución →`,-1)]]),_:1})])):(z(),B(`div`,Nl,[o[9]||=V(`span`,{class:`soft-label`},`TODAVÍA NO HAY PROMEDIO`,-1),o[10]||=V(`h2`,{class:`empty-title`},`Sin registros todavía`,-1),o[11]||=V(`p`,null,`Felipa está esperando que le cuentes cómo viene tu día.`,-1),r.value?(z(),Hi(s,{key:0,to:`/registrar/${r.value}`},{default:kn(()=>[...o[8]||=[U(`Crear primer registro →`,-1)]]),_:1},8,[`to`])):Xi(``,!0)])),V(`img`,{src:P(sl)?P(ul)(P(cl)).image:P(t)+`cats/felipa-molesta.png`,alt:P(sl)?P(ul)(P(cl)).name:`Felipa esperando el primer registro`},null,8,Pl),P(sl)?(z(),B(`div`,Fl,[...o[12]||=[V(`span`,null,`1`,-1),V(`i`,null,null,-1),V(`i`,null,null,-1),V(`i`,null,null,-1),V(`b`,null,null,-1),V(`b`,null,null,-1),V(`b`,null,null,-1),V(`em`,null,null,-1),V(`em`,null,null,-1),V(`em`,null,null,-1),V(`span`,null,`10`,-1)]])):Xi(``,!0)],2),V(`section`,null,[o[14]||=V(`div`,{class:`section-heading`},[V(`div`,null,[V(`p`,{class:`eyebrow`},`SUMÁ UN MOMENTO`),V(`h2`,null,`¿Qué querés registrar?`)])],-1),i.value.length?(z(),B(`div`,Il,[(z(!0),B(R,null,xr(i.value,e=>(z(),Hi(s,{key:e.type,to:`/registrar/${e.type}`,class:`quick-card`},{default:kn(()=>[V(`span`,null,[H(Rc,{name:e.icon},null,8,[`name`])]),V(`div`,null,[V(`h3`,null,D(e.title),1),V(`p`,null,D(e.copy),1)]),o[13]||=V(`b`,null,`＋`,-1)]),_:2},1032,[`to`]))),128))])):(z(),B(`p`,Ll,`Todavía no hay tipos de registro habilitados.`))]),V(`section`,Rl,[o[15]||=V(`div`,{class:`section-heading`},[V(`div`,null,[V(`p`,{class:`eyebrow`},`UN VISTAZO`),V(`h2`,null,`Tu bienestar`)])],-1),V(`div`,zl,[(z(),B(R,null,xr(a,e=>V(`article`,{key:e.label,class:E(e.tone)},[V(`span`,null,[H(Rc,{name:e.icon},null,8,[`name`])]),V(`div`,null,[V(`small`,null,D(e.label),1),V(`strong`,null,D(e.value),1),V(`p`,null,D(e.detail),1)])],2)),64))])]),V(`section`,null,[V(`div`,Bl,[o[17]||=V(`div`,null,[V(`p`,{class:`eyebrow`},`ASÍ VIENE EL DÍA`),V(`h2`,null,`Registros recientes`)],-1),H(s,{to:`/historial`},{default:kn(()=>[...o[16]||=[U(`Ver todos`,-1)]]),_:1})]),P(sl)?(z(),B(`div`,Vl,[(z(!0),B(R,null,xr(P(rl).slice(0,3),e=>(z(),B(`article`,{key:e.id},[H(wl,{score:e.score},null,8,[`score`]),V(`div`,null,[V(`span`,null,D(e.typeName)+` · `+D(e.time),1),V(`h3`,null,D(e.title),1),V(`p`,null,D(e.detail||`Sin notas`),1)]),V(`strong`,null,D(e.score)+`/10`,1)]))),128))])):(z(),B(`div`,Hl,[V(`img`,{src:P(t)+`cats/felipa-molesta.png`,alt:``},null,8,Ul),o[18]||=V(`div`,null,[V(`h3`,null,`Sin registros todavía`),V(`p`,null,`Cuando agregues cualquier tipo de registro habilitado, aparecerá acá.`)],-1)]))])],64))],8,El)}}},[[`__scopeId`,`data-v-2658bffb`]]),Gl={class:`page form-page`},Kl={class:`page-header`},ql={key:0,class:`form-error`,role:`alert`},Jl={class:`type-tabs`,role:`tablist`},Yl=[`onClick`],Xl={class:`score-panel`},Zl=[`src`,`alt`],Ql={class:`range-label`},$l={class:`form-grid`},eu=[`placeholder`],tu=[`onUpdate:modelValue`,`required`],nu=[`onUpdate:modelValue`,`required`],ru=[`value`],iu=[`onUpdate:modelValue`,`type`,`required`],au={class:`form-actions`},ou=[`disabled`],su={__name:`RegistroView`,setup(e){let t=Qo(),n=Zo(),r=N(``),i=N(7),a=N(``),o=N(``),s=It({}),c=N(!1),l=G(()=>gl.value.find(e=>e.slug===r.value)||gl.value[0]),u=G(()=>bl(i.value));function d(){let e=String(t.params.type||``);r.value=gl.value.some(t=>t.slug===e)?e:gl.value[0]?.slug||``}sr(async()=>{await xl(),d()}),In(()=>t.params.type,d);async function f(){if(l.value){c.value=!0;try{await Sl({type:r.value,title:a.value||l.value.name,notes:o.value,score:i.value,values:s}),n.push(`/`)}finally{c.value=!1}}}return(e,t)=>{let n=_r(`RouterLink`);return z(),B(`div`,Gl,[V(`header`,Kl,[V(`div`,null,[t[3]||=V(`p`,{class:`eyebrow`},`NUEVO MOMENTO`,-1),V(`h1`,null,`Registrar `+D(l.value?.name?.toLowerCase()||`momento`),1),t[4]||=V(`p`,null,`Sin juicios ni objetivos perfectos. Sólo cómo fue para vos.`,-1)])]),l.value?(z(),B(`form`,{key:0,class:`record-form`,onSubmit:Ao(f,[`prevent`])},[P(vl)?(z(),B(`p`,ql,D(P(vl)),1)):Xi(``,!0),V(`div`,Jl,[(z(!0),B(R,null,xr(P(gl),e=>(z(),B(`button`,{key:e.slug,type:`button`,class:E({active:r.value===e.slug}),onClick:t=>r.value=e.slug},D(e.name),11,Yl))),128))]),V(`div`,Xl,[V(`div`,null,[t[5]||=V(`p`,{class:`eyebrow`},`¿CÓMO TE SENTISTE?`,-1),V(`h2`,null,D(u.value.name)+` te acompaña`,1),V(`p`,null,D(i.value<=3?`Hoy costó, y está bien.`:i.value<=7?`Tomalo con calma y escuchá tu cuerpo.`:`¡Qué lindo verte así!`),1)]),V(`img`,{src:u.value.image,alt:u.value.name},null,8,Zl),V(`output`,null,[U(D(i.value),1),t[6]||=V(`small`,null,`/10`,-1)])]),V(`label`,Ql,[t[7]||=V(`span`,null,[V(`b`,null,`1`),U(` Felipa`)],-1),An(V(`input`,{"onUpdate:modelValue":t[0]||=e=>i.value=e,type:`range`,min:`1`,max:`10`},null,512),[[_o,i.value,void 0,{number:!0}]]),t[8]||=V(`span`,null,[U(`Dorito `),V(`b`,null,`10`)],-1)]),V(`div`,$l,[V(`label`,null,[t[9]||=V(`span`,null,`Título`,-1),An(V(`input`,{"onUpdate:modelValue":t[1]||=e=>a.value=e,required:``,placeholder:l.value.name},null,8,eu),[[_o,a.value]])]),(z(!0),B(R,null,xr(l.value.fields,e=>(z(),B(`label`,{key:e.key},[V(`span`,null,D(e.label),1),e.inputType===`textarea`?An((z(),B(`textarea`,{key:0,"onUpdate:modelValue":t=>s[e.key]=t,required:e.required,rows:`3`},null,8,tu)),[[_o,s[e.key]]]):e.inputType===`select`?An((z(),B(`select`,{key:1,"onUpdate:modelValue":t=>s[e.key]=t,required:e.required},[t[10]||=V(`option`,{value:``},`Seleccionar`,-1),(z(!0),B(R,null,xr(e.options,e=>(z(),B(`option`,{key:e,value:e},D(e),9,ru))),128))],8,nu)),[[xo,s[e.key]]]):An((z(),B(`input`,{key:2,"onUpdate:modelValue":t=>s[e.key]=t,type:e.inputType,required:e.required},null,8,iu)),[[To,s[e.key]]])]))),128)),V(`label`,null,[t[11]||=V(`span`,null,`Notas`,-1),An(V(`textarea`,{"onUpdate:modelValue":t[2]||=e=>o.value=e,rows:`4`,placeholder:`Contá un poco más, si querés...`},null,512),[[_o,o.value]])])]),V(`div`,au,[H(n,{to:`/`},{default:kn(()=>[...t[12]||=[U(`Cancelar`,-1)]]),_:1}),V(`button`,{class:`primary-button`,type:`submit`,disabled:c.value},D(c.value?`Guardando…`:`Guardar registro`),9,ou)])],32)):Xi(``,!0)])}}},cu=[`aria-busy`],lu={class:`page-header`},uu={key:0,class:`soft-label`,role:`status`},du={key:1,class:`entry-list-empty`,role:`alert`},fu=[`src`],pu={class:`filters`},mu=[`onClick`],hu={key:0,class:`history-grid`},gu={key:1,class:`entry-list-empty`},_u=[`src`],vu={__name:`HistorialView`,setup(e){let t=`/registro_gatos/`,n=N(`todos`),r=G(()=>il.value[0]?.slug||``),i=G(()=>n.value===`todos`?rl.value:rl.value.filter(e=>e.type===n.value));return sr(dl),(e,a)=>{let o=_r(`RouterLink`);return z(),B(`div`,{class:`page history-page`,"aria-busy":P(al)},[V(`header`,lu,[a[3]||=V(`div`,null,[V(`p`,{class:`eyebrow`},`TU CAMINO`),V(`h1`,null,`Historial`),V(`p`,null,`Todos tus momentos, sin perder de vista cómo te hicieron sentir.`)],-1),r.value?(z(),Hi(o,{key:0,class:`primary-button`,to:`/registrar/${r.value}`},{default:kn(()=>[H(Rc,{name:`nuevo-registro`}),a[2]||=U(` Nuevo registro`,-1)]),_:1},8,[`to`])):Xi(``,!0)]),P(al)?(z(),B(`p`,uu,`Cargando historial…`)):P(ol)?(z(),B(`div`,du,[V(`img`,{src:P(t)+`cats/felipa-molesta.png`,alt:``},null,8,fu),V(`div`,null,[a[4]||=V(`h3`,null,`No pudimos cargar el historial`,-1),V(`p`,null,D(P(ol)),1),V(`button`,{class:`primary-button`,type:`button`,onClick:a[0]||=(...e)=>P(dl)&&P(dl)(...e)},`Reintentar`)])])):(z(),B(R,{key:2},[V(`div`,pu,[V(`button`,{class:E({active:n.value===`todos`}),onClick:a[1]||=e=>n.value=`todos`},`Todos`,2),(z(!0),B(R,null,xr(P(il),e=>(z(),B(`button`,{key:e.slug,class:E({active:n.value===e.slug}),onClick:t=>n.value=e.slug},D(e.name),11,mu))),128))]),i.value.length?(z(),B(`div`,hu,[(z(!0),B(R,null,xr(i.value,e=>(z(),B(`article`,{key:e.id},[H(wl,{score:e.score,size:`lg`},null,8,[`score`]),V(`div`,null,[V(`span`,null,D(e.typeName)+` · `+D(e.time),1),V(`h2`,null,D(e.title),1),V(`p`,null,D(e.detail||`Sin notas`),1)]),V(`b`,null,D(e.score)+`/10`,1)]))),128))])):(z(),B(`div`,gu,[V(`img`,{src:P(t)+`cats/felipa-molesta.png`,alt:``},null,8,_u),V(`div`,null,[a[5]||=V(`h3`,null,`Sin registros todavía`,-1),V(`p`,null,D(n.value===`todos`?`Felipa te espera para registrar el primer momento.`:`No hay registros de este tipo.`),1)])]))],64))],8,cu)}}};function yu(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function bu(e){if(Array.isArray(e))return e}function xu(e){if(Array.isArray(e))return yu(e)}function Su(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function Cu(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,Pu(r.key),r)}}function wu(e,t,n){return t&&Cu(e.prototype,t),n&&Cu(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function Tu(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=Iu(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function q(e,t,n){return(t=Pu(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Eu(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function Du(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function Ou(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ku(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Au(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function J(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Au(Object(n),!0).forEach(function(t){q(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Au(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function ju(e,t){return bu(e)||Du(e,t)||Iu(e,t)||Ou()}function Mu(e){return xu(e)||Eu(e)||Iu(e)||ku()}function Nu(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Pu(e){var t=Nu(e,`string`);return typeof t==`symbol`?t:t+``}function Fu(e){"@babel/helpers - typeof";return Fu=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Fu(e)}function Iu(e,t){if(e){if(typeof e==`string`)return yu(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?yu(e,t):void 0}}var Lu=function(){},Ru={},zu={},Bu=null,Vu={mark:Lu,measure:Lu};try{typeof window<`u`&&(Ru=window),typeof document<`u`&&(zu=document),typeof MutationObserver<`u`&&(Bu=MutationObserver),typeof performance<`u`&&(Vu=performance)}catch{}var Hu=(Ru.navigator||{}).userAgent,Uu=Hu===void 0?``:Hu,Wu=Ru,Y=zu,Gu=Bu,Ku=Vu;Wu.document;var qu=!!Y.documentElement&&!!Y.head&&typeof Y.addEventListener==`function`&&typeof Y.createElement==`function`,Ju=~Uu.indexOf(`MSIE`)||~Uu.indexOf(`Trident/`),Yu,Xu=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt|sldr|slpdr|pr|ms|vs)?[\-\ ]/,Zu=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Slab Duo|Slab Press Duo|Pixel|Mosaic|Vellum|Whiteboard)?.*/i,Qu={classic:{fa:`solid`,fas:`solid`,"fa-solid":`solid`,far:`regular`,"fa-regular":`regular`,fal:`light`,"fa-light":`light`,fat:`thin`,"fa-thin":`thin`,fab:`brands`,"fa-brands":`brands`},duotone:{fa:`solid`,fad:`solid`,"fa-solid":`solid`,"fa-duotone":`solid`,fadr:`regular`,"fa-regular":`regular`,fadl:`light`,"fa-light":`light`,fadt:`thin`,"fa-thin":`thin`},sharp:{fa:`solid`,fass:`solid`,"fa-solid":`solid`,fasr:`regular`,"fa-regular":`regular`,fasl:`light`,"fa-light":`light`,fast:`thin`,"fa-thin":`thin`},"sharp-duotone":{fa:`solid`,fasds:`solid`,"fa-solid":`solid`,fasdr:`regular`,"fa-regular":`regular`,fasdl:`light`,"fa-light":`light`,fasdt:`thin`,"fa-thin":`thin`},slab:{"fa-regular":`regular`,faslr:`regular`},"slab-press":{"fa-regular":`regular`,faslpr:`regular`},"slab-duo":{"fa-regular":`regular`,fasldr:`regular`},"slab-press-duo":{"fa-regular":`regular`,faslpdr:`regular`},thumbprint:{"fa-light":`light`,fatl:`light`},vellum:{"fa-solid":`solid`,favs:`solid`},pixel:{"fa-regular":`regular`,fapr:`regular`},mosaic:{"fa-solid":`solid`,fams:`solid`},whiteboard:{"fa-semibold":`semibold`,fawsb:`semibold`},notdog:{"fa-solid":`solid`,fans:`solid`},"notdog-duo":{"fa-solid":`solid`,fands:`solid`},etch:{"fa-solid":`solid`,faes:`solid`},graphite:{"fa-thin":`thin`,fagt:`thin`},jelly:{"fa-regular":`regular`,fajr:`regular`},"jelly-fill":{"fa-regular":`regular`,fajfr:`regular`},"jelly-duo":{"fa-regular":`regular`,fajdr:`regular`},chisel:{"fa-regular":`regular`,facr:`regular`},utility:{"fa-semibold":`semibold`,fausb:`semibold`},"utility-duo":{"fa-semibold":`semibold`,faudsb:`semibold`},"utility-fill":{"fa-semibold":`semibold`,faufsb:`semibold`}},$u={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},ed=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-slab-press-duo`,`fa-slab-duo`,`fa-mosaic`,`fa-pixel`,`fa-vellum`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`],X=`classic`,td=`duotone`,nd=`sharp`,rd=`sharp-duotone`,id=`chisel`,ad=`etch`,od=`graphite`,sd=`jelly`,cd=`jelly-duo`,ld=`jelly-fill`,ud=`mosaic`,dd=`notdog`,fd=`notdog-duo`,pd=`pixel`,md=`slab`,hd=`slab-duo`,gd=`slab-press`,_d=`slab-press-duo`,vd=`thumbprint`,yd=`utility`,bd=`utility-duo`,xd=`utility-fill`,Sd=`vellum`,Cd=`whiteboard`,wd=`Classic`,Td=`Duotone`,Ed=`Sharp`,Dd=`Sharp Duotone`,Od=`Chisel`,kd=`Etch`,Ad=`Graphite`,jd=`Jelly`,Md=`Jelly Duo`,Nd=`Jelly Fill`,Pd=`Mosaic`,Fd=`Notdog`,Id=`Notdog Duo`,Ld=`Pixel`,Rd=`Slab`,zd=`Slab Duo`,Bd=`Slab Press`,Vd=`Slab Press Duo`,Hd=`Thumbprint`,Ud=`Utility`,Wd=`Utility Duo`,Gd=`Utility Fill`,Kd=`Vellum`,qd=`Whiteboard`,Jd=[X,td,nd,rd,id,ad,od,sd,cd,ld,ud,dd,fd,pd,md,hd,gd,_d,vd,yd,bd,xd,Sd,Cd];Yu={},q(q(q(q(q(q(q(q(q(q(Yu,X,wd),td,Td),nd,Ed),rd,Dd),id,Od),ad,kd),od,Ad),sd,jd),cd,Md),ld,Nd),q(q(q(q(q(q(q(q(q(q(Yu,ud,Pd),dd,Fd),fd,Id),pd,Ld),md,Rd),hd,zd),gd,Bd),_d,Vd),vd,Hd),yd,Ud),q(q(q(q(Yu,bd,Wd),xd,Gd),Sd,Kd),Cd,qd);var Yd={classic:{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},duotone:{900:`fad`,400:`fadr`,300:`fadl`,100:`fadt`},sharp:{900:`fass`,400:`fasr`,300:`fasl`,100:`fast`},"sharp-duotone":{900:`fasds`,400:`fasdr`,300:`fasdl`,100:`fasdt`},slab:{400:`faslr`},"slab-press":{400:`faslpr`},"slab-duo":{400:`fasldr`},"slab-press-duo":{400:`faslpdr`},vellum:{900:`favs`},mosaic:{900:`fams`},pixel:{400:`fapr`},whiteboard:{600:`fawsb`},thumbprint:{300:`fatl`},notdog:{900:`fans`},"notdog-duo":{900:`fands`},etch:{900:`faes`},graphite:{100:`fagt`},chisel:{400:`facr`},jelly:{400:`fajr`},"jelly-fill":{400:`fajfr`},"jelly-duo":{400:`fajdr`},utility:{600:`fausb`},"utility-duo":{600:`faudsb`},"utility-fill":{600:`faufsb`}},Xd={"Font Awesome 7 Free":{900:`fas`,400:`far`},"Font Awesome 7 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},"Font Awesome 7 Brands":{400:`fab`,normal:`fab`},"Font Awesome 7 Duotone":{900:`fad`,400:`fadr`,normal:`fadr`,300:`fadl`,100:`fadt`},"Font Awesome 7 Sharp":{900:`fass`,400:`fasr`,normal:`fasr`,300:`fasl`,100:`fast`},"Font Awesome 7 Sharp Duotone":{900:`fasds`,400:`fasdr`,normal:`fasdr`,300:`fasdl`,100:`fasdt`},"Font Awesome 7 Jelly":{400:`fajr`,normal:`fajr`},"Font Awesome 7 Jelly Fill":{400:`fajfr`,normal:`fajfr`},"Font Awesome 7 Jelly Duo":{400:`fajdr`,normal:`fajdr`},"Font Awesome 7 Slab":{400:`faslr`,normal:`faslr`},"Font Awesome 7 Slab Press":{400:`faslpr`,normal:`faslpr`},"Font Awesome 7 Slab Duo":{400:`fasldr`,normal:`fasldr`},"Font Awesome 7 Slab Press Duo":{400:`faslpdr`,normal:`faslpdr`},"Font Awesome 7 Pixel":{400:`fapr`,normal:`fapr`},"Font Awesome 7 Mosaic":{900:`fams`,normal:`fams`},"Font Awesome 7 Vellum":{900:`favs`,normal:`favs`},"Font Awesome 7 Thumbprint":{300:`fatl`,normal:`fatl`},"Font Awesome 7 Notdog":{900:`fans`,normal:`fans`},"Font Awesome 7 Notdog Duo":{900:`fands`,normal:`fands`},"Font Awesome 7 Etch":{900:`faes`,normal:`faes`},"Font Awesome 7 Graphite":{100:`fagt`,normal:`fagt`},"Font Awesome 7 Chisel":{400:`facr`,normal:`facr`},"Font Awesome 7 Whiteboard":{600:`fawsb`,normal:`fawsb`},"Font Awesome 7 Utility":{600:`fausb`,normal:`fausb`},"Font Awesome 7 Utility Duo":{600:`faudsb`,normal:`faudsb`},"Font Awesome 7 Utility Fill":{600:`faufsb`,normal:`faufsb`}},Zd=new Map([[`classic`,{defaultShortPrefixId:`fas`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`,`brands`],futureStyleIds:[],defaultFontWeight:900}],[`duotone`,{defaultShortPrefixId:`fad`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp`,{defaultShortPrefixId:`fass`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp-duotone`,{defaultShortPrefixId:`fasds`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`chisel`,{defaultShortPrefixId:`facr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`etch`,{defaultShortPrefixId:`faes`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`graphite`,{defaultShortPrefixId:`fagt`,defaultStyleId:`thin`,styleIds:[`thin`],futureStyleIds:[],defaultFontWeight:100}],[`jelly`,{defaultShortPrefixId:`fajr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-duo`,{defaultShortPrefixId:`fajdr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-fill`,{defaultShortPrefixId:`fajfr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`mosaic`,{defaultShortPrefixId:`fams`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`notdog`,{defaultShortPrefixId:`fans`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`notdog-duo`,{defaultShortPrefixId:`fands`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`pixel`,{defaultShortPrefixId:`fapr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab`,{defaultShortPrefixId:`faslr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-duo`,{defaultShortPrefixId:`fasldr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-press`,{defaultShortPrefixId:`faslpr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-press-duo`,{defaultShortPrefixId:`faslpdr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`thumbprint`,{defaultShortPrefixId:`fatl`,defaultStyleId:`light`,styleIds:[`light`],futureStyleIds:[],defaultFontWeight:300}],[`utility`,{defaultShortPrefixId:`fausb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-duo`,{defaultShortPrefixId:`faudsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-fill`,{defaultShortPrefixId:`faufsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`vellum`,{defaultShortPrefixId:`favs`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`whiteboard`,{defaultShortPrefixId:`fawsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}]]),Qd={chisel:{regular:`facr`},classic:{brands:`fab`,light:`fal`,regular:`far`,solid:`fas`,thin:`fat`},duotone:{light:`fadl`,regular:`fadr`,solid:`fad`,thin:`fadt`},etch:{solid:`faes`},graphite:{thin:`fagt`},jelly:{regular:`fajr`},"jelly-duo":{regular:`fajdr`},"jelly-fill":{regular:`fajfr`},mosaic:{solid:`fams`},notdog:{solid:`fans`},"notdog-duo":{solid:`fands`},pixel:{regular:`fapr`},sharp:{light:`fasl`,regular:`fasr`,solid:`fass`,thin:`fast`},"sharp-duotone":{light:`fasdl`,regular:`fasdr`,solid:`fasds`,thin:`fasdt`},slab:{regular:`faslr`},"slab-duo":{regular:`fasldr`},"slab-press":{regular:`faslpr`},"slab-press-duo":{regular:`faslpdr`},thumbprint:{light:`fatl`},utility:{semibold:`fausb`},"utility-duo":{semibold:`faudsb`},"utility-fill":{semibold:`faufsb`},vellum:{solid:`favs`},whiteboard:{semibold:`fawsb`}},$d=[`fak`,`fa-kit`,`fakd`,`fa-kit-duotone`],ef={kit:{fak:`kit`,"fa-kit":`kit`},"kit-duotone":{fakd:`kit-duotone`,"fa-kit-duotone":`kit-duotone`}},tf=[`kit`];q(q({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var nf={kit:{"fa-kit":`fak`},"kit-duotone":{"fa-kit-duotone":`fakd`}},rf={"Font Awesome Kit":{400:`fak`,normal:`fak`},"Font Awesome Kit Duotone":{400:`fakd`,normal:`fakd`}},af={kit:{fak:`fa-kit`},"kit-duotone":{fakd:`fa-kit-duotone`}},of={kit:{kit:`fak`},"kit-duotone":{"kit-duotone":`fakd`}},sf,cf={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},lf=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-slab-press-duo`,`fa-slab-duo`,`fa-mosaic`,`fa-pixel`,`fa-vellum`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`];sf={},q(q(q(q(q(q(q(q(q(q(sf,`classic`,`Classic`),`duotone`,`Duotone`),`sharp`,`Sharp`),`sharp-duotone`,`Sharp Duotone`),`chisel`,`Chisel`),`etch`,`Etch`),`graphite`,`Graphite`),`jelly`,`Jelly`),`jelly-duo`,`Jelly Duo`),`jelly-fill`,`Jelly Fill`),q(q(q(q(q(q(q(q(q(q(sf,`mosaic`,`Mosaic`),`notdog`,`Notdog`),`notdog-duo`,`Notdog Duo`),`pixel`,`Pixel`),`slab`,`Slab`),`slab-duo`,`Slab Duo`),`slab-press`,`Slab Press`),`slab-press-duo`,`Slab Press Duo`),`thumbprint`,`Thumbprint`),`utility`,`Utility`),q(q(q(q(sf,`utility-duo`,`Utility Duo`),`utility-fill`,`Utility Fill`),`vellum`,`Vellum`),`whiteboard`,`Whiteboard`),q(q({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var uf={classic:{"fa-brands":`fab`,"fa-duotone":`fad`,"fa-light":`fal`,"fa-regular":`far`,"fa-solid":`fas`,"fa-thin":`fat`},duotone:{"fa-regular":`fadr`,"fa-light":`fadl`,"fa-thin":`fadt`},sharp:{"fa-solid":`fass`,"fa-regular":`fasr`,"fa-light":`fasl`,"fa-thin":`fast`},"sharp-duotone":{"fa-solid":`fasds`,"fa-regular":`fasdr`,"fa-light":`fasdl`,"fa-thin":`fasdt`},slab:{"fa-regular":`faslr`},"slab-press":{"fa-regular":`faslpr`},"slab-duo":{"fa-regular":`fasldr`},"slab-press-duo":{"fa-regular":`faslpdr`},pixel:{"fa-regular":`fapr`},mosaic:{"fa-solid":`fams`},vellum:{"fa-solid":`favs`},whiteboard:{"fa-semibold":`fawsb`},thumbprint:{"fa-light":`fatl`},notdog:{"fa-solid":`fans`},"notdog-duo":{"fa-solid":`fands`},etch:{"fa-solid":`faes`},graphite:{"fa-thin":`fagt`},jelly:{"fa-regular":`fajr`},"jelly-fill":{"fa-regular":`fajfr`},"jelly-duo":{"fa-regular":`fajdr`},chisel:{"fa-regular":`facr`},utility:{"fa-semibold":`fausb`},"utility-duo":{"fa-semibold":`faudsb`},"utility-fill":{"fa-semibold":`faufsb`}},df={classic:[`fas`,`far`,`fal`,`fat`,`fad`],duotone:[`fadr`,`fadl`,`fadt`],sharp:[`fass`,`fasr`,`fasl`,`fast`],"sharp-duotone":[`fasds`,`fasdr`,`fasdl`,`fasdt`],slab:[`faslr`],"slab-press":[`faslpr`],"slab-duo":[`fasldr`],"slab-press-duo":[`faslpdr`],pixel:[`fapr`],mosaic:[`fams`],vellum:[`favs`],whiteboard:[`fawsb`],thumbprint:[`fatl`],notdog:[`fans`],"notdog-duo":[`fands`],etch:[`faes`],graphite:[`fagt`],jelly:[`fajr`],"jelly-fill":[`fajfr`],"jelly-duo":[`fajdr`],chisel:[`facr`],utility:[`fausb`],"utility-duo":[`faudsb`],"utility-fill":[`faufsb`]},ff={classic:{fab:`fa-brands`,fad:`fa-duotone`,fal:`fa-light`,far:`fa-regular`,fas:`fa-solid`,fat:`fa-thin`},duotone:{fadr:`fa-regular`,fadl:`fa-light`,fadt:`fa-thin`},sharp:{fass:`fa-solid`,fasr:`fa-regular`,fasl:`fa-light`,fast:`fa-thin`},"sharp-duotone":{fasds:`fa-solid`,fasdr:`fa-regular`,fasdl:`fa-light`,fasdt:`fa-thin`},slab:{faslr:`fa-regular`},"slab-press":{faslpr:`fa-regular`},"slab-duo":{fasldr:`fa-regular`},"slab-press-duo":{faslpdr:`fa-regular`},pixel:{fapr:`fa-regular`},mosaic:{fams:`fa-solid`},vellum:{favs:`fa-solid`},whiteboard:{fawsb:`fa-semibold`},thumbprint:{fatl:`fa-light`},notdog:{fans:`fa-solid`},"notdog-duo":{fands:`fa-solid`},etch:{faes:`fa-solid`},graphite:{fagt:`fa-thin`},jelly:{fajr:`fa-regular`},"jelly-fill":{fajfr:`fa-regular`},"jelly-duo":{fajdr:`fa-regular`},chisel:{facr:`fa-regular`},utility:{fausb:`fa-semibold`},"utility-duo":{faudsb:`fa-semibold`},"utility-fill":{faufsb:`fa-semibold`}},pf=`fa.fas.far.fal.fat.fad.fadr.fadl.fadt.fab.fass.fasr.fasl.fast.fasds.fasdr.fasdl.fasdt.faslr.faslpr.fasldr.faslpdr.fapr.fams.favs.fawsb.fatl.fans.fands.faes.fagt.fajr.fajfr.fajdr.facr.fausb.faudsb.faufsb`.split(`.`).concat(lf,[`fa-solid`,`fa-regular`,`fa-light`,`fa-thin`,`fa-duotone`,`fa-brands`,`fa-semibold`]),mf=[`solid`,`regular`,`light`,`thin`,`duotone`,`brands`,`semibold`],hf=[1,2,3,4,5,6,7,8,9,10],gf=hf.concat([11,12,13,14,15,16,17,18,19,20]),_f=[].concat(Mu(Object.keys(df)),mf,[`aw`,`fw`,`pull-left`,`pull-right`],[`2xs`,`xs`,`sm`,`lg`,`xl`,`2xl`,`beat`,`beat-fade`,`border`,`bounce`,`buzz`,`canvas-square`,`canvas-roomy`,`fade`,`flip-360`,`flip-both`,`flip-horizontal`,`flip-vertical`,`flip`,`float`,`inverse`,`jello`,`layers`,`layers-bottom-left`,`layers-bottom-right`,`layers-counter`,`layers-text`,`layers-top-left`,`layers-top-right`,`li`,`pull-end`,`pull-start`,`pulse`,`rotate-180`,`rotate-270`,`rotate-90`,`rotate-by`,`shake`,`spin-pulse`,`spin-reverse`,`spin`,`spin-snap`,`spin-snap-4`,`spin-snap-8`,`stack-1x`,`stack-2x`,`stack`,`swing`,`ul`,`wag`,`width-auto`,`width-fixed`,cf.GROUP,cf.SWAP_OPACITY,cf.PRIMARY,cf.SECONDARY],hf.map(function(e){return`${e}x`}),gf.map(function(e){return`w-${e}`})),vf={"Font Awesome 5 Free":{900:`fas`,400:`far`},"Font Awesome 5 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`},"Font Awesome 5 Brands":{400:`fab`,normal:`fab`},"Font Awesome 5 Duotone":{900:`fad`}},yf=`___FONT_AWESOME___`,bf=16,xf=`fa`,Sf=`svg-inline--fa`,Cf=`data-fa-i2svg`,wf=`data-fa-pseudo-element`,Tf=`data-fa-pseudo-element-pending`,Ef=`data-prefix`,Df=`data-icon`,Of=`fontawesome-i2svg`,kf=`async`,Af=[`HTML`,`HEAD`,`STYLE`,`SCRIPT`],jf=[`::before`,`::after`,`:before`,`:after`],Mf=function(){try{return!0}catch{return!1}}();function Nf(e){return new Proxy(e,{get:function(e,t){return t in e?e[t]:e[X]}})}var Pf=J({},Qu);Pf[X]=J(J(J(J({},{"fa-duotone":`duotone`}),Qu[X]),ef.kit),ef[`kit-duotone`]);var Ff=Nf(Pf),If=J({},Qd);If[X]=J(J(J(J({},{duotone:`fad`}),If[X]),of.kit),of[`kit-duotone`]);var Lf=Nf(If),Rf=J({},ff);Rf[X]=J(J({},Rf[X]),af.kit);var zf=Nf(Rf),Bf=J({},uf);Bf[X]=J(J({},Bf[X]),nf.kit),Nf(Bf);var Vf=Xu,Hf=`fa-layers-text`,Uf=Zu;Nf(J({},Yd));var Wf=[`class`,`data-prefix`,`data-icon`,`data-fa-transform`,`data-fa-mask`],Gf=$u,Kf=[].concat(Mu(tf),Mu(_f)),qf=Wu.FontAwesomeConfig||{};function Jf(e){var t=Y.querySelector(`script[`+e+`]`);if(t)return t.getAttribute(e)}function Yf(e){return e===``?!0:e===`false`?!1:e===`true`||e}Y&&typeof Y.querySelector==`function`&&[[`data-family-prefix`,`familyPrefix`],[`data-css-prefix`,`cssPrefix`],[`data-family-default`,`familyDefault`],[`data-style-default`,`styleDefault`],[`data-replacement-class`,`replacementClass`],[`data-auto-replace-svg`,`autoReplaceSvg`],[`data-auto-add-css`,`autoAddCss`],[`data-search-pseudo-elements`,`searchPseudoElements`],[`data-search-pseudo-elements-warnings`,`searchPseudoElementsWarnings`],[`data-search-pseudo-elements-full-scan`,`searchPseudoElementsFullScan`],[`data-observe-mutations`,`observeMutations`],[`data-mutate-approach`,`mutateApproach`],[`data-keep-original-source`,`keepOriginalSource`],[`data-measure-performance`,`measurePerformance`],[`data-show-missing-icons`,`showMissingIcons`]].forEach(function(e){var t=ju(e,2),n=t[0],r=t[1],i=Yf(Jf(n));i!=null&&(qf[r]=i)});var Xf={styleDefault:`solid`,familyDefault:X,cssPrefix:xf,replacementClass:Sf,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:`async`,keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};qf.familyPrefix&&(qf.cssPrefix=qf.familyPrefix);var Zf=J(J({},Xf),qf);Zf.autoReplaceSvg||(Zf.observeMutations=!1);var Z={};Object.keys(Xf).forEach(function(e){Object.defineProperty(Z,e,{enumerable:!0,set:function(t){Zf[e]=t,Qf.forEach(function(e){return e(Z)})},get:function(){return Zf[e]}})}),Object.defineProperty(Z,"familyPrefix",{enumerable:!0,set:function(e){Zf.cssPrefix=e,Qf.forEach(function(e){return e(Z)})},get:function(){return Zf.cssPrefix}}),Wu.FontAwesomeConfig=Z;var Qf=[];function $f(e){return Qf.push(e),function(){Qf.splice(Qf.indexOf(e),1)}}var ep=bf,tp={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function np(e){if(!(!e||!qu)){var t=Y.createElement(`style`);t.setAttribute(`type`,`text/css`),t.innerHTML=e;for(var n=Y.head.childNodes,r=null,i=n.length-1;i>-1;i--){var a=n[i],o=(a.tagName||``).toUpperCase();[`STYLE`,`LINK`].indexOf(o)>-1&&(r=a)}return Y.head.insertBefore(t,r),e}}var rp=`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;function ip(){for(var e=12,t=``;e-->0;)t+=rp[Math.random()*62|0];return t}function ap(e){for(var t=[],n=(e||[]).length>>>0;n--;)t[n]=e[n];return t}function op(e){return e.classList?ap(e.classList):(e.getAttribute(`class`)||``).split(` `).filter(function(e){return e})}function sp(e){return`${e}`.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function cp(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}="${sp(e[n])}" `},``).trim()}function lp(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}: ${e[n].trim()};`},``)}function up(e){return e.size!==tp.size||e.x!==tp.x||e.y!==tp.y||e.rotate!==tp.rotate||e.flipX||e.flipY}function dp(e){var t=e.transform,n=e.containerWidth,r=e.iconWidth;return{outer:{transform:`translate(${n/2} 256)`},inner:{transform:`${`translate(${t.x*32}, ${t.y*32}) `} ${`scale(${t.size/16*(t.flipX?-1:1)}, ${t.size/16*(t.flipY?-1:1)}) `} ${`rotate(${t.rotate} 0 0)`}`},path:{transform:`translate(${r/2*-1} -256)`}}}function fp(e){var t=e.transform,n=e.width,r=n===void 0?bf:n,i=e.height,a=i===void 0?bf:i,o=e.startCentered,s=o!==void 0&&o,c=``;return c+=s&&Ju?`translate(${t.x/ep-r/2}em, ${t.y/ep-a/2}em) `:s?`translate(calc(-50% + ${t.x/ep}em), calc(-50% + ${t.y/ep}em)) `:`translate(${t.x/ep}em, ${t.y/ep}em) `,c+=`scale(${t.size/ep*(t.flipX?-1:1)}, ${t.size/ep*(t.flipY?-1:1)}) `,c+=`rotate(${t.rotate}deg) `,c}var pp=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-slab-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Duo';
  --fa-font-slab-press-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Press Duo';
  --fa-font-pixel-regular: normal 400 1em/1 'Font Awesome 7 Pixel';
  --fa-font-mosaic-solid: normal 900 1em/1 'Font Awesome 7 Mosaic';
  --fa-font-vellum-solid: normal 900 1em/1 'Font Awesome 7 Vellum';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-canvas-square {
  padding-block: 0.125em;
  margin-block-end: -0.125em;
}

.fa-canvas-roomy {
  padding-block: 0.25em;
  padding-inline: 0.125em;
  margin-block-end: -0.25em;
  box-sizing: content-box;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1.5s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-flip-360 {
  animation-name: fa-flip-360;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.75s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

.fa-spin-snap {
  animation-name: fa-spin-snap;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 3s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-snap-4 {
  animation-name: fa-spin-snap-4;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2.4s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-snap-8 {
  animation-name: fa-spin-snap-8;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 4s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-buzz {
  animation-name: fa-buzz;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.6s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-wag {
  animation-name: fa-wag;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.9s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
  transform-origin: bottom center;
}

.fa-float {
  animation-name: fa-float;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 3s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
  will-change: transform;
}

.fa-swing {
  animation-name: fa-swing;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1.2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
  transform-origin: top center;
}

.fa-jello {
  animation-name: fa-jello;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.9s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-flip-360,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse,
  .fa-buzz,
  .fa-float,
  .fa-jello,
  .fa-spin-snap,
  .fa-spin-snap-4,
  .fa-spin-snap-8,
  .fa-swing,
  .fa-wag {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));
  }
  45% {
    transform: scale(calc(1.22 * var(--fa-beat-scale, 1.22)));
  }
  65% {
    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));
  }
  90% {
    transform: scale(1);
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
    animation-timing-function: var(--fa-animation-timing);
  }
  14% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.06), var(--fa-bounce-start-scale-y, 0.94)) translateY(var(--fa-bounce-anticipation, 3px));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  32% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.94), var(--fa-bounce-jump-scale-y, 1.12)) translateY(calc(-1 * var(--fa-bounce-height, 0.5em)));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  52% {
    transform: scale(1, 1) translateY(calc(-1 * var(--fa-bounce-height, 0.5em) * 1.1));
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  70% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.06), var(--fa-bounce-land-scale-y, 0.92)) translateY(0);
    animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
  }
  85% {
    transform: scale(0.98, 1.04) translateY(calc(-2px * var(--fa-bounce-rebound, 1)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  0% {
    opacity: 1;
    transform: scale(1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  40% {
    opacity: var(--fa-fade-opacity, 0.4);
    transform: scale(0.98);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fa-beat-fade {
  0% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  25% {
    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);
    transform: scale(var(--fa-beat-fade-scale, 1.28));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  45% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.25));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  65% {
    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);
    transform: scale(var(--fa-beat-fade-scale, 1.28));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
}
@keyframes fa-flip {
  0% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  8% {
    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  35% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));
    animation-timing-function: linear;
  }
  65% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.5));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  92% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));
  }
}
@keyframes fa-flip-360 {
  0% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  8% {
    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  50% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  80% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  8% {
    transform: rotate(35deg) translateX(1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  20% {
    transform: rotate(-22deg) translateX(-1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  35% {
    transform: rotate(15deg) translateX(1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  50% {
    transform: rotate(-9deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  65% {
    transform: rotate(5deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  78% {
    transform: rotate(-3deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  90% {
    transform: rotate(1deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  12% {
    transform: rotate(60deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  16.67% {
    transform: rotate(60deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  28.67% {
    transform: rotate(120deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  33.33% {
    transform: rotate(120deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  45.33% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  62% {
    transform: rotate(240deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  66.67% {
    transform: rotate(240deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  78.67% {
    transform: rotate(300deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  83.33% {
    transform: rotate(300deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  95.33% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap-4 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  15% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  25% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  40% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  65% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  75% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  90% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap-8 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  9% {
    transform: rotate(45deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  12.5% {
    transform: rotate(45deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  21.5% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  25% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  34% {
    transform: rotate(135deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  37.5% {
    transform: rotate(135deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  46.5% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  59% {
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  62.5% {
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  71.5% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  75% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  84% {
    transform: rotate(315deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  87.5% {
    transform: rotate(315deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  96.5% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-buzz {
  0% {
    transform: translateX(0) rotate(0deg);
    animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
  }
  5% {
    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.5deg);
  }
  10% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.5deg);
  }
  15% {
    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.3deg);
  }
  20% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.3deg);
  }
  25% {
    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.7)) rotate(0.2deg);
  }
  30% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
  }
  35% {
    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.4)) rotate(0.1deg);
  }
  40% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}
@keyframes fa-wag {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  12% {
    transform: rotate(var(--fa-wag-angle, 12deg));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  24% {
    transform: rotate(2deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  36% {
    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.85));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  48% {
    transform: rotate(1deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  58% {
    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.6));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  68% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-float {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  15% {
    transform: translateY(calc(-0.4 * var(--fa-float-height, 6px))) translateX(var(--fa-float-drift, 1px)) rotate(var(--fa-float-tilt, 1deg)) scale(1, 1);
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  35% {
    transform: translateY(calc(-1 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-stretch-x, 0.98), var(--fa-float-stretch-y, 1.03));
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
  }
  50% {
    transform: translateY(calc(-0.92 * var(--fa-float-height, 6px))) translateX(calc(-0.5 * var(--fa-float-drift, 1px))) rotate(calc(-0.5 * var(--fa-float-tilt, 1deg))) scale(0.995, 1.01);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  70% {
    transform: translateY(calc(-0.3 * var(--fa-float-height, 6px))) translateX(calc(-1 * var(--fa-float-drift, 1px))) rotate(calc(-1 * var(--fa-float-tilt, 1deg))) scale(1, 1);
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  90% {
    transform: translateY(calc(0.05 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
  }
}
@keyframes fa-swing {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  8% {
    transform: rotate(var(--fa-swing-angle, 22deg));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  18% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.85));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  28% {
    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.65));
    animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
  }
  38% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.45));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  48% {
    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.25));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  56% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.1));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  64% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-jello {
  0% {
    transform: scale(1, 1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  12% {
    transform: scale(var(--fa-jello-scale-x, 1.15), calc(2 - var(--fa-jello-scale-x, 1.15)));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  24% {
    transform: scale(calc(2 - var(--fa-jello-scale-y, 1.12)), var(--fa-jello-scale-y, 1.12));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  36% {
    transform: scale(calc(1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5), calc(2 - (1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5)));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  48% {
    transform: scale(calc(2 - (1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3)), calc(1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  58% {
    transform: scale(1.02, 0.98);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  68% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function mp(){var e=xf,t=Sf,n=Z.cssPrefix,r=Z.replacementClass,i=pp;if(n!==e||r!==t){var a=RegExp(`\\.${e}\\-`,`g`),o=RegExp(`\\--${e}\\-`,`g`),s=RegExp(`\\.${t}`,`g`);i=i.replace(a,`.${n}-`).replace(o,`--${n}-`).replace(s,`.${r}`)}return i}var hp=!1;function gp(){Z.autoAddCss&&!hp&&(np(mp()),hp=!0)}var _p={mixout:function(){return{dom:{css:mp,insertCss:gp}}},hooks:function(){return{beforeDOMElementCreation:function(){gp()},beforeI2svg:function(){gp()}}}},vp=Wu||{};vp[yf]||(vp[yf]={}),vp[yf].styles||(vp[yf].styles={}),vp[yf].hooks||(vp[yf].hooks={}),vp[yf].shims||(vp[yf].shims=[]);var yp=vp[yf],bp=[],xp=function(){Y.removeEventListener(`DOMContentLoaded`,xp),Sp=1,bp.map(function(e){return e()})},Sp=!1;qu&&(Sp=(Y.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(Y.readyState),Sp||Y.addEventListener(`DOMContentLoaded`,xp));function Cp(e){qu&&(Sp?setTimeout(e,0):bp.push(e))}function wp(e){var t=e.tag,n=e.attributes,r=n===void 0?{}:n,i=e.children,a=i===void 0?[]:i;return typeof e==`string`?sp(e):`<${t} ${cp(r)}>${a.map(wp).join(``)}</${t}>`}function Tp(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}var Ep=function(e,t){return function(n,r,i,a){return e.call(t,n,r,i,a)}},Dp=function(e,t,n,r){var i=Object.keys(e),a=i.length,o=r===void 0?t:Ep(t,r),s,c,l;for(n===void 0?(s=1,l=e[i[0]]):(s=0,l=n);s<a;s++)c=i[s],l=o(l,e[c],c,e);return l};function Op(e){return Mu(e).length===1?e.codePointAt(0).toString(16):null}function kp(e){return Object.keys(e).reduce(function(t,n){var r=e[n];return r.icon?t[r.iconName]=r.icon:t[n]=r,t},{})}function Ap(e,t){var n=(arguments.length>2&&arguments[2]!==void 0?arguments[2]:{}).skipHooks,r=n!==void 0&&n,i=kp(t);typeof yp.hooks.addPack==`function`&&!r?yp.hooks.addPack(e,kp(t)):yp.styles[e]=J(J({},yp.styles[e]||{}),i),e===`fas`&&Ap(`fa`,t)}var jp=yp.styles,Mp=yp.shims,Np=Object.keys(zf),Pp=Np.reduce(function(e,t){return e[t]=Object.keys(zf[t]),e},{}),Fp=null,Ip={},Lp={},Rp={},zp={},Bp={};function Vp(e){return~Kf.indexOf(e)}function Hp(e,t){var n=t.split(`-`),r=n[0],i=n.slice(1).join(`-`);return r===e&&i!==``&&!Vp(i)?i:null}var Up=function(){var e=function(e){return Dp(jp,function(t,n,r){return t[r]=Dp(n,e,{}),t},{})};Ip=e(function(e,t,n){return t[3]&&(e[t[3]]=n),t[2]&&t[2].filter(function(e){return typeof e==`number`}).forEach(function(t){e[t.toString(16)]=n}),e}),Lp=e(function(e,t,n){return e[n]=n,t[2]&&t[2].filter(function(e){return typeof e==`string`}).forEach(function(t){e[t]=n}),e}),Bp=e(function(e,t,n){var r=t[2];return e[n]=n,r.forEach(function(t){e[t]=n}),e});var t=`far`in jp||Z.autoFetchSvg,n=Dp(Mp,function(e,n){var r=n[0],i=n[1],a=n[2];return i===`far`&&!t&&(i=`fas`),typeof r==`string`&&(e.names[r]={prefix:i,iconName:a}),typeof r==`number`&&(e.unicodes[r.toString(16)]={prefix:i,iconName:a}),e},{names:{},unicodes:{}});Rp=n.names,zp=n.unicodes,Fp=Qp(Z.styleDefault,{family:Z.familyDefault})};$f(function(e){Fp=Qp(e.styleDefault,{family:Z.familyDefault})}),Up();function Wp(e,t){return(Ip[e]||{})[t]}function Gp(e,t){return(Lp[e]||{})[t]}function Kp(e,t){return(Bp[e]||{})[t]}function qp(e){return Rp[e]||{prefix:null,iconName:null}}function Jp(e){var t=zp[e],n=Wp(`fas`,e);return t||(n?{prefix:`fas`,iconName:n}:null)||{prefix:null,iconName:null}}function Yp(){return Fp}var Xp=function(){return{prefix:null,iconName:null,rest:[]}};function Zp(e){var t=X,n=Np.reduce(function(e,t){return e[t]=`${Z.cssPrefix}-${t}`,e},{});return Jd.forEach(function(r){(e.includes(n[r])||e.some(function(e){return Pp[r].includes(e)}))&&(t=r)}),t}function Qp(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).family,n=t===void 0?X:t,r=Ff[n][e];if(n===td&&!e)return`fad`;var i=Lf[n][e]||Lf[n][r],a=e in yp.styles?e:null;return i||a||null}function $p(e){var t=[],n=null;return e.forEach(function(e){var r=Hp(Z.cssPrefix,e);r?n=r:e&&t.push(e)}),{iconName:n,rest:t}}function em(e){return e.sort().filter(function(e,t,n){return n.indexOf(e)===t})}var tm=pf.concat($d);function nm(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).skipLookups,n=t!==void 0&&t,r=null,i=em(e.filter(function(e){return tm.includes(e)})),a=em(e.filter(function(e){return!tm.includes(e)})),o=ju(i.filter(function(e){return r=e,!ed.includes(e)}),1)[0],s=o===void 0?null:o,c=Zp(i),l=J(J({},$p(a)),{},{prefix:Qp(s,{family:c})});return J(J(J({},l),om({values:e,family:c,styles:jp,config:Z,canonical:l,givenPrefix:r})),rm(n,r,l))}function rm(e,t,n){var r=n.prefix,i=n.iconName;if(e||!r||!i)return{prefix:r,iconName:i};var a=t===`fa`?qp(i):{},o=Kp(r,i);return i=a.iconName||o||i,r=a.prefix||r,r===`far`&&!jp.far&&jp.fas&&!Z.autoFetchSvg&&(r=`fas`),{prefix:r,iconName:i}}var im=Jd.filter(function(e){return e!==X||e!==td}),am=Object.keys(ff).filter(function(e){return e!==X}).map(function(e){return Object.keys(ff[e])}).flat();function om(e){var t=e.values,n=e.family,r=e.canonical,i=e.givenPrefix,a=i===void 0?``:i,o=e.styles,s=o===void 0?{}:o,c=e.config,l=c===void 0?{}:c,u=n===td,d=t.includes(`fa-duotone`)||t.includes(`fad`),f=l.familyDefault===`duotone`,p=r.prefix===`fad`||r.prefix===`fa-duotone`;return!u&&(d||f||p)&&(r.prefix=`fad`),(t.includes(`fa-brands`)||t.includes(`fab`))&&(r.prefix=`fab`),!r.prefix&&im.includes(n)&&(Object.keys(s).find(function(e){return am.includes(e)})||l.autoFetchSvg)&&(r.prefix=Zd.get(n).defaultShortPrefixId,r.iconName=Kp(r.prefix,r.iconName)||r.iconName),(r.prefix===`fa`||a===`fa`)&&(r.prefix=Yp()||`fas`),r}var sm=function(){function e(){Su(this,e),this.definitions={}}return wu(e,[{key:`add`,value:function(){var e=this,t=[...arguments].reduce(this._pullDefinitions,{});Object.keys(t).forEach(function(n){e.definitions[n]=J(J({},e.definitions[n]||{}),t[n]),Ap(n,t[n]);var r=zf[X][n];r&&Ap(r,t[n]),Up()})}},{key:`reset`,value:function(){this.definitions={}}},{key:`_pullDefinitions`,value:function(e,t){var n=t.prefix&&t.iconName&&t.icon?{0:t}:t;return Object.keys(n).map(function(t){var r=n[t],i=r.prefix,a=r.iconName,o=r.icon,s=o[2];e[i]||(e[i]={}),s.length>0&&s.forEach(function(t){typeof t==`string`&&(e[i][t]=o)}),e[i][a]=o}),e}}])}(),cm=[],lm={},um={},dm=Object.keys(um);function fm(e,t){var n=t.mixoutsTo;return cm=e,lm={},Object.keys(um).forEach(function(e){dm.indexOf(e)===-1&&delete um[e]}),cm.forEach(function(e){var t=e.mixout?e.mixout():{};if(Object.keys(t).forEach(function(e){typeof t[e]==`function`&&(n[e]=t[e]),Fu(t[e])===`object`&&Object.keys(t[e]).forEach(function(r){n[e]||(n[e]={}),n[e][r]=t[e][r]})}),e.hooks){var r=e.hooks();Object.keys(r).forEach(function(e){lm[e]||(lm[e]=[]),lm[e].push(r[e])})}e.provides&&e.provides(um)}),n}function pm(e,t){var n=[...arguments].slice(2);return(lm[e]||[]).forEach(function(e){t=e.apply(null,[t].concat(n))}),t}function mm(e){var t=[...arguments].slice(1);(lm[e]||[]).forEach(function(e){e.apply(null,t)})}function hm(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return um[e]?um[e].apply(null,t):void 0}function gm(e){e.prefix===`fa`&&(e.prefix=`fas`);var t=e.iconName,n=e.prefix||Yp();if(t)return t=Kp(n,t)||t,Tp(_m.definitions,n,t)||Tp(yp.styles,n,t)}var _m=new sm,vm={noAuto:function(){Z.autoReplaceSvg=!1,Z.observeMutations=!1,mm(`noAuto`)},config:Z,dom:{i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return qu?(mm(`beforeI2svg`,e),hm(`pseudoElements2svg`,e),hm(`i2svg`,e)):Promise.reject(Error(`Operation requires a DOM of some kind.`))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot;Z.autoReplaceSvg===!1&&(Z.autoReplaceSvg=!0),Z.observeMutations=!0,Cp(function(){ym({autoReplaceSvgRoot:t}),mm(`watch`,e)})}},parse:{icon:function(e){if(e===null)return null;if(Fu(e)===`object`&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:Kp(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var t=e[1].indexOf(`fa-`)===0?e[1].slice(3):e[1],n=Qp(e[0]);return{prefix:n,iconName:Kp(n,t)||t}}if(typeof e==`string`&&(e.indexOf(`${Z.cssPrefix}-`)>-1||e.match(Vf))){var r=nm(e.split(` `),{skipLookups:!0});return{prefix:r.prefix||Yp(),iconName:Kp(r.prefix,r.iconName)||r.iconName}}if(typeof e==`string`){var i=Yp();return{prefix:i,iconName:Kp(i,e)||e}}}},library:_m,findIconDefinition:gm,toHtml:wp},ym=function(){var e=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:{}).autoReplaceSvgRoot,t=e===void 0?Y:e;(Object.keys(yp.styles).length>0||Z.autoFetchSvg)&&qu&&Z.autoReplaceSvg&&vm.dom.i2svg({node:t})};function bm(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(e){return wp(e)})}}),Object.defineProperty(e,"node",{get:function(){if(qu){var t=Y.createElement(`div`);return t.innerHTML=e.html,t.children}}}),e}function xm(e){var t=e.children,n=e.main,r=e.mask,i=e.attributes,a=e.styles,o=e.transform;if(up(o)&&n.found&&!r.found){var s={x:n.width/n.height/2,y:.5};i.style=lp(J(J({},a),{},{"transform-origin":`${s.x+o.x/16}em ${s.y+o.y/16}em`}))}return[{tag:`svg`,attributes:i,children:t}]}function Sm(e){var t=e.prefix,n=e.iconName,r=e.children,i=e.attributes,a=e.symbol,o=a===!0?`${t}-${Z.cssPrefix}-${n}`:a;return[{tag:`svg`,attributes:{style:`display: none;`},children:[{tag:`symbol`,attributes:J(J({},i),{},{id:o}),children:r}]}]}function Cm(e){return[`aria-label`,`aria-labelledby`,`title`,`role`].some(function(t){return t in e})}function wm(e){var t=e.icons,n=t.main,r=t.mask,i=e.prefix,a=e.iconName,o=e.transform,s=e.symbol,c=e.maskId,l=e.extra,u=e.watchable,d=u!==void 0&&u,f=r.found?r:n,p=f.width,m=f.height,h=[Z.replacementClass,a?`${Z.cssPrefix}-${a}`:``].filter(function(e){return l.classes.indexOf(e)===-1}).filter(function(e){return e!==``||!!e}).concat(l.classes).join(` `),g={children:[],attributes:J(J({},l.attributes),{},{"data-prefix":i,"data-icon":a,class:h,role:l.attributes.role||`img`,viewBox:`0 0 ${p} ${m}`})};!Cm(l.attributes)&&!l.attributes[`aria-hidden`]&&(g.attributes[`aria-hidden`]=`true`),d&&(g.attributes[Cf]=``);var _=J(J({},g),{},{prefix:i,iconName:a,main:n,mask:r,maskId:c,transform:o,symbol:s,styles:J({},l.styles)}),v=r.found&&n.found?hm(`generateAbstractMask`,_)||{children:[],attributes:{}}:hm(`generateAbstractIcon`,_)||{children:[],attributes:{}},y=v.children,b=v.attributes;return _.children=y,_.attributes=b,s?Sm(_):xm(_)}function Tm(e){var t=e.content,n=e.width,r=e.height,i=e.transform,a=e.extra,o=e.watchable,s=o!==void 0&&o,c=J(J({},a.attributes),{},{class:a.classes.join(` `)});s&&(c[Cf]=``);var l=J({},a.styles);up(i)&&(l.transform=fp({transform:i,startCentered:!0,width:n,height:r}),l[`-webkit-transform`]=l.transform);var u=lp(l);u.length>0&&(c.style=u);var d=[];return d.push({tag:`span`,attributes:c,children:[t]}),d}function Em(e){var t=e.content,n=e.extra,r=J(J({},n.attributes),{},{class:n.classes.join(` `)}),i=lp(n.styles);i.length>0&&(r.style=i);var a=[];return a.push({tag:`span`,attributes:r,children:[t]}),a}var Dm=yp.styles;function Om(e){var t=e[0],n=e[1],r=ju(e.slice(4),1)[0],i=null;return i=Array.isArray(r)?{tag:`g`,attributes:{class:`${Z.cssPrefix}-${Gf.GROUP}`},children:[{tag:`path`,attributes:{class:`${Z.cssPrefix}-${Gf.SECONDARY}`,fill:`currentColor`,d:r[0]}},{tag:`path`,attributes:{class:`${Z.cssPrefix}-${Gf.PRIMARY}`,fill:`currentColor`,d:r[1]}}]}:{tag:`path`,attributes:{fill:`currentColor`,d:r}},{found:!0,width:t,height:n,icon:i}}var km={found:!1,width:512,height:512};function Am(e,t){!Mf&&!Z.showMissingIcons&&e&&console.error(`Icon with name "${e}" and prefix "${t}" is missing.`)}function jm(e,t){var n=t;return t===`fa`&&Z.styleDefault!==null&&(t=Yp()),new Promise(function(r,i){if(n===`fa`){var a=qp(e)||{};e=a.iconName||e,t=a.prefix||t}if(e&&t&&Dm[t]&&Dm[t][e]){var o=Dm[t][e];return r(Om(o))}Am(e,t),r(J(J({},km),{},{icon:Z.showMissingIcons&&e&&hm(`missingIconAbstract`)||{}}))})}var Mm=function(){},Nm=Z.measurePerformance&&Ku&&Ku.mark&&Ku.measure?Ku:{mark:Mm,measure:Mm},Pm=`FA "7.3.1"`,Fm=function(e){return Nm.mark(`${Pm} ${e} begins`),function(){return Im(e)}},Im=function(e){Nm.mark(`${Pm} ${e} ends`),Nm.measure(`${Pm} ${e}`,`${Pm} ${e} begins`,`${Pm} ${e} ends`)},Lm={begin:Fm,end:Im},Rm=function(){};function zm(e){return typeof(e.getAttribute?e.getAttribute(Cf):null)==`string`}function Bm(e){var t=e.getAttribute?e.getAttribute(Ef):null,n=e.getAttribute?e.getAttribute(Df):null;return t&&n}function Vm(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(Z.replacementClass)}function Hm(){return Z.autoReplaceSvg===!0?qm.replace:qm[Z.autoReplaceSvg]||qm.replace}function Um(e){return Y.createElementNS(`http://www.w3.org/2000/svg`,e)}function Wm(e){return Y.createElement(e)}function Gm(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).ceFn,n=t===void 0?e.tag===`svg`?Um:Wm:t;if(typeof e==`string`)return Y.createTextNode(e);var r=n(e.tag);return Object.keys(e.attributes||[]).forEach(function(t){r.setAttribute(t,e.attributes[t])}),(e.children||[]).forEach(function(e){r.appendChild(Gm(e,{ceFn:n}))}),r}function Km(e){var t=` ${e.outerHTML} `;return t=`${t}Font Awesome fontawesome.com `,t}var qm={replace:function(e){var t=e[0];if(t.parentNode){if(e[1].forEach(function(e){t.parentNode.insertBefore(Gm(e),t)}),t.getAttribute(Cf)===null&&Z.keepOriginalSource){var n=Y.createComment(Km(t));t.parentNode.replaceChild(n,t)}else t.remove()}},nest:function(e){var t=e[0],n=e[1];if(~op(t).indexOf(Z.replacementClass))return qm.replace(e);var r=RegExp(`${Z.cssPrefix}-.*`);if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(` `).reduce(function(e,t){return t===Z.replacementClass||t.match(r)?e.toSvg.push(t):e.toNode.push(t),e},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(` `),i.toNode.length===0?t.removeAttribute(`class`):t.setAttribute(`class`,i.toNode.join(` `))}var a=n.map(function(e){return wp(e)}).join(`
`);t.setAttribute(Cf,``),t.innerHTML=a}};function Jm(e){e()}function Ym(e,t){var n=typeof t==`function`?t:Rm;if(e.length===0)n();else{var r=Jm;Z.mutateApproach===kf&&(r=Wu.requestAnimationFrame||Jm),r(function(){var t=Hm(),r=Lm.begin(`mutate`);e.map(t),r(),n()})}}var Xm=!1;function Zm(){Xm=!0}function Qm(){Xm=!1}var $m=null;function eh(e){if(Gu&&Z.observeMutations){var t=e.treeCallback,n=t===void 0?Rm:t,r=e.nodeCallback,i=r===void 0?Rm:r,a=e.pseudoElementsCallback,o=a===void 0?Rm:a,s=e.observeMutationsRoot,c=s===void 0?Y:s;$m=new Gu(function(e){if(!Xm){var t=Yp();ap(e).forEach(function(e){if(e.type===`childList`&&e.addedNodes.length>0&&!zm(e.addedNodes[0])&&(Z.searchPseudoElements&&o(e.target),n(e.target)),e.type===`attributes`&&e.target.parentNode&&Z.searchPseudoElements&&o([e.target],!0),e.type===`attributes`&&zm(e.target)&&~Wf.indexOf(e.attributeName)){if(e.attributeName===`class`&&Bm(e.target)){var r=nm(op(e.target)),a=r.prefix,s=r.iconName;e.target.setAttribute(Ef,a||t),s&&e.target.setAttribute(Df,s)}else Vm(e.target)&&i(e.target)}})}}),qu&&$m.observe(c,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function th(){$m&&$m.disconnect()}function nh(e){var t=e.getAttribute(`style`),n=[];return t&&(n=t.split(`;`).reduce(function(e,t){var n=t.split(`:`),r=n[0],i=n.slice(1);return r&&i.length>0&&(e[r]=i.join(`:`).trim()),e},{})),n}function rh(e){var t=e.getAttribute(`data-prefix`),n=e.getAttribute(`data-icon`),r=e.innerText===void 0?``:e.innerText.trim(),i=nm(op(e));return i.prefix||=Yp(),t&&n&&(i.prefix=t,i.iconName=n),i.iconName&&i.prefix?i:(i.prefix&&r.length>0&&(i.iconName=Gp(i.prefix,e.innerText)||Wp(i.prefix,Op(e.innerText))),!i.iconName&&Z.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(i.iconName=e.firstChild.data),i)}function ih(e){return ap(e.attributes).reduce(function(e,t){return e.name!==`class`&&e.name!==`style`&&(e[t.name]=t.value),e},{})}function ah(){return{iconName:null,prefix:null,transform:tp,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function oh(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},n=rh(e),r=n.iconName,i=n.prefix,a=n.rest,o=ih(e),s=pm(`parseNodeAttributes`,{},e);return J({iconName:r,prefix:i,transform:tp,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:t.styleParser?nh(e):[],attributes:o}},s)}var sh=yp.styles;function ch(e){var t=Z.autoReplaceSvg===`nest`?oh(e,{styleParser:!1}):oh(e);return~t.extra.classes.indexOf(Hf)?hm(`generateLayersText`,e,t):hm(`generateSvgReplacementMutation`,e,t)}function lh(){return[].concat(Mu($d),Mu(pf))}function uh(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!qu)return Promise.resolve();var n=Y.documentElement.classList,r=function(e){return n.add(`${Of}-${e}`)},i=function(e){return n.remove(`${Of}-${e}`)},a=Z.autoFetchSvg?lh():ed.concat(Object.keys(sh));a.includes(`fa`)||a.push(`fa`);var o=[`.${Hf}:not([${Cf}])`].concat(a.map(function(e){return`.${e}:not([${Cf}])`})).join(`, `);if(o.length===0)return Promise.resolve();var s=[];try{s=ap(e.querySelectorAll(o))}catch{}if(s.length>0)r(`pending`),i(`complete`);else return Promise.resolve();var c=Lm.begin(`onTree`),l=s.reduce(function(e,t){try{var n=ch(t);n&&e.push(n)}catch(e){Mf||e.name===`MissingIcon`&&console.error(e)}return e},[]);return new Promise(function(e,n){Promise.all(l).then(function(n){Ym(n,function(){r(`active`),r(`complete`),i(`pending`),typeof t==`function`&&t(),c(),e()})}).catch(function(e){c(),n(e)})})}function dh(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;ch(e).then(function(e){e&&Ym([e],t)})}function fh(e){return function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:gm(t||{}),i=n.mask;return i&&=(i||{}).icon?i:gm(i||{}),e(r,J(J({},n),{},{mask:i}))}}var ph=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?tp:n,i=t.symbol,a=i!==void 0&&i,o=t.mask,s=o===void 0?null:o,c=t.maskId,l=c===void 0?null:c,u=t.classes,d=u===void 0?[]:u,f=t.attributes,p=f===void 0?{}:f,m=t.styles,h=m===void 0?{}:m;if(e){var g=e.prefix,_=e.iconName,v=e.icon;return bm(J({type:`icon`},e),function(){return mm(`beforeDOMElementCreation`,{iconDefinition:e,params:t}),wm({icons:{main:Om(v),mask:s?Om(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:_,transform:J(J({},tp),r),symbol:a,maskId:l,extra:{attributes:p,styles:h,classes:d}})})}},mh={mixout:function(){return{icon:fh(ph)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=uh,e.nodeCallback=dh,e}}},provides:function(e){e.i2svg=function(e){var t=e.node,n=t===void 0?Y:t,r=e.callback;return uh(n,r===void 0?function(){}:r)},e.generateSvgReplacementMutation=function(e,t){var n=t.iconName,r=t.prefix,i=t.transform,a=t.symbol,o=t.mask,s=t.maskId,c=t.extra;return new Promise(function(t,l){Promise.all([jm(n,r),o.iconName?jm(o.iconName,o.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(o){var l=ju(o,2),u=l[0],d=l[1];t([e,wm({icons:{main:u,mask:d},prefix:r,iconName:n,transform:i,symbol:a,maskId:s,extra:c,watchable:!0})])}).catch(l)})},e.generateAbstractIcon=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.transform,a=e.styles,o=lp(a);o.length>0&&(n.style=o);var s;return up(i)&&(s=hm(`generateAbstractTransformGrouping`,{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),t.push(s||r.icon),{children:t,attributes:n}}}},hh={mixout:function(){return{layer:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.classes,r=n===void 0?[]:n;return bm({type:`layer`},function(){mm(`beforeDOMElementCreation`,{assembler:e,params:t});var n=[];return e(function(e){Array.isArray(e)?e.map(function(e){n=n.concat(e.abstract)}):n=n.concat(e.abstract)}),[{tag:`span`,attributes:{class:[`${Z.cssPrefix}-layers`].concat(Mu(r)).join(` `)},children:n}]})}}}},gh={mixout:function(){return{counter:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.title,r=n===void 0?null:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return bm({type:`counter`,content:e},function(){return mm(`beforeDOMElementCreation`,{content:e,params:t}),Em({content:e.toString(),title:r,extra:{attributes:s,styles:l,classes:[`${Z.cssPrefix}-layers-counter`].concat(Mu(a))}})})}}}},_h={mixout:function(){return{text:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?tp:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return bm({type:`text`,content:e},function(){return mm(`beforeDOMElementCreation`,{content:e,params:t}),Tm({content:e,transform:J(J({},tp),r),extra:{attributes:s,styles:l,classes:[`${Z.cssPrefix}-layers-text`].concat(Mu(a))}})})}}},provides:function(e){e.generateLayersText=function(e,t){var n=t.transform,r=t.extra,i=null,a=null;if(Ju){var o=parseInt(getComputedStyle(e).fontSize,10),s=e.getBoundingClientRect();i=s.width/o,a=s.height/o}return Promise.resolve([e,Tm({content:e.innerHTML,width:i,height:a,transform:n,extra:r,watchable:!0})])}}},vh=RegExp(`"`,`ug`),yh=[1105920,1112319],bh=J(J(J(J({},{FontAwesome:{normal:`fas`,400:`fas`}}),Xd),vf),rf),xh=Object.keys(bh).reduce(function(e,t){return e[t.toLowerCase()]=bh[t],e},{}),Sh=Object.keys(xh).reduce(function(e,t){var n=xh[t];return e[t]=n[900]||Mu(Object.entries(n))[0][1],e},{});function Ch(e){return Op(Mu(e.replace(vh,``))[0]||``)}function wh(e){var t=e.getPropertyValue(`font-feature-settings`).includes(`ss01`),n=e.getPropertyValue(`content`).replace(vh,``),r=n.codePointAt(0),i=r>=yh[0]&&r<=yh[1],a=n.length===2&&n[0]===n[1];return i||a||t}function Th(e,t){var n=e.replace(/^['"]|['"]$/g,``).toLowerCase(),r=parseInt(t),i=isNaN(r)?`normal`:r;return(xh[n]||{})[i]||Sh[n]}function Eh(e,t){var n=`${Tf}${t.replace(`:`,`-`)}`;return new Promise(function(r,i){if(e.getAttribute(n)!==null)return r();var a=ap(e.children).filter(function(e){return e.getAttribute(wf)===t})[0],o=Wu.getComputedStyle(e,t),s=o.getPropertyValue(`font-family`),c=s.match(Uf),l=o.getPropertyValue(`font-weight`),u=o.getPropertyValue(`content`);if(a&&!c)return e.removeChild(a),r();if(c&&u!==`none`&&u!==``){var d=o.getPropertyValue(`content`),f=Th(s,l),p=Ch(d),m=c[0].startsWith(`FontAwesome`),h=wh(o),g=Wp(f,p),_=g;if(m){var v=Jp(p);v.iconName&&v.prefix&&(g=v.iconName,f=v.prefix)}if(g&&!h&&(!a||a.getAttribute(Ef)!==f||a.getAttribute(Df)!==_)){e.setAttribute(n,_),a&&e.removeChild(a);var y=ah(),b=y.extra;b.attributes[wf]=t,jm(g,f).then(function(i){var a=wm(J(J({},y),{},{icons:{main:i,mask:Xp()},prefix:f,iconName:_,extra:b,watchable:!0})),o=Y.createElementNS(`http://www.w3.org/2000/svg`,`svg`);t===`::before`?e.insertBefore(o,e.firstChild):e.appendChild(o),o.outerHTML=a.map(function(e){return wp(e)}).join(`
`),e.removeAttribute(n),r()}).catch(i)}else r()}else r()})}function Dh(e){return Promise.all([Eh(e,`::before`),Eh(e,`::after`)])}function Oh(e){return e.parentNode!==document.head&&!~Af.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(wf)&&(!e.parentNode||e.parentNode.tagName!==`svg`)}var kh=function(e){return!!e&&jf.some(function(t){return e.includes(t)})},Ah=function(e){if(!e)return[];var t=new Set,n=e.split(/,(?![^()]*\))/).map(function(e){return e.trim()});n=n.flatMap(function(e){return e.includes(`(`)?e:e.split(`,`).map(function(e){return e.trim()})});var r=Tu(n),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;if(kh(a)){var o=jf.reduce(function(e,t){return e.replace(t,``)},a);o!==``&&o!==`*`&&t.add(o)}}}catch(e){r.e(e)}finally{r.f()}return t};function jh(e){var t=arguments.length>1&&arguments[1]!==void 0&&arguments[1];if(qu){var n;if(t)n=e;else if(Z.searchPseudoElementsFullScan)n=e.querySelectorAll(`*`);else{var r=new Set,i=Tu(document.styleSheets),a;try{for(i.s();!(a=i.n()).done;){var o=a.value;try{var s=Tu(o.cssRules),c;try{for(s.s();!(c=s.n()).done;){var l=c.value,u=Tu(Ah(l.selectorText)),d;try{for(u.s();!(d=u.n()).done;){var f=d.value;r.add(f)}}catch(e){u.e(e)}finally{u.f()}}}catch(e){s.e(e)}finally{s.f()}}catch(e){Z.searchPseudoElementsWarnings&&console.warn(`Font Awesome: cannot parse stylesheet: ${o.href} (${e.message})
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`)}}}catch(e){i.e(e)}finally{i.f()}if(!r.size)return;var p=Array.from(r).join(`, `);try{n=e.querySelectorAll(p)}catch{}}return new Promise(function(e,t){var r=ap(n).filter(Oh).map(Dh),i=Lm.begin(`searchPseudoElements`);Zm(),Promise.all(r).then(function(){i(),Qm(),e()}).catch(function(){i(),Qm(),t()})})}}var Mh={hooks:function(){return{mutationObserverCallbacks:function(e){return e.pseudoElementsCallback=jh,e}}},provides:function(e){e.pseudoElements2svg=function(e){var t=e.node,n=t===void 0?Y:t;Z.searchPseudoElements&&jh(n)}}},Nh=!1,Ph={mixout:function(){return{dom:{unwatch:function(){Zm(),Nh=!0}}}},hooks:function(){return{bootstrap:function(){eh(pm(`mutationObserverCallbacks`,{}))},noAuto:function(){th()},watch:function(e){var t=e.observeMutationsRoot;Nh?Qm():eh(pm(`mutationObserverCallbacks`,{observeMutationsRoot:t}))}}}},Fh=function(e){return e.toLowerCase().split(` `).reduce(function(e,t){var n=t.toLowerCase().split(`-`),r=n[0],i=n.slice(1).join(`-`);if(r&&i===`h`)return e.flipX=!0,e;if(r&&i===`v`)return e.flipY=!0,e;if(i=parseFloat(i),isNaN(i))return e;switch(r){case`grow`:e.size+=i;break;case`shrink`:e.size-=i;break;case`left`:e.x-=i;break;case`right`:e.x+=i;break;case`up`:e.y-=i;break;case`down`:e.y+=i;break;case`rotate`:e.rotate+=i}return e},{size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0})},Ih={mixout:function(){return{parse:{transform:function(e){return Fh(e)}}}},hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-transform`);return n&&(e.transform=Fh(n)),e}}},provides:function(e){e.generateAbstractTransformGrouping=function(e){var t=e.main,n=e.transform,r=e.containerWidth,i=e.iconWidth,a={outer:{transform:`translate(${r/2} 256)`},inner:{transform:`${`translate(${n.x*32}, ${n.y*32}) `} ${`scale(${n.size/16*(n.flipX?-1:1)}, ${n.size/16*(n.flipY?-1:1)}) `} ${`rotate(${n.rotate} 0 0)`}`},path:{transform:`translate(${i/2*-1} -256)`}};return{tag:`g`,attributes:J({},a.outer),children:[{tag:`g`,attributes:J({},a.inner),children:[{tag:t.icon.tag,children:t.icon.children,attributes:J(J({},t.icon.attributes),a.path)}]}]}}}},Lh={x:0,y:0,width:`100%`,height:`100%`};function Rh(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill=`black`),e}function zh(e){return e.tag===`g`?e.children:[e]}fm([_p,mh,hh,gh,_h,Mh,Ph,Ih,{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-mask`),r=n?nm(n.split(` `).map(function(e){return e.trim()})):Xp();return r.prefix||=Yp(),e.mask=r,e.maskId=t.getAttribute(`data-fa-mask-id`),e}}},provides:function(e){e.generateAbstractMask=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.mask,a=e.maskId,o=e.transform,s=r.width,c=r.icon,l=i.width,u=i.icon,d=dp({transform:o,containerWidth:l,iconWidth:s}),f={tag:`rect`,attributes:J(J({},Lh),{},{fill:`white`})},p=c.children?{children:c.children.map(Rh)}:{},m={tag:`g`,attributes:J({},d.inner),children:[Rh(J({tag:c.tag,attributes:J(J({},c.attributes),d.path)},p))]},h={tag:`g`,attributes:J({},d.outer),children:[m]},g=`mask-${a||ip()}`,_=`clip-${a||ip()}`,v={tag:`mask`,attributes:J(J({},Lh),{},{id:g,maskUnits:`userSpaceOnUse`,maskContentUnits:`userSpaceOnUse`}),children:[f,h]},y={tag:`defs`,children:[{tag:`clipPath`,attributes:{id:_},children:zh(u)},v]};return t.push(y,{tag:`rect`,attributes:J({fill:`currentColor`,"clip-path":`url(#${_})`,mask:`url(#${g})`},Lh)}),{children:t,attributes:n}}}},{provides:function(e){var t=!1;Wu.matchMedia&&(t=Wu.matchMedia(`(prefers-reduced-motion: reduce)`).matches),e.missingIconAbstract=function(){var e=[],n={fill:`currentColor`},r={attributeType:`XML`,repeatCount:`indefinite`,dur:`2s`};e.push({tag:`path`,attributes:J(J({},n),{},{d:`M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z`})});var i=J(J({},r),{},{attributeName:`opacity`}),a={tag:`circle`,attributes:J(J({},n),{},{cx:`256`,cy:`364`,r:`28`}),children:[]};return t||a.children.push({tag:`animate`,attributes:J(J({},r),{},{attributeName:`r`,values:`28;14;28;28;14;28;`})},{tag:`animate`,attributes:J(J({},i),{},{values:`1;0;1;1;0;1;`})}),e.push(a),e.push({tag:`path`,attributes:J(J({},n),{},{opacity:`1`,d:`M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z`}),children:t?[]:[{tag:`animate`,attributes:J(J({},i),{},{values:`1;0;0;0;0;1;`})}]}),t||e.push({tag:`path`,attributes:J(J({},n),{},{opacity:`0`,d:`M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z`}),children:[{tag:`animate`,attributes:J(J({},i),{},{values:`0;0;1;1;0;0;`})}]}),{tag:`g`,attributes:{class:`missing`},children:e}}}},{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-symbol`);return e.symbol=n===null?!1:n===``||n,e}}}}],{mixoutsTo:vm}),vm.noAuto,vm.config,vm.library,vm.dom;var Bh=vm.parse;vm.findIconDefinition,vm.toHtml;var Vh=vm.icon;vm.layer,vm.text,vm.counter;function Hh(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function Uh(e){if(Array.isArray(e))return Hh(e)}function Q(e,t,n){return(t=Zh(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Wh(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function Gh(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Kh(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function $(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Kh(Object(n),!0).forEach(function(t){Q(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Kh(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function qh(e,t){if(e==null)return{};var n,r,i=Jh(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function Jh(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function Yh(e){return Uh(e)||Wh(e)||$h(e)||Gh()}function Xh(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Zh(e){var t=Xh(e,`string`);return typeof t==`symbol`?t:t+``}function Qh(e){"@babel/helpers - typeof";return Qh=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Qh(e)}function $h(e,t){if(e){if(typeof e==`string`)return Hh(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Hh(e,t):void 0}}function eg(e,t){return Array.isArray(t)&&t.length>0||!Array.isArray(t)&&t?Q({},e,t):{}}function tg(e){var t,n=(t={"fa-spin":e.spin,"fa-pulse":e.pulse,"fa-fw":e.fixedWidth,"fa-border":e.border,"fa-li":e.listItem,"fa-inverse":e.inverse,"fa-flip":e.flip===!0,"fa-flip-horizontal":e.flip===`horizontal`||e.flip===`both`,"fa-flip-vertical":e.flip===`vertical`||e.flip===`both`},Q(Q(Q(Q(Q(Q(Q(Q(Q(Q(t,`fa-${e.size}`,e.size!==null),`fa-rotate-${e.rotation}`,e.rotation!==null),`fa-rotate-by`,e.rotateBy),`fa-pull-${e.pull}`,e.pull!==null),`fa-swap-opacity`,e.swapOpacity),`fa-bounce`,e.bounce),`fa-shake`,e.shake),`fa-beat`,e.beat),`fa-fade`,e.fade),`fa-beat-fade`,e.beatFade),Q(Q(Q(Q(Q(Q(Q(Q(Q(Q(t,`fa-flash`,e.flash),`fa-spin-pulse`,e.spinPulse),`fa-spin-reverse`,e.spinReverse),`fa-width-auto`,e.widthAuto),`fa-canvas-square`,e.canvasSquare),`fa-canvas-roomy`,e.canvasRoomy),`fa-flip-360`,e.flip360),`fa-buzz`,e.buzz),`fa-float`,e.float),`fa-jello`,e.jello),Q(Q(Q(Q(Q(t,`fa-spin-snap`,e.spinSnap),`fa-spin-snap-4`,e.spinSnap4),`fa-spin-snap-8`,e.spinSnap8),`fa-swing`,e.swing),`fa-wag`,e.wag));return Object.keys(n).map(function(e){return n[e]?e:null}).filter(function(e){return e})}var ng=typeof globalThis<`u`?globalThis:typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:{},rg={exports:{}};(function(e){(function(t){var n=function(e,t,r){if(!l(t)||d(t)||f(t)||p(t)||c(t))return t;var i,a=0,o=0;if(u(t))for(i=[],o=t.length;a<o;a++)i.push(n(e,t[a],r));else for(var s in i={},t)Object.prototype.hasOwnProperty.call(t,s)&&(i[e(s,r)]=n(e,t[s],r));return i},r=function(e,t){t||={};var n=t.separator||`_`,r=t.split||/(?=[A-Z])/;return e.split(r).join(n)},i=function(e){return m(e)?e:(e=e.replace(/[\-_\s]+(.)?/g,function(e,t){return t?t.toUpperCase():``}),e.substr(0,1).toLowerCase()+e.substr(1))},a=function(e){var t=i(e);return t.substr(0,1).toUpperCase()+t.substr(1)},o=function(e,t){return r(e,t).toLowerCase()},s=Object.prototype.toString,c=function(e){return typeof e==`function`},l=function(e){return e===Object(e)},u=function(e){return s.call(e)==`[object Array]`},d=function(e){return s.call(e)==`[object Date]`},f=function(e){return s.call(e)==`[object RegExp]`},p=function(e){return s.call(e)==`[object Boolean]`},m=function(e){return e-=0,e===e},h=function(e,t){var n=t&&`process`in t?t.process:t;return typeof n==`function`?function(t,r){return n(t,e,r)}:e},g={camelize:i,decamelize:o,pascalize:a,depascalize:o,camelizeKeys:function(e,t){return n(h(i,t),e)},decamelizeKeys:function(e,t){return n(h(o,t),e,t)},pascalizeKeys:function(e,t){return n(h(a,t),e)},depascalizeKeys:function(){return this.decamelizeKeys.apply(this,arguments)}};e.exports?e.exports=g:t.humps=g})(ng)})(rg);var ig=rg.exports,ag=[`gradientFill`],og=[`class`,`style`],sg=[`type`,`stops`,`id`];function cg(e){return e.split(`;`).map(function(e){return e.trim()}).filter(function(e){return e}).reduce(function(e,t){var n=t.indexOf(`:`),r=ig.camelize(t.slice(0,n));return e[r]=t.slice(n+1).trim(),e},{})}function lg(e){return e.split(/\s+/).reduce(function(e,t){return e[t]=!0,e},{})}function ug(e,t){return Ca(`stop`,$({key:`${t}-${e.offset}`,offset:e.offset,"stop-color":e.color},e.opacity!==void 0&&{"stop-opacity":e.opacity}))}function dg(e){if(typeof e==`string`)return e;var t=(e.children||[]).map(dg);return e.tag===`path`&&e.attributes&&`fill`in e.attributes?$($({},e),{},{attributes:$($({},e.attributes),{},{fill:void 0}),children:t}):$($({},e),{},{children:t})}function fg(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof e==`string`)return e;var r=t.gradientFill,i=r===void 0?null:r,a=qh(t,ag),o=i||`fill`in n?dg(e):e,s=(o.children||[]).map(function(e){return fg(e,{},{})}),c=Object.keys(o.attributes||{}).reduce(function(e,t){var n=o.attributes[t];switch(t){case`class`:e.class=lg(n);break;case`style`:e.style=cg(n);break;default:e.attrs[t]=n}return e},{attrs:{},class:{},style:{}});n.class;var l=n.style,u=l===void 0?{}:l,d=qh(n,og);if(i&&i.id&&(i.type===`linear`||i.type===`radial`)){var f=i.type,p=i.stops,m=p===void 0?[]:p,h=i.id,g=qh(i,sg),_=Ca(f===`linear`?`linearGradient`:`radialGradient`,$($({},g),{},{id:h}),m.map(ug));return Ca(o.tag,$($($($({},a),{},{class:c.class,style:$($({},c.style),u)},c.attrs),d),{},{fill:`url(#${h})`}),[_].concat(Yh(s)))}return Ca(e.tag,$($($({},a),{},{class:c.class,style:$($({},c.style),u)},c.attrs),d),s)}var pg=!1;try{pg=!0}catch{}function mg(){if(!pg&&console&&typeof console.error==`function`){var e;(e=console).error.apply(e,arguments)}}function hg(e){if(e&&Qh(e)===`object`&&e.prefix&&e.iconName&&e.icon)return e;if(Bh.icon)return Bh.icon(e);if(e===null)return null;if(Qh(e)===`object`&&e.prefix&&e.iconName)return e;if(Array.isArray(e)&&e.length===2)return{prefix:e[0],iconName:e[1]};if(typeof e==`string`)return{prefix:`fas`,iconName:e}}var gg=Kn({name:`FontAwesomeIcon`,props:{border:{type:Boolean,default:!1},fixedWidth:{type:Boolean,default:!1},flip:{type:[Boolean,String],default:!1,validator:function(e){return[!0,!1,`horizontal`,`vertical`,`both`].indexOf(e)>-1}},icon:{type:[Object,Array,String],required:!0},mask:{type:[Object,Array,String],default:null},maskId:{type:String,default:null},listItem:{type:Boolean,default:!1},pull:{type:String,default:null,validator:function(e){return[`right`,`left`].indexOf(e)>-1}},pulse:{type:Boolean,default:!1},rotation:{type:[String,Number],default:null,validator:function(e){return[90,180,270].indexOf(Number.parseInt(e,10))>-1}},rotateBy:{type:Boolean,default:!1},swapOpacity:{type:Boolean,default:!1},size:{type:String,default:null,validator:function(e){return[`2xs`,`xs`,`sm`,`lg`,`xl`,`2xl`,`1x`,`2x`,`3x`,`4x`,`5x`,`6x`,`7x`,`8x`,`9x`,`10x`].indexOf(e)>-1}},spin:{type:Boolean,default:!1},transform:{type:[String,Object],default:null},symbol:{type:[Boolean,String],default:!1},title:{type:String,default:null},titleId:{type:String,default:null},inverse:{type:Boolean,default:!1},bounce:{type:Boolean,default:!1},shake:{type:Boolean,default:!1},beat:{type:Boolean,default:!1},fade:{type:Boolean,default:!1},beatFade:{type:Boolean,default:!1},flash:{type:Boolean,default:!1},spinPulse:{type:Boolean,default:!1},spinReverse:{type:Boolean,default:!1},widthAuto:{type:Boolean,default:!1},canvasSquare:{type:Boolean,default:!1},canvasRoomy:{type:Boolean,default:!1},gradientFill:{type:Object,default:null,validator:function(e){return typeof e.id!=`string`||!e.id?(console.warn(`FontAwesomeIcon: gradientFill.id must be a non-empty string`),!1):e.type!==`linear`&&e.type!==`radial`?(console.warn(`FontAwesomeIcon: gradientFill.type must be "linear" or "radial"`),!1):!0}},flip360:{type:Boolean,default:!1},buzz:{type:Boolean,default:!1},float:{type:Boolean,default:!1},jello:{type:Boolean,default:!1},spinSnap:{type:Boolean,default:!1},spinSnap4:{type:Boolean,default:!1},spinSnap8:{type:Boolean,default:!1},swing:{type:Boolean,default:!1},wag:{type:Boolean,default:!1}},setup:function(e,t){var n=t.attrs,r=G(function(){return hg(e.icon)}),i=G(function(){return eg(`classes`,tg(e))}),a=G(function(){return eg(`transform`,typeof e.transform==`string`?Bh.transform(e.transform):e.transform)}),o=G(function(){return eg(`mask`,hg(e.mask))}),s=G(function(){var t=$($($($({},i.value),a.value),o.value),{},{symbol:e.symbol,maskId:e.maskId});return t.title=e.title,t.titleId=e.titleId,Vh(r.value,t)});In(s,function(e){if(!e)return mg(`Could not find one or more icon(s)`,r.value,o.value)},{immediate:!0}),e.gradientFill&&e.symbol&&mg(`gradientFill is not supported when symbol is true and will be ignored`);var c=G(function(){return s.value?fg(s.value.abstract[0],{gradientFill:e.symbol?null:e.gradientFill},n):null});return function(){return c.value}}}),_g={prefix:`fas`,iconName:`eye`,icon:[576,512,[128065],`f06e`,`M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z`]},vg={prefix:`fas`,iconName:`paw`,icon:[512,512,[],`f1b0`,`M234.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5 .3-86.2 32.6-96.8 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3-14.3-70.1 10.2-84.1 59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5l0 1.6c0 25.8-20.9 46.7-46.7 46.7-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2-25.8 0-46.7-20.9-46.7-46.7l0-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3 29.1 51.7 10.2 84.1-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5 46.9 53.9 32.6 96.8-52.1 69.1-84.4 58.5z`]},yg={prefix:`fas`,iconName:`eye-slash`,icon:[576,512,[],`f070`,`M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM204.5 138.7c23.5-16.8 52.4-26.7 83.5-26.7 79.5 0 144 64.5 144 144 0 31.1-9.9 59.9-26.7 83.5l-34.7-34.7c12.7-21.4 17-47.7 10.1-73.7-13.7-51.2-66.4-81.6-117.6-67.9-8.6 2.3-16.7 5.7-24 10l-34.7-34.7zM325.3 395.1c-11.9 3.2-24.4 4.9-37.3 4.9-79.5 0-144-64.5-144-144 0-12.9 1.7-25.4 4.9-37.3L69.4 139.2c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6l-64.2-64.2z`]},bg={class:`login-page`},xg={class:`login-story`,"aria-label":`Bienvenida a Mi registro`},Sg={class:`login-brand`},Cg={class:`login-brand__mark`},wg={class:`cats-portrait`},Tg=[`src`],Eg={class:`cat-intros`},Dg=[`src`],Og={class:`login-access`},kg={class:`login-card`},Ag={class:`welcome-pill`},jg={class:`login-input`},Mg=[`src`],Ng={class:`password-row`},Pg={class:`login-input`},Fg=[`src`],Ig=[`type`],Lg=[`aria-label`],Rg={key:0,class:`login-error`,role:`alert`},zg=[`disabled`],Bg={class:`login-divider`},Vg=[`src`],Hg=Tl({__name:`LoginView`,setup(e){let t=Zo(),n=`/registro_gatos/`,r=N(``),i=N(``),a=N(!1),o=N(!1),s=N(``),c=[{name:`Dorito`,message:`Hoy puede ser un buen día.`,image:`${n}cats/dorito-contento.png`,tone:`dorito`},{name:`Felicia`,message:`Con que empieces alcanza.`,image:`${n}cats/felicia-cansada.png`,tone:`felicia`},{name:`Felipa`,message:`Entrená y dejame dormir.`,image:`${n}cats/felipa-molesta.png`,tone:`felipa`}];async function l(){if(s.value=``,!r.value||!i.value){s.value=`Completá tu email y contraseña para continuar.`;return}o.value=!0;try{await qc.login(r.value,i.value),await t.push(`/`)}catch(e){s.value=e.message}finally{o.value=!1}}return(e,t)=>(z(),B(`div`,bg,[V(`section`,xg,[H(P(gg),{class:`decorative-paw paw-one`,icon:P(vg),"aria-hidden":`true`},null,8,[`icon`]),H(P(gg),{class:`decorative-paw paw-two`,icon:P(vg),"aria-hidden":`true`},null,8,[`icon`]),H(P(gg),{class:`decorative-paw paw-three`,icon:P(vg),"aria-hidden":`true`},null,8,[`icon`]),V(`header`,Sg,[V(`span`,Cg,[H(P(gg),{icon:P(vg)},null,8,[`icon`])]),t[5]||=V(`div`,null,[V(`strong`,null,[U(`Miau `),V(`em`,null,`registro`)]),V(`small`,null,`Comé bien. Entrená. Sentite mejor.`)],-1)]),V(`div`,wg,[V(`img`,{src:P(n)+`auth/cats-login-hero-v2.png`,alt:`Dorito, Felicia y Felipa juntos`},null,8,Tg)]),t[6]||=V(`blockquote`,null,`“Un día a la vez.”`,-1),t[7]||=V(`span`,{class:`story-heart`,"aria-hidden":`true`},`♡`,-1),V(`div`,Eg,[(z(),B(R,null,xr(c,e=>V(`article`,{key:e.name,class:E(e.tone)},[V(`img`,{src:e.image,alt:``},null,8,Dg),V(`div`,null,[V(`strong`,null,D(e.name),1),V(`p`,null,D(e.message),1)])],2)),64))])]),V(`section`,Og,[V(`div`,kg,[V(`div`,Ag,[H(P(gg),{icon:P(vg)},null,8,[`icon`]),t[8]||=U(` Bienvenido `,-1),t[9]||=V(`span`,{"aria-hidden":`true`},null,-1)]),t[15]||=V(`h1`,null,`Bienvenido de vuelta`,-1),t[16]||=V(`p`,{class:`login-subtitle`},`Ingresá para continuar con tu registro.`,-1),V(`form`,{novalidate:``,onSubmit:Ao(l,[`prevent`])},[t[11]||=V(`label`,{for:`login-email`},`Email`,-1),V(`div`,jg,[V(`img`,{class:`login-input__cat-icon`,src:P(n)+`icons/login-email-cat.svg`,alt:``,"aria-hidden":`true`},null,8,Mg),An(V(`input`,{id:`login-email`,"onUpdate:modelValue":t[0]||=e=>r.value=e,type:`email`,autocomplete:`email`,placeholder:`nombre@email.com`},null,512),[[_o,r.value,void 0,{trim:!0}]])]),V(`div`,Ng,[t[10]||=V(`label`,{for:`login-password`},`Contraseña`,-1),V(`button`,{type:`button`,onClick:t[1]||=e=>s.value=`La recuperación de contraseña estará disponible próximamente.`},`¿La olvidaste?`)]),V(`div`,Pg,[V(`img`,{class:`login-input__cat-icon`,src:P(n)+`icons/login-password-cat.svg`,alt:``,"aria-hidden":`true`},null,8,Fg),An(V(`input`,{id:`login-password`,"onUpdate:modelValue":t[2]||=e=>i.value=e,type:a.value?`text`:`password`,autocomplete:`current-password`,placeholder:`••••••••`},null,8,Ig),[[To,i.value]]),V(`button`,{class:`toggle-password`,type:`button`,"aria-label":a.value?`Ocultar contraseña`:`Mostrar contraseña`,onClick:t[3]||=e=>a.value=!a.value},[H(P(gg),{icon:a.value?P(yg):P(_g)},null,8,[`icon`])],8,Lg)]),s.value?(z(),B(`p`,Rg,D(s.value),1)):Xi(``,!0),V(`button`,{class:`login-submit`,type:`submit`,disabled:o.value},[H(P(gg),{icon:P(vg)},null,8,[`icon`]),V(`span`,null,D(o.value?`Ingresando…`:`Iniciar sesión`),1)],8,zg)],32),V(`div`,Bg,[t[12]||=V(`span`,null,null,-1),H(P(gg),{icon:P(vg)},null,8,[`icon`]),t[13]||=V(`span`,null,null,-1)]),t[17]||=V(`p`,{class:`signup-prompt`},`¿Todavía no tenés cuenta?`,-1),V(`button`,{class:`signup-button`,type:`button`,onClick:t[4]||=e=>s.value=`El registro de usuarios estará disponible próximamente.`},[V(`img`,{src:P(n)+`icons/nuevo-registro.svg`,alt:``,"aria-hidden":`true`},null,8,Vg),t[14]||=U(` Crear cuenta `,-1)]),t[18]||=V(`p`,{class:`demo-access`},[U(`Demo: `),V(`strong`,null,`demo@registro.local`),U(` · `),V(`strong`,null,`DemoRegistro2026!`)],-1)])])]))}},[[`__scopeId`,`data-v-d4f6e263`]]),Ug=Fc({history:rc(`/registro_gatos/`),routes:[{path:`/login`,component:Hg,meta:{publicLayout:!0}},{path:`/`,component:Wl},{path:`/registrar/:type?`,component:su},{path:`/historial`,component:vu}]});Ug.beforeEach(async e=>{let t=await qc.restore();return e.path===`/login`?!t||`/`:t?!0:{path:`/login`,query:{redirect:e.fullPath}}}),Po($c).use(Ug).mount(`#app`);