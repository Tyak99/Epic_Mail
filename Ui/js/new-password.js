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

const newPasswordUrl =
  'https://intense-thicket-60071.herokuapp.com/api/v1/auth/new-password';

const savePassword = (e) => {
  e.preventDefault();
  // get the token from the url
  const location = window.location.href;
  const url = new URL(location);
  const token = url.searchParams.get('r');
  // check if token doesnt exist
  if (!token) {
    notify(
      'Reset Password token not available, kindly request for a password reset'
    );
    setTimeout(() => {
      window.location.replace('./reset-password.html');
    }, 3000);
    return;
  }
  // check if new password is not inputed
  if (newPassword.value.length < 1) {
    notify('Input new password', 'failed');
    return;
  }
  // check if new password and confirm password match
  if (newPassword.value !== confirmPassword.value) {
    notify('Passwords do not match', 'failed');
    return;
  }
  // data to be passed to backend
  const data = JSON.stringify({
    password: newPassword.value,
    resetToken: token,
  });
  fetch(newPasswordUrl, {
    method: 'POST',
    body: data,
    headers,
  })
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      if (res.status == 'success') {
        notify(res.data.message, 'success');
        setTimeout(() => {
          window.location.replace('./index.html');
        }, 3000);
      } else {
        notify(
          'Invalid reset password token, Kindly request for a password reset'
        );
        setTimeout(() => {
          window.location.replace('./reset-password.html');
        }, 3000);
      }
    })
    .catch((error) => {
      notify('Unable to update password, please try again', 'failed');
    });
};

savePasswordButton.addEventListener('click', savePassword);
