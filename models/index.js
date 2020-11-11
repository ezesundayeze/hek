const mongoose = require("mongoose");
const userSchema = require("./User");
const storeSchema = require("./Store");
const invoiceSchema = require("./Invoice");
const disputeSchema = require("./Dispute");
const walletSchema = require("./Wallet");
const withdrawalLogSchema = require("./withdrawalLog");
const categorySchema = require("./Category");
const orderSchema = require("./Order");
const productSchema = require("./product");

module.exports = {
  User: mongoose.model("User", userSchema()),
  Store: mongoose.model("Store", storeSchema()),
  Invoice: mongoose.model("Invoice", invoiceSchema()),
  Dispute: mongoose.model("Dispute", disputeSchema()),
  Wallet: mongoose.model("Wallet", walletSchema()),
  Category: mongoose.model("Category", categorySchema()),
  Order: mongoose.model("Order", orderSchema()),
  Product: mongoose.model("Product", productSchema()),
  WithdrawalLog: mongoose.model("WithdrawalLog", withdrawalLogSchema()),
};
