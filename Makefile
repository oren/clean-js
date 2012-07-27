mini: 
	./node_modules/browserify/bin/cmd.js hello2.js | ./node_modules/uglify-js/bin/uglifyjs -o miniBundle.js
