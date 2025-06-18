const textInputs = document.querySelectorAll("input")
textInputs.forEach(textInputs => {
    textInputs.addEventListener("focus", () =>{
        let parent = textInputs.parentNode;
        parent.classList.add("active");    
    });
    textInputs.addEventListener("blur", () =>{
        let parent = textInputs.parentNode;
        parent.classList.remove("active");    
    });
});

const passwordInput = document.querySelector(".password-input");
const eyeBtn = document.querySelector(".eye-btn");

eyeBtn.addEventListener("click" , () => {
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        eyeBtn.innerHTML = '<i class="uil uil-eye"></i>';
    }
    else{
        passwordInput.type = "password";
        eyeBtn.innerHTML = '<i class="uil uil-eye-slash"></i>';
    }
});

const signUpbtn = document.querySelector(".sign-up-btn")
const signInbtn = document.querySelector(".sign-in-btn")
const signUpform = document.querySelector(".sign-up-form")
const signInform = document.querySelector(".sign-in-form")

signUpbtn.addEventListener("click", () =>{
    signInform.classList.add("hide");
    signUpform.classList.add("show");
    signInform.classList.remove("show");
});
signInbtn.addEventListener("click", () =>{
    signInform.classList.remove("hide");
    signUpform.classList.remove("show");
    signInform.classList.add("show");
});
