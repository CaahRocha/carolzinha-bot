
const { version } = require("../../package.json");

exports.sayLog = (message) => {
  console.log("\x1b[36m[CAROLZINHA BOT | TALK]\x1b[0m", message);
};

exports.inputLog = (message) => {
  console.log("\x1b[30m[CAROLZINHA BOT | INPUT]\x1b[0m", message);
};

exports.infoLog = (message) => {
  console.log("\x1b[34m[CAROLZINHA BOT | INFO]\x1b[0m", message);
};

exports.successLog = (message) => {
  console.log("\x1b[32m[CAROLZINHA BOT | SUCCESS]\x1b[0m", message);
};

exports.errorLog = (message) => {
  console.log("\x1b[31m[CAROLZINHA BOT| ERROR]\x1b[0m", message);
};

exports.warningLog = (message) => {
  console.log("\x1b[33m[CAROLZINHA BOT | WARNING]\x1b[0m", message);
};

exports.bannerLog = () => {
  console.log(`\x1b[35m   ______                 __      _       __             ____        __ \x1b[0m`);
  console.log(`\x1b[35m  / ____/___ __________  / /___  (_)___  / /_  ____ _   / __ )____  / /_\x1b[0m`);
  console.log(`\x1b[35m / /   / __ \`/ ___/ __ \\/ /_  / / / __ \\/ __ \\/ __ \`/  / __  / __ \\/ __/\x1b[0m`);
  console.log(`\x1b[35m/ /___/ /_/ / /  / /_/ / / / /_/ / / / / / / / /_/ /  / /_/ / /_/ / /_  \x1b[0m`);
  console.log(`\x1b[35m\\____/\\__,_/_/   \\____/_/ /___/_/_/ /_/_/ /_/\\__,_/  /_____/\\____/\\__/  \x1b[0m`);
  console.log(`\x1b[35m                                                                        \x1b[0m`);
  console.log(`\x1b[36m🤖 Versão: \x1b[0m${version}\n`);
};
