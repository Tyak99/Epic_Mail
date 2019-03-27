/* eslint-disable arrow-parens */
const submitButton = document.getElementById('submit');
const alert = document.getElementById('alert');

const setAlert = (message, result) => {
  alert.innerHTML = message;
  alert.style.backgroundColor = result == 'pass' ? 'green' : 'indianred';
};

const signup = (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const firstName = document.getElementById('firstname').value;
  const lastName = document.getElementById('lastname').value;
  if (firstName.length === 0 || lastName.length === 0 || password.length === 0) {
    setAlert('Please input all registration details', 'fail');
    return false;
  }
  if (password !== confirmPassword) {
    setAlert('Passwords do not match', 'fail');
    return false;
  }

  const url = 'http://localhost:3000/api/v1/auth/signup';
  const data = JSON.stringify({
    email,
    password,
    firstName,
    lastName,
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
        setAlert(response.error, 'fail');
        return false;
      }
      if (response.status == 'success') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        window.setTimeout(() => {
          location.href = './inbox.html';
        }, 3000);
      }
    })
    .catch((error) => {
      setAlert('User registration failed', 'fail');
    });
};

submitButton.addEventListener('click', signup);
