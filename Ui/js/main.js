let navbar = document.getElementById("myNav");
let sidebar = document.getElementById("mySidebar");

const navbarFunction = () => {
  if (navbar.className == "nav") {
    navbar.className += " responsive";
  } else {
    navbar.className = "nav";
  }
};

const sidebarFunction = () => {
  if (sidebar.className == "aside-section") {
    sidebar.className += " responsive";
  } else {
    sidebar.className = "aside-section";
  }
};
