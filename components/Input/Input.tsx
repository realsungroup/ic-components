import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import omit from 'omit.js';

interface InputProps {
  suffix: any; // 后缀图标
}

export default class Input extends React.Component<InputProps & any, any> {
  static propTypes = {
    /**
     * 类型
     * 默认：'text'
     */
    type: PropTypes.string,
    /**
     * 是否禁用
     * 默认：false
     */
    disabled: PropTypes.bool,

    /**
     * 后缀
     * 默认：-
     */
    suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  };

  static defaultProps = {
    type: 'text',
    disabled: false,
  };

  state = {};

  handleKeyDown = e => {
    const { onPressEnter, onKeyDown } = this.props;
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  renderInput = (props, hasSuffix) => {
    const { className, ...restProps } = props;
    const classes = classNames('ic-input', className, {
      ['ic-input--has-suffix']: hasSuffix,
    });
    return <input className={classes} {...restProps} onKeyDown={this.handleKeyDown} />;
  };

  render() {
    const { suffix, style, className } = this.props;
    const otherProps = omit(this.props, ['onPressEnter', 'suffix', 'style']);

    if (suffix) {
      const classes = classNames('ic-input-wrap', className);
      return (
        <div className={classes}>
          {this.renderInput(otherProps, true)}
          {suffix}
        </div>
      );
    }

    return this.renderInput({ style, className, ...otherProps }, false);
  }
}
