import catchAsync from '../config/catchAsync.js';
import User from '../model/user.model.js'
import rewardTemplate from '../model/coinsSettings.js'
import appointment from '../model/appointment.model.js'
import CoinsHistory from '../model/coinsHistory.js'



export const firstAppointment = async (user_id) => {
    try {
        const userData = await User.findOne({ _id: user_id })
        const template = await rewardTemplate.findOne({ "userType": "end-user", "actionType": "first-appointment", "isDeleted": false })
        if (userData && template) {

            if (userData.coins + template.coins > 500) return false

            if (userData.coins === undefined) {
                userData.coins = 0;
            }
            userData.coins += template.coins;

            const coinHistoryData = new CoinsHistory({
                userId: user_id,
                actionType: 'first-appointment',
                transactionType: 'added',
                coin: template.coins,
                description: 'Schedule and attend your first appointment through the BookB platform',
                currentBalance: userData.coins,
            });

            await userData.save();
            await coinHistoryData.save();
            let result = {
                title: template.title,
                description: template.description,
                coins: template.coins
            }
            let result2 = {}
            if (userData.referredBy) {
                const refereduserData = await User.findOne({ referralCode: userData.referredBy });
                const templateData = await rewardTemplate.findOne({ "userType": "end-user", "actionType": "reference", "isDeleted": false })
                if (refereduserData && templateData && refereduserData.coins + templateData.coins < 500) {
                    if (refereduserData.coins === undefined) {
                        refereduserData.coins = 0;
                    }
                    refereduserData.coins += templateData.coins;
                    const coinHistoryData = new CoinsHistory({
                        userId: refereduserData._id,
                        actionType: 'reference',
                        transactionType: 'added',
                        coin: templateData.coins,
                        description: 'Successfully refer a friend who books their first appointment.',
                        currentBalance: refereduserData.coins,
                    });
                    await coinHistoryData.save();
                    await refereduserData.save();
                    result2.title = template.title,
                        result2.description = template.description,
                        result2.coins = template.coins,
                        result2.user_id = refereduserData._id
                }
            }
            return [result, result2]
        }
        else {
            return false
        }

    } catch (error) {
        console.error(error);
        return false
    }

}

export const firstLogin = async (user_id) => {
    try {

        let coinTemplate = await rewardTemplate.findOne({ "userType": "end-user", "actionType": "Sign-up", "isDeleted": false });

        let userData = await User.findOne({ _id: user_id });

        if (!coinTemplate && !userData) return

        if (userData.coins === undefined) {
            userData.coins = 0;
        }

        userData.coins += coinTemplate.coins;
        let coinHistoryExist = await CoinsHistory.find({ userId: user_id, actionType: 'Sign-up' });

        if (coinHistoryExist.length != 0) return false
        const coinHistoryData = new CoinsHistory({
            userId: user_id,
            actionType: 'Sign-up',
            coin: coinTemplate.coins,
            transactionType: 'added',
            description: 'Sign-up bonus',
            currentBalance: userData.coins,
        });

        await userData.save();
        await coinHistoryData.save();

        const result = {
            title: coinTemplate.title,
            description: coinTemplate.description,
            coins: coinTemplate.coins
        };
        return result
    } catch (error) {
        console.error(error);
        return false
    }

}


export const completeProfile = async (user_id) => {
    try {
        let userData = await User.findOne({ _id: user_id });
        let coinTemplate = await rewardTemplate.findOne({ "userType": "end-user", "actionType": "complete-profile", "isDeleted": false });

        if (!userData && !coinTemplate) return false

        if (userData.coins + coinTemplate.coins > 500) return false

        if (userData.coins === undefined) {
            userData.coins = 0;
        }

        userData.coins += coinTemplate.coins;
        const coinHistoryData = new CoinsHistory({
            userId: user_id,
            actionType: 'complete-profile',
            coin: coinTemplate.coins,
            transactionType: 'added',
            description: 'complete-profile bonus',
            currentBalance: userData.coins,
        });
        await userData.save();
        await coinHistoryData.save();
        let result = {
            title: coinTemplate.title,
            description: coinTemplate.description,
            coins: coinTemplate.coins
        }
        return result
    } catch (error) {
        console.error(error);
        return false
    }
}