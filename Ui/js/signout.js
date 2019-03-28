const signoutButton = document.getElementById('signout');

const signout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  window.location.replace('./index.html');
};

signoutButton.addEventListener('click', signout);