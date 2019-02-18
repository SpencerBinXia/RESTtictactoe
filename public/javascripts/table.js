$(document).ready(function()
{

    $("#board tr td").click(function () {
        if ($(this).text() === " ") {
            $(this).text("X");// do stuff here for player 1 and 2
            var tgrid = [];
            $("#board tr td").each(function () {
                tgrid.push($(this).text());
            });
            var grid = JSON.stringify({grid: tgrid});
            //console.log(grid);
            var winner = " ";

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/play",
                data: grid,
                dataType: "json",
                cache: false,
                success: function (newgrid) {
                    //console.log(newgrid);
                    //console.log("we're back");
                    mapGrid(newgrid);
                    winCheck(newgrid);
                },
                error: function (e) {
                    console.log("Failure: ", e);
                }
            });
        }
    });

    function mapGrid(newgrid)
    {
        $("#c1").text(newgrid.grid[0]);
        $("#c2").text(newgrid.grid[1]);
        $("#c3").text(newgrid.grid[2]);
        $("#c4").text(newgrid.grid[3]);
        $("#c5").text(newgrid.grid[4]);
        $("#c6").text(newgrid.grid[5]);
        $("#c7").text(newgrid.grid[6]);
        $("#c8").text(newgrid.grid[7]);
        $("#c9").text(newgrid.grid[8]);
    }

    function winCheck(newgrid)
    {
        if (newgrid.winner === "X")
        {
            $("#winnertext").text("You have won!");
            $("#board tr td").css("pointer-events", "none");

        }
        if (newgrid.winner === "O")
        {
            $("#winnertext").text("The computer has won!");
            $("#board tr td").css("pointer-events", "none");
        }
        if (newgrid.winner === "t")
        {
            $("#winnertext").text("The game is a draw.");
            $("#board tr td").css("pointer-events", "none");
        }
    }
});