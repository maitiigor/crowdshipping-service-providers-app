import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager, Platform } from "react-native";

// Static imports for all translation files
// English
import enAddPackage from "../locales/en/add-package.json";
import enBids from "../locales/en/bids.json";
import enBookingHistory from "../locales/en/booking-history.json";
import enComplaints from "../locales/en/complaints.json";
import enConfirmationCode from "../locales/en/confirmation-code.json";
import enDashboard from "../locales/en/dashboard.json";
import enEditDocument from "../locales/en/edit-document.json";
import enEditProfile from "../locales/en/edit-profile.json";
import enForgetPassword from "../locales/en/forget-password.json";
import enInbox from "../locales/en/inbox.json";
import enLogin from "../locales/en/login.json";
import enNotifications from "../locales/en/notifications.json";
import enPaymentLogs from "../locales/en/payment-logs.json";
import enPrivacyPolicy from "../locales/en/privacy-policy.json";
import enReports from "../locales/en/reports.json";
import enResetPassword from "../locales/en/reset-password.json";
import enSettings from "../locales/en/settings.json";
import enSidebar from "../locales/en/sidebar.json";
import enSignupConfirmCode from "../locales/en/signup-confirm-code.json";
import enSignup from "../locales/en/signup.json";
import enTermsOfService from "../locales/en/terms-of-service.json";
import enTrackOrder from "../locales/en/track-order.json";
import enTripDetails from "../locales/en/trip-details.json";
import enTrips from "../locales/en/trips.json";
import enUserProfileSetup from "../locales/en/user-profile-setup.json";
import enWelcome from "../locales/en/welcome.json";

// Spanish
import esAddPackage from "../locales/es/add-package.json";
import esBids from "../locales/es/bids.json";
import esBookingHistory from "../locales/es/booking-history.json";
import esComplaints from "../locales/es/complaints.json";
import esConfirmationCode from "../locales/es/confirmation-code.json";
import esDashboard from "../locales/es/dashboard.json";
import esEditDocument from "../locales/es/edit-document.json";
import esEditProfile from "../locales/es/edit-profile.json";
import esForgetPassword from "../locales/es/forget-password.json";
import esInbox from "../locales/es/inbox.json";
import esLogin from "../locales/es/login.json";
import esNotifications from "../locales/es/notifications.json";
import esPaymentLogs from "../locales/es/payment-logs.json";
import esPrivacyPolicy from "../locales/es/privacy-policy.json";
import esReports from "../locales/es/reports.json";
import esResetPassword from "../locales/es/reset-password.json";
import esSettings from "../locales/es/settings.json";
import esSidebar from "../locales/es/sidebar.json";
import esSignupConfirmCode from "../locales/es/signup-confirm-code.json";
import esSignup from "../locales/es/signup.json";
import esTermsOfService from "../locales/es/terms-of-service.json";
import esTrackOrder from "../locales/es/track-order.json";
import esTripDetails from "../locales/es/trip-details.json";
import esTrips from "../locales/es/trips.json";
import esUserProfileSetup from "../locales/es/user-profile-setup.json";
import esWelcome from "../locales/es/welcome.json";

// French
import frAddPackage from "../locales/fr/add-package.json";
import frBids from "../locales/fr/bids.json";
import frBookingHistory from "../locales/fr/booking-history.json";
import frComplaints from "../locales/fr/complaints.json";
import frConfirmationCode from "../locales/fr/confirmation-code.json";
import frDashboard from "../locales/fr/dashboard.json";
import frEditDocument from "../locales/fr/edit-document.json";
import frEditProfile from "../locales/fr/edit-profile.json";
import frForgetPassword from "../locales/fr/forget-password.json";
import frInbox from "../locales/fr/inbox.json";
import frLogin from "../locales/fr/login.json";
import frNotifications from "../locales/fr/notifications.json";
import frPaymentLogs from "../locales/fr/payment-logs.json";
import frPrivacyPolicy from "../locales/fr/privacy-policy.json";
import frReports from "../locales/fr/reports.json";
import frResetPassword from "../locales/fr/reset-password.json";
import frSettings from "../locales/fr/settings.json";
import frSidebar from "../locales/fr/sidebar.json";
import frSignupConfirmCode from "../locales/fr/signup-confirm-code.json";
import frSignup from "../locales/fr/signup.json";
import frTermsOfService from "../locales/fr/terms-of-service.json";
import frTrackOrder from "../locales/fr/track-order.json";
import frTripDetails from "../locales/fr/trip-details.json";
import frTrips from "../locales/fr/trips.json";
import frUserProfileSetup from "../locales/fr/user-profile-setup.json";
import frWelcome from "../locales/fr/welcome.json";

