const heading=document.getElementById("heading");
const totalquestion=document.getElementById("total-question");
let totalscore=document.getElementById("total-score");
//heading through data.json
(async()=>{
    try{
        const response= await fetch("../data.json");
        const data=await response.json();
        heading.textContent=`${data.topic}`; 
        totalquestion.textContent=`${data.questions.length}`;
        totalscore.textContent = data.questions.reduce((sum, question) => sum + question.score, 0); 
        console.log(totalscore);
    }catch(error){
        console.log(error.message);
    }
} 
)();
// localStorage.setItem("username","anshu");
document.getElementById("start-btn").addEventListener("click",()=>{    
    const name=document.getElementById("fill").value;
    if(name==""){
        alert("please enter your name");
    }
    else { 
        localStorage.setItem("username",name); 
        localStorage.setItem("score",'0');
        localStorage.setItem("scoreArray", JSON.stringify([])); // Initialize scoreArray in local storage
        window.location.href = "../quiz/quiz.html";
    }
});
