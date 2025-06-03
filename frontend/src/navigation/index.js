import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

// Screens
import LoginScreen from '../screens/LoginScreen';
import CheckinUserScreen from '../screens/CheckinUserScreen';
import UsersScreen from '../screens/UsersScreen';
import SalonScreen from '../screens/SalonScreen';
import StylistsScreen from '../screens/StylistsScreen';
import VideosScreen from '../screens/VideosScreen';
import VideoCategoriesScreen from '../screens/VideoCategoriesScreen';
import VideoDetailsScreen from '../screens/VideoDetailsScreen';
import ProductsScreen from '../screens/ProductsScreen';
// import MyProfileScreen from '../screens/MyProfileScreen';
import ProductCategoriesScreen from '../screens/ProductsCategoriesScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SalonStaffScreen from '../screens/SalonStaffScreen';
import CompanyScreen from '../screens/CompanyScreen';
import StylistSessionScreen from '../screens/StylistSessionScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import AppVersionScreen from '../screens/AppVersionScreen';
import BookAppointment from '../website/BookAppointment';
import SendNotification from '../screens/SendNotification';
import ServiceScreen from '../screens/ServiceScreen';
import ProductsList from '../website/ProductsList';
import ServiceCategoriesScreen from '../screens/ServiceCategoriesScreen';
import WaitlistModal from '../screens/Waitlist/index';
import AppearanceScreen from '../screens/AppearanceScreen';
import ViewCart from '../website/ViewCart/ViewCart';
import ProductInfo from '../website/ProductInformation/ProductInfo.js';
import Checkout from '../website/Checkout';
import CustomHomeScreen from '../website/CustomHomeScreen';
import UserSignUp from '../website/UserSignUp';
import Coupon from '../screens/Coupon/index';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import Login from '../website/login';
import PageNotFoundScreen from '../website/PageNotFound';
import OrderHistory from '../website/OrderHistory';
import OrderSummary from '../website/OrderSummary';
import DiscountsList from '../website/DiscountsList';
import AppPayment from '../website/AppPayment';
import PromoCodeScreen from '../screens/PromotionCodeScreen';
import CouponBookB from '../screens/CouponBookB';
import OnBoarding from '../screens/Onborading';
import AppSettingScreen from '../screens/AppSettingScreen';
import Dashboard from '../screens/DashboardScreen';
import NewDashBoardScreen from '../screens/NewDashBoardScreen';
import LoginScreenNew from '../screens/LoginScreenNew/';
import NewUsersScreen from '../screens/NewUsersScreen';
import NewNotificationsScreen from '../screens/NewNotificationsScreen';
import NewSubscriptionScreen from '../screens/NewSubscriptionScreen';
import NewPromotionCodeScreen from '../screens/NewPromotionCodeScreen';
import NewAppVersionScreen from '../screens/NewAppVersionScreen';
import NewSalonScreen from '../screens/NewSalonScreen';
import MyProfileScreenNew from '../screens/MyProfileScreen_New';
import NewPorductCategoriesScreen from '../screens/NewProductCategoriesScreen';
import NewOrderHistoryScreen from '../screens/NewOrderHistoryScreen';
import NewProductScreen from '../screens/NewProductScreeen';
import NewStylistScreen from '../screens/NewStylistScreen';
import NewServiceScreen from '../screens/NewServiceScreen';
import NewStylistSessionScreen from '../screens/NewStylistSessionScreen';
import RewardScreen from '../screens/RewardScreen/index.js';

