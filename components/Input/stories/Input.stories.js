import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from '../';

import '../style/index.less';

class InputTest extends React.Component {
  state = {
    value: 'hello input',
  };
  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { value } = this.state;
    return <Input placeholder="输入框" value={value} onChange={this.handleChange} />;
  }
}

storiesOf('Input 输入框', module).add('输入框', () => <InputTest />);
