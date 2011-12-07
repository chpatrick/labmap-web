/* Use labmap namespace */
labmap = {}
labmap.svgmap = null;
labmap.machines = [];
labmap.working = true;

function User(username, full_name, imageURL, lockiness){
    return {
        username : username,
        fullname : full_name,
        imageURL : imageURL,
	lockiness : lockiness
    }
}

function Machine(machine_name, user){
    return {
        machinename : machine_name,
        user : user,
        tableRow : null,
        mapImage : null,
        mapElement : null
    }
}

$(document).ready(function() {
    $('#lab_map').svg({
        loadURL: "labmap.svg",
        changeSize: true,
        onLoad: function(svg){
            console.log(svg);
            labmap.svgmap = svg;
            mapLoaded();
            reloadLabMapData();
            setInterval(function() { reloadLabMapData(); }, 10000);
        }
    });
});

function updateMap(){
    var image = null;
    var xlink = "http://www.w3.org/1999/xlink";

    $.each(labmap.machines, function(index, m){
        m.mapElement = $('#' + m.machinename);
        m.mapImage = $(m.mapElement, labmap.svgmap.root()).get(0);

        if (m.mapImage) {
	    if (m.user == 'AVAILABLE') {
                m.mapImage.setAttributeNS(xlink, 'href', 'images/available.svg');
	    }
	    else if (m.user == 'UNKNOWN') {
                m.mapImage.setAttributeNS(xlink, 'href', 'images/unknown.svg');
	    }
            else {
                if (m.user.imageURL) {
                  m.mapImage.setAttributeNS(xlink, 'href', m.user.imageURL);
                }
                else
                {
                  m.mapImage.setAttributeNS(xlink, 'href', '/images/nopic.jpg');
                }

                if (m.user.lockiness) {
		  m.mapElement.attr('opacity', 1.56 - m.user.lockiness * 1.4);
		}

                var newTitle = $('<title>' + m.machinename + ': ' + m.user.fullname + ' (' + m.user.username + ')</title>');
                var oldTitle = m.mapElement.children('title');

                if (oldTitle.length == 0) {
		    newTitle.appendTo(m.mapElement);
                }
		else {
		    oldTitle.replaceWith(newTitle);
		}
            }
        }
    });
}

function mapLoaded() {}

function mapUpdated() {}

function reloadLabMapData() {
    if(!labmap.working) return;
    
    var machines = []
    var m = null;
    $.getJSON('labmap.json', function(data) {
        if(data.closed){
            labmap.working = false;
            jQuery.facebox('Lab\'s closed, get some sleep. :)');
        }else if(data.stopped){
            labmap.working = false;
            jQuery.facebox('Nothing to see here, move along.');
        }else{
            $.each(data, function(host, user) {
                var u = null
                if (user == 'AVAILABLE' || user == 'UNKNOWN') {
		  u = user;
		}
		else {
                  u = User(user.username, user.fullname, user.image, user.lockiness);
                }
                m = Machine(host, u);
                machines.push(m);
            });

            labmap.machines = machines; //Replace listing
            updateMap();
            mapUpdated();
        }
    });
}
