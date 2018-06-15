import React, { Component } from "react";
import { render } from "react-dom";

import CanvasASCII from "./module";

import "./style.css";

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontSize: 7,
      invert: false
    };

    this._resizeHandler = this._resizeHandler.bind(this);
  }

  componentDidMount() {
    const { canvas, ascii } = this;

    let context = canvas.getContext("2d");
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = 70;
    let eyeRadius = 10;
    let eyeXOffset = 25;
    let eyeYOffset = 20;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw the yellow circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = "yellow";
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = "black";
    context.stroke();

    // draw the eyes
    context.beginPath();
    let eyeY = centerY - eyeYOffset;
    context.arc(centerX - eyeXOffset, eyeY, eyeRadius, 0, 2 * Math.PI, false);
    context.arc(centerX + eyeXOffset, eyeY, eyeRadius, 0, 2 * Math.PI, false);
    context.fillStyle = "black";
    context.fill();

    // draw the mouth
    context.beginPath();
    context.arc(centerX, centerY, 50, 0, Math.PI, false);
    context.stroke();

    ascii.setCanvas(canvas);

    window.addEventListener("resize", this._resizeHandler, false);
    canvas.addEventListener("resize", this._resizeHandler, false);
  }

  componentWillUnmount() {
    const { canvas } = this;

    window.removeEventListener("resize", this._resizeHandler);
    canvas.removeEventListener("resize", this._resizeHandler);
  }

  _resizeHandler() {
    this.ascii.update();
  }

  render() {
    const { fontSize, invert } = this.state;

    return (
      <div id="demo">
        <canvas ref={c => (this.canvas = c)} />
        <CanvasASCII
          ref={a => (this.ascii = a)}
          style={{ fontSize: `${fontSize}px` }}
          invert={invert}
        />
        <div className="settings">
          <div className="field">
            <label>invert: </label>
            <input
              type="checkbox"
              checked={invert}
              onChange={e => this.setState({ invert: e.target.checked })}
            />
          </div>
          <div className="field">
            <label>font size: </label>
            <input
              type="number"
              value={fontSize}
              onChange={e => this.setState({ fontSize: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  }
}

render(<Demo />, document.getElementById("root"));
