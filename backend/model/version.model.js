import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const VersionSchema = new Schema({
    versionTitleIOS: { type: String, default: '' },
    versionTitleAndroid: { type: String, default: '' },
    enable: { type: Boolean, default: true },
    isCompulsory: { type: Boolean, default: true },
    versionDescription: { type: String, default: '' },
    packageName: { type: String, default: 'https://play.google.com/store/apps/details?id=io.thealgorithm.bookb' },
    bundleID: { type: String, default: 'https://apps.apple.com/tt/app/bookb/id1599670447' },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true, usePushEach: true });

const Version = mongoose.model('Version', VersionSchema);

export default Version;
