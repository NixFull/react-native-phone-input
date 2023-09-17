"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const CountryFlag_1 = __importDefault(require("./CountryFlag"));
const CountryPicker_1 = __importDefault(require("./CountryPicker"));
const dialCodes_1 = __importDefault(require("./assets/dialCodes"));
const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const PhoneInput = ({ initialCountry = "US", value, style = {}, textStyle = {}, dismissKeyboard = true, autoFocus = false, onChange = () => { }, onChangePhoneNumber = () => { }, icon = react_1.default.createElement(react_1.default.Fragment, null), countryContainerStyle = {}, dialcodeStyle = {}, placeholder = "", }) => {
    const initialDialCode = (0, react_1.useMemo)(() => dialCodes_1.default.find((dc) => initialCountry && dc.countryCode === initialCountry.toUpperCase()), []);
    const [dialCode, setDialCode] = (0, react_1.useState)(initialDialCode);
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)("");
    const [countryPickerVisible, setCountryPickerVisible] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (value && value.length) {
            handleChangeText(value);
        }
    }, [value]);
    const isValidNumber = (number, country) => {
        const obj = phoneUtil.parse(number, country);
        return phoneUtil.isValidNumber(obj);
    };
    const handleChangeText = (input) => {
        if (onChangePhoneNumber)
            onChangePhoneNumber(input);
        setPhoneNumber(input);
        emitChange(input, dialCode);
    };
    const emitChange = (number, dialCode) => {
        if (onChange) {
            const event = {
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
                }
                catch (_a) { }
                if (obj) {
                    event.isValid = obj
                        ? isValidNumber(number, dialCode.countryCode)
                        : false;
                    event.e164 = event.isValid ? phoneUtil.format(obj, PNF.E164) : null;
                }
            }
            if (event.isValid && dismissKeyboard)
                react_native_1.Keyboard.dismiss();
            onChange(event);
        }
    };
    const openCountryPicker = () => {
        react_native_1.Keyboard.dismiss();
        setCountryPickerVisible(true);
    };
    const handleSelect = (newDialCode) => {
        let number = phoneNumber;
        if (dialCode)
            number = number.split(dialCode.dialCode).join("");
        setDialCode(newDialCode);
        setCountryPickerVisible(false);
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_native_1.View, { style: Object.assign({ borderColor: "#eeeeee", borderBottomWidth: 1, flexDirection: "row" }, style) },
            react_1.default.createElement(react_native_1.TouchableOpacity, { style: [
                    { flexDirection: "row", alignItems: "center" },
                    countryContainerStyle,
                ], onPress: openCountryPicker },
                react_1.default.createElement(CountryFlag_1.default, { dialCode: dialCode }),
                react_1.default.createElement(react_native_1.Text, { style: [{ fontWeight: "bold" }, dialcodeStyle] }, dialCode === null || dialCode === void 0 ? void 0 : dialCode.dialCode),
                icon && (0, react_1.cloneElement)(icon)),
            react_1.default.createElement(react_native_1.TextInput, { dataDetectorTypes: ["phoneNumber"], keyboardType: "phone-pad", onChangeText: handleChangeText, autoFocus: autoFocus, value: phoneNumber, style: Object.assign({ borderWidth: 0, flexGrow: 1, height: 40, paddingLeft: 0 }, textStyle), placeholder: placeholder })),
        react_1.default.createElement(CountryPicker_1.default, { visible: countryPickerVisible, onSelect: handleSelect, onRequestClose: () => setCountryPickerVisible(false) })));
};
exports.default = PhoneInput;
