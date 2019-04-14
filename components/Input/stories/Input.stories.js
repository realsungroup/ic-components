import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { actions } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';
import { withTests } from '@storybook/addon-jest';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import Input from '../';
import '../style/index.less';

const eventsFromNames = actions('onChange');

class InputTest extends React.Component {
  state = {
    value: 'hello input',
  };
  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { value } = this.state;
    return <Input placeholder="输入框" value={text('value', value)} {...eventsFromNames} />;
  }
}

const stories = storiesOf('Input 输入框', module);

stories.addDecorator(withKnobs);

stories
  .addDecorator(centered)
  .addDecorator(withInfo)
  .add('输入框', () => <Input value={text('value', '123')} />, { notes: 'A very simple example of addon notes' });
