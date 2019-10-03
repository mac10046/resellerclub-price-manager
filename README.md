Local Development:
1. If you've previously installed gulp globally, run npm rm --global gulp
2. Check for node, npm, and npx "node --version" => 8.11.1, "npm --version" => 5.6.0, "npx --version" => 9.7.1
3. Install the gulp command line utility "npm install --global gulp-cli"
4. Verify your gulp versions "gulp --version" => CLI version 2.0.1 & Local version => 4.0.0
5. run "gulp"

Production Deployment Steps:
1. If you've previously installed gulp globally, run npm rm --global gulp
2. Check for node, npm, and npx "node --version" => 8.11.1, "npm --version" => 5.6.0, "npx --version" => 9.7.1
3. Install the gulp command line utility "npm install --global gulp-cli"
4. Verify your gulp versions "gulp --version" => CLI version 2.0.1 & Local version => 4.0.0
5. run "gulp build"


Folder Structure
---------------------------
1. You can access all the HTML files from the "views" folder.
2. The business logic is available in "controllers" folder with a ".js" extension.
3.  The "Controller" name of each "View" is defined in the top of the corresponding page.
4. The "assets" folder contains all the images, CSS files and external JS files.
5. The "services" folder contains all the "HTTP call requests" to access APIs.
6. The "directives" folder contains all the custom directives.
