import { router } from "expo-router";
import { Formik } from "formik";
import {
    ChevronDownIcon,
    CircleCheckIcon,
    HelpCircleIcon,
    Plus
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    TouchableOpacity
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import AirportSearch from "../../../components/Custom/AirportSearch";
import DateField from "../../../components/Custom/DateField";
import InputLabelText from "../../../components/Custom/InputLabelText";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { Button, ButtonText } from "../../../components/ui/button";
import { ArrowLeftIcon, BellIcon, Icon } from "../../../components/ui/icon";
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectFlatList,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from "../../../components/ui/select";
import { useShowToast } from '../../../hooks/useShowToast';
import { Airport, ApiError } from "../../../models";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
    availableFlightNumbers,
    saveAirTrip
} from "../../../store/slices/airTripSlice";

interface FormData {
    departureCity: string;
    arrivalCity: string;
    airlineName: string;
    flightNumber: string;
    departureDate: string;
    arrivalDate: string;
    availableCapacityPounds: string;
    availableCapacityDimensions: string;
}

export default function PostTripScreen() {
    const [formData] = useState<FormData>({
        departureCity: "",
        arrivalCity: "",
        airlineName: "",
        flightNumber: "",
        departureDate: "",
        arrivalDate: "",
        availableCapacityPounds: "",
        availableCapacityDimensions: "",
    });

    const [departureAirport, setDepartureAirport] = useState<Airport>({
        iata: "",
        icao: "",
        name: "",
        city: "",
        country: "",
        latitude: 0,
        longitude: 0,
    });

    const [arrivalAirport, setArrivalAirport] = useState<Airport>({
        iata: "",
        icao: "",
        name: "",
        city: "",
        country: "",
        latitude: 0,
        longitude: 0,
    });

    const [localDepartureDate, setLocalDepartureDate] = useState<string>(formData.departureDate ?? "");
    const [localArrivalDate, setLocalArrivalDate] = useState<string>(formData.arrivalDate ?? "");

    const dispatch = useAppDispatch();
    const { loading, availableFlightNumbers: flightNumbers } = useAppSelector(
        (state) => state.airTrip
    );


    // TOP-LEVEL useEffect — will run reliably when any dependency changes
    useEffect(() => {
        // ensure we have iata + both dates
        if (!departureAirport?.iata || !localDepartureDate || !localArrivalDate) {
            return;
        }

        // Optional: debounce to avoid spamming endpoint during quick edits
        const t = setTimeout(() => {
            console.log("Dispatching availableFlightNumbers with:", {
                departureAirportIata: departureAirport.iata,
                departureDate: localDepartureDate,
                arrivalDate: localArrivalDate,
            });

            dispatch(
                availableFlightNumbers({
                    departureAirportIata: departureAirport.iata,
                    departureDate: localDepartureDate,
                    arrivalDate: localArrivalDate,
                })
            );
        }, 300); // 300ms debounce

        return () => clearTimeout(t);
    }, [departureAirport.iata, localDepartureDate, localArrivalDate, dispatch]);

    const showToast: any = useShowToast();

    const validationSchema = Yup.object().shape({
        departureCity: Yup.string().required("Departure city is required"),
        arrivalCity: Yup.string().required("Arrival city is required"),
        airlineName: Yup.string().required("Airline name is required"),
        flightNumber: Yup.string().required("Flight number is required"),
        departureDate: Yup.date()
            .required("Departure date is required")
            .typeError("Invalid departure date"),
        arrivalDate: Yup.date()
            .required("Arrival date is required")
            .typeError("Invalid arrival date")
            .test(
                "date-difference",
                "Arrival date cannot be more than 3 days after departure date",
                function (arrivalDate) {
                    const { departureDate } = this.parent;
                    if (!departureDate || !arrivalDate) return true;
                    const dep = new Date(departureDate).getTime();
                    const arr = new Date(arrivalDate).getTime();
                    const diffInDays = (arr - dep) / (1000 * 60 * 60 * 24);
                    return diffInDays <= 3 && diffInDays >= 0;
                }
            ),
        availableCapacityPounds: Yup.string().required(
            "Available capacity (pounds) is required"
        ),
        availableCapacityDimensions: Yup.string().required(
            "Available capacity (dimensions) is required"
        ),
    });



    const handlePostTrip = async (values: FormData) => {
        const payload = {
            departureCity: values.departureCity,
            departureAirport,
            arrivalCity: values.arrivalCity,
            arrivalAirport,
            airlineName: values.airlineName,
            flightNumber: values.flightNumber,
            departureDate: values.departureDate,
            arrivalDate: values.arrivalDate,
            capacity: {
                pounds: values.availableCapacityPounds,
                dimension: values.availableCapacityDimensions,
            },
        };

        try {
            const resultAction = await dispatch(saveAirTrip(payload));

            if (saveAirTrip.fulfilled.match(resultAction)) {
                showToast({
                    title: "Air Trip Saved",
                    description: "Your air trip has been saved",
                    icon: CircleCheckIcon,
                    action: "success",
                });
            } else {
                const errorMessage =
                    (resultAction.payload as ApiError) || ({
                        message: "Something went wrong",
                    } as ApiError);
                showToast({
                    title: "Air Trip Save Failed",
                    description: errorMessage.message,
                    icon: HelpCircleIcon,
                    action: "error",
                });
            }
        } catch (error) {
            showToast({
                title: "Air Trip Save Failed",
                description: "Please try again later",
                icon: HelpCircleIcon,
                action: "error",
            });
            console.log("save air trip error:", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <ThemedView className="bg-white h-16 px-4 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-lg font-semibold text-gray-900">Post Your Trip</ThemedText>

                <TouchableOpacity className="p-2">
                    <ThemedView className="relative">
                        <Icon as={BellIcon} size="lg" className="text-[#E75B3B]" />
                        <ThemedView className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </ThemedView>
                </TouchableOpacity>
            </ThemedView>

            <Formik
                initialValues={formData}
                validationSchema={validationSchema}
                onSubmit={handlePostTrip}
            >
                {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => {
                    // 🔹 Fetch available flight numbers when both dates are set


                    return (
                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                            <ThemedView className="px-4 py-6 space-y-6">
                                {/* Departure */}
                                <AirportSearch
                                    type="departure"
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={setFieldValue}
                                    setAirport={setDepartureAirport}
                                />

                                {/* Arrival */}
                                <AirportSearch
                                    type="arrival"
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={setFieldValue}
                                    setAirport={setArrivalAirport}
                                />

                                {/* Airline Name */}
                                <ThemedView>
                                    <InputLabelText>Airline Name</InputLabelText>
                                    <TextInput
                                        placeholder="Airline Name"
                                        value={values.airlineName}
                                        onChangeText={handleChange("airlineName")}
                                        className="bg-[#FDF2F0] rounded-lg h-[55px] mb-2 px-4 py-4 text-base"
                                    />
                                    {touched.airlineName && errors.airlineName && (
                                        <ThemedText style={{ color: "red", fontSize: 12 }}>
                                            {errors.airlineName}
                                        </ThemedText>
                                    )}
                                </ThemedView>


                                {/* Dates */}
                                <ThemedView className="mb-2">
                                    <DateField
                                        label="Departure Date"
                                        labelClassName="b2_body"
                                        mode="datetime"
                                        value={
                                            values.departureDate
                                                ? new Date(values.departureDate)
                                                : null
                                        }
                                        onChange={(d) => {
                                            setLocalDepartureDate(d?.toISOString() ?? "");
                                            setFieldValue("departureDate", d?.toISOString() ?? "")
                                        }
                                        }
                                    />
                                </ThemedView>

                                <ThemedView className="mb-2">
                                    <DateField
                                        mode="datetime"
                                        label="Arrival Date"
                                        labelClassName="b2_body"
                                        value={
                                            values.arrivalDate ? new Date(values.arrivalDate) : null
                                        }
                                        onChange={(d) => {

                                            setFieldValue("arrivalDate", d?.toISOString() ?? "")
                                            setLocalArrivalDate(d?.toISOString() ?? "");
                                        }}
                                    />
                                </ThemedView>


                                {/* Flight Number Dropdown */}
                                <ThemedView>
                                    <InputLabelText className="mb-2">Flight Number</InputLabelText>

                                    {values.departureDate && values.arrivalDate ? (
                                        <Select
                                            selectedValue={values.flightNumber}
                                            onValueChange={(val) => setFieldValue("flightNumber", val)}
                                        >
                                            <SelectTrigger
                                                size="lg"
                                                className="h-[55px] rounded-lg mb-2 border-primary-100 bg-rose-50 px-2"
                                            >
                                                <SelectInput
                                                    placeholder={
                                                        flightNumbers?.length
                                                            ? "Select flight number"
                                                            : "No flights available"
                                                    }
                                                    className="flex-1"
                                                />
                                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                            </SelectTrigger>

                                            <SelectPortal>
                                                <SelectBackdrop />
                                                <SelectContent>
                                                    <SelectDragIndicatorWrapper>
                                                        <SelectDragIndicator />
                                                    </SelectDragIndicatorWrapper>

                                                    {flightNumbers?.length ? (
                                                        <SelectFlatList
                                                            data={flightNumbers}
                                                            keyExtractor={(_, index) => String(index)}
                                                            renderItem={({ item }: any) => (
                                                                <SelectItem
                                                                    label={`${item.flightNumber} (${item.departurePayload.name} - ${item.arrivalPayload.name})`}
                                                                    value={item.flightNumber}
                                                                />
                                                            )}
                                                        />
                                                    ) : (
                                                        <ThemedText className="px-4 py-2 text-typography-500">
                                                            No available flights for selected dates
                                                        </ThemedText>
                                                    )}
                                                </SelectContent>
                                            </SelectPortal>
                                        </Select>
                                    ) : (
                                        <TextInput
                                            placeholder="Flight Number"
                                            value={values.flightNumber}
                                            onChangeText={handleChange("flightNumber")}
                                            className="bg-[#FDF2F0] mb-2 h-[55px] rounded-lg px-4 py-4 text-base"
                                        />
                                    )}

                                    {touched.flightNumber && errors.flightNumber && (
                                        <ThemedText style={{ color: "red", fontSize: 12 }}>
                                            {errors.flightNumber}
                                        </ThemedText>
                                    )}
                                </ThemedView>


                                {/* Capacity */}
                                <InputLabelText className="mb-2 w-full">
                                    Available Capacity
                                </InputLabelText>

                                <ThemedView className="flex flex-row gap-3">
                                    <ThemedView className="w-1/3">
                                        <TextInput
                                            placeholder="Pounds (lbs)"
                                            value={values.availableCapacityPounds}
                                            onChangeText={handleChange("availableCapacityPounds")}
                                            className="bg-[#FDF2F0] rounded-lg h-[55px] px-4 py-4 text-base mb-3"
                                        />
                                    </ThemedView>

                                    <ThemedView className="w-2/3">
                                        <TextInput
                                            placeholder="Dimension (LxWxH)"
                                            value={values.availableCapacityDimensions}
                                            onChangeText={handleChange("availableCapacityDimensions")}
                                            className="bg-[#FDF2F0] rounded-lg h-[55px] px-4 py-4 text-base mb-3"
                                        />
                                    </ThemedView>
                                </ThemedView>

                                {/* Submit Button */}
                                <Button
                                    size="xl"
                                    className="bg-[#E75B3B] rounded-lg flex justify-center items-center shadow-sm"
                                    onPress={() => handleSubmit()}
                                >
                                    <ButtonText className="text-white font-semibold text-lg">
                                        {loading ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Icon as={Plus} size="xl" className="text-white" /> Post
                                                Trip
                                            </>
                                        )}
                                    </ButtonText>
                                </Button>
                            </ThemedView>
                        </ScrollView>
                    );
                }}
            </Formik>
        </SafeAreaView>
    );
}