// German
import deAddPackage from "../locales/de/add-package.json";
import deBids from "../locales/de/bids.json";
import deBookingHistory from "../locales/de/booking-history.json";
import deComplaints from "../locales/de/complaints.json";
import deConfirmationCode from "../locales/de/confirmation-code.json";
import deDashboard from "../locales/de/dashboard.json";
import deEditDocument from "../locales/de/edit-document.json";
import deEditProfile from "../locales/de/edit-profile.json";
import deForgetPassword from "../locales/de/forget-password.json";
import deInbox from "../locales/de/inbox.json";
import deLogin from "../locales/de/login.json";
import deNotifications from "../locales/de/notifications.json";
import dePaymentLogs from "../locales/de/payment-logs.json";
import dePrivacyPolicy from "../locales/de/privacy-policy.json";
import deReports from "../locales/de/reports.json";
import deResetPassword from "../locales/de/reset-password.json";
import deSettings from "../locales/de/settings.json";
import deSidebar from "../locales/de/sidebar.json";
import deSignupConfirmCode from "../locales/de/signup-confirm-code.json";
import deSignup from "../locales/de/signup.json";
import deTermsOfService from "../locales/de/terms-of-service.json";
import deTrackOrder from "../locales/de/track-order.json";
import deTripDetails from "../locales/de/trip-details.json";
import deTrips from "../locales/de/trips.json";
import deUserProfileSetup from "../locales/de/user-profile-setup.json";
import deWelcome from "../locales/de/welcome.json";

// Hindi
import hiAddPackage from "../locales/hi/add-package.json";
import hiBids from "../locales/hi/bids.json";
import hiBookingHistory from "../locales/hi/booking-history.json";
import hiComplaints from "../locales/hi/complaints.json";
import hiConfirmationCode from "../locales/hi/confirmation-code.json";
import hiDashboard from "../locales/hi/dashboard.json";
import hiEditDocument from "../locales/hi/edit-document.json";
import hiEditProfile from "../locales/hi/edit-profile.json";
import hiForgetPassword from "../locales/hi/forget-password.json";
import hiInbox from "../locales/hi/inbox.json";
import hiLogin from "../locales/hi/login.json";
import hiNotifications from "../locales/hi/notifications.json";
import hiPaymentLogs from "../locales/hi/payment-logs.json";
import hiPrivacyPolicy from "../locales/hi/privacy-policy.json";
import hiReports from "../locales/hi/reports.json";
import hiResetPassword from "../locales/hi/reset-password.json";
import hiSettings from "../locales/hi/settings.json";
import hiSidebar from "../locales/hi/sidebar.json";
import hiSignupConfirmCode from "../locales/hi/signup-confirm-code.json";
import hiSignup from "../locales/hi/signup.json";
import hiTermsOfService from "../locales/hi/terms-of-service.json";
import hiTrackOrder from "../locales/hi/track-order.json";
import hiTripDetails from "../locales/hi/trip-details.json";
import hiTrips from "../locales/hi/trips.json";
import hiUserProfileSetup from "../locales/hi/user-profile-setup.json";
import hiWelcome from "../locales/hi/welcome.json";

