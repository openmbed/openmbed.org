/**
Copyright (C) 2013 Moko365 Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        FOREVER_DIR: '${HOME}/.forever',
        PIDFILE: '<%=FOREVER_DIR%>/<%= pkg.name %>.pid',
        LOGFILE: '<%=FOREVER_DIR%>/<%= pkg.name %>.log',
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            css: {
                files: ['sass/*.sass', 'sass/modules/course/*.sass', 'public/views/*/*.css'],
                tasks: ['sass']
            },
            js: {
                files: 'public/js/*.js',
                tasks: ['test']
            },
            api: {
                files: ['views/api/*.js'],
                tasks: []
            },
            less: {
                files: ['public/css/style.less', 'public/creative/less/creative.less', 'public/sb-admin/less/sb-admin-2.less', 'public/liveapp/*/*.less'],
                tasks: ['less:development']
            },
            jade: {
                files: ['views/*/*.jade'],
                tasks: []
            },
            views: {
                files: ['public/views/build/*.js'],
                tasks: ['uglify:browserify']
            }
        },
        uglify: {
            application: {
                files: {
                    'public/js/wotcity.min.js': [
                        'public/vendor/jquery/jquery.js',
                        'public/vendor/bootstrap/dist/js/bootstrap.min.js',
                        'public/js/notify.js',
                        'public/js/notify-bootstrap.js',

                        'public/vendor/underscore/underscore-min.js',
                        'public/vendor/backbone/backbone-min.js',
                        'public/vendor/momentjs/min/moment.min.js',
                        'public/vendor/fancybox/source/jquery.fancybox.pack.js',
                        'public/vendor/jquery-waypoints/waypoints.min.js',

                        // creative
                        'public/vendor/jquery.easing/js/jquery.easing.min.js',
                        'public/creative/js/jquery.fittext.js',
                        'public/vendor/wow/dist/wow.min.js',
                        'public/creative/js/creative.js',

                        'public/layouts/core.js'
                    ]
                }
            },
        },
        jshint: {
            gruntfile: ['Gruntfile.js'],
            client: {
                options: {
                    jshintrc: '.jshintrc-client',
                    ignores: [
                            'public/layouts/**/*.min.js',
                            'public/views/**/*.min.js'
                        ]
                },
                src: [
                    'public/layouts/**/*.js',
                    'public/views/**/*.js'
                ]
            },
            server: {
                options: {
                    jshintrc: '.jshintrc-server'
                },
                src: [
                    'schema/**/*.js',
                    'views/**/*.js'
                ]
            }
        },
        macreload: {
            /* Use Chrome to development Mokoversity
            safari: {
                browser: 'safari'
            },
            firefox: {
                browser: 'firefox'
            },
*/
            chrome: {
                browser: 'chrome',
                editor: 'sublime'
            }
        },
        less: {
            options: {
                compress: true
            },
            development: {
                options: {
                    cleancss: true
                },
                files: {
                    'public/css/flat-ui.css': 'less/Flat-UI-Pro-1.2.3/less/flat-ui.less',
                    'public/css/wotcity.css': 'public/creative/less/creative.less',
                    'public/css/style.css': 'public/css/style.less',
                }
            }
        },
        exec: {
            logs: {
                cmd: '[ ! -f <%=LOGFILE%> ] && touch <%=LOGFILE%>; tail -f <%=LOGFILE%>'
            },
            clear: {
                cmd: 'rm -f <%=FOREVER_DIR%>/*.log'
            },
            start_server: {
                cmd: 'if [ ! -f <%=PIDFILE%> ]; then touch <%=PIDFILE%> && PORT=6060 NODE_ENV=production forever start -p <%=FOREVER_DIR%> -l <%= pkg.name %>.log -a wotcity.js; else echo "Can\'t start <%= pkg.name %>: <%= pkg.name %> is already running."; fi'
            },
            start_dev_server: {
                cmd: 'if [ ! -f <%=PIDFILE%> ]; then touch <%=PIDFILE%> && forever start -w --watchDirectory . -p <%=FOREVER_DIR%> -l <%= pkg.name %>.log -c "node --max-old-space-size=8192 --nouse-idle-notification" -a wotcity.js; else echo "Can\'t start <%= pkg.name %>: <%= pkg.name %> is already running."; fi'
            },
            stop_server: {
                cmd: 'if [ -f <%=PIDFILE%> ]; then rm -f <%=PIDFILE%> && forever stop wotcity.js; else echo "Can\'t stop <%= pkg.name %>: <%= pkg.name %> is not running."; fi'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');

    // see: https://github.com/gruntjs/grunt-contrib-less
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task(s)
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('build', ['uglify', 'less:development'/*, 'sass:dist'*/]);
    grunt.registerTask('log', ['exec:logs']);
    grunt.registerTask('logs', ['exec:logs']);
    grunt.registerTask('start', ['exec:start_server']);
    grunt.registerTask('start-dev', ['exec:start_dev_server']);
    grunt.registerTask('start-browser', ['macreload']);
    grunt.registerTask('stop', ['exec:stop_server']);
    grunt.registerTask('restart', ['stop', 'start']);

    // grunt.registerTask('default', ['build']);
};
