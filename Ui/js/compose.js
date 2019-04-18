const modal = document.getElementById('id-modal');
const modalContent = document.querySelector('.modal-content');
const sendButton = document.querySelector('.btn-send');
const draftButton = document.querySelector('.btn-draft');
const closeModalButton = document.querySelector('.close-button');
const okayModalButton = document.querySelector('.yes-modal');
const receiver = document.querySelector('.email-to');
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

const sendMessage = () => {
  if (validateEmail(receiver.value) == false) {
    toggleModal(
      'Invalid email address or group name! To send to group use format @groupname',
      'failed'
    );
    return false;
  }
  const data = JSON.stringify({
    subject: messageSubject.value,
    message: messageBody.value,
    emailTo: receiver.value,
  });

  const url = 'https://intense-thicket-60071.herokuapp.com/api/v1/messages';

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

const sendMessageToGroup = () => {
  const data = JSON.stringify({
    subject: messageSubject.value,
    message: messageBody.value,
    groupTo: receiver.value.replace('@', ''),
  });

  const url =
    'https://intense-thicket-60071.herokuapp.com/api/v1/groups/messages';

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
  const url = 'https://intense-thicket-60071.herokuapp.com/api/v1/messages';

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

const initializeSendMessage = (e) => {
  e.preventDefault();
  if (receiver.value == '') {
    toggleModal(
      'Error! Add a receiver with a valid email or a group with format @groupname',
      'failed'
    );
    return false;
  }
  if (receiver.value[0] == '@') {
    sendMessageToGroup();
  } else {
    sendMessage();
  }
};
sendButton.addEventListener('click', initializeSendMessage);
draftButton.addEventListener('click', saveDraft);
closeModalButton.addEventListener('click', toggleModal);
okayModalButton.addEventListener('click', toggleModal);
