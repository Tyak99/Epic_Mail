const signoutButton = document.getElementById('signout');

const signout = () => {
  localStorage.removeItem('token');
  window.location.replace('./index.html');
};

signoutButton.addEventListener('click', signout);