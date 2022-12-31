// import axios from 'axios'
// const axios = require('axios');

const navToggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");

navToggle.addEventListener("click", () => {
    links.classList.toggle("show-links");
})

const submit_recipe = document.getElementById('submit-form-btn');
submit_recipe.addEventListener('click', function(e) {
    alert("Recipe Inserted Successfully!");

})

// smooth scroll
// const navbar = document.getElementById("nav");
// const linksContainer = document.querySelector(".links-container");
// const scrollLinks = document.querySelectorAll(".scroll-link");

// scrollLinks.forEach((link) => {
//     link.addEventListener("click", (e) => {
//         // prevent default
//         e.preventDefault();
//         // navigate to specific spot
//         const id = e.currentTarget.getAttribute("href").slice(1);
//         const element = document.getElementById(id);

//         const navHeight = navbar.getBoundingClientRect().height;
//         const containerHeight = linksContainer.getBoundingClientRect().height;
//         const fixedNav = navbar.classList.contains("fixed-nav");
//         let position = element.offsetTop - navHeight;

//         if (!fixedNav) {
//             position = position - navHeight;
//         }
//         if (navHeight > 82) {
//             position = position + containerHeight;
//         }

//         window.scrollTo({
//             left: 0,
//             top: position,
//         });
//         // close
//         linksContainer.style.height = 0;
//     });
// });

// Contact
let contact_btn = document.getElementById('contact-btn');

// contact_btn.addEventListener("click", () => {
//     Email.send({
//         Host : "smtp.gmail.com",
//         Username : "meri@gmail.com",
//         Password : "Meri@07",
//         To : 'misari0712@gmail.com',
//         From : '20ce029@charusat.edu.in',
//         Subject : "Contact Form Enquiry",
//         Body : "Body"
//     }).then(
//       message => {
//         if (message == 'OK') {
//             alert('Message Send Succesfully')
//         } else {
//             console.log(message);
//             alert('error');
//         }
//       }
//     );
// })

// "Name : " + document.getElementById('name').value
// + "<br>Email : " + document.getElementById('email').value
// + "<br>Message : " + document.getElementById('message').value

//  Submit food item
let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredeintDiv = document.querySelectorAll('.ingredeintDiv')[0];

addIngredientsBtn.addEventListener("click", () => {
    let newIngredients = ingredeintDiv.cloneNode(true);
    let input = newIngredients.getElementsByTagName('input')[0];
    input.value = '';
    ingredientList.appendChild(newIngredients);
});

