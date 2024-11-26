const heading=document.getElementById("heading");
//heading through data.json
(async()=>{
    try{
        const response= await fetch("../data.json");
        const data=await response.json();
        heading.textContent=`${data.topic}`;
    }catch(error){
        console.log(error.message);
    }
} 
)();
document.addEventListener('DOMContentLoaded', () => {
    const nameElement = document.getElementById("name");
    const scoreElement = document.getElementById("score");
    const scoreContainer = document.getElementById("score-container");
    nameElement.textContent = localStorage.getItem("username");
    const totalScore = localStorage.getItem("score") || 0;
    scoreElement.textContent = totalScore;
    const scoreArray = JSON.parse(localStorage.getItem("scoreArray")) || [];
    scoreArray.forEach((score, index) => {
        const questionScoreElement = document.createElement("p");
        questionScoreElement.textContent = `Question ${index + 1} : ${score} points`;
        scoreContainer.appendChild(questionScoreElement);
    });
});
