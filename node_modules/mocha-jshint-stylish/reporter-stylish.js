var chalk = require('chalk');
var table = require('text-table');

module.exports = function (err,options) {
  return function (results) {
    var total = results.length;
    var ret = '';
    var headers = [];
    var errnum=[];
    var prevfile;
    var numFiles=0;
    var numErr=0;

    options = options || {};

    ret += table(results.map(function (result, i) {

        var err = result.error;
        var line = [
          '',
          chalk.gray('line ' + err.line),
          chalk.gray('col ' + err.character),
          chalk.blue(err.reason)
        ];

        if (result.file !== prevfile) {
          headers[i] = result.file;
          if (i !== 0) {
            errnum[i-1] = numErr;
          }
          numFiles++;
          numErr=0;
        } else if(i === results.length-1) {
            errnum[i] = numErr + 1;
        }

        numErr++;

        if (options.verbose) {
          line.push(chalk.gray('(' + err.code + ')'));
        }

        prevfile = result.file;

        return line;
      }), {
        stringLength: function (str) {
          return chalk.stripColor(str).length;
        }
      }).split('\n').map(function (el, i) {


        var output = "";

        if (headers[i]) {
          output = '\n' + chalk.white.underline(headers[i]) + '\n';
        }

        output += el;

        if (errnum[i] !== undefined) {

          output += '\n\n';
          if (errnum[i] > 0) {
            output += chalk.red.bold((process.platform !== 'win32' ? '✖ ' : '') + errnum[i] + ' problem' + (errnum[i] === 1 ? '' : 's'));
          } else {
            output += chalk.green.bold((process.platform !== 'win32' ? '✔ ' : '') + 'No problems');
            output = '\n' + output.trim();
          }
        }

        return output;

      }).join('\n') + '\n\n';



      if (total > 0) {
        ret += chalk.white.underline("Total Status") + '\n';
            + chalk.red((process.platform !== 'win32' ? '✖ ' : '') + total + ' problem' + (total === 1 ? '' : 's'))
            + chalk.blue(" in " + numFiles + " file" + (numFiles === 1 ? '' : 's'));
      }

      err.message += ((err.message && ret.length) ? ('\n' + ret) : '');
  };
};
