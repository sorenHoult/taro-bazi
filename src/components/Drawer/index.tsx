import classNames from "classnames";
import { Component } from "react";
import { View } from "@tarojs/components";

import "./index.scss";

export default class AtDrawer extends Component<any, any> {
  public static defaultProps: any;

  public constructor(props: any) {
    super(props);
    this.state = {
      animShow: false,
      _show: props.show,
    };
  }

  public componentDidMount(): void {
    const { _show } = this.state;
    if (_show) this.animShow();
  }

  private onHide(): void {
    this.setState({ _show: false }, () => {
      this.props.onClose && this.props.onClose();
    });
  }

  private animHide(): void {
    this.setState({
      animShow: false,
    });
    setTimeout(() => {
      this.onHide();
    }, 300);
  }

  private animShow(): void {
    this.setState({ _show: true });
    setTimeout(() => {
      this.setState({
        animShow: true,
      });
    }, 200);
  }

  private onMaskClick(): void {
    this.animHide();
  }

  public UNSAFE_componentWillReceiveProps(nextProps: any): void {
    const { show } = nextProps;
    if (show !== this.state._show) {
      show ? this.animShow() : this.animHide();
    }
  }

  public render(): JSX.Element {
    const { mask, width, placement } = this.props;
    const { animShow, _show } = this.state;
    const rootClassName = ["at-drawer"];

    const maskStyle = {
      display: mask ? "block" : "none",
      opacity: animShow ? 1 : 0,
    };
    const listStyle = {
      width,
      transition: animShow
        ? "all 225ms cubic-bezier(0, 0, 0.2, 1)"
        : "all 195ms cubic-bezier(0.4, 0, 0.6, 1)",
    };

    const classObject = {
      "at-drawer--show": animShow,
      "at-drawer--left": placement === "left",
      "at-drawer--right": placement === "right",
      "at-drawer--top": placement === "top",
      "at-drawer--bottom": placement === "bottom",
    };

    return _show ? (
      <View
        className={classNames(rootClassName, classObject, this.props.className)}
      >
        <View
          className="at-drawer__mask"
          style={maskStyle}
          onClick={this.onMaskClick.bind(this)}
        ></View>

        <View className="at-drawer__content" style={listStyle}>
          {this.props.children}
        </View>
      </View>
    ) : (
      <></>
    );
  }
}

AtDrawer.defaultProps = {
  show: false,
  mask: true,
  width: "",
  placement: "bottom",
};
