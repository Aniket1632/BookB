import { EventEmitter } from 'events';
const em = new EventEmitter();
import emailEvent from '../event/email-service.event.js';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import moment from 'moment';
moment.suppressDeprecationWarnings = true;

em.on('email-template-service', async (obj) => {
    try {
        const {
            toAddress,
            subject,
            items,
            billingAddress,
            //  shippingAddress,
            // transactionId, 
            orderId,
            otherAmount,
            totalAmount
        } = obj;

        ejs.renderFile(path.join(__dirname, "/email-order-success.ejs"), {
            rows: items,
            billingAddress: billingAddress,
            // shippingAddress: shippingAddress,
            // transactionId: transactionId,
            orderId: orderId,
            otherAmount: otherAmount,
            totalAmount: totalAmount
        }, {}, async function (err, str) {
            // console.log('err : ', err);
            // console.log('str ', str);
            if (!err && str) {
                let emailobject = await emailEvent.emit('email-service', {
                    toAddress: toAddress,
                    content: str,
                    subject: subject,
                    file: null
                });

                return emailobject;
            } else {
                return err;
            }
        });

    } catch (exception) {
        console.error(exception);
        return exception
    }
});


em.on('appointment-confirm', async (obj) => {
    try {
        const { _id, name, toAddress, subject, requiredDuration, stylistDetail, timeAsAString, serviceDetail, appointmentDate, status, appointmentId } = obj;
        ejs.renderFile(path.join(__dirname, "/appointment-confirm.ejs"), {
            name: name,
            requiredDuration: requiredDuration,
            stylistDetail: stylistDetail,
            timeAsAString: timeAsAString,
            serviceDetail: serviceDetail,
            appointmentDate: appointmentDate,
            dateofmonth: moment(new Date(appointmentDate)).format('dddd, MMMM Do YYYY'),
            status: status,
            link: 'http://bookb/appointment-detail/' + _id,
            appointmentId: appointmentId
        }, {}, async function (err, str) {
            // console.log('err : ', err);
            // console.log('str ', str);
            if (!err && str) {
                let emailobject = await emailEvent.emit('email-service', {
                    toAddress: toAddress,
                    content: str,
                    subject: subject,
                    file: null
                });

                return emailobject;
            } else {
                return err;
            }
        });

    } catch (exception) {
        console.error(exception);
        return exception
    }
});



// LOCAL FUNCTIONS
async function getWeekDay(dayNumber) {
    switch (dayNumber) {
        case 1:
            return 'Monday'
        case 2:
            return 'Tuesday'
        case 3:
            return 'Wednesday'
        case 4:
            return 'Thursday'
        case 5:
            return 'Friday'
        case 6:
            return 'Saturday'
        case 7:
            return 'Sunday'
    }
}

export default em;