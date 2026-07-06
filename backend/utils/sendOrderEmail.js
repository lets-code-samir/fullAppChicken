const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderEmail(order) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: process.env.ADMIN_EMAIL,
    subject: "🐔 New Chicken Order Received",

    html: `
      <h2>New Order Received</h2>

      <p><strong>Customer:</strong> ${order.customerName}</p>

      <p><strong>Phone:</strong> ${order.phone}</p>

      <p><strong>Address:</strong> ${order.address}</p>

      <p><strong>Landmark:</strong> ${order.landmark || "-"}</p>

      <p><strong>Total:</strong> ₹${order.total}</p>

      <ul>
        ${order.items
          .map(
            (item) => `
              <li>${item.name} × ${item.quantity}</li>
            `
          )
          .join("")}
      </ul>
    `,
  });
}

module.exports = sendOrderEmail;