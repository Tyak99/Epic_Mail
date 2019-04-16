const modal = document.getElementById('id-modal');
const modalCloseButton = document.querySelector('.close-button');
const mainSection = document.querySelector('.main-section');

const toggleModal = () => {
  modal.classList.toggle('show-modal');
};

const onClickWindow = (event) => {
  if (event.target === modal) {
    modal.classList.remove('show-modal');
  }
};

const handleClick = (event) => {
  let element = event.target;

  while (element) {
    if (
      element.nodeName === 'BUTTON'
      && /btn-retract/.test(element.className)
    ) {
      toggleModal();
      break;
    }

    element = element.parentNode;
  }
};


const url = 'https://intense-thicket-60071.herokuapp.com/api/v1/messages/sent';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

fetch(url, {
  method: 'GET',
  headers,
}).then(response => response.json()).then(res => console.log(res))

document.addEventListener('click', handleClick);
modalCloseButton.addEventListener('click', toggleModal);
window.addEventListener('click', onClickWindow);
