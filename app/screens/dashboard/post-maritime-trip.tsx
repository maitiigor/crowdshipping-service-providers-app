import { router } from 'expo-router';
import { Formik } from 'formik';
import { CircleCheckIcon, HelpCircleIcon, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import DateField from '../../../components/Custom/DateField';
import InputLabelText from '../../../components/Custom/InputLabelText';
import PortSearch from '../../../components/Custom/PortSearch';
import VesselOperatorDropdown from '../../../components/Custom/VesselOperatorDropdown';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, BellIcon, Icon } from '../../../components/ui/icon';
import { useShowToast } from '../../../hooks/useShowToast';
import { ApiError, Port, VesselOperator, } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { saveMarineTrip } from '../../../store/slices/marineTripSlice';

interface FormData {
    mmsiNumber: string;
    vesselName: string;
    vesselOperator: string;
    containerNumber: string;
    voyageNumber: string;
    departurePort: string;
    arrivalPort: string;
    departureDate: string;
    arrivalDate: string;
    availableCapacityPounds: string;
    availableCapacityDimensions: string;
}

export default function PostMarineTripScreen() {
    const [formData, setFormData] = useState<FormData>({
        mmsiNumber: "",
        vesselName: "",
        vesselOperator: "",
        containerNumber: "",
        voyageNumber: "",
        departurePort: "",
        arrivalPort: "",
        departureDate: "",
        arrivalDate: "",
        availableCapacityPounds: "",
        availableCapacityDimensions: "",
    });

    const dispatch = useAppDispatch();


    const { vesselOperators, loading, error, marineTrip, trips, isLoadingVessels } = useAppSelector(
        (state) => state.marineTrip
    );


    const [vesselOperator, setVesselOperator] = useState<VesselOperator>()


    const validationSchema = Yup.object().shape({
        // departurePort: Yup.string().required("Departure city is required"),
        // arrivalPort: Yup.string().required("Arrival city is required"),
        // vesselName: Yup.string().required("Vessel Name is required"),
        // vesselNumber: Yup.string().required("Vessel Number is required"),
        // vesselOperator: Yup.string().required("Vessel Operator is required"),
        // mmsiNumber: Yup.string().required("MMSI Number is required"),
        // voyageNumber: Yup.string().required("Voyage Number is required"),
        // departureDate: Yup.date()
        //     .required("Departure date is required")
        //     .typeError("Invalid departure date"),
        // arrivalDate: Yup.date()
        //     .required("Arrival date is required")
        //     .typeError("Invalid arrival date")
        // // .test(
        // //     "date-difference",
        // //     "Arrival date cannot be more than 3 days after departure date",
        // //     function (arrivalDate) {
        // //         const { departureDate } = this.parent;
        // //         if (!departureDate || !arrivalDate) return true;

        // //         const dep = new Date(departureDate).getTime();
        // //         const arr = new Date(arrivalDate).getTime();

        // //         const diffInDays = (arr - dep) / (1000 * 60 * 60 * 24);
        // //         return diffInDays >= 0;
        // //     }
        // // ),
        // ,
        // availableCapacityPounds: Yup.string().required(
        //     "Available capacity (pounds) is required"
        // ),
        // availableCapacityDimensions: Yup.string().required(
        //     "Available capacity (dimensions) is required"
        // ),
    });

    const [depaturePort, setDeparturePort] = useState<Port>({
        name: "",
        nameWoDiacritics: "",
        coordinates: "",
        country: "",
        location: "",
        iata: "",
        icao: "",
    });


    const [arrivalPort, setArrivalPort] = useState<Port>({
        name: "",
        nameWoDiacritics: "",
        coordinates: "",
        country: "",
        location: "",
        iata: "",
        icao: "",
    });


    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const showToast: any = useShowToast();

    const handlePostTrip = async (values: FormData) => {




        const payload = {
            mmsiNumber: values.mmsiNumber,
            vesselName: values.vesselName,
            vesselOperator: values.vesselOperator,
            containerNumber: values.containerNumber,
            voyageNumber: values.voyageNumber,
            departurePort: depaturePort.location,
            arrivalPort: arrivalPort.location,
            departureDate: values.departureDate,
            scac: vesselOperator?.scac,
            arrivalDate: values.arrivalDate,
            capacity: {
                pounds: values.availableCapacityPounds,
                dimension: values.availableCapacityDimensions,
            }
        };

        console.log(payload)

        try {

            const resultAction = await dispatch(saveMarineTrip(payload));

            if (saveMarineTrip.fulfilled.match(resultAction)) {

                showToast({
                    title: "Marine Trip Saved",
                    description: "Your air trip has been saved",
                    icon: CircleCheckIcon,
                    action: "success",
                });

                router.push({
                    pathname: '/screens/dashboard/review-bids'
                })
            }
            else {
                const errorMessage =
                    (resultAction.payload as ApiError) || { code: 0, message: "Something went wrong" } as ApiError;
                showToast({
                    title: "Marnine Trip Save Failed",
                    description: errorMessage.message,
                    icon: HelpCircleIcon,
                    action: "error",
                });
            }
        } catch (error) {
            showToast({
                title: "Marine Trip Save Failed",
                description: "Please try again later",
                icon: HelpCircleIcon,
                action: "error",
            });

            console.log("save air trip error:", error);
        }
        // router.navigate('/screens/dashboard/review-bids')
    };



    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="bg-white h-16 px-4 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-gray-900">Post Your Trip</Text>

                <TouchableOpacity className="p-2">
                    <View className="relative">
                        <Icon as={BellIcon} size="lg" className="text-[#E75B3B]" />
                        <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </View>
                </TouchableOpacity>
            </View>
            <Formik initialValues={formData} validationSchema={validationSchema} onSubmit={handlePostTrip}>
                {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        <View className="px-4 py-6 space-y-6">



                            {/* Vesseke Name */}
                            <ThemedView>
                                <InputLabelText className="">Vessel Name</InputLabelText>
                                <TextInput
                                    placeholder="Vessel Name"
                                    value={values.vesselName}
                                    onChangeText={handleChange("vesselName")}
                                    className="bg-[#FDF2F0] rounded-lg h-[55px] mb-2 px-4 py-4 text-base"
                                />
                                {touched.vesselName && errors.vesselName && (
                                    <Text style={{ color: "red", fontSize: 12 }}>{errors.vesselName}</Text>
                                )}
                            </ThemedView>

                            {/* Vessel Operator */}
                            <VesselOperatorDropdown errors={errors} touched={touched} values={values} handleChange={handleChange('vesselOperator')} handleOperatorChange={setVesselOperator}>

                            </VesselOperatorDropdown>

                            {/* Vesseke Name */}
                            <ThemedView>
                                <InputLabelText className="">MMSI Name</InputLabelText>
                                <TextInput
                                    placeholder="MMSI Number"
                                    value={values.mmsiNumber}
                                    onChangeText={handleChange("mmsiNumber")}
                                    className="bg-[#FDF2F0] rounded-lg h-[55px] mb-2 px-4 py-4 text-base"
                                />
                                {touched.mmsiNumber && errors.mmsiNumber && (
                                    <Text style={{ color: "red", fontSize: 12 }}>{errors.mmsiNumber}</Text>
                                )}
                            </ThemedView>


                            {/* Vesseke Name */}
                            <ThemedView>
                                <InputLabelText className="">Container Number</InputLabelText>
                                <TextInput
                                    placeholder="Container  Number"
                                    value={values.containerNumber}
                                    onChangeText={handleChange("containerNumber")}
                                    className="bg-[#FDF2F0] rounded-lg h-[55px] mb-2 px-4 py-4 text-base"
                                />
                                {touched.containerNumber && errors.containerNumber && (
                                    <Text style={{ color: "red", fontSize: 12 }}>{errors.containerNumber}</Text>
                                )}
                            </ThemedView>

                            <View>
                                <PortSearch
                                    type="departure"
                                    values={formData}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={setFieldValue}
                                    setPort={setDeparturePort}
                                />
                            </View>

                            <View>
                                <PortSearch
                                    type="arrival"
                                    values={formData}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={setFieldValue}
                                    setPort={setArrivalPort}
                                />
                            </View>


                            {/* Flight Number */}
                            <ThemedView>
                                <InputLabelText className="mb-2">Voyage Number</InputLabelText>
                                <TextInput
                                    placeholder="Voyage Nmber"
                                    value={values.voyageNumber}
                                    onChangeText={handleChange("voyageNumber")}
                                    className="bg-[#FDF2F0] mb-2 h-[55px] rounded-lg px-4 py-4 text-base"
                                />
                                {touched.voyageNumber && errors.voyageNumber && (
                                    <Text style={{ color: "red", fontSize: 12 }}>{errors.voyageNumber}</Text>
                                )}
                            </ThemedView>

                            {/* Departure Date */}

                            <ThemedView className='mb-2'>

                                <DateField
                                    label="Departure Date"
                                    labelClassName="b2_body"
                                    value={values.departureDate ? new Date(values.departureDate) : null}
                                    onChange={(d) => setFieldValue("departureDate", d?.toISOString() ?? "")}
                                />
                                {errors.departureDate && touched.departureDate && (
                                    <ThemedText type="b4_body" className="text-error-500">
                                        {String(errors.departureDate)}
                                    </ThemedText>
                                )}
                            </ThemedView>


                            {/* Arrival Date */}
                            <ThemedView className='mb-2'>

                                <DateField
                                    label="Arrival Date"
                                    labelClassName="b2_body"
                                    value={values.arrivalDate ? new Date(values.arrivalDate) : null}
                                    onChange={(d) => setFieldValue("arrivalDate", d?.toISOString() ?? "")}
                                />
                                {errors.arrivalDate && touched.arrivalDate && (
                                    <ThemedText type="b4_body" className="text-error-500">
                                        {String(errors.arrivalDate)}
                                    </ThemedText>
                                )}
                            </ThemedView>



                            {/* Available Capacity */}
                            <InputLabelText className="mb-2 w-full">Available Capacity</InputLabelText>
                            <ThemedView className='flex flex-row gap-3'>

                                <View className="mb-2 w-1/3">

                                    <TextInput
                                        placeholder="Pounds (lbs)"
                                        value={values.availableCapacityPounds}
                                        onChangeText={handleChange("availableCapacityPounds")}
                                        className="bg-[#FDF2F0] rounded-lg mb-3 h-[55px] px-4 py-4 text-base mb-3"
                                    />
                                    {touched.availableCapacityPounds && errors.availableCapacityPounds && (
                                        <Text style={{ color: "red", fontSize: 12 }}>{errors.availableCapacityPounds}</Text>
                                    )}
                                </View>

                                <View className="w-2/3">

                                    <TextInput
                                        placeholder="Dimension (LxWxH)"
                                        value={values.availableCapacityDimensions}
                                        onChangeText={handleChange("availableCapacityDimensions")}
                                        className="bg-[#FDF2F0] rounded-lg h-[55px] px-4 py-4 text-base mb-3"
                                    />

                                    {touched.availableCapacityDimensions && errors.availableCapacityDimensions && (
                                        <Text style={{ color: "red", fontSize: 12 }}>{errors.availableCapacityDimensions}</Text>
                                    )}
                                </View>
                            </ThemedView>
                            {/* Post Trip Button */}

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
                                            <Icon as={Plus} size="xl" className="text-white" /> Post Trip
                                        </>
                                    )}


                                </ButtonText>
                            </Button>


                        </View>
                    </ScrollView>
                )}
            </Formik>


        </SafeAreaView>
    );
}