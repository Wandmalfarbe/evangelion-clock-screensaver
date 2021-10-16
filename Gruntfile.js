module.exports = function(grunt) {

	grunt.initConfig({

		settings: {
			distDirectory: "Resources/Webview",
			tempDirectory: "temp",
			srcDirectory: "webview/"
		},

		clean: {
			temp: ["<%= settings.tempDirectory %>"],
			dist: ["<%= settings.distDirectory %>"]
		},

		eslint: {
			options: {
				overrideConfigFile: "eslintrc.json"
			},
			files: ["Gruntfile.js", "<%= settings.srcDirectory %>/script.js"]
		},

		csslint: {
			files: ["<%= settings.srcDirectory %>/style.css"],
			options: {
				"order-alphabetical": false,
				"fallback-colors": false,
				"box-sizing": false,
				"adjoining-classes": false,
				"qualified-headings": false,
				"unique-headings": false,
				"box-model": false,
				"bulletproof-font-face": false,
				"ids": false
			}
		},

		htmllint: {
			files: ["<%= settings.srcDirectory %>/html-template.html"],
			options: {
				"id-class-style": "dash",
				"attr-bans": ["align", "background", "bgcolor", "border", "frameborder", "longdesc", "marginwidth", "marginheight", "scrolling", "width"]
			}
		},

		htmlmin: {
			dev: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: "<%= settings.tempDirectory %>",
					src: ["*.html"],
					dest: "<%= settings.tempDirectory %>"
				}]
			}
		},

		cssmin: {
			dev: {
				files: [{
					expand: true,
					cwd: "<%= settings.srcDirectory %>",
					src: ["*.css", "!*.min.css"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			}
		},

		uglify: {
			options: {
				beautify: false,
				mangle: true, // sadly has no effect https://github.com/gruntjs/grunt-contrib-uglify/issues/65
				compress: true
			},
			dev: {
				files: [{
					expand: true,
					cwd: "<%= settings.srcDirectory %>",
					src: ["*.js", "!*.min.js"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			}
		},

		copy: {
			html_temp_to_dist: {
				files: [{
					expand: true,
					cwd: "<%= settings.tempDirectory %>",
					src: ["*.html"],
					dest: "<%= settings.distDirectory %>/"
				}]
			},
			html_src_to_temp: {
				files: [{
					src: ["<%= settings.srcDirectory %>html-template-3d.html"],
					dest: "<%= settings.tempDirectory %>/style-normal-3d.html"
				},
				{
					src: ["<%= settings.srcDirectory %>html-template-3d.html"],
					dest: "<%= settings.tempDirectory %>/style-red-3d.html"
				},
				{
					src: ["<%= settings.srcDirectory %>html-template.html"],
					dest: "<%= settings.tempDirectory %>/style-normal.html"
				},
				{
					src: ["<%= settings.srcDirectory %>html-template.html"],
					dest: "<%= settings.tempDirectory %>/style-red.html"
				}]
			},
			minified_js_files: {
				files: [{
					expand: true,
					cwd: "<%= settings.srcDirectory %>",
					src: ["*.min.js"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			},
			minified_css_files: {
				files: [{
					expand: true,
					cwd: "<%= settings.srcDirectory %>",
					src: ["*.min.css"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			},
			fonts: {
				files: [{
					expand: true,
					cwd: "<%= settings.srcDirectory %>",
					src: ["ds-digital/*"],
					dest: "<%= settings.distDirectory %>/"
				}]
			}
		},

		assets_inline: {
			dev: {
				files: [{
					expand: true,
					cwd: "<%= settings.tempDirectory %>",
					src: ["*.html"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			}
		},

		replace: {
			style_normal_3d: {
				options: {
					patterns: [{
						match: "<!-- svg -->",
						replacement: function() {
							return grunt.file.read("temp/style-normal.svg");
						}
					}],
					usePrefix: false
				},
				files: [{
					expand: true,
					flatten: true,
					src: ["<%= settings.tempDirectory %>/style-normal-3d.html"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			},
			style_red_3d: {
				options: {
					patterns: [{
						match: "<!-- svg -->",
						replacement: function() {
							return grunt.file.read("temp/style-red.svg");
						}
					}],
					usePrefix: false
				},
				files: [{
					expand: true,
					flatten: true,
					src: ["<%= settings.tempDirectory %>/style-red-3d.html"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			},
			style_normal: {
				options: {
					patterns: [{
						match: "<!-- svg -->",
						replacement: function() {
							return grunt.file.read("temp/style-normal.svg");
						}
					}],
					usePrefix: false
				},
				files: [{
					expand: true,
					flatten: true,
					src: ["<%= settings.tempDirectory %>/style-normal.html"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			},
			style_red: {
				options: {
					patterns: [{
						match: "<!-- svg -->",
						replacement: function() {
							return grunt.file.read("temp/style-red.svg");
						}
					}],
					usePrefix: false
				},
				files: [{
					expand: true,
					flatten: true,
					src: ["<%= settings.tempDirectory %>/style-red.html"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			}
		},

		svgmin: {
			static: {
				options: {
					plugins: [
						{
							removeViewBox: false
						},
						{
							cleanupIDs: {
								preservePrefixes: [
									"clock-digit",
									"clock-dots"
								]
							}
						}
					]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ["<%= settings.srcDirectory %>/svg/*svg"],
					dest: "<%= settings.tempDirectory %>/"
				}]
			}
		}
	});

	// Linters
	grunt.loadNpmTasks("grunt-contrib-csslint");
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-htmllint");

	// Minifiers
	grunt.loadNpmTasks("grunt-contrib-htmlmin");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-svgmin");

	// Other
	grunt.loadNpmTasks("grunt-assets-inline");
	grunt.loadNpmTasks("grunt-replace");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");

	// Task: Linting only
	grunt.registerTask("lint", [
		"eslint",
		"csslint"
		// "htmllint"
	]);

	// Task: Build everything (and do linting)
	grunt.registerTask("build", [
		"lint",
		"clean:dist",
		"cssmin",
		"copy:minified_css_files",
		"uglify",
		"copy:minified_js_files",
		"copy:html_src_to_temp",
		"assets_inline",
		"svgmin",
		"replace:style_normal_3d",
		"replace:style_red_3d",
		"replace:style_normal",
		"replace:style_red",
		"htmlmin",
		"copy:html_temp_to_dist",
		"copy:fonts",
		"clean:temp"
	]);

	grunt.registerTask("default", [
		"build"
	]);
};
