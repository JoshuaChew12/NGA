/* =====================================
REGISTER V5
===================================== */
let registerLoading=false;


/* =====================================
INIT
===================================== */
async function initRegister(){

resetRegister();
await loadChurchList();

}

/* =====================================
LOAD CHURCH LIST
===================================== */
async function loadChurchList(){

const select=document.getElementById("registerChurch");
if(!select)return;

select.innerHTML=`
<option value="">
Loading...
</option>
`;

try{

const res=await getChurchListAPI();
console.log("church list:",res);
if(res.success&&res.data?.length){

select.innerHTML=`
<option value="">
Select Church
</option>
`;

res.data.forEach(c=>{

select.innerHTML+=`
<option value="${c.id}">
${c.name||c.id}
</option>
`;

});

return;

}

}catch(e){console.log(e);}

select.innerHTML=`
<option value="">
No Church Available
</option>
`;

}

/* =====================================
SUBMIT REGISTER
===================================== */
async function submitRegister(){

if(registerLoading)return;

const church=registerChurch.value.trim();
const chineseName=registerCN.value.trim();
const englishName=registerEN.value.trim();
const email=registerEmail.value.trim();
const phone=registerPhone.value.trim();
const address=registerAddress.value.trim();

if(!church||!englishName){
showRegisterMessage("Please fill required fields");
return;
}

registerLoading=true;
setRegisterButton(true);

try{

const res=await apiGet("register",{
church,
chineseName,
englishName,
email,
phone,
address
});

if(!res.success){
showRegisterMessage(res.message||"Registration Failed");
return;
}

showRegisterResult(res);
clearRegisterForm();

}catch(err){

console.error(err);
showRegisterMessage("Server Error");

}finally{

registerLoading=false;
setRegisterButton(false);

}

}

/* =====================================
SHOW RESULT
===================================== */
function showRegisterResult(res){

const box=document.getElementById("registerResult");
if(!box)return;

box.style.display="block";

resultMemberID.innerText=res.memberID||"";
resultQR.src=res.qr||"";

if(res.wa){
resultWA.href=res.wa;
resultWA.style.display="inline-flex";
}else{resultWA.style.display="none";}

if(res.pdf){
resultPDF.href=res.pdf;
resultPDF.style.display="inline-flex";
}else{resultPDF.style.display="none";}

showRegisterMessage("Registration completed");

box.scrollIntoView({behavior:"smooth"});

}

/* =====================================
BUTTON STATE
===================================== */
function setRegisterButton(lock){

const btn=document.querySelector(".register-btn");
const text=document.getElementById("registerBtnText");
if(!btn||!text)return;

if(lock){

btn.disabled=true;
text.innerHTML="CREATING...";

}else{

btn.disabled=false;
text.innerHTML="CREATE MEMBER";

}

}

/* =====================================
MESSAGE
===================================== */
function showRegisterMessage(msg){

const el=document.getElementById("registerMessage");
if(el)el.innerText=msg;

}

/* =====================================
RESET
===================================== */
function resetRegister(){

const result=document.getElementById("registerResult");
if(result)result.style.display="none";

const msg=document.getElementById("registerMessage");
if(msg)msg.innerText="";

}

/* =====================================
CLEAR FORM
===================================== */
function clearRegisterForm(){

registerCN.value="";
registerEN.value="";
registerEmail.value="";
registerPhone.value="";
registerAddress.value="";

}