// Korean
import koAddPackage from "../locales/ko/add-package.json";
import koBids from "../locales/ko/bids.json";
import koBookingHistory from "../locales/ko/booking-history.json";
import koComplaints from "../locales/ko/complaints.json";
import koConfirmationCode from "../locales/ko/confirmation-code.json";
import koDashboard from "../locales/ko/dashboard.json";
import koEditDocument from "../locales/ko/edit-document.json";
import koEditProfile from "../locales/ko/edit-profile.json";
import koForgetPassword from "../locales/ko/forget-password.json";
import koInbox from "../locales/ko/inbox.json";
import koLogin from "../locales/ko/login.json";
import koNotifications from "../locales/ko/notifications.json";
import koPaymentLogs from "../locales/ko/payment-logs.json";
import koPrivacyPolicy from "../locales/ko/privacy-policy.json";
import koReports from "../locales/ko/reports.json";
import koResetPassword from "../locales/ko/reset-password.json";
import koSettings from "../locales/ko/settings.json";
import koSidebar from "../locales/ko/sidebar.json";
import koSignupConfirmCode from "../locales/ko/signup-confirm-code.json";
import koSignup from "../locales/ko/signup.json";
import koTermsOfService from "../locales/ko/terms-of-service.json";
import koTrackOrder from "../locales/ko/track-order.json";
import koTripDetails from "../locales/ko/trip-details.json";
import koTrips from "../locales/ko/trips.json";
import koUserProfileSetup from "../locales/ko/user-profile-setup.json";
import koWelcome from "../locales/ko/welcome.json";

// Chinese
import zhAddPackage from "../locales/zh/add-package.json";
import zhBids from "../locales/zh/bids.json";
import zhBookingHistory from "../locales/zh/booking-history.json";
import zhComplaints from "../locales/zh/complaints.json";
import zhConfirmationCode from "../locales/zh/confirmation-code.json";
import zhDashboard from "../locales/zh/dashboard.json";
import zhEditDocument from "../locales/zh/edit-document.json";
import zhEditProfile from "../locales/zh/edit-profile.json";
import zhForgetPassword from "../locales/zh/forget-password.json";
import zhInbox from "../locales/zh/inbox.json";
import zhLogin from "../locales/zh/login.json";
import zhNotifications from "../locales/zh/notifications.json";
import zhPaymentLogs from "../locales/zh/payment-logs.json";
import zhPrivacyPolicy from "../locales/zh/privacy-policy.json";
import zhReports from "../locales/zh/reports.json";
import zhResetPassword from "../locales/zh/reset-password.json";
import zhSettings from "../locales/zh/settings.json";
import zhSidebar from "../locales/zh/sidebar.json";
import zhSignupConfirmCode from "../locales/zh/signup-confirm-code.json";
import zhSignup from "../locales/zh/signup.json";
import zhTermsOfService from "../locales/zh/terms-of-service.json";
import zhTrackOrder from "../locales/zh/track-order.json";
import zhTripDetails from "../locales/zh/trip-details.json";
import zhTrips from "../locales/zh/trips.json";
import zhUserProfileSetup from "../locales/zh/user-profile-setup.json";
import zhWelcome from "../locales/zh/welcome.json";

// Japanese
import jaAddPackage from "../locales/ja/add-package.json";
import jaBids from "../locales/ja/bids.json";
import jaBookingHistory from "../locales/ja/booking-history.json";
import jaComplaints from "../locales/ja/complaints.json";
import jaConfirmationCode from "../locales/ja/confirmation-code.json";
import jaDashboard from "../locales/ja/dashboard.json";
import jaEditDocument from "../locales/ja/edit-document.json";
import jaEditProfile from "../locales/ja/edit-profile.json";
import jaForgetPassword from "../locales/ja/forget-password.json";
import jaInbox from "../locales/ja/inbox.json";
import jaLogin from "../locales/ja/login.json";
import jaNotifications from "../locales/ja/notifications.json";
import jaPaymentLogs from "../locales/ja/payment-logs.json";
import jaPrivacyPolicy from "../locales/ja/privacy-policy.json";
import jaReports from "../locales/ja/reports.json";
import jaResetPassword from "../locales/ja/reset-password.json";
import jaSettings from "../locales/ja/settings.json";
import jaSidebar from "../locales/ja/sidebar.json";
import jaSignupConfirmCode from "../locales/ja/signup-confirm-code.json";
import jaSignup from "../locales/ja/signup.json";
import jaTermsOfService from "../locales/ja/terms-of-service.json";
import jaTrackOrder from "../locales/ja/track-order.json";
import jaTripDetails from "../locales/ja/trip-details.json";
import jaTrips from "../locales/ja/trips.json";
import jaUserProfileSetup from "../locales/ja/user-profile-setup.json";
import jaWelcome from "../locales/ja/welcome.json";

