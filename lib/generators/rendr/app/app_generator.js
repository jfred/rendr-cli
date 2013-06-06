var AppGenerator,
  BaseGenerator = require('../../base_generator'),
  walk = require('walk'),
  fs = require('fs'),
  colors = require('colors');

AppGenerator = module.exports = BaseGenerator.extend({
  
  validOpts: [
    { 'new': { alias: 'appName', required: true }}
  ],

  initialize: function() {
    BaseGenerator.prototype.initialize.call(this);
    this.targetParent= this.targetParent + '/' + this.opts.appName;
  },

  preGenerate: function(next) {
    if (this.dirExists(this.targetParent)) {
      console.log('Application ' + this.opts.appName + ' appears to already exist');
      return false;
    }
    this.createDirectory(this.targetParent, true);
    next();
  },

  renderTemplates: function(next) {
    var generator = this,
        walker = walk.walkSync(this.templates, {}),
        targetDir,
        target,
        IGNORES = ['.gitkeep'],
        DOTTED = ['gitignore', 'nodemonignore'];

    walker.on('file', function (root, fileStats, next) {
      targetDir = generator.targetParent + root.replace(generator.templates, '');
      target = !!~DOTTED.indexOf(fileStats.name) ? '.' + fileStats.name : fileStats.name;
      if (!generator.dirExists(targetDir)) {
        generator.createDirectory(targetDir, true);
      }
      if (!~IGNORES.indexOf(target)) {
        console.log('Generating File '.red +  (targetDir + '/' + target).green);
        fs
          .createReadStream( root + '/' + fileStats.name )
          .pipe(fs.createWriteStream( targetDir + '/' + target ) );
      }
    });
    walker.on('end', next);
  },

  renderCompanions: function() {
    var generator,
        optsArr = [
          {
            generate: 'controller',
            args: ['home','index'],
            appName: this.opts.appName
          },
          {
            generate: 'view',
            args: ['home', 'index'],
            appName: this.opts.appName
          },
          {
            generate: 'template',
            args: ['home', 'index'],
            appName: this.opts.appName
          }
        ];


    // render controller
    // render view
    // render templates

    optsArr.forEach(function(opts){
      generator = BaseGenerator.getGenerator(opts, false);
      generator.generate();
    });
  }

});