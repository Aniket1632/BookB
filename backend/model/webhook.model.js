import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const WebhookSchema = new Schema({
    response: { },
    request: { },

}, { timestamps: true, usePushEach: true });

const Webhook = mongoose.model('Webhook', WebhookSchema);

export default Webhook;
