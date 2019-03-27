/* eslint-disable arrow-parens */
const signinButton = document.getElementById('signin');
const alert = document.getElementById('alert');

const setAlert = (message, result) => {
  alert.innerHTML = message;
  alert.style.backgroundColor = result == 'pass' ? 'green' : 'indianred';
};

const login = (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email.length == 0 || password.length == 0) {
    console.log('Please input login details');
    setAlert('Please input log in details', 'fail');
    return false;
  }
  const url = 'http://localhost:3000/api/v1/auth/login';
  const data = JSON.stringify({
    email,
    password,
  });
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  fetch(url, {
    method: 'POST',
    body: data,
    headers,
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status == 'failed') {
        console.log('oops');
        setAlert(response.error, 'fail');
        return false;
      }
      if (response.status == 'success') {
        console.log('o set');
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        window.setTimeout(() => {
          location.href = './inbox.html';
        }, 3000);
      }
    });
};

signinButton.addEventListener('click', login);
