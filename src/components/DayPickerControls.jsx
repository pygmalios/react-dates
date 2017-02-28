import React from 'react';
import DateRangePickerController from './DateRangePickerInputController';
import { START_DATE, END_DATE } from '../../constants';

export default class DayPickerControls extends React.Component {
  render() {
    const { compareBy, onCompareByChange } = this.props;
    const options = [
      { option: 'byPercentage', label: 'Change by % Value' },
      { option: 'byNumeric', label: 'Change by Numeric Value' },
      { option: 'byExact', label: 'Exact Value of Custom Range' },
    ];
    const {
      focusedInput,
      onFocusChange,
      onApply,
      onCancel,
      selectedShortcut,
      onCompareToChange,
      onByValueChange,
      startDate,
      endDate,
      isComparing,
    } = this.props;

    return (

      <div className="DayPickerControls__inputs">
        <label htmlFor="compare-to-checkbox">
          Compare to
          <input
            name="compare-to-checkbox"
            type="checkbox"
            checked={isComparing}
            onChange={() => onCompareToChange(!isComparing)}
          />
        </label>

        { isComparing &&
          <div className="DateRangePicker">
            <DateRangePickerController
              startDate={startDate}
              isStartDateFocused={focusedInput === START_DATE}
              endDate={endDate}
              isEndDateFocused={focusedInput === END_DATE}
              onFocusChange={onFocusChange}
              selectedShortcut={selectedShortcut}
            />
          </div>
        }
        { isComparing && <span>By</span> }

        { isComparing &&
          (<select value={compareBy} onChange={evt => onCompareByChange(evt.target.value)}>
            { options.map(option => <option key={option.option} value={option.option}>{option.label}</option>) }
          </select>)
        }

        <button className="success" type="button" onClick={onApply}>Apply</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    );
  }
}
