const resetButton = document.querySelector('.submit-btn');

// headers for sending requests
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

const resetPasswordUrl =
  'https://intense-thicket-60071.herokuapp.com/api/v1/auth/reset';

const resetPassword = (e) => {
  const resetEmail = document.getElementById('reset-email').value;
  const data = JSON.stringify({
    email: resetEmail,
  });
  e.preventDefault();
  fetch(resetPasswordUrl, {
    method: 'POST',
    body: data,
    headers,
  })
    .then((response) => response.json())
    .then((res) => {
      if ((res.status === 'success')) {
        console.log(res.data.message);
      }
    })
    .catch((error) => console.log(error));
};

resetButton.addEventListener('click', resetPassword);
