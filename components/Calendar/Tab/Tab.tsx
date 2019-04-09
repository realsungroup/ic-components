import React from 'react';
import classnames from 'classnames';

export default class Tab extends React.PureComponent<any, any> {
  static defaultProps = {
    tabs: [],
  };

  switchTo = key => {
    const { onChange, activeKey } = this.props;
    if (key === activeKey) {
      return;
    }
    typeof onChange === 'function' && onChange(key);
  };

  render() {
    const { tabs, activeKey } = this.props;
    return (
      <div className="ic-tab">
        {tabs.map(({ key, label }) => (
          <div
            key={key}
            className={classnames('ic-tab__tab', { 'ic-tab__tab-active': key === activeKey })}
            onClick={() => {
              this.switchTo(key);
            }}
          >
            {label}
          </div>
        ))}
      </div>
    );
  }
}
