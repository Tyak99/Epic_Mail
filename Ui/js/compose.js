let modal = document.getElementById("id-modal");
let sendButton = document.querySelector(".btn-send");
let closeModalButton = document.querySelector(".close-button");
let okayModalButton = document.querySelector(".yes-modal")
let emailTo = document.querySelector(".email-to");

function toggleModal(e) {
  if (emailTo.value == "") {
    e.preventDefault();
    modal.classList.toggle("show-modal");
  }
}


sendButton.addEventListener("click", toggleModal);
closeModalButton.addEventListener("click", toggleModal);
okayModalButton.addEventListener('click', toggleModal)
