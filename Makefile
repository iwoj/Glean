# Edit these variables for your environment
PRODUCTION_URL="http://miscellaneousprojects.com/lamprey"
TESTING_URL="http://miscellaneousprojects.com/lamprey"
BUILD_OUTPUT="Build Products"

# Best to leave this alone.
all:
	mkdir -p $(BUILD_OUTPUT)
	cp "Source Code/"*.css $(BUILD_OUTPUT)
	cp "Source Code/"*.html $(BUILD_OUTPUT)
	cp "Source Code/"*.jpg $(BUILD_OUTPUT)
	cp "Source Code/"*.png $(BUILD_OUTPUT)
	cp "Source Code/.htaccess" $(BUILD_OUTPUT)
	cd Scripts; \
	node build.js $(TESTING_URL)
	
deploy: all
	mkdir -p $(PREFIX)
	cp "Build Products/"* $(PREFIX)
	cp "Build Products/.htaccess" $(PREFIX)
	cp Libraries/* $(PREFIX)

clean:
	rm -rf $(BUILD_OUTPUT)/*
	rm -rf $(BUILD_OUTPUT)/.htaccess

clean-deployment:
	rm -rf $(PREFIX)/*
	rm -rf $(PREFIX)/.htaccess

