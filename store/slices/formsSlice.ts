import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditProfileFormState, FormValidation, DropdownOptions, SelectOption } from "../../models";

interface FormsState {
  editProfile: EditProfileFormState;
  dropdownOptions: DropdownOptions;
  activeSheets: {
    countryCode: boolean;
    country: boolean;
    gender: boolean;
    state: boolean;
    city: boolean;
    idType: boolean;
    bank: boolean;
  };
}

const initialDropdownOptions: DropdownOptions = {
  countryCodes: [
    { label: "🇳🇬 +234", value: "+234", flag: "🇳🇬" },
    { label: "🇺🇸 +1", value: "+1", flag: "🇺🇸" },
    { label: "🇬🇧 +44", value: "+44", flag: "🇬🇧" },
    { label: "🇬🇭 +233", value: "+233", flag: "🇬🇭" },
    { label: "🇰🇪 +254", value: "+254", flag: "🇰🇪" },
    { label: "🇿🇦 +27", value: "+27", flag: "🇿🇦" },
  ],
  countries: [
    { label: "Select Country", value: "" },
    { label: "Nigeria", value: "Nigeria" },
    { label: "Ghana", value: "Ghana" },
    { label: "Kenya", value: "Kenya" },
    { label: "South Africa", value: "South Africa" },
    { label: "United States", value: "United States" },
    { label: "United Kingdom", value: "United Kingdom" },
  ],
  genders: [
    { label: "Select Gender", value: "" },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ],
  states: [
    { label: "Select State", value: "" },
    { label: "Lagos", value: "lagos" },
    { label: "Abuja", value: "Abuja" },
    { label: "Kano", value: "Kano" },
    { label: "Rivers", value: "Rivers" },
    { label: "Ogun", value: "Ogun" },
    { label: "Kaduna", value: "Kaduna" },
  ],
  cities: [
    { label: "choose city", value: "" },
    { label: "Ikeja", value: "Ikeja" },
    { label: "Victoria Island", value: "Victoria Island" },
    { label: "Lekki", value: "Lekki" },
    { label: "Surulere", value: "Surulere" },
    { label: "Yaba", value: "Yaba" },
    { label: "Ikoyi", value: "Ikoyi" },
  ],
  idTypes: [
    { label: "Select Identification Type", value: "" },
    { label: "National ID", value: "national_id" },
    { label: "Driver's License", value: "drivers_license" },
    { label: "Passport", value: "passport" },
    { label: "Voter's Card", value: "voters_card" },
  ],
  banks: [
    { label: "Access Bank", value: "access_bank" },
    { label: "GTBank", value: "gtbank" },
    { label: "First Bank", value: "first_bank" },
    { label: "UBA", value: "uba" },
    { label: "Zenith Bank", value: "zenith_bank" },
    { label: "Fidelity Bank", value: "fidelity_bank" },
  ],
};

const initialState: FormsState = {
  editProfile: {
    currentStep: 1,
    totalSteps: 3,
    isLoading: false,
    validation: {
      isValid: true,
      errors: {},
    },
  },
  dropdownOptions: initialDropdownOptions,
  activeSheets: {
    countryCode: false,
    country: false,
    gender: false,
    state: false,
    city: false,
    idType: false,
    bank: false,
  },
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    // Edit Profile Form Actions
    setEditProfileStep(state, action: PayloadAction<number>) {
      state.editProfile.currentStep = action.payload;
    },
    nextEditProfileStep(state) {
      if (state.editProfile.currentStep < state.editProfile.totalSteps) {
        state.editProfile.currentStep += 1;
      }
    },
    previousEditProfileStep(state) {
      if (state.editProfile.currentStep > 1) {
        state.editProfile.currentStep -= 1;
      }
    },
    setEditProfileLoading(state, action: PayloadAction<boolean>) {
      state.editProfile.isLoading = action.payload;
    },
    setEditProfileValidation(state, action: PayloadAction<FormValidation>) {
      state.editProfile.validation = action.payload;
    },
    setEditProfileError(state, action: PayloadAction<{ field: string; error: string }>) {
      state.editProfile.validation.errors[action.payload.field] = action.payload.error;
      state.editProfile.validation.isValid = false;
    },
    clearEditProfileError(state, action: PayloadAction<string>) {
      delete state.editProfile.validation.errors[action.payload];
      state.editProfile.validation.isValid = Object.keys(state.editProfile.validation.errors).length === 0;
    },
    clearAllEditProfileErrors(state) {
      state.editProfile.validation.errors = {};
      state.editProfile.validation.isValid = true;
    },
    resetEditProfileForm(state) {
      state.editProfile = initialState.editProfile;
    },

    // Action Sheet Management
    setActiveSheet(state, action: PayloadAction<{ sheet: keyof FormsState['activeSheets']; isOpen: boolean }>) {
      state.activeSheets[action.payload.sheet] = action.payload.isOpen;
    },
    closeAllSheets(state) {
      Object.keys(state.activeSheets).forEach(key => {
        state.activeSheets[key as keyof FormsState['activeSheets']] = false;
      });
    },

    // Dropdown Options Management
    updateDropdownOptions(state, action: PayloadAction<{ type: keyof DropdownOptions; options: SelectOption[] }>) {
      state.dropdownOptions[action.payload.type] = action.payload.options;
    },
    addDropdownOption(state, action: PayloadAction<{ type: keyof DropdownOptions; option: SelectOption }>) {
      state.dropdownOptions[action.payload.type].push(action.payload.option);
    },
  },
});

export const {
  setEditProfileStep,
  nextEditProfileStep,
  previousEditProfileStep,
  setEditProfileLoading,
  setEditProfileValidation,
  setEditProfileError,
  clearEditProfileError,
  clearAllEditProfileErrors,
  resetEditProfileForm,
  setActiveSheet,
  closeAllSheets,
  updateDropdownOptions,
  addDropdownOption,
} = formsSlice.actions;

export default formsSlice.reducer;