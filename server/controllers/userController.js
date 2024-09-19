const User = require("../models/userModel");
const Product = require("../models/productModel");
const { generateToken } = require("../utils/utils");
const Customer = require("../models/customerModel");
const Sales = require("../models/salesModel");
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
    res.status(200).json({message:"signup successfully completed",token});
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
    res.status(200).json({ message: "Login successfully completed" ,token});
  } catch (error) {
    res.status(400).json({ message: "login error" });
  }
};

const addProduct = async(req,res)=>{
  try{
    const {name,description,price,quantity}=req.body;
    const product = new Product({name,description,price,quantity});
    await product.save();
    res.status(200).json({message: "Product added successfully"});
  }catch(error){
    console.log(error);
    res.status(400).json({message: "Error while adding product"});
  }
}

const getProducts = async(req,res)=>{
  try {
    const products = await Product.find().sort({createdAt:-1});
    res.status(200).json({products});
  } catch (error) {
    res.status(400).json({message:"Error while getting products"});
  }
}

const editProduct = async(req,res)=>{
  try{
    const {id} = req.params;
    const {name,description,price,quantity}=req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id,{name,description,price,quantity},{new:true});
    res.status(200).json({message: "Product updated successfully"});
  }catch(error){
    console.log(error);
    res.status(400).json({message: "Error while updating product"});
  }
}

const deleteProduct = async(req,res)=>{
  try{
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({message: "Product deleted successfully"});
  }catch(error){
    res.status(400).json({message: "Error while deleting product"});
  }
}

const addCustomer = async(req,res)=>{
  try{
    const {name,address,phone}=req.body;
    const customer = new Customer({name,address,phone});
    await customer.save();
    res.status(200).json({message: "Customer added successfully"});
  }catch(error){
    console.log(error);
    res.status(400).json({message: "Error while adding customer"});
  }
}

const getCustomers = async(req,res)=>{
  try {
    const customers = await Customer.find().sort({createdAt:-1});
    res.status(200).json({customers});
  } catch (error) {
    res.status(400).json({message:"Error while getting customers"});
  }
}

const recordSale = async(req,res)=>{
  try{
    const {productId, customerId, quantity, cash,date}=req.body;
    const product = await Product.findById(productId);
    if(!product){
      return res.status(400).json({message: "Product not found"});
    }
    if(product.quantity < quantity){
      return res.status(400).json({message: "Not enough quantity in stock"});
    }
    product.quantity -= quantity;
    await product.save();
    const sale = new Sales({
      product:productId,
      customer: customerId,
      quantity,
      cash,
      date
    });
    await sale.save();
    res.status(200).json({message: "Recorded sale"});
  }catch(error){
    console.log(error);
    res.status(400).json({message: "Error while recording sale"});
  }
}

const getSales = async(req,res)=>{
  try {
    const sales = await Sales.find().sort({createdAt:-1}).populate({
      path: "product",
      select: "name -_id",
    }).populate({
      path: "customer",
      select: "name -_id",
    });
    res.status(200).json({sales});
  } catch (error) {
    res.status(400).json({message:"Error while getting sales"});
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
  getSales
};
