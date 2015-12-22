angular.module("uploadFile", []).directive('uploadAssets', function($log, CreativeAssetPreview) {
  return {
    restrict: 'EA',
    scope: {
      scopeAssets: '=',
      errorMessage: '=messageError'
    },
    templateUrl: 'scripts/common/directives/upload-assets/uploadAssets.html',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        document.getElementById("dragDropClick").click();
      });

      window.addEventListener("dragover", function(e) {
        e = e || event;
        e.preventDefault();
      }, false);

      window.addEventListener("drop", function(e) {
        e = e || event;
        e.preventDefault();
      }, false);

      scope.onFileSelect = function($files) {
        scope.errorMessage = "";
        var imageType = /image.*|application\/x-shockwave-flash|html/;
        var assets = [];
        angular.forEach($files, function(file) {
          if ((file.type.match(imageType)) && file.size < 1000000) {
            var reader = new FileReader();
            reader.onload = function(e) {
              var img = {};
              img.src = reader.result;
              var asset = {
                file_name: file.name,
                data: e.target.result
              };
              if(file.type.match(/x-shockwave-flash/)) {
                var newAssetPreview = new CreativeAssetPreview(asset);
                newAssetPreview.$save({}, function(response){
                  asset.preview_url = response.image_link;
                }, function(error){
                  console.log(error);
                });
              }
              scope.scopeAssets.push(asset);
              scope.errorMessage = "Success!";
              scope.$apply();
            };
            reader.readAsDataURL(file);
          } else {
            if (!(file.size < 1000000)) {
              scope.errorMessage = "Error File size too big";
            } else {
              scope.errorMessage = "Error File Type not supported";
            }
          }
        })
      };
    }
  };
});