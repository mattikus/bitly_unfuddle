var user = "mattikus";
var key = "R_24ebc71570d409e0360c4d1ba3566828";

function updateLinks(doc) {
  var hashes = [];
  var links = $(doc).find('a[href^="http://bit.ly/"]'); // Find all bit.ly urls
  var bitly_url = "http://api.bit.ly/expand?version=2.0.1&login="+user+"&apiKey="+key+"&format=json";

  links.each(function() {
    if (this.title.length == 0) {
      var u = this.href
      if (u.search('info') < 0 && u.search('app') < 0 && u.search('pages') < 0 && u.search('account') < 0) {
        hashes.push(u);
      }
    }
  });

  $.each(hashes, function(id, hash) { 
    $.getJSON(bitly_url + '&shortUrl=' + hash, function(json) {
      if (json.errorCode != 0) {
        console.log(json.errorCode + ': ' + json.errorMessage);
      } else {
        $.each(json.results, function(id, result) {
          // add target URL as link tooltip
          $(doc).find('a[href="http://bit.ly/'+id+'"]').each(function() {
            this.title = result.longUrl;
          });
        });
      }
    }); 
  }); 
}

jetpack.tabs.onReady(function(doc) {
  updateLinks(doc);
  $(doc).find('body').ajaxStop(function() {
    alert('test');
  });
});
