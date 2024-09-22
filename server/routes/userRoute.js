const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup",userController.signup);
router.post("/login",userController.login);
router.post("/product",authMiddleware,userController.addProduct);
router.get("/products",authMiddleware,userController.getProducts);
router.patch("/product/:id",authMiddleware,userController.editProduct);
router.delete("/product/:id",authMiddleware,userController.deleteProduct);
router.post("/customer",authMiddleware,userController.addCustomer);
router.get("/customer",authMiddleware,userController.getCustomers);
router.delete("/customer/:id",authMiddleware,userController.deleteCostumer);
router.post("/sale",authMiddleware,userController.recordSale);
router.get("/sales",authMiddleware,userController.getSales);
router.delete("/sales/:id",authMiddleware,userController.deleteSales);
router.post("/send-email",authMiddleware,userController.sendEmail);
router.get("/customer-ledger",authMiddleware,userController.getCustomerLedger);


module.exports = router;