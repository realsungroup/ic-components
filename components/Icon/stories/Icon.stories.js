import React from 'react';
import { storiesOf } from '@storybook/react';
import Icon from '../';

import '../style/index.less';

class IconTest extends React.Component {
  render() {
    return <Icon type="search" size={20} />;
  }
}

storiesOf('Icon 字体图标', module).add('字体图标', () => <IconTest />);
