import { EventEmitter } from 'events';
import User from '../model/user.model.js';
import CoinsHistory from '../model/coinsHistory.js';
import coinTemplates from '../model/coinsSettings.js'
const em = new EventEmitter();


em.on('add-referal-coin', async (obj) => {
    try {
        let referalUserData = await User.findOne({ referralCode: obj.referralCode });

        if (!referalUserData) return

        let userData = await User.findOne({ _id: obj.user_id });

        if (referalUserData.coins === undefined) {
            referalUserData.coins = 0;
        }

        referalUserData.coins += 100;
        userData.referredBy = obj.referralCode;


        const coinHistoryData = new CoinsHistory({
            userId: referalUserData._id,
            actionType: 'reference',
            transactionType: 'added',
            coin:100,
            description: 'Referral bonus',
            currentBalance: referalUserData.coins,
            referredUsedBy: obj.user_id
        });

        await referalUserData.save();
        await userData.save();
        await coinHistoryData.save();
        
    } catch (exception) {
        console.error(exception);
        return exception
    }
});

em.on('add-coin-enduser-signup', async (obj) => {
    try {

    let coinTemplate = await coinTemplates.findOne({"userType":"end-user","actionType":"Sign-up","isDeleted":false});

    let userData = await User.findOne({_id:obj.user_id});

    if(!coinTemplate && !userData) return
     
    if(userData.coins + coinTemplate.coins > 500) return 

    if (userData.coins === undefined) {
        userData.coins = 0;
    }

    userData.coins += coinTemplate.coins;

    const coinHistoryData = new CoinsHistory({
        userId: obj.user_id,
        actionType: 'Sign-up',
        coin:coinTemplate.coins,
        transactionType: 'added',
        description: 'Sign-up bonus',
        currentBalance:  userData.coins,
    });

    await userData.save();
    await coinHistoryData.save();

    } catch (error) {
        console.error(error);
        return error
    }


})

export default em;