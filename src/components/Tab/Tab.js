import React from 'react';
import classnames from 'classnames';
import styles from './Tab.module.css';

export default class Tab extends React.PureComponent {
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
      <div className={styles.container}>
        {tabs.map(({ key, label })=> (
          <div
            key={key}
            className={classnames(styles.tab, { [styles.tabActive]: key === activeKey })}
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
