import { memo, useState, useImperativeHandle } from "react";
import { View, Text } from "@tarojs/components";
import { Modal } from "@/components";

import "./index.scss";

function HelpModal({ cRef }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [list, setList] = useState<any[]>([]);

  useImperativeHandle(cRef, () => {
    return {
      setShow,
      setTitle,
      setList,
    };
  });

  return (
    <Modal
      show={show}
      onClose={() => {
        setTitle("");
        setShow(false);
      }}
      className="helpModal__content"
    >
      {title && <View className="helpModal__title">{title}</View>}
      {list?.map((item, index) => {
        return (
          <View key={index} className="helpModal__item">
            {item.name && <View className="helpModal__name">{item.name} : </View>}
            <Text className="helpModal__explain" userSelect>
              {item.explain}
            </Text>
          </View>
        );
      })}
    </Modal>
  );
}

export default memo(HelpModal);
