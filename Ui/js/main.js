var myNav = document.getElementById('myNav');

function myFunction() {
    if(myNav.className == 'nav') {
        myNav.className += ' responsive'
    } else {
        myNav.className = 'nav'
    }
}