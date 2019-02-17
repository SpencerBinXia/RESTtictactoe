$(document).ready(function()
{

    $("#board tr td").click(function () {
        if ($(this).text() == "") {
            $(this).text("X");// do stuff here for player 1 and 2
            var data = [];
            $("#board tr td").each(function () {
                data.push($(this).text());
            });
            console.log(data.toString());
        }
    });

});