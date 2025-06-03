import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var ProductOrderSchema = new Schema({
    orderStatus: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Confirm', 'Cancel'] },
    enable: { type: Boolean, default: true },
    totalAmount: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    otherAmount: { type: Number, default: 0 },
    orderId: { type: String, default: '' },
    orderResponse: { type: String, default: '' },
    week: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    weekDay: { type: String, default: '' },
    date: { type: Number, default: 0 },
    orderType: { type: String, default: 'by cash', enum: ['by cash', 'by RazorPay'] },
    items: [{}],
    orderBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    offset: { type: Number, default: 0 },
    shippingAddress: {},
    billingAddress: {}
}, { timestamps: true, usePushEach: true })

const ProductOrder = mongoose.model('ProductOrder', ProductOrderSchema);

export default ProductOrder;
