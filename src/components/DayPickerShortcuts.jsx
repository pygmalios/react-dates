import React from 'react'

const defaultProps = {
  shortcuts: [],
};

class DayPickerShortcuts extends React.Component {

  constructor(props) {
    super(props)

    this.isShortcutActive = this.isShortcutActive.bind(this);
  }

  isShortcutActive(shortcut) {
    return shortcut.name === this.props.selectedShortcut.name;
  }

  render() {
    const { shortcuts, onShortcutClick } = this.props;

    return (
      <div className="DayPickerShortcuts__ranges">
        <ul>
          {shortcuts.map(shortcut => (
            <li
              key={`${shortcut.name}`}
              className={this.isShortcutActive(shortcut) ? 'active' : ''}
              onClick={() => onShortcutClick(shortcut)}
            >
              {shortcut.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

DayPickerShortcuts.defaultProps = defaultProps;

export default DayPickerShortcuts;
