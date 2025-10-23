import React, { useEffect, useState } from "react";
import apiClient from "../../lib/api/client";
import { Airport, ApiResponse } from "../../models";
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
    values: { departureCity: string; arrivalCity: string };
    errors: { departureCity?: string; arrivalCity?: string };
    touched: { departureCity?: boolean; arrivalCity?: boolean };
    handleChange: (field: "departureCity" | "arrivalCity", value: string) => void;
    type: "departure" | "arrival";
    setAirport: (airport: Airport) => void;
}

export default function AirportSearch({
    values,
    errors,
    touched,
    handleChange,
    setAirport,
    type,
}: IProps) {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const fieldName = type === "departure" ? "departureCity" : "arrivalCity";
    const selectedValue = values[fieldName];
    const fieldError = errors[fieldName];
    const fieldTouched = touched[fieldName];

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.trim()) loadAirports(search);
        }, 600);
        return () => clearTimeout(timeout);
    }, [search]);

    const loadAirports = async (query?: string) => {
        try {
            setLoading(true);
            setApiError(null);
            const url = `/trip/airports/search?city=${query}`;
            const response = await apiClient.get<ApiResponse<Airport[]>>(url);
            setAirports(response.data.data ?? []);
        } catch (error) {
            console.log("get airports error:", error);
            setApiError("Failed to load airports");
        } finally {
            setLoading(false);
        }
    };

    const filtered: Airport[] = search
        ? airports.filter((a) =>
            a.city.toLowerCase().includes(search.toLowerCase())
        )
        : airports;

    const formatCase = (type: string) =>
        type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    return (
        <ThemedView>
            <InputLabelText className="mt-2">{formatCase(type)} City</InputLabelText>

            <Select
                selectedValue={selectedValue}
                onValueChange={(icao) => {
                    const selectedAirport = airports.find((a) => a.icao === icao);
                    if (selectedAirport) {
                        handleChange(fieldName, icao); // store ICAO code as value
                        setAirport(selectedAirport);
                    }
                }}
            >
                <SelectTrigger
                    size="lg"
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-rose-50 px-2"
                >
                    <SelectInput
                        placeholder={
                            loading ? "Loading airports..." : "Select Airport"
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

                        {/* Search Field */}
                        <ThemedView className="w-full mb-2 px-3 pb-2">
                            <Input size="lg" className="rounded-md bg-rose-50">
                                <InputField
                                    placeholder="Search city or airport..."
                                    value={search}
                                    onChangeText={setSearch}
                                    autoFocus={false}
                                />
                            </Input>
                        </ThemedView>

                        {/* Airport list */}
                        {loading ? (
                            <ThemedText className="px-4 py-2 text-typography-500">
                                Loading...
                            </ThemedText>
                        ) : apiError ? (
                            <ThemedText className="px-4 py-2 text-error-500">
                                {apiError}
                            </ThemedText>
                        ) : filtered.length > 0 ? (
                            <SelectFlatList
                                className="max-h-80"
                                data={filtered as any[]}
                                keyExtractor={(item: any, index: number) =>
                                    item?.icao ?? String(index)
                                }
                                renderItem={({ item }: any) => (
                                    <SelectItem
                                        label={`${item.name} (${item.city})`}
                                        value={item.icao} // store ICAO code as unique identifier
                                    />
                                )}
                            />
                        ) : (
                            <ThemedText className="px-4 py-2 text-typography-500">
                                No results found
                            </ThemedText>
                        )}
                    </SelectContent>
                </SelectPortal>
            </Select>

            {/* Error Message */}
            {fieldError && fieldTouched && (             
                <ThemedText style={{ color: "red", fontSize: 12 }} type="b4_body" className="text-red-500">
                    {fieldError}
                </ThemedText>
            )}
        </ThemedView>
    );
}
