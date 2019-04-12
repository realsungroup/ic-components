import React from 'react';
import { getDayTimeLine } from '../../utils/dateUtil';
import ChildrenWithProps from '../../ChildrenWithProps';
import PropTypes from 'prop-types';

/**
 * 一天的时间线组件，包含两部分：
 * 1. 左侧的 “时分” 时间列表
 * 2. 右侧的 row 背景
 */
export default class DayTimeLine extends React.PureComponent<any, any> {
  static propTypes = {
    /**
     * 开始时间
     * 默认：'00:00'
     */
    startHHmm: PropTypes.string,

    /**
     * 结束时间
     * 默认：'23:59'
     */
    endHHmm: PropTypes.string,

    /**
     * 时间步长
     * 默认：'15:m'，即 15 分钟为一个步长
     */
    step: PropTypes.string,

    /**
     * 时间格式
     * 默认：'hh:mm a'
     */
    formatString: PropTypes.string,
  };

  static defaultProps = {
    startHHmm: '00:00',
    endHHmm: '23:59',
    step: '15:m',
    formatString: 'hh:mm a',
    // timeSuffix: ['am', 'pm'],
  };

  state = {
    bgHeight: undefined,
  };

  bgRef: any = React.createRef();

  sideRef: any = React.createRef();

  componentDidMount() {
    const { onGetSideElement } = this.props;
    this.setState({ bgHeight: this.bgRef.current.offsetHeight });
    typeof onGetSideElement === 'function' && onGetSideElement(this.sideRef.current);
  }

  render() {
    const { bgHeight } = this.state;
    const { startHHmm, endHHmm, step, formatString, timeSuffix, children, sideWidth } = this.props;
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
        <div ref={this.sideRef} className="ic-day-time-line__time-list">
          <div>
            {dayTimeLine.map(time => (
              <div key={time} className="ic-day-time-line__label-row">
                <div className="ic-day-time-line__label">{time}</div>
              </div>
            ))}
          </div>
        </div>
        <div ref={this.bgRef} className="ic-day-time-line__event-list">
          <div className="ic-day-time-line__bg">
            {dayTimeLine.map(time => (
              <div key={time} className="ic-day-time-line__bg-row" />
            ))}
          </div>
          {/* 渲染事件 */}
          <ChildrenWithProps startHHmm={startHHmm} endHHmm={endHHmm} step={step} containerHeight={bgHeight}>
            {children}
          </ChildrenWithProps>
        </div>
      </div>
    );
  }
}
