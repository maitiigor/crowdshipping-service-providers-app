import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import { Modal, Platform, Pressable, View } from "react-native";

export type DateFieldProps = {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: "date" | "time" | "datetime";
  label?: string;
  placeholder?: string;
  display?: "default" | "spinner" | "calendar" | "clock" | "inline" | "compact";
  className?: string;
  labelClassName?:
    | "default"
    | "link"
    | "h1_header"
    | "h2_header"
    | "h3_header"
    | "h4_header"
    | "h5_header"
    | "s1_subtitle"
    | "s2_subtitle"
    | "b2_body"
    | "b3_body"
    | "b4_body"
    | "c1_caption"
    | "c2_caption"
    | "c3_caption"
    | "label_text"
    | "btn_giant"
    | "btn_large"
    | "btn_medium"
    | "btn_small"
    | "btn_tiny"
    | undefined;
  format?: (d: Date) => string;
};

const defaultFormat = (d: Date) =>
  d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  labelClassName,
  mode = "date",
  label = "Date",
  placeholder = "Select date",
  display = Platform.select({
    ios: "spinner",
    android: "default",
    default: "default",
  })!,
  className,
  format = defaultFormat,
}) => {
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [temp, setTemp] = useState<Date>(value ?? new Date());

  const labelText = useMemo(
    () => (value ? format(value) : placeholder),
    [value, placeholder, format]
  );

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      setOpenDate(false);
      if (selected && event.type === "set") {
        setTemp(selected);
        if (mode === "datetime") {
          // Open time picker immediately after selecting date
          setOpenTime(true);
        } else {
          onChange(selected);
        }
      }
    } else if (selected) {
      setTemp(selected);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
    setOpenTime(false);
    if (selected && event.type === "set") {
      const combined = new Date(temp);
      combined.setHours(selected.getHours());
      combined.setMinutes(selected.getMinutes());
      onChange(combined);
    }
  };

  const confirmIOS = () => {
    setOpenDate(false);
    onChange(temp);
  };

  return (
    <ThemedView className={className}>
      {!!label && (
        <ThemedText
          type={labelClassName ? labelClassName : "default"}
          className="mb-2 text-typography-900"
        >
          {label}
        </ThemedText>
      )}
      <Pressable
        onPress={() => (Platform.OS === "web" ? undefined : setOpenDate(true))}
        className="h-[55px] mb-2 rounded-lg bg-rose-50 px-3 flex-row items-center justify-between border border-primary-100"
      >
        <ThemedText
          className={value ? "text-typography-900" : "text-typography-500"}
        >
          {labelText}
        </ThemedText>
        <AntDesign name="calendar" size={24} color="black" />
      </Pressable>

      {/* Android: Date Picker */}
      {openDate && Platform.OS === "android" && (
        <DateTimePicker
          value={temp}
          mode="date"
          display={(display ?? "default") as any}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* Android: Time Picker for datetime mode */}
      {openTime && Platform.OS === "android" && (
        <DateTimePicker
          value={temp}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* iOS Modal */}
      {Platform.OS === "ios" && (
        <Modal
          transparent
          visible={openDate}
          animationType="fade"
          onRequestClose={() => setOpenDate(false)}
        >
          <Pressable
            className="flex-1 bg-black/40"
            onPress={() => setOpenDate(false)}
          >
            <View className="mt-auto bg-white rounded-t-3xl p-4">
              <View className="items-center">
                <View className="w-12 h-1.5 bg-background-300 rounded-full mb-3" />
              </View>
              <DateTimePicker
                value={temp}
                mode={mode === "datetime" ? "date" : mode}
                display={(display ?? "spinner") as any}
                onChange={(_, d) => d && setTemp(d)}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                themeVariant="light"
              />
              <View className="flex-row justify-end gap-4 mt-3">
                <Pressable onPress={() => setOpenDate(false)}>
                  <ThemedText className="text-typography-700">Cancel</ThemedText>
                </Pressable>
                <Pressable onPress={confirmIOS}>
                  <ThemedText className="text-primary-600 font-bold">
                    Confirm
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </ThemedView>
  );
};

export default DateField;
