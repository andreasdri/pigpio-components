# pigpio-components

Components for the [pigpio](https://github.com/fivdi/pigpio) Node.js wrapper.

## Setup

`npm install --save pigpio-components`

## Examples

This example assumes a pullup button connected to GPIO24, and an RGB LED
connected to GPIO25, GPIO08 and GPIO07.

```js
const { Button, RGBLed } = require('pigpio-components');

const button = new Button({ gpio: 24, isPullup: true });
const rgbLed = new RGBLed({ red: 25, green: 8, blue: 7 });

button.on('click', () => console.log('press and release within 500 ms'));

button.on('long press', () => console.log('press and release >= 4000 ms'));

rgbLed.color('blue').on();
rgbLed.off();
rgbLed.color('#DC143C').strobe(1000);
rgbLed.rainbow();
rgbLed.pulse();

```

## API

Read the source for now.

Contributions are welcome.

