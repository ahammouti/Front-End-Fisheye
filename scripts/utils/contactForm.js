const MIN_CHAR_FIRST_LAST_NAME = 2; // Minimum of characters allowed
const MIN_CHAR_MSG_CONTACT = 10; // Minimum of characters allowed

/* ========================== Dom elements ========================== */
// Modal Form // 
const modalBtn = document.querySelector(".js-btnContact");
const modalbg = document.querySelector(".bground");
const modalThanks = document.querySelector("#modal-thanks");
const contentModalThanks = document.querySelector(".content");
const modalBody = document.querySelector(".modal-body");
const closeBtn = document.querySelector(".close");
const redBtnClose = document.querySelector(".btn-close");

// form
const form = document.querySelector(".form");

// inputs
const firstName = document.querySelector("#first");
const lastName = document.querySelector("#last");
const email = document.querySelector("#email");
const msgContact = document.querySelector("#msg-contact");

// errors inputs
const errFirst = document.querySelector("#err-first-name");
const errLast = document.querySelector("#err-last-name");
const errorEmail = document.querySelector("#err-email");
const errMsg = document.querySelector("#err-msg");

/* ==================================================== functions ==================================================== */
// launch modal form
function launchModal() {
    modalbg.style.display = "flex";
    const focusableElements = ".close, input, [tabindex]:not([tabindex='-1'])";
    const modal = document.querySelector(".js-dialog");

    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    firstFocusableElement.focus();
    window.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
            hideModal();
        }
    });
}

// hide modal form
function hideModal() {
    modalbg.style.display = "none";
}

function checkInputs() {
    // if the verification of all inputs is true, display modal thanks
    if (
        errorCheckLength(firstName, errFirst, MIN_CHAR_FIRST_LAST_NAME) &&
        errorCheckLength(lastName, errLast, MIN_CHAR_FIRST_LAST_NAME) &&
        checkEmail() &&
        errorCheckLength(msgContact, errMsg, MIN_CHAR_MSG_CONTACT)
    ) {
        form.style.display = "none";
        modalThanks.style.display = "block";
        modalThanks.classList.add("modal-thanks");
        modalBody.classList.add("js-modalBody");
        modalbg.classList.add("js-modalBg");
        contentModalThanks.classList.add("js-contentModalThanks");
        setTimeout(() => {
            hideModal();
            modalBody.classList.remove("js-modalBody");
            modalbg.classList.remove("js-modalBg");
            contentModalThanks.classList.remove("js-contentModalThanks");
            modalThanks.style.display = "none";
            form.style.display = "flex";
        }, 2500);

        // capture of data of form and show it in the console.
        console.log("====================================");
        console.log("Prénom: ", firstName.value);
        console.log("====================================");
        console.log("Nom: ", lastName.value);
        console.log("====================================");
        console.log("email: ", email.value);
        console.log("====================================");
        console.log("message: ", msgContact.value);
    }


    // check length of characters & add msg err
    function errorCheckLength(inputName, id, minLenght) {
        if (inputName.value.trim().length < minLenght) {
            id.classList.add("error-msg");
            inputName.classList.add("error");
            return false;
        }
        else {
            id.classList.remove("error-msg");
            inputName.classList.remove("error");
            return true;
        }
    }
    // name validation
    errorCheckLength(firstName, errFirst, MIN_CHAR_FIRST_LAST_NAME);
    errorCheckLength(lastName, errLast, MIN_CHAR_FIRST_LAST_NAME);
    errorCheckLength(msgContact, errMsg, MIN_CHAR_MSG_CONTACT);

    // email validation
    function checkEmail() {
        if (!validateEmail(email.value)) {
            errorEmail.classList.add("error-msg");
            email.classList.add("error");
            return false;
        }
        else {
            errorEmail.classList.remove("error-msg");
            email.classList.remove("error");
            return true;
        }
    }
    checkEmail();
}

function validateEmail(email) {
    let reg = /\S+@\S+\.\S+/;
    return reg.test(email);
}

/* ==================================================== main ==================================================== */

// launch modal event
modalBtn.addEventListener("click", launchModal);

// launch the close modal event
closeBtn.addEventListener("click", hideModal);
redBtnClose.addEventListener("click", hideModal);

// launch the check error func, onchange event
form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkInputs();
});