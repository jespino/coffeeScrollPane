module.exports = (grunt) ->
    # Project configuration.
    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        uglify:
            options:
                banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %>*/\n" +
                        "/*! Version: <%= pkg.version %> */\n" +
                        "/*! License: BSD */\n"
                mangle: false
                report: "min"

            build:
                files:
                    'dist/jquery.coffeeScrollPane.min.js': 'dist/jquery.coffeeScrollPane.js'
                    'dist/jquery.coffeeMouseWheel.min.js': 'dist/jquery.coffeeMouseWheel.js'
        coffee:
            devel:
                files:
                    'dist/jquery.coffeeScrollPane.js': 'coffee/jquery.coffeeScrollPane.coffee',
                    'dist/jquery.coffeeMouseWheel.js': 'coffee/jquery.coffeeMouseWheel.coffee'

            demo:
                files:
                    'web/script/demo.js': 'coffee/demo.coffee'
                    'web/script/jquery.coffeeScrollPane.js': 'coffee/jquery.coffeeScrollPane.coffee',
                    'web/script/jquery.coffeeMouseWheel.js': 'coffee/jquery.coffeeMouseWheel.coffee'

            tests:
                files:
                    "tests/tests.js": "tests/tests.coffee"

        coffeelint:
            app:
                files:
                    src: ['coffee/jquery.coffeeScrollPane.coffee', 'coffee/jquery.coffeeMouseWheel.coffee']
                options:
                    max_line_length:
                        value: 120
                        level: "error"
                    indentation:
                        value: 4
                        level: "error"

        watch:
            coffeeScrollPane:
                tasks: ['coffee:devel']
                files: ['coffee/jquery.coffeeScrollPane.coffee', 'coffee/jquery.coffeeMouseWheel.coffee']

            demo:
                tasks: ['coffee:demo']
                files: ['demo/demo.coffee']

            tests:
                tasks: ["coffee:tests"]
                files: ["tests.coffee"]

        mocha:
            all:
                src: [ 'tests/index.html' ]
                options:
                    bail: true
                    log: true
                    mocha:
                        ignoreLeaks: false
                    reporter: 'Spec'
                    run: true
        less:
            devel:
                files:
                    "dist/jquery.coffeeScrollPane.css": "less/jquery.coffeeScrollPane.less"
            dist:
                options:
                    yuicompress: true
                files:
                    "dist/jquery.coffeeScrollPane.min.css": "less/jquery.coffeeScrollPane.less"
            demo:
                files:
                    "web/style/demo.css": "less/demo.less"
                    "web/style/jquery.coffeeScrollPane.css": "less/jquery.coffeeScrollPane.less"

        clean: [
            'dist/*.js'
            'dist'
            'doc'
            '*.js'
        ]


    # Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-coffee')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-yuidoc')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-mocha')
    grunt.loadNpmTasks('grunt-coffeelint')
    grunt.loadNpmTasks('grunt-contrib-less')

    # Default task(s).
    grunt.registerTask('default', ['coffee:devel', 'less:devel', 'watch'])
    grunt.registerTask('dist', ['coffee:devel', 'less:dist', 'uglify'])
    grunt.registerTask('test', ['coffee', 'mocha'])
    grunt.registerTask('lint', ['coffeelint'])
    grunt.registerTask('demo', ['less:demo', 'coffee:demo'])
