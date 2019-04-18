const threadGroup = document.querySelector('.thread-group');
const modalYesButton = document.querySelector('.yes-modal');
const messageId = localStorage.getItem('messageId');

const url = `https://intense-thicket-60071.herokuapp.com/api/v1/messages/${messageId}`;
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

fetch(url, {
  method: 'GET',
  headers,
})
  .then((response) => response.json())
  .then((res) => {
    const tags = `
    <div class="subject">
          <h2>${res.data.subject}</h2>
        </div>
            <div class="thread">
           <div class="subject-item">
            <p>
              From <em class="from">${res.data.senderid}</em> to
              <em class="to">${res.data.receiverid}</em>
            </p>
            <div class="email-date">
              <p style="color:grey">
                ${res.data.created_at}
              </p>
            </div>
            <div class="icons">
              <a href="./compose.html">
                <span class="reply"> <i class="fa fa-reply"></i> Reply </span>
              </a>
                <span class="btn-delete">
                  <i class="fa fa-trash-alt"></i> Delete
                </span>
            </div>
          </div>
          <div class="thread-body"> ${res.data.message}</div>`;

    threadGroup.innerHTML = tags;
  })
  .catch((error) => console.log(error));

const deleteMessage = () => {
  fetch(url, {
    method: 'DELETE',
    headers,
  })
    .then((response) => response.json())
    .then((res) => {
      window.history.back();
    })
    .catch((error) => {
      console.log(error);
    });
};
modalYesButton.addEventListener('click', deleteMessage);
