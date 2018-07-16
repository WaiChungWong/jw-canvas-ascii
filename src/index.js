import React, { Component } from "react";
import { render } from "react-dom";
import {
  Scene,
  PerspectiveCamera,
  PointLight,
  BoxGeometry,
  MeshLambertMaterial,
  Mesh
} from "three";

import ThreeCanvas from "jw-three-canvas";

import CanvasASCII from "./module";

import "./style.css";

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontSize: 7,
      invert: false,
      showDrawing: true
    };

    this._resizeHandler = this._resizeHandler.bind(this);
    this.animate = this.animate.bind(this);

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(50, 1, 1, 1000);
    this.camera.position.z = 60;
    this.scene.add(this.camera);

    let light = new PointLight(0xffff00);
    light.position.set(10, 0, 25);
    this.scene.add(light);

    let geometry = new BoxGeometry(20, 20, 20);
    let material = new MeshLambertMaterial({ color: 0x55ff55 });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  animate(width, height, timeDiff) {
    const { cube } = this;

    cube.rotation.x += timeDiff;
    cube.rotation.y += timeDiff;

    this.ascii2.update();
  }

  componentDidMount() {
    const { canvas1, ascii1, canvas2, ascii2 } = this;

    let context = canvas1.getContext("2d");
    let centerX = canvas1.width / 2;
    let centerY = canvas1.height / 2;
    let radius = 70;
    let eyeRadius = 10;
    let eyeXOffset = 25;
    let eyeYOffset = 20;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas1.width, canvas1.height);

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

    ascii1.setCanvas(canvas1);

    canvas2.renderer.setClearColor(0xffffff);
    ascii2.setCanvas(canvas2.getCanvasElement());

    canvas2.animator.start();

    window.addEventListener("resize", this._resizeHandler, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._resizeHandler);
  }

  _resizeHandler() {
    this.ascii1.update();
    this.ascii2.update();
  }

  render() {
    const { scene, camera, state } = this;
    const { fontSize, invert, showDrawing } = state;

    return (
      <div id="demo">
        <div className="ascii">
          <canvas
            ref={c => (this.canvas1 = c)}
            className={showDrawing ? "show" : ""}
          />
          <CanvasASCII
            ref={a => (this.ascii1 = a)}
            style={{ fontSize: `${fontSize}px` }}
            invert={invert}
          />
        </div>
        <div className="ascii">
          <ThreeCanvas
            className={showDrawing ? "show" : ""}
            ref={c => (this.canvas2 = c)}
            animate={this.animate}
            scene={scene}
            camera={camera}
          />
          <CanvasASCII
            ref={a => (this.ascii2 = a)}
            style={{ fontSize: `${fontSize}px` }}
            invert={invert}
          />
        </div>
        <div id="settings">
          <div className="title">Settings</div>
          <div className="field">
            <label htmlFor="invert">invert value: </label>
            <input
              id="invert"
              type="checkbox"
              checked={invert}
              onChange={e => this.setState({ invert: e.target.checked })}
            />
          </div>
          <div className="field">
            <label htmlFor="fontSize">font size: </label>
            <input
              id="fontSize"
              type="number"
              value={fontSize}
              onChange={e => this.setState({ fontSize: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="showDrawing">show drawing: </label>
            <input
              id="showDrawing"
              type="checkbox"
              checked={showDrawing}
              onChange={e => this.setState({ showDrawing: e.target.checked })}
            />
          </div>
        </div>
      </div>
    );
  }
}

render(<Demo />, document.getElementById("root"));
