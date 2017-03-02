import React from 'react';
import cx from 'classnames';
import DateRangePickerController from './DateRangePickerInputController';
import { START_DATE, END_DATE } from '../../constants';

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
    } = this.props;

    const className = cx('DayPickerControls__inputs', {
      'DayPickerControls__inputs--disabled': !isComparing,
    });

    const canApply = isRangeSet && (!isComparing || (!!startDate && !!endDate));

    return (

      <div className="DayPickerControls">
        <div className={className}>
          <div>
            <input
              name="compare-to-checkbox"
              type="checkbox"
              checked={isComparing}
              onChange={onIsComparingToggle}
            />
            <label htmlFor="compare-to-checkbox">
              <span></span>
              Compare to
            </label>
          </div>

            <div className="DateRangePicker">
              <DateRangePickerController
                displayFormat="DD.MMM.YYYY"
                customArrowIcon="-"
                startDate={startDate}
                isStartDateFocused={focusedInput === START_DATE}
                endDate={endDate}
                isEndDateFocused={focusedInput === END_DATE}
                onFocusChange={onFocusChange}
                selectedShortcut={selectedShortcut}
                disabled={!isComparing}
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
