var myNav = document.getElementById('myNav');
var sidebar = document.getElementById('mySidebar');
function myFunction() {
    if(myNav.className == 'nav') {
        myNav.className += ' responsive'
    } else {
        myNav.className = 'nav'
    }
}

function sidebarFunction() {
    if(sidebar.className == 'aside-section') {
        sidebar.className += ' responsive'
    } else {
        sidebar.className = 'aside-section'
    }
}