all:
	#NODE_PATH=Libraries:$(NODE_PATH):Libraries
	cd Scripts; \
	node package_bookmarklet.js
	cp "Source Code/lamprey.js" "Build Products/"

deploy:
	cp "Build Products/"* Website/
