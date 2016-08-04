const commander = require('commander');
const scrap = require('./actions');

commander
  .option('-i --init')
  .parse(process.argv)

if (commander.init) {
  scrap.init();
} else {
  scrap.run(commander); 
}
