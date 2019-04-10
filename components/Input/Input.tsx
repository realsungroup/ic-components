import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import omit from 'omit.js';

interface InputProps {
  suffix: any; // 后缀图标
}

export default class Input extends React.Component<InputProps & any, any> {
  static propTypes = {
    type: PropTypes.string,
    disabled: PropTypes.bool,
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
