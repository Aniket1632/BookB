import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var ProductCategorySchema = new Schema({
    categoryName: { type: String },
    categoryImage: { type: String },
    categoryThreshold: { type: Number, default:5 },
    enable: { type: Boolean, default: true },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true, usePushEach: true })

const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);

export default ProductCategory;
