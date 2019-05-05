const resetButton = document.querySelector('.submit-btn');
const DivNotify = document.getElementById('notification');

const notify = (message, result) => {
  // add notification
  DivNotify.textContent = message;
  DivNotify.style.color = result === 'success' ? 'green' : 'red';
};
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
      if (res.status === 'success') {
        notify(
          'Your password reset email should arrive shortly. If you do not see it, please check your spam folder, sometimes it can end up there!',
          'success'
        );
      } else {
        notify(
          'Unable to send reset email link, kindly check that email address is correct',
          'failed'
        );
      }
    })
    .catch((error) => {
      notify('Unable to send reset email', 'failed');
    });
};

resetButton.addEventListener('click', resetPassword);
