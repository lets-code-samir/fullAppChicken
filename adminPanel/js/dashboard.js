function logout(){
    localStorage.removeItem("token");
    window.location.href="index.html";
}
   
document.getElementById('logout-btn').addEventListener('click',()=>{
    logout()
})

async function loadDashboard(){

    try{
        const token=localStorage.getItem('token')
        
        const response = await fetch(
            'https:/fullappchicken.onrender.com/admin/dashboard',{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        if(!response.ok){
            window.location.href="index.html"
            console.log('invalid user')
        }

        const data = await response.json();

        document.getElementById(
            'totalOrders'
        ).innerText = data.totalOrders;

        document.getElementById(
            'pendingOrders'
        ).innerText = data.pendingOrders;

        document.getElementById(
            'deliveredOrders'
        ).innerText = data.deliveredOrders;

        document.getElementById(
            'revenue'
        ).innerText = `₹${data.revenue}`;

        const recentOrders =
        document.getElementById('recentOrders');

        recentOrders.innerHTML = "";

        data.recentOrders.forEach(order => {

            recentOrders.innerHTML += `

            <div class="order">

                <div>
                    <strong>${order.customerName}</strong>
                    <br>
                    ${order.phone}
                </div>

                <div>
                    ₹${order.total}
                </div>

                <div class="
                    status
                    ${order.status === 'Pending'
                    ? 'pending'
                    : 'delivered'}
                ">
                    ${order.status}
                </div>

            </div>

            `;

        });

    }
    catch(err){

        console.log(err);

    }

}

loadDashboard();
