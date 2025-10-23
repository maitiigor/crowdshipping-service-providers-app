import React, { useEffect, useState } from "react";
import apiClient from "../../lib/api/client";
import { ApiResponse, Port } from "../../models";
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
    values: { departurePort: string; arrivalPort: string };
    errors: { departurePort?: string; arrivalPort?: string };
    touched: { departurePort?: boolean; arrivalPort?: boolean };
    handleChange: (field: "departurePort" | "arrivalPort", value: string) => void;
    type: "departure" | "arrival";
    setPort: (port: Port) => void;
}

export default function PortSearch({
    values,
    errors,
    touched,
    handleChange,
    setPort,
    type,
}: IProps) {
    const [ports, setPorts] = useState<Port[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const fieldName = type === "departure" ? "departurePort" : "arrivalPort";
    const selectedValue = values[fieldName];
    const fieldError = errors[fieldName];
    const fieldTouched = touched[fieldName];

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.trim()) loadports(search);
        }, 600);
        return () => clearTimeout(timeout);
    }, [search]);

    const loadports = async (query?: string) => {
        try {
            setLoading(true);
            setApiError(null);
            const url = `/trip/port/search?port=${query}`;
            const response = await apiClient.get<ApiResponse<Port[]>>(url);
            setPorts(response.data.data ?? []);
        } catch (error) {
            console.log("get ports error:", error);
            setApiError("Failed to load ports");
        } finally {
            setLoading(false);
        }
    };

    const filtered: Port[] = search
        ? ports.filter((a) =>
            a.name.toLowerCase().includes(search.toLowerCase())
        )
        : ports;

    const formatCase = (type: string) =>
        type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    return (
        <ThemedView>
            <InputLabelText className="mt-2">{formatCase(type)} Port</InputLabelText>

            <Select
                selectedValue={selectedValue}
                onValueChange={(name) => {
                    const selectedport = ports.find((a) => a.name === name);
                    if (selectedport) {
                        handleChange(fieldName, selectedport.location); // store ICAO code as value
                        setPort(selectedport);
                    }
                }}
            >
                <SelectTrigger
                    size="lg"
                    className="h-[55px] rounded-lg mb-2 border-primary-100 bg-rose-50 px-2"
                >
                    <SelectInput
                        placeholder={
                            loading ? "Loading ports..." : "Select port"
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
                                    placeholder="Search Port or port..."
                                    value={search}
                                    onChangeText={setSearch}
                                    autoFocus={false}
                                />
                            </Input>
                        </ThemedView>

                        {/* port list */}
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
                                        label={`${item.name} (${item.location})`}
                                        value={item.name} // store ICAO code as unique identifier
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
