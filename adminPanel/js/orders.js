async function loadOrders(){

    try{
        const token=localStorage.getItem("token")

        const response =await fetch("https://fullappchicken.onrender.com/orders",{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        const container =
        document.getElementById(
            "ordersContainer"
        );

        if(!response.ok){
            container.innerHTML= <p>" invalid user"</p>
            return
        }

        const orders =
        await response.json();


        container.innerHTML = "";

        orders.reverse().forEach(order=>{

            container.innerHTML += `

            <div class="order-card">

                <div class="top">

                    <h3>${order.customerName}</h3>

                    <span class="
                        status
                        ${order.status === 'Pending'
                        ? 'pending'
                        : 'delivered'}
                    ">
                        ${order.status}
                    </span>

                </div>

                <p><strong>Phone:</strong>
                ${order.phone}</p>

                <p><strong>Address:</strong>
                ${order.address}</p>

                <p><strong>Landmark:</strong>
                ${order.landmark || '-'}</p>

                <div class="items">

                    <h4>Items Ordered</h4>

                    ${
                        order.items.map(item=>`
                            <div class="item">
                                ${item.name}
                                × ${item.quantity}
                            </div>
                        `).join('')
                    }

                </div>

                <h2 class="total">
                    ₹${order.total}
                </h2>

                <div class="actions">

                    <button
                    class="deliver-btn"
                    onclick="updateStatus('${order._id}')">

                    Mark Delivered

                    </button>

                </div>

            </div>

            `;
        });

    }
    catch(err){
        console.log(err);
    }
   }

async function updateStatus(id, status) {
    await fetch(`https://fullappchicken.onrender.com/orders/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });

    loadOrders();
}

 loadOrders();

 module.exports=loadOrders;