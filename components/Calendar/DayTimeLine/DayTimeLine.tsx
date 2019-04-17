import React from 'react';
import classnames from 'classnames';
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
    mainViewHeight: undefined,
    topEventRowHeight: undefined,
    titleRowRightWidth: undefined,
    titleRowRightElement: undefined,
  };

  mainViewRef: any = React.createRef();
  topEventRowRightRef: any = React.createRef();
  titleRowRightRef: any = React.createRef();
  timeColumnRef: any = React.createRef();

  componentDidMount() {
    const { onContentWidthChange } = this.props;
    const {
      mainViewRef: { current: mainViewElement },
      topEventRowRightRef: { current: topEventRowRightElement },
      titleRowRightRef: { current: titleRowRightElement },
    } = this;
    const titleRowRightElementWidth = titleRowRightElement.offsetWidth;
    const titleRowRightElementChildrenWidth = Array.prototype.reduce.call(
      titleRowRightElement.children[0].children,
      (width, element) => width + element.offsetWidth,
      0
    );
    const titleRowRightWidth = Math.max(titleRowRightElementWidth, titleRowRightElementChildrenWidth);
    this.setState({
      mainViewHeight: mainViewElement.offsetHeight,
      topEventRowHeight: topEventRowRightElement.offsetHeight,
      titleRowRightWidth,
      titleRowRightElement,
    });
    typeof onContentWidthChange === 'function' && onContentWidthChange(titleRowRightWidth);
  }

  handleContentScroll = (e) => {
    const { current: timeColumnElement } = this.timeColumnRef;
    timeColumnElement.scrollTop = e.target.scrollTop;
  }

  render() {
    const {
      mainViewHeight,
      topEventRowHeight,
      titleRowRightWidth,
      titleRowRightElement,
    } = this.state;
    const {
      startHHmm,
      endHHmm,
      step,
      formatString,
      timeSuffix,
      renderTitleRow,
      renderEventRow,
      renderMainView,
      titleRowHeight,
      className,
      style,
      height,
    } = this.props;
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
    const topEventRowHeightStyle = topEventRowHeight ? { height: topEventRowHeight } : {};
    const contentWidthStyle = titleRowRightWidth ? { width: titleRowRightWidth } : {};
    const verticalScrollableStyle = titleRowRightElement ? { height: `calc(100% - ${titleRowRightElement.offsetHeight})` } : {};

    return (
      <div className={classnames('ic-day-time-line', className)} style={{ ...style, height, }}>
        <div className="ic-day-time-line__time-column">
          <div className="ic-day-time-line__title-row-left" style={{ height: titleRowHeight }} />
          <div
            ref={this.timeColumnRef}
            className="ic-day-time-line__scrollable-time"
            style={verticalScrollableStyle}
          >
            <div className="ic-day-time-line__event-row-left" style={topEventRowHeightStyle} />
            <div>
              {dayTimeLine.map(time => (
                <div key={time} className="ic-day-time-line__label-row">
                  <div className="ic-day-time-line__label">{time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ic-day-time-line__content-column">
          <div className="ic-day-time-line__content" style={contentWidthStyle}>
            <div ref={this.titleRowRightRef} className="ic-day-time-line__title-row-right" style={{ height: titleRowHeight }}>
              {renderTitleRow(titleRowRightWidth)}
            </div>
            <div
              className="ic-day-time-line__scrollable-content"
              style={verticalScrollableStyle}
              onScroll={this.handleContentScroll}
            >
              <div ref={this.topEventRowRightRef} className="ic-day-time-line__event-row-right">
                {renderEventRow(titleRowRightWidth)}
              </div>
              <div ref={this.mainViewRef} className="ic-day-time-line__main-view">
                <div className="ic-day-time-line__bg">
                  {dayTimeLine.map(time => (
                    <div key={time} className="ic-day-time-line__bg-row" />
                  ))}
                </div>
                {/* 渲染事件 */}
                <ChildrenWithProps startHHmm={startHHmm} endHHmm={endHHmm} step={step} containerHeight={mainViewHeight}>
                  {renderMainView(titleRowRightWidth)}
                </ChildrenWithProps>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
