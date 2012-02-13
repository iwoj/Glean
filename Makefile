# Edit these variables for your environment
PRODUCTION_URL="http://woj.com/lamprey"
TESTING_URL="http://lamprey"
DEPLOYMENT_DIR="Website"

# Best to leave this alone.
all:
	cd Scripts; \
	node build.js $(TESTING_URL)
	cp "Source Code/lamprey.css" "Build Products"
	cp "Source Code/lamprey.html" "Build Products"
	cp "Source Code/.htaccess" "Build Products"
	
deploy: all
	mkdir -p $(DEPLOYMENT_DIR)
	cp "Build Products/.htaccess" $(DEPLOYMENT_DIR)
	cp "Build Products/"* $(DEPLOYMENT_DIR)
	cp Libraries/* $(DEPLOYMENT_DIR)

