document.addEventListener("DOMContentLoaded", () => {

    const cartItems = document.getElementById("cartItems");
    const checkoutBtn = document.getElementById("summary");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    renderCart();

    function renderCart() {

        cartItems.innerHTML = "";

        let grandTotal = 0;

        if (cart.length === 0) {

              cartItems.innerHTML = `
                  <div class="empty-cart">
                    <h2>🛒 Your cart is empty</h2>
                    <p>Add some delicious chicken to get started!</p>
                 </div>
                `;
              checkoutBtn.style.display = "none";

              return;
}
        checkoutBtn.style.display = "block";
        console.log(cart)
        cart.forEach((item, index) => {

            const price = item.price
    

            const itemTotal = price * item.quantity;

            grandTotal += itemTotal;

            cartItems.innerHTML += `
            
                <div class="cart-item">

                    <img src="${item.image}" alt="${item.name}">

                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>${item.price} x ${item.quantity} kg</p>
                    </div>

                    <div class="quantity">

                        <button class="decrease"
                                data-index="${index}">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button class="increase"
                                data-index="${index}">
                            +
                        </button>

                    </div>

                    <div class="item-total">
                        ₹${itemTotal}
                    </div>

                </div>
            `;
        });


        checkoutBtn.innerHTML=`
           <h2>Total: ₹${grandTotal}</h2>
           <a href="checkout.html">
              <button class="checkout-btn">
                Proceed To Checkout
              </button>
           </a>
`;
        // totalElement.textContent =
        //     `Total: ₹${grandTotal}`;

        attachEvents();
    }

    function attachEvents() {

        const increaseButtons =
            document.querySelectorAll(".increase");

        const decreaseButtons =
            document.querySelectorAll(".decrease");

        increaseButtons.forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    button.dataset.index;
                    console.log(button.dataset)

                cart[index].quantity++;

                saveCart();
            });
        });

        decreaseButtons.forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    button.dataset.index;

                if (cart[index].quantity > 1) {

                    cart[index].quantity--;

                } else {

                    cart.splice(index, 1);
                }

                saveCart();
            });
        });
    }

    function saveCart() {

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        renderCart();
    }

});