import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var ProductSchema = new Schema({
    productName: { type: String, default: '' },
    productDescription: { type: String, default: '' },
    enable: { type: Boolean, default: true },
    productPrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    productCash: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    productImageURL: { type: String, default: '' },
    productImageKey: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: false },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    actualPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }, 
}, { timestamps: true, usePushEach: true })

const Product = mongoose.model('Product', ProductSchema);

export default Product;