// Arabic
import arAddPackage from "../locales/ar/add-package.json";
import arBids from "../locales/ar/bids.json";
import arBookingHistory from "../locales/ar/booking-history.json";
import arComplaints from "../locales/ar/complaints.json";
import arConfirmationCode from "../locales/ar/confirmation-code.json";
import arDashboard from "../locales/ar/dashboard.json";
import arEditDocument from "../locales/ar/edit-document.json";
import arEditProfile from "../locales/ar/edit-profile.json";
import arForgetPassword from "../locales/ar/forget-password.json";
import arInbox from "../locales/ar/inbox.json";
import arLogin from "../locales/ar/login.json";
import arNotifications from "../locales/ar/notifications.json";
import arPaymentLogs from "../locales/ar/payment-logs.json";
import arPrivacyPolicy from "../locales/ar/privacy-policy.json";
import arReports from "../locales/ar/reports.json";
import arResetPassword from "../locales/ar/reset-password.json";
import arSettings from "../locales/ar/settings.json";
import arSidebar from "../locales/ar/sidebar.json";
import arSignupConfirmCode from "../locales/ar/signup-confirm-code.json";
import arSignup from "../locales/ar/signup.json";
import arTermsOfService from "../locales/ar/terms-of-service.json";
import arTrackOrder from "../locales/ar/track-order.json";
import arTripDetails from "../locales/ar/trip-details.json";
import arTrips from "../locales/ar/trips.json";
import arUserProfileSetup from "../locales/ar/user-profile-setup.json";
import arWelcome from "../locales/ar/welcome.json";

// Portuguese
import ptAddPackage from "../locales/pt/add-package.json";
import ptBids from "../locales/pt/bids.json";
import ptBookingHistory from "../locales/pt/booking-history.json";
import ptComplaints from "../locales/pt/complaints.json";
import ptConfirmationCode from "../locales/pt/confirmation-code.json";
import ptDashboard from "../locales/pt/dashboard.json";
import ptEditDocument from "../locales/pt/edit-document.json";
import ptEditProfile from "../locales/pt/edit-profile.json";
import ptForgetPassword from "../locales/pt/forget-password.json";
import ptInbox from "../locales/pt/inbox.json";
import ptLogin from "../locales/pt/login.json";
import ptNotifications from "../locales/pt/notifications.json";
import ptPaymentLogs from "../locales/pt/payment-logs.json";
import ptPrivacyPolicy from "../locales/pt/privacy-policy.json";
import ptReports from "../locales/pt/reports.json";
import ptResetPassword from "../locales/pt/reset-password.json";
import ptSettings from "../locales/pt/settings.json";
import ptSidebar from "../locales/pt/sidebar.json";
import ptSignupConfirmCode from "../locales/pt/signup-confirm-code.json";
import ptSignup from "../locales/pt/signup.json";
import ptTermsOfService from "../locales/pt/terms-of-service.json";
import ptTrackOrder from "../locales/pt/track-order.json";
import ptTripDetails from "../locales/pt/trip-details.json";
import ptTrips from "../locales/pt/trips.json";
import ptUserProfileSetup from "../locales/pt/user-profile-setup.json";
import ptWelcome from "../locales/pt/welcome.json";

// Russian
import ruAddPackage from "../locales/ru/add-package.json";
import ruBids from "../locales/ru/bids.json";
import ruBookingHistory from "../locales/ru/booking-history.json";
import ruComplaints from "../locales/ru/complaints.json";
import ruConfirmationCode from "../locales/ru/confirmation-code.json";
import ruDashboard from "../locales/ru/dashboard.json";
import ruEditDocument from "../locales/ru/edit-document.json";
import ruEditProfile from "../locales/ru/edit-profile.json";
import ruForgetPassword from "../locales/ru/forget-password.json";
import ruInbox from "../locales/ru/inbox.json";
import ruLogin from "../locales/ru/login.json";
import ruNotifications from "../locales/ru/notifications.json";
import ruPaymentLogs from "../locales/ru/payment-logs.json";
import ruPrivacyPolicy from "../locales/ru/privacy-policy.json";
import ruReports from "../locales/ru/reports.json";
import ruResetPassword from "../locales/ru/reset-password.json";
import ruSettings from "../locales/ru/settings.json";
import ruSidebar from "../locales/ru/sidebar.json";
import ruSignupConfirmCode from "../locales/ru/signup-confirm-code.json";
import ruSignup from "../locales/ru/signup.json";
import ruTermsOfService from "../locales/ru/terms-of-service.json";
import ruTrackOrder from "../locales/ru/track-order.json";
import ruTripDetails from "../locales/ru/trip-details.json";
import ruTrips from "../locales/ru/trips.json";
import ruUserProfileSetup from "../locales/ru/user-profile-setup.json";
import ruWelcome from "../locales/ru/welcome.json";

