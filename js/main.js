/* Use labmap namespace */
labmap = {}
labmap.svgmap = null;
labmap.machines = [];

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
        onLoad: function(svg){
            console.log(svg);
            labmap.svgmap = svg;
            reloadLabMapData();
            setInterval(function() { reloadLabMapData(); }, 10000);
        }
    });
});

function reloadLabMapData(svg) {
    var machines = []
    var u = null;
    var m = null;
    $.getJSON('../labmap.json', function(data) {
        $.each(data, function(host, user) {
            u = User(user.username, user.fullname, user.image);
            m = Machine(host, u);
            machines.push(m);
        });

        console.log(machines);
        labmap.machines = machines; //Replace listing
        updateTable();
        updateMap();
    });
}

function updateTable(){
    var newTBody = $(document.createElement('tbody'));

    $.each(labmap.machines, function(index, m){
        m.tableRow = $(document.createElement('tr'));
        m.tableRow.append('<td>' + m.machinename + '</td><td>' + m.user.username + '</td><td>' + m.user.first_name + ' ' + m.user.last_name + '</td>');

        newTBody.append(m.tableRow);
    });

    $('#user_table > tbody').replaceWith(newTBody);

    // Rebind table sorter and pager objects
    //TODO: might not be needed?
    $('#user_table')
    .tablesorter({ debug: true, widthFixed: true, sortList: [[0,0]] })
    .tablesorterPager({offset: 20, size:18, container: $("#pager")});
}

function updateMap(){
    var image = null;
    var xlink = "http://www.w3.org/1999/xlink";

    $.each(labmap.machines, function(index, m){
        m.mapElement = $('#' + m.machinename);
        m.mapImage = $(m.mapElement, labmap.svgmap.root()).get(0);

        if(m.mapImage){
            if(m.user){
                m.mapImage.setAttributeNS(xlink, 'href', m.user.imageURL);
                var title = m.mapElement.attr('title');

                if (!title) {
                    m.mapElement.attr('title', m.machinename + ': ' + m.user.first_name + ' ' + m.user.last_name + ' (' + m.user.username + ')');
                }
            }else{
                m.mapImage.hide();
            }
        }
    });
}

function showUserDataForMachine(m){
    $("#user_info_image").attr('src', m.user.imageURL);
    $("#user_info_name").html(m.user.first_name + ' ' + m.user.last_name);
    $("#user_info_username").html(m.user.username);
    $("#user_info_machine").html(m.machinename);
}






















