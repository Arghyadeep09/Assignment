

// function add( a, b) {
//     return a+b;

// }; 
// function length(a){
//     return a.length;
// } 
// function parity(a){
//     a%2==0?console.log("even"):console.log("odd");
// } 
// parity(0);
// length("anshu");
// add(2,3);

 
function check(){
let input = Number(prompt("Enter the year of birth:")); 
const para=document.createElement("p"); 
para.textContent=`Age: ${age(input)}`;
document.querySelector("body").appendChild(para);

function age(input) {
    
    const currentYear = new Date().getFullYear();
    
    return currentYear - input;
}
}
