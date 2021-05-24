# generateDeviceCommand

This is simple module to generate the encrypted device command string by passing 'device type', 'command' and 'command value'.

i.e. import the module and use below class and method to generate command string.
    const GenerateCommandString = require('generateDeviceCommand');

    const generateCommandString = new GenerateCommandString('VUL100', 'action.devices.commands.OnOff', true);
    const data = generateCommandString.generateCommandBody()

  > Note: use this repo as a dependancy in your application(add this as dependancy module to your package.json) and import when it is require.
