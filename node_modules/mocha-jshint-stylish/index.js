var path = require('path');
var format = require('util').format;
var jsHintCliPath = path.resolve(path.dirname(require.resolve('jshint')), 'cli.js');
delete require.cache[jsHintCliPath];
var jsHint = require(jsHintCliPath);

function runJSHint(files, reporter, opt, cb) {
  var err = new Error('');
  err.message = '';
  err.stack = '';
  var options = {
    args: files,
    verbose: true,
    reporter: require(reporter)(err, opt)
  };
  jsHint.run(options);

  if (err.message !== '') {
    return cb(err);
  }
  return cb();
}

module.exports = function (opt) {
  opt = opt || {};
  opt.title = opt.title || 'jshint';          //default: jshint
  opt.timeout = opt.timeout || 90000;         //default: 90000
  opt.verbose =  opt.verbose || false         //default: false
  opt.reporter = opt.reporter || 'stylish';   //default: stylish
  opt.git = opt.git || null;
  opt.paths = opt.paths || ['.'];

  var reporter = "";

  //TODO: add more reporters
  switch (opt.reporter){
    case 'simple':
          reporter = './reporter-simple.js';
          break;
    case 'stylish':
          reporter = './reporter-stylish.js';
          break;
    default:
          reporter = opt.reporter;
  }


  if (!opt.git) {
    describe(opt.title || 'jshint', function () {
      this.timeout && this.timeout(opt.timeout);
      (opt.paths).forEach(function (p) {
        it(format('should pass for %s', p === '.' ? 'working directory' : JSON.stringify(p)), function (done) {
          runJSHint([p], reporter, opt, done);
        });
      });
    });
  } else if (opt && opt.git) {
    describe(opt.title || 'jshint', function () {
      this.timeout && this.timeout(opt.timeout);
      return it('should pass for working directory', function (done) {
        return require('./git')(opt.git, run);

        function run(err, paths) {
          if (err) {
            return done(err);
          }
          if (paths.length === 0) {
            return done();
          }
          runJSHint(paths, reporter, opt, done);
        }
      });
    });
  }
};
