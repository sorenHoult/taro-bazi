import { View, Text, ScrollView } from "@tarojs/components";
import { BaseComponent, NavBar } from "@/components";
import { getWeiXinNavBarInfo } from "@/components/NavBar/config";
import { preload } from "@tarojs/taro";
import { getShareInfo, pageTo } from "@/utils";
import { ganzhiDyeing } from "@/utils/horoscope";
import caseData from "@/assets/dict/caseData";

import "./index.scss";

const globalSystemInfo = getWeiXinNavBarInfo();

class Index extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onShareAppMessage() {
    return getShareInfo();
  }

  onShareTimeline() {
    return getShareInfo();
  }

  render() {
    const {
      navBarHeight = 0,
      statusBarHeight = 0,
      bottomSafeHeight = 0,
    } = globalSystemInfo;
    const safeHeight = navBarHeight + statusBarHeight + bottomSafeHeight;
    return (
      <View className="page__bg">
        <NavBar />
        <ScrollView
          scrollY
          style={{
            height: `calc(100vh - 100rpx - ${safeHeight}px)`,
          }}
        >
          <View className="record__card">
            {caseData.map((item, index) => {
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
                >
                  <View className="record__itemTime">
                    <Text>{item.name}</Text>
                    {item.ganzhi.length && (
                      <View>
                        {[0, 1, 2, 3].map((index) => {
                          const gan = item.ganzhi[index];
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
        </ScrollView>
      </View>
    );
  }
}

export default Index;
