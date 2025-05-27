import { memo, useState, useImperativeHandle } from "react";
import classNames from "classnames";
import { View, Text } from "@tarojs/components";
import { Modal } from "@/components";

import "./index.scss";

function ResultModal({ cRef }) {
  const [show, setShow] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [activatedSet, setActivatedSet] = useState(new Set());

  useImperativeHandle(cRef, () => {
    return {
      setShow,
      setList,
    };
  });

  return (
    <Modal
      show={show}
      onClose={() => {
        setShow(false);
      }}
      className="resultModal__content"
    >
      <View className="resultModal__title">反查结果</View>
      {list?.map((item, index) => {
        const { time } = item;
        const isActivated = activatedSet.has(time);
        return (
          <View
            key={index}
            className={classNames("resultModal__item", {
              resultModal__activatedItem: isActivated,
            })}
            onClick={() => {
              if (!isActivated) {
                activatedSet.add(time);
                setActivatedSet(new Set(activatedSet));
              }
              item.onClick && item.onClick();
            }}
          >
            <Text className="resultModal__time">{time}</Text>
          </View>
        );
      })}
    </Modal>
  );
}

export default memo(ResultModal);
