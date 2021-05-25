# generateDeviceCommand

This is simple module to generate the encrypted device command string by passing 'device type', 'command' and 'command value'.

### Import to your application ###
i.e. 
  const GenerateCommandString = require('generateDeviceCommand').GenerateCommandString;

  const generateCommandString = new GenerateCommandString('VUL100', 'action.devices.commands.OnOff', true);
  const data = generateCommandString.generateCommandBody()

  > Note: use this repo as a dependancy in your application(add this as dependancy module to your package.json. i.e. "generateDeviceCommand": "git+https://github.com/himesh-wwindia/generateDeviceCommand.git") and import when it is require.
