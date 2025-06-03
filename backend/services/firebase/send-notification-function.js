var serviceAccount = {
    "type": "service_account",
    "project_id": "bookb-production",
    "private_key_id": "f0d059d33f1f0af7466f5705d35f22a76d409b9f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCM2eFxSRlTc186\nll9nKkLi4Q66SLqzKCs5r1ddaywuXonb/auTs4RPu3g+a2edEf7v6UmI3gcu9zJG\ntw838XT2GSomvm0P6O3iuOa2/6do+jAIjhgVohJGFMkh6nxDcq7JexypYC4ruUFk\nSvBRVbyxg/aufdl2nivYW6I309TJw91K5VWbHIIfG4+Ew39nh4mPMIiUAr1FK5mE\n/paVrg9M8ugYwtbrXby+AbHsQMQ3HzFzUSGO940EHB6YGWrj3W7w1CypqpvexcYq\n5TfgBnqixIXUymtxXsipa8LCnOtMJ0r4QD2Rl7ifDshWFsmFAbDnWc+xvAPBoeBo\nucLLbuqvAgMBAAECggEAMs34QluClhY8WC6bNOQKgjl5jXnkVfD8Pm9fjOO2aPdS\ntJY4SCttYzEUuzcUhZRTJ4g3LPYhEzC44sbu51fhv07uZFE1l5KGE8xr88AdS4FK\nyBsw1sTB4KNotSIWNmHsZ+JPQUze+oh07M8XBc9uI32dAe2E/gMpf3318jsnOqsx\nao6FLOP871ObUdBLAWVPAsRToZP5avTsQvt87RbnfbNzEev6PJf0En6UBZoGEYED\ndtxre0t/WLZsl1JffFK73rznz4cGfdS2hY7UjfXnLuF4gyCvnit9bKvY9wNmqPPp\n1+B3gd7FHmf+nY+BsmgmEZ3sFpNQVv6aOEPZXlrUMQKBgQDBBo/373bF1GBSVSGW\nf4XVpQtZ/Sm1/YrCKqsV5RC/Tg+9kfPDtS+QXlH10GcttOikVilJMsJS+HHrmKN+\nBppmAHA+j7/oUhAWqFi78Ay9U+pIJpbWNZR4SWGS9qSMaAYP3fl1ZxQurCf76KoO\nDRhpWlW8pj2mWRgVnaUTegecuQKBgQC6zbfMdpo5v70rpgD2eqV2iCfdCGkrgWO0\nu1RLU47Tuw/9/c24Oe+oa+q0/efdZ3EH/MmPLVZ6NVxzVAdxs/djajbqnslV1QnD\nMfZR+aFsQEeX9cWci4m7GUbIM+L/JKVoanHCoOZLM1CG/jx+oP1MVw1kGUk/LgFO\nDIt04+oepwKBgDuhYVyA17ppz4/fyM6Lerbzk7wrH3Wfa/xr3gqXh0LyRJ6Vti6h\njJ4W5U8BIL7YAn6yN3LrgWjMY7UapHdMZupX/FT3Z5vHrjyxqSf2EplykQ/VDAgE\n6Wb3lHMoStEtWaIROv1v6KY6fOevislodkAlrhLncGgxYeVbnCGWMz/RAoGAWhOs\n12kxgTtWCuAngrMtanTJVCokHJht7c6PHSuTqcGAOqfSNU2qpPo02UW+MuMYfBOH\nVgU0uAVXKT2RwWBYoJWtGYGr8DmkVX2YG3tWPY7ZdwtKWOxoY9IScaOjiAixwiHh\n7UoNAqIh6JZbsWwL+G3ZxTT0PwT+GBawgJMOZ+0CgYBWawXBNHQwhx3J5PZnxxZJ\nFisviPZOhyAB33VLtq6u3ByE0yZd74wZzO0FPaubuhMYbuRu/CpKplgevTUkC9jm\nBwZbBFo2jQHjUhH9DGA7cDR8P4F2C3EihPhtBPgJsjTDNy+2d2Ofq9MA8jpRLqq/\ni6TR6RA2g3nlcqCnwr8v1Q==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-wfz4a@bookb-production.iam.gserviceaccount.com",
    "client_id": "117062462926321245496",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wfz4a%40bookb-production.iam.gserviceaccount.com"
  }

import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const sendNotificationTokens = async (title, body, token, data) => {
    try {

        const message = {
            notification: {
                title: title,
                body: body,
            },
            tokens: token,
        }
        console.log(message);
        fcmResult = await new Promise((resolve, reject) => {
            admin.messaging().sendMulticast(message)
                .then((response) => {
                    console.log(response);
                    resolve({
                        status: true,
                        message: {
                            result: response,
                            title: 'Message were sent successfully',
                        },
                    });
                })
                .catch((error) => {
                    console.log(error);
                    reject({
                        status: false,
                        message: {
                            result: error,
                            title: 'Message were not sent successfully'
                        },
                    });
                });
        });
        return fcmResult;
    } catch (exception) {
        return {
            status: false,
            message: exception.message,
        };
    }
};

const sendNotificationToken = async (title, body, token, data) => {
    try {

        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: token,
        }
        admin.messaging().send(message)
            .then((response) => {
                console.log(response);
                return ({
                    status: true,
                    message: {
                        result: response,
                        title: 'Message were sent successfully',
                    },
                });
            })
            .catch((error) => {
                console.log(error);
                return ({
                    status: false,
                    message: {
                        result: error,
                        title: 'Message were not sent successfully'
                    },
                });
            });
    } catch (exception) {
        console.log(exception);

        return {
            status: false,
            message: exception.message,
        };
    }
};

const sendNotificationTopic = async (title, body, topic, data) => {
    try {

        const message = {
            notification: {
                title: title,
                body: body,
            },
            data: data,
            topic: topic.toString().toLowerCase().trim().split(' ').join(''),
        }
       const fcmResult = await new Promise((resolve, reject) => {
            admin.messaging().send(message)
                .then((response) => {
                    console.log(response);
                    resolve({
                        status: true,
                        message: {
                            result: response,
                            title: 'Message were sent successfully',
                        },
                    });
                })
                .catch((error) => {
                    console.log(error);
                    reject({
                        status: false,
                        message: {
                            result: error,
                            title: 'Message were not sent successfully'
                        },
                    });
                });
        });
        return fcmResult;
    } catch (exception) {
        return {
            status: false,
            message: exception.message,
        };
    }
};
export { sendNotificationTokens, sendNotificationToken, sendNotificationTopic };