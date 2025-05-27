import { Component, ReactNode } from "react";
import { Dispatch } from "redux";

type Props = {
  dispatch: Dispatch;
  historyHoroscope?: any[];
  children: ReactNode;
};

class BaseComponent extends Component<Props, any> {
  render() {
    return this.props.children;
  }
}

export default BaseComponent;
