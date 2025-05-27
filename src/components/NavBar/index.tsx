import { Component } from "react";
import { View, Image } from "@tarojs/components";
import { getWeiXinNavBarInfo } from "@/components/NavBar/config";
import { pageBack } from "@/utils";
import arrowBackIcon from "@/assets/icons/arrow-back.svg";
import "./index.scss";

type Props = {
  title?: string;
  back?: boolean;
};

type State = {
  navBarInfo: NavBarInfoProps;
};

type NavBarInfoProps = {
  ios?: boolean;
  statusBarHeight?: number;
  navBarHeight?: number;
  menuHeight?: number;
  menuRight?: number;
  menuBottom?: number;
};

class NavBar extends Component<Props, State> {
  static defaultProps: Props;
  constructor(props: Props) {
    super(props);
    this.state = {
      navBarInfo: getWeiXinNavBarInfo(),
    };
  }

  render() {
    const {
      ios,
      statusBarHeight,
      navBarHeight,
      menuHeight,
      menuRight,
      menuBottom,
    } = this.state.navBarInfo || {};
    const { title, back } = this.props;
    return (
      <>
        <View
          className="navbar"
          style={`paddingTop:${statusBarHeight}px;height:${navBarHeight}px`}
        >
          <View className="navbar__area">
            {back && (
              <View
                className="navbar__left"
                onClick={() => {
                  pageBack();
                }}
              >
                <Image
                  src={arrowBackIcon}
                  className="navbar__arrowBackIcon"
                ></Image>
              </View>
            )}
            <View className="navbar__center">{title}</View>
          </View>
        </View>
      </>
    );
  }
}

export default NavBar;
