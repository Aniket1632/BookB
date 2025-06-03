const events = require('events');
const em = new events.EventEmitter();
const ses = require('../config/s3.config').ses;
const env = require('../config/index');
const fs = require("fs");
const mailcomposer = require("mailcomposer");

em.on('raw-email-service', (obj) => {
    const { toAddress, content, subject, filepath, fileName } = obj;
    try {
        console.log(filepath);
        return Promise.resolve().then(() => {
            let sendRawEmailPromise;
            const mail = mailcomposer({
                from: env.email,
                to: toAddress,
                subject: subject,
                text: content,
                attachments: [
                    {
                        path: filepath,
                        filename: fileName,
                        contentType: 'application/pdf'
                    },
                ],
            });



            return new Promise((resolve, reject) => {
                mail.build((err, message) => {
                    if (err) {
                        reject(`Error sending raw email: ${err}`);
                    }
                    sendRawEmailPromise = ses.sendRawEmail({ RawMessage: { Data: message } }).promise();
                });

                resolve(sendRawEmailPromise);
            });
        });
    } catch (exception) {
        console.error(exception);
    }
});
module.exports.commonEmitter = em;