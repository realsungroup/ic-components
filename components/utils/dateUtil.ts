import memoizeOne from 'memoize-one';
import memoize from 'lodash/memoize';
import moment from 'moment';

/**
 * OFFSET
 * 一周中每天的默认顺序: [0, 1, 2, 3, 4, 5, 6], 0 表示周日
 * OFFSET = -1: [1, 2, 3, 4, 5, 6, 0]
 * OFFSET = -2: [2, 3, 4, 5, 6, 0, 1]
 * ...
 * OFFSET = 1: [6, 0, 1, 2, 3, 4, 5]
 * OFFSET = 2: [5, 6, 0, 1, 2, 3, 4]
 * ...
 *
 * 可根据项目需求在代码中修改，或者对现有代码稍做改动，通过传参的方式控制 offset
 * 相关函数:
 *   getWeekDaysInfo(), getDatesOfPreviousMonthLastWeek(),
 *   getDatesOfNextMonthFirstWeek(), isLastDayOfWeek(), isFirstDayOfWeek(),
 */
// const WEEK_DAY_OFFSET = 0; // 每周的第一天为“周日”
const WEEK_DAY_OFFSET = -1; // 每周的第一天为“周一”

const DEFAULT_LANGUAGE = 'zh-cn';

export const WEEK_LENGTH = 7;
export const MILLISECONDS_OF_ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * @param step {string} format: "value:unit"
 */
export const parseStep = step => {
  const [value, unit] = step.split(':');
  return [Number(value), unit];
};

/**
 * @param list {Array}
 * @param offset {number}
 * @returns {Array}
 */
const cyclicMoveWeekDay = (list, offset) => {
  const listCopy = [...list];
  if (offset > 0) {
    for (let i = offset % 7; i > 0; i--) {
      listCopy.unshift(listCopy.pop());
    }
  } else if (offset < 0) {
    for (let i = -offset % 7; i > 0; i--) {
      listCopy.push(listCopy.shift());
    }
  }
  return listCopy;
};

const weekDayIds = [0, 1, 2, 3, 4, 5, 6];

const weekDayNames = {
  'zh-cn': {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
  },
  en: {
    0: 'SUN',
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
    5: 'FRI',
    6: 'SAT',
  },
};

/**
 * @param offset {number} section: [-6, 6]
 * @returns {Array}
 */
const getWeekDayIdsByOffset = memoize((offset = WEEK_DAY_OFFSET) => cyclicMoveWeekDay(weekDayIds, offset));

/**
 * @param weekDay {number|Date}
 * @param language {string}
 * @returns {string} week day name
 */
export function getWeekDayName(weekDay, language = DEFAULT_LANGUAGE) {
  const fallbackWeekDayNames = weekDayNames.en;
  const localeWeekDayNames = weekDayNames[language] || {};
  const validWeekDay = typeof weekDay === 'number' ? Math.abs(weekDay) % 7 : weekDay.getDay();
  return localeWeekDayNames[validWeekDay] || fallbackWeekDayNames[validWeekDay];
}

/**
 * @param language {string}
 * @returns {[{ id: number, label: string }]}
 */
export const getWeekDayIdLabelPairs = memoize((language = DEFAULT_LANGUAGE) =>
  getWeekDayIdsByOffset().map(id => ({ id, label: getWeekDayName(id, language) }))
);

/**
 * @param time {string} `HH:mm`
 * @returns {string} examples: 12:12pm, 08:00am
 */
export function formatHHmmTime(time) {
  if (!time) {
    return '';
  }

  const [hour, minute] = time.split(':');
  const hour24 = Number(hour);
  const hour12 = hour24 !== 12 ? hour24 % 12 : hour24;
  const suffix = hour24 < 12 ? 'am' : 'pm';
  return `${hour12}:${minute}${suffix}`;
}

/**
 * @param year {number} `YYYY`
 * @param month {number} 0 ~ 11
 * @param monthOffset {number}
 * @returns {[number, number]} [year, month]
 */
export const getMonthByOffset = (year, month, monthOffset) => {
  const date = moment([year, month]);
  date.add(monthOffset, 'M');
  return [date.year(), date.month()];
};

/**
 * @param date {Date}
 * @returns {number}
 */
export const getDaysToLastDayOfWeek = date => {
  const weekDay = date.getDay();
  const weekDays = getWeekDayIdsByOffset();
  return (weekDays[WEEK_LENGTH - 1] - weekDay + WEEK_LENGTH) % WEEK_LENGTH;
};

/**
 * @param date {Date}
 * @returns {boolean}
 */
