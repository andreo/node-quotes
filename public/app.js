
$(document).ready(function () {
    var render = Handlebars.compile($('#key-value-list').html());
    var quotes = $('#quotes');

    var socket = io.connect();
    socket.on('quotes', function (data) {
        quotes.html(render(data))
        quotes.effect('highlight', {}, 1000);
    });
});

