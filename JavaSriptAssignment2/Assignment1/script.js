let changecolor = document.getElementById("changecolor"); 
let div = document.getElementById("div1"); 

changecolor.addEventListener("click", () => { 
   div.style.backgroundColor=='black' ? div.style.backgroundColor='green' : div.style.backgroundColor='black';
}); 

let div2 = document.getElementById("div2");
let changetext = document.getElementById("changetext"); 
changetext.addEventListener("click", () => { 
    let para=document.getElementById("text");
    para.classList.toggle("paa"); 
}) 
let div3 = document.getElementById('div3');
let modify = document.getElementById("modify"); 
modify.addEventListener("click", () => {
    let para=document.getElementById("text2");
    para.textContent="Updated text";
})