import React, { PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash.omit';

import DateRangePicker from '../src/components/DateRangePicker';

import DateRangePickerShape from '../src/shapes/DateRangePickerShape';
import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from '../constants';
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
  selectedRange: 7,

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
      selectedRange: props.selectedRange,
    };

    this.onRangeChange = this.onRangeChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onPreviousShortcutChange = this.onPreviousShortcutChange.bind(this);
    this.onPreviousDatesChange = this.onPreviousDatesChange.bind(this);

    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onRangeChange(selectedRange) {
    this.setState({ selectedRange });
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  onPreviousDatesChange({ startDate, endDate }) {
    console.log('onPreviousDatesChange', startDate, endDate);
    this.setState({ previousStartDate: startDate, previousEndDate: endDate });
  }

  onPreviousShortcutChange(selectedPreviousShortcut) {
    this.setState({ selectedPreviousShortcut });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const {
      focusedInput,
      startDate,
      endDate,
      selectedRange,
      previousStartDate,
      previousEndDate,
     } = this.state;

    const props = omit(this.props, [
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate',
    ]);

    return (
      <div>
        <DateRangePicker
          {...props}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          onRangeChange={this.onRangeChange}
          onPreviousDatesChange={this.onPreviousDatesChange}
          onPreviousShortcutChange={this.onPreviousShortcutChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          selectedRange={selectedRange}
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
