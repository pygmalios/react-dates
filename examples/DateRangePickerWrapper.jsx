import React, { PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash.omit';

import DateRangePicker from '../src/components/DateRangePicker';

import DateRangePickerShape from '../src/shapes/DateRangePickerShape';
import {
  START_DATE,
  END_DATE,
  HORIZONTAL_ORIENTATION,
  ANCHOR_LEFT,
  CUSTOM_RANGE_SHORTCUT,
  PREVIOUS_PERIOD_SHORTCUT,
} from '../constants';
import isInclusivelyAfterDay from '../src/utils/isInclusivelyAfterDay';

const propTypes = {
  // example props for the demo
  autoFocus: PropTypes.bool,
  autoFocusEndDate: PropTypes.bool,
  initialStartDate: momentPropTypes.momentObj,
  initialEndDate: momentPropTypes.momentObj,

  ...omit(DateRangePickerShape, [
    'startDate',
    'endDate',
    'onDatesChange',
    'focusedInput',
    'onFocusChange',
  ]),
};

const defaultProps = {
  // example props for the demo
  autoFocus: false,
  autoFocusEndDate: false,
  initialStartDate: null,
  initialEndDate: null,
  selectedShortcut: { name: 'Yesterday' },
  selectedShortcutPrevious: { name: 'Previous Period' },

  // input related props
  startDateId: START_DATE,
  startDatePlaceholderText: 'Start Date',
  endDateId: END_DATE,
  endDatePlaceholderText: 'End Date',
  disabled: false,
  required: false,
  screenReaderInputMessage: '',
  showClearDates: false,
  showDefaultInputIcon: false,
  customInputIcon: null,
  customArrowIcon: null,

  // calendar presentation and interaction related props
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 2,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDates: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},

  // day presentation and interaction related props
  renderDay: null,
  minimumNights: 1,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
  isDayHighlighted: () => false,
  isDayHighlightedFn: (d1, d2) => () => false,

  // internationalization
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  phrases: {
    closeDatePicker: 'Close',
    clearDates: 'Clear Dates',
  },
  isComparing: true,
};

class DateRangePickerWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.today = moment().endOf('day');
    this.yesterday = moment().subtract(1, 'days').endOf('day');

    this.shortcuts = [
      { name: 'Today', range: [this.today.clone().startOf('day'), this.today.clone()] },
      { name: 'Yesterday', range: [this.yesterday.clone().startOf('day'), this.yesterday.clone()] },
      { name: 'Last 7 Days', range: [this.yesterday.clone().subtract(6, 'days').startOf('day'), this.yesterday.clone()] },
      { name: 'Last 30 Days', range: [this.yesterday.clone().subtract(29, 'days').startOf('day'), this.yesterday.clone()] },
      { name: 'Last 3 Months', range: [this.yesterday.clone().subtract(3, 'months').add(1, 'days').startOf('day'), this.yesterday.clone()] },
      { name: 'Last 6 Months', range: [this.yesterday.clone().subtract(6, 'months').add(1, 'days').startOf('day'), this.yesterday.clone()] },
      { name: 'Last Year', range: [this.yesterday.clone().subtract(1, 'year').add(1, 'days').startOf('day'), this.yesterday.clone()] },
      { name: 'Custom Range' },
    ];

    this.shortcutsPrevious = [
      { name: 'Previous Period' },
      { name: 'Week ago' },
      { name: 'Month ago' },
      { name: 'Quartal ago' },
      { name: 'Year ago' },
      { name: 'Custom Range' },
    ];

    let focusedInput = null;
    if (props.autoFocus) {
      focusedInput = START_DATE;
    } else if (props.autoFocusEndDate) {
      focusedInput = END_DATE;
    }

    this.state = {
      initialData: {
        startDate: props.initialStartDate,
        endDate: props.initialEndDate,
        previousStartDate: props.initialStartDate,
        previousEndDate: props.initialEndDate,
        selectedShortcut: props.selectedShortcut,
        selectedShortcutPrevious: props.selectedShortcutPrevious,
        isComparing: props.isComparing,
        compareBy: props.compareBy,
      },
      focusedInput,
      startDate: props.initialStartDate,
      endDate: props.initialEndDate,
      previousStartDate: props.initialStartDate,
      previousEndDate: props.initialEndDate,
      selectedShortcut: props.selectedShortcut,
      selectedShortcutPrevious: props.selectedShortcutPrevious,
      isComparing: props.isComparing,
      compareBy: props.compareBy,
    };

    this.updatePreviousPeriod = this.updatePreviousPeriod.bind(this);
    this.updatePreviousShortcuts = this.updatePreviousShortcuts.bind(this);
    this.getPreviousRange = this.getPreviousRange.bind(this);

    this.onShortcutChange = this.onShortcutChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onPreviousShortcutChange = this.onPreviousShortcutChange.bind(this);
    this.onPreviousDatesChange = this.onPreviousDatesChange.bind(this);

    this.onFocusChange = this.onFocusChange.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onIsComparingToggle = this.onIsComparingToggle.bind(this);
    this.onCompareByChange = this.onCompareByChange.bind(this);
  }

  getPreviousRange(startDate, endDate, selectedShortcut, selectedShortcutPrevious) {
    if (startDate && endDate) {
      return selectedShortcutPrevious.name === PREVIOUS_PERIOD_SHORTCUT
        ? [startDate.clone().subtract(endDate.diff(startDate)), startDate.clone().subtract(1, 'days')]
        : selectedShortcutPrevious.range;
    }
  }

  updatePreviousPeriod(startDate, endDate, range) {
    if ((!startDate && !endDate) || !range) return;
    const [previousStartDate, previousEndDate] = range;

    this.setState({ previousStartDate, previousEndDate });
  }

  updatePreviousShortcuts(startDate) {
    const dayBefore = startDate.clone().subtract(1, 'days');
    console.log('update shortcuts previous', this.shortcutsPrevious);
    this.shortcutsPrevious = this.shortcutsPrevious.map((shortcut) => {
      switch (shortcut.name) {
        case 'Week ago': return { ...shortcut, range: [dayBefore.clone().subtract(6, 'days'), dayBefore.clone()] };
        case 'Month ago': return { ...shortcut, range: [dayBefore.clone().subtract(1, 'months').add(1, 'days'), dayBefore.clone()] };
        case 'Quartal ago': return { ...shortcut, range: [dayBefore.clone().subtract(3, 'months').add(1, 'days'), dayBefore.clone()] };
        case 'Year ago': return { ...shortcut, range: [dayBefore.clone().subtract(1, 'years').add(1, 'days'), dayBefore.clone()] };
        default:
          return shortcut;
      }
    });
  }

  onShortcutChange(selectedShortcut) {
    this.setState({ selectedShortcut });
    if (selectedShortcut.name === CUSTOM_RANGE_SHORTCUT) return;
    const [startDate, endDate] = selectedShortcut.range;
    this.setState({ startDate, endDate });
    const range = this.getPreviousRange(startDate, endDate, selectedShortcut, this.state.selectedShortcutPrevious);
    this.updatePreviousPeriod(startDate, endDate, range);
    this.updatePreviousShortcuts(startDate);
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
    const { selectedShortcut, selectedShortcutPrevious } = this.state;
    const range = this.getPreviousRange(
      startDate, endDate,
      selectedShortcut, selectedShortcutPrevious);
    this.updatePreviousShortcuts(startDate);
    this.updatePreviousPeriod(startDate, endDate, range);
  }

  onPreviousDatesChange({ startDate, endDate }) {
    this.setState({ previousStartDate: startDate, previousEndDate: endDate });
  }

  onPreviousShortcutChange(selectedShortcutPrevious) {
    const { startDate, endDate, selectedShortcut } = this.state;
    if (selectedShortcutPrevious.name !== CUSTOM_RANGE_SHORTCUT) {
      const period = this.getPreviousRange(startDate, endDate,
                                            selectedShortcut, selectedShortcutPrevious);
      this.updatePreviousPeriod(startDate, endDate, period);
    }

    console.log(selectedShortcutPrevious);
    this.setState({ selectedShortcutPrevious });
  }

  onFocusChange(focusedInput) {
    const {
      startDate,
      endDate,
      previousStartDate,
      previousEndDate,
      selectedShortcut,
      selectedShortcutPrevious,
      isComparing,
      compareBy,
     } = this.state;
    const isOpening = this.state.focusedInput === null && focusedInput !== null;

    if (isOpening) {
      this.setState({
        initialData: {
          startDate: startDate && startDate.clone(),
          endDate: endDate && endDate.clone(),
          previousStartDate: previousStartDate && previousStartDate.clone(),
          previousEndDate: previousEndDate && previousEndDate.clone(),
          selectedShortcut: { ...selectedShortcut },
          selectedShortcutPrevious: { ...selectedShortcutPrevious },
          isComparing,
          compareBy,
        },
      });
    }

    this.setState({ focusedInput });
  }

  onCompareByChange(compareBy) {
    this.setState({ compareBy });
  }

  onIsComparingToggle() {
    this.setState({ isComparing: !this.state.isComparing });
  }

  onApply() {
    this.setState({ focusedInput: null });
  }

  onCancel() {
    this.setState({ focusedInput: null });
    this.setState({ ...this.state.initialData });
  }

  render() {
    const {
      focusedInput,
      startDate,
      endDate,
      selectedShortcut,
      selectedShortcutPrevious,
      previousStartDate,
      previousEndDate,
      isComparing,
      compareBy,
     } = this.state;

    const props = omit(this.props, [
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate',
    ]);

    if (props.withControls) {
      props.isDayHighlighted = !isComparing ? (() => false)
                                           : props.isDayHighlightedFn(previousStartDate, previousEndDate);
      props.isDayHighlightedPrevious = !isComparing ? (() => false)
                                                   : props.isDayHighlightedFn(startDate, endDate);
    }

    return (
      <div>
        <DateRangePicker
          {...props}
          shortcuts={this.shortcuts}
          shortcutsPrevious={this.shortcutsPrevious}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          onShortcutChange={this.onShortcutChange}
          onPreviousDatesChange={this.onPreviousDatesChange}
          onPreviousShortcutChange={this.onPreviousShortcutChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          selectedShortcut={selectedShortcut}
          selectedShortcutPrevious={selectedShortcutPrevious}
          previousStartDate={previousStartDate}
          previousEndDate={previousEndDate}
          onApply={this.onApply}
          onCancel={this.onCancel}
          isComparing={isComparing}
          compareBy={compareBy}
          onCompareByChange={this.onCompareByChange}
          onIsComparingToggle={this.onIsComparingToggle}
        />
      </div>
    );
  }
}

DateRangePickerWrapper.propTypes = propTypes;
DateRangePickerWrapper.defaultProps = defaultProps;

export default DateRangePickerWrapper;
