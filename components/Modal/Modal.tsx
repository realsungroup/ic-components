import React from 'react';
import ReactDOM from 'react-dom';
import omit from 'omit.js';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';

export default class Modal extends React.Component<any, any> {
  static propTypes = {
    /**
     * 是否显示
     * 默认：false
     */
    visible: PropTypes.bool,

    /**
     * 关闭回调
     * 默认：-
     */
    onClose: PropTypes.func,

    /**
     * 头部内部
     * 默认：-
     */
    header: PropTypes.node,

    /**
     * 模态框宽度
     * 默认：-
     */
    width: PropTypes.number,

    /**
     * 模态框高度
     * 默认：-
     */
    height: PropTypes.number,
  };

  static defaultProps = {
    visible: false,
  };

  state = {};

  handleClose = () => {
    console.log(222);
    const { onClose } = this.props;
    onClose && onClose();
  };

  render() {
    const { children, visible, header, width, height, ...restProps } = this.props;

    const classes = classNames('ic-modal', {
      'ic-modal--hide': !visible,
    });

    let mainStyle: any = {};
    if (width) {
      mainStyle.width = width;
    }
    if (height) {
      mainStyle.height = height;
    }

    const otherProps = omit(restProps, ['onClose']);

    const element = (
      <div className={classes}>
        <div className="ic-modal__mask" onClick={this.handleClose} />
        <div className="ic-modal__main" {...mainStyle}>
          <div className="ic-modal__header">
            <div className="ic-modal__header-content">{header}</div>
            <Icon type="close" className="ic-modal__close" onClick={this.handleClose} />
          </div>
          <div className="ic-modal__content" {...otherProps}>
            {children}
          </div>
        </div>
      </div>
    );
    return ReactDOM.createPortal(element, document.body);
  }
}
