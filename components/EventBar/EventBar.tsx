import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class EventBar extends React.Component<any, any> {
  static propTypes = {
    bgColor: PropTypes.string, // 背景色
    color: PropTypes.string, // 字体颜色
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.number]), // children
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 宽度
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 高度
  };

  static defaultProps = {
    bgColor: '#43d1e3',
    color: '#fff',
  };

  state = {};

  handlePressEnter = e => {
    const { onPressEnter } = this.props;
    onPressEnter && onPressEnter(e.target.value, e);
  };

  renderChildren = () => {
    const { children } = this.props;
    if (typeof children === 'function') {
      return children();
    } else {
      return children;
    }
  };

  render() {
    const { color, bgColor, width, height, style, className, ...restProps } = this.props;

    const classes = classNames('ic-event-bar', className);
    return (
      <div className={classes} style={{ background: bgColor, color, width, height, ...style }} {...restProps}>
        {this.renderChildren()}
      </div>
    );
  }
}
