

document.addEventListener("DOMContentLoaded", () => {

    const orderItems = document.getElementById("orderItems");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    let total = 0;

    orderItems.innerHTML = "";
    
    let FinaliseOrder=
    cart.forEach(item => {

        const price =item.price;
        const itemTotal = price * item.quantity;

        total += itemTotal;

        orderItems.innerHTML += `
            <div class="item">
                <span>${item.name} price(${item.price})  x${item.quantity}</span>
                <span>₹${itemTotal}</span>
            </div>
        `;
    });

    subtotalElement.textContent = `₹${total}`;
    // totalElement.textContent = `₹${subtotal }`;


    // this is to remove image from cart and manage data according to schema 
    const itemsForDB = cart.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity
     }));

    document
        .getElementById("placeOrderBtn")
        .addEventListener("click",async () => {

            if (itemsForDB.length==0){
                alert('Your cart is empty. Please add items before placing an order')
                return
            }

            const name =
                document.getElementById("name").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const address =
                document.getElementById("address").value.trim();

            const landmark =
                document.getElementById("landmark").value.trim();

            if (!name || !phone || !address) {
                alert("Please fill all required fields");
                return;
            }

            const order = {
                customerName: name,
                phone: phone,
                address: address,
                landmark: landmark,
                items:itemsForDB,
                total: total,
                status: "Pending",
                orderDate: new Date().toISOString()
            };

          
            try{
                console.log('clicked')
                let requestToServer= await fetch("http://localhost:5000/orders",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(order)
            })
                let responseFromServer= await requestToServer.text()
                
                if (!requestToServer.ok) {
                        throw new Error("Order failed");
                    }
                localStorage.removeItem("cart");

                const card = document.getElementById("successCard");
                card.classList.add("show");

                document.getElementById("successSound").play();

                setTimeout(() => {
                window.location.href = "home.html";
                 },3000)
            }
            catch(err){
                console.log(err)
            }

            
        });

});