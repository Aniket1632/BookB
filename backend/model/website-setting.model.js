import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var WebsiteSettingSchema = new Schema({
    bgColor: { type: String, default: '#00000' },
    websiteLogoImageURL: { type: String, default: '' },
    websiteBannerImageURL: { type: String, default: '' },
    websiteTitle: { type: String, default: '' },
    websiteSubTitle: { type: String, default: '' },
    websiteButtonText: { type: String, default: '' },
    websiteButtonTextURL: { type: String, default: '' },
    productText: { type: String, default: '' },
    serviceText: { type: String, default: '' },
    hourText: { type: String, default: '' },
    hourPara: { type: String, default: '' },
    contactText: { type: String, default: '' },
    contactPara: { type: String, default: '' },
    appearanceBarText: { type: String, default: '' },
    appearanceBarPara: { type: String, default: '' },
    workHour: [{
        day: { type: String, default: '' },
        slot: {
            startTime: { type: String, default: '' },
            endTime: { type: String, default: '' }
        },
        isAvailable: { type: Boolean, default: false },
    }],

    productContainerTopText: { type: String, default: '' },
    ourServicesContanerTopText: { type: String, default: '' },
    ourServicesContaner: [{
        icon_name: { type: String, default: '' },
        title: { type: String, default: '' },
        subTitle: { type: String, default: '' },
    }],

    HOPTopLeftContentText: { type: String, default: '' },
    HOPTopLeftContentSubText: { type: String, default: '' },
    HOPLeftContentContainer: [{
        icon_name: { type: String, default: '' },
        title: { type: String, default: '' },
        subTitle: { type: String, default: '' },
    }],

    HOPTopLeftContentText: { type: String, default: '' },
    HOPTopLeftContentSubText: { type: String, default: '' },
    HOPTopLeftButtonTextURL: { type: String, default: '' },
    HOPTopText: { type: String, default: '' },
    HOPTopSubText: { type: String, default: '' },
    HOPContainer: [{
        icon_name: { type: String, default: '' },
        title: { type: String, default: '' },
        subTitle: { type: String, default: '' },
    }],

    footerContainerTopText: { type: String, default: '' },
    footerContainerTopSubText: { type: String, default: '' },
    footerContainer: [{
        icon_name: { type: String, default: '' },
        title: { type: String, default: '' },
        subTitle: { type: String, default: '' },
    }],

    appLogoImageURL: { type: String, default: '' },

    loginTitle: { type: String, default: 'Login' },
    loginSubTitle: { type: String, default: 'Login Sub title' },
    loginButton: { type: String, default: 'Login' },
    loginBackgroundImageURL: { type: String, default: '' },

    registerTitle: { type: String, default: 'Register' },
    registerSubTitle: { type: String, default: 'Register Sub title' },
    registerButton: { type: String, default: 'Register' },
    registerBackgroundImageURL: { type: String, default: '' },

    headerImageURL: { type: String, default: '' },
    stylistHeaderTitle: { type: String, default: 'Stylist' },
    productHeaderTitle: { type: String, default: 'Product' },
    videoHeaderTitle: { type: String, default: 'Video' },

    shopHeaderImageURL: { type: String, default: '' },
    shopScreenHeadingText: { type: String, default: 'Stylist' },
    shopSearchBoxText: { type: String, default: 'Product' },
    shopMyCartText: { type: String, default: 'Video' },
    shopMyOrdersText: { type: String, default: 'Video' },

    profileHeaderImageURL: { type: String, default: '' },
    profileScreenHeadingText: { type: String, default: 'Stylist' },
    profileStylistDetailText: { type: String, default: 'Product' },
    profileSalonDetailText: { type: String, default: 'Video' },
    profilePreviousOrderText: { type: String, default: 'Video' },
    profileLogoutText: { type: String, default: 'Video' },

    type: { type: String, default: '', enum: ['', 'logo', 'login', 'register', 'home', 'video', 'shop', 'profile'] },

    enable: { type: Boolean, default: true },
    salon: { type: Schema.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true, usePushEach: true })

const WebsiteSetting = mongoose.model('WebsiteSetting', WebsiteSettingSchema);

export default WebsiteSetting;
