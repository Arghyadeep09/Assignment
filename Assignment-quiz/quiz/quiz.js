const heading = document.getElementById("heading"); 
let questionNumber = document.getElementById("no");
let options = document.getElementsByClassName("options"); 
let timer = document.getElementById("minutes"); 
let check = document.getElementById("check");
let next = document.getElementById("next"); 
let question = null;
let choices = [];
let correctAnswer = null;
let Score = null;
let data = null;
let currentQuestion = 0;
let currentScore = 0;
let selectedOption = null; 
let selectedOptionindex = null;
let scoreArray = [];
let countdown;
let time = 60;
let svg=null;

document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        try {
            const response = await fetch("../data.json");
            data = await response.json();
            heading.textContent = `${data.topic}`; 
            loadQuestion();
        } catch (error) {
            console.log(error.message);
        }
    })();  

    const name = document.getElementById("name");
    name.textContent = localStorage.getItem("username"); 
    const score = document.getElementById("score");
    score.textContent = localStorage.getItem("score") || 0;

    // Timer logic
    resetTimer();
});
function resetTimer() {
    // Clear any existing timer to prevent multiple intervals
    clearInterval(countdown);
 time=60;// Set the timer to 60 seconds

    countdown = setInterval(() => { 
        let min = Math.floor(time / 60);
        let sec = time % 60; 
        timer.innerText = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

        if (time === 0) { 
            // Time is up, automatically move to the next question
             // Store current score
            const scoreElement = document.getElementById("score");
            scoreElement.textContent = currentScore; // Update displayed score
            currentQuestion++; 
            scoreArray.push(0);
            loadQuestion(); // Load the next question
        } else {
            time--; // Decrement the timer
        }
    }, 1000); // Update every second
}

function loadQuestion() {
    if (currentQuestion < data.questions.length) {
        question = data.questions[currentQuestion].question;
        choices = data.questions[currentQuestion].choices;
        correctAnswer = data.questions[currentQuestion].correctAnswer; 
        Score = data.questions[currentQuestion].score; 
        setQuestion();
        selectOption();
        resetTimer(); 
    } else {
        endQuiz(scoreArray); // Pass the scoreArray to endQuiz
    }
}

function setQuestion() {
    questionNumber.textContent = currentQuestion + 1; 
    document.getElementById("question").querySelector("p").textContent = question;

    const optionsContainer = document.getElementById("option-container");
    optionsContainer.innerHTML = ""; 
    choices.forEach((choice, index) => {
        const correctAnswerElement = document.createElement("div");
        const choiceElement = document.createElement('div');
        choiceElement.setAttribute("class", "options"); 
        choiceElement.textContent = choice; 
        correctAnswerElement.appendChild(choiceElement);
        selectOption();  
      // Create the SVG element
        if (index === correctAnswer) { 
            correctAnswerElement.setAttribute("class","correctChoice");
        const svgNamespace = "http://www.w3.org/2000/svg";
        svg = document.createElementNS(svgNamespace, "svg");
        svg.setAttribute("width", "25");
        svg.setAttribute("height", "25");
        svg.setAttribute("viewBox", "0 0 40 35");
        svg.setAttribute("fill", "none");
        const path = document.createElementNS(svgNamespace, "path");
        path.setAttribute("d", "M17.5 0C7.8575 0 0 7.8575 0 17.5C0 27.1425 7.8575 35 17.5 35C27.1425 35 35 27.1425 35 17.5C35 7.8575 27.1425 0 17.5 0ZM25.865 13.475L15.9425 23.3975C15.6975 23.6425 15.365 23.7825 15.015 23.7825C14.665 23.7825 14.3325 23.6425 14.0875 23.3975L9.135 18.445C8.6275 17.9375 8.6275 17.0975 9.135 16.59C9.6425 16.0825 10.4825 16.0825 10.99 16.59L15.015 20.615L24.01 11.62C24.5175 11.1125 25.3575 11.1125 25.865 11.62C26.3725 12.1275 26.3725 12.95 25.865 13.475Z");
        path.setAttribute("fill", "#05732A");
        svg.appendChild(path); 
        correctAnswerElement.appendChild(svg);
        svg.style.display = "none"; // Initially hide the SVG 
        // correctAnswerElement.style.display="flex"; 
        // correctAnswerElement.style.gap=`15px`
        // correctAnswerElement.style.alignItems="center";
    }
    // Append the choice element to the options container
    optionsContainer.appendChild(correctAnswerElement);
});
}

function selectOption() {
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener("click", () => {  
            for (let opt of options) {
                opt.style.border = "none";
            }
            options[i].style.border = "2px solid #0077FF";
            selectedOption = options[i].innerHTML;  
            options[i].setAttribute("id", "selected-option");
            selectedOptionindex = i ; 
            console.log(selectedOption);
        });
    }
}

check.addEventListener("click", () => {  
   
    if (selectedOption === null) { 
        alert("Please select an option");
    } else {
        check.style.display = "none"; 
        next.style.display = "block"; 
        disableOptions(); 
        clearInterval(countdown); 
        document.getElementById("option-container").children[selectedOptionindex].style.border="none";
        checkAnswer(); 
        svg.style.display="block";
    }
});  

function checkAnswer() { 
   // console.log(correctAnswer); 

    if (selectedOptionindex === correctAnswer) { 
        document.getElementById("option-container").children[selectedOptionindex].children[0].style.backgroundColor ="#CDF8C9"; 
        document.getElementById("option-container").children[selectedOptionindex].children[0].style.border="none";// Highlight correct option
        currentScore += Score; 
        scoreArray.push(Score); // Push the score for this question into the array
        document.getElementById("answer").innerHTML = `<p><span style="color:green">Correct Answer</span>, please click on next</p>`;
    } else {
        document.getElementById("option-container").children[selectedOptionindex].children[0].style.backgroundColor ="#F8C9C9"; // Highlight incorrect option
        document.getElementById("option-container").children[selectedOptionindex].children[0].style.border="none";
        document.getElementById("answer").innerHTML = `<p><span style="color:red">Incorrect Answer</span>, click on next</p>`;
        scoreArray.push(0); // Push a score of 0 for an incorrect answer
    } 
    console.log(scoreArray);
    
    localStorage.setItem("score", currentScore);
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = currentScore;
}
function disableOptions() {
    let options = document.getElementsByClassName("options");
    for (let option of options) {
        option.style.pointerEvents = "none";
    }
} 

function enableOptions() {
    let options = document.getElementsByClassName("options");
    for (let option of options) {
        option.style.pointerEvents = "auto";
        option.style.border = "none";
    }
}

next.addEventListener("click", () => { 
    currentQuestion++;
    loadQuestion();
    next.style.display = "none";
    check.style.display = "block"; 
    selectedOption = null; 
    selectedOptionindex = null;  
    enableOptions();
    document.getElementById("answer").innerHTML = ""; 
});

function endQuiz(scoreArray) {
    // Optionally, store the scoreArray in local storage or use it as needed
    localStorage.setItem("scoreArray", JSON.stringify(scoreArray)); // Store the score array
    window.location.href = "../Last/Last.html"; 
}
