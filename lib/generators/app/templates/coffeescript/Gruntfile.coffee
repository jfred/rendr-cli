path = require("path")
stylesheetsDir = "assets/stylesheets"
rendrDir = "node_modules/rendr"
rendrHandlebarsDir = "node_modules/rendr-handlebars"
rendrModulesDir = rendrDir + "/node_modules"
module.exports = (grunt) ->
  
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    stylus:
      compile:
        options:
          paths: [stylesheetsDir]
          "include css": true

        files:
          "public/styles.css": stylesheetsDir + "/index.styl"

    handlebars:
      compile:
        options:
          namespace: false
          commonjs: true
          processName: (filename) ->
            filename.replace("app/templates/", "").replace ".hbs", ""

        src: "app/templates/**/*.hbs"
        dest: "app/templates/compiledTemplates.js"
        filter: (filepath) ->
          filename = path.basename(filepath)
          
          # Exclude files that begin with '__' from being sent to the client,
          # i.e. __layout.hbs.
          filename.slice(0, 2) isnt "__"

    watch:
      scripts:
        files: "app/**/*..<% filename.suffix %>"
        tasks: ["rendr_stitch"]
        options:
          interrupt: true

      templates:
        files: "app/**/*.hbs"
        tasks: ["handlebars"]
        options:
          interrupt: true

      stylesheets:
        files: [stylesheetsDir + "/**/*.styl", stylesheetsDir + "/**/*.css"]
        tasks: ["stylus"]
        options:
          interrupt: true

    rendr_stitch:
      compile:
        options:
          dependencies: ["assets/vendor/**/*.js"]
          npmDependencies:
            underscore: "../rendr/node_modules/underscore/underscore.js"
            backbone: "../rendr/node_modules/backbone/backbone.js"
            handlebars: "../rendr-handlebars/node_modules/handlebars/dist/handlebars.runtime.js"
            async: "../rendr/node_modules/async/lib/async.js"

          aliases: [
            from: rendrDir + "/client"
            to: "rendr/client"
          ,
            from: rendrDir + "/shared"
            to: "rendr/shared"
          ,
            from: rendrHandlebarsDir
            to: "rendr-handlebars"
          ,
            from: rendrHandlebarsDir + "/shared"
            to: "rendr-handlebars/shared"
          ]

        files: [
          dest: "public/mergedAssets.js"
          src: ["app/**/*.js", rendrDir + "/client/**/*.js", rendrDir + "/shared/**/*.js", rendrHandlebarsDir + "/index.js", rendrHandlebarsDir + "/shared/*.js"]
        ]

  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-handlebars"
  grunt.loadNpmTasks "grunt-rendr-stitch"
  grunt.registerTask "runNode", ->
    grunt.util.spawn
      cmd: "node"
      args: ["./node_modules/nodemon/nodemon.js", "--debug", "index.<%= filename.suffix %>"]
      opts:
        stdio: "inherit"
    , ->
      grunt.fail.fatal new Error("nodemon quit")


  grunt.registerTask "compile", ["handlebars", "rendr_stitch", "stylus"]
  
  # Run the server and watch for file changes
  grunt.registerTask "server", ["runNode", "compile", "watch"]
  
  # Default task(s).
  grunt.registerTask "default", ["compile"]
