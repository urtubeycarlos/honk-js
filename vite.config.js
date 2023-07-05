module.exports = {
	root: './src',
	build: {
		target: 'es2015', // Compile to ES2015 for broader browser compatibility
		outDir: '../dist', // Output directory for the build
		emptyOutDir: true, // Empty the output directory before the build
		lib: {
			entry: './honk.js', // Entry path for the honk.js file
			formats: ['umd'], // UMD format for browser and Node.js compatibility
			name: 'Honk', // Global name of the library
			fileName: 'honk', // Output file name without extension
		},
		rollupOptions: {
			// Rollup configuration options
			external: ['qunit'], // Exclude QUnit from the build to allow for runtime loading
			output: {
				globals: {
					qunit: 'QUnit', // Define the global variable for QUnit
				},
			},
		},
	},
	server: {
		watch: {
			ignored: ['tests/**/*.js'], // Ignore unit tests to prevent automatic reloading
		},
	},
};
