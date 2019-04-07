import React from 'react';
import { getDayTimeLine } from '../../utils/dateUtil';
import ChildrenWithProps from '../ChildrenWithProps';
import styles from './DayTimeLine.module.css';

export default class DayTimeLine extends React.PureComponent {
  state = {
    bgHeight: undefined,
  };

  bgRef = React.createRef();

  componentDidMount() {
    const { current } = this.bgRef;
    this.setState({ bgHeight: current.offsetHeight });
  }

  render() {
    const { bgHeight } = this.state;
    const { start, end, step, formatString, timeSuffix, children } = this.props;
    let dayTimeLine = getDayTimeLine(start, end, step, formatString);
    if (timeSuffix) {
      const [am = 'AM', pm = 'PM'] = timeSuffix;
      dayTimeLine = dayTimeLine.map(time =>
        time
          .replace(/am|上午|早上|凌晨/i, am)
          .replace(/pm|下午|晚上/i, pm)
          .replace('中午', (_1, _2, s) => (Number(s.split(':')[0]) === 12 ? pm : am))
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          {dayTimeLine.map(time => (
            <div key={time} className={styles.labelRow}>
              <div className={styles.label}>{time}</div>
            </div>
          ))}
        </div>
        <div ref={this.bgRef} className={styles.right}>
          <div>
            {dayTimeLine.map(time => (
              <div key={time} className={styles.bgRow} />
            ))}
          </div>
          <ChildrenWithProps start={start} end={end} step={step} containerHeight={bgHeight}>
            {children}
          </ChildrenWithProps>
        </div>
      </div>
    );
  }
}

DayTimeLine.defaultProps = {
  start: '00:00',
  end: '23:59',
  step: '15:m',
  formatString: 'hh:mm a',
  // timeSuffix: ['am', 'pm'],
};
