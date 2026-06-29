


async function loadProducts() {

    const response =
        await fetch("https://full-app-chicken-backend.onrender.com/products");

    const products =
        await response.json();

    const container =
        document.getElementById("productsContainer")


    container.addEventListener('click',(e)=>{
            if (e.target.classList.contains("addToCart")) {
                 addToCart(e)
    }})

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


}

loadProducts() 



function addToCart(e) {

    const button = e.target;
    const card = button.closest(".card");

    const product = {
        id: button.dataset.id,
        name: card.querySelector("h3").innerText,
        price: parseInt(card.querySelector(".price").innerText.replace(/[^\d]/g, "")),
        image: card.querySelector("img").src,
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount()

    
}

     
    function updateCartCount() {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // let totalItems = cart.reduce(
        //     (sum, item) => sum + item.quantity,
        //     0
        // );

        cartCount.textContent = cart.length;
    }

    updateCartCount()