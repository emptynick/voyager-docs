var __vite_style__=document.createElement("style");__vite_style__.innerHTML=".hljs{display:block;overflow-x:auto;padding:.5em;color:#333;background:#f8f8f8}.hljs-comment,.hljs-quote{color:#998;font-style:italic}.hljs-keyword,.hljs-selector-tag,.hljs-subst{color:#333;font-weight:700}.hljs-literal,.hljs-number,.hljs-tag .hljs-attr,.hljs-template-variable,.hljs-variable{color:teal}.hljs-doctag,.hljs-string{color:#d14}.hljs-section,.hljs-selector-id,.hljs-title{color:#900;font-weight:700}.hljs-subst{font-weight:400}.hljs-class .hljs-title,.hljs-type{color:#458;font-weight:700}.hljs-attribute,.hljs-name,.hljs-tag{color:navy;font-weight:400}.hljs-link,.hljs-regexp{color:#009926}.hljs-bullet,.hljs-symbol{color:#990073}.hljs-built_in,.hljs-builtin-name{color:#0086b3}.hljs-meta{color:#999;font-weight:700}.hljs-deletion{background:#fdd}.hljs-addition{background:#dfd}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}",document.head.appendChild(__vite_style__),function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(require("vue")):"function"==typeof define&&define.amd?define(["vue"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).Vue)}(this,(function(e){"use strict";function t(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach((function(n){var r=e[n];"object"!=typeof r||Object.isFrozen(r)||t(r)})),e}var n=t,r=t;n.default=r;class i{constructor(e){void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function a(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(e,...t){const n=Object.create(null);for(const r in e)n[r]=e[r];return t.forEach((function(e){for(const t in e)n[t]=e[t]})),n}const l=e=>!!e.kind;class o{constructor(e,t){this.buffer="",this.classPrefix=t.classPrefix,e.walk(this)}addText(e){this.buffer+=a(e)}openNode(e){if(!l(e))return;let t=e.kind;e.sublanguage||(t=`${this.classPrefix}${t}`),this.span(t)}closeNode(e){l(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){this.buffer+=`<span class="${e}">`}}class c{constructor(){this.rootNode={children:[]},this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){const t={kind:e,children:[]};this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){return"string"==typeof t?e.addText(t):t.children&&(e.openNode(t),t.children.forEach((t=>this._walk(e,t))),e.closeNode(t)),e}static _collapse(e){"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{c._collapse(e)})))}}class u extends c{constructor(e){super(),this.options=e}addKeyword(e,t){""!==e&&(this.openNode(t),this.addText(e),this.closeNode())}addText(e){""!==e&&this.add(e)}addSublanguage(e,t){const n=e.root;n.kind=t,n.sublanguage=!0,this.add(n)}toHTML(){return new o(this,this.options).value()}finalize(){return!0}}function g(e){return e?"string"==typeof e?e:e.source:null}const d=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;const h="[a-zA-Z]\\w*",f="[a-zA-Z_]\\w*",p="\\b\\d+(\\.\\d+)?",b="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",m="\\b(0b[01]+)",E={begin:"\\\\[\\s\\S]",relevance:0},_={className:"string",begin:"'",end:"'",illegal:"\\n",contains:[E]},v={className:"string",begin:'"',end:'"',illegal:"\\n",contains:[E]},x={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},y=function(e,t,n={}){const r=s({className:"comment",begin:e,end:t,contains:[]},n);return r.contains.push(x),r.contains.push({className:"doctag",begin:"(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",relevance:0}),r},w=y("//","$"),N=y("/\\*","\\*/"),R=y("#","$"),I={className:"number",begin:p,relevance:0},O={className:"number",begin:b,relevance:0},M={className:"number",begin:m,relevance:0},j={className:"number",begin:p+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},k={begin:/(?=\/[^/\n]*\/)/,contains:[{className:"regexp",begin:/\//,end:/\/[gimuy]*/,illegal:/\n/,contains:[E,{begin:/\[/,end:/\]/,relevance:0,contains:[E]}]}]},A={className:"title",begin:h,relevance:0},S={className:"title",begin:f,relevance:0},T={begin:"\\.\\s*[a-zA-Z_]\\w*",relevance:0};var L=Object.freeze({__proto__:null,MATCH_NOTHING_RE:/\b\B/,IDENT_RE:h,UNDERSCORE_IDENT_RE:f,NUMBER_RE:p,C_NUMBER_RE:b,BINARY_NUMBER_RE:m,RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",SHEBANG:(e={})=>{const t=/^#![ ]*\//;return e.binary&&(e.begin=function(...e){return e.map((e=>g(e))).join("")}(t,/.*\b/,e.binary,/\b.*/)),s({className:"meta",begin:t,end:/$/,relevance:0,"on:begin":(e,t)=>{0!==e.index&&t.ignoreMatch()}},e)},BACKSLASH_ESCAPE:E,APOS_STRING_MODE:_,QUOTE_STRING_MODE:v,PHRASAL_WORDS_MODE:x,COMMENT:y,C_LINE_COMMENT_MODE:w,C_BLOCK_COMMENT_MODE:N,HASH_COMMENT_MODE:R,NUMBER_MODE:I,C_NUMBER_MODE:O,BINARY_NUMBER_MODE:M,CSS_NUMBER_MODE:j,REGEXP_MODE:k,TITLE_MODE:A,UNDERSCORE_TITLE_MODE:S,METHOD_GUARD:T,END_SAME_AS_BEGIN:function(e){return Object.assign(e,{"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{t.data._beginMatch!==e[1]&&t.ignoreMatch()}})}});function C(e,t){"."===e.input[e.index-1]&&t.ignoreMatch()}function B(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=C,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,void 0===e.relevance&&(e.relevance=0))}function D(e,t){Array.isArray(e.illegal)&&(e.illegal=function(...e){return"("+e.map((e=>g(e))).join("|")+")"}(...e.illegal))}function P(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function $(e,t){void 0===e.relevance&&(e.relevance=1)}const H=["of","and","for","in","not","or","if","then","parent","list","value"];function U(e,t,n="keyword"){const r={};return"string"==typeof e?i(n,e.split(" ")):Array.isArray(e)?i(n,e):Object.keys(e).forEach((function(n){Object.assign(r,U(e[n],t,n))})),r;function i(e,n){t&&(n=n.map((e=>e.toLowerCase()))),n.forEach((function(t){const n=t.split("|");r[n[0]]=[e,z(n[0],n[1])]}))}}function z(e,t){return t?Number(t):function(e){return H.includes(e.toLowerCase())}(e)?0:1}function K(e,{plugins:t}){function n(t,n){return new RegExp(g(t),"m"+(e.case_insensitive?"i":"")+(n?"g":""))}class r{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,t){t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),this.matchAt+=function(e){return new RegExp(e.toString()+"|").exec("").length-1}(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null);const e=this.regexes.map((e=>e[1]));this.matcherRe=n(function(e,t="|"){let n=0;return e.map((e=>{n+=1;const t=n;let r=g(e),i="";for(;r.length>0;){const e=d.exec(r);if(!e){i+=r;break}i+=r.substring(0,e.index),r=r.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?i+="\\"+String(Number(e[1])+t):(i+=e[0],"("===e[0]&&n++)}return i})).map((e=>`(${e})`)).join(t)}(e),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex;const t=this.matcherRe.exec(e);if(!t)return null;const n=t.findIndex(((e,t)=>t>0&&void 0!==e)),r=this.matchIndexes[n];return t.splice(0,n),Object.assign(t,r)}}class i{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e];const t=new r;return this.rules.slice(e).forEach((([e,n])=>t.addRule(e,n))),t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,t){this.rules.push([e,t]),"begin"===t.type&&this.count++}exec(e){const t=this.getMatcher(this.regexIndex);t.lastIndex=this.lastIndex;let n=t.exec(e);if(this.resumingScanAtSamePosition())if(n&&n.index===this.lastIndex);else{const t=this.getMatcher(0);t.lastIndex=this.lastIndex+1,n=t.exec(e)}return n&&(this.regexIndex+=n.position+1,this.regexIndex===this.count&&this.considerAll()),n}}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=s(e.classNameAliases||{}),function t(r,a){const l=r;if(r.isCompiled)return l;[P].forEach((e=>e(r,a))),e.compilerExtensions.forEach((e=>e(r,a))),r.__beforeBegin=null,[B,D,$].forEach((e=>e(r,a))),r.isCompiled=!0;let o=null;if("object"==typeof r.keywords&&(o=r.keywords.$pattern,delete r.keywords.$pattern),r.keywords&&(r.keywords=U(r.keywords,e.case_insensitive)),r.lexemes&&o)throw new Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");return o=o||r.lexemes||/\w+/,l.keywordPatternRe=n(o,!0),a&&(r.begin||(r.begin=/\B|\b/),l.beginRe=n(r.begin),r.endSameAsBegin&&(r.end=r.begin),r.end||r.endsWithParent||(r.end=/\B|\b/),r.end&&(l.endRe=n(r.end)),l.terminatorEnd=g(r.end)||"",r.endsWithParent&&a.terminatorEnd&&(l.terminatorEnd+=(r.end?"|":"")+a.terminatorEnd)),r.illegal&&(l.illegalRe=n(r.illegal)),r.contains||(r.contains=[]),r.contains=[].concat(...r.contains.map((function(e){return function(e){e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((function(t){return s(e,{variants:null},t)})));if(e.cachedVariants)return e.cachedVariants;if(F(e))return s(e,{starts:e.starts?s(e.starts):null});if(Object.isFrozen(e))return s(e);return e}("self"===e?r:e)}))),r.contains.forEach((function(e){t(e,l)})),r.starts&&t(r.starts,a),l.matcher=function(e){const t=new i;return e.contains.forEach((e=>t.addRule(e.begin,{rule:e,type:"begin"}))),e.terminatorEnd&&t.addRule(e.terminatorEnd,{type:"end"}),e.illegal&&t.addRule(e.illegal,{type:"illegal"}),t}(l),l}(e)}function F(e){return!!e&&(e.endsWithParent||F(e.starts))}function G(e){const t={props:["language","code","autodetect"],data:function(){return{detectedLanguage:"",unknownLanguage:!1}},computed:{className(){return this.unknownLanguage?"":"hljs "+this.detectedLanguage},highlighted(){if(!this.autoDetect&&!e.getLanguage(this.language))return console.warn(`The language "${this.language}" you specified could not be found.`),this.unknownLanguage=!0,a(this.code);let t={};return this.autoDetect?(t=e.highlightAuto(this.code),this.detectedLanguage=t.language):(t=e.highlight(this.language,this.code,this.ignoreIllegals),this.detectedLanguage=this.language),t.value},autoDetect(){return!this.language||(e=this.autodetect,Boolean(e||""===e));var e},ignoreIllegals:()=>!0},render(e){return e("pre",{},[e("code",{class:this.className,domProps:{innerHTML:this.highlighted}})])}};return{Component:t,VuePlugin:{install(e){e.component("highlightjs",t)}}}}const W={"after:highlightElement":({el:e,result:t,text:n})=>{const r=q(e);if(!r.length)return;const i=document.createElement("div");i.innerHTML=t.value,t.value=function(e,t,n){let r=0,i="";const s=[];function l(){return e.length&&t.length?e[0].offset!==t[0].offset?e[0].offset<t[0].offset?e:t:"start"===t[0].event?e:t:e.length?e:t}function o(e){function t(e){return" "+e.nodeName+'="'+a(e.value)+'"'}i+="<"+V(e)+[].map.call(e.attributes,t).join("")+">"}function c(e){i+="</"+V(e)+">"}function u(e){("start"===e.event?o:c)(e.node)}for(;e.length||t.length;){let t=l();if(i+=a(n.substring(r,t[0].offset)),r=t[0].offset,t===e){s.reverse().forEach(c);do{u(t.splice(0,1)[0]),t=l()}while(t===e&&t.length&&t[0].offset===r);s.reverse().forEach(o)}else"start"===t[0].event?s.push(t[0].node):s.pop(),u(t.splice(0,1)[0])}return i+a(n.substr(r))}(r,q(i),n)}};function V(e){return e.nodeName.toLowerCase()}function q(e){const t=[];return function e(n,r){for(let i=n.firstChild;i;i=i.nextSibling)3===i.nodeType?r+=i.nodeValue.length:1===i.nodeType&&(t.push({event:"start",offset:r,node:i}),r=e(i,r),V(i).match(/br|hr|img|input/)||t.push({event:"stop",offset:r,node:i}));return r}(e,0),t}const Z={},Q=e=>{console.error(e)},X=(e,...t)=>{console.log(`WARN: ${e}`,...t)},J=(e,t)=>{Z[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),Z[`${e}/${t}`]=!0)},Y=a,ee=s,te=Symbol("nomatch");var ne=function(e){const t=Object.create(null),r=Object.create(null),a=[];let s=!0;const l=/(^(<[^>]+>|\t|)+|\n)/gm,o="Could not find the language '{}', did you forget to load/include a language module?",c={disableAutodetect:!0,name:"Plain text",contains:[]};let g={noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:null,__emitter:u};function d(e){return g.noHighlightRe.test(e)}function h(e,t,n,r){let i="",a="";"object"==typeof t?(i=e,n=t.ignoreIllegals,a=t.language,r=void 0):(J("10.7.0","highlight(lang, code, ...args) has been deprecated."),J("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),a=e,i=t);const s={code:i,language:a};I("before:highlight",s);const l=s.result?s.result:f(s.language,s.code,n,r);return l.code=s.code,I("after:highlight",l),l}function f(e,n,r,l){function c(e,t){const n=x.case_insensitive?t[0].toLowerCase():t[0];return Object.prototype.hasOwnProperty.call(e.keywords,n)&&e.keywords[n]}function u(){null!=R.subLanguage?function(){if(""===M)return;let e=null;if("string"==typeof R.subLanguage){if(!t[R.subLanguage])return void O.addText(M);e=f(R.subLanguage,M,!0,I[R.subLanguage]),I[R.subLanguage]=e.top}else e=p(M,R.subLanguage.length?R.subLanguage:null);R.relevance>0&&(j+=e.relevance),O.addSublanguage(e.emitter,e.language)}():function(){if(!R.keywords)return void O.addText(M);let e=0;R.keywordPatternRe.lastIndex=0;let t=R.keywordPatternRe.exec(M),n="";for(;t;){n+=M.substring(e,t.index);const r=c(R,t);if(r){const[e,i]=r;if(O.addText(n),n="",j+=i,e.startsWith("_"))n+=t[0];else{const n=x.classNameAliases[e]||e;O.addKeyword(t[0],n)}}else n+=t[0];e=R.keywordPatternRe.lastIndex,t=R.keywordPatternRe.exec(M)}n+=M.substr(e),O.addText(n)}(),M=""}function d(e){return e.className&&O.openNode(x.classNameAliases[e.className]||e.className),R=Object.create(e,{parent:{value:R}}),R}function h(e,t,n){let r=function(e,t){const n=e&&e.exec(t);return n&&0===n.index}(e.endRe,n);if(r){if(e["on:end"]){const n=new i(e);e["on:end"](t,n),n.isMatchIgnored&&(r=!1)}if(r){for(;e.endsParent&&e.parent;)e=e.parent;return e}}if(e.endsWithParent)return h(e.parent,t,n)}function b(e){return 0===R.matcher.regexIndex?(M+=e[0],1):(S=!0,0)}function m(e){const t=e[0],n=e.rule,r=new i(n),a=[n.__beforeBegin,n["on:begin"]];for(const i of a)if(i&&(i(e,r),r.isMatchIgnored))return b(t);return n&&n.endSameAsBegin&&(n.endRe=new RegExp(t.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"),"m")),n.skip?M+=t:(n.excludeBegin&&(M+=t),u(),n.returnBegin||n.excludeBegin||(M=t)),d(n),n.returnBegin?0:t.length}function E(e){const t=e[0],r=n.substr(e.index),i=h(R,e,r);if(!i)return te;const a=R;a.skip?M+=t:(a.returnEnd||a.excludeEnd||(M+=t),u(),a.excludeEnd&&(M=t));do{R.className&&O.closeNode(),R.skip||R.subLanguage||(j+=R.relevance),R=R.parent}while(R!==i.parent);return i.starts&&(i.endSameAsBegin&&(i.starts.endRe=i.endRe),d(i.starts)),a.returnEnd?0:t.length}let _={};function v(t,i){const a=i&&i[0];if(M+=t,null==a)return u(),0;if("begin"===_.type&&"end"===i.type&&_.index===i.index&&""===a){if(M+=n.slice(i.index,i.index+1),!s){const t=new Error("0 width match regex");throw t.languageName=e,t.badRule=_.rule,t}return 1}if(_=i,"begin"===i.type)return m(i);if("illegal"===i.type&&!r){const e=new Error('Illegal lexeme "'+a+'" for mode "'+(R.className||"<unnamed>")+'"');throw e.mode=R,e}if("end"===i.type){const e=E(i);if(e!==te)return e}if("illegal"===i.type&&""===a)return 1;if(A>1e5&&A>3*i.index){throw new Error("potential infinite loop, way more iterations than matches")}return M+=a,a.length}const x=w(e);if(!x)throw Q(o.replace("{}",e)),new Error('Unknown language: "'+e+'"');const y=K(x,{plugins:a});let N="",R=l||y;const I={},O=new g.__emitter(g);!function(){const e=[];for(let t=R;t!==x;t=t.parent)t.className&&e.unshift(t.className);e.forEach((e=>O.openNode(e)))}();let M="",j=0,k=0,A=0,S=!1;try{for(R.matcher.considerAll();;){A++,S?S=!1:R.matcher.considerAll(),R.matcher.lastIndex=k;const e=R.matcher.exec(n);if(!e)break;const t=v(n.substring(k,e.index),e);k=e.index+t}return v(n.substr(k)),O.closeAllNodes(),O.finalize(),N=O.toHTML(),{relevance:Math.floor(j),value:N,language:e,illegal:!1,emitter:O,top:R}}catch(T){if(T.message&&T.message.includes("Illegal"))return{illegal:!0,illegalBy:{msg:T.message,context:n.slice(k-100,k+100),mode:T.mode},sofar:N,relevance:0,value:Y(n),emitter:O};if(s)return{illegal:!1,relevance:0,value:Y(n),emitter:O,language:e,top:R,errorRaised:T};throw T}}function p(e,n){n=n||g.languages||Object.keys(t);const r=function(e){const t={relevance:0,emitter:new g.__emitter(g),value:Y(e),illegal:!1,top:c};return t.emitter.addText(e),t}(e),i=n.filter(w).filter(R).map((t=>f(t,e,!1)));i.unshift(r);const a=i.sort(((e,t)=>{if(e.relevance!==t.relevance)return t.relevance-e.relevance;if(e.language&&t.language){if(w(e.language).supersetOf===t.language)return 1;if(w(t.language).supersetOf===e.language)return-1}return 0})),[s,l]=a,o=s;return o.second_best=l,o}const b={"before:highlightElement":({el:e})=>{g.useBR&&(e.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ /]*>/g,"\n"))},"after:highlightElement":({result:e})=>{g.useBR&&(e.value=e.value.replace(/\n/g,"<br>"))}},m=/^(<[^>]+>|\t)+/gm,E={"after:highlightElement":({result:e})=>{g.tabReplace&&(e.value=e.value.replace(m,(e=>e.replace(/\t/g,g.tabReplace))))}};function _(e){let t=null;const n=function(e){let t=e.className+" ";t+=e.parentNode?e.parentNode.className:"";const n=g.languageDetectRe.exec(t);if(n){const t=w(n[1]);return t||(X(o.replace("{}",n[1])),X("Falling back to no-highlight mode for this block.",e)),t?n[1]:"no-highlight"}return t.split(/\s+/).find((e=>d(e)||w(e)))}(e);if(d(n))return;I("before:highlightElement",{el:e,language:n}),t=e;const i=t.textContent,a=n?h(i,{language:n,ignoreIllegals:!0}):p(i);I("after:highlightElement",{el:e,result:a,text:i}),e.innerHTML=a.value,function(e,t,n){const i=t?r[t]:n;e.classList.add("hljs"),i&&e.classList.add(i)}(e,n,a.language),e.result={language:a.language,re:a.relevance,relavance:a.relevance},a.second_best&&(e.second_best={language:a.second_best.language,re:a.second_best.relevance,relavance:a.second_best.relevance})}const v=()=>{if(v.called)return;v.called=!0,J("10.6.0","initHighlighting() is deprecated.  Use highlightAll() instead.");document.querySelectorAll("pre code").forEach(_)};let x=!1;function y(){if("loading"===document.readyState)return void(x=!0);document.querySelectorAll("pre code").forEach(_)}function w(e){return e=(e||"").toLowerCase(),t[e]||t[r[e]]}function N(e,{languageName:t}){"string"==typeof e&&(e=[e]),e.forEach((e=>{r[e.toLowerCase()]=t}))}function R(e){const t=w(e);return t&&!t.disableAutodetect}function I(e,t){const n=e;a.forEach((function(e){e[n]&&e[n](t)}))}"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",(function(){x&&y()}),!1),Object.assign(e,{highlight:h,highlightAuto:p,highlightAll:y,fixMarkup:function(e){return J("10.2.0","fixMarkup will be removed entirely in v11.0"),J("10.2.0","Please see https://github.com/highlightjs/highlight.js/issues/2534"),t=e,g.tabReplace||g.useBR?t.replace(l,(e=>"\n"===e?g.useBR?"<br>":e:g.tabReplace?e.replace(/\t/g,g.tabReplace):e)):t;var t},highlightElement:_,highlightBlock:function(e){return J("10.7.0","highlightBlock will be removed entirely in v12.0"),J("10.7.0","Please use highlightElement now."),_(e)},configure:function(e){e.useBR&&(J("10.3.0","'useBR' will be removed entirely in v11.0"),J("10.3.0","Please see https://github.com/highlightjs/highlight.js/issues/2559")),g=ee(g,e)},initHighlighting:v,initHighlightingOnLoad:function(){J("10.6.0","initHighlightingOnLoad() is deprecated.  Use highlightAll() instead."),x=!0},registerLanguage:function(n,r){let i=null;try{i=r(e)}catch(a){if(Q("Language definition for '{}' could not be registered.".replace("{}",n)),!s)throw a;Q(a),i=c}i.name||(i.name=n),t[n]=i,i.rawDefinition=r.bind(null,e),i.aliases&&N(i.aliases,{languageName:n})},unregisterLanguage:function(e){delete t[e];for(const t of Object.keys(r))r[t]===e&&delete r[t]},listLanguages:function(){return Object.keys(t)},getLanguage:w,registerAliases:N,requireLanguage:function(e){J("10.4.0","requireLanguage will be removed entirely in v11."),J("10.4.0","Please see https://github.com/highlightjs/highlight.js/pull/2844");const t=w(e);if(t)return t;throw new Error("The '{}' language is required, but not loaded.".replace("{}",e))},autoDetection:R,inherit:ee,addPlugin:function(e){!function(e){e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=t=>{e["before:highlightBlock"](Object.assign({block:t.el},t))}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=t=>{e["after:highlightBlock"](Object.assign({block:t.el},t))})}(e),a.push(e)},vuePlugin:G(e).VuePlugin}),e.debugMode=function(){s=!1},e.safeMode=function(){s=!0},e.versionString="10.7.2";for(const i in L)"object"==typeof L[i]&&n(L[i]);return Object.assign(e,L),e.addPlugin(b),e.addPlugin(W),e.addPlugin(E),e}({});var re=function(e){const t={className:"variable",begin:"\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*(?![A-Za-z0-9])(?![$])"},n={className:"meta",variants:[{begin:/<\?php/,relevance:10},{begin:/<\?[=]?/},{begin:/\?>/}]},r={className:"subst",variants:[{begin:/\$\w+/},{begin:/\{\$/,end:/\}/}]},i=e.inherit(e.APOS_STRING_MODE,{illegal:null}),a=e.inherit(e.QUOTE_STRING_MODE,{illegal:null,contains:e.QUOTE_STRING_MODE.contains.concat(r)}),s=e.END_SAME_AS_BEGIN({begin:/<<<[ \t]*(\w+)\n/,end:/[ \t]*(\w+)\b/,contains:e.QUOTE_STRING_MODE.contains.concat(r)}),l={className:"string",contains:[e.BACKSLASH_ESCAPE,n],variants:[e.inherit(i,{begin:"b'",end:"'"}),e.inherit(a,{begin:'b"',end:'"'}),a,i,s]},o={className:"number",variants:[{begin:"\\b0b[01]+(?:_[01]+)*\\b"},{begin:"\\b0o[0-7]+(?:_[0-7]+)*\\b"},{begin:"\\b0x[\\da-f]+(?:_[\\da-f]+)*\\b"},{begin:"(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:e[+-]?\\d+)?"}],relevance:0},c={keyword:"__CLASS__ __DIR__ __FILE__ __FUNCTION__ __LINE__ __METHOD__ __NAMESPACE__ __TRAIT__ die echo exit include include_once print require require_once array abstract and as binary bool boolean break callable case catch class clone const continue declare default do double else elseif empty enddeclare endfor endforeach endif endswitch endwhile enum eval extends final finally float for foreach from global goto if implements instanceof insteadof int integer interface isset iterable list match|0 mixed new object or private protected public real return string switch throw trait try unset use var void while xor yield",literal:"false null true",built_in:"Error|0 AppendIterator ArgumentCountError ArithmeticError ArrayIterator ArrayObject AssertionError BadFunctionCallException BadMethodCallException CachingIterator CallbackFilterIterator CompileError Countable DirectoryIterator DivisionByZeroError DomainException EmptyIterator ErrorException Exception FilesystemIterator FilterIterator GlobIterator InfiniteIterator InvalidArgumentException IteratorIterator LengthException LimitIterator LogicException MultipleIterator NoRewindIterator OutOfBoundsException OutOfRangeException OuterIterator OverflowException ParentIterator ParseError RangeException RecursiveArrayIterator RecursiveCachingIterator RecursiveCallbackFilterIterator RecursiveDirectoryIterator RecursiveFilterIterator RecursiveIterator RecursiveIteratorIterator RecursiveRegexIterator RecursiveTreeIterator RegexIterator RuntimeException SeekableIterator SplDoublyLinkedList SplFileInfo SplFileObject SplFixedArray SplHeap SplMaxHeap SplMinHeap SplObjectStorage SplObserver SplObserver SplPriorityQueue SplQueue SplStack SplSubject SplSubject SplTempFileObject TypeError UnderflowException UnexpectedValueException UnhandledMatchError ArrayAccess Closure Generator Iterator IteratorAggregate Serializable Stringable Throwable Traversable WeakReference WeakMap Directory __PHP_Incomplete_Class parent php_user_filter self static stdClass"};return{aliases:["php3","php4","php5","php6","php7","php8"],case_insensitive:!0,keywords:c,contains:[e.HASH_COMMENT_MODE,e.COMMENT("//","$",{contains:[n]}),e.COMMENT("/\\*","\\*/",{contains:[{className:"doctag",begin:"@[A-Za-z]+"}]}),e.COMMENT("__halt_compiler.+?;",!1,{endsWithParent:!0,keywords:"__halt_compiler"}),n,{className:"keyword",begin:/\$this\b/},t,{begin:/(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/},{className:"function",relevance:0,beginKeywords:"fn function",end:/[;{]/,excludeEnd:!0,illegal:"[$%\\[]",contains:[{beginKeywords:"use"},e.UNDERSCORE_TITLE_MODE,{begin:"=>",endsParent:!0},{className:"params",begin:"\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0,keywords:c,contains:["self",t,e.C_BLOCK_COMMENT_MODE,l,o]}]},{className:"class",variants:[{beginKeywords:"enum",illegal:/[($"]/},{beginKeywords:"class interface trait",illegal:/[:($"]/}],relevance:0,end:/\{/,excludeEnd:!0,contains:[{beginKeywords:"extends implements"},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"namespace",relevance:0,end:";",illegal:/[.']/,contains:[e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"use",relevance:0,end:";",contains:[e.UNDERSCORE_TITLE_MODE]},l,o]}};ne.registerLanguage("php",re),ne.registerLanguage("css",re),ne.registerLanguage("javascript",re);const ie={props:{title:String,content:String,toc:String,path:String},methods:{parseContent(e){return this.parseLinks(this.parseImages(this.parseLists(this.parseInfoBlocks(this.parseHeadings(this.parseCode(this.parseTables(e)))))))},parseLinks:e=>e.replace(/href=\"(.+)\"/g,((e,t)=>t.startsWith("#")?`href="${t}"`:t.startsWith("https://")||t.startsWith("http://")?`href="${t}" target="_blank"`:(t=t.replaceAll("../",""),`href="${route("voyager.voyager-docs")}?path=${t}"`))),parseInfoBlocks:e=>e.replace(/{% hint style=&quot;([^&]+)&quot; %}([^{]+){% endhint %}/gim,((e,t,n)=>{let r="red";return"info"==t?r="blue":"warning"==t&&(r="yellow"),`<div class="rounded-md p-2 border border-${r}-500 text-sm leading-5 text-${r}-500 my-2">${n}</div>`})),parseImages:e=>e.replace(/src=\"(.+)\"/g,((e,t)=>t.startsWith("https://")||t.startsWith("http://")?`src="${t}"`:(t=t.replaceAll("../","").replace(".gitbook/assets/",""),`src="${route("voyager.voyager-docs-asset")}?path=${t}" class="mx-auto py-2"`))),parseLists:e=>e.replaceAll("<ul>",'<ul class="pl-4">'),parseHeadings:e=>e.replace(/<h([1-6])>([^<]+)/g,((e,t,n)=>{let r=slugify(n,{lower:!0});return`<h${parseInt(t)+2} class="mt-6 mb-2"><a href="#${r}" id="${r}">${n}</a>`})),parseCode(e){return e.replace(/<code class=\"language-([^&]+)\">([^<]+)<\/code>/gim,((e,t,n)=>`<code>${ne.highlight(this.decodeHtml(n),{language:t}).value}</code>`))},parseTables:e=>e.replaceAll("<table>",'<div class="voyager-table"><table>').replaceAll("</table>","</table></div>"),decodeHtml(e){var t=document.createElement("textarea");return t.innerHTML=e,t.value}}};ie.render=function(t,n,r,i,a,s){const l=e.resolveComponent("collapsible"),o=e.resolveComponent("card");return e.openBlock(),e.createBlock("div",null,[e.createVNode(l,{title:"Table of contents",closed:""},{default:e.withCtx((()=>[e.createVNode("div",{innerHTML:s.parseContent(r.toc)},null,8,["innerHTML"])])),_:1}),e.createVNode(o,{title:r.title},{default:e.withCtx((()=>[e.createVNode("div",{id:"doc-content",innerHTML:s.parseContent(r.content)},null,8,["innerHTML"])])),_:1},8,["title"])])},voyager.component("voyager-docs",ie)}));