const Navigation = ({ userLogin, socket }) => {
  return (
    <Router>
      {/* <Route exact path="/" component={Dashboard} /> */}
      <Route exact path='/' component={NewDashBoardScreen} />
      <Route exact path='/user' component={UsersScreen} />
      <Route exact path='/check-in' component={CheckinUserScreen} />
      <Route exact path='/login' component={LoginScreenNew} />
      {/* <Route exact path='/login' component={LoginScreen} /> */}
      <Route exact path='/register' component={OnBoarding} />
      <Route exact path='/users' component={NewUsersScreen} />
      {/* <Route exact path='/users' component={UsersScreen} /> */}
      <Route exact path='/user-signup' component={UserSignUp} />
      <Route exact path='/salon' component={NewSalonScreen} />
      <Route exact path='/promo-codes' component={NewPromotionCodeScreen} />
      <Route exact path='/rewards' component={RewardScreen} />
      <Route exact path='/salon-role-manger' component={SalonStaffScreen} />
      <Route exact path='/stylist' component={NewStylistScreen} />
      <Route exact path='/waitlist/:stylistId/:stylistName' component={WaitlistModal} />
      {/* <Route exact path="/stylist-sessions/:stylistId" component={StylistSessionScreen} /> */}
      <Route exact path='/stylist-sessions/:stylistId'>
        <NewStylistSessionScreen  socket={socket}/>
      </Route>
      <Route exact path='/stylist-sessions/:stylistId/:stylistName'>
        <NewStylistSessionScreen  socket={socket}/>
      </Route>
      <Route exact path='/video-categories' component={VideoCategoriesScreen} />
      <Route exact path='/videos' component={VideosScreen} />
      <Route exact path='/videos/:id' component={VideoDetailsScreen} />
      {/* <Route exact path="/product-categories" component={ProductCategoriesScreen} /> */}
      {/* <Route exact path="/product-categories" component={NewPorductCategoriesScreen} /> */}
      {/* <Route exact path="/products" component={ProductsScreen} /> */}
      {/* <Route exact path="/products" component={NewProductScreen} /> */}
      {/* <Route exact path="/order-history" component={OrderHistoryScreen} /> */}
      {/* <Route exact path="/order-history" component={NewOrderHistoryScreen} />
			<Route exact path="/products/:id" component={ProductDetailsScreen} /> */}
      {/* <Route exact path="/my-profile" component={MyProfileScreen} /> */}
      {/* <Route exact path="/my-profile" component={MyProfileScreenNew} /> */}
      <Route exact path='/appversion' component={NewAppVersionScreen} />
      <Route exact path='/product-categories' component={NewPorductCategoriesScreen} />
      <Route exact path='/products' component={NewProductScreen} />
      <Route exact path='/order-history' component={NewOrderHistoryScreen} />
      <Route exact path='/products/:id' component={ProductDetailsScreen} />
      <Route exact path='/my-profile' component={MyProfileScreenNew} />
      {/* <Route exact path="/appversion" component={AppVersionScreen} /> */}
      <Route exact path='/company' component={CompanyScreen} />
      {/* <Route exact path="/notification" component={SendNotification} /> */}
      {/* <Route exact path='/notification' component={NewNotificationsScreen} /> */}
      <Route exact path='/services' component={NewServiceScreen} />
      {/* <Route exact path="/services" component={ServiceScreen} /> */}
      <Route exact path='/website-setting' component={AppearanceScreen} />
      <Route exact path='/coupon' component={Coupon} />
      <Route exact path='/coupon-bookb' component={Coupon} />
      <Route exact path='/subscription' component={NewSubscriptionScreen} />
      <Route exact path='/app-setting' component={AppSettingScreen} />

      {/* website Routes */}
      <Route exact path='/salon/404' component={PageNotFoundScreen} />
      <Route exact path='/salon/:salonId' component={CustomHomeScreen} />
      <Route exact path='/salon/:salonId/book-appointment' component={BookAppointment} />
      {/* <Route exact path='/salon/:salonId/discounts' component={DiscountsList} /> */}
      <Route exact path='/salon/:salonId/products-list' component={ProductsList} />
      <Route exact path='/salon/:salonId/product-info/:id' component={ProductInfo} />
      <Route exact path='/salon/:salonId/checkout' component={Checkout} />
      <Route exact path='/salon/:salonId/login' component={Login} />
      <Route exact path='/salon/:salonId/view-cart' component={ViewCart} />
      <Route exact path='/salon/:salonId/order-history' component={OrderHistory} />
      <Route exact path='/salon/:salonId/order-summary/:orderId' component={OrderSummary} />
      <Route exact path='/salon/:salonId/transaction/:transactionId' component={AppPayment} />

      {/* <Route exact path="/home-screen" component={HomeScreen} /> */}
      {/* <Route exact path="/book-appointment" component={BookAppointment} /> */}
    </Router>
  );
};

export default Navigation;
