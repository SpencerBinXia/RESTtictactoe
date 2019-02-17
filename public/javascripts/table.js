$(document).ready(function()
{

    $("#board tr td").click(function () {
        if ($(this).text() == " ") {
            $(this).text("X");// do stuff here for player 1 and 2
            var tgrid = [];
            $("#board tr td").each(function () {
                tgrid.push($(this).text());
            });
            var grid = JSON.stringify(tgrid);
            console.log(grid);
            var winner = " ";

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/play",
                data: grid,
                dataType: "json",
                cache: false,
                success: function (newgrid) {
                    console.log(newgrid);
                    console.log("we're back");
                },
                error: function (e) {
                    console.log("Failure: ", e);
                }
            });
        }
    });

});