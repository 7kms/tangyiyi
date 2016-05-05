// Generated on 2016-02-26 using generator-angular-fullstack 3.3.0
'use strict';

module.exports = function (grunt) {
  var app = {
    client:'./client',
    server:'./server'
  };
  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
      app:app,
      watch:{
        js:{
          files:['<% app.client %>/scss/*{,/*}.js'],
          tasks:['jshint','ugulify']
        },
        css:{
          files:['<% app.client %>/scss/*{,/*}.scss'],
          tasks:['sass']
        },
        jade:{
          files:['<% app.client %>/*{,/*}.jade'],
          tasks:['jade']
        }
      },
      jade:{
        debug: {
          options: {
            data: {
              debug: true
            },
            pretty: true
          },
          files:[{
            expand: true,
            cwd:'<%= app.client %>/',
            src:['*{,/}*.jade'],
            dest:'html',
            ext:'.html'
          }]
        }
      }
  });
};
