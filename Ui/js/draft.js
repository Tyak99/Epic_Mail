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
    if (res.data.message) {
      const h2 = document.createElement('h2');
      h2.setAttribute('class', 'empty-inbox');
      h2.textContent = 'No Draft Messages';
      mainSection.appendChild(h2);
    }
  });
