var ControllerGenerator,
    BaseGenerator = require('../../base_generator'),
    // ViewGenerator = require('../view/view_generator'),
    // TemplateGenerator = require('../template/template_generator'),
    fs = require('fs'),
    walk = require('walk'),
    Handlebars = require('../../handlebars');

ControllerGenerator = module.exports = BaseGenerator.extend({
  
  validOpts: [
    {'args[0]': { alias: 'controllerName', required: true }},
    {'appName': { required: false}}
  ],

  initialize: function() {
    BaseGenerator.prototype.initialize.call(this);
    var sfx = this.getFileSuffix();
    if (this.opts.appName) this.targetParent += '/' + this.opts.appName;
    this.targetParent += '/app/controllers/' + this.opts.controllerName + '_controller.' + sfx;
    this.actions = this.getResourceActions();
  },

  preGenerate: function(next) {
    if (this.isFile(this.targetParent)) {
      console.log('Controller ' + this.opts.controllerName + ' appears to already exist');
      return false;
    }
    next();
  },

  renderTemplates: function(next) {
    var generator = this,
        walker = walk.walkSync(this.templates, {}),
        tpl,
        data;

    walker.on('file', function (root, fileStats, next) {
      console.log(fileStats.name);
      tpl = Handlebars.compile(fs.readFileSync(root + '/' + fileStats.name, 'utf8'));
      data = tpl( generator.getTemplateData(generator) );
      fs.writeFileSync(generator.targetParent, data);
    });
    walker.on('end', next);
  },

  getTemplateData: function(generator) {
    var tplData = {};

    tplData.actions = [];
    tplData.name = generator.opts.controllerName;

    generator.actions.forEach(function(action){
      tplData.actions.push({action: action});
    });

    return tplData;
  },

  renderCompanions: function(next) {
    // render views
    // render templates
    next();
  }

});