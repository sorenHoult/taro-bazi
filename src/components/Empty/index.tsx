import { memo } from "react";
import { View, Text, Image } from "@tarojs/components";
import fileTrayIcon from "@/assets/icons/file-tray.svg";
import "./index.scss";

function Empty({ tip }) {
  return (
    <View className="empty__container">
      <View className="empty__area">
        <Image src={fileTrayIcon} className="empty__icon"></Image>
        <Text className="empty__tip">{tip}</Text>
      </View>
    </View>
  );
}

export default memo(Empty);
