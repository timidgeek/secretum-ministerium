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

function addToCart(event, productId) {
    event.preventDefault();  // prevent default action
    // Retrieve the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product already in cart, if yes increase the quantity, if no add the new product
    let foundProduct = cart.find(item => item.productId === productId);
    if (foundProduct) {
        foundProduct.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }

    // Store the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(event, productId) {
    event.preventDefault();  // prevent default action
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let newCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(newCart));
    displayCart(); // Update the display
}

// Function to update quantity
function updateQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity = parseInt(quantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart(); // Update the display
    }
}

// Display cart
function displayCart() {
    $('#cartDisplay').html(''); // Clear the existing cart display
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    // Create the table structure
    $('#cartDisplay').append(`
      <div id="productContainer" class="container-sm py-5">
        <table id="productTable" class="w-100">
          <tr class="bg-danger text-white">
            <th class="p-2 text-start">Product</th>
            <th class="p-2">Quantity</th>
            <th class="p-2 text-end">Subtotal</th>
          </tr>
        </table>
      </div>
    `);

    let promises = []; // An array to hold all promises

    // Iterate through the cart items
    cart.forEach(item => {
      let p = db.collection("Products").doc(item.productId).get().then(doc => {
        if (doc.exists) {
          let product = doc.data();
          let itemPrice = product.price * item.quantity;
          totalPrice += itemPrice;

          // Add cart item to the table
          $('#productTable').append(`
            <tr>
              <td class="p-3">
                <div class="d-flex flex-wrap">
                  <img src="${product.image}" class="me-2" style="width: 80px; height: 80px;">
                  <div>
                    <p class="mb-0 text-white">${product.name}</p>
                    <small class="text-muted">$${product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}</small>
                    <br>
                    <a href="#" class="text-danger small" onclick="removeFromCart(event, '${item.productId}')">Remove</a>
                  </div>
                </div>
              </td>
              <td class="p-3">
                <input type="number" class="w-25 p-1" value="${item.quantity}" onchange="updateQuantity('${item.productId}', this.value)">
              </td>
              <td class="p-3 text-end text-white">$${itemPrice ? parseFloat(itemPrice).toFixed(2) : 'N/A'}</td>
            </tr>
          `);
        }
      });

      promises.push(p); // Push the promise into the array
    });

    // Only append the total after all promises have resolved
    Promise.all(promises).then(() => {
        $('#productContainer').append(`
          <div class="d-flex justify-content-end pt-5">
            <button class="btn btn-primary rounded-pill text-uppercase px-4 py-3 mx-4 align-self-center">Checkout</button>
            <table id="totalPriceTable" class="w-100 text-white" style="max-width: 400px;">
              <tr class="border-top border-3 sub-border">
                <td>Subtotal</td>
                <td class="text-end text-white">$${totalPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Tax</td>
                <td class="text-end">$0.00</td>
              </tr>
              <tr>
                <td>Total</td>
                <td class="text-end text-white"><span id="totalPrice">$${totalPrice.toFixed(2)}</span></td>
              </tr>
            </table>
          </div>
        `);
    });
}


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
      <div class="d-flex justify-content-between mb-auto">
        <h2 class="product-price">$${doc.data().price}</h2>
        <a onclick="addToCart(event, '${doc.id}')" href="#" class="btn btn-primary">Add to cart</a>
      </div>
    </div>
  </div>
        `);
        $('#products').append(spread);
    });
});

$(document).ready(function() {
    if ($('#cartDisplay').length > 0) {
        displayCart();
    }
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
