import React, { PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';
import { forbidExtraProps } from 'airbnb-prop-types';
import moment from 'moment';

import isTouchDevice from '../utils/isTouchDevice';

import isInclusivelyAfterDay from '../utils/isInclusivelyAfterDay';
import isNextDay from '../utils/isNextDay';
import isSameDay from '../utils/isSameDay';

import FocusedInputShape from '../shapes/FocusedInputShape';
import ScrollableOrientationShape from '../shapes/ScrollableOrientationShape';

import {
  START_DATE,
  END_DATE,
  HORIZONTAL_ORIENTATION,
  CUSTOM_RANGE_SHORTCUT,
} from '../../constants';

import DayPicker from './DayPicker';
import DayPickerControls from './DayPickerControls';

const propTypes = forbidExtraProps({
  startDate: momentPropTypes.momentObj,
  endDate: momentPropTypes.momentObj,
  onDatesChange: PropTypes.func,

  focusedInput: FocusedInputShape,
  onFocusChange: PropTypes.func,

  keepOpenOnDateSelect: PropTypes.bool,
  minimumNights: PropTypes.number,
  isOutsideRange: PropTypes.func,
  isDayBlocked: PropTypes.func,
  isDayHighlighted: PropTypes.func,

  // DayPicker props
  enableOutsideDays: PropTypes.bool,
  numberOfMonths: PropTypes.number,
  orientation: ScrollableOrientationShape,
  withPortal: PropTypes.bool,
  initialVisibleMonth: PropTypes.func,

  navPrev: PropTypes.node,
  navNext: PropTypes.node,

  onPrevMonthClick: PropTypes.func,
  onNextMonthClick: PropTypes.func,
  onOutsideClick: PropTypes.func,
  renderDay: PropTypes.func,

  // i18n
  monthFormat: PropTypes.string,
});

const defaultProps = {
  startDate: undefined, // TODO: use null
  endDate: undefined, // TODO: use null
  onDatesChange() {},

  focusedInput: null,
  onFocusChange() {},

  keepOpenOnDateSelect: false,
  minimumNights: 1,
  isOutsideRange() {},
  isDayBlocked() {},
  isDayHighlighted() {},

  // DayPicker props
  enableOutsideDays: false,
  numberOfMonths: 1,
  orientation: HORIZONTAL_ORIENTATION,
  withPortal: false,
  withControls: false,
  withShortcuts: false,

  initialVisibleMonth: () => moment(),

  navPrev: null,
  navNext: null,

  onPrevMonthClick() {},
  onNextMonthClick() {},
  onOutsideClick() {},

  renderDay: null,

  // i18n
  monthFormat: 'MMMM YYYY',
};

export default class DayPickerRangeController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isComparing: true,
      compareBy: 'byPercentage',
      hoverDate: null,
    };

    this.isTouchDevice = isTouchDevice();
    this.today = moment();

    this.onDayClick = this.onDayClick.bind(this);
    this.onShortcutClick = this.onShortcutClick.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDayMouseEnter = this.onDayMouseEnter.bind(this);
    this.onDayMouseLeave = this.onDayMouseLeave.bind(this);
    this.onCompareByChange = this.onCompareByChange.bind(this);
    this.onCompareToChange = this.onCompareToChange.bind(this);
  }

  componentWillUpdate() {
    this.today = moment();
  }

  onDayClick(day, e) {
    const { keepOpenOnDateSelect, minimumNights, selectedShortcut } = this.props;
    let { startDate, endDate } = this.props;
    if (e) e.preventDefault();
    if (selectedShortcut.name !== CUSTOM_RANGE_SHORTCUT) {
      this.props.onShortcutChange({ name: CUSTOM_RANGE_SHORTCUT });
      startDate = null;
      endDate = null;
    }

    if (this.isBlocked(day)) return;

    const { focusedInput } = this.props;

    if (focusedInput === START_DATE) {
      this.props.onFocusChange(END_DATE);

      startDate = day;
      endDate = null;

      if (isInclusivelyAfterDay(day, endDate)) {
        endDate = null;
      }
    } else if (focusedInput === END_DATE) {
      const firstAllowedEndDate = startDate && startDate.clone().add(minimumNights, 'days');

      if (!startDate) {
        endDate = day;
        this.props.onFocusChange(START_DATE);
      } else if (isInclusivelyAfterDay(day, firstAllowedEndDate)) {
        endDate = day;
        if (!keepOpenOnDateSelect) this.props.onFocusChange(null);
        else this.props.onFocusChange(START_DATE);
      } else {
        startDate = day;
        endDate = null;
      }
    }

    this.props.onDatesChange({ startDate, endDate });
  }

  onDayMouseEnter(day) {
    if (this.isTouchDevice) return;

    this.setState({
      hoverDate: day,
    });
  }

  onDayMouseLeave() {
    if (this.isTouchDevice) return;

    this.setState({
      hoverDate: null,
    });
  }

  onShortcutClick(shortcut) {
    this.props.onShortcutChange(shortcut);
  }

  onApply() {
    this.props.onFocusChange(null);
  }

  onCancel() {
    this.props.onFocusChange(null);
  }

  onCompareToChange(isComparing) {
    this.setState({ isComparing });
  }

  onCompareByChange(compareBy) {
    this.setState({ compareBy });
  }

  doesNotMeetMinimumNights(day) {
    const { startDate, isOutsideRange, focusedInput, minimumNights } = this.props;
    if (focusedInput !== END_DATE) return false;

    if (startDate) {
      const dayDiff = day.diff(startDate.clone().startOf('day').hour(12), 'days');
      return dayDiff < minimumNights && dayDiff >= 0;
    }
    return isOutsideRange(moment(day).subtract(minimumNights, 'days'));
  }

  isDayAfterHoveredStartDate(day) {
    const { startDate, endDate, minimumNights } = this.props;
    const { hoverDate } = this.state;
    return !!startDate && !endDate && !this.isBlocked(day) && isNextDay(hoverDate, day) &&
      minimumNights > 0 && isSameDay(hoverDate, startDate);
  }

  isEndDate(day) {
    return isSameDay(day, this.props.endDate);
  }

  isHovered(day) {
    return isSameDay(day, this.state.hoverDate);
  }

  isInHoveredSpan(day) {
    const { startDate, endDate } = this.props;
    const { hoverDate } = this.state;

    const isForwardRange = !!startDate && !endDate &&
      (day.isBetween(startDate, hoverDate) ||
       isSameDay(hoverDate, day));
    const isBackwardRange = !!endDate && !startDate &&
      (day.isBetween(hoverDate, endDate) ||
       isSameDay(hoverDate, day));

    const isValidDayHovered = hoverDate && !this.isBlocked(hoverDate);

    return (isForwardRange || isBackwardRange) && isValidDayHovered;
  }

  isInSelectedSpan(day) {
    const { startDate, endDate } = this.props;
    return day.isBetween(startDate, endDate);
  }

  isLastInRange(day) {
    return this.isInSelectedSpan(day) && isNextDay(day, this.props.endDate);
  }

  isStartDate(day) {
    return isSameDay(day, this.props.startDate);
  }

  isBlocked(day) {
    const { isDayBlocked, isOutsideRange } = this.props;
    return isDayBlocked(day) || isOutsideRange(day) || this.doesNotMeetMinimumNights(day);
  }

  isToday(day) {
    return isSameDay(day, this.today);
  }

  render() {
    const { isComparing, compareBy } = this.state;
    const {
      isDayBlocked,
      isDayHighlighted,
      isOutsideRange,
      isDayHighlightedPrevious,
      numberOfMonths,
      orientation,
      monthFormat,
      navPrev,
      navNext,
      onOutsideClick,
      onPrevMonthClick,
      onNextMonthClick,
      withPortal,
      withControls,
      withShortcuts,
      enableOutsideDays,
      initialVisibleMonth,
      focusedInput,
      renderDay,
      selectedShortcut,
      selectedShortcutPrevious,
      shortcuts,
      shortcutsPrevious,
      onPreviousDatesChange,
      onPreviousShortcutChange,
      previousStartDate,
      previousEndDate,
    } = this.props;

    const modifiers = {
      today: day => this.isToday(day),
      blocked: day => this.isBlocked(day),
      'blocked-calendar': day => isDayBlocked(day),
      'blocked-out-of-range': day => isOutsideRange(day),
      'blocked-minimum-nights': day => this.doesNotMeetMinimumNights(day),
      'highlighted-calendar': day => isDayHighlighted(day),
      valid: day => !this.isBlocked(day),
      // before anything has been set or after both are set
      hovered: day => this.isHovered(day),

      // while start date has been set, but end date has not been
      'hovered-span': day => this.isInHoveredSpan(day),
      'after-hovered-start': day => this.isDayAfterHoveredStartDate(day),
      'last-in-range': day => this.isLastInRange(day),

      // once a start date and end date have been set
      'selected-start': day => this.isStartDate(day),
      'selected-end': day => this.isEndDate(day),
      'selected-span': day => this.isInSelectedSpan(day),
    };

    return (
      <div>
        <DayPicker
          ref={(ref) => { this.dayPicker = ref; }}
          orientation={orientation}
          enableOutsideDays={enableOutsideDays}
          modifiers={modifiers}
          numberOfMonths={numberOfMonths}
          onDayClick={this.onDayClick}
          onShortcutClick={this.onShortcutClick}
          onPreviousDatesChange={onPreviousDatesChange}
          onPreviousShortcutChange={onPreviousShortcutChange}
          onApply={this.onApply}
          onCancel={this.onCancel}
          onDayMouseEnter={this.onDayMouseEnter}
          onDayMouseLeave={this.onDayMouseLeave}
          onPrevMonthClick={onPrevMonthClick}
          onNextMonthClick={onNextMonthClick}
          monthFormat={monthFormat}
          withPortal={withPortal}
          hidden={!focusedInput}
          initialVisibleMonth={initialVisibleMonth}
          onOutsideClick={onOutsideClick}
          navPrev={navPrev}
          navNext={navNext}
          renderDay={renderDay}
          selectedShortcut={selectedShortcut}
          withShortcuts={withShortcuts}
          shortcuts={shortcuts}
        />
        { withControls &&
          <DayPickerControls
            selectedShortcut={selectedShortcutPrevious}
            shortcuts={shortcutsPrevious}
            onDatesChange={onPreviousDatesChange}
            onShortcutChange={onPreviousShortcutChange}
            startDate={previousStartDate}
            endDate={previousEndDate}
            onApply={this.onApply}
            onCancel={this.onCancel}
            isOutsideRange={isOutsideRange}
            isDayHighlighted={isDayHighlightedPrevious}
            isComparing={isComparing}
            initialVisibleMonth={() => (previousStartDate || previousEndDate || initialVisibleMonth())}
            compareBy={compareBy}
            onCompareToChange={this.onCompareToChange}
            onCompareByChange={this.onCompareByChange}
          />
        }
      </div>
    );
  }
}

DayPickerRangeController.propTypes = propTypes;
DayPickerRangeController.defaultProps = defaultProps;
