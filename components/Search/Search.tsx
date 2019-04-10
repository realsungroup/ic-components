import React from 'react';
import Input from '../Input';
import omit from 'omit.js';
import classNames from 'classnames';

export default class Search extends React.Component<any, any> {
  static propTypes = {};

  static defaultProps = {
    type: 'text',
    disabled: false,
  };

  state = {};

  handlePressEnter = e => {
    const { onPressEnter } = this.props;
    onPressEnter && onPressEnter(e.target.value, e);
  };

  render() {
    const searchSuffix = <span className="ic-input-search__icon" />;
    const restProps = omit(this.props, ['onPressEnter', 'className']);
    const classes = classNames('ic-input-search', this.props.className);
    return (
      <Input
        {...restProps}
        onPressEnter={this.handlePressEnter}
        className={classes}
        type="text"
        suffix={searchSuffix}
      />
    );
  }
}
