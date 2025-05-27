import { Component, PropsWithChildren } from "react";
import { Provider } from "react-redux";

import store from "./store";
import "./app.scss";
import "./app.h5.scss"; // 自动按平台加载

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    // this.props.children 是将要会渲染的页面
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
