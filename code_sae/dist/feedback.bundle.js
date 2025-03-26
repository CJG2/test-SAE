(()=>{"use strict";var e={};function t(n){var o=e[n];if(void 0!==o)return o.exports;var r=e[n]={exports:{}};return __webpack_modules__[n](r,r.exports,t),r.exports}function n(e,t){const n=document.createElement("div");n.className=`message ${t}`,n.textContent=e;const o=document.querySelector("#container");o.insertBefore(n,o.firstChild),setTimeout((()=>n.remove()),5e3)}t.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{var e;t.g.importScripts&&(e=t.g.location+"");var n=t.g.document;if(!e&&n&&(n.currentScript&&"SCRIPT"===n.currentScript.tagName.toUpperCase()&&(e=n.currentScript.src),!e)){var o=n.getElementsByTagName("script");if(o.length)for(var r=o.length-1;r>-1&&(!e||!/^http(s?):/.test(e));)e=o[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),t.p=e})(),t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,t.p,document.addEventListener("DOMContentLoaded",(()=>{const e=JSON.parse(localStorage.getItem("userLoggedIn")),t=window.location.pathname,n=["/connexion.html"];if(e){if("adulte"!==e.type&&!n.includes(t))return void(window.location.href="./accueil.html")}else if(!n.includes(t))return void(window.location.href="./connexion.html");document.getElementById("logoApplication").addEventListener("click",(function(){window.location.href="./profil.html"}));const o=document.querySelector("#logout-link");o&&o.addEventListener("click",(e=>{e.preventDefault(),localStorage.removeItem("userLoggedIn"),sessionStorage.removeItem("enfantConnecte"),sessionStorage.removeItem("adulteConnecte"),window.location.href="./connexion.html"}))})),document.addEventListener("DOMContentLoaded",(()=>{!function(){const e=document.querySelector("#container"),t=document.createElement("form");t.className="feedback-form",t.innerHTML=`\n      <div class="form-group">\n        <label for="rating">Note générale de l'application :</label>\n        <div class="rating-container">\n          ${[1,2,3,4,5].map((e=>`\n            <input type="radio" id="star${e}" name="rating" value="${e}">\n            <label for="star${e}">★</label>\n          `)).join("")}\n        </div>\n      </div>\n  \n      <div class="form-group">\n        <label for="usageFrequency">Fréquence d'utilisation :</label>\n        <select id="usageFrequency" name="usageFrequency" required>\n          <option value="">Sélectionnez une option</option>\n          <option value="daily">Tous les jours</option>\n          <option value="weekly">Plusieurs fois par semaine</option>\n          <option value="monthly">Quelques fois par mois</option>\n          <option value="rarely">Rarement</option>\n        </select>\n      </div>\n  \n      <div class="form-group">\n        <label for="childProgress">Comment évaluez-vous les progrès de votre enfant ?</label>\n        <select id="childProgress" name="childProgress" required>\n          <option value="">Sélectionnez une option</option>\n          <option value="excellent">Excellents progrès</option>\n          <option value="good">Bons progrès</option>\n          <option value="moderate">Progrès modérés</option>\n          <option value="slow">Progrès lents</option>\n        </select>\n      </div>\n  \n      <div class="form-group">\n        <label for="positivePoints">Points positifs de l'application :</label>\n        <textarea id="positivePoints" name="positivePoints" rows="4" placeholder="Qu'appréciez-vous dans l'application ?"></textarea>\n      </div>\n  \n      <div class="form-group">\n        <label for="improvementPoints">Points à améliorer :</label>\n        <textarea id="improvementPoints" name="improvementPoints" rows="4" placeholder="Quelles sont vos suggestions d'amélioration ?"></textarea>\n      </div>\n  \n      <button type="submit" class="submit-btn">Envoyer mon avis</button>\n    `,t.addEventListener("submit",(async e=>{e.preventDefault();const o=new FormData(t),r={rating:o.get("rating"),usageFrequency:o.get("usageFrequency"),childProgress:o.get("childProgress"),positivePoints:o.get("positivePoints"),improvementPoints:o.get("improvementPoints"),userId:JSON.parse(localStorage.getItem("userLoggedIn")).id,timestamp:(new Date).toISOString()};try{await(i=Date.now(),s=r.userId,a=r.rating,l=r.usageFrequency,c=r.childProgress,u=r.positivePoints,p=r.improvementPoints,void fetch("https://test-sae.onrender.com/api/feedback/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({numero_feedback:i,username:s,nb_etoiles:a,frequence:l,progres_enfant:c,point_fort:u,point_amelioration:p})}).then((e=>{if(!e.ok)throw new Error(`Erreur HTTP : ${e.status}`);return e.json()})).then((e=>{e.success?alert("envoi du feedback"):alert("Erreur lors de l'envoi du feedback")})).catch((e=>{alert("Une erreur est survenue : "+e.message)}))),n("Merci pour votre feedback !","success"),t.reset()}catch(e){n("Une erreur est survenue. Veuillez réessayer.","error")}var i,s,a,l,c,u,p})),e.appendChild(t)}()})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".hamburger"),t=document.querySelector(".menubar"),n=document.querySelector(".menubar #logout-link");n&&n.addEventListener("click",(e=>{e.preventDefault(),localStorage.removeItem("userLoggedIn"),sessionStorage.removeItem("enfantConnecte"),sessionStorage.removeItem("adulteConnecte"),sessionStorage.clear(),window.location.href="./connexion.html"})),e.addEventListener("click",(()=>{e.classList.toggle("hamburger-active"),t.classList.toggle("active")})),document.addEventListener("click",(n=>{e.contains(n.target)||t.contains(n.target)||(e.classList.remove("hamburger-active"),t.classList.remove("active"))}))}))})();