var mongoose = require('mongoose');
var multer = require('multer');
const { stringify } = require('postcss');
var Schema = mongoose.Schema;

var productSchema = new Schema(
  {
    name: { type: String },
    quantity: { type: String },
    price: { type: Number },
    image: { type: String },
    likes: { type: Number, default: 0 },
    likes:{  type: Number, default: 0},
  },
  { timestamps: true }
);
var Product = mongoose.model('Product', productSchema);
module.exports = Product;