import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var ProductStockSchema = new Schema({
    enable: { type: Boolean, default: true },
    credit: { type: Number, default: 0 },
    debit: { type: Number, default: 0 },
    userReference: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    category: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: false },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
}, { timestamps: true, usePushEach: true })

const ProductStock = mongoose.model('ProductStock', ProductStockSchema);

export default ProductStock;
