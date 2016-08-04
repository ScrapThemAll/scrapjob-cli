const fs = require('fs');
const shelljs = require('shelljs');
const forever = `./node_modules/.bin/forever`;

const bots = [
  'canalplus'
]

const defaultScrapJson = JSON.stringify(
  {
    bots: [
      {
        name: '',
        port: '',
        timer: '',
        nbPage: ''
      }
    ]
  }, null, 2);

const messages = {
  create: [
    'Wrote to scrap.json', 
    '', 
    defaultScrapJson
  ],
  notFindBotInJson: [
    'Could not find bots field in scrap.json', 
    '', 
    'your file:'
  ],
  botNotExist: [
    'Could not find this bot',
    'available bots:',
    '',
    bots.join('\n')
  ]
}

const init = () => {
  fs.writeFile('./scrap.json', defaultScrapJson, "utf-8", () => console.log(messages.create.join('\n')));
}

const run = (commander) => {
  let scrapJson;
  try {
    fs.statSync(`${process.cwd()}/scrap.json`).isFile();
    scrapJson = require(`${process.cwd()}/scrap.json`);
    if (!scrapJson.bots) return console.log([...messages.notFindBotInJson, JSON.stringify(scrapJson, null, 2)].join('\n'));
  } catch(e) {
    commander.outputHelp();
    return;
  }
  scrapJson.bots.forEach((bot) => {
    if (!bot.name) return console.log('bot must have a name');
    if (bots.indexOf(bot.name) === -1) return console.log(messages.botNotExist.join('\n'));
    try {
      fs.statSync(`./node_modules/.bin/${bot.name}`).isFile();
    } catch (e) {
      shelljs.exec(`npm install -S bot-${bot.name}`);
    }
    const port = bot.port && `PORT=${bot.port}` || '';
    const timer = bot.timer && `TIMER=${bot.timer}` || '';
    const nbPage = bot.nbPage && `NBPAGE=${bot.nbPage}` || '';
    shelljs.exec(`${port} ${timer} ${nbPage} ${forever} start ./node_modules/.bin/${bot.name}`);
  });
}

exports.init = init;
exports.run = run;