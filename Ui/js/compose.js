const modal = document.getElementById('id-modal');
const modalContent = document.querySelector('.modal-content');
const sendButton = document.querySelector('.btn-send');
const draftButton = document.querySelector('.btn-draft');
const closeModalButton = document.querySelector('.close-button');
const okayModalButton = document.querySelector('.yes-modal');
const emailTo = document.querySelector('.email-to');
const messageBody = document.getElementById('message-body');
const messageSubject = document.getElementById('message-subject');
const modalMessage = document.getElementById('modal-message');

const toggleModal = (message, result) => {
  modalMessage.innerHTML = message;
  modalContent.style.backgroundColor =
    result === 'success' ? '#388438' : '#d25353';
  modal.classList.toggle('show-modal');
};

// validate if user input email adress is an email format
const validateEmail = (data) => {
  const emailCheck = /\S+@\S+\.\S+/;
  return emailCheck.test(data);
};

const sendMessage = (e) => {
  e.preventDefault();
  if (emailTo.value == '') {
    toggleModal('Error! Add a receiver', 'failed');
    return false;
  }
  if (validateEmail(emailTo.value) == false) {
    toggleModal('Invalid email address', 'failed');
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
      if (!res.ok) {
        throw Error(`${res.error}`)
      }
      if (res.status === 'failed') {
        toggleModal(`Error! ${res.error}`, 'failed');
      }
      if (res.status === 'success') {
        messageSubject.value = '';
        messageBody.value = '';
        toggleModal('Sent successfully', 'success');
      }
    })
    .catch((error) => {
      toggleModal(error, 'failed');
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
    .then((res) => {
      if (!res.ok) {
        throw Error(`${res.error}`)
      }
      if (res.status == 'failed') {
        toggleModal(`Error! ${res.error}`, 'failed');
      }
      if (res.status === 'success') {
        toggleModal('Saved to draft', 'success');
      }
    })
    .catch((error) => {
      toggleModal(`${error}`, 'failed');
    });
};

sendButton.addEventListener('click', sendMessage);
draftButton.addEventListener('click', saveDraft);
closeModalButton.addEventListener('click', toggleModal);
okayModalButton.addEventListener('click', toggleModal);
