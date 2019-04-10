import React from 'react';
import Input from '../Input';
import omit from 'omit.js';

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
    const restProps = omit(this.props, ['onPressEnter']);

    return (
      <Input
        {...restProps}
        onPressEnter={this.handlePressEnter}
        className="ic-input-search"
        type="text"
        suffix={searchSuffix}
      />
    );
  }
}
