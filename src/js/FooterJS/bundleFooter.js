//import your JS here
import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import 'popper.js'
import 'bootstrap';

import AOS from 'aos';

AOS.init({
    duration: 1000,
    easing: 'ease-out-sine',
    delay: 100,
  });


var navBtn = document.getElementById("nav__button");
var mobileNav = document.getElementById("mobile-nav");
navBtn.onclick = function (e) {

    navBtn.classList.toggle("active");
    mobileNav.classList.toggle("active");
}

var navLink = document.getElementById("nav-link");
$('.nav-link').click(function(){

    navBtn.classList.toggle("active");
    mobileNav.classList.toggle("active");
    console.log("klick");
});

console.log("load");




// NAVBAR
// When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {

    var currentScrollPos = window.pageYOffset;
    if (currentScrollPos <= (5)) {
        $("#nav").removeClass("fixed");
    }
    else {
        $("#nav").addClass("fixed");
        prevScrollpos = currentScrollPos;
    }
}



