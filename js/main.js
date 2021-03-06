function mapLoaded() {
//  setupHandlers(labmap.svgmap.root());
}

function mapUpdated() {
    updateTable();
    setupListenersForMachines();
}

function updateTable(){
    var newT = $(document.createElement('table'));
    var newTHead = $(document.createElement('thead'));
    newTHead.append('<tr><th>Hostname</th><th>User name</th><th>Full name</th></tr> ')
    var newTBody = $(document.createElement('tbody'));
    
    $.each(labmap.machines, function(index, m){
       if (m.user != "AVAILABLE" && m.user != "UNKNOWN") {
	    m.tableRow = $(document.createElement('tr'));
	    m.tableRow.append('<td>' + m.machinename + '</td><td>' + m.user.username + '</td><td>' + m.user.fullname + '</td>');

	    newTBody.append(m.tableRow);
	}
    });
    
    newT.append(newTHead).append(newTBody);
    $('#user_table').replaceWith(newT); //wipes all dom and javascript bindings
    newT.attr('id','user_table').addClass('tablesorter'); //Redo the id
    
    // Rebind table sorter and pager objects
    //TODO: might not be needed?
    $(newT)
        .tablesorter({ debug: true, widthFixed: true});
//        .tablesorterPager({offset: 20, size:18, container: $("#pager")});
//        .tablesorterPager({positionFixed:false, size:18, container: $("#pager")});
}


function setupListenersForMachines(){
    $.each(labmap.machines, function(index, m){
        if (m.user != 'UNKNOWN' && m.user != 'AVAILABLE') {
	    m.mapElement.addClass('clickable');
	    m.mapElement.click(function(){
		showUserDataForMachine(m);
	    });

	    m.tableRow.addClass('clickable');
	    m.tableRow.click(function(){
		showUserDataForMachine(m);
	    });
	}
    });
}

function showUserDataForMachine(m){
    if (m.user.imageURL) {
      $("#user_info_image").attr('src', m.user.imageURL);
    }
    else {
      $("#user_info_image").attr('src', '/images/nopic.jpg');
    }
    $("#user_info_name").html('<a href="https://teachdb.doc.ic.ac.uk/db/viewtab?table=vPeople&arg0=' + m.user.username + '">' + m.user.fullname + '</a>');
    $("#user_info_username").html('<a href="mailto:' + m.user.username + '@ic.ac.uk">' + m.user.username + '</a>');
    $("#user_info_machine").html('<a href="ssh://' + m.machinename + '.doc.ic.ac.uk">' + m.machinename + '</a>');
}
