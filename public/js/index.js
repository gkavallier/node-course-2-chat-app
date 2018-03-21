var socket = io();

socket.on('connect', function ()  {
    console.log('connected to server');



});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('new message', message);
    var li=jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var li=jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>'); // _blank makes it to open a new tab

    li.text(`${message.from}: `);
    a.attr('href',message.url);    // by putting text in this fomat and not inside text string we avoid malicious users to send html code in text
    li.append(a);
    jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();  // to avoid the default page refresh when we press button
    
    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function (){
        messageTextbox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location    ');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function (err) {
        locationButton.removeAttr('disabled').text('Send Location    ');     
        alert('Unable to fetch location.');
    //    console.log(err);
    });
});