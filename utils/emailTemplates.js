const emailTemplates = {
  sendOrder: (order) => `<style>body{font-family:Helvetica}</style>
    <p>Hi ${order.user.name},</p>
    <p>We have sent your order.</p>
    <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})
    </h2>
    <p>The time you set for deliver is:  ${order.deliverScheduledAt
      .toString()
      .substring(0, 10)}
    from ${order.deliverScheduledFrom} to ${order.deliverScheduledTo}
    </p>
    <h2>
    Receive your order at above time in this address:
    </h2>
    <p>
    ${order.shipping.fullName},<br/>
    ${order.shipping.streetAddress},<br/>
    ${order.shipping.city},<br/>
    ${order.shipping.country},<br/>
    ${order.shipping.postalCode}<br/>
    </p>
    <hr/>
    <p>
    Thanks for shopping with us.
    </p>
    `,
  payOrder: (order) => `
    <style>body{font-family:Helvetica}</style>
    <h1>Thanks for shopping with us</h1>
    <p>Hi ${order.user.name},</p>
    <p>We have finished processing your order.</p>
    <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})
    </h2>
    <table>
    <thead>
    <tr>
    <td><strong>Product</strong></td>
    <td><strong>Quantity</strong></td>
    <td><strong align="right">Price</strong></td>
    </thead>
    <tbody>
    ${order.orderItems
      .map(
        (item) => `
      <tr>
      <td>${item.name}</td>
      <td align="center">${item.qty}</td>
      <td align="right"> $${item.price.toFixed(2)}</td>
      </tr>
    `
      )
      .join('\n')}
    </tbody>
    <tfoot>
    <tr>
    <td colspan="2">Items Price:</td>
    <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Tax Price:</td>
    <td align="right"> $${order.taxPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Shipping Price:</td>
    <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2"><strong>Total Price:</strong></td>
    <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
    </tr>
    <tr>
    <td colspan="2">Payment Method:</td>
    <td align="right">${order.paymentMethod}</td>
    </tr>
    <tfoot>
    </table>
    <h2>Billing address</h2>
    <p>
    ${order.shippingAddress.fullName},<br/>
    ${order.shippingAddress.streetAddress},<br/>
    ${order.shippingAddress.city},<br/>
    ${order.shippingAddress.country},<br/>
    ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>
    Thanks for shopping with us.
    </p>
  
    `,
};
export default emailTemplates;
