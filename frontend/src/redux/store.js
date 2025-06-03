import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  changeStatusUserReducer,
  createNewUserReducer,
  deleteUserReducer,
  getUserByTokenReducer,
  getUserListReducer,
  userLoginReducer,
  changePasswordUserReducer,
  changeAdminUserReducer,
  addMessageUserReducer,
  addNotesUserReducer,
  logOutUserReducer,
  myProfileDetailsReducer,
  updatePasswordUserReducer,
  getAppointmentConersionRateReducer,
} from './reducers/userReducers';

import {
  changeAppMenuSettingReducer,
  changeStatusSalonReducer,
  createNewSalonReducer,
  deleteSalonReducer,
  getAllEnabledSalonsReducer,
  getSalonListReducer,
} from './reducers/salonReducers';

import {
  addStylistSettingsReducer,
  changeStatustylistReducer,
  createNewStylistReducer,
  deleteStylistReducer,
  getEnableStylistListReducer,
  getStylistListReducer,
  getStylistSettingsReducer,
} from './reducers/stylistReducers';

import {
  checkInOutReducer,
  getAttendanceListReducer,
  deleteCheckinReducer,
  getStylistSessionsReducer,
  addStylistSessionReducer,
  totalStylistSessionReducer,
} from './reducers/attendanceReducers';

import {
  getAllVideoCategoriesReducer,
  createVideoCategoryReducer,
  videoCategoryStatusReducer,
  deleteVideoCategoryReducer,
  getAllVideosReducer,
  getOneVideoReducer,
  createVideoReducer,
  changeVideoStatusReducer,
  deleteVideoReducer,
} from './reducers/videoReducers';

import {
  addAPaymentReducer,
  addAppOrderReducer,
  addOrderReducer,
  addProductStockReducer,
  cartProductReducer,
  changeOrderStatusReducer,
  changeProductStatusReducer,
  checkOutReducer,
  createProductCategoryReducer,
  createProductReducer,
  deleteProductCategoryReducer,
  deleteProductReducer,
  getAllProductCategoriesReducer,
  getAllProductsReducer,
  getCategoryReducer,
  getEnabledCategoryReducer,
  getOneProductReducer,
  getOrderByIdReducer,
  getOrderHistoryReducer,
  getProductOrderHistoryReducer,
  getSimilarProductReducer,
  productCategoryStatusReducer,
} from './reducers/productReducers';

import { changeStatusSalonStaffReducer, createNewSalonStaffReducer, deleteSalonStaffReducer, getSalonStaffListReducer } from './reducers/salonStaffReducers';

import { changeCompanyStatusReducer, createCompanyReducer, deleteCompanyReducer, getAllCompanyReducer, getAllEnableCompanyReducer } from './reducers/companyReducers';

import { createFormByIndependentAgreementReducer, getFormByIndependentAgreementReducer, getFormByWaierLiabilityReducer } from './reducers/formReducers';

import { changeAppVersionStatusReducer, createAppVersionReducer, deleteAppVersionReducer, getAllAppVersionReducer } from './reducers/appVersionReducers';

import {
  getDahboardCountReducers,
  getCurrentYeartReducers,
  getCurrentAppointmentReducers,
  getRecentAppointmentReducers,
  getUpcomingAppointmentReducers,
  getAdminDashboardReportReducers,
  getSalonAppointmentReportReducers,
  getSalonSubscriptionReportReducers,
} from './reducers/reportReducers';
import { allNotificationsReducer, sendNotificationReducer } from './reducers/notificationReducers';

