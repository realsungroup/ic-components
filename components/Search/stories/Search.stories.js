import React from 'react';
import { storiesOf } from '@storybook/react';
import { actions } from '@storybook/addon-actions';
import Search from '../';

import '../style/index.less';
import './search.less';

const eventsFromNames = actions('onChange', 'onPressEnter');

class SearchTest extends React.Component {
  state = {
    value: 'hello input',
  };
  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  handleEnter = (value, e) => {
    console.log({ value, e });
  };

  render() {
    const { value } = this.state;
    return <Search className="search-test" placeholder="输入框" value={value} {...eventsFromNames} />;
  }
}

storiesOf('Search 搜索框', module).add('搜索框', () => <SearchTest />);
