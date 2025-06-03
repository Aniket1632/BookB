import { EventEmitter } from 'events';
import Product from '../model/product.model.js';
import ProductStock from '../model/product-stock.model.js';

const em = new EventEmitter();
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import User from '../model/user.model.js';


em.on('update-stock-by-product', async (obj) => {
    const { productID } = obj;
    try {
        const result = await ProductStock.aggregate()
            .match({
                product: ObjectId(productID),
            })
            .group({
                "_id": "$product",
                "credit": { "$sum": "$credit" },
                "debit": { "$sum": "$debit" },
            })
            .project({
                "total": { "$subtract": ["$credit", "$debit"] },
                "totalGiven": "$credit",
                "used": "$debit"

            })
        let total = 0;
        if (result.length) {
            total = result[0].total;
        } else {
            total = 0;
        }
        await Product.updateOne({
            _id: productID
        }, {
            $set: {
                stock: total
            }
        })
    } catch (exception) {
        console.log(exception);

    }

});
em.on('update-stock-by-product-list', async (obj) => {
    const { productArray } = obj;
    try {
        for (const iterator of productArray) {
            const result = await ProductStock.aggregate()
                .match({
                    product: ObjectId(iterator._id),
                })
                .group({
                    "_id": "$product",
                    "credit": { "$sum": "$credit" },
                    "debit": { "$sum": "$debit" },
                })
                .project({
                    "total": { "$subtract": ["$credit", "$debit"] },
                    "totalGiven": "$credit",
                    "used": "$debit"
                })
            let total = 0;
            if (result.length) {
                total = result[0].total;
            } else {
                total = 0;
            }
            await Product.updateOne({
                _id: iterator._id
            }, {
                $set: {
                    stock: total
                }
            })
        }

    } catch (exception) {
        console.log(exception);

    }

});

em.on('update-subscrtion', async (obj) => {
    try {
        const salonList = await User.find({ active: true, role: 'salon', 'subscription.endDate': { $gte: new Date() } });
        for (const iterator of salonList) {
            const result = await User.updateOne({
                _id: iterator._id
            }, {
                $set: {
                    'active': false,
                }
            });

            if (result) {
                const stylistData = await User.find({ active: true, role: 'stylist', salon: iterator._id });
                for (const item of stylistData) {
                    const stylistResult = await User.updateOne({
                        _id: item._id
                    }, {
                        $set: {
                            'active': false,
                        }
                    });
                }
            }
        }
    } catch (exception) {
        console.log(exception);

    }

});

export default em;