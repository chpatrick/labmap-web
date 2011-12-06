/* Use labmap namespace */
labmap = {}
labmap.svgmap = null;
labmap.machines = [];
labmap.working = true;

function User(username, full_name, imageURL){
    var name = full_name.split(" ");
    
    return {
        username : username,
        first_name : name[0],
        last_name : name[1],
        imageURL : imageURL
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
            if (m.user) {
                if (m.user.imageURL) {
                  m.mapImage.setAttributeNS(xlink, 'href', m.user.imageURL);
                }
                else
                {
                  m.mapImage.setAttributeNS(xlink, 'href', '/images/nopic.jpg');
                }

                var title = m.mapElement.attr('title');

                if (!title) {
                    m.mapElement.attr('title', m.machinename + ': ' + m.user.first_name + ' ' + m.user.last_name + ' (' + m.user.username + ')');
                }
            }
	    else {
                m.mapImage.setAttributeNS(xlink, 'href', 'images/available.svg');
            }
        }
    });
}

function mapLoaded() {}

function mapUpdated() {}

function reloadLabMapData() {
    if(!labmap.working) return;
    
    var machines = []
    var u = null;
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
                if (user) {
                  u = User(user.username, user.fullname, user.image);
                }
                else {
                  u = null;
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
