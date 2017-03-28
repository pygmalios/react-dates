import React, { PropTypes } from 'react';
import { forbidExtraProps } from 'airbnb-prop-types';
import cx from 'classnames';

import DateInput from './DateInput';
import RightArrow from '../svg/arrow-right.svg';
import CloseButton from '../svg/close.svg';
import CalendarIcon from '../svg/calendar.svg';

import { START_DATE, END_DATE } from '../../constants';

const shortcutShape = PropTypes.shape({
  name: PropTypes.string.required,
  period: PropTypes.array,
});
const propTypes = forbidExtraProps({
  startDateId: PropTypes.string,
  startDatePlaceholderText: PropTypes.string,
  screenReaderMessage: PropTypes.string,

  endDateId: PropTypes.string,
  endDatePlaceholderText: PropTypes.string,

  onStartDateFocus: PropTypes.func,
  onEndDateFocus: PropTypes.func,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  onStartDateShiftTab: PropTypes.func,
  onEndDateTab: PropTypes.func,
  onClearDates: PropTypes.func,

  startDate: PropTypes.string,
  startDateValue: PropTypes.string,
  endDate: PropTypes.string,
  endDateValue: PropTypes.string,

  isStartDateFocused: PropTypes.bool,
  isEndDateFocused: PropTypes.bool,
  showClearDates: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  showCaret: PropTypes.bool,
  showDefaultInputIcon: PropTypes.bool,
  customInputIcon: PropTypes.node,
  customArrowIcon: PropTypes.node,

  // i18n
  phrases: PropTypes.shape({
    clearDates: PropTypes.node,
  }),

  selectedShortcut: shortcutShape,
  withSingleInput: PropTypes.bool,
  showDropdownCaret: PropTypes.bool,
});

const defaultProps = {
  startDateId: START_DATE,
  endDateId: END_DATE,
  startDatePlaceholderText: 'Start Date',
  endDatePlaceholderText: 'End Date',
  screenReaderMessage: '',
  onStartDateFocus() {},
  onEndDateFocus() {},
  onStartDateChange() {},
  onEndDateChange() {},
  onStartDateShiftTab() {},
  onEndDateTab() {},
  onClearDates() {},

  startDate: '',
  startDateValue: '',
  endDate: '',
  endDateValue: '',

  isStartDateFocused: false,
  isEndDateFocused: false,
  showClearDates: false,
  disabled: false,
  required: false,
  showCaret: false,
  showDefaultInputIcon: false,
  customInputIcon: null,
  customArrowIcon: null,

  // i18n
  phrases: {
    clearDates: 'Clear Dates',
  },
};

export default class DateRangePickerInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isClearDatesHovered: false,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClearDatesMouseEnter = this.onClearDatesMouseEnter.bind(this);
    this.onClearDatesMouseLeave = this.onClearDatesMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({
      isHovered: true,
    });
  }

  onMouseLeave() {
    this.setState({
      isHovered: false,
    });
  }

  onClearDatesMouseEnter() {
    this.setState({
      isClearDatesHovered: true,
    });
  }

  onClearDatesMouseLeave() {
    this.setState({
      isClearDatesHovered: false,
    });
  }

  render() {
    const { isClearDatesHovered } = this.state;
    const {
      startDate,
      startDateValue,
      startDateId,
      startDatePlaceholderText,
      screenReaderMessage,
      isStartDateFocused,
      onStartDateChange,
      onStartDateFocus,
      onStartDateShiftTab,
      endDate,
      endDateValue,
      endDateId,
      endDatePlaceholderText,
      isEndDateFocused,
      onEndDateChange,
      onEndDateFocus,
      onEndDateTab,
      onClearDates,
      showClearDates,
      disabled,
      required,
      showCaret,
      showDefaultInputIcon,
      customInputIcon,
      customArrowIcon,
      phrases,
      selectedShortcut,
      withSingleInput,
      showDropdownCaret,
    } = this.props;

    const hasDefaultPeriod = selectedShortcut.range;
    const inputIcon = customInputIcon || (<CalendarIcon />);
    const arrowIcon = customArrowIcon || (<RightArrow />);
    let startDisplayValue = hasDefaultPeriod ? selectedShortcut.name : startDate;
    startDisplayValue = (withSingleInput && !hasDefaultPeriod) ?
      `${startDisplayValue || 'Start Date'} - ${endDate || 'End Date'}` : startDisplayValue;


    return (
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        className={cx('DateRangePickerInput', {
          'DateRangePickerInput--disabled': disabled,
          'DateRangePickerInput--hovered': this.state.isHovered,
          'DateRangePickerInput--focused': isStartDateFocused || isEndDateFocused,
        })}
      >
        {(showDefaultInputIcon || customInputIcon !== null) &&
          <span
            className="DateRangePickerInput__calendar-icon"
            onClick={onStartDateFocus}
          >
            {inputIcon}
          </span>
        }

        <DateInput
          id={startDateId}
          placeholder={startDatePlaceholderText}
          displayValue={startDisplayValue}
          inputValue={startDateValue}
          screenReaderMessage={screenReaderMessage}
          focused={isStartDateFocused || (withSingleInput && isEndDateFocused)}
          disabled={disabled}
          required={required}
          showCaret={showCaret}
          onChange={onStartDateChange}
          onFocus={onStartDateFocus}
          onKeyDownShiftTab={onStartDateShiftTab}
          showPeriod={withSingleInput && !hasDefaultPeriod}
        />

        { (!hasDefaultPeriod && !withSingleInput) &&
        <div className="DateRangePickerInput__arrow">
          {arrowIcon}
        </div>
        }
        { (!hasDefaultPeriod && !withSingleInput) &&
          <DateInput
            id={endDateId}
            placeholder={endDatePlaceholderText}
            displayValue={endDate}
            inputValue={endDateValue}
            screenReaderMessage={screenReaderMessage}
            focused={isEndDateFocused}
            disabled={disabled}
            required={required}
            showCaret={showCaret}

            onChange={onEndDateChange}
            onFocus={onEndDateFocus}
            onKeyDownTab={onEndDateTab}
          />
        }

        {showClearDates &&
          <button
            type="button"
            className={cx('DateRangePickerInput__clear-dates', {
              'DateRangePickerInput__clear-dates--hide': !(startDate || endDate),
              'DateRangePickerInput__clear-dates--hover': isClearDatesHovered,
            })}
            onMouseEnter={this.onClearDatesMouseEnter}
            onMouseLeave={this.onClearDatesMouseLeave}
            onClick={onClearDates}
          >
            <span className="screen-reader-only">
              {phrases.clearDates}
            </span>
            <CloseButton />
          </button>
        }

        {showDropdownCaret &&
          <b
            className={cx('DateRangePickerInput__caret', {
              'DateRangePickerInput__caret--focused': isStartDateFocused || isEndDateFocused,
            })}
            onClick={onStartDateFocus}
          />
        }
      </div>
    );
  }
}

DateRangePickerInput.propTypes = propTypes;
DateRangePickerInput.defaultProps = defaultProps;
