(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const u="startFragment",b="replaceFragment",C="searchFragment",S="commandsListLenght",d="countNoResultsTrying",v="wrapBlockID",r=function(){const e={startFragment:null,replaceFragment:null,searchFragment:null,insertCommandsList:null,wrapBlockID:null,commandsListLenght:0,countNoResultsTrying:0};function t(o){return Object.prototype.hasOwnProperty.call(e,o)?e[o]:null}function s(o,a){if(!Object.prototype.hasOwnProperty.call(e,o))throw new Error("Store does not have the value key");e[o]=a}function n(o){if(!Object.prototype.hasOwnProperty.call(e,o))throw new Error("Store does not have the value key");e[o]=null}return{get:t,set:s,clear:n}}();class N{constructor(e,t){this.popup=e,this.className=t,this.tagName="span",this.name="textStyle/userInput"}setUp(){this.setCeAnnotation(),this.setDmAnnotation()}setCeAnnotation(){const e=this.className,t=function(...n){t.super.apply(this,n),this.$element.addClass(e)};OO.inheritClass(t,ve.ce.TextStyleAnnotation),t.static.name=this.name,t.static.tagName=this.tagName,ve.ce.annotationFactory.register(t),t.prototype.getContentContainer=function(){const s=r.get(v);return s&&this.$element.attr("id",s),this.$element[0]}}setDmAnnotation(){const e=function(...s){e.super.apply(this,s)};OO.inheritClass(e,ve.dm.TextStyleAnnotation),e.static.name=this.name,e.static.matchTagNames=[this.tagName],ve.dm.modelRegistry.register(e)}}const T="openCommandsPopup";class P{constructor(e,t,s,n){this.popupObject=e,this.executeSymbol=t,this.fragmentResolver=s,this.commandsResolver=n,this.commandName=T,this.popup=e.getInstance()}setUp(){const e=this.commandName,t=this.executeSymbol,s=function(){s.super.call(this,e)};OO.inheritClass(s,ve.ui.Command),s.prototype.execute=n=>this.popup.isVisible()?!1:(this.surface=n,this.setID(),setTimeout(()=>{this.wrapCommandRunningSymbol(),this.showPopup(),this.bindEvents(),this.commandsResolver.focusFirstCommand(this.popup),this.unwrapCommandRunningSymbol()}),!0),ve.ui.commandRegistry.register(new s),ve.ui.sequenceRegistry.register(new ve.ui.Sequence(e,e,t))}setID(){const e="commands-popup-",t=this.makeID(7);this.ID="#"+e+t,r.set(v,e+t)}makeID(e){let t="";const s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=s.length;let o=0;for(;o<e;)t+=s.charAt(Math.floor(Math.random()*n)),o+=1;return t}wrapCommandRunningSymbol(){const e=this.surface.getModel(),t=e.getFragment();r.set(u,t);const s=e.getLinearFragment(new ve.Range(t.selection.range.end-1,t.selection.range.end));s.annotateContent("set","textStyle/userInput"),r.set(b,s)}showPopup(){this.popup.toggle(!0);const e=$(document).find(".insert-commands-list-wrap"),t=this.calculatePosition();e.css({top:t.top?t.top+"px":"unset",bottom:t.bottom?t.bottom+"px":"unset",left:t.left+"px"}),e.find(".oo-ui-popupWidget-body").scrollTop(0)}calculatePosition(){const n=$(document),o=$(window).height(),a=n.scrollTop(),c=n.find(this.ID).last().offset(),l=c.top-a+17,m=o-l+7;return m<330?{top:null,bottom:m,left:c.left}:{top:l,bottom:null,left:c.left}}unwrapCommandRunningSymbol(){const e=this.surface.getModel(),t=e.getFragment(),s=e.getLinearFragment(new ve.Range(t.selection.range.end-1,t.selection.range.end));s.annotateContent("clear","textStyle/userInput"),e.getLinearFragment(new ve.Range(s.selection.range.end,s.selection.range.end)).select()}bindEvents(){this.bindKeydownEvent(),this.bindScrollEvent(),this.bindHoverEvent()}bindScrollEvent(){$(window).scroll(()=>{this.popup.toggle(!1)})}bindKeydownEvent(){this.surface.$element.find('.ve-ce-rootNode[contenteditable="true"]').on("keydown",t=>(this.tapCommandsBlock(t),this.closePopup(t),this.runCommand(t)))}bindHoverEvent(){$(document).on("mousemove",".insert-command",function(){const e=$(this);e.hasClass("selected")||($(".insert-command").removeClass("selected"),e.addClass("selected"))})}closePopup(e){const t=[37,39,9],s=this.surface.getModel().getFragment();e.keyCode!==void 0&&t.includes(e.keyCode)&&(!this.fragmentResolver.isSearchFragmentExist()||this.fragmentResolver.isOutsideSearchRange(s))&&this.popup.isVisible()&&this.popup.toggle(!1)}tapCommandsBlock(e){const t=[38,40],s=this.surface.getModel().getFragment();if(e.keyCode!==void 0&&t.includes(e.keyCode)&&this.fragmentResolver.isSearchFragmentExist()&&(this.fragmentResolver.isSearchFragmentEmpty()||!this.fragmentResolver.isOutsideSearchRange(s,!0))&&this.popup.isVisible()){e.preventDefault();const n=document.querySelector(".commands-list>.insert-command.selected"),a=[...document.querySelectorAll(".commands-list>.insert-command")],c=a.length-1;if(!a.includes(n))return;const l=a.indexOf(n);let m;e.keyCode===38&&(m=a[l>0?l-1:c]),e.keyCode===40&&(m=a[l<c?l+1:0]),n.classList.remove("selected"),m.classList.add("selected"),this.addAutoScrolling(m)}}addAutoScrolling(e){const t=e.closest(".oo-ui-popupWidget-body"),s=t.offsetHeight,n=t.getBoundingClientRect(),o=e.getBoundingClientRect(),a=t.scrollHeight;o.top<n.top&&(o.top<=0?t.scrollTop=0:t.scrollTop=t.scrollTop-o.height),o.bottom>=n.top+s&&(o.top>=a?t.scrollTop=a:t.scrollTop=t.scrollTop+o.height)}runCommand(e){const t=[13];if(e.keyCode!==void 0&&t.includes(e.keyCode)&&this.popup.isVisible()){e.preventDefault();const s=document.querySelector(".commands-list>.insert-command.selected");return this.commandsResolver.executeCommandWithElement(this.popup,e,this.fragmentResolver,s)}return!0}}class x{constructor(e,t,s){this.popup=e,this.fragmentResolver=t,this.commandsResolver=s,this.commandName="closeCommandsPopup"}setUp(){const e=this.commandName,t=function(){t.super.call(this,e)};OO.inheritClass(t,ve.ui.Command),t.prototype.execute=s=>(this.surface=s,this.searchCommand(),this.closePopup(),!0),ve.ui.commandRegistry.register(new t),ve.ui.sequenceRegistry.register(new ve.ui.Sequence(e,e,/.$/,0,{checkOnDelete:!0}))}searchCommand(){const e=r.get(u);if(e){const t=this.surface.getModel(),s=t.getFragment(),o=t.getLinearFragment(new ve.Range(e.selection.range.start,s.selection.range.end)).getText(!0);r.set(C,o),this.popup.updateContent(o),this.commandsResolver.focusFirstCommand(this.popup.getInstance())}}closePopup(){const e=this.surface.getModel().getFragment(),t=this.popup.getInstance();return e&&(this.isOutsideSearchRange(e)||this.isNoResultsTyping())&&t.isVisible()&&t.toggle(!1),!0}isOutsideSearchRange(e){const s=this.surface.getModel().getLinearFragment(new ve.Range(e.selection.range.start-1,e.selection.range.end)),n=s==null?void 0:s.getText(!0);return(!this.fragmentResolver.isSearchFragmentExist()||this.fragmentResolver.isOutsideSearchRange(e))&&n!==p}isNoResultsTyping(){const e=r.get(d),t=this.fragmentResolver.getSearchText();return e>3&&t.length>0||t.length>1&&t.slice(-2)==="  "}}const p="/";class A{constructor(e,t,s){this.popup=e,this.fragmentResolver=t,this.commandsResolver=s,this.executeSymbol=p,this.className="commands-popup-wrap"}setUp(){new N(this.popup.getInstance(),this.className).setUp(),new P(this.popup,this.executeSymbol,this.fragmentResolver,this.commandsResolver).setUp(),new x(this.popup,this.fragmentResolver,this.commandsResolver).setUp()}}class L{static create(e,t,s){const n=function(a){n.super.call(this,a)};return OO.inheritClass(n,OO.ui.PopupWidget),n.prototype.onDocumentMouseDown=function(o){this.isVisible()&&(OO.ui.contains(this.$element.find(".commands-list").get(),o.target,!0)||this.toggle(!1),t.executeCommandWithElement(this,o,s))},new n(e)}}const f="insert-command",w="no-results";class g{constructor(e,t){this.fragmentResolver=e,this.commandsResolver=t,this.className="insert-commands-list-wrap",this.commandClassName=f,this.popup=L.create({$content:$('<div class="commands-list"></div>'),classes:[this.className],hideCloseButton:!0,anchor:!1,autoClose:!0,autoFlip:!0,position:"after",verticalPosition:"above",hideWhenOutOfView:!0,width:210},t,e),this.setClosingHookHandler().then(),document.body.appendChild(this.popup.$element[0])}getInstance(){return this.popup}static getCommandClassName(){return f}async setClosingHookHandler(){this.popup.on("closing",async()=>{await this.clearContent()})}async clearContent(){var s;await this.setContent(),((s=ve.init.target)==null?void 0:s.getSurface()).$element.find('.ve-ce-rootNode[contenteditable="true"]').off("keydown"),$(window).unbind("scroll"),$(document).off("mousemove",".insert-command"),r.clear(u),r.clear(b),r.clear(C),r.clear(v),r.set(S,0),r.set(d,0)}setContent(){this.setBodyHtml(this.commandsResolver.getCommands())}setBodyHtml(e){const t=this.getCommandElTemplate(e);this.popup.$body.find(".commands-list").html(t)}updateContent(e){this.updateBodyHtml(this.commandsResolver.getCommands(e))}updateBodyHtml(e){let t="";if(e.length)t=this.getCommandElTemplate(e);else{t=`<span class="${this.commandClassName}" role="button" data-command="${w}">No results</span>`;const s=r.get(d);r.set(d,s+1)}r.set(S,e.length),this.popup.$body.find(".commands-list").html(t)}getCommandElTemplate(e){let t="";return e.forEach(function(s,n){t+=`<span class="${f}" tabindex="${n+1}" role="button" data-command="${s.command}">
					<span class="oo-ui-iconElement-icon oo-ui-icon-${s.icon||"noIcon"}"></span>
					<span class="oo-ui-tool-title">${s.title}</span>
				</span>`}),t}}class M{constructor(){var e;this.surface=(e=ve.init.target)==null?void 0:e.getSurface()}setSurface(){var e;this.surface=(e=ve.init.target)==null?void 0:e.getSurface()}isOutsideSearchRange(e,t=!1){const s=this.getSearchRange(),n=e.selection.range.start+(t?1:0),o=e.selection.range.end;return n<s.start||o>s.end||n===s.start&&s.start===s.end}isSearchFragmentExist(){return r.get(u)!==null}isSearchFragmentEmpty(){const e=this.getSearchRange();return e.start===e.end}getSearchRange(){const e=r.get(u),t=r.get(C);return{start:e.selection.range.start,end:e.selection.range.start+(t?t.length:0)}}getSearchText(){if(!this.isSearchFragmentExist())return"";const e=this.getSearchRange();return this.getFragment(e).getText(!0)}getFragment(e){return this.surface.getModel().getLinearFragment(new ve.Range(e.start,e.end))}replaceSearchFragment(){const e=this.getSearchRange(),t=this.getFragment({start:e.start-1,end:e.end});if(t!==null){const s=p+this.getSearchText();if(t.getText(!0)===s){const n=this.surface.getModel().getFragment();t.removeContent(),t.insertContent(s),this.setCursorAfterReplacing(n,e)}}}setCursorAfterReplacing(e,t){const s={start:t.end,end:t.end};e&&e.selection.range.end>t.end&&(s.start=s.end=e.selection.range.end),this.getFragment(s).select()}removeSearchFragment(){const e=this.getSearchRange(),t=e.start-1,s=this.getFragment({start:t,end:e.end});if(s!==null){const n=p+this.getSearchText();s.getText(!0)===n&&(s.removeContent(),this.getFragment({start:t,end:t}).select())}}}class H{getCommands(e=""){return this.filterCommands(this.getConfiguredCommands(e),e)}getConfiguredCommands(e){return e.length?this.getAvailableCommands():this.getPredefinedCommands()}getPredefinedCommands(){const e=mw.config.get("SlashCommands"),t=(e==null?void 0:e.Predefined)??[];return this.getAvailableCommands().filter(n=>t.includes(n.command))}getAvailableCommands(){const e=mw.config.get("SlashCommands"),t=(e==null?void 0:e.Available)??[],s=this.getAllCommands(),n=[];for(const o of t)Object.prototype.hasOwnProperty.call(s,o.command)&&(o.title=this.getCommandLabel(o.command),n.push(o));return n}filterCommands(e,t){return t&&(e=e.filter(s=>s.title.toLowerCase().includes(t.toLowerCase())).sort((s,n)=>s.command.startsWith(t)&&n.command.startsWith(t)?0:n.command.startsWith(t)?1:-1)),e}executeCommandWithElement(e,t,s,n=null){const o=n||t.target;if(!OO.ui.contains(e.$element.get(),o,!0))return;const a=$(o),c=a.parents(`.${g.getCommandClassName()}`);if(a.hasClass(g.getCommandClassName())||c.length){const l=g.getCommandClassName(),m=a.hasClass(l)?a:c,R=this.getAllCommands(),h=m.data("command");if(h===w)return!1;if(Object.prototype.hasOwnProperty.call(R,h)){const O=ve.init.target.getSurface();return s.isSearchFragmentExist()&&s.removeSearchFragment(),e.toggle(!1),setTimeout(()=>{R[h].execute(O)}),!1}}return!0}getAllCommands(){return ve.ui.commandRegistry.registry}getCommandLabel(e){var t,s;return((s=(t=ve.ui.commandHelpRegistry.registry)==null?void 0:t[e])==null?void 0:s.label())??e.charAt(0).toUpperCase()+e.slice(1)}focusFirstCommand(e){setTimeout(()=>{const t=e.$body.find(".commands-list .insert-command");t.removeClass("selected"),t.first().addClass("selected")})}}const y=new M,F=new H,E=new g(y,F);new A(E,y,F).setUp();mw.hook("ve.activationComplete").add(async function(){await E.setContent(),y.setSurface()});
