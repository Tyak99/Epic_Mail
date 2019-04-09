const ul = document.getElementById('unorderedList');

const url = 'http://localhost:3000/api/v1/messages/';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

fetch(url, {
  method: 'GET',
  headers,
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
