async function generate(){

const idea=document.getElementById("idea").value;

document.getElementById("result").innerHTML="Thinking...";

const response=await fetch("/.netlify/functions/generate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
idea
})
});

const data=await response.json();

document.getElementById("result").innerHTML=data.result;

}