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

const shortcutShape = PropTypes.shape({
  name: PropTypes.string.required,
  period: PropTypes.array,
});

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

  onShortcutChange: PropTypes.func,
  onPreviousDatesChange: PropTypes.func,
  onPreviousShortcutChange: PropTypes.func,
  isDayHighlightedPrevious: PropTypes.func,

  selectedShortcut: shortcutShape,
  selectedShortcutPrevious: shortcutShape,
  shortcuts: PropTypes.arrayOf(shortcutShape),
  shortcutsPrevious: PropTypes.arrayOf(shortcutShape),
  previousStartDate: momentPropTypes.momentObj,
  previousEndDate: momentPropTypes.momentObj,

  withShortcuts: PropTypes.bool,
  withControls: PropTypes.bool,
  isPrevious: PropTypes.bool,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  isComparing: PropTypes.bool,
  onIsComparingToggle: PropTypes.func,
  compareBy: PropTypes.string,
  onCompareByChange: PropTypes.func,
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
  onApply: () => {},
  onCancel: () => {},
  onIsComparingToggle: () => {},
  onCompareByChange: () => {},
  isComparing: true,
  compareBy: 'byPercentage',
};

export default class DayPickerRangeController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInputPrevious: null,
      hoverDate: null,
    };

    this.isTouchDevice = isTouchDevice();
    this.today = moment();

    this.onDayClick = this.onDayClick.bind(this);
    this.onShortcutClick = this.onShortcutClick.bind(this);
    this.onDayMouseEnter = this.onDayMouseEnter.bind(this);
    this.onDayMouseLeave = this.onDayMouseLeave.bind(this);

    this.onPreviousDayClick = this.onPreviousDayClick.bind(this);
    this.onPreviousShortcutClick = this.onPreviousShortcutClick.bind(this);
    this.onPreviousDayMouseEnter = this.onPreviousDayMouseEnter.bind(this);
    this.onPreviousDayMouseLeave = this.onPreviousDayMouseLeave.bind(this);
    this.onFocusChangePrevious = this.onFocusChangePrevious.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isComparing) this.setState({ focusedInputPrevious: null });
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

  onDayMouseEnter(hoverDate) {
    if (this.isTouchDevice) return;
    this.setState({ hoverDate });
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

  onFocusChangePrevious(focusedInputPrevious) {
    this.setState({ focusedInputPrevious });
  }

  onPreviousDayClick(day, e) {
    const { focusedInputPrevious } = this.state;
    const { minimumNights, selectedShortcutPrevious } = this.props;
    let { previousStartDate, previousEndDate } = this.props;
    if (e) e.preventDefault();
    if (selectedShortcutPrevious.name !== CUSTOM_RANGE_SHORTCUT) {
      this.props.onPreviousShortcutChange({ name: CUSTOM_RANGE_SHORTCUT });
      previousStartDate = null;
      previousEndDate = null;
    }

    if (this.isBlocked(day)) return;

    if (focusedInputPrevious === START_DATE) {
      this.setState({ focusedInputPrevious: END_DATE });

      previousStartDate = day;
      previousEndDate = null;

      if (isInclusivelyAfterDay(day, previousEndDate)) {
        previousEndDate = null;
      }
    } else if (focusedInputPrevious === END_DATE) {
      const firstAllowedEndDate = previousStartDate && previousStartDate.clone().add(minimumNights, 'days');

      if (!previousStartDate) {
        previousEndDate = day;
        this.props.onFocusChangePrevious(START_DATE);
      } else if (isInclusivelyAfterDay(day, firstAllowedEndDate)) {
        previousEndDate = day;
        this.setState({ focusedInputPrevious: START_DATE });
      } else {
        previousStartDate = day;
        previousEndDate = null;
      }
    }

    this.props.onPreviousDatesChange({ startDate: previousStartDate, endDate: previousEndDate });
  }

  onPreviousDayMouseEnter(previousHoverDate) {
    if (this.isTouchDevice) return;
    this.setState({ previousHoverDate });
  }

  onPreviousDayMouseLeave() {
    if (this.isTouchDevice) return;
    this.setState({ previousHoverDate: null });
  }

  onPreviousShortcutClick(shortcut) {
    this.props.onPreviousShortcutChange(shortcut);
  }

  doesNotMeetMinimumNights(day, startDate, focusedInput) {
    const { isOutsideRange, minimumNights } = this.props;
    if (focusedInput !== END_DATE) return false;

    if (startDate) {
      const dayDiff = day.diff(startDate.clone().startOf('day').hour(12), 'days');
      return dayDiff < minimumNights && dayDiff >= 0;
    }
    return isOutsideRange(moment(day).subtract(minimumNights, 'days'));
  }

  isDayAfterHoveredStartDate(day, startDate, endDate, hoverDate) {
    const { minimumNights } = this.props;
    return startDate && !endDate && !this.isBlocked(day) && isNextDay(hoverDate, day) &&
      minimumNights > 0 && isSameDay(hoverDate, day);
  }

  isEndDate(day, endDate) {
    return isSameDay(day, endDate);
  }

  isHovered(day, hoverDate) {
    return isSameDay(day, hoverDate);
  }

  isInHoveredSpan(day, startDate, endDate, hoverDate) {
    const isForwardRange = !!startDate && !endDate &&
      (day.isBetween(startDate, hoverDate) ||
       isSameDay(hoverDate, day));
    const isBackwardRange = !!endDate && !startDate &&
      (day.isBetween(hoverDate, endDate) ||
       isSameDay(hoverDate, day));

    const isValidDayHovered = hoverDate && !this.isBlocked(hoverDate);

    return (isForwardRange || isBackwardRange) && isValidDayHovered;
  }

  isInSelectedSpan(day, startDate, endDate) {
    return day.isBetween(startDate, endDate);
  }

  isLastInRange(day, startDate, endDate) {
    return this.isInSelectedSpan(day, startDate, endDate) && isNextDay(day, endDate);
  }

  isStartDate(day, startDate) {
    return isSameDay(day, startDate);
  }

  isBlocked(day) {
    const { isDayBlocked, isOutsideRange } = this.props;
    return isDayBlocked(day) || isOutsideRange(day) || this.doesNotMeetMinimumNights(day);
  }

  isToday(day) {
    return isSameDay(day, this.today);
  }

  render() {
    const {
      focusedInputPrevious,
      hoverDate,
      previousHoverDate,
    } = this.state;
    const {
      startDate,
      endDate,
      previousStartDate,
      previousEndDate,
      isDayBlocked,
      isDayHighlighted,
      isOutsideRange,
      isDayHighlightedPrevious,
      numberOfMonths,
      orientation,
      displayFormat,
      monthFormat,
      navPrev,
      navNext,
      onOutsideClick,
      onPrevMonthClick,
      onNextMonthClick,
      onApply,
      onCancel,
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
      isComparing,
      compareBy,
      onIsComparingToggle,
      onCompareByChange,
    } = this.props;

    const modifiers = {
      today: day => this.isToday(day),
      blocked: day => this.isBlocked(day),
      'blocked-calendar': day => isDayBlocked(day),
      'blocked-out-of-range': day => isOutsideRange(day),
      'blocked-minimum-nights': day => this.doesNotMeetMinimumNights(day, startDate, focusedInput),
      'highlighted-calendar-span': day => isDayHighlighted(day),
      'highlighted-calendar-start': day => isComparing && isSameDay(day, previousStartDate),
      'highlighted-calendar-end': day => isComparing && isSameDay(day, previousEndDate),
      valid: day => !this.isBlocked(day),
      // before anything has been set or after both are set
      hovered: day => this.isHovered(day, hoverDate),

      // while start date has been set, but end date has not been
      'hovered-span': day => this.isInHoveredSpan(day, startDate, endDate, hoverDate),
      'after-hovered-start': day => this.isDayAfterHoveredStartDate(day, startDate, endDate, hoverDate),
      'last-in-range': day => this.isLastInRange(day, startDate, endDate),

      // once a start date and end date have been set
      'selected-start': day => this.isStartDate(day, startDate),
      'selected-end': day => this.isEndDate(day, endDate),
      'selected-span': day => this.isInSelectedSpan(day, startDate, endDate),
    };

    const modifiersPrevious = {
      today: day => this.isToday(day),
      blocked: day => this.isBlocked(day),
      'blocked-calendar': day => isDayBlocked(day),
      'blocked-out-of-range': day => isOutsideRange(day),
      'blocked-minimum-nights': day => this.doesNotMeetMinimumNights(day, previousStartDate, focusedInputPrevious),
      'highlighted-calendar-span': day => isDayHighlightedPrevious(day),
      'highlighted-calendar-start': day => isSameDay(day, startDate),
      'highlighted-calendar-end': day => isSameDay(day, endDate),
      valid: day => !this.isBlocked(day),
      // before anything has been set or after both are set
      hovered: day => this.isHovered(day, previousHoverDate),

      // while start date has been set, but end date has not been
      'hovered-span': day => this.isInHoveredSpan(day, previousStartDate, previousEndDate, previousHoverDate),
      'after-hovered-start': day => this.isDayAfterHoveredStartDate(day, previousStartDate, previousEndDate, previousHoverDate),
      'last-in-range': day => this.isLastInRange(day, previousStartDate, previousEndDate),

      // once a start date and end date have been set
      'selected-start': day => this.isStartDate(day, previousStartDate),
      'selected-end': day => this.isEndDate(day, previousEndDate),
      'selected-span': day => this.isInSelectedSpan(day, previousStartDate, previousEndDate),
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

        <div className="ComparisonPanel">
          { withControls &&
            <DayPickerControls
              displayFormat={displayFormat}
              isRangeSet={!!startDate && !!endDate}
              startDate={previousStartDate}
              endDate={previousEndDate}
              selectedShortcut={selectedShortcutPrevious}
              focusedInput={focusedInputPrevious}
              onFocusChange={this.onFocusChangePrevious}
              onApply={onApply}
              onCancel={onCancel}
              isComparing={isComparing}
              compareBy={compareBy}
              onIsComparingToggle={onIsComparingToggle}
              onCompareByChange={onCompareByChange}
            />
          }
          { focusedInputPrevious &&
            <DayPicker
              initialVisibleMonth={() => (previousStartDate || previousEndDate || initialVisibleMonth())}
              orientation={orientation}
              enableOutsideDays={enableOutsideDays}
              modifiers={modifiersPrevious}
              numberOfMonths={numberOfMonths}
              onDayClick={this.onPreviousDayClick}
              onShortcutClick={this.onPreviousShortcutClick}
              onDayMouseEnter={this.onPreviousDayMouseEnter}
              onDayMouseLeave={this.onPreviousDayMouseLeave}
              onPrevMonthClick={onPrevMonthClick}
              onNextMonthClick={onNextMonthClick}
              monthFormat={monthFormat}
              withPortal={withPortal}
              hidden={!focusedInputPrevious}
              navPrev={navPrev}
              navNext={navNext}
              renderDay={renderDay}
              shortcuts={shortcutsPrevious}
              selectedShortcut={selectedShortcutPrevious}
              withShortcuts
              isPrevious
            />
          }
        </div>
      </div>
    );
  }
}

DayPickerRangeController.propTypes = propTypes;
DayPickerRangeController.defaultProps = defaultProps;
