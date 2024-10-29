let submit = document.getElementById("submit");

submit.addEventListener("click", function(event) {
    event.preventDefault(); 

    let nam = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let text = document.getElementById("txt").value;

    let namePara = document.createElement("p");
    namePara.innerHTML = `Name: ${nam}`;
    document.body.appendChild(namePara);

    let emailPara = document.createElement("p");
    emailPara.innerHTML = `Email: ${email}`;
    document.body.appendChild(emailPara);

    let phonePara = document.createElement("p");
    phonePara.innerHTML = `Phone: ${phone}`;
    document.body.appendChild(phonePara);

    let textPara = document.createElement("p");
    textPara.innerHTML = `Message: ${text}`;
    document.body.appendChild(textPara);
});
