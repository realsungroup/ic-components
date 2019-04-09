import React from 'react';

export default class EventContainer extends React.PureComponent<any, any> {
  rootRef: any;
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
      <div ref={this.rootRef} className="ic-event-container">
        {children}
      </div>
    );
  }
}
