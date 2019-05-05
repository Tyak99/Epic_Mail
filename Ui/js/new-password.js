const savePasswordButton = document.getElementById('new-password');
const DivNotify = document.getElementById('notification');
const newPassword = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');

const notify = (message, result) => {
  // add notification
  DivNotify.textContent = message;
  DivNotify.style.color = result === 'success' ? 'green' : 'red';
};
// headers for sending requests
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('authorization', localStorage.getItem('token'));

const newPasswordUrl =
  'https://intense-thicket-60071.herokuapp.com/api/v1/auth/new-password;';

const savePassword = (e) => {
  e.preventDefault();
  // get the token from the url
  const location = window.location.href;
  const url = new URL(location);
  const token = url.searchParams.get('r');
  if (newPassword.value.length < 1) {
    notify('Input new password', 'failed');
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    notify('Passwords do not match', 'failed');
    return;
  }
  const data = JSON.stringify({
    password: newPassword.vaule,
    resetToken: token,
  });
  fetch(newPasswordUrl, {
    method: 'POST',
    body: data,
    headers,
  })
    .then((response) => response.json())
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
};

savePasswordButton.addEventListener('click', savePassword);