import {
  changeServiceStatusReducer,
  createServiceReducer,
  deleteServiceReducer,
  getAllServiceReducer,
  getAllEnableServiceReducer,
  getAllServiceCategoriesReducer,
  getAllEnableSubServiceReducer,
  updateRankServiceReducer,
} from './reducers/serviceReducers';
import {
  addBulkAvailabilitysReducer,
  addDailyAvailabilitysReducer,
  addDayAvailabilitysReducer,
  delBlockAvailabilitysReducer,
  getDailyAvailabilitysReducer,
  getUnblockAvailabilitysReducer,
} from './reducers/availabilityReducers';
import {
  addAppointmentReducer,
  addPublicAppointmentReducer,
  appointmentStatusListReducer,
  availabilityAppointmentReducer,
  changeAppointmentReducer,
  confirmAppointmentStatusReducer,
  deleteAppointmentReducer,
  deleteSlotReducer,
  getActivityReducer,
  getBusinessHourReducer,
  getPublicAppointmentReducer,
  getStylistAppointmentReducer,
  updateAppointmentReducer,
} from './reducers/appointmentReducers';
import { addWebsiteContactUsReducer, getWebsiteDataReducer, getWebsiteServiceReducer, websiteDataReducer } from './reducers/websiteSettingReducers';
import {
  activateCouponReducer,
  addCouponReducer,
  deleteCouponReducer,
  getAdminCouponsReducer,
  getAllCouponsReducer,
  verifyCouponsReducer,
} from './reducers/couponReducers';
import {
  addSubscriptionReducer,
  changeStatusSubscriptionReducer,
  deleteSubscriptionReducer,
  getCancelSubscriptionReducer,
  getEnableSubscriptionReducer,
  getSubscriptionDetailsReducer,
  getSubscriptionReducer,
  getTotalPriceReducer,
} from './reducers/subscriptionReducers';
import { activatePromoCodesReducer, addPromCodesReducer } from './reducers/promoCodesReducers';
import {
  activateCouponBookBReducer,
  addCouponBookBReducer,
  deleteCouponBookBReducer,
  getActiveCouponsBookBReducer,
  getAllCouponsBookBReducer,
  verifyCouponsBookBReducer,
} from './reducers/couponBookBReducers';
import { createNewOnBoardUserReducer, onBoardCompleteReducer, paymentOnBoardReducer } from './reducers/onboardingReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userList: getUserListReducer,
  createUser: createNewUserReducer,
  deleteUser: deleteUserReducer,
  changeStatusUser: changeStatusUserReducer,
  getUserInfo: getUserByTokenReducer,
  changePasswordUser: changePasswordUserReducer,
  updatePasswordUser: updatePasswordUserReducer,
  changeAdmin: changeAdminUserReducer,
  changeAppMenuSetting: changeAppMenuSettingReducer,
  sendMessageUser: addMessageUserReducer,
  addNotesUser: addNotesUserReducer,
  myProfileDetails: myProfileDetailsReducer,
	AppointmentConersionRate : getAppointmentConersionRateReducer,
  salonList: getSalonListReducer,
  salonEnabledList: getAllEnabledSalonsReducer,
  createSalon: createNewSalonReducer,
  deleteSalon: deleteSalonReducer,
  changeStatusSalon: changeStatusSalonReducer,

  stylistList: getStylistListReducer,
  enableStylistList: getEnableStylistListReducer,
  createStylist: createNewStylistReducer,
  changeStatustylist: changeStatustylistReducer,
  deleteStylist: deleteStylistReducer,
  getStylistSettings: getStylistSettingsReducer,
  addStylistSettings: addStylistSettingsReducer,

  attendanceList: getAttendanceListReducer,
  checkInOut: checkInOutReducer,
  deleteCheckin: deleteCheckinReducer,
  getStylistSessions: getStylistSessionsReducer,
  addStylistSession: addStylistSessionReducer,
  totalStylistSession: totalStylistSessionReducer,

  // Video reducers
  getAllVideoCategories: getAllVideoCategoriesReducer,
  createVideoCategory: createVideoCategoryReducer,
  videoCategoryStatus: videoCategoryStatusReducer,
  deleteVideoCategory: deleteVideoCategoryReducer,
  getAllVideos: getAllVideosReducer,
  getOneVideo: getOneVideoReducer,
  createVideo: createVideoReducer,
  changeVideoStatus: changeVideoStatusReducer,
  deleteVideo: deleteVideoReducer,

  // Product reducers
  getAllProductCategories: getAllProductCategoriesReducer,
  createProductCategory: createProductCategoryReducer,
  productCategoryStatus: productCategoryStatusReducer,
  deleteProductCategory: deleteProductCategoryReducer,
  getAllProducts: getAllProductsReducer,
  getOneProduct: getOneProductReducer,
  createProduct: createProductReducer,
  changeProductStatus: changeProductStatusReducer,
  deleteProduct: deleteProductReducer,
  addProductStock: addProductStockReducer,
  orderList: getProductOrderHistoryReducer,
  changeOrderStatus: changeOrderStatusReducer,

  cartProducts: cartProductReducer,
  getSimilarProducts: getSimilarProductReducer,
  getEnabledCategory: getEnabledCategoryReducer,
  getCategory: getCategoryReducer,
  addOrder: addOrderReducer,
  checkout: checkOutReducer,
  getOrderHistory: getOrderHistoryReducer,
  getOrderById: getOrderByIdReducer,
  addAPayment: addAPaymentReducer,

  //Salon staff reducers
  salonStaffList: getSalonStaffListReducer,
  createSalonStaff: createNewSalonStaffReducer,
  deleteSalonStaff: deleteSalonStaffReducer,
  changeStatusSalonStaff: changeStatusSalonStaffReducer,

  //Company reducers
  companyList: getAllCompanyReducer,
  enableComanyList: getAllEnableCompanyReducer,
  createCompany: createCompanyReducer,
  changeCompanyStatus: changeCompanyStatusReducer,
  deleteCompany: deleteCompanyReducer,

  //agreement forms
  getFormByWaierLiability: getFormByWaierLiabilityReducer,
  createFormByIndependentAgreement: createFormByIndependentAgreementReducer,
  getFormByIndependentAgreement: getFormByIndependentAgreementReducer,

  //App versions
  appVersionList: getAllAppVersionReducer,
  createAppVersion: createAppVersionReducer,
  changeAppVersionStatus: changeAppVersionStatusReducer,
  deleteAppVersion: deleteAppVersionReducer,

  //Reports Get Session Report by month
  getDahboardCount: getDahboardCountReducers,
  allNotifications: allNotificationsReducer,
  sendNotification: sendNotificationReducer,
  getCurrentYear: getCurrentYeartReducers,
  getCurrentAppointment: getCurrentAppointmentReducers,
  getRecentAppointment: getRecentAppointmentReducers,
  getUpcomingAppointment: getUpcomingAppointmentReducers,
  getAdminDashboardReport: getAdminDashboardReportReducers,
  getSalonAppointmentReport: getSalonAppointmentReportReducers,
  getSalonSubscriptionReport: getSalonSubscriptionReportReducers,

  //Service reducers
  serviceList: getAllServiceReducer,
  enableServiceList: getAllEnableServiceReducer,
  createService: createServiceReducer,
  changeServiceStatus: changeServiceStatusReducer,
  deleteService: deleteServiceReducer,
  getAllServiceCategories: getAllServiceCategoriesReducer,
  enableSubServiceList: getAllEnableSubServiceReducer,
  updateRankService: updateRankServiceReducer,

  //BookB Coupons
  getAllCouponsBookB: getAllCouponsBookBReducer,
  getActiveCoupons: getActiveCouponsBookBReducer,
  addCouponBookB: addCouponBookBReducer,
  activateCouponBookB: activateCouponBookBReducer,
  deleteCouponBookB: deleteCouponBookBReducer,
  verfifyCouponBookB: verifyCouponsBookBReducer,

  //Coupons
  getAllCoupons: getAllCouponsReducer,
  addCoupon: addCouponReducer,
  activateCoupon: activateCouponReducer,
  deleteCoupon: deleteCouponReducer,
  verfifyCoupon: verifyCouponsReducer,

  // Availabilities reducers
  getDailyAvailabilitys: getDailyAvailabilitysReducer,
  addDailyAvailabilitys: addDailyAvailabilitysReducer,
  addBulkAvailabilitys: addBulkAvailabilitysReducer,
  addDayAvailabilitys: addDayAvailabilitysReducer,
  getUnblockAvailabilitys: getUnblockAvailabilitysReducer,
  delBlockAvailabilitys: delBlockAvailabilitysReducer,

  //Appointment reducers
  addAppointment: addAppointmentReducer,
  getPublicAppointment: getPublicAppointmentReducer,
  updateAppointment: updateAppointmentReducer,
  deleteAppointment: deleteAppointmentReducer,
  deleteSlot: deleteSlotReducer,
  confirmAppointment: confirmAppointmentStatusReducer,
  publicAddAppointment: addPublicAppointmentReducer,
  getBusinessHour: getBusinessHourReducer,
  getActivity: getActivityReducer,

  //waitlist
  appointmentStatusList: appointmentStatusListReducer,
  availabilityAppointment: availabilityAppointmentReducer,
  changeAppointmentStatus: changeAppointmentReducer,

  //website
  publicWebsite: websiteDataReducer,
  getPublicWebsite: getWebsiteDataReducer,
  getWebsiteService: getWebsiteServiceReducer,

  //subscription
  addSubscription: addSubscriptionReducer,
  getSubscription: getSubscriptionReducer,
  changeStatusSubscription: changeStatusSubscriptionReducer,
  deleteSubscription: deleteSubscriptionReducer,
  getEnableSubscription: getEnableSubscriptionReducer,
  getTotalPrice: getTotalPriceReducer,
  getAdminCoupon: getAdminCouponsReducer,
  getStylistAppointment: getStylistAppointmentReducer,
  addWebsiteContactUs: addWebsiteContactUsReducer,
  addAppOrder: addAppOrderReducer,
  cancelSubscription: getCancelSubscriptionReducer,
  getSubscriptionDetail: getSubscriptionDetailsReducer,

  //promoCodes
  activatePromoCodes: activatePromoCodesReducer,
  addPromCodes: addPromCodesReducer,

  // onBoard
  onBoardRegister: createNewOnBoardUserReducer,
  onBoardPayment: paymentOnBoardReducer,
  onBoardComplete: createNewOnBoardUserReducer,

  logOutUser: logOutUserReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
const websiteInfoFromStorage = localStorage.getItem('websiteInfo') ? JSON.parse(localStorage.getItem('websiteInfo')) : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  getPublicWebsite: { websiteInfo: websiteInfoFromStorage },
  cartProducts: {
    products: localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [],
    cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
  },
  checkout: { cart: localStorage.getItem('checkout') ? JSON.parse(localStorage.getItem('checkout')) : [] },
};
const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
