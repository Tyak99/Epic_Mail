const modal = document.getElementById('id-modal');
const sendButton = document.querySelector('.btn-send');
const draftButton = document.querySelector('.btn-draft');
const closeModalButton = document.querySelector('.close-button');
const okayModalButton = document.querySelector('.yes-modal');
const emailTo = document.querySelector('.email-to');
const messageBody = document.getElementById('message-body');
const messageSubject = document.getElementById('message-subject');
const modalMessage = document.getElementById('modal-message');

function toggleModal(e, message) {
  modal.classList.toggle('show-modal');
}

const validateEmail = (data) => {
  const emailCheck = /\S+@\S+\.\S+/;
  return emailCheck.test(data);
};

const sendMessage = (e) => {
  e.preventDefault();
  if (emailTo.value == '') {
    toggleModal()
    return false;
  }
  if (validateEmail(emailTo.value) == false) {
    modalMessage.innerHTML = 'Invalid email address';
    toggleModal()
    return false;
  }
  const data = JSON.stringify({
    subject: messageSubject.value,
    message: messageBody.value,
    emailTo: emailTo.value,
  });

  const url = 'http://localhost:3000/api/v1/messages';

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', localStorage.getItem('token'));

  fetch(url, {
    method: 'POST',
    body: data,
    headers,
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.status === 'failed') {
        modalMessage.innerHTML = res.error;
        modal.classList.toggle('show-modal');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const saveDraft = (e) => {
  e.preventDefault();
  const data = JSON.stringify({
    subject: messageSubject.value,
    message: messageBody.value,
  });
  const url = 'http://localhost:3000/api/v1/messages';

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('authorization', localStorage.getItem('token'));

  fetch(url, {
    method: 'POST',
    body: data,
    headers,
  })
    .then((response) => response.json())
    .then((res) => console.log(res))
    .catch((error) => {
      console.log(error);
    });
};

sendButton.addEventListener('click', sendMessage);
draftButton.addEventListener('click', saveDraft);
closeModalButton.addEventListener('click', toggleModal);
okayModalButton.addEventListener('click', toggleModal);
