// Image show in user page
$(document).on('change', ".fileInputBoth", function(e) {
    var files = e.target.files;
    for (var i = 0; i < files.length; i++) {
        var reader2 = new FileReader();
        reader2.onload = function(e) {
            $('.img-prevarea img').attr('src', e.target.result);
        };
        reader2.readAsDataURL(files[i]);
    }
});