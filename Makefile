PRODUCTION_URL="http://woj.com/lamprey"
TESTING_URL="http://lamprey"

all:
	cd Scripts; \
	node build.js $(TESTING_URL)
	cp "Source Code/lamprey.css" "Build Products"

deploy: all
	cp "Build Products/"* Website/

