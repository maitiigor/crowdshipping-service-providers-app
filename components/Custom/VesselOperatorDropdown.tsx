import React, { useEffect, useMemo, useState } from "react";
import apiClient from "../../lib/api/client";
import { ApiResponse, VesselOperator } from "../../models";
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
    values: { vesselOperator?: string };
    errors: { vesselOperator?: string };
    touched: { vesselOperator?: boolean };
    handleChange: (value: string) => void;
    handleOperatorChange: (vesselOperator: VesselOperator) => void;
}

export default function VesselOperatorDropdown({
    values,
    errors,
    touched,
    handleChange,
    handleOperatorChange
}: IProps) {

    const [vesselOperators, setVesselOperators] = useState<VesselOperator[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (vesselOperators.length <= 0) loadports(search);
        }, 600);
        return () => clearTimeout(timeout);
    }, [search]);

    const loadports = async (query?: string) => {
        try {
            setLoading(true);
            setApiError(null);
            const url = `/trip/vessel/operators`;
            const response = await apiClient.get<ApiResponse<VesselOperator[]>>(url);
                console.log("response", response);``
            setVesselOperators(response.data.data ?? []);
        } catch (error) {
            console.log("get ports error:", error);
            setApiError("Failed to load ports");
        } finally {
            setLoading(false);
        }
    };



    const filtered: VesselOperator[] = search
        ? vesselOperators.filter((a) =>
            a.name.toLowerCase().includes(search.toLowerCase())
        )
        : vesselOperators;

    const formatCase = (type: string) =>
        type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return (
        <ThemedView>
            <InputLabelText className="mt-2">Vessel Operator</InputLabelText>
            <Select selectedValue={values.vesselOperator} onValueChange={(name) => {
                const selectedOperator = vesselOperators.find((a) => a.name === name);
                if (selectedOperator) {
                    handleChange('vessleOperator'); // store ICAO code as value
                    handleOperatorChange(selectedOperator);
                }

            }}>
                <SelectTrigger
                    size="lg"
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-rose-50 px-2"
                >
                    <SelectInput
                        placeholder={loading ? "Loading Vessel Operators..." : "Select Vessel Operator..."}
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
                        {/* Search box inside the dropdown */}
                        <ThemedView className="w-full px-3 pb-2">
                            <Input size="lg" className="rounded-md bg-rose-50">
                                <InputField
                                    placeholder="Vessel Operator Name..."
                                    value={search}
                                    onChangeText={setSearch}
                                    autoFocus={false}
                                />
                            </Input>
                        </ThemedView>
                        {/* Scrollable list */}
                        {filtered.length > 0 ? (
                            <SelectFlatList
                                className="max-h-80"
                                data={filtered as unknown as any[]}
                                keyExtractor={(item: any, index: number) =>
                                    (item?.alpha2Code as string) ?? String(index)
                                }
                                renderItem={({ item }: any) => (
                                    <SelectItem label={item.name} value={item.name} />
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
            {errors.vesselOperator && touched.vesselOperator && (
                <ThemedText type="b4_body" className="text-error-500 mb-4">
                    {errors.vesselOperator}
                </ThemedText>
            )}
        </ThemedView>
    );
}
