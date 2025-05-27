import { memo, useState, useImperativeHandle } from "react";
import { Button } from "@tarojs/components";
import { setStorageSync } from "@tarojs/taro";
import { Input, Modal } from "@/components";
import { pageReLaunch } from "@/utils";

import "./index.scss";

function InputModal({ cRef }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");

  useImperativeHandle(cRef, () => {
    return {
      setShow,
    };
  });

  return (
    <Modal
      show={show}
      onClose={() => {
        setShow(false);
      }}
      className="inputModal__content"
    >
      <Input
        className="inputModal__input"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
      />
      <Button
        className="inputModal__btn"
        onClick={() => {
          if (value) {
            setStorageSync("privateValue", value);
            setShow(false);
            pageReLaunch("index");
          }
        }}
      >
        确认
      </Button>
    </Modal>
  );
}

export default memo(InputModal);
