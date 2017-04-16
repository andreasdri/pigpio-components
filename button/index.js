const EventEmitter = require('events');
const { Gpio } = require('pigpio');

class Button extends EventEmitter {
  constructor(options) {
    super();
    this._button = new Gpio(options.gpio, {
      mode: Gpio.INPUT,
      pullUpDown: options.isPullup ? Gpio.PUD_UP : Gpio.PUD_DOWN,
      edge: Gpio.EITHER_EDGE
    });
    this._timer = null;
    this._onInterrupt();
  }

  _onInterrupt() {
    let intervals = 0;
    this._button.on('interrupt', (value) => {
      if (value === 0) {
        this._timer = setInterval(() => {
          intervals++;
        }, 500);
      }
      else if (value === 1 && intervals === 0) {
        clearInterval(this._timer);
        intervals = 0;
        this.emit('click');
      }
      else if (value === 1 && intervals >= 4) {
        clearInterval(this._timer);
        intervals = 0;
        this.emit('long press');
      }
    });
  }
};

module.exports = Button;

