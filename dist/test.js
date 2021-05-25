const GenerateCommandString = require('./index').GenerateCommandString;

const generateCommandString = new GenerateCommandString('VUL100', 'action.devices.commands.OnOff', true);
const data = generateCommandString.generateCommandBody()

console.log("data --->>>>>  ", data);