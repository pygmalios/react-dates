import React from 'react';
import cx from 'classnames';
import DateRangePickerController from './DateRangePickerInputController';
import { START_DATE, END_DATE } from '../../constants';
import Unchecked from '../svg/check-0.svg';
import Checked from '../svg/check-1.svg';

const Checkbox = ({checked, onClick}) => (
  <div>
    <input
      name="compare-to-checkbox"
      type="checkbox"
      checked={checked}
      onChange={onClick}
    />
    <label htmlFor="compare-to-checkbox">
      <span>
        { checked
        ? <Checked width="16" height="16" />
        : <Unchecked width="16" height="16" /> }
      </span>
        Compare to
    </label>
  </div>
);

export default class DayPickerControls extends React.Component {

  render() {
    const options = [
      { option: 'byPercentage', label: 'Change by % Value' },
      { option: 'byNumeric', label: 'Change by Numeric Value' },
      { option: 'byExact', label: 'Exact Value of Custom Range' },
    ];
    const {
      isRangeSet,
      focusedInput,
      onFocusChange,
      onApply,
      onCancel,
      selectedShortcut,
      onIsComparingToggle,
      onCompareByChange,
      startDate,
      endDate,
      compareBy,
      isComparing,
      displayFormat,
    } = this.props;

    const className = cx('DayPickerControls__inputs', {
      'DayPickerControls__inputs--disabled': !isComparing,
    });

    const canApply = isRangeSet && (!isComparing || (!!startDate && !!endDate));

    return (

      <div className="DayPickerControls">
        <div className={className}>
          <Checkbox
            checked={isComparing}
            onClick={onIsComparingToggle}
          />

          <div className="DateRangePicker">
            <DateRangePickerController
              displayFormat={displayFormat}
              customArrowIcon="-"
              startDate={startDate}
              isStartDateFocused={focusedInput === START_DATE}
              endDate={endDate}
              isEndDateFocused={focusedInput === END_DATE}
              onFocusChange={onFocusChange}
              selectedShortcut={selectedShortcut}
              disabled={!isComparing}
              withSingleInput
            />
          </div>
          { !!compareBy && <span>By</span> }
          { !!compareBy &&
            <select disabled={!isComparing} value={compareBy} onChange={evt => onCompareByChange(evt.target.value)}>
                { options.map(option => <option key={option.option} value={option.option}>{option.label}</option>) }
            </select>
          }
        </div>
        <div className="DayPickerControls__buttons" >
          <button className="success" type="button" disabled={!canApply} onClick={onApply}>Apply</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }
}
