const modalBg = document.getElementById("modalBg")
const customModalBtn = document.getElementById("customModalBtn")

let isLoaded = false;

window.addEventListener("load", function(){
    if(!sessionStorage.getItem('pageVisited')){
        modalBg.classList.add('showModal')
        sessionStorage.setItem('pageVisited', true)
    }
})

customModalBtn.addEventListener("click", function(){
    modalBg.classList.remove("showModal")
})
