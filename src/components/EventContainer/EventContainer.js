import React from 'react';
import styles from './EventContainer.module.css';

export default class EventContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
  }

  componentDidMount() {
    // const { current: rootElement } = this.rootRef;
    // if (rootElement) {
    //   const { direction, totalTime, startTime, endTime } = this.props;
    // }
  }

  render() {
    const { children } = this.props;

    return (
      <div ref={this.rootRef} className={styles.container}>
        {children}
      </div>
    );
  }
}
