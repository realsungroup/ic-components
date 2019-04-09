import React from 'react';
import { getDayTimeLine } from '../../utils/dateUtil';
import ChildrenWithProps from '../../ChildrenWithProps';

export default class DayTimeLine extends React.PureComponent {
  state = {
    bgHeight: undefined,
  };

  bgRef = React.createRef();

  componentDidMount() {
    const { onGetBgElement } = this.props;
    const { current } = this.bgRef;
    this.setState({ bgHeight: current.offsetHeight });
    typeof onGetBgElement === 'function' && onGetBgElement(current);
  }

  render() {
    const { bgHeight } = this.state;
    const { startHHmm, endHHmm, step, formatString, timeSuffix, children } = this.props;
    let dayTimeLine = getDayTimeLine(startHHmm, endHHmm, step, formatString);
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
      <div className="ic-day-time-line">
        <div className="ic-day-time-line__left">
          {dayTimeLine.map(time => (
            <div key={time} className="ic-day-time-line__label-row">
              <div className="ic-day-time-line__label">{time}</div>
            </div>
          ))}
        </div>
        <div ref={this.bgRef} className="ic-day-time-line__right">
          <div>
            {dayTimeLine.map(time => (
              <div key={time} className="ic-day-time-line__bg-row" />
            ))}
          </div>
          <ChildrenWithProps startHHmm={startHHmm} endHHmm={endHHmm} step={step} containerHeight={bgHeight}>
            {children}
          </ChildrenWithProps>
        </div>
      </div>
    );
  }
}

DayTimeLine.defaultProps = {
  startHHmm: '00:00',
  endHHmm: '23:59',
  step: '15:m',
  formatString: 'hh:mm a',
  // timeSuffix: ['am', 'pm'],
};
