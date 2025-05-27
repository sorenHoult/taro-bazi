import { memo } from "react";
import { Input as NativeInput, InputProps, View } from "@tarojs/components";

type Props = InputProps & {
  disabled?: boolean;
  maxLength?: number;
  value?: string;
  onChange?: (str: string) => void;
  formatValue?: (value: any) => string;
};

function Input({
  disabled,
  maxLength = 20,
  value,
  onChange,
  formatValue,
  ...restProps
}: Props) {
  if (disabled) {
    return (
      <View {...restProps}>{formatValue ? formatValue(value) : value}</View>
    );
  }
  return (
    <NativeInput
      placeholder="请输入"
      {...restProps}
      maxlength={maxLength}
      value={formatValue ? formatValue(value) : value}
      onInput={(e) => {
        let str = e.detail.value.slice(0, maxLength);
        onChange && onChange(str);
      }}
    ></NativeInput>
  );
}

export default memo(Input);
