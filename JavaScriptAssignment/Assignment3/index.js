// console.log(
//  1+4/7*(1>2?3:4)-0.67); 
//  '0'==0//true
//  '0 '===0//false
//  '0'!=0//false
//  ""!==0//false 
//  let p=8;
//  if(0==0&& p=9){
//     console.log("true");
//  }
//  else{
//     console.log("false");
//  }  

let a,b; 
function run(){
    a=prompt("enter the value of a"); 
    a=Number(a);
  
} 
function run2(){  b=prompt("enter the value of b");  
    b=Number(b); 
    execute(a,b);
} 
function execute(){
console.log("a+b=",a+b);
console.log("a-b=",a-b);
console.log("a*b=",a*b);
console.log("a/b=",a/b);
console.log("a**b=",a**b);
}
