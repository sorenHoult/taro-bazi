import { memo, useState } from "react";
import { View } from "@tarojs/components";

import "./index.scss";

function Bubble({ content, children }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <View
        className="bubble"
        onClick={() => {
          setShow(!show);
        }}
      >
        {children}
        {show && (
          <View className="bubble__content">
            <View className="bubble__arrow"></View>
            {content}
          </View>
        )}
      </View>

      {show && (
        <View
          className="bubble__mask"
          onClick={() => {
            setShow(false);
          }}
        ></View>
      )}
    </>
  );
}

export default memo(Bubble);
