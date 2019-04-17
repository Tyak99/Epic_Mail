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
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
