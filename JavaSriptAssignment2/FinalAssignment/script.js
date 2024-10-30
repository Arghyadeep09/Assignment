let images = document.getElementsByClassName("image");
let displayedImage = document.getElementById("displayedImage");
let currentIndex = -1;

for (let i = 0; i < images.length; i++) {
    images[i].addEventListener("click", () => {
        currentIndex = i; 
        displayedImage.src = images[i].src; 
        displayedImage.style.display = "block"; 
    });
}

let prev = document.getElementById("prev");
let next = document.getElementById("next"); 

prev.addEventListener("click", () => { 
    currentIndex = (currentIndex - 1 + images.length) % images.length; 
    displayedImage.src = images[currentIndex].src; 
});

next.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length; 
    displayedImage.src = images[currentIndex].src; 
});
