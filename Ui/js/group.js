const submitButton = document.querySelector('.submit-btn');
const modal = document.getElementById('id-modal');
const modalContent = document.querySelector('.modal-content');
const modalMessage = document.getElementById('modal-message');
const closeModalButton = document.querySelector('.close-button');
const okayModalButton = document.querySelector('.yes-modal');
const listGroups = document.querySelector('.list-groups');

// modal for displaying feedback
const toggleModal = (message, result) => {
  modalMessage.innerHTML = message;
  modalContent.style.backgroundColor =
    result === 'success' ? '#388438' : '#d25353';
  modal.classList.toggle('show-modal');
};

const url = 'https://intense-thicket-60071.herokuapp.com/api/v1/groups';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

const createGroup = (e) => {
  const groupName = document.getElementById('groupname').value;
  const data = JSON.stringify({
    name: groupName.toLowerCase(),
  });
  e.preventDefault();
  if (groupName.length < 2) {
    toggleModal('group name should be at least 2 characters long', 'failed');
    return;
  }
  fetch(url, {
    method: 'POST',
    headers,
    body: data,
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.status == 'failed') {
        toggleModal(`Error! ${res.error}`, 'failed');
      }
      if (res.status === 'success') {
        // toggleModal('Group successfully created', 'success');
        document.getElementById('groupname').value = '';
        window.location.reload();
      }
    })
    .catch((error) => console.log(error));
};

fetch(url, {
  method: 'GET',
  headers,
})
  .then((response) => response.json())
  .then((res) => {
    if (res.data.message) {
      const h2 = document.createElement('h2');
      h2.setAttribute('class', 'no-groups');
      h2.textContent = 'No Groups';
      listGroups.appendChild(h2);
    }
    if (res.data.constructor === Array) {
      const ul = document.createElement('ul');
      res.data.forEach((group) => {
        const li = document.createElement('li');
        li.textContent = group.name;
        li.dataset.id = group.id;
        ul.appendChild(li);
      });
      listGroups.appendChild(ul);
    }
  })
  .catch((error) => console.log(error));

submitButton.addEventListener('click', createGroup);
closeModalButton.addEventListener('click', toggleModal);
okayModalButton.addEventListener('click', toggleModal);
