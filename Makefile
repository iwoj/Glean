# Edit these variables for your environment
PRODUCTION_URL="http://woj.com/lamprey"
TESTING_URL="http://woj/lamprey"
DEPLOYMENT_DIR="Website"
BUILD_OUTPUT="Build Products"

# Best to leave this alone.
all:
	mkdir -p $(BUILD_OUTPUT)
	cd Scripts; \
	node build.js $(TESTING_URL)
	cp "Source Code/"*.css $(BUILD_OUTPUT)
	cp "Source Code/"*.html $(BUILD_OUTPUT)
	cp "Source Code/"*.jpg $(BUILD_OUTPUT)
	cp "Source Code/.htaccess" $(BUILD_OUTPUT)
	
deploy: all
	mkdir -p $(DEPLOYMENT_DIR)
	cp "Build Products/"* $(DEPLOYMENT_DIR)
	cp "Build Products/.htaccess" $(DEPLOYMENT_DIR)
	cp Libraries/* $(DEPLOYMENT_DIR)
	cd $(DEPLOYMENT_DIR); \
	ln -s -f bookmarklet.html index.html

clean:
	rm -rf $(BUILD_OUTPUT)/*
	rm -rf $(BUILD_OUTPUT)/.htaccess
