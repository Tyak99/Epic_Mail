const mainSection = document.querySelector('.main-section');


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
      h2.setAttribute('class', 'empty-outbox');
      h2.textContent = 'No Sent Messages';
      mainSection.appendChild(h2);
    }
    const ul = document.createElement('ul');
    res.data.forEach((data) => {
      const li = document.createElement('li');
      li.dataset.id = data.id;
      // a function to save the id to localstroge on click
      const saveIdToLocalStorage = () => {
        localStorage.setItem('messageId', li.dataset.id);
        localStorage.setItem('recepient', data.receiverid)
        localStorage.setItem('subject', data.subject)
        location.href = './view-email.html';
      };
      li.addEventListener('click', saveIdToLocalStorage);
      const span1 = document.createElement('span');
      const span2 = document.createElement('span');
      const span3 = document.createElement('span');
      const span4 = document.createElement('span');

      span1.setAttribute('class', 'receiver');
      span2.setAttribute('class', 'subject');
      span3.setAttribute('class', 'body');
      span1.textContent = `To: ${data.receiverid}`;
      span2.textContent = `${data.subject} -`;
      // shorten message to 100 characters
      const shortendMessage = data.message.substring(0, 50);
      span3.textContent = `${shortendMessage}...`;
      li.appendChild(span1);
      li.appendChild(span2);
      li.appendChild(span3);
      li.appendChild(span4);
      ul.appendChild(li);
    });
    mainSection.appendChild(ul);
  });
