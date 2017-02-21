import React, { PropTypes } from 'react';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash.omit';

import DateRangePickerInputController from './DateRangePickerInputController';

import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from '../../constants';
import isInclusivelyAfterDay from '../utils/isInclusivelyAfterDay';

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

class PreviousDateRangePicker extends React.Component {
  constructor(props) {
    super(props);

    let focusedInput = null;
    if (props.autoFocus) {
      focusedInput = START_DATE;
    } else if (props.autoFocusEndDate) {
      focusedInput = END_DATE;
    }

    this.state = {
      startDate: props.initialStartDate,
      endDate: props.initialEndDate,
      selectedRange: props.selectedRange,
    };

    this.onRangeChange = this.onRangeChange.bind(this);
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onRangeChange(selectedRange) {
    this.setState({ selectedRange });
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const { startDate, endDate } = this.state;
    const {
      startDateId,
      endDateId,
      displayFormat,
      isOutsideRange,
      selectedRange,
      onFocusChange,
      focusedInput
    } = this.props;
    const props = omit(this.props, [
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate',
    ]);


    return (
      <div className="DateRangePicker">
        <DateRangePickerInputController
          startDate={startDate}
          startDateId={startDateId}
          isStartDateFocused={focusedInput === START_DATE}
          endDate={endDate}
          endDateId={endDateId}
          isEndDateFocused={focusedInput === END_DATE}
          displayFormat={displayFormat}
          isOutsideRange={isOutsideRange}
          onDatesChange={this.onDatesChange}
          onFocusChange={onFocusChange}
          selectedRange={selectedRange}
        />
      </div>
    );
  }
}

// PreviousDateRangePicker.propTypes = propTypes;
PreviousDateRangePicker.defaultProps = defaultProps;

export default PreviousDateRangePicker;
