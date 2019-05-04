const submitButton = document.querySelector('.submit-btn');
const modal = document.getElementById('id-modal');
const modalContent = document.querySelector('.modal-content');
const closeModalButton = document.querySelector('.close-button');
const listGroups = document.querySelector('.list-groups');
// add member
const newMemberEmail = document.getElementById('add-member-input');
const addNewMemberButton = document.querySelector('.submit-button');
// modal and create group notification function
const createGroupNotification = document.querySelector(
  '.create-group-notification'
);
const modalNotification = document.querySelector('.modal-notification');
const Notification = (type, message, status) => {
  const notify = type === 'modal' ? modalNotification : createGroupNotification;
  notify.textContent = message;
  notify.style.color = status == 'pass' ? 'green' : 'indianred';
  notify.style.display = 'block';
  setTimeout(() => {
    notify.style.display = 'none';
  }, 3000);
};

// header for sending requests
const url = 'https://intense-thicket-60071.herokuapp.com/api/v1/groups';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

// modal for displaying feedback
const toggleModal = () => {
  modal.classList.toggle('show-modal');
};

const removeMember = (userId) => {
  fetch(`${url}/${localStorage.getItem('groupid')}/users/${userId}`, {
    method: 'DELETE',
    headers,
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.status == 'failed') {
        Notification('modal', res.error, 'failed');
      }
      if (res.status == 'success') {
        Notification('modal', res.data.message, 'pass');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    })
    .catch((error) => console.log(error));
};

// function to enable double click to work on mobile for javascript
// source https://stackoverflow.com/questions/8825144/detect-double-tap-on-ipad-or-iphone-screen-using-javascript/15816496#15816496
let clickTimer = null;

const touchStart = (memberid) => {
  if (clickTimer == null) {
    clickTimer = setTimeout(() => {
      clickTimer = null;
    }, 500);
  } else {
    clearTimeout(clickTimer);
    clickTimer = null;
    removeMember(memberid);
  }
};

const deleteGroupButton = document.getElementById('delete-group');

const TriggerRemoveGroup = () => {
  // the text content of the delete group button wil change
  deleteGroupButton.textContent = 'Yes';
  // so will the id
  deleteGroupButton.setAttribute('id', 'confirm-delete-group');
  Notification('modal', 'Are you sure to delete group?', 'failed');
  // get group id
  const groupid = localStorage.getItem('groupid');
  // get the yes confirmation button
  const confirmDelete = document.getElementById('confirm-delete-group');

  // if closeModalButton is clicked. then it ahould return the delete button
  closeModalButton.addEventListener('click', () => {
    deleteGroupButton.textContent = 'Delete group';
    deleteGroupButton.setAttribute('id', 'delete-group');
    confirmDelete.removeEventListener('click', removeGroup);
  });
  // remove group function to be triggered when yes is clicked
  const removeGroup = () => {
    fetch(`${url}/${groupid}`, {
      method: 'DELETE',
      headers,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status == 'failed') {
          Notification('modal', res.error, 'failed');
        }
        if (res.status == 'success') {
          Notification('modal', res.data.message, 'pass');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((error) => console.log(error));
  };
  confirmDelete.addEventListener('click', removeGroup);
};

// get members of a group
const getGroupMemebers = (e) => {
  const groupid = e.target.dataset.id;
  localStorage.setItem('groupid', groupid);
  fetch(`${url}/${groupid}/members`, {
    method: 'GET',
    headers,
  })
    .then((response) => response.json())
    .then((res) => {
      // remove previous list
      if (document.getElementById('ul-members')) {
        document.getElementById('ul-members').remove();
      }
      const ul = document.createElement('ul');
      ul.setAttribute('id', 'ul-members');
      res.data.forEach((member) => {
        const li = document.createElement('li');
        li.dataset.id = member.id;
        li.setAttribute('class', 'members-list');
        li.textContent = `${member.firstname} ${member.lastname}`;
        li.addEventListener('click', () => touchStart(li.dataset.id));
        ul.appendChild(li);
      });
      modalContent.appendChild(ul);
      toggleModal();
    })
    .catch((error) => console.log(error));
};
// create a group
const createGroup = (e) => {
  const groupName = document.getElementById('groupname').value;
  const data = JSON.stringify({
    name: groupName.toLowerCase(),
  });
  e.preventDefault();
  if (groupName.length < 2) {
    Notification(
      'group',
      'Group name should be at least 2 characters long',
      'failed'
    );
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
        Notification('group', `Error! ${res.error}`, 'failed');
      }
      if (res.status === 'success') {
        document.getElementById('groupname').value = '';
        window.location.reload();
      }
    })
    .catch((error) => console.log(error));
};

// add member to a group
const addMember = (e) => {
  e.preventDefault();
  const emailCheck = /\S+@\S+\.\S+/;

  if (emailCheck.test(newMemberEmail.value) == false) {
    Notification('modal', 'Add a valid user email to the form', 'failed');
    return;
  }
  const groupid = localStorage.getItem('groupid');
  fetch(`${url}/${groupid}/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: newMemberEmail.value,
    }),
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.status == 'failed') {
        Notification('modal', res.error, 'failed');
      }
      if (res.status == 'success') {
        Notification('modal', 'User addedd successfully', 'pass');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    })
    .catch((error) => console.log(error));
};

// fetch groups
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
        li.textContent = `@${group.name}`;
        li.dataset.id = group.id;
        li.addEventListener('click', getGroupMemebers);
        ul.appendChild(li);
      });
      listGroups.appendChild(ul);
    }
  })
  .catch((error) => console.log(error));

submitButton.addEventListener('click', createGroup);
deleteGroupButton.addEventListener('click', TriggerRemoveGroup);
addNewMemberButton.addEventListener('click', addMember);
closeModalButton.addEventListener('click', toggleModal);