/*eslint no-unused-vars: ["warn", { "ignoreRestSiblings": true }]*/

import React, { Component } from "react";
import PropTypes from "prop-types";

const { min, floor } = Math;

const SAMPLE_SIZE = 10;
const SAMPLE_ASCII = Array(SAMPLE_SIZE)
  .fill(
    Array(SAMPLE_SIZE)
      .fill(".")
      .join("")
  )
  .join("\n");

class CanvasASCII extends Component {
  constructor(props) {
    super(props);

    this.textWidth = null;
    this.textHeight = null;

    this.update = this.update.bind(this);

    this.state = {
      asciiCode: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.update();
    }
  }

  _getPixels() {
    const { canvas } = this;
    const { width, height } = canvas;
    let context, pixels;

    if ((context = canvas.getContext("2d")) !== null) {
      pixels = context.getImageData(0, 0, width, height).data;
    } else if ((context = canvas.getContext("webgl")) !== null) {
      const { RGBA, UNSIGNED_BYTE } = context;

      pixels = new Uint8Array(4 * width * height);
      context.readPixels(0, 0, width, height, RGBA, UNSIGNED_BYTE, pixels);

      let bytesPerRow = width * 4;
      let temp = new Uint8Array(bytesPerRow);

      for (let i = 0; i < Math.floor(height / 2); i++) {
        let topOffset = i * bytesPerRow;
        let bottomOffset = (height - i - 1) * bytesPerRow;

        temp.set(pixels.subarray(topOffset, topOffset + bytesPerRow));
        pixels.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
        pixels.set(temp, bottomOffset);
      }
    }

    return pixels;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.update();
  }

  /** Get the pre element with the generated ascii text. */
  getTextElement() {
    return this.asciiElement;
  }

  /** Generate ascii text from the canvas image data. */
  generateAsciiCode() {
    const { canvas, calibrator, props } = this;
    const { invert, asciiData } = props;
    const asciiIntervals = 255 / asciiData.length;

    this.textWidth = calibrator.offsetWidth / SAMPLE_SIZE;
    this.textHeight = calibrator.offsetHeight / SAMPLE_SIZE;

    let asciiCode = "";

    if (canvas) {
      const { width, height, offsetWidth, offsetHeight } = canvas;

      if (width && height && offsetWidth && offsetHeight) {
        const canvasWidthScale = offsetWidth / width;
        const canvasHeightScale = offsetHeight / height;

        const widthScale = this.textWidth / canvasWidthScale;
        const heightScale = this.textHeight / canvasHeightScale;

        const pixels = this._getPixels();

        for (let y = 0; y < height; y += heightScale) {
          for (let x = 0; x < width; x += widthScale) {
            let i = Math.round(y) * width * 4 + Math.round(x) * 4;

            if (i >= pixels.length) {
              break;
            }

            /* turn RGB color to grayscale. */
            let averageValue = pixels[i] + pixels[i + 1] + pixels[i + 2];

            averageValue = ((averageValue / 3) * pixels[i + 3]) / 255;

            /* set revert. */
            if (invert === false) {
              averageValue = 255 - averageValue;
            }

            /* work out the index of the asciiData. */
            const index = min(
              floor(averageValue / asciiIntervals),
              asciiData.length - 1
            );

            asciiCode += asciiData[index];
          }

          asciiCode += "\n";
        }
      }
    }

    return asciiCode;
  }

  /** Update the pre element with generated ascii text. */
  update() {
    this.setState({ asciiCode: this.generateAsciiCode() });
  }

  render() {
    const { invert, asciiData, ...rest } = this.props;
    const { asciiCode } = this.state;

    return (
      <div {...rest}>
        <pre
          ref={c => (this.calibrator = c)}
          style={{
            position: "absolute",
            margin: "0px",
            visibility: "hidden"
          }}
        >
          {SAMPLE_ASCII}
        </pre>
        <pre
          ref={a => (this.asciiElement = a)}
          style={{
            position: "absolute",
            margin: "0px"
          }}
        >
          {asciiCode}
        </pre>
      </div>
    );
  }
}

CanvasASCII.propTypes = {
  invert: PropTypes.bool,
  asciiData: PropTypes.arrayOf(PropTypes.string)
};

CanvasASCII.defaultProps = {
  invert: false,
  asciiData: [" ", ".", ",", ";", "|", "*", "%", "@", "X", "#", "W", "M"]
};

export default CanvasASCII;
