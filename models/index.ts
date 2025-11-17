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
    hasLaunched: boolean;
    isRestoring: boolean;
    pin: string;
    isVerified: boolean;
    verificationCode: string;
    verificationCountdown: number;
    lastVerificationAttempt?: Date;
    loginError?: string;
    loading: boolean;
    success: boolean;
    error: Array<any> | null | unknown;
    token: string | null;
    user: User;
    userProfile: UserProfile;
    resetToken: string;
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


export interface Airport {
    iata: string;
    icao: string;
    name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface Capacity {
    pounds: string;
    dimension: string;
}


export interface AirTripRequest {
    departureCity: string;
    departureAirport: Airport;
    arrivalCity: string;
    arrivalAirport: Airport;
    airlineName: string;
    flightNumber: string;
    departureDate: string;
    arrivalDate: string;
    capacity: Capacity;
}




export interface Port {
    name: string;
    nameWoDiacritics: string;
    coordinates: string;
    country: string;
    location: string;
    iata: string;
    icao: string;
}

export interface MarineTripRequest {
    mmsiNumber: string;
    vesselName: string;
    vesselOperator: string;
    containerNumber: string;
    voyageNumber: string;
    departurePort: string;
    arrivalPort: string;
    departureDate: string;
    arrivalDate: string;
    capacity: Capacity;
}

export interface MarineTrip {
    _id: string;
    vesselName: string;
    tripId: string;
    creatorId: string;
    shipId: string;
    fleetType: string;
    containerNumber: string;
    status: string;
    capacity: {
        pounds: number | string;
        dimension: string;
    };
    route: {
        via: string[];
    };
    departurePort: string;
    arrivalPort: string;
    departureDate: string;
    arrivalDate: string;
    createdAt: string;
    updatedAt: string;
    bids_recieved: BidDetail[] | number;
    creator?: {
        _id: string;
        userId: string;
        fullName: string;
    };
    __v?: number;
}


export interface AirTrip {
    _id: string;
    tripId: string;
    creatorId: string;
    flightId: string;
    departureAirport: Airport;
    arrivalAirport: Airport;
    airlineName: string;
    flightNumber: string;
    fleetType: string;
    status: string;
    departureCity: string;
    arrivalCity: string;
    departureDate: string;
    arrivalDate: string;
    createdAt: string;
    updatedAt: string;
    capacity: {
        pounds: number | string;
        dimension: string;
    };



