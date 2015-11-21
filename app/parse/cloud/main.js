var Image = require("parse-image");

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.define("saveImage", function(request, response) {
  console.log('saveImage called')
  console.log('saveImage imageName: ', request['imageName'])
  console.log('saveImage imageWidth: ', request.body["imageWidth"]);
  console.log('saveImage imageHeight: ', request.body["imageHeight"]);

  var user = request.object;
  var image = new Image();
  image.setData(request["imageData"]);
  var imageName = request.body["imageName"];
  var imageWidth = request.body["imageWidth"];
  var imageHeight = request.body["imageHeight"];
  var imageLeft = request.body["imageLeft"];
  var imageTop = request.body["imageTop"];

  if(imageLeft!==undefined && imageTop !== undefined){
    image.crop({
      left: imageLeft,
      top: imageTop,
      width: imageWidth,
      height: imageHeight
    });
  }

  if(imageWidth !== undefined)
    image.scale({ width: imageWidth });

  image.setFormat("JPEG");
  var saveFile = new Parse.File(imageName, { base64: image.data().toString("base64")} );
  saveFile.save();

  response.success(saveFile.url());

});
