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

