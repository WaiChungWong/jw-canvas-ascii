"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*eslint no-unused-vars: ["warn", { "ignoreRestSiblings": true }]*/

var min = Math.min,
    floor = Math.floor;


var SAMPLE_SIZE = 10;
var SAMPLE_ASCII = Array(SAMPLE_SIZE).fill(Array(SAMPLE_SIZE).fill(".").join("")).join("\n");

var CanvasASCII = function (_Component) {
  _inherits(CanvasASCII, _Component);

  function CanvasASCII(props) {
    _classCallCheck(this, CanvasASCII);

    var _this = _possibleConstructorReturn(this, (CanvasASCII.__proto__ || Object.getPrototypeOf(CanvasASCII)).call(this, props));

    _this.textWidth = null;
    _this.textHeight = null;

    _this.update = _this.update.bind(_this);

    _this.state = {
      asciiCode: ""
    };
    return _this;
  }

  _createClass(CanvasASCII, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps !== this.props) {
        this.update();
      }
    }
  }, {
    key: "_getPixels",
    value: function _getPixels() {
      var canvas = this.canvas;
      var width = canvas.width,
          height = canvas.height;

      var context = void 0,
          pixels = void 0;

      if ((context = canvas.getContext("2d")) !== null) {
        pixels = context.getImageData(0, 0, width, height).data;
      } else if ((context = canvas.getContext("webgl")) !== null) {
        var _context = context,
            RGBA = _context.RGBA,
            UNSIGNED_BYTE = _context.UNSIGNED_BYTE;


        pixels = new Uint8Array(4 * width * height);
        context.readPixels(0, 0, width, height, RGBA, UNSIGNED_BYTE, pixels);

        var bytesPerRow = width * 4;
        var temp = new Uint8Array(bytesPerRow);

        for (var i = 0; i < Math.floor(height / 2); i++) {
          var topOffset = i * bytesPerRow;
          var bottomOffset = (height - i - 1) * bytesPerRow;

          temp.set(pixels.subarray(topOffset, topOffset + bytesPerRow));
          pixels.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
          pixels.set(temp, bottomOffset);
        }
      }

      return pixels;
    }
  }, {
    key: "setCanvas",
    value: function setCanvas(canvas) {
      this.canvas = canvas;
      this.update();
    }

    /** Get the pre element with the generated ascii text. */

  }, {
    key: "getTextElement",
    value: function getTextElement() {
      return this.asciiElement;
    }

    /** Generate ascii text from the canvas image data. */

  }, {
    key: "generateAsciiCode",
    value: function generateAsciiCode() {
      var canvas = this.canvas,
          calibrator = this.calibrator,
          props = this.props;
      var invert = props.invert,
          asciiData = props.asciiData;

      var asciiIntervals = 255 / asciiData.length;

      this.textWidth = calibrator.offsetWidth / SAMPLE_SIZE;
      this.textHeight = calibrator.offsetHeight / SAMPLE_SIZE;

      var asciiCode = "";

      if (canvas) {
        var width = canvas.width,
            height = canvas.height,
            offsetWidth = canvas.offsetWidth,
            offsetHeight = canvas.offsetHeight;


        if (width && height && offsetWidth && offsetHeight) {
          var canvasWidthScale = offsetWidth / width;
          var canvasHeightScale = offsetHeight / height;

          var widthScale = this.textWidth / canvasWidthScale;
          var heightScale = this.textHeight / canvasHeightScale;

          var pixels = this._getPixels();

          for (var y = 0; y < height; y += heightScale) {
            for (var x = 0; x < width; x += widthScale) {
              var i = Math.round(y) * width * 4 + Math.round(x) * 4;

              if (i >= pixels.length) {
                break;
              }

              /* turn RGB color to grayscale. */
              var averageValue = pixels[i] + pixels[i + 1] + pixels[i + 2];

              averageValue = averageValue / 3 * pixels[i + 3] / 255;

              /* set revert. */
              if (invert === false) {
                averageValue = 255 - averageValue;
              }

              /* work out the index of the asciiData. */
              var index = min(floor(averageValue / asciiIntervals), asciiData.length - 1);

              asciiCode += asciiData[index];
            }

            asciiCode += "\n";
          }
        }
      }

      return asciiCode;
    }

    /** Update the pre element with generated ascii text. */

  }, {
    key: "update",
    value: function update() {
      this.setState({ asciiCode: this.generateAsciiCode() });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          invert = _props.invert,
          asciiData = _props.asciiData,
          rest = _objectWithoutProperties(_props, ["invert", "asciiData"]);

      var asciiCode = this.state.asciiCode;


      return _react2.default.createElement(
        "div",
        rest,
        _react2.default.createElement(
          "pre",
          {
            ref: function ref(c) {
              return _this2.calibrator = c;
            },
            style: {
              position: "absolute",
              margin: "0px",
              visibility: "hidden"
            }
          },
          SAMPLE_ASCII
        ),
        _react2.default.createElement(
          "pre",
          {
            ref: function ref(a) {
              return _this2.asciiElement = a;
            },
            style: {
              position: "absolute",
              margin: "0px"
            }
          },
          asciiCode
        )
      );
    }
  }]);

  return CanvasASCII;
}(_react.Component);

CanvasASCII.propTypes = {
  invert: _propTypes2.default.bool,
  asciiData: _propTypes2.default.arrayOf(_propTypes2.default.string)
};

CanvasASCII.defaultProps = {
  invert: false,
  asciiData: [" ", ".", ",", ";", "|", "*", "%", "@", "X", "#", "W", "M"]
};

exports.default = CanvasASCII;