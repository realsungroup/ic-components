import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from '../';

import '../style/index.less';

storiesOf('Input 输入框', module).add('输入框', () => <Input />);
