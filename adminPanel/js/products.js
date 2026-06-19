async function loadProducts() {

    const response =
        await fetch("http://localhost:5000/products");

    const products =
        await response.json();

    const table =
        document.getElementById("productTable");

    table.innerHTML = "";

    products.forEach(product => {

        table.innerHTML += `
            <tr>

                <td>${product.name}</td>

                <td>
                    ₹
                    <input
                        type="number"
                        value="${product.price}"
                        id="${product._id}"
                    >
                </td>

                <td>
                    <button
                        onclick="updatePrice('${product._id}')"
                    >
                        Save
                    </button>
                </td>

            </tr>
        `;
    });
}

loadProducts();

async function updatePrice(id) {

    const newPrice =
        document.getElementById(id).value;

    const response =
        await fetch(
            `http://localhost:5000/products/${id}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    price: Number(newPrice)
                })
            }
        );

    if(response.ok){
        alert("Price Updated");
    }
}