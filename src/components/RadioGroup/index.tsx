import classNames from "classnames";
import { memo } from "react";
import { View } from "@tarojs/components";

import "./index.scss";

type Props = {
  options: { label: string; key: string }[];
  className?: string;
  value?: string;
  onChange?: (str: string) => void;
  allowedChange?: (item: any) => boolean;
};

function RadioGroup({
  options,
  className,
  allowedChange,
  value,
  onChange,
}: Props) {
  return (
    <View className={classNames("radioGroup__container", className)}>
      {options.map((item) => {
        const isActive = item.key === value;
        return (
          <View
            key={item.key}
            className={classNames("radioGroup__item", {
              radioGroup__activeItem: isActive,
            })}
            onClick={(e) => {
              if (isActive) return;
              if (allowedChange && allowedChange(item)) {
                onChange && onChange(item.key);
              }
            }}
          >
            {item.label}
          </View>
        );
      })}
    </View>
  );
}

export default memo(RadioGroup);
