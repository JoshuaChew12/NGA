async function initLogin(){

loginBtn.onclick=async()=>{

const username=loginUsername.value.trim();
const password=loginPassword.value.trim();

if(!username||!password){

loginMessage.innerHTML=
"Please enter username and password";

return;

}

loginBtn.disabled=true;
loginMessage.innerHTML="Checking...";

try{

const res=await loginAPI(username,password);

if(!res.success){

loginMessage.innerHTML=
res.message||"Login Failed";
loginBtn.disabled=false;
return;

}

// =====================
// SAVE SESSION
// =====================
localStorage.token=res.token;
localStorage.user=JSON.stringify(res);

// =====================
// GO HOME
// =====================
loginMessage.innerHTML="Login Success";

setTimeout(()=>{
loadPage("home");
},300);

}catch(err){

loginMessage.innerHTML="Network Error";

console.log(err);

}

loginBtn.disabled=false;

};


}
