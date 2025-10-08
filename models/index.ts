import { Float } from "react-native/Libraries/Types/CodegenTypes";

// User Profile Models
export interface RegistrationPayload {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    accountType: string; // e.g., "user"
}

export interface ApiError {
    code: number;
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    password: string;
    confirmPassword: string;
}

export interface User {
    id: string,
    fullName: string,
    email: string,
    phoneNumber: string,
    role: string,
    lastLogin: string,
    status: string,
    kycStatus: string,
    profilePicUrl: string | null
}


export interface UserProfile {
    _id: string,
    userId: string,
    fullName: string,
    email: string,
    phoneNumber: string,
    role: string,
    isVerfied: false,
    status: string,
    deviceTokens: Array<string>,
    profileId: string,
    walletId: string,
    profile: Profile
    wallet: Wallet
}


interface Profile {
    // _id: string,
    profilePicUrl: string | null,
    country: string,
    address: string,
    city: string,
    state: string,
    gender: string
    location: Location,
}


interface Wallet {
    _id: string,
    walletId: string,
    balance: Float,
    availableBalance: Float
}

export interface PersonalInfo {
    fullName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    country: string;
    gender: string;
    state: string;
    city: string;
    location: string;
    status: string;
    role: string;
    profilePicUrl: string;
    lastLogin: string;
}

export interface DocumentInfo {
    idType: string;
    idNumber: string;
    idFrontImage?: string;
    idBackImage?: string;
    selfieImage?: string;
    isVerified: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
}

export interface OTPVerificationRequest {
    type: "password-reset" | "sign-up",
    otp: string,
    email: string,
}

export interface ResendOTPRequest {
    type: "password-reset" | "sign-up",
    email: string,
}

export interface PaymentInfo {
    bankName: string;
    accountNumber: string;
    accountName: string;
    routingNumber?: string;
    isVerified: boolean;
}

interface Location {
    lat: number;
    lng: number;
    address: string;
}


export interface CompleteProfilePayload {
    accountType: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    // countryCode: string;
    country: string;
    gender: string;
    state: string;
    city: string;
    location: Location;
    identificationType: string;
    licenseNumber: string;
    identificationPicture: string;
    proofOfAddress: string;
    insuranceResidenceProof: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    driverPassport: string;
}

// export interface UserProfile {
//     personalInfo: PersonalInfo;
//     documentInfo: DocumentInfo;
//     paymentInfo: PaymentInfo;
//     profileCompletion: number;
//     isOnboardingComplete: boolean;
// }


export interface LoginFormValues {
    email: string;
    password: string;
}

// Authentication Models
export interface AuthState {
    isAuthenticated: boolean;
    email: string;
    hasLaunched: boolean,
    pin: string;
    isVerified: boolean;
    verificationCode: string;
    verificationCountdown: number;
    lastVerificationAttempt?: Date;
    loginError?: string;
    loading: boolean;
    success: boolean,
    error: Array<any> | null | unknown,
    token: string | null
    user: User,
    userProfile: UserProfile,
    resetToken: string,
}

// Form State Models
export interface FormValidation {
    isValid: boolean;
    errors: Record<string, string>;
}

export interface EditProfileFormState {
    currentStep: number;
    totalSteps: number;
    isLoading: boolean;
    validation: FormValidation;
}

// Dropdown/Select Options
export interface SelectOption {
    label: string;
    value: string;
    flag?: string;
}

export interface DropdownOptions {
    countryCodes: SelectOption[];
    countries: SelectOption[];
    genders: SelectOption[];
    states: SelectOption[];
    cities: SelectOption[];
    idTypes: SelectOption[];
    banks: SelectOption[];
}

// API Models
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string>;
}

export interface VerificationRequest {
    email: string;
    phoneNumber: string;
    countryCode: string;
}

export interface PinVerificationRequest {
    pin: string;
    verificationCode: string;
}

// App State Models
export interface AppNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
}

export interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
}