const User = require("../models/userModel");
const Product = require("../models/productModel");
const {
  generateToken,
  mailSalesReport,
  mailItemsReport,
  mailCustomerReport,
} = require("../utils/utils");
const Customer = require("../models/customerModel");
const Sales = require("../models/salesModel");
const nodemailer = require("nodemailer");
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = new User({ name, email, password });
    await user.save();
    const token = generateToken(user);
    res.status(200).json({ message: "signup successfully completed", token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Signup error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = generateToken(user);
    res.status(200).json({ message: "Login successfully completed", token });
  } catch (error) {
    res.status(400).json({ message: "login error" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const existingProduct = await Product.findOne({ name: name});
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }
    const product = new Product({ name, description, price, quantity });
    await product.save();
    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while adding product" });
  }
};

const getProducts = async (req, res) => {
  try {
    const search = req.query.search||"";
    const products = await Product.find({
      name: { $regex: search, $options: "i" }
    }).sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ message: "Error while getting products" });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, quantity },
      { new: true }
    );
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error while deleting product" });
  }
};

const addCustomer = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const customer = new Customer({ name, address, phone });
    await customer.save();
    res.status(200).json({ message: "Customer added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while adding customer" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json({ customers });
  } catch (error) {
    res.status(400).json({ message: "Error while getting customers" });
  }
};

const deleteCostumer = async(req,res)=>{
  try {
    const { id } = req.params;
    await Customer.findByIdAndDelete(id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error while deleting customer" });
  }
}

const recordSale = async (req, res) => {
  try {
    const { productId, customerId, quantity, cash, date } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity in stock" });
    }
    product.quantity -= quantity;
    await product.save();
    const sale = new Sales({
      product: productId,
      customer: customerId,
      quantity,
      cash,
      date,
    });
    await sale.save();
    res.status(200).json({ message: "Recorded sale" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while recording sale" });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "product",
        select: "name -_id",
      })
      .populate({
        path: "customer",
        select: "name -_id",
      });
    res.status(200).json({ sales });
  } catch (error) {
    res.status(400).json({ message: "Error while getting sales" });
  }
};

const deleteSales = async(req,res)=>{
  try {
    const { id } = req.params;
    await Sales.findByIdAndDelete(id);
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error while deleting sale" });
  }
}

const sendEmail = async (req, res) => {
  const { data, recipientEmail, sales, items, customer } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  let mailOptions;
  if (sales) {
    mailOptions = mailSalesReport(data, recipientEmail);
  } else if (items) {
    mailOptions = mailItemsReport(data, recipientEmail);
  }
  if (customer) {
    mailOptions = mailCustomerReport(data, recipientEmail);
  }
  try {
    transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(404).json({ message: "Error while sending email" });
  }
};

const getCustomerLedger = async (req, res) => {
  try {
    const customers = await Customer.find();
    let customerData = [];
    for (let customer of customers) {
      const sales = await Sales.find({ customer: customer._id });
      let totalSpent = 0;
      for (let sale of sales) {
        totalSpent += sale.cash;
      }
      customerData.push({
        ...customer._doc,
        totalSpent,
      });
    }
    res.status(200).json({ customerData });
  } catch (error) {
    res.status(404).json({ message: "Error while getting customer ledger" });
  }
};

const getItemReport = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ products:products });
  } catch (error) {
    res.status(404).json({ message: "Error while getting item report" });
  }
}

module.exports = {
  signup,
  login,
  addProduct,
  getProducts,
  editProduct,
  deleteProduct,
  addCustomer,
  getCustomers,
  recordSale,
  getSales,
  sendEmail,
  getCustomerLedger,
  deleteCostumer,
  deleteSales,
  getItemReport
};
