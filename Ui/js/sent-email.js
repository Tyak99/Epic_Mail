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
      element.nodeName === 'BUTTON' &&
      /btn-retract/.test(element.className)
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
})
  .then((response) => response.json())
  .then((res) => {
    if (res.data.message) {
      const h2 = document.createElement('h2');
      h2.setAttribute('class', 'empty-inbox');
      h2.textContent = 'No Sent Messages';
      mainSection.appendChild(h2);
    }
    const ul = document.createElement('ul');
    res.data.forEach((data) => {
      const li = document.createElement('li');
      li.dataset.id = data.id;
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      const span3 = document.createElement('span');
      const span4 = document.createElement('span');
      const button = document.createElement('button');
      span1.setAttribute('class', 'receiver');
      span2.setAttribute('class', 'subject');
      span3.setAttribute('class', 'body');
      span4.setAttribute('class', 'retract');
      button.setAttribute('class', 'btn-retract');
      span1.textContent = `To: ${data.receiverid}`;
      span2.textContent = `${data.subject} -`;
      // shorten message to 100 characters
      const shortendMessage = data.message.substring(0, 50);
      span3.textContent = `${shortendMessage}...`;
      button.textContent = 'Retract';
      span4.appendChild(button);
      li.appendChild(span1);
      li.appendChild(span2);
      li.appendChild(span3);
      li.appendChild(span4)
      ul.appendChild(li);
    });
    mainSection.appendChild(ul);
  });

document.addEventListener('click', handleClick);
modalCloseButton.addEventListener('click', toggleModal);
window.addEventListener('click', onClickWindow);
