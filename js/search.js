window.searchTimer=null;
window.searchData=null;

window.SEARCH_CACHE="NGA_search_cache_v6";

function initSearch(){

$("searchInput").oninput=()=>{
clearTimeout(window.searchTimer);
window.searchTimer=setTimeout(()=>{
runSearch($("searchInput").value);
},300);

};

$("searchBtn").onclick=()=>{
runSearch($("searchInput").value);
};
$("copyBtn").onclick=copyMemberID;

$("qrImage").onclick=()=>{
const img=$("qrImage");
const preview=$("qrPreview");
const modal=$("qrModal");
if(preview&&img)preview.src=img.src;
if(modal)modal.classList.remove("hidden");
};

$("qrModal").onclick=()=>{
$("qrModal")?.classList.add("hidden");
};

$("waBtn").onclick=openWA;
$("pdfBtn").onclick=showPDF;
$("closePDF").onclick=hidePDF;
$("pdfModal").onclick=e=>{

if(e.target.classList.contains("modal-mask"))hidePDF();

};

renderHistory();

}

async function runSearch(keyword){

keyword=keyword.trim();
if(!keyword)return;

const cache=getCache();
if(cache[keyword]){
showSearchResult(cache[keyword]);
return;
}

$("emptyCard")?.classList.add("hidden");
$("resultCard")?.classList.add("hidden");
showLoading(true);

try{

const res=await searchAPI(keyword);
if(!res.success){
showEmpty();
return;
}

window.searchData=res;
saveCache(keyword,res);
showSearchResult(res);

}catch(e){showEmpty();}

showLoading(false);

}

function showSearchResult(d){

window.searchData=d;
set("cnName",d.chineseName||"-");
set("enName",d.englishName||"-");
set("church",d.church||"-");
set("memberID",d.id||"-");

const img=$("qrImage");
if(img)img.src=d.qr||"";
$("resultCard")?.classList.remove("hidden");
$("emptyCard")?.classList.add("hidden");
addHistory(d.id||"");

}

function showEmpty(){

$("resultCard")?.classList.add("hidden");
$("emptyCard")?.classList.remove("hidden");

}

function copyMemberID(){

if(!window.searchData)return;
navigator.clipboard.writeText(window.searchData.id||"");
if(typeof toast==="function")
toast("Copied");

}

function showPDF(){

if(!window.searchData?.pdf)return;
const frame=$("pdfFrame");
const modal=$("pdfModal");

if(frame)frame.src=window.searchData.pdf;
if(modal)modal.classList.remove("hidden");

}

function hidePDF(){

$("pdfModal")?.classList.add("hidden");
const frame=$("pdfFrame");
if(frame)frame.src="";

}

function openWA(){

if(window.searchData?.wa)
window.open(window.searchData.wa,"_blank");

}

function getCache(){

try{

return JSON.parse(localStorage.getItem(window.SEARCH_CACHE)||"{}");

}catch(e){return {};}

}

function saveCache(key,value){

let c=getCache();
c[key]=value;

let keys=Object.keys(c);
if(keys.length>4)
delete c[keys[0]];
localStorage.setItem(window.SEARCH_CACHE,JSON.stringify(c));

}

function addHistory(id){

if(!id)return;

let h=JSON.parse(localStorage.NGA_search_history||"[]");
h=h.filter(x=>x!==id);
h.unshift(id);
if(h.length>4)
h.pop();

localStorage.NGA_search_history=JSON.stringify(h);
renderHistory();

}

function renderHistory(){

let h=JSON.parse(localStorage.NGA_search_history||"[]");
set("historyBox",
h.map(x=>`<button class="history-item">${x}</button>`).join("")
);

const box=$("historyBox");
if(!box)return;

box.querySelectorAll("button")
.forEach(b=>{
b.onclick=()=>runSearch(b.textContent);
});

}

function showLoading(v){

if(typeof loading==="function")
loading(v);

}

function cleanupSearch(){

clearTimeout(window.searchTimer);
window.searchTimer = null;
window.searchData = null;

}
