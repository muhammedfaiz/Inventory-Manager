const jwt = require("jsonwebtoken");
const { recompileSchema } = require("../models/userModel");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const mailSalesReport = (data, recipientEmail) => {
  const formatSalesDataAsHTML = (salesData) => {
    let rows = salesData
      .map(
        (sale, index) =>
          `<tr>
        <td>${index + 1}</td>
        <td>${new Date(sale.date).toLocaleDateString("en-GB")}</td>
        <td>${sale.product}</td>
        <td>${sale.quantity}</td>
        <td>${sale.customer}</td>
        <td>${Number(sale.cash).toFixed(2)}</td>
      </tr>`
      )
      .join("");

    return `
      <h2>Sales Report</h2>
      <table border="1" cellpadding="10" cellspacing="0">
        <thead>
          <tr>
            <th>SI.NO</th>
            <th>Date</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Customer</th>
            <th>Cash</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  };
  const mailOptions = {
    to: recipientEmail,
    subject: "Sales Report",
    html: formatSalesDataAsHTML(data),
  };
  return mailOptions;
};

const mailItemsReport = (data,recipientEmail)=>{
  const formatItmesDataAsHTML = (itemsData) => {
    let rows = itemsData
      .map(
        (item, index) =>
          `<tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>${Number(item.price).toFixed(2)}</td>
      </tr>`
      )
      .join("");

    return `
      <h2>Items Report</h2>
      <table border="1" cellpadding="10" cellspacing="0">
        <thead>
          <tr>
            <th>SI.NO</th>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  };
  const mailOptions = {
    to: recipientEmail,
    subject: "Items Report",
    html: formatItmesDataAsHTML(data),
  };
  return mailOptions;
}

const mailCustomerReport = (data,recipientEmail)=>{
  const formatItmesDataAsHTML = (customerData) => {
    let rows = customerData
      .map(
        (customer, index) =>
          `<tr>
        <td>${index + 1}</td>
        <td>${customer.name}</td>
        <td>${customer.phone}</td>
        <td>${customer.address}</td>
        <td>${Number(customer.totalSpent).toFixed(2)}</td>
      </tr>`
      )
      .join("");

    return `
      <h2>Customer Report</h2>
      <table border="1" cellpadding="10" cellspacing="0">
        <thead>
          <tr>
            <th>SI.NO</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Total Spent</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  };
  const mailOptions = {
    to: recipientEmail,
    subject: "Items Report",
    html: formatItmesDataAsHTML(data),
  };
  return mailOptions;
}

module.exports = { generateToken, verifyToken, mailSalesReport,mailItemsReport , mailCustomerReport};
