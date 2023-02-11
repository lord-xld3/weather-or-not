# weather-or-not

A website where you can search for a city, and it will automatically be saved so you can easily search for it again.

[Website](https://lord-xld3.github.io/weather-or-not/)

![Demo image](./build/images/weatherdemo.PNG)

## Info

Not much planning went into this one, there is very little control flow to worry about. I went straight for 'getting the API data', then a time consuming process of handling errors and getting promises to work correctly (the secret sauce was using .catch at the END of our .then chain), and finally some refactoring + beautification.

Since I'm using TypeScript, please refer to /src/script.ts for cleaner code + comments.

CSS was a breeze. I'm not using any frameworks and this is certainly the most organized my code has ever been. I had to go back and forth a bit to show/hide elements and add event listeners.

HTML is well organized too, and I'm getting pretty good at using flex boxes.