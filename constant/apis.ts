import { Platform } from "react-native";
// http://localhost:5000
let PRODUCTION = process.env.NODE_ENV === 'development' ? "https://api.easyrojmel.in" : 'https://api.easyrojmel.in'
// https://rojmel-backend-fhd0.onrender.com'
let PATH = Platform.OS === 'web' ? 'http://localhost:5000' : PRODUCTION

// process.env.EXPO_PUBLIC_BACKEND_URL

const API_ROUTE = `${PATH}/${process.env.EXPO_PUBLIC_API_PREFIX}/${process.env.EXPO_PUBLIC_API_VERSION}`


//  auth
const AUTH = 'auth'
export const REGISTER = `${API_ROUTE}/${AUTH}/register`;
export const LOGIN = `${API_ROUTE}/${AUTH}/login`;
export const FORGET_PASSWORD = `${API_ROUTE}/${AUTH}/forgot-password`
export const RESET_PASSWORD = `${API_ROUTE}/${AUTH}/reset-password`


//  heads
const HEADS = 'heads'
export const CREATE_HEADS = `${API_ROUTE}/${HEADS}`;
export const GET_HEADS = `${API_ROUTE}/${HEADS}`;
export const UPDATE_HEADS = `${API_ROUTE}/${HEADS}/`; //:id
export const DELETE_HEAD = `${API_ROUTE}/${HEADS}/`; //:id



// ledgers
const LEDGER = 'ledger'
export const CREATE_LEDGER = `${API_ROUTE}/${LEDGER}`;
export const GET_LEDGER = `${API_ROUTE}/${LEDGER}`;
export const UPDATE_LEDGER = `${API_ROUTE}/${LEDGER}`; // :id
export const DELETE_LEDGER = `${API_ROUTE}/${LEDGER}`; // :id



// Report 
const REPORT = 'reports'
export const DOWNLOAD_REPORT = `${API_ROUTE}/${REPORT}/generate`  // it will take query value


//  Subscrption
const SUBSCRIPTION = 'subscriptions'
export const LIST_SUBSCRIPTION = `${API_ROUTE}/${SUBSCRIPTION}`
export const CREATE_SUBSCRIPTION_ORDER = `${API_ROUTE}/${SUBSCRIPTION}/create-order`
export const PURCHASED_HISTORY = `${API_ROUTE}/${SUBSCRIPTION}/history`

// Static Pages
const CMS = 'cms'
export const ABOUT_US = `${API_ROUTE}/${CMS}/about-us`
export const PRIVACY_POLICY = `${API_ROUTE}/${CMS}/privacy-policy`
export const TERMS_CONDITIONS = `${API_ROUTE}/${CMS}/terms-conditions`

// Profile section
const PROFILE = 'profile' 
export const USER_DETAILS = `${API_ROUTE}/${PROFILE}`
export const FINANCIAL_YEAR_LISTING = `${API_ROUTE}/${PROFILE}/financial-listing`
export const FINANCIAL_YEAR = `${API_ROUTE}/${PROFILE}/financial-year`