const mainSection = document.querySelector('.main-section');

const url = 'http://localhost:3000/api/v1/messages/';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

fetch(url, {
  method: 'GET',
  headers,
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    if (data.data.message) {
      const h2 = document.createElement('h2');
      h2.setAttribute('class', 'empty-inbox');
      h2.textContent = ('No Received Messages');
      mainSection.appendChild(h2);
    }
  })
  .catch((error) => console.log(error));
