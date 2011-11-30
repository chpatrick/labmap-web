/* Author: 

*/

$(document).ready(function() {
  $('#lab_map').svg({loadURL: "labmap.svg", onLoad: loaded});
  $('#user_table').tablesorter({ 
        sortList: [[0,0]] 
    }); 
});

xlink = "http://www.w3.org/1999/xlink";

function loaded(svg) {
  updateMap(svg);
  setInterval(function() { updateMap(svg); }, 10000);
}

function updateMap(svg) { 

  $.getJSON('../labmap.json', function(data) {
    $('#user_table > tbody').empty()

    $.each(data, function(host, info) {
      var image = $('#' + host, svg.root()).get(0);
  

      if (image) {
        if (info) {
	  $('#user_table > tbody').append('<tr><td>' + host + '</td><td>' + info.username + '</td><td>' + info.fullname + '</td></tr>')
	  
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
























