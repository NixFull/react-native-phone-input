import React, { cloneElement, useEffect, useMemo, useState } from "react";
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryFlag from "./CountryFlag";
import CountryPicker from "./CountryPicker";
import dialCodes, { DialCode } from "./assets/dialCodes";
import { findDialCode, normalize } from "./utils";

const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();

export interface PhoneInputProps {
  ref?: any;
  children?: any;
  initialCountry?: string;
  value?: string;
  style?: object;
  textStyle?: object;
  dismissKeyboard?: boolean;
  autoFocus?: boolean;
  onChange?(data: PhoneInputChangeEvent): void;
  onChangePhoneNumber?(phoneNumber: string): void;
  onChangePhoneNumber?(phoneNumber: string): void;
  icon?: JSX.Element;
  countryContainerStyle?: object;
  dialcodeStyle?: object;
  placeholder?: string;
}

export interface PhoneInputChangeEvent {
  input: string;
  dialCode: string | null;
  countryCode: string | null;
  isValid: boolean;
  e164: string | null;
}

const PhoneInput = ({
  initialCountry = "US",
  value,
  style = {},
  textStyle = {},
  dismissKeyboard = true,
  autoFocus = false,
  onChange = () => {},
  onChangePhoneNumber = () => {},
  icon = <></>,
  countryContainerStyle = {},
  dialcodeStyle = {},
  placeholder = "",
}: PhoneInputProps) => {
  const initialDialCode = useMemo(
    () =>
      dialCodes.find(
        (dc) =>
          initialCountry && dc.countryCode === initialCountry.toUpperCase()
      ),
    []
  );
  const [dialCode, setDialCode] = useState<DialCode | undefined>(
    initialDialCode
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  useEffect(() => {
    if (value && value.length) {
      handleChangeText(value);
    }
  }, [value]);

  const isValidNumber = (number: string, country: string): boolean => {
    const obj = phoneUtil.parse(number, country);
    return phoneUtil.isValidNumber(obj);
  };

  const handleChangeText = (input: string): void => {
    if (onChangePhoneNumber) onChangePhoneNumber(input);
    setPhoneNumber(input);
    emitChange(input, dialCode);
  };

  const emitChange = (number: string, dialCode?: DialCode): void => {
    if (onChange) {
      const event: PhoneInputChangeEvent = {
        input: number,
        dialCode: null,
        countryCode: null,
        isValid: false,
        e164: null,
      };
      if (dialCode) {
        event.dialCode = dialCode.dialCode;
        event.countryCode = dialCode.countryCode;
        let obj = undefined;
        try {
          obj = phoneUtil.parse(number, dialCode.countryCode);
        } catch {}
        if (obj) {
          event.isValid = obj
            ? isValidNumber(number, dialCode.countryCode)
            : false;
          event.e164 = event.isValid ? phoneUtil.format(obj, PNF.E164) : null;
        }
      }
      if (event.isValid && dismissKeyboard) Keyboard.dismiss();
      onChange(event);
    }
  };

  const openCountryPicker = (): void => {
    Keyboard.dismiss();
    setCountryPickerVisible(true);
  };

  const handleSelect = (newDialCode: DialCode): void => {
    let number = phoneNumber;
    if (dialCode) number = number.split(dialCode.dialCode).join("");
    setDialCode(newDialCode);
    setCountryPickerVisible(false);
  };

  return (
    <>
      <View
        style={{
          borderColor: "#eeeeee",
          borderBottomWidth: 1,
          flexDirection: "row",
          ...style,
        }}
      >
        <TouchableOpacity
          style={[
            { flexDirection: "row", alignItems: "center" },
            countryContainerStyle,
          ]}
          onPress={openCountryPicker}
        >
          <CountryFlag dialCode={dialCode} />
          <Text style={[{ fontWeight: "bold" }, dialcodeStyle]}>
            {dialCode?.dialCode}
          </Text>
          {icon && cloneElement(icon)}
        </TouchableOpacity>
        <TextInput
          dataDetectorTypes={["phoneNumber"]}
          keyboardType={"phone-pad"}
          onChangeText={handleChangeText}
          autoFocus={autoFocus}
          value={phoneNumber}
          style={{
            borderWidth: 0,
            flexGrow: 1,
            height: 40,
            paddingLeft: 0,
            ...textStyle,
          }}
          placeholder={placeholder}
        />
      </View>
      <CountryPicker
        visible={countryPickerVisible}
        onSelect={handleSelect}
        onRequestClose={() => setCountryPickerVisible(false)}
      />
    </>
  );
};

export default PhoneInput;
