const mainSection = document.querySelector('.main-section');
const modalYesButton = document.querySelector('.yes-modal');

const url = 'https://intense-thicket-60071.herokuapp.com/api/v1/messages/draft';
// const url = 'https://intense-thicket-60071.herokuapp.com/api/v1/messages/draft';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

fetch(url, {
  method: 'GET',
  headers,
})
  .then((response) => response.json())
  .then((res) => {
    console.log(res);
    if (res.data.message) {
      const h2 = document.createElement('h2');
      h2.setAttribute('class', 'empty-inbox');
      h2.textContent = 'No Draft Messages';
      mainSection.appendChild(h2);
    }
    const ul = document.createElement('ul');
    res.data.forEach((message) => {
      const shortendMessage = message.message.substring(0, 150);
      const li = document.createElement('li');
      li.dataset.id = message.id;
      const tags = `<div class="message-header">
          <span class="status">Drafted at ${message.created_at}</span>
          <span class="subject"> ${message.subject} </span>
        </div>

        <p class="message-body">
          ${shortendMessage}...
        </p>
        <button class="btn btn-send">View</button>
        <button class="btn btn-delete">Delete</button>`;
      li.innerHTML = tags;
      ul.appendChild(li);
      mainSection.appendChild(ul);
    });
  });

const deleteMessage = (messageId) => {
  fetch(
    `https://intense-thicket-60071.herokuapp.com/api/v1/messages/${messageId}`,
    {
      method: 'DELETE',
      headers,
    }
  )
    .then((response) => {
      response.json();
    })
    .then((res) => {
      if (res.status === 'success') {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// get the message id from when delete button is clicked
const getMessageId = (e) => {
  const element = e.target;
  if (
    (element.nodeName === 'BUTTON' || element.nodeName === 'SPAN') &&
    /btn-delete/.test(element.className)
  ) {
    console.log(element.parentNode.dataset.id);
    const messageId = element.parentNode.dataset.id;
    modalYesButton.addEventListener('click', () => deleteMessage(messageId));
  }
};

document.addEventListener('click', getMessageId);
