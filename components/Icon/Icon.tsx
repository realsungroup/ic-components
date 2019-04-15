import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import omit from 'omit.js';

export default class Icon extends React.Component<any, any> {
  static propTypes = {
    /**
     * 字体图标类型
     * 必填：是
     * 默认：-
     */
    type: PropTypes.string,
    /**
     * 字体图标大小
     * 必填：否
     * 默认：14
     */
    size: PropTypes.number,
  };

  static defaultProps = {
    size: 14,
  };

  render() {
    const { type, size } = this.props;

    const classes = `icon-icon iconfont icon-${type}`;
    const style = { fontSize: size };

    return <span className={classes} style={style} />;
  }
}
