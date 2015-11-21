# Makinit Readme

## Technology
### Languages & Preprocessors
* Coffeescript
* SASS Stylesheets
* Jade Templates

### Components
* Yeoman Application Scaffolding
* Grunt Task Runner
* Bower Dependency Management
* Git Versioning
* NPM for Dev Dependencies 
* Parse Backend


### JavaScript Components
* RequireJS
* Backbone
* Backbone-support
* Parse CloudCode
* Google Maps API
* SoundCloud API
* Select2 plugin

## Getting Started
##### Grunt.js is the primary component of the development environment. `grunt server` will spin up a local livereload server, compile all necessary templates, scripts, and stylesheets, and serve the app to port 9000.  `grunt build` will compile everything and create a dist folder for deploying to github's gh-pages via a sub-tree push.

## Notes and Explanations
### Parse
##### The Parse backend is initialized in the appRouter. The server contains two classes: the User class and the Profile class.  The User class is the only class created by the frontend, and contains all necessary data.  The Profile class is created via Parse's CloudCode, a Node.js variant, in order to provide the search functionality with appropriate data.  CloudCode resides in `/cloudCode/cloud/main.js`. Changes and updates to cloudCode can be deployed to the server by running `parse deploy` from the cloudCode directory.

### Git
##### Git and github are used for version control. The project resides in a private vanilla github repository.  GH-pages is used as a development server, and can be updated from the main branch of the repo with `git subtree push --prefix dist origin gh-pages`.

### Backbone and Backbone-support
##### Backbone provides the MV* architecture, and Backbone-Support is used for view management via the `SwappingRouter` and `CompositeView`.

### Google Maps API
##### The Google Maps API is utilized in two ways: first, the Maps lib is used for creating the map on the edit-profile page.  Second, the Places library is used for auto-complete on the search field and location input field.