const resources = {
  en: {
    translation: {
      login: enLogin,
      signup: enSignup,
      welcome: enWelcome,
      "forget-password": enForgetPassword,
      "reset-password": enResetPassword,
      "signup-confirm-code": enSignupConfirmCode,
      "confirmation-code": enConfirmationCode,
      "user-profile-setup": enUserProfileSetup,
      "privacy-policy": enPrivacyPolicy,
      "terms-of-service": enTermsOfService,
      "booking-history": enBookingHistory,
      bids: enBids,
      trips: enTrips,
      "trip-details": enTripDetails,
      "track-order": enTrackOrder,
      inbox: enInbox,
      notifications: enNotifications,
      "payment-logs": enPaymentLogs,
      reports: enReports,
      complaints: enComplaints,
      settings: enSettings,
      sidebar: enSidebar,
      "add-package": enAddPackage,
      dashboard: enDashboard,
      "edit-profile": enEditProfile,
      "edit-document": enEditDocument,
    },
  },
  es: {
    translation: {
      login: esLogin,
      signup: esSignup,
      welcome: esWelcome,
      "forget-password": esForgetPassword,
      "reset-password": esResetPassword,
      "signup-confirm-code": esSignupConfirmCode,
      "confirmation-code": esConfirmationCode,
      "user-profile-setup": esUserProfileSetup,
      "privacy-policy": esPrivacyPolicy,
      "terms-of-service": esTermsOfService,
      "booking-history": esBookingHistory,
      bids: esBids,
      trips: esTrips,
      "trip-details": esTripDetails,
      "track-order": esTrackOrder,
      inbox: esInbox,
      notifications: esNotifications,
      "payment-logs": esPaymentLogs,
      reports: esReports,
      complaints: esComplaints,
      settings: esSettings,
      sidebar: esSidebar,
      "add-package": esAddPackage,
      dashboard: esDashboard,
      "edit-profile": esEditProfile,
      "edit-document": esEditDocument,
    },
  },
  fr: {
    translation: {
      login: frLogin,
      signup: frSignup,
      welcome: frWelcome,
      "forget-password": frForgetPassword,
      "reset-password": frResetPassword,
      "signup-confirm-code": frSignupConfirmCode,
      "confirmation-code": frConfirmationCode,
      "user-profile-setup": frUserProfileSetup,
      "privacy-policy": frPrivacyPolicy,
      "terms-of-service": frTermsOfService,
      "booking-history": frBookingHistory,
      bids: frBids,
      trips: frTrips,
      "trip-details": frTripDetails,
      "track-order": frTrackOrder,
      inbox: frInbox,
      notifications: frNotifications,
      "payment-logs": frPaymentLogs,
      reports: frReports,
      complaints: frComplaints,
      settings: frSettings,
      sidebar: frSidebar,
      "add-package": frAddPackage,
      dashboard: frDashboard,
      "edit-profile": frEditProfile,
      "edit-document": frEditDocument,
    },
  },
  de: {
    translation: {
      login: deLogin,
      signup: deSignup,
      welcome: deWelcome,
      "forget-password": deForgetPassword,
      "reset-password": deResetPassword,
      "signup-confirm-code": deSignupConfirmCode,
      "confirmation-code": deConfirmationCode,
      "user-profile-setup": deUserProfileSetup,
      "privacy-policy": dePrivacyPolicy,
      "terms-of-service": deTermsOfService,
      "booking-history": deBookingHistory,
      bids: deBids,
      trips: deTrips,
      "trip-details": deTripDetails,
      "track-order": deTrackOrder,
      inbox: deInbox,
      notifications: deNotifications,
      "payment-logs": dePaymentLogs,
      reports: deReports,
      complaints: deComplaints,
      settings: deSettings,
      sidebar: deSidebar,
      "add-package": deAddPackage,
      dashboard: deDashboard,
      "edit-profile": deEditProfile,
      "edit-document": deEditDocument,
    },
  },
  hi: {
    translation: {
      login: hiLogin,
      signup: hiSignup,
      welcome: hiWelcome,
      "forget-password": hiForgetPassword,
      "reset-password": hiResetPassword,
      "signup-confirm-code": hiSignupConfirmCode,
      "confirmation-code": hiConfirmationCode,
      "user-profile-setup": hiUserProfileSetup,
      "privacy-policy": hiPrivacyPolicy,
      "terms-of-service": hiTermsOfService,
      "booking-history": hiBookingHistory,
      bids: hiBids,
      trips: hiTrips,
      "trip-details": hiTripDetails,
      "track-order": hiTrackOrder,
      inbox: hiInbox,
      notifications: hiNotifications,
      "payment-logs": hiPaymentLogs,
      reports: hiReports,
      complaints: hiComplaints,
      settings: hiSettings,
      sidebar: hiSidebar,
      "add-package": hiAddPackage,
      dashboard: hiDashboard,
      "edit-profile": hiEditProfile,
      "edit-document": hiEditDocument,
    },
  },
  ko: {
    translation: {
      login: koLogin,
      signup: koSignup,
      welcome: koWelcome,
      "forget-password": koForgetPassword,
      "reset-password": koResetPassword,
      "signup-confirm-code": koSignupConfirmCode,
      "confirmation-code": koConfirmationCode,
      "user-profile-setup": koUserProfileSetup,
      "privacy-policy": koPrivacyPolicy,
      "terms-of-service": koTermsOfService,
      "booking-history": koBookingHistory,
      bids: koBids,
      trips: koTrips,
      "trip-details": koTripDetails,
      "track-order": koTrackOrder,
      inbox: koInbox,
      notifications: koNotifications,
      "payment-logs": koPaymentLogs,
      reports: koReports,
      complaints: koComplaints,
      settings: koSettings,
      sidebar: koSidebar,
      "add-package": koAddPackage,
      dashboard: koDashboard,
      "edit-profile": koEditProfile,
      "edit-document": koEditDocument,
    },
  },
  zh: {
    translation: {
      login: zhLogin,
      signup: zhSignup,
      welcome: zhWelcome,
      "forget-password": zhForgetPassword,
      "reset-password": zhResetPassword,
      "signup-confirm-code": zhSignupConfirmCode,
      "confirmation-code": zhConfirmationCode,
      "user-profile-setup": zhUserProfileSetup,
      "privacy-policy": zhPrivacyPolicy,
      "terms-of-service": zhTermsOfService,
      "booking-history": zhBookingHistory,
      bids: zhBids,
      trips: zhTrips,
      "trip-details": zhTripDetails,
      "track-order": zhTrackOrder,
      inbox: zhInbox,
      notifications: zhNotifications,
      "payment-logs": zhPaymentLogs,
      reports: zhReports,
      complaints: zhComplaints,
      settings: zhSettings,
      sidebar: zhSidebar,
      "add-package": zhAddPackage,
      dashboard: zhDashboard,
      "edit-profile": zhEditProfile,
      "edit-document": zhEditDocument,
    },
  },
  ja: {
    translation: {
      login: jaLogin,
      signup: jaSignup,
      welcome: jaWelcome,
      "forget-password": jaForgetPassword,
      "reset-password": jaResetPassword,
      "signup-confirm-code": jaSignupConfirmCode,
      "confirmation-code": jaConfirmationCode,
      "user-profile-setup": jaUserProfileSetup,
      "privacy-policy": jaPrivacyPolicy,
      "terms-of-service": jaTermsOfService,
      "booking-history": jaBookingHistory,
      bids: jaBids,
      trips: jaTrips,
      "trip-details": jaTripDetails,
      "track-order": jaTrackOrder,
      inbox: jaInbox,
      notifications: jaNotifications,
      "payment-logs": jaPaymentLogs,
      reports: jaReports,
      complaints: jaComplaints,
      settings: jaSettings,
      sidebar: jaSidebar,
      "add-package": jaAddPackage,
      dashboard: jaDashboard,
      "edit-profile": jaEditProfile,
      "edit-document": jaEditDocument,
    },
  },
  ar: {
    translation: {
      login: arLogin,
      signup: arSignup,
      welcome: arWelcome,
      "forget-password": arForgetPassword,
      "reset-password": arResetPassword,
      "signup-confirm-code": arSignupConfirmCode,
      "confirmation-code": arConfirmationCode,
      "user-profile-setup": arUserProfileSetup,
      "privacy-policy": arPrivacyPolicy,
      "terms-of-service": arTermsOfService,
      "booking-history": arBookingHistory,
      bids: arBids,
      trips: arTrips,
      "trip-details": arTripDetails,
      "track-order": arTrackOrder,
      inbox: arInbox,
      notifications: arNotifications,
      "payment-logs": arPaymentLogs,
      reports: arReports,
      complaints: arComplaints,
      settings: arSettings,
      sidebar: arSidebar,
      "add-package": arAddPackage,
      dashboard: arDashboard,
      "edit-profile": arEditProfile,
      "edit-document": arEditDocument,
    },
  },
  pt: {
    translation: {
      login: ptLogin,
      signup: ptSignup,
      welcome: ptWelcome,
      "forget-password": ptForgetPassword,
      "reset-password": ptResetPassword,
      "signup-confirm-code": ptSignupConfirmCode,
      "confirmation-code": ptConfirmationCode,
      "user-profile-setup": ptUserProfileSetup,
      "privacy-policy": ptPrivacyPolicy,
      "terms-of-service": ptTermsOfService,
      "booking-history": ptBookingHistory,
      bids: ptBids,
      trips: ptTrips,
      "trip-details": ptTripDetails,
      "track-order": ptTrackOrder,
      inbox: ptInbox,
      notifications: ptNotifications,
      "payment-logs": ptPaymentLogs,
      reports: ptReports,
      complaints: ptComplaints,
      settings: ptSettings,
      sidebar: ptSidebar,
      "add-package": ptAddPackage,
      dashboard: ptDashboard,
      "edit-profile": ptEditProfile,
      "edit-document": ptEditDocument,
    },
  },
  ru: {
    translation: {
      login: ruLogin,
      signup: ruSignup,
      welcome: ruWelcome,
      "forget-password": ruForgetPassword,
      "reset-password": ruResetPassword,
      "signup-confirm-code": ruSignupConfirmCode,
      "confirmation-code": ruConfirmationCode,
      "user-profile-setup": ruUserProfileSetup,
      "privacy-policy": ruPrivacyPolicy,
      "terms-of-service": ruTermsOfService,
      "booking-history": ruBookingHistory,
      bids: ruBids,
      trips: ruTrips,
      "trip-details": ruTripDetails,
      "track-order": ruTrackOrder,
      inbox: ruInbox,
      notifications: ruNotifications,
      "payment-logs": ruPaymentLogs,
      reports: ruReports,
      complaints: ruComplaints,
      settings: ruSettings,
      sidebar: ruSidebar,
      "add-package": ruAddPackage,
      dashboard: ruDashboard,
      "edit-profile": ruEditProfile,
      "edit-document": ruEditDocument,
    },
  },
} as const;

export const LANGUAGE_STORAGE_KEY = "app_language";

async function detectLanguage(): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved) return saved;
  } catch {}
  const locales = Localization.getLocales?.();
  const best =
    locales && locales.length > 0 ? locales[0].languageCode ?? "en" : "en";
  // Normalize like en-US -> en, fr-FR -> fr, ar-SA -> ar
  const base = (best || "en").split("-")[0];
  return Object.keys(resources).includes(base) ? base : "en";
}

export async function ensureI18n(): Promise<typeof i18next> {
  if (!i18next.isInitialized) {
    const lng = await detectLanguage();
    await i18next.use(initReactI18next).init({
      resources,
      lng,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
    handleRTL(lng);
  }
  return i18next;
}

export function handleRTL(lang: string) {
  const isRTL = lang === "ar";
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // On native, forcing RTL requires one reload to apply fully.
    if (Platform.OS !== "web") {
      // A soft hint; caller can trigger an app reload if desired.
      // You can integrate expo-updates reload if you use it.
    }
  }
}

export async function changeAppLanguage(lang: string) {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  await i18next.changeLanguage(lang);
  handleRTL(lang);
}

export default i18next;
