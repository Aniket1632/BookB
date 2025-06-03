import { EventEmitter } from 'events';

const em = new EventEmitter();
import { ses } from '../config/s3.config.js';

import env from '../config/index.js';

em.on('email-service', async (obj) => {
    const { toAddress, content, subject, file } = obj;
    try {
        const params = {
            Source: env.EMAIL,
            Destination: {
                ToAddresses: [
                    toAddress
                ],
                BccAddresses: [
                    'yogesh@the-algo.com',
                    'anil@the-algo.com'
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: content
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            }
        }
        ses.sendEmail(params).promise().then((res) => {
            console.log(res);
            return res;
        });
    } catch (exception) {
        console.error(exception);
        return exception
    }
});
export default em;