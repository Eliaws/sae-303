const select=document.querySelectorAll("[data-select]");

for(let i=0; i<select.length; i++){

    select[i].addEventListener("click",()=>{
        select.addClass="w3-bar-item w3-button w3-padding w3-blue";
        console.log("ok");
    });
}
