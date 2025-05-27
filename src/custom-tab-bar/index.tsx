import { Component } from "react";
import { switchTab } from "@tarojs/taro";
import { CoverView, CoverImage } from "@tarojs/components";
import { getCurrentRoute } from "@/utils";
import contrastOutline from "@/assets/tabs/contrast-outline.png";
import contrast from "@/assets/tabs/contrast.png";
import readerOutline from "@/assets/tabs/reader-outline.png";
import reader from "@/assets/tabs/reader.png";

import "./index.scss";

const tabs = [
  {
    pagePath: "/pages/index/index",
    iconPath: contrastOutline,
    selectedIconPath: contrast,
    text: "排盘",
  },
  {
    pagePath: "/pages/case/index",
    iconPath: readerOutline,
    selectedIconPath: reader,
    text: "案例",
  },
  {
    pagePath: "/pages/record/index",
    iconPath: readerOutline,
    selectedIconPath: reader,
    text: "记录",
  },
];

export default class Index extends Component<any, any> {
  constructor(props) {
    super(props);
    const currentUrl = getCurrentRoute();
    this.state = {
      selected: tabs.findIndex((tab) => tab.pagePath === currentUrl) || 0,
    };
  }

  render() {
    const { selected } = this.state;
    return (
      <CoverView className="tab-bar">
        <CoverView className="tab-bar-border"></CoverView>
        {tabs.map((item, index) => {
          return (
            <CoverView
              key={index}
              className="tab-bar-item"
              onClick={() => {
                if (index === selected) return;
                switchTab({ url: item.pagePath });
              }}
            >
              <CoverImage
                src={selected === index ? item.selectedIconPath : item.iconPath}
              />
              <CoverView
                style={{ color: selected === index ? "#000" : "#999" }}
              >
                {item.text}
              </CoverView>
            </CoverView>
          );
        })}
      </CoverView>
    );
  }
}
