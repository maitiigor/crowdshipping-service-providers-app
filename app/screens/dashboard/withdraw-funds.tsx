// WithdrawalScreen.tsx
'use client';

import BankDropdown from "@/components/Custom/BankDropdown";
import { CustomModal } from "@/components/Custom/CustomModal";
import CustomToast from "@/components/Custom/CustomToast";
import InputLabelText from "@/components/Custom/InputLabelText";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAppDispatch, useAppSelector } from "@/store";
import { formatCurrency } from "@/utils/helper";
import { useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import {
    ChevronLeft,
    CircleCheckIcon,
    HelpCircleIcon,
    LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
import { useCountry } from "../../../hooks/useCountry";

// --- REDUX THUNKS / ACTIONS (make sure these exist in your store) ---
import {
    fetchBankList,
    initiateWithdrawal,
    // verifyBankAccount thunk (per your specified payload shape)
    verifyBankAccount,
} from "@/store/slices/paymentSlice";
import { ScrollView } from "react-native-gesture-handler";
import NotificationIconComponent from "../../../components/NotificationIconComponent";
import { fetchWallet } from "../../../store/slices/walletSlice";

export default function WithdrawalScreen() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const router = useRouter();
    const toast = useToast();
    const insets = useSafeAreaInsets();
    const backroundTopNav = useThemeColor({}, "background");

    const [bankValues, setBankValues] = useState({ bankCode: "", bankName: "" });
    console.log("🚀 ~ WithdrawalScreen ~ bankValues:", bankValues);

    // SELECTOR - wallet slice
    // Expected shape in store: state.wallet = { wallet, loadingWallet, loadingResolve, loadingWithdrawal, resolveData, error }
    const {
        wallet,
        loadingWallet,
        error: walletError,
    } = useAppSelector((state: any) => state.wallet);

    const { loadingResolve, loadingWithdrawal, resolveData } =
        useAppSelector((state: any) => state.payment);

    // existing country selector and helpers
    const { countryCode } = useCountry();
    const selectedCountry = useAppSelector((state: any) => state.country.selectedCountry);
    const currency = selectedCountry?.currencies?.[0];
    const selectedCurrency = currency?.code || "NGN";

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => {
                return (
                    <ThemedText type="s1_subtitle" className="text-center">
                        Withdraw to bank
                    </ThemedText>
                );
            },
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 20 },
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: backroundTopNav,
                elevation: 0, // Android
                shadowOpacity: 0, // iOS
                shadowColor: "transparent", // iOS
                borderBottomWidth: 0,
            },
            headerLeft: () => (
                <ThemedView
                    style={{
                        shadowColor: "#FDEFEB1A",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.102,
                        shadowRadius: 3,
                        elevation: 4,
                    }}
                >
                    <ThemedView
                        style={{
                            shadowColor: "#0000001A",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.102,
                            shadowRadius: 2,
                            elevation: 2,
                        }}
                    >
                        <TouchableOpacity
                            onLongPress={() => router.push("/(tabs)")}
                            onPress={() => navigation.goBack()}
                            className="p-2 rounded   flex justify-center items-center"
                        >
                            <Icon as={ChevronLeft} size="3xl" className="text-typography-900" />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            ),
            headerRight: () => <NotificationIconComponent />,
        });
    }, [navigation, backroundTopNav]);

    // fetch wallet on mount via Redux
    useEffect(() => {
        dispatch(fetchWallet());
        console.log("🚀 ~ WithdrawalScreen ~ useEffect ~ fetchWallet");
        dispatch(fetchBankList());
    }, [dispatch]);

    const showNewToast = ({
        title,
        description,
        icon,
        action = "error",
        variant = "solid",
    }: {
        title: string;
        description: string;
        icon: LucideIcon;
        action: "error" | "success" | "info" | "muted" | "warning";
        variant: "solid" | "outline";
    }) => {
        const newId = Math.random();
        toast.show({
            id: newId.toString(),
            placement: "top",
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                    <CustomToast
                        uniqueToastId={uniqueToastId}
                        icon={icon}
                        action={action}
                        title={title}
                        variant={variant}
                        description={description}
                    />
                );
            },
        });
    };

    // Form validation schema (preserved)
    const validationSchema = Yup.object().shape({
        amount: Yup.number()
            .typeError("Amount must be a number")
            .required("Amount is required")
            .min(100, "Minimum withdrawal is 100")
            .max(wallet?.availableBalance || 0, "Amount exceeds available balance"),
        bankCode: Yup.string().required("Bank is required"),
        accountNumber: Yup.string()
            .required("Account Number is required")
            .matches(/^\d+$/, "Account Number must be digits only")
            .min(10, "Account Number must be at least 10 digits"),
        accountName: Yup.string().required("Account Name is required"),
    });

    // Resolve account using Redux thunk (verifyBankAccount({ accountNumber, bankCode }))
    const resolveAccountWithRedux = async (bankCode: string, accountNumber: string) => {
        try {
            // dispatch the thunk and unwrap to get payload or throw on reject
            const res: any = await dispatch(
                verifyBankAccount({ accountNumber, bankCode })
            ).unwrap();

            // backend response path may contain data.account_name or similar
            const resolvedName = res?.data?.account_name || res?.data?.accountName || res?.account_name || "";
            return resolvedName;
        } catch (err: any) {
            // bubble up error message
            throw err;
        }
    };

    // Initiate withdrawal using Redux thunk
    const handleInitiateWithdrawal = async (values: {
        amount: number;
        bankName: string;
        bankCode: string;
        accountNumber: string;
        accountName: string;
    }) => {
        try {
            const payload = {
                amount: values.amount,
                bankName: values.bankName,
                bankCode: values.bankCode,
                accountNumber: values.accountNumber,
                accountName: values.accountName,
            };

            console.log("🚀 ~ handleInitiateWithdrawal ~ payload:", payload);

            const res: any = await dispatch(initiateWithdrawal(payload)).unwrap();

            console.log("🚀 ~ handleInitiateWithdrawal ~ response:", res);

            showNewToast({
                title: "Success",
                description: "Withdrawal Request successfully!",
                icon: CircleCheckIcon,
                action: "success",
                variant: "solid",
            });

            setShowModal(true);
        } catch (e: any) {
            const message =
                e?.data?.message || e?.message || "Withdrawal Request failed";

            showNewToast({
                title: "Withdrawal Request Failed",
                description: message,
                icon: HelpCircleIcon,
                action: "error",
                variant: "solid",
            });
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={"padding"}
            keyboardVerticalOffset={insets.top}
        >
            <ScrollView className="flex-1 px-3" showsVerticalScrollIndicator={false}>
                <ThemedView className="flex-1">
                    <ThemedView className="flex-1 gap-3 pb-20 mt-3">
                        <Formik
                            initialValues={{
                                amount: "",
                                bankName: "",
                                bankCode: "",
                                accountNumber: "",
                                accountName: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                const payload = {
                                    ...values,
                                    amount: parseInt(values.amount, 10),
                                };
                                console.log("Form submitted:", payload);
                                handleInitiateWithdrawal(payload);
                            }}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                touched,
                                setFieldValue,
                            }) => (
                                <ThemedView className="flex gap-4 mt-5">
                                    <ThemedView>
                                        <InputLabelText className="">Amount</InputLabelText>
                                        <Input
                                            size="xl"
                                            className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                                            variant="outline"
                                            isInvalid={!!(errors.amount && touched.amount)}
                                        >
                                            <InputField
                                                className=""
                                                placeholder="Enter Amount"
                                                value={values.amount}
                                                onChangeText={handleChange("amount")}
                                                onBlur={handleBlur("amount")}
                                                keyboardType="numeric"
                                                autoCapitalize="none"
                                            />
                                        </Input>
                                        {errors.amount && touched.amount && (
                                            <ThemedText type="b4_body" className="text-error-500 mb-4">
                                                {errors.amount}
                                            </ThemedText>
                                        )}

                                        <ThemedView className=" flex-row items-center justify-between">
                                            <ThemedText className="text-typography-800">Wallet Balance</ThemedText>
                                            <ThemedText type="default" className="text-primary-500">
                                                {loadingWallet
                                                    ? "Loading..."
                                                    : formatCurrency(
                                                        (wallet && wallet.availableBalance) || 0,
                                                        selectedCurrency,
                                                        `en-${countryCode}`
                                                    )}
                                            </ThemedText>
                                        </ThemedView>
                                    </ThemedView>

                                    <ThemedView>
                                        <BankDropdown
                                            errors={errors.bankCode && touched.bankCode ? { bankCode: errors.bankCode } : {}}
                                            touched={errors.bankCode && touched.bankCode ? { bankCode: true } : {}}
                                            values={bankValues}
                                            handleChange={async (code: string, name: string) => {
                                                setFieldValue("bankCode", code);
                                                setFieldValue("bankName", name);

                                                // If account number is 10 digits, resolve
                                                if (values.accountNumber?.length === 10) {
                                                    const resolvedName = await dispatch(verifyBankAccount({
                                                        accountNumber: values.accountNumber,
                                                        bankCode: code,
                                                    }
                                                    )).unwrap();
                                                    if (resolvedName) {
                                                        setFieldValue("accountName", resolvedName.data?.account_name);
                                                    }

                                                }

                                                // If user already entered a 10-digit account number, resolve immediately via Redux
                                                if (values.accountNumber && values.accountNumber.length === 10) {
                                                    try {
                                                        const resolvedName = await dispatch(verifyBankAccount({
                                                            accountNumber: values.accountNumber,
                                                            bankCode: code,
                                                        })).unwrap();

                                                        console.log("🚀 ~ resolvedName:", resolvedName);
                                                        if (resolvedName) {
                                                            setFieldValue("accountName", resolvedName);
                                                        }
                                                    } catch (err: any) {
                                                        console.error("Error resolving account:", err);
                                                        showNewToast({
                                                            title: "Account Resolution Failed",
                                                            description: err?.data?.message || err?.message || "Unable to verify account. Please check details and try again.",
                                                            icon: HelpCircleIcon,
                                                            action: "error",
                                                            variant: "solid",
                                                        });
                                                    }
                                                }
                                            }}
                                        />
                                    </ThemedView>

                                    <ThemedView className="flex flex-1 gap-3 w-full">
                                        <ThemedView className="flex-1 w-full">
                                            <InputLabelText className="">Account Number</InputLabelText>
                                            <Input
                                                size="xl"
                                                className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                                                variant="outline"
                                                isInvalid={!!(errors.accountNumber && touched.accountNumber)}
                                            >
                                                <InputField
                                                    className=""
                                                    placeholder="Enter Account Number"
                                                    value={values.accountNumber}
                                                    onChangeText={async (text: string) => {
                                                        // Keep only digits
                                                        const digits = text.replace(/\D/g, "");
                                                        console.log("🚀 ~ digits:", digits);
                                                        setFieldValue("accountNumber", digits);

                                                        // Clear account name while typing until we have a full number
                                                        if (digits.length !== 10) {
                                                            setFieldValue("accountName", "");
                                                            return;
                                                        }

                                                        // Resolve when bank is selected and account number is 10 digits
                                                        if (digits.length === 10) {
                                                            try {
                                                                const resolvedName = await dispatch(verifyBankAccount({
                                                                    accountNumber: digits,
                                                                    bankCode: values.bankCode,
                                                                })).unwrap();
                                                                if (resolvedName) {
                                                                    setFieldValue("accountName", resolvedName.data?.account_name);
                                                                }
                                                            } catch (err: any) {
                                                                console.error("Error resolving account:", err);
                                                                showNewToast({
                                                                    title: "Account Resolution Failed",
                                                                    description:
                                                                        err?.data?.message ||
                                                                        err?.message ||
                                                                        "Unable to verify account. Please check details and try again.",
                                                                    icon: HelpCircleIcon,
                                                                    action: "error",
                                                                    variant: "solid",
                                                                });
                                                            }
                                                        }
                                                    }}
                                                    onBlur={handleBlur("accountNumber")}
                                                    keyboardType="numeric"
                                                    autoCapitalize="none"
                                                />
                                                {loadingResolve && <ActivityIndicator />}
                                            </Input>
                                            {errors.accountNumber && touched.accountNumber && (
                                                <ThemedText type="b4_body" className="text-error-500 mb-4">
                                                    {errors.accountNumber}
                                                </ThemedText>
                                            )}
                                        </ThemedView>
                                    </ThemedView>

                                    <ThemedView className="flex flex-1 gap-3 w-full">
                                        <ThemedView className="flex-1 w-full">
                                            <InputLabelText className="">Account Name</InputLabelText>
                                            <Input
                                                size="xl"
                                                isDisabled={!!resolveData}
                                                className="h-[55px] border-primary-100 rounded-lg mb-2 bg-primary-inputShade px-2"
                                                variant="outline"
                                                isInvalid={!!(errors.accountName && touched.accountName)}
                                            >
                                                <InputField
                                                    className=""
                                                    placeholder="Account name will auto-fill"
                                                    value={values.accountName}
                                                    onChangeText={handleChange("accountName")}
                                                    onBlur={handleBlur("accountName")}
                                                    autoCapitalize="none"
                                                />
                                            </Input>
                                            {errors.accountName && touched.accountName && (
                                                <ThemedText type="b4_body" className="text-error-500 mb-4">
                                                    {errors.accountName}
                                                </ThemedText>
                                            )}
                                            {/* <Link className="hidden" href={`/payment-logs/choose-beneficiary`} asChild>
                        <ThemedText type="b2_body" className="text-primary-500 text-right">
                          Choose Beneficiary
                        </ThemedText>
                      </Link> */}
                                        </ThemedView>
                                    </ThemedView>

                                    <Button
                                        variant="solid"
                                        size="2xl"
                                        disabled={loadingWithdrawal}
                                        className="mt-5 rounded-[12px]"
                                        onPress={() => handleSubmit()}
                                    >
                                        <ThemedText type="s1_subtitle" className="text-white">
                                            {loadingWithdrawal ? <ActivityIndicator color="white" /> : "Continue"}
                                        </ThemedText>
                                    </Button>
                                </ThemedView>
                            )}
                        </Formik>
                    </ThemedView>
                </ThemedView>
                {/* </ParallaxScrollView> */}

                {showModal && (
                    <>
                        <CustomModal
                            description="Your withdrawal request has been submitted and is pending admin verification."
                            title="Withdrawal Request Submitted"
                            img={require("@/assets/images/onboarding/modal-success.png")}
                            firstBtnLink={""}
                            firstBtnText="Go Back"
                            onFirstClick={() => {
                                setShowModal(false);
                                router.back();
                            }}
                            setShowModal={() => {
                                setShowModal(false);
                                router.back();
                            }}
                            showModal={showModal}
                            size="lg"
                        />
                    </>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