export const isFirstDateOfWeek = date => {
  const weekDay = date.getDay();
  return getWeekDayIdsByOffset().indexOf(weekDay) === 0;
};

/**
 * @param date {Date}
 * @returns {boolean}
 */
export const isLastDateOfWeek = date => {
  const weekDay = date.getDay();
  return getWeekDayIdsByOffset().indexOf(weekDay) === WEEK_LENGTH - 1;
};

// const getFirstDateOfThisWeek = date => {
//   const
// }

/**
 * 日期的时分秒都设为 0
 * @param date Date 实例
 * @returns {string}
 */
export const monthDayHasher = date => {
  if (!date) {
    return undefined;
  }
  const dateCopy = new Date(date);
  dateCopy.setHours(0, 0, 0, 0);
  return `${dateCopy.valueOf()}`;
};

/**
 * @param date1 {Date}
 * @param date1 {Date}
 * @returns {boolean}
 */
export const isSameMonthDay = (date1: Date, date2: Date) =>
  moment(date1).isSame(date2, 'day');

/**
 * @param year {number} `YYYY`
 * @param month {number} 0 ~ 11
 * @returns {number}
 */
export const getLengthOfMonth = (year, month) => moment(new Date(year, month)).daysInMonth();

/**
 * @param year {number} `YYYY`
 * @param month {number} 0 ~ 11
 * @returns {Date}
 */
export const getFirstDateOfMonth = (year, month) => new Date(year, month);

/**
 * @param year {number} `YYYY`
 * @param month {number} 0 ~ 11
 * @returns {Date}
 */
export const getLastDateOfMonth = (year, month) => {
  return moment([year, month]).endOf('month').toDate();
};

/**
 * @param date {Date} date in week
 * @param weekDayOffset {number} section: [-6, 6]
 * @returns {Date}
 */
const getFirstDateOfWeek = (date: Date, weekDayOffset = WEEK_DAY_OFFSET) => {
  const weekDayIds = getWeekDayIdsByOffset(weekDayOffset);
  const currentId = date.getDay();
  const daysToFirstWeekDate = weekDayIds.indexOf(currentId);
  return moment(date)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .subtract(daysToFirstWeekDate, 'd')
    .toDate();
}

/**
 * @param startDate {Date}
 * @param endDate {Date}
 * @param step {string} `value:unit`
 * @returns {[Date]} [startDate, ..., endDate]
 */
export const getDatesBetween = memoizeOne(function(startDate, endDate, step = '1:d') {
  const [stepValue, stepUnit] = parseStep(step);
  const dates = [];
  for (
    let start = moment(startDate),
      endValue = moment(endDate)
        .toDate()
        .valueOf();
    start.toDate().valueOf() <= endValue;
    start.add(stepValue, stepUnit)
  ) {
    dates.push(start.toDate());
  }
  return dates;
});

/**
 * @param today {Date}
 * @param days {number}
 * @returns {[Date, Date]} `[today - days / 2, today + days / 2]`
 */
export const getDateSectionOfMultiDay = memoizeOne(function(today: Date, days: number) {
  const leftDays = Math.floor(days / 2);
  const startDate = moment(today)
    .subtract(leftDays, 'd')
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0})
    .toDate()
  const endDate = moment(startDate)
    .add(days, 'd')
    .subtract(1, 'ms')
    .toDate()

  return [startDate, endDate];
});

export const getDateSectionOfSingleWeek = memoizeOne(function(date: Date, weekDayOffset) {
  const firstDateOfWeek = getFirstDateOfWeek(date, weekDayOffset);
  return [
    firstDateOfWeek,
    moment(firstDateOfWeek)
      .add(1, 'w')
      .subtract(1, 'ms')
      .toDate(),
  ]
});

/**
 * @param year {number}
 * @param month {number}
 * @param start {number} >= 1
 * @param end {number} <= month length
 * @returns {[Date]}
 */
export const getDatesOfMonth = memoizeOne(function(year, month, start, end) {
  const validStart = typeof start === 'number' ? start : 1;
  const validEnd = typeof end === 'number' ? end : getLengthOfMonth(year, month);
  const startDate = new Date(year, month, validStart);
  const endDate = new Date(year, month, validEnd);
  return getDatesBetween(startDate, endDate);
});

/**
 * @param year {number}
 * @param month {number}
 * @param weekDayOffset {number} range: [-6, 6]
 * @returns {[Date]}
 */
