const { Gpio } = require('pigpio');
const Color = require('color');

class LED {
  constructor(gpio) {
    this._led = new Gpio(gpio, { mode: Gpio.OUTPUT });
  }
  
  setValue(val) {
    if (val >= 0 && val < 256) {
      this._led.pwmWrite(val);
    }
    else {
      throw new Error('Value must be between 0 and 255');
    }
  }

  off() {
    this._led.digitalWrite(0);
  }
};

class RGBLed {
  constructor(ports) {
    this._leds =
      [new LED(ports.red), new LED(ports.green), new LED(ports.blue)];
    this._timer = null;
    this._rgb = Color.rgb(255, 255, 255).rgb().array();
    process.on('SIGINT', () => {
      this.stop();
      // Wait until other LEDs are cleaned up
      setTimeout(() => process.exit(1), 100);
    });
  }

  color(color) {
    this._rgb = Color(color).rgb().array();
    return this;
  }

  on() {
    this._leds.forEach((led, index) => led.setValue(this._rgb[index]));
    return this;
  }

  off() {
    this._leds.forEach((led) => led.off());
    return this;
  }
  
  stop() {
    this.off();
    if (this._timer) {
      clearInterval(this._timer);
    }
    return this;
  }

  strobe(interval = 1000) {
    if (this._timer) {
      clearInterval(this._timer);
    }

    let on = true; 
    this.on();
    this._timer = setInterval(() => {
      if (on) {
        this.off();
        on = false;
      }
      else {
        this.on();
        on = true;
      }
    }, interval);
    return this;
  }

  pulse(speed = 100) {
    if (this._timer) {
      clearInterval(this._timer);
    }

    let r = 0, g = 0, b = 0;
    this._timer = setInterval(() => {
      this._leds[0].setValue(r);
      this._leds[1].setValue(g);
      this._leds[2].setValue(b);
      r += 5;
      g += 7;
      b += 9;
      if (r > 255) {
        r -= 255;
      }
      if (g > 255) {
        g -= 255;
      }
      if (b > 255) {
        b -= 255;
      }
    }, speed);
    return this;
  }

  rainbow(speed = 500) {
    if (this._timer) {
      clearInterval(this._timer);
    }
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    let index = 0;

    setInterval(() => {
      this.color(colors[index]);
      this.on();
      index++;
      if (index > colors.length - 1) {
        index = 0;
      }
    }, speed);
    return this;
  }
}

module.exports = RGBLed;

