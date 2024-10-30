import axios from "axios";

const result = async () => { 
    try { 
        const flagsContainer = document.getElementsByClassName('container'); 
        const response = await axios.get('https://restcountries.com/v3.1/all'); 
        response.data.forEach(element => {
            const flagImg = document.createElement('img');
            flagImg.src = element.flags.svg; 
            flagImg.alt = `${element.name.common} flag`; 
            flagsContainer.appendChild(flagImg); 
        });
    } catch (error) {
        console.log(error.message);
    } 
}

result();