const getDatesOfPreviousMonthLastWeek = function(year, month, weekDayOffset = WEEK_DAY_OFFSET) {
  const daysOfPreviousMonth = (getFirstDateOfMonth(year, month).getDay() + weekDayOffset + WEEK_LENGTH) % WEEK_LENGTH;
  const [targetYear, targetMonth] = getMonthByOffset(year, month, -1);
  const lengthOfPreviousMonth = getLengthOfMonth(targetYear, targetMonth);
  const endMonthDay = lengthOfPreviousMonth;
  const startMonthDay = endMonthDay + 1 - daysOfPreviousMonth;
  return getDatesOfMonth(targetYear, targetMonth, startMonthDay, endMonthDay);
};

/**
 * @param year {number}
 * @param month {number}
 * @param weekDayOffset {number} range: [-6, 6]
 * @returns {[Date]}
 */
const getDatesOfNextMonthFirstWeek = function(year, month, weekDayOffset = WEEK_DAY_OFFSET) {
  const daysOfNextMonth =
    WEEK_LENGTH - ((getLastDateOfMonth(year, month).getDay() + 1 + weekDayOffset + WEEK_LENGTH) % WEEK_LENGTH);
  const monthStartDay = 1;
  const monthEndDay = daysOfNextMonth % WEEK_LENGTH;
  const [targetYear, targetMonth] = getMonthByOffset(year, month, 1);
  return getDatesOfMonth(targetYear, targetMonth, monthStartDay, monthEndDay);
};

/**
 * @param year {number}
 * @param month {number}
 * @returns {[Date]}
 */
export const getDatesOfMonthlyCalendar = memoizeOne((year, month) => [
  ...getDatesOfPreviousMonthLastWeek(year, month),
  ...getDatesOfMonth(year, month),
  ...getDatesOfNextMonthFirstWeek(year, month),
]);

/**
 * @param dates {[Date]}
 * @returns {[[Date]]}
 */
const groupDatesByWeek = (dates: [Date]) => {
  const weeks = [[]];
  let weekIndex = 0;
  dates.forEach((date, index) => {
    const weekIndexOfCurrentDate = Math.floor(index / WEEK_LENGTH);
    if (weekIndexOfCurrentDate > weekIndex) {
      weekIndex += 1;
      const newWeek = [];
      weeks.push(newWeek);
    }
    weeks[weekIndex].push(date);
  });
  return weeks;
}

/**
 * @param date {Date} date in first week
 * @param weeks {number}
 * @returns [[Date]]
 */
export const getMultiWeeks = memoizeOne((function(date: Date, weeks: number, weekDayOffset = WEEK_DAY_OFFSET) {
  const firstDateOfFirstWeek = getFirstDateOfWeek(date, weekDayOffset);
  const lastDateOfLastWeek = moment(firstDateOfFirstWeek).add(weeks - 1, 'w').endOf('week');
  const dates = getDatesBetween(firstDateOfFirstWeek, lastDateOfLastWeek);
  return groupDatesByWeek(dates);
}));

/**
 * @param year {number}
 * @param month {number}
 * @returns {[[Date]]}
 */
export const getWeeksOfMonth = memoizeOne((year, month) => {
  const dates = getDatesOfMonthlyCalendar(year, month);
  return groupDatesByWeek(dates);
});

/**
 * @param time {string} `HH:mm`
 * @returns {number} minutes
 */
export function getHHmmDurationByMinute(time) {
  const [hours, minutes] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
}

/**
 * @param step {string} `value:unit`
 * @returns {number} minutes
 */
export function getStepDurationByMinute(step) {
  const [stepValue, stepUnit] = parseStep(step);
  const duration = moment.duration(stepValue, stepUnit);
  return duration.asMinutes();
}

/**
 * @param start {string} `HH:mm`
 * @param end {string} `HH:mm`
 * @param step {string} `value:unit`
 * @param formatString {string}
 * @returns {[string]} example: ['08:00am', '09:00am', ..., '05:00pm']
 */
export const getDayTimeLine = memoizeOne(function(start, end, step, formatString) {
  const [stepValue, stepUnit] = parseStep(step);
  const [startHour, startMinute] = start.split(':');
  const [endHour, endMinute] = end.split(':');
  const startMoment = moment([2019, 0, 1, Number(startHour), Number(startMinute)]);
  const endMoment = moment([2019, 0, 1, Number(endHour), Number(endMinute)]);
  const timeLine = [];
  for (let endMomentValue = endMoment.toDate().valueOf(); startMoment.toDate().valueOf() <= endMomentValue; ) {
    timeLine.push(startMoment.format(formatString));
    startMoment.add(stepValue, stepUnit);
  }
  return timeLine;
});
