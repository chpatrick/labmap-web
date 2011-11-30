/* Author: 

*/

$(document).ready(function() {
  $('#lab_map').svg({loadURL: "labmap.svg", onLoad: loaded});
  $('#userTable').tablesorter();
});

xlink = "http://www.w3.org/1999/xlink";

function loaded(svg) {
  updateMap(svg);
  setInterval(function() { updateMap(svg); }, 10000);
}

function updateMap(svg) { 

  $.getJSON('../labmap.json', function(data) {
    $('#userTable > tbody').empty()

    $.each(data, function(host, info) {
      var image = $('#' + host, svg.root()).get(0);
  

      if (image) {
        if (info) {
	  $('#userTable > tbody').append('<tr><td>' + host + '</td><td>' + info.username + '</td><td>' + info.fullname + '</td></tr>')
	  
	  image.setAttributeNS(xlink, 'href', info.image); 

          var titleString = host + ': ' + info.fullname + ' (' + info.username + ')';
          var title = image.firstChild;
          if (title) { title.innerHTML = titleString; }
	  else { svg.title(image, titleString); }
	}
	else {
	  image.setAttribute('visibility', 'hidden')
	}
      }
    });
  });
}
























