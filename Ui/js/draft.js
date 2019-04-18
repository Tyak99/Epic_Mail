const mainSection = document.querySelector('.main-section');

const url = 'https://intense-thicket-60071.herokuapp.com/api/v1/messages/draft';
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

    let tags = '<ul>';
    res.data.forEach((message) => {
      const shortendMessage = message.message.substring(0, 150);
      tags += `<li>
        <div class="message-header">
          <span class="status">Drafted at ${message.created_at}</span>
          <span class="subject"> ${message.subject} </span>
        </div>

        <p class="message-body">
          ${shortendMessage}...
        </p>
        <button class="btn btn-send">View</button>
        <button class="btn btn-delete">Delete</button>
      </li>`;
    });
    tags += '</ul>';
    mainSection.innerHTML = tags;
  });
