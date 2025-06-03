import SubscriptionPlan from '../model/subscription-plan.model.js';
import catchAsync from '../config/catchAsync.js';
import Joi from 'joi';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import User from '../model/user.model.js';
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};
const ObjectId = mongoose.Types.ObjectId;
export const stripe = new Stripe(process.env.stripeSecretKey);



export const addSubscriptionPlan = catchAsync(async (req, res, next) => {
    try {
        const { name, description, metadata, plans } = req.body;

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
        });

        const { error, value } = schema.validate({ name: name, description: description }, options);
        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        if (req.body.id) {
            const product = await stripe.products.update(req.body.id, { name, description, metadata });
            const plansList = await stripe.plans.list({
                product: product.id
            });

            for (let i = 0; i < plansList.data.length; i++) {
                await stripe.plans.update(plansList.data[i].id, { metadata });
            }

            await SubscriptionPlan.findOneAndUpdate({ productId: req.body.id }, req.body);
            // if (plans.length > 0) {
            //     for (let i = 0; i < plans.length; i++) {
            //         if (plans[i].amount > 0) {
            //             const priceId = await createNewPrice(product.id, plans[i].amount)
            //             const updatedProduct = await stripe.products.update(product.id, {
            //                 default_price: priceId,
            //             });
            //         }
            //     }
            // }
            const productData = await stripe.products.retrieve(req.body.id);
            return res.json({
                status: true,
                message: 'Subscription plan has been updated.',
                data: {
                    id: productData.id,
                    name: productData.name,
                    description: productData.description
                }
            });
        } else {

            if (plans.length === 0 || !plans[0].interval || !plans[0].amount) {
                return res.status(200).json({
                    status: false,
                    message: `Please provide subscription plans`,
                });
            }

            const product = await stripe.products.create({
                name,
                description,
                metadata
            });

            if (product.id && plans.length > 0) {
                await SubscriptionPlan.create({ productId: product.id, name, description, metadata });

                for (let i = 0; i < plans.length; i++) {
                    await stripe.plans.create({
                        amount: plans[i].amount * 100,
                        currency: 'usd',
                        metadata: metadata,
                        interval: plans[i].interval,
                        product: product.id
                    });
                }
            }

            return res.status(201).json({
                status: true,
                message: 'Package successfully created',
                data: {
                    id: product.id,
                    name: product.name,
                    description: product.description
                }
            });
        }
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});
async function createNewPrice(prod_id, amount) {
    const newPrice = await stripe.prices.create({
        product: prod_id,
        unit_amount: Number(amount) * 100,
        currency: 'usd',
    });
    return newPrice.id;
}
export const getAllEnableSubscriptionPlans = catchAsync(async (req, res, next) => {
    try {

        const interval = req.query.interval ? req.query.interval : '';
        const schema = Joi.object({
            interval: Joi.string().required(),
        });

        const { error, value } = schema.validate({ interval: interval }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        const productList = await SubscriptionPlan.find();
        if (!productList) {
            return res.status(200).json({
                status: false,
                message: 'No subscription plan found. Please add one',
            });
        }

        const productData = [];

        for (let i = 0; i < productList.length; i++) {
            const data = await stripe.products.retrieve(productList[i].productId);
            const query = { product: productList[i].productId };
            if (interval !== '') {
                query.interval = interval;
            }
            const plans = await stripe.plans.list(query);
            data.plans = plans.data;
            productData.push(data);
        }

        if (productData.length) {
            return res.json({
                status: true,
                data: productData,
                message: 'Data send successfully.',
            });
        }


        // let result = await SubscriptionPlan.find({ enable: true });
        // if (result.length) {
        //     return res.json({
        //         status: true,
        //         data: result,
        //         message: 'Data send successfully.',
        //     });
        // } else {
        //     return res.json({
        //         status: true,
        //         data: null,
        //         message: 'Data not present.',
        //     });
        // }
    } catch (exception) {
        return res.json({
            status: false,
            message: exception.message,
        });
    }
});


export const createPlan = catchAsync(async (req, res, next) => {
    const plan = await stripe.plans.create(req.body);

    return res.status(200).json({
        status: true,
        message: 'Plan successfully created',
        data: plan
    });
});


export const updatePlan = catchAsync(async (req, res, next) => {
    try {
        await stripe.plans.update(req.params.id, req.body);

        return res.status(200).json({
            status: true,
            message: 'Plan successfully updated'
        });
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});

export const deletePlan = catchAsync(async (req, res, next) => {
    await stripe.plans.del(req.params.id, req.body);

    return res.status(200).json({
        status: true,
        message: 'Plan successfully deleted'
    });
});

export const deleteSubscriptionPlan = catchAsync(async (req, res, next) => {
    try {
        const schema = Joi.object({
            productId: Joi.string().required(),
        });
        const { error, value } = schema.validate({ productId: req.query.productId }, options);
        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        const plans = await stripe.plans.list({ product: req.query.productId });
        if (plans.data.length > 0) {
            return res.status(200).json({
                status: false,
                message: 'This plan has pricing plans. Please delete them first.'
            });

        }

        await stripe.products.del(req.query.productId);
        await SubscriptionPlan.deleteOne({ productId: req.query.productId });

        return res.status(200).json({
            status: true,
            message: 'Subscription plan has been deleted.',
        })
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});


export const changeStatusOfSubscriptionPlan = catchAsync(async (req, res, next) => {
    try {
        let field = req.body;

        const schema = Joi.object({
            productId: Joi.string().required(),
        });

        const { error, value } = schema.validate({ productId: req.query.productId }, options);

        if (error) {
            return res.status(200).json({
                status: false,
                message: `${error.details.map(x => x.message).join(', ')}`,
            });
        }

        const product = await stripe.products.update(req.query.productId, req.body);


        const result = await SubscriptionPlan.updateOne({
            productId: req.query.productId
        }, {
            $set: {
                'enable': field.active
            }
        })

        return res.json({
            status: true,
            message: 'Record has been updated as ' + (field.active === true ? 'enabled' : 'disabled'),
        });
    } catch (ed) {
        return res.status(200).json({
            status: false,
            message: ed.message
        });
    }
});

export const cancelSubscription = catchAsync(async (req, res, next) => {
    let clientId = '';
    if (req.payload.role !== 'salon' && req.payload.role !== 'admin') {
        return res.status(200).json({
            status: false,
            message: "You don't have permission to perform this action",
        });
    }


    if (req.payload.role === 'salon') {
        clientId = req.payload._id
    } else {
        clientId = req.query.id
    }


    const client = await User.findOne({ _id: ObjectId(clientId) }).select('+stripeSubscriptionID');
    const subscription = await stripe.subscriptions.retrieve(client.stripeSubscriptionID);
    // await stripe.subscriptions.del(client.stripeSubscriptionID);  

    if (!client) {
        return res.status(200).json({
            status: false,
            message: 'Invalid client id',
        });
    }

    const updateSubscription = await stripe.subscriptions.update(client.stripeSubscriptionID, {
        cancel_at_period_end: subscription.cancel_at_period_end ? false : true,
        proration_behavior: 'create_prorations',
        items: [{
            id: subscription.items.data[0].id,
        }]
    });

    client.cancel_at_period_end = subscription.cancel_at_period_end ? false : true;
    client.save();

    return res.status(200).json({
        status: true,
        subscription: updateSubscription,
        message: 'Subscription has been updated as ' + (subscription.cancel_at_period_end ? 'Deactive' : 'Active'),
    });
});


export const getSubscriptionDetails = catchAsync(async (req, res, next) => {
    let clientId = '';
    if (req.payload.role !== 'salon' && req.payload.role !== 'admin') {
        return res.status(200).json({
            status: false,
            message: "You don't have permission to perform this action",
        });
    }

    if (req.payload.role === 'salon') {
        clientId = req.payload._id
    } else {
        clientId = req.query._id
    }

    const client = await User.findOne({ _id: ObjectId(clientId) }).select('+stripeSubscriptionID');
    if (!client) {
        return res.status(200).json({
            status: false,
            message: 'Invalid client id',
        });
    }

    const subscription = await stripe.subscriptions.retrieve(client.stripeSubscriptionID);
    const productDetails = await stripe.products.retrieve(subscription.plan.product);

    return res.status(200).json({
        status: true,
        data: subscription,
        product: productDetails,
        message: 'Your subscription data sent successfully'
    });
});



export const getAllSubscriptionPlans = catchAsync(async (req, res, next) => {
    try {

        const interval = req.query.interval ? req.query.interval : '';

        const productList = await SubscriptionPlan.find();

        if (!productList) {
            return res.status(200).json({
                status: false,
                message: 'No subscription plan found. Please add one',
            });
        }

        const productData = [];

        for (let i = 0; i < productList.length; i++) {
            const data = await stripe.products.retrieve(productList[i].productId);
            const query = { product: productList[i].productId };
            if (interval !== '') {
                query.interval = interval;
            }
            const plans = await stripe.plans.list(query);
            data.plans = plans.data;
            productData.push(data);
        }

        if (productData.length) {
            return res.json({
                status: true,
                data: productData,
                message: 'Data send successfully.',
            });
        }
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});

export const getAllActivePlans = catchAsync(async (req, res, next) => {
    try {
        const interval = req.query.interval ? req.query.interval : 'month';

        const productList = await SubscriptionPlan.find();

        if (!productList) {
            return res.status(200).json({ status: false, message: 'No packages found' })
        }

        const productData = [];
        for (let i = 0; i < productList.length; i++) {
            const data = await stripe.products.retrieve(productList[i].productId);
            const query = { product: productList[i].productId, active: true };
            if (interval !== '') {
                query.interval = interval;
            }
            const plans = await stripe.plans.list(query);
            data.plans = plans.data;
            if (data.active === true) productData.push(data);
        }

        return res.status(200).json({
            status: true,
            data: productData
        });
    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});


export const getSubscriptionPlansForWebsite = catchAsync(async (req, res, next) => {
    try {
        let query = {}
        let orList = [];
        let andList = [];

        const pageNumber = Number(req.query.pageNumber)
        const pageSize = Number(req.query.pageSize)

        if (req.query.filterValue) {
            orList = [
                { 'name': { $regex: req.query.filterValue, $options: "i" } },
                { 'name': req.query.filterValue },
                { 'heading': { $regex: req.query.filterValue, $options: "i" } },
                { 'heading': req.query.filterValue },
            ]
        }

        if (orList.length)
            query.$or = orList;
        if (andList.length)
            query.$and = andList;
        const planList = await SubscriptionPlan.aggregate()
            .match(query)
            .sort({ createdAt: -1 })
            .group({
                _id: null,
                count: { $sum: 1 },
                records: { $push: "$$ROOT" }
            })
            .project({
                count: '$count',
                records: { $slice: ['$records', ((pageNumber - 1) * pageSize), pageSize] }
            });

        if (planList.length) {
            if (planList[0].records.length) {
                return res.status(200).json({
                    status: true, data: {
                        result: planList[0].records,
                        totalPageSize: planList[0].count
                    },
                    message: 'Data sent successfully'
                })
            } else {
                return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
            }
        } else {
            return res.status(200).json({ status: false, data: null, message: 'No Result Found.' })
        }

    } catch (err) {
        return res.status(200).json({ status: false, message: err.message })
    }
});

export const getPricing = catchAsync(async (req, res, next) => {
    const priceId = process.env.stripePriceId;
    const price = await stripe.prices.retrieve(priceId, { expand: ['tiers'] });

    if (!price || !price.tiers || price.tiers.length === 0) {
        return res.status(200).json({ status: false, message: "No pricing tiers available." });
    }

    const formattedTiers = price.tiers.map((tier, index, array) => {
        const start = index === 0 ? 1 : array[index - 1].up_to + 1;
        const end = tier.up_to ? tier.up_to : '∞';
        return {
            from: start,
            to: end,
            unit_amount: tier.unit_amount / 100, 
            currency: price.currency.toUpperCase()
        };
    });

    return res.status(200).json({
        status: true,
        data: {
            ...price,
            formattedTiers
        }
    });
});

const fetchTieredPricing = async () => {
    try {
        const price = await stripe.prices.retrieve(process.env.stripePriceId, { expand: ['tiers'] });

        if (!price || !price.tiers || price.tiers.length === 0) {
            return { status: false, message: "No pricing tiers available." };
        }

        const formattedTiers = price.tiers.map((tier, index, array) => {
            const start = index === 0 ? 1 : array[index - 1].up_to + 1;
            const end = tier.up_to ? tier.up_to : '∞';
            return {
                from: start,
                to: end,
                unit_amount: tier.unit_amount / 100, 
                currency: price.currency.toUpperCase()
            };
        });

        return {
            status: true,
            data: formattedTiers
        };
    } catch (error) {
        throw new Error('Failed to retrieve pricing details from Stripe');
    }
};

const fetchTaxRate = async () => {
    try {
        if (!process.env.STRIPE_TAX_RATE_ID) return null;
        const taxRate = await stripe.taxRates.retrieve(process.env.STRIPE_TAX_RATE_ID);
        return taxRate;
    } catch (error) {
        throw new Error('Failed to fetch tax rate from Stripe');
    }
};
const getPromoCodeByCode = async (code) => {
    try {
        const promotionCode = await stripe.promotionCodes.list({
            code: code,
            active: true
        });

        if (promotionCode.data.length === 0) {
            return {
                status: false
            };
        } else {
            return {
                status: true,
                promotionCode: promotionCode.data
            };
        }
    } catch (error) {
        return {
            status: false
        };
    }
};

export const totalPrice = async (req, res, next) => {
    const qty = parseInt(req.params.qty, 10);
    const code = req.params.code;
    let promoData = null;

    if (!qty || isNaN(qty) || qty <= 0) {
        return res.status(400).json({ status: false, message: "Please provide a valid quantity." });
    }

    // Fetch promotion code data if code is provided
    if (code) {
        try {
            promoData = await getPromoCodeByCode(code);
            console.log(promoData);
        } catch (error) {
            console.log(error);
        }
    }

    let tieredPricing;
    let taxRate;

    // Fetch tiered pricing and tax rate
    try {
        tieredPricing = await fetchTieredPricing();
        taxRate = await fetchTaxRate();
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }

    if (!tieredPricing.status) {
        return res.status(200).json(tieredPricing);
    }

    if (!Array.isArray(tieredPricing.data)) {
        return res.status(500).json({ status: false, message: "Unexpected pricing data format." });
    }

    let unitPrice = 0;
    let selectedTier = null;

    // Determine the correct tier for the given quantity
    for (const tier of tieredPricing.data) {
        if (qty >= tier.from && (tier.to === '∞' || qty <= tier.to)) {
            unitPrice = tier.unit_amount;
            selectedTier = tier;
            break;
        }
    }

    if (!selectedTier) {
        return res.status(400).json({ status: false, message: "Quantity does not fit any pricing tier." });
    }

    // Calculate total amount for volume pricing
    const totalAmount = qty * unitPrice;

    let promoAmount = 0;
    let discountPercentage = 0;

    if (promoData && promoData.status) {
        // Get the discount percentage
        discountPercentage = promoData.promotionCode[0].coupon.percent_off;
        // Calculate the discount amount based on the percentage
        promoAmount = totalAmount * (discountPercentage / 100);
    }

    // Calculate tax only if promotion does not cover the entire amount
    const taxableAmount = promoAmount < totalAmount ? totalAmount - promoAmount : 0;
    const taxAmount = taxRate ? taxableAmount * (taxRate.percentage / 100) : 0;

    // Total amount with tax and discount
    const totalAmountWithTax = taxableAmount + taxAmount;

    // Response with detailed breakdown
    res.status(200).json({
        status: true,
        message: "Price calculation successful.",
        unitPriceDetails: [{
            tier: `Tier ${selectedTier.from}-${selectedTier.to}`,
            quantity: qty,
            unitPrice: unitPrice,
            amount: totalAmount.toFixed(2)
        }],
        subtotal: (totalAmount + taxAmount).toFixed(2),
        discountPercentage: discountPercentage,
        discountAmount: promoAmount.toFixed(2),
        tax: taxAmount.toFixed(2),
        taxPercentage: taxRate ? taxRate.percentage : 0,
        total: totalAmountWithTax.toFixed(2),
        price: totalAmount.toFixed(2),
        promoCode:code?code:""
    });
};

function getRoleLabel(role) {
    switch (role) {
        case 'admin':
            return 'Admin'
        case 'salon':
            return 'Salon'
        case 'stylist':
            return 'stylist'
        case 'user':
            return 'User'
        case 'salonadmin':
            return 'Salon Admin'
        case 'superadmin':
            return 'Super Admin'
        // case 'company':
        //     return 'Company'
        default:
            return role
    }
}