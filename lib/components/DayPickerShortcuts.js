module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	}();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _possibleConstructorReturn(self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var defaultProps = {
	  shortcuts: []
	};

	var DayPickerShortcuts = function (_React$Component) {
	  _inherits(DayPickerShortcuts, _React$Component);

	  function DayPickerShortcuts(props) {
	    _classCallCheck(this, DayPickerShortcuts);

	    var _this = _possibleConstructorReturn(this, (DayPickerShortcuts.__proto__ || Object.getPrototypeOf(DayPickerShortcuts)).call(this, props));

	    _this.isShortcutActive = _this.isShortcutActive.bind(_this);
	    return _this;
	  }

	  _createClass(DayPickerShortcuts, [{
	    key: 'isShortcutActive',
	    value: function () {
	      function isShortcutActive(shortcut) {
	        return shortcut.name === this.props.selectedShortcut.name;
	      }

	      return isShortcutActive;
	    }()
	  }, {
	    key: 'render',
	    value: function () {
	      function render() {
	        var _this2 = this;

	        var _props = this.props;
	        var shortcuts = _props.shortcuts;
	        var onShortcutClick = _props.onShortcutClick;

	        return _react2['default'].createElement('div', { className: 'DayPickerShortcuts__ranges' }, _react2['default'].createElement('ul', null, shortcuts.map(function (shortcut) {
	          return _react2['default'].createElement('li', {
	            key: '' + String(shortcut.name),
	            className: _this2.isShortcutActive(shortcut) ? 'active' : '',
	            onClick: function () {
	              function onClick() {
	                return onShortcutClick(shortcut);
	              }

	              return onClick;
	            }()
	          }, shortcut.name);
	        })));
	      }

	      return render;
	    }()
	  }]);

	  return DayPickerShortcuts;
	}(_react2['default'].Component);

	DayPickerShortcuts.defaultProps = defaultProps;

	exports['default'] = DayPickerShortcuts;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ }
/******/ ]);