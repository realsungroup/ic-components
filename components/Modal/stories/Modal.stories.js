import React from 'react';
import { storiesOf } from '@storybook/react';
import { actions } from '@storybook/addon-actions';
import Modal from '../';

import '../style/index.less';
import './stories.less';

class ModalTest extends React.Component {
  state = {
    visible: false,
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleOpen = () => {
    this.setState({ visible: true });
  };

  render() {
    const { visible } = this.state;
    return (
      <div>
        <button onClick={this.handleOpen}>打开 Modal</button>
        <Modal visible={visible} onClose={this.handleClose} header={<div style={{ textAlign: 'center' }}>登录</div>}>
          <div>111</div>
          <div>222</div>
        </Modal>
      </div>
    );
  }
}

storiesOf('Modal 模态窗', module).add('模态窗', () => <ModalTest />);
