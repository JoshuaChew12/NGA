// =====================================
// FIREBASE REALTIME COUNTER
// =====================================
firebase.initializeApp({

databaseURL:
"https://nga-worship-default-rtdb.asia-southeast1.firebasedatabase.app/"

});

const firebaseDB=firebase.database();

function startFirebaseCounter(){

firebaseDB
.ref("count")
.on("value",snap=>{

set(
"checkCount",
snap.val()||0
);

});

}

function firebaseIncrement(){

firebaseDB
.ref("count")
.transaction(v=>(v||0)+1);

}
