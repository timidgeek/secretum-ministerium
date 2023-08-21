// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB_skrxky4yQylhGV6yNZ-ZM4sD0zNbtU8",
    authDomain: "secretum-ministerium.firebaseapp.com",
    projectId: "secretum-ministerium",
    storageBucket: "secretum-ministerium.appspot.com",
    messagingSenderId: "178498986571",
    appId: "1:178498986571:web:45af530d5417b921aaa3ce",
    measurementId: "G-B5PCK3FMDR"
  };

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

db.collection("Products").onSnapshot((querySnapshot) => {
    $('#products').empty();
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
        // insert function to create the card
        let spread = $(`
    <div class="card cards" style="width: 18rem;">
    <img 
      class="card-img-top" 
      src="${doc.data().image}"
      alt="Product picture" />
    <div class="card-body">
      <h5 class="card-title product-title">${doc.data().name}</h5>
      <p class="card-text product-body">${doc.data().description}</p>
      <div class="d-flex justify-content-between price-div">
        <h2 class="product-price">${doc.data().price}</h2>
        <a href="#" class="btn btn-primary">Add to cart</a>
      </div>
    </div>
  </div>
        `);
        $('#products').append(spread);
    });
});


// CONTACT US
$(document).ready(function() {
    // Contact form validation
    $('#contactForm').on('submit', function (event) {
        event.preventDefault();  // Prevent default form submission
        let isValid = true;

        // Name validation (alphanumeric and spaces only)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!$('#name').val().match(nameRegex)) {
            $('#name').addClass('is-invalid');
            isValid = false;
        } else {
            $('#name').removeClass('is-invalid');
        }

        // Email validation (using HTML5 email input validation)
        if (!$('#email')[0].checkValidity()) {
            $('#email').addClass('is-invalid');
            isValid = false;
        } else {
            $('#email').removeClass('is-invalid');
        }

        // Message validation (not empty)
        if (!$('#message').val().trim()) {
            $('#message').addClass('is-invalid');
            isValid = false;
        } else {
            $('#message').removeClass('is-invalid');
        }

        if (isValid) {
            // Submit the form or send AJAX request here
            alert('Form submitted successfully!');  // Just an alert for now
        }
    });
});
