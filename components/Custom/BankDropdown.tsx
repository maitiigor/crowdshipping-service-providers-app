import React, { useEffect, useState } from "react";
import apiClient from "../../lib/api/client";
import { ApiResponse, Bank } from "../../models";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { ChevronDownIcon } from "../ui/icon";
import { Input, InputField } from "../ui/input";
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
} from "../ui/select";
import InputLabelText from "./InputLabelText";

interface IProps {
    values: { bankCode?: string; bankName?: string };
    errors: { bankCode?: string };
    touched: { bankCode?: boolean };
    handleChange: (code: string, name: string) => void | Promise<void>;
}

export default function BankDropdown({
    values,
    errors,
    touched,
    handleChange,
}: IProps) {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (banks.length <= 0) loadBanks(search);
        }, 600);
        return () => clearTimeout(timeout);
    }, [search]);

    const loadBanks = async (query?: string) => {
        try {
            setLoading(true);
            setApiError(null);
            const url = `/wallet/fetch-banks`;
            const response = await apiClient.get<ApiResponse<Bank[]>>(url);
            setBanks(response.data.data ?? []);
        } catch (error) {
            console.log("get banks error:", error);
            setApiError("Failed to load banks");
        } finally {
            setLoading(false);
        }
    };

    const filtered: Bank[] = search
        ? banks.filter((a) =>
              a.name.toLowerCase().includes(search.toLowerCase())
          )
        : banks;

    return (
        <ThemedView>
            <InputLabelText className="mt-2">Bank</InputLabelText>
            <Select
                selectedValue={values.bankCode}
                onValueChange={(code) => {
                    const selectedBank = banks.find((a) => a.code === code);
                    if (selectedBank) {
                        handleChange(selectedBank.code, selectedBank.name);
                    }
                }}
            >
                <SelectTrigger
                    size="lg"
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-rose-50 px-2"
                >
                    <SelectInput
                        placeholder={loading ? "Loading Banks..." : "Select Bank..."}
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
                        <ThemedView className="w-full px-3 pb-2">
                            <Input size="lg" className="rounded-md bg-rose-50">
                                <InputField
                                    placeholder="Search Bank Name..."
                                    value={search}
                                    onChangeText={setSearch}
                                    autoFocus={false}
                                />
                            </Input>
                        </ThemedView>
                        {filtered.length > 0 ? (
                            <SelectFlatList
                                className="max-h-80"
                                data={filtered as unknown as any[]}
                                keyExtractor={(item: any, index: number) =>
                                    item?.code ?? String(index)
                                }
                                renderItem={({ item }: any) => (
                                    <SelectItem label={item.name} value={item.code} />
                                )}
                            />
                        ) : (
                            <ThemedText className="px-4 py-2 text-typography-500">
                                {loading
                                    ? "Loading..."
                                    : apiError
                                    ? "Failed to load. Showing local list."
                                    : "No results found"}
                            </ThemedText>
                        )}
                    </SelectContent>
                </SelectPortal>
            </Select>
            {errors.bankCode && touched.bankCode && (
                <ThemedText type="b4_body" className="text-error-500 mb-4">
                    {errors.bankCode}
                </ThemedText>
            )}
        </ThemedView>
    );
}
