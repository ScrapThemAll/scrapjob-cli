const fs = require('fs');
const shelljs = require('shelljs');
const forever = `./node_modules/.bin/forever`;

const defaultScrapJson = JSON.stringify(
  {
    bots: [
      {
        type: '',
        port: ''
      }
    ]
  }, null, 2);

const messages = {
  create: ['Wrote to scrap.json', '', defaultScrapJson],
  notFindBot: ['Could not find bots field in scrap.json', '', 'your file:']
}

const init = () => {
  fs.writeFile('./scrap.json', defaultScrapJson, "utf-8", () => console.log(messages.create.join('\n')));
}

const run = (commander) => {
  let scrapJson;
  try {
    fs.statSync(`${process.cwd()}/scrap.json`).isFile();
    scrapJson = require(`${process.cwd()}/scrap.json`);
    if (!scrapJson.bots) return console.log([...messages.notFindBot, JSON.stringify(scrapJson, null, 2)].join('\n'));
  } catch(e) {
    commander.outputHelp();
    return ;
  }
  scrapJson.bots.forEach((bot) => {
    if (!bot.type) return console.log('bot must have a type');
    if (shelljs.exec(`${forever} start ./node_modules/.bin/${bot.type}`).code == 255) {
      console.log('install bot first using npm');
    } 
  });
}

exports.init = init;
exports.run = run;