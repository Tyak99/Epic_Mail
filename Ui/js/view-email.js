const threadGroup = document.querySelector('.thread-group');
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
    console.log(res);
    // const subjectDiv = document.createElement('div');
    // subjectDiv.setAttribute('class', 'subject');
    // const threadDiv = document.createElement('div');
    // threadDiv.setAttribute('class', 'thread');
    // const subjectItem = document.createElement('div');
    // subjectItem.setAttribute('class', 'subject-item');
    // const emailDate = document.createElement('div');
    // emailDate.setAttribute('class', 'email-date');
    // const icons = document.createElement('div');
    // icons.setAttribute('class', 'icons');
    // const h2 = document.createElement('h2');
    // const p = document.createElement('p');
    // const emailFrom = document.createElement('em');
    // const emailTo = document.createElement('em');
    // const span = document.createElement('span');

    // h2.textContent = res.data.subject;
    // subjectDiv.appendChild(h2);

    // // from and to of message
    // const fromTo = `From <em class = 'from'> ${
    //   res.data.senderid
    // } </em> to <em class = 'to'> ${res.data.receiverid} </em>`;
    // p.innerHTML = fromTo;
    // subjectItem.appendChild(p);

    // // email date
    // const emailDateStr = `<p style="color:grey">
    //   Mon, Jan 21, 6:08 PM
    // </p>`;
    // emailDate.innerHTML = emailDateStr;
    // subjectItem.appendChild(emailDate);
    // threadDiv.appendChild(subjectItem);
    // threadGroup.appendChild(subjectDiv);
    // threadGroup.appendChild(threadDiv);

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
              <a href="#">
                <span class="btn-delete">
                  <i class="fa fa-trash-alt"></i> Delete
                </span>
              </a>
            </div>
          </div>
          <div class="thread-body"> ${res.data.message}</div>`;

    threadGroup.innerHTML = tags;

    
  })
  .catch((error) => console.log(error));
