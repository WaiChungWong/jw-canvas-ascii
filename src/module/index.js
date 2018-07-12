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
    const { contextType, invert, asciiData } = props;
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

        const context = canvas.getContext(contextType);
        const pixels = context.getImageData(0, 0, width, height).data;

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
  contextType: PropTypes.string,
  invert: PropTypes.bool,
  asciiData: PropTypes.arrayOf(PropTypes.string)
};

CanvasASCII.defaultProps = {
  contextType: "2d",
  invert: false,
  asciiData: [" ", ".", ",", ";", "|", "*", "%", "@", "X", "#", "W", "M"]
};

export default CanvasASCII;
