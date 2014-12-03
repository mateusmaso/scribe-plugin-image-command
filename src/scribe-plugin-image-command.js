define("scribe-plugin-image-command", ["jquery"], function($) {
  return function(options) {
    options = options || {};

    return function(scribe) {
      scribe.commands.image = new scribe.api.Command('insertHTML');
      scribe.commands.image.nodeName = 'IMG';
      scribe.commands.image.execute = function() {
        var input = $("<input accept='image/*' type='file'>");
        input.fileupload();
        input.on("fileuploadadd", function(event, data) {
          var loadingId = scribe.loading();

          $.ajax({
            url: options.credentialsUrl,
            data: {
              name: data.files[0].name,
              content_type: data.files[0].type
            },
            success: function(response) {
              input.fileupload({
                url: options.bucketUrl,
                type: 'POST',
                dataType: 'xml',
                dropZone: null,
                paramName: "file",
                formAcceptCharset: "utf-8",
                formData: response,
                success: function(response) {
                  scribe.replaceLoading(loadingId, "<img src='"+ unescape(response.childNodes[0].childNodes[0].childNodes[0].nodeValue) + "'></img>");
                }
              });
              input.fileupload('send', {files: [data.files[0]]});
            }
          });
        }).click();
      };
    };
  };
});
