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
  selectedShortcut: { name: 'Custom Range' },
  selectedShortcutPrevious: { name: 'Custom Range' },

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
};

class DateRangePickerWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.today = moment();

    let focusedInput = null;
    if (props.autoFocus) {
      focusedInput = START_DATE;
    } else if (props.autoFocusEndDate) {
      focusedInput = END_DATE;
    }

    this.state = {
      focusedInput,
      startDate: props.initialStartDate,
      endDate: props.initialEndDate,
      previousStartDate: props.initialStartDate,
      previousEndDate: props.initialEndDate,
      selectedShortcut: props.selectedShortcut,
      selectedShortcutPrevious: props.selectedShortcutPrevious,
    };

    this.updatePreviousPeriod = this.updatePreviousPeriod.bind(this);
    this.getPreviousPeriod = this.getPreviousPeriod.bind(this);

    this.onShortcutChange = this.onShortcutChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onPreviousShortcutChange = this.onPreviousShortcutChange.bind(this);
    this.onPreviousDatesChange = this.onPreviousDatesChange.bind(this);

    this.onFocusChange = this.onFocusChange.bind(this);
  }

  getPreviousPeriod(startDate, endDate, selectedShortcut, selectedShortcutPrevious) {
    if (startDate && endDate) {
      return selectedShortcutPrevious.name === PREVIOUS_PERIOD_SHORTCUT
        ? selectedShortcut.period || [endDate.diff(startDate)]
        : selectedShortcutPrevious.period;
    }
  }

  updatePreviousPeriod(startDate, endDate, period) {
    if ((!startDate && !endDate) || !period) return;
    const previousEndDate = startDate.clone().subtract(1, 'day');
    const previousStartDate = previousEndDate.clone().subtract(...period);

    this.setState({ previousStartDate, previousEndDate });
  }

  onShortcutChange(selectedShortcut) {
    if (selectedShortcut.name !== CUSTOM_RANGE_SHORTCUT) {
      const startDate = this.today.clone().subtract(...selectedShortcut.period);
      const endDate = this.today.clone();
      this.setState({ startDate, endDate });
      const period = this.getPreviousPeriod(
        startDate, endDate, selectedShortcut,
        this.state.selectedShortcutPrevious);
      this.updatePreviousPeriod(startDate, endDate, period);
    }

    this.setState({ selectedShortcut });
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
    const { selectedShortcut, selectedShortcutPrevious } = this.state;
    const period = this.getPreviousPeriod(
      startDate, endDate,
      selectedShortcut, selectedShortcutPrevious);
    this.updatePreviousPeriod(startDate, endDate, period);
  }

  onPreviousDatesChange({ startDate, endDate }) {
    this.setState({ previousStartDate: startDate, previousEndDate: endDate });
  }

  onPreviousShortcutChange(selectedShortcutPrevious) {
    const { startDate, endDate, selectedShortcut } = this.state;
    if (selectedShortcutPrevious.name === PREVIOUS_PERIOD_SHORTCUT) {
      if (startDate && endDate) {
        const period = selectedShortcut.period || [endDate.diff(startDate)];
        const previousEndDate = startDate.clone().subtract(1, 'days');
        const previousStartDate = previousEndDate.clone().subtract(...period);
        this.setState({ previousStartDate, previousEndDate });
      }
    } else if (selectedShortcutPrevious.name !== CUSTOM_RANGE_SHORTCUT) {
      const period = this.getPreviousPeriod(startDate, endDate,
                                            selectedShortcut, selectedShortcutPrevious);
      this.updatePreviousPeriod(startDate, endDate, period);
    }

    this.setState({ selectedShortcutPrevious });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
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
     } = this.state;

    const props = omit(this.props, [
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate',
    ]);

    if (props.withControls) {
      props.isDayHighlighted = props.isDayHighlightedFn && props.isDayHighlightedFn(previousStartDate, previousEndDate);
      props.isDayHighlightedPrevious = props.isDayHighlightedFn && props.isDayHighlightedFn(startDate, endDate);
    }

    return (
      <div>
        <DateRangePicker
          {...props}
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
        />
      </div>
    );
  }
}

DateRangePickerWrapper.propTypes = propTypes;
DateRangePickerWrapper.defaultProps = defaultProps;

export default DateRangePickerWrapper;
