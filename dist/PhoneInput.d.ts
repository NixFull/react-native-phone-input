/// <reference types="react" />
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
}
export interface PhoneInputChangeEvent {
    input: string;
    dialCode: string | null;
    countryCode: string | null;
    isValid: boolean;
    e164: string | null;
}
declare const PhoneInput: ({ initialCountry, value, style, textStyle, dismissKeyboard, autoFocus, onChange, onChangePhoneNumber, icon, countryContainerStyle, }: PhoneInputProps) => JSX.Element;
export default PhoneInput;
