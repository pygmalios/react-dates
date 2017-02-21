import React from 'react'

const ranges = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'Last Year',
  'Custom Range XX',
];

const defaultProps = {
  shortcuts: ranges,
};

class DayPickerShortcuts extends React.Component {

  isRangeActive(index) {
    return index === this.props.selectedRange;
  }

  render() {
    const { shortcuts, onRangeClick, onApply, onCancel } = this.props;
    return (
      <div className="DayPickerShortcuts__ranges">
        <ul>
          {shortcuts.map((range, i) => (
            <li
              key={`${range}`}
              className={this.isRangeActive(i) ? 'active' : ''}
              onClick={() => onRangeClick(i)}
            >{range}</li>
          ))}
        </ul>
      </div>
    );
  }
}

DayPickerShortcuts.defaultProps = defaultProps;

export default DayPickerShortcuts;
