const modal = document.getElementById('id-modal');
const sendButton = document.querySelector('.btn-send');
const draftButton = document.querySelector('.btn-draft');
const closeModalButton = document.querySelector('.close-button');
const okayModalButton = document.querySelector('.yes-modal');
const emailTo = document.querySelector('.email-to');
const messageBody = document.getElementById('message-body');
const messageSubject = document.getElementById('message-subject');
const modalMessage = document.getElementById('modal-message');

function toggleModal(message) {
  modalMessage.innerHTML = message;
  modal.classList.toggle('show-modal');
}

// validate if user input email adress is an email format
const validateEmail = (data) => {
  const emailCheck = /\S+@\S+\.\S+/;
  return emailCheck.test(data);
};

const sendMessage = (e) => {
  e.preventDefault();
  if (emailTo.value == '') {
    toggleModal('Error! Add a receiver');
    return false;
  }
  if (validateEmail(emailTo.value) == false) {
    toggleModal('Invalid email address');
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
        toggleModal(`Error! ${res.error}`);
      }
      if (res.status === 'success') {
        messageSubject.value = '';
        messageBody.value = '';
        toggleModal('Sent successfully');
        
      }
    })
    .catch((error) => {
      toggleModal(error);
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
      if (res.status == 'failed') {
        toggleModal(`Error! ${res.error}`);
      }
      if (res.status === 'success') {
        toggleModal('Saved to draft');
      }
    })
    .catch((error) => {
      toggleModal(`Error! ${error}`);
    });
};

sendButton.addEventListener('click', sendMessage);
draftButton.addEventListener('click', saveDraft);
closeModalButton.addEventListener('click', toggleModal);
okayModalButton.addEventListener('click', toggleModal);
