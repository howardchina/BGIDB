
$(function() {
    $('#file_upload').uploadify({
		auto:false,
        'swf'      : '/Public/uploadify/uploadify.swf',
        'uploader' : '/bgidb/Data/uploadify',
        'fileSizeLimit' : '10MB',
        'onUploadError' : function(file, errorCode, errorMsg, errorString) {
            alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
        },
		'onUploadSuccess': function (file, data, response) {
            console.log(data);
            data = $.parseJSON(data);
            if(999 == data['extra']['param'])
        	    alertify.success("文件上传成功");
            else
                alertify.error("文件上传失败");
        }
    });

    $('#oct_upload').uploadify({
        auto:false,
        'swf'      : '/Public/uploadify/uploadify.swf',
        'uploader' : '/bgidb/Data/octuploadify',
        'fileSizeLimit' : '10MB',
        'onUploadError' : function(file, errorCode, errorMsg, errorString) {
            alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
        },
        'onUploadSuccess': function (file, data, response) {
            console.log(data);
            data = $.parseJSON(data);
            if(999 == data['extra']['param'])
                alertify.success("文件上传成功");
            else
                alertify.error("文件上传失败");
        }
    });

   
});