import { createRef } from "react";
import { connect } from "react-redux";
import { View, Text, ScrollView } from "@tarojs/components";
import { BaseComponent, Empty, NavBar } from "@/components";
import { getWeiXinNavBarInfo } from "@/components/NavBar/config";
import { preload, showModal, showToast } from "@tarojs/taro";
import { getShareInfo, pageTo } from "@/utils";
import { ganzhiDyeing } from "@/utils/horoscope";

import "./index.scss";
import InputModal from "./InputModal";

const globalSystemInfo = getWeiXinNavBarInfo();

class Index extends BaseComponent {
  private modalRef: any;
  private hasButtonPermissions: boolean;
  constructor(props) {
    super(props);
    this.state = {};
    this.modalRef = createRef();
    this.hasButtonPermissions = false;
  }

  componentDidMount() {}

  onShareAppMessage() {
    return getShareInfo();
  }

  onShareTimeline() {
    return getShareInfo();
  }

  render() {
    const { dispatch, historyHoroscope } = this.props;
    const {
      navBarHeight = 0,
      statusBarHeight = 0,
      bottomSafeHeight = 0,
    } = globalSystemInfo;
    const safeHeight = navBarHeight + statusBarHeight + bottomSafeHeight;
    // console.log("historyHoroscope", historyHoroscope);
    return (
      <View className="page__bg">
        <NavBar />
        <ScrollView
          scrollY
          style={{
            height: `calc(100vh - 100rpx - ${safeHeight}px)`,
          }}
        >
          {(this.hasButtonPermissions || !historyHoroscope?.length) && (
            <Empty tip="暂无记录" />
          )}
          {!this.hasButtonPermissions && !!historyHoroscope?.length && (
            <View className="record__card">
              <View className="record__tip">提示 : 长按记录可进行删除</View>
              {historyHoroscope.map((item, index) => {
                return (
                  <View
                    key={index}
                    className="record__item"
                    onClick={() => {
                      preload("subHoroscope", {
                        gender: item.gender,
                        time: item.time,
                      });
                      pageTo("subHoroscope");
                    }}
                    onLongPress={() => {
                      showModal({
                        title: "删除记录",
                        content: "确定删除这条记录吗？",
                        success: (res) => {
                          if (res.confirm) {
                            dispatch({
                              type: "REMOVE_HISTORY_HOROSCOPE",
                              payload: {
                                storageKey: "historyHoroscope",
                                ...item,
                              },
                            });
                            showToast({
                              title: "删除成功",
                              icon: "none",
                            });
                          }
                        },
                      });
                    }}
                  >
                    <View className="record__itemTime">
                      <Text>{item.gender === "female" ? "女" : "男"}</Text>
                      {item.ganzhi.length && (
                        <View>
                          {[0, 1, 2, 3].map((index) => {
                            const gan = item.ganzhi[index];
                            if (gan === "?") return null;
                            return (
                              <Text
                                key={index}
                                style={{
                                  color: ganzhiDyeing(gan),
                                }}
                              >
                                {gan}
                              </Text>
                            );
                          })}
                        </View>
                      )}
                    </View>
                    <View className="record__itemTime">
                      <Text>{item.time}</Text>
                      {item.ganzhi.length && (
                        <View>
                          {[4, 5, 6, 7].map((index) => {
                            const zhi = item.ganzhi[index];
                            if (zhi === "?") return null;
                            return (
                              <Text
                                key={index}
                                style={{
                                  color: ganzhiDyeing(zhi),
                                }}
                              >
                                {zhi}
                              </Text>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
        <InputModal cRef={this.modalRef} />
      </View>
    );
  }
}

export default connect(({ global }: any) => ({
  historyHoroscope: global.historyHoroscope,
}))(Index);
