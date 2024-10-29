document.getElementById("addButton").addEventListener("click", function() {
    let val = document.getElementById("in").value; 
  
        let para = document.createElement("p");
        para.innerHTML = val;
        document.body.appendChild(para); 
        let del = document.createElement("button");
        del.innerHTML = "Delete"; 
        document.body.appendChild(del); 
        del.addEventListener("click", function() {
            para.remove();
            del.remove(); 
        });
    
});
