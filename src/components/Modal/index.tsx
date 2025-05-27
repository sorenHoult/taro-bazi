import classNames from "classnames";
import { Component } from "react";
import { View } from "@tarojs/components";

import "./index.scss";

export default class AtModal extends Component<any, any> {
  public static defaultProps: any;

  constructor(props: any) {
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
    const { mask } = this.props;
    const { animShow, _show } = this.state;

    const { title, footer, children, className, footerClassName } = this.props;
    const rootClassName = ["at-modal"];

    const maskStyle = {
      display: mask ? "block" : "none",
      opacity: animShow ? 1 : 0,
    };

    const classObject = {
      "at-modal--show": animShow,
    };

    return (
      <View
        className={classNames(rootClassName, classObject)}
        style={{
          display: _show ? "block" : "none",
        }}
      >
        <View
          className="at-modal__mask"
          style={maskStyle}
          onClick={this.onMaskClick.bind(this)}
        ></View>
        <View
          className={classNames("at-modal__content", className)}
        >
          {title ? <View className="at-modal__header">{title}</View> : null}
          {children}
          {footer && <View className={footerClassName}>{footer}</View>}
        </View>
      </View>
    );
  }
}

AtModal.defaultProps = {
  show: false,
  mask: true,
};
