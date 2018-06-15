# jw-canvas-ascii

A text react component which renders the ascii text converted from a canvas image data.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/jw-canvas-ascii.svg
[npm-url]: http://npmjs.org/package/jw-canvas-ascii
[travis-image]: https://img.shields.io/travis/WaiChungWong/jw-canvas-ascii.svg
[travis-url]: https://travis-ci.org/WaiChungWong/jw-canvas-ascii
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/jw-canvas-ascii.svg
[download-url]: https://npmjs.org/package/jw-canvas-ascii

## Install

[![NPM](https://nodei.co/npm/jw-canvas-ascii.png)](https://nodei.co/npm/jw-canvas-ascii)

## Methods

| Method              | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| `setCanvas`         | set a target canvas component to convert image data from        |
| `getTextElement`    | retrieve the ascii text element                                 |
| `generateAsciiCode` | returns a newly generated ascii text from the canvas image data |
| `update`            | re-render ascii text onto the text element                      |

## Props

| Prop                  | Description                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `asciiData`(optional) | an array of character to present the ascii with.<br>Ordered from brightest (white) to darkest (black).<br>Default: [" ", ".", ",", ";", " | ", "\*", "%", "@", "X", "#", "W", "M"] |
| `invert`(optional)    | whether to reverse the `asciiData` ordering<br>Default: `false`                                                                           |

## Usage

```javascript
import CanvasASCII from "jw-canvas-ascii";

class Example extends Component {
  constructor(props) {
    super(props);

    this._resizeHandler = this._resizeHandler.bind(this);
  }

  componentDidMount() {
    const { canvas, ascii } = this;

    let context = canvas.getContext("2d");

    /**** Start drawing on the canvas here. *****/

    ascii.setCanvas(canvas);

    /** Handle auto update when the canvas size changes. */
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
    return (
      <div id="example">
        <canvas ref={c => (this.canvas = c)} />
        <CanvasASCII ref={a => (this.ascii = a)} invert={false} />
      </div>
    );
  }
}

render(<Example />, document.getElementById("root"));
```