    route: {
        via: string[];
    },
    creator?: {
        _id: string;
        userId: string;
        fullName: string;
    };
    bids_recieved: BidDetail[] | number;
}


export interface Package {
    _id: string;
    productType: string
    productWeight: number;
    productUnit: string;
    productImage: string;
}

export interface BidDetail {
    _id: string;
    dropOffLocation: {
        address: string;
    };
    finalPrice: number;
    packages: Array<Package>;
    pickUpLocation: {
        address: string;
    };
    sender: {
        _id: string;
        fullName: string;
        profile: any;
        profileId: string;
        userId: string;
    };
    senderId: string;
    tripOption: string;
}


export interface VesselOperator {
    name: string;
    scac: string;
    maintenance: boolean;
}


export interface Bank {
    id: string;
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string;
    payWithBank: boolean;
    supportsTransfer: boolean;
    availableForDirectDebit: boolean;
    active: boolean;
    country: string;
    currency: string;
    type: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface VehicleCategory {
    _id: string;
    name: string;
    description: string;
}

export interface VehicleDocument {
    name: string;
    document: string;
    status: string;
    _id: string;
    id: string;
}


export interface AddVehicleRequest {
    categoryId: string;
    type: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    image: string;
    vehicleDocuments: Array<Partial<VehicleDocument>>;

}

export interface Vehicle {
    _id: string;
    ownerId: string;
    categoryId: string;
    type: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    image: string;
    vehicleDocuments: Array<VehicleDocument>;
    status: string;
    createdAt: string;
    updatedAt: string;
}


export interface GroundTrip {
    id: string;
    trackingId: string;
    weight: number;
    customer: string;
    price: Float
    pickUpLocation: {
        address: string;
        coordinates: [number, number];
        type: string;
    };
    dropOffLocation: {
        address: string;
        coordinates: [number, number];
        type: string;
    };
    bookingRef: string;
    dateOfBooking: string;
    status: string;
    receiver: {
        name: string;
        phone: number | string;
        alternativePhone: number | string;
    }
    sender: {
        name: string;
        phoneNumber: number | string;
        email: string
    }
}


export interface GroundTripDetail {
    id: string;
    trackingId: string;
    weight: number;
    customer: string;
    price: Float
    pickUpLocation: {
        address: string;
        coordinates: [number, number];
        type: string;
    };
    dropOffLocation: {
        address: string;
        coordinates: [number, number];
        type: string;
    };
    bookingRef: string;
    dateOfBooking: string;
    status: string;
    receiver: {
        name: string;
        phone: number | string;
        alternativePhone: number | string;
    }
    sender: {
        name: string;
        phoneNumber: number | string;
        email: string
    }
    packages: Array<Package>;
}


export interface Notification {
    __v: number;
    _id: string;
    channel: string;
    createdAt: string;
    data: Array<object>;
    delivered: boolean;
    id: string;
    isRead: boolean;
    message: string;
    title: string;
    triggeredById: string;
    type: string;
    updatedAt: string;
    userId: string;
}


export interface Conversation {
    conversationId: string;
    lastMessage: string;
    lastMessageType: string;
    lastMessageAt: string;
    unreadCount: number;
    participant: IConversationsParticipant;
}



export interface IConversationsDatum {
    conversationId: string;
    lastMessage: string;
    lastMessageType: string;
    lastMessageAt: string;
    unreadCount: number;
    participant: IConversationsParticipant;
}

export interface IConversationsParticipant {
    _id: string;
    fullName: string;
    profileImage: string;
    userType: string;
}

// Single chat details
export interface ISingleChatResponse {
    code: number;
    message: string;
    data: ISingleChatData;
}

export interface ISingleChatData {
    conversationId: string;
    participant: ISingleChatParticipant;
    messages: ISingleChatMessage[];
}

export interface ISingleChatMessage {
    messageId: string;
    message: string;
    type: string;
    attachments: string[];
    isSender: boolean;
    sender: ISingleChatSender;
    sentAt: Date;
}

export interface ISingleChatSender {
    _id: string;
    fullName: string;
    userType: string;
    profileImage: string;
}

export interface ISingleChatParticipant {
    _id: string;
    fullName: string;
    profileId: string;
    profile: ISingleChatProfile;
}

export interface ISingleChatProfile {
    _id: string;
    profilePicUrl: string;
}

export interface Booking {
    _id: string;
    bookingRef: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookingDetail {
    _id: string;
    bookingRef: string;
    tripId: string;
    travellerId: string;
    senderId: string;
    parcelGroupId: string;
    status: string;
    paymentStatus: string;
    trip: {
        _id: string;
        fleetType: string;
        capacity: {
            pounds: number;
            dimension: string;
        };
        departureDate: string;
        arrivalDate: string;
    };
    parcelGroup: {
        _id: string;
        trackingId: string;
        tripOption: string;
        pickUpLocation: {
            address: string;
        };
        dropOffLocation: {
            address: string;
        };
    };
    traveller: {
        _id: string;
        userId: string;
        fullName: string;
        profileId: string;
        profile: {
            _id: string;
            profilePicUrl: string;
            country: string;
            city: string;
            state: string;
            gender: string;
        };
    };
    sender: {
        _id: string;
        userId: string;
        fullName: string;
        profileId: string;
        profile: {
            _id: string;
            profilePicUrl: string;
            country: string;
            city: string;
            state: string;
        };
    };
    parcels: {
        _id: string;
        productType: string;
        productWeight: number;
        productUnit: string;
        productImage: string;
        receiverName: string;
        receiverPhone: string;
        alternativePhone: string;
    }[];
}

export interface MarineLocation {
    _id: string;
    coords: {
        type: string;
        coordinates: [number, number];
        address: string;
    };
    createdAt: string;
}

export interface AirLocation {
    _id: string;
    coords: {
        type: string;
        coordinates: [number, number];
        address: string;
    };
    heading: number;
    timestamp: string;
    createdAt: string;
}

export interface Bank {
    id: string;
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string;
    pay_with_bank: boolean;
    supports_transfer: boolean;
    available_for_direct_debit: boolean;
    active: boolean;
    country: string;
    currency: string;
    type: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface PaymentWallet {
    status: string;
    availableBalance: number;
    accountName: string;
    accountNumber: number;
    bankName: string;
}


export interface Transaction {
    type: string;
    title: string;
    description: string;
    status: string;
    amount: number;
    purpose: string;
    referenceId: string;
    previousBalance: number;
    currentBalance: number;
}

