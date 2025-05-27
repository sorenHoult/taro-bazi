import { memo, useImperativeHandle, useState } from "react";
import { View } from "@tarojs/components";
import { GregorianTimePicker, Drawer, CityPicker } from "@/components";
import { getWeiXinNavBarInfo } from "@/components/NavBar/config";

import YearRangePicker from "../YearRangePicker";
import "./index.scss";

const globalSystemInfo = getWeiXinNavBarInfo();

function TimePickerDrawer({ cRef, onChange }) {
  const { bottomSafeHeight } = globalSystemInfo;
  const [show, setShow] = useState(false);

  const [calendarType, setCalendarType] = useState("gregorian");
  const [value, setValue] = useState("");
  const [range, setRange] = useState([]);

  useImperativeHandle(cRef, () => {
    return {
      setShow,
      setCalendarType,
      setValue,
      setRange,
    };
  });

  return (
    <Drawer
      show={show}
      onClose={() => {
        setShow(false);
      }}
    >
      <View className="historyDrawer__content">
        {calendarType === "gregorian" && (
          <GregorianTimePicker
            range={range}
            value={value}
            onConfirm={(newValue) => {
              onChange && onChange(newValue, calendarType);
              setShow(false);
            }}
            onCancel={() => {
              setShow(false);
            }}
          />
        )}
        {/* {calendarType === "lunar" && (
          <LunarTimePicker
            value={value}
            onConfirm={(newValue) => {
              onChange && onChange(newValue, calendarType);
              setShow(false);
            }}
            onCancel={() => {
              setShow(false);
            }}
          />
        )} */}
        {calendarType === "year" && (
          <YearRangePicker
            value={value}
            onConfirm={(newValue) => {
              onChange && onChange(newValue, calendarType);
              setShow(false);
            }}
            onCancel={() => {
              setShow(false);
            }}
          />
        )}
        {calendarType === "city" && (
          <CityPicker
            value={value}
            onConfirm={(newValue) => {
              onChange && onChange(newValue, calendarType);
              setShow(false);
            }}
            onCancel={() => {
              setShow(false);
            }}
          />
        )}
      </View>
      <View
        className="historyDrawer__footer"
        style={{
          paddingBottom: `calc(100rpx + ${bottomSafeHeight}px)`,
        }}
      ></View>
    </Drawer>
  );
}

export default memo(TimePickerDrawer);
