const modal = document.getElementById("id-modal");
const modalCloseButton = document.querySelector(".close-button");

const toggleModal = () => {
  modal.classList.toggle("show-modal");
};

const onClickWindow = event => {
  if (event.target === modal) {
    modal.classList.remove("show-modal");
  }
};

const handleClick = event => {
  let element = event.target;

  while (element) {
    if (
      element.nodeName === "BUTTON" &&
      /btn-delete/.test(element.className)
    ) {
      toggleModal();
      break;
    }

    element = element.parentNode;
    console.log(element);
  }
};

document.addEventListener("click", handleClick);
modalCloseButton.addEventListener("click", toggleModal);
window.addEventListener("click", onClickWindow);
