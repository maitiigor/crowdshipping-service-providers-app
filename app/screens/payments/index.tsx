'use client';
import { ArrowLeftIcon, BellIcon, Icon } from '@/components/ui/icon';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { CircleCheckBig } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Box } from '../../../components/ui/box';
import { HStack } from '../../../components/ui/hstack';
import { Skeleton, SkeletonText } from '../../../components/ui/skeleton';
import { useCountry } from '../../../hooks/useCountry';
import { Transaction } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchWallet } from '../../../store/slices/walletSlice';
import { formatCurrency } from '../../../utils/helper';


export default function PaymentLogsScreen() {
    const [showBalance, setShowBalance] = useState(false);
    const [activeTab, setActiveTab] = useState<'payout' | 'withdrawal'>('payout');
    const dispatch = useAppDispatch();
    const { wallet, transactions, loadingWallet } = useAppSelector((state) => state.wallet);
    // existing country selector and helpers
    const { countryCode } = useCountry();
    const selectedCountry = useAppSelector((state: any) => state.country.selectedCountry);
    const currency = selectedCountry?.currencies?.[0];
    const selectedCurrency = currency?.code || "NGN";




    useEffect(() => {
        dispatch(fetchWallet());
        console.log("🚀 ~ WithdrawalScreen ~ useEffect ~ fetchWallet");

    }, [dispatch]);

    const handleTransactionPress = (transaction: Transaction) => {
        // router.push({
        //     pathname: '/screens/payments/transaction-details',
        //     params: {
        //         transactionId: transaction.id,
        //         type: transaction.type,
        //         title: transaction.title,
        //         description: transaction.description,
        //         amount: transaction.amount,
        //        ti
        //     }
        // });
    };

    const renderTransactionItem = (transaction: Transaction) => (
        <TouchableOpacity
            key={transaction.referenceId}
            className="flex-row items-center px-4 py-4 border-b border-gray-100"
            onPress={() => handleTransactionPress(transaction)}
        >
            <ThemedView className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
                <ThemedView className="w-6 h-6 bg-primary-500 rounded items-center justify-center">
                    <ThemedText className="text-white text-xs">₦</ThemedText>
                </ThemedView>
            </ThemedView>

            <ThemedView className="flex-1">
                <ThemedText className="text-base font-semibold text-gray-900 mb-1">
                    {transaction.title}
                </ThemedText>
                <ThemedText className="text-sm text-gray-600 mb-1">
                    {transaction.description}
                </ThemedText>
                <ThemedText className="text-xs text-gray-500">
                    {dayjs(Date.now()).subtract(1, 'hour').fromNow()}
                </ThemedText>
            </ThemedView>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1">
            {/* Header */}
            <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>

                <ThemedText className="text-xl font-semibold text-gray-900">Payment logs</ThemedText>

                <TouchableOpacity>
                    <Icon as={BellIcon} size="md" className="text-gray-700" />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView className="flex-1 px-4">
                {loadingWallet ? (
                    <>
                        <SkeletonText _lines={1} className="h-[200px]" />
                        <SkeletonText _lines={1} className="h-5" />

                        {Array.from({ length: 4 }).map((_: any, index: number) => (
                            <ThemedView key={index} className="w-full">
                                <Box className="w-full gap-4 p-3 rounded-md ">
                                    <SkeletonText _lines={3} className="h-2" />
                                    <HStack className="gap-1 align-middle">
                                        <Skeleton
                                            variant="circular"
                                            className="h-[24px] w-[28px] mr-2"
                                        />
                                        <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
                                    </HStack>
                                </Box>
                            </ThemedView>
                        ))}
                    </>
                ) : (
                    <ThemedView className="flex-1 gap-3  pb-40 mt-3">
                        {/* Balance Card */}
                        <ImageBackground
                            source={require("@/assets/images/bg-card.png")}
                            resizeMode="cover"
                            className="flex justify-center p-5 items-center rounded-xl h-[220px]"
                            // ensure the actual image and container are clipped to rounded corners
                            style={{ borderRadius: 16, overflow: "hidden" }}
                            imageStyle={{ borderRadius: 16 }}
                        >
                            <ThemedView className="flex h-full w-full justify-center items-center">
                                <ThemedText type="h5_header" className="text-white">
                                    Total Balance
                                </ThemedText>
                                <ThemedText type="h3_header" className="text-white mt-4">
                                    {formatCurrency(
                                        wallet?.availableBalance,
                                        selectedCurrency,
                                        `en-${countryCode}`
                                    )}
                                </ThemedText>
                            </ThemedView>
                        </ImageBackground>



                        {/* Action Buttons */}
                        <ThemedView className="flex-row mx-4 mb-6 gap-3">
                            <TouchableOpacity
                                className={`flex-1 py-3 px-4 rounded-xl border ${activeTab === 'payout' ? 'bg-primary-500 border-primary-500' : 'bg-white border-primary-500'}`}
                                onPress={() => {
                                    setActiveTab('payout');
                                    router.push('/screens/dashboard/payout-account');
                                }}
                            >
                                <ThemedText className={`text-center font-medium ${activeTab === 'payout' ? 'text-white' : 'text-primary-500'}`}>
                                    Payout Account
                                </ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`flex-1 py-3 px-4 rounded-xl border ${activeTab === 'withdrawal' ? 'bg-primary-500 border-primary-500' : 'bg-white border-primary-500'}`}
                                onPress={() => {
                                    setActiveTab('withdrawal');
                                    router.push('/screens/dashboard/withdraw-funds');
                                }}
                            >
                                <ThemedText className={`text-center font-medium ${activeTab === 'withdrawal' ? 'text-white' : 'text-primary-500'}`}>
                                    Withdrawal
                                </ThemedText>
                            </TouchableOpacity>
                        </ThemedView>

                        {/* Transaction History */}
                        <ThemedView className="mx-4 mb-6">
                            <ThemedView className="flex-row items-center justify-between mb-4">
                                <ThemedText className="text-lg font-semibold text-gray-900">Transaction History</ThemedText>
                                <TouchableOpacity onPress={() => router.push('/screens/payments/history')}>
                                    <ThemedText className="text-primary-500 font-medium">See all</ThemedText>
                                </TouchableOpacity>
                            </ThemedView>

                            <ThemedView className="flex">
                                <ThemedView className="mt-5">
                                    <FlatList
                                        scrollEnabled={false}
                                        data={transactions.slice(0, 5)}
                                        ListEmptyComponent={
                                            <ThemedText type="b2_body" className="text-center mt-10">
                                                No transactions found.
                                            </ThemedText>
                                        }
                                        contentContainerClassName="pb-20"
                                        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => { }}
                                                className={` flex-row justify-between items-center py-4 rounded-xl`}
                                            >
                                                {/* Make this container flexible and allow children to shrink */}
                                                <ThemedView className="flex-row items-center gap-3 flex-1 min-w-0">
                                                    <ThemedView
                                                        className={`p-3  rounded-full ${item.type === "credit"
                                                            ? "bg-success-0"
                                                            : "bg-primary-500"
                                                            }`}
                                                    >
                                                        <Icon
                                                            as={CircleCheckBig}
                                                            size="2xl"
                                                            className={`${item.type === "credit"
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                                }`}
                                                        />
                                                    </ThemedView>
                                                    {/* Ensure the text area can wrap/shrink */}
                                                    <ThemedView className="flex-1 min-w-0">
                                                        <ThemedText
                                                            type="b2_body"
                                                            className="flex-wrap"
                                                            numberOfLines={2}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {item?.title ?? `Wallet has been ${item.type}ed`}
                                                        </ThemedText>
                                                        <ThemedView className="flex-row items-center">
                                                            <ThemedText
                                                                type="c1_caption"
                                                                className="text-typography-700 capitalize w-[80%]"
                                                            >
                                                                {item?.description}
                                                            </ThemedText>
                                                        </ThemedView>
                                                    </ThemedView>
                                                </ThemedView>

                                                <ThemedText
                                                    type="c1_caption"
                                                    className="flex-wrap text-primary-500"
                                                    numberOfLines={2}
                                                    ellipsizeMode="tail"
                                                >
                                                    {dayjs(Date.now()).subtract(Math.floor(Math.random() * (5 - 1 + 1)) + 1, 'hour')
                                                        .fromNow()
                                                        .replace(/\bminutes\b/g, "mins")
                                                        .replace(/\bminute\b/g, "min")
                                                        .replace(/\bseconds\b/g, "secs")
                                                        .replace(/\bsecond\b/g, "sec")}
                                                </ThemedText>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item) => item?.referenceId?.toString()}
                                    />
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}