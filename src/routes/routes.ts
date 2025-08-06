
import TabNavigator from "../navigators/TabNavigator";
import Language from "../screen/Auth/Language";
import OTPVerification from "../screen/Auth/OTPVerification";
import PartnerDocumentsScreen from "../screen/Auth/PartnerDocumentsScreen";
import PartnerInfoForm from "../screen/Auth/PartnerInfoForm";
import PartnerServiceSelectionScreen from "../screen/Auth/PartnerServiceSelectionScreen";
import PhoneLogin from "../screen/Auth/PhoneLogin";
import Splash from "../screen/Auth/Splash";
import EarningsScreen from "../screen/BottamTab/EarningsScreen";
import HomeScreen from "../screen/BottamTab/HomeScreen";
import MyBookingsScreen from "../screen/BottamTab/MyBookingsScreen";
import ProfileSettingsScreen from "../screen/BottamTab/ProfileSettingsScreen";
import HowToUseScreen from "../screen/Feature/HowToUseScreen";
import JobInvoiceScreen from "../screen/Feature/invoiceData";
import JobDetailsScreen from "../screen/Feature/JobDetailsScreen";
import NotificationList from "../screen/Feature/NotificationList";
import HelpSupportScreen from "../screen/Feature/PartnerHelpSupportScreen";
import ReferToEarnScreen from "../screen/Feature/ReferToEarnScreen";
import ScreenNameEnum from "./screenName.enum";


const _routes = {
  REGISTRATION_ROUTE: [
    {
      name: ScreenNameEnum.SPLASH_SCREEN,
      Component: Splash,
    },
   
    {
      name: ScreenNameEnum.LANGUAGE_SELECT,
      Component: Language,
    },
    {
      name: ScreenNameEnum.PhoneLogin,
      Component: PhoneLogin,
    },
    {
      name: ScreenNameEnum.OTPVerification,
      Component: OTPVerification,
    },
    {
      name: ScreenNameEnum.PartnerInfoForm,
      Component: PartnerInfoForm,
    },
    {
      name: ScreenNameEnum.PartnerServiceSelectionScreen,
      Component: PartnerServiceSelectionScreen,
    },
    {
      name: ScreenNameEnum.PartnerDocumentsScreen,
      Component: PartnerDocumentsScreen,
    },
    {
      name: ScreenNameEnum.TabNavigator,
      Component: TabNavigator,
    },
    {
      name: ScreenNameEnum.JobDetailsScreen,
      Component: JobDetailsScreen,
    },
    {
      name: ScreenNameEnum.NotificationList,
      Component: NotificationList,
    },
    {
      name: ScreenNameEnum.JobInvoiceScreen,
      Component: JobInvoiceScreen,
    },
    {
      name: ScreenNameEnum.ReferToEarnScreen,
      Component: ReferToEarnScreen,
    },
    {
      name: ScreenNameEnum.HowToUseScreen,
      Component: HowToUseScreen,
    },
    {
      name: ScreenNameEnum.HelpSupportScreen,
      Component: HelpSupportScreen,
    },
   

  ],





  BOTTOM_TAB: [
    {
      name: 'HOME_SCREEN',
      Component: HomeScreen,
      logo: require('../assets/icons/home.png'), // your home icon
      lable: 'होम'
    },
    {
      name: 'BOOKING_SCREEN',
      Component: MyBookingsScreen,
      logo: require('../assets/icons/lists.png'), // your home icon
      lable: 'बुकिंग्स'
    },
    {
      name: 'WALLET_SCREEN',
      Component: EarningsScreen,
      logo: require('../assets/icons/wallet.png'), // your home icon
      lable: 'कमाई'
    },
    {
      name: 'PROFILE_SCREEN',
      Component: ProfileSettingsScreen,
      logo: require('../assets/icons/setting.png'), // your home icon
      lable: 'सेटिंग्स'
    }



  ]
  


};

export default _routes;
