// document.addEventListener("DOMContentLoaded", () => {

//     const cartCount = document.getElementById("cartCount");

//     updateCartCount();

//     const buttons = document.querySelectorAll(".addToCart");


//     buttons.forEach(button => {

//         button.addEventListener("click", () => {

//             const card = button.closest(".card");

//             const product = {
//                 name: card.querySelector("h3").innerText,
//                 price:parseInt(card.querySelector(".price").innerText.replace(/[^\d]/g, "")),
//                 image: card.querySelector("img").src,
//                 quantity: 1
//             };

//             console.log(product);

//             let cart = JSON.parse(localStorage.getItem("cart")) || [];

//             const existingProduct = cart.find(
//                 item => item.name === product.name
//             );

//             if (existingProduct) {
//                 existingProduct.quantity += 1;
//             } else {
//                 cart.push(product);
//             }

//             localStorage.setItem(
//                 "cart",
//                 JSON.stringify(cart)
//             );

//             updateCartCount();

//             alert(product.name + " added to cart!");
//         });
//     });
    
     
//     function updateCartCount() {

//         let cart = JSON.parse(localStorage.getItem("cart")) || [];

//         // let totalItems = cart.reduce(
//         //     (sum, item) => sum + item.quantity,
//         //     0
//         // );

//         cartCount.textContent = cart.length;
//     }

// });


async function loadProducts() {

    const response =
        await fetch("http://localhost:5000/products");

    const products =
        await response.json();

    const container =
        document.getElementById("productsContainer");

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
            <div class="card">

                <img src="${product.image}">

                <div class="card-content">

                    <h3>${product.name}</h3>

                    <div class="price">
                        ₹${product.price}/kg
                    </div>

                    <button class="addToCart"
                        data-id="${product._id}">
                        Add To Cart
                    </button>

                </div>

            </div>
        `;
    });

    attachCartEvents();
}

function attachCartEvents() {

    const buttons =
        document.querySelectorAll(".addToCart");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".card");

            const product = {

                name:
                    card.querySelector("h3").innerText,

                price:
                    parseInt(
                        card.querySelector(".price")
                        .innerText
                        .replace(/[^\d]/g, "")
                    ),

                image:
                    card.querySelector("img").src,

                quantity: 1
            };

            let cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];

            const existingProduct =
                cart.find(
                    item => item.name === product.name
                );

            if (existingProduct) {
                existingProduct.quantity++;
            }
            else {
                cart.push(product);
            }

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            updateCartCount();

            alert(product.name + " added to cart!");
        });
    });
}