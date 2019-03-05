$(document).ready(function()
{

    $("#board tr td").click(function () {
        if ($(this).text() === " ") {
            $(this).text("X");// do stuff here for player 1 and 2
            var cellid = $(this).attr('id');
            var gIndex = cellIndex(cellid);
            console.log(gIndex);
            var playerMove = JSON.stringify({move: gIndex});
            console.log(playerMove);
            /*
            var tgrid = [];
            $("#board tr td").each(function () {
                tgrid.push($(this).text());
            });
            var grid = JSON.stringify({grid: tgrid});
            console.log(grid);
            */
            var winner = undefined;

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/ttt/play",
                data: playerMove,
                dataType: "json",
                cache: false,
                success: function (newgrid) {
                        console.log(newgrid);
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

    function cellIndex(cellid)
    {
        switch(cellid){
            case 'c1':
                return 0;
            case 'c2':
                return 1;
            case 'c3':
                return 2;
            case 'c4':
                return 3;
            case 'c5':
                return 4;
            case 'c6':
                return 5;
            case 'c7':
                return 6;
            case 'c8':
                return 7;
            case 'c9':
                return 8;
        }
    }

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
        if (newgrid.winner === " ")
        {
            $("#winnertext").text("The game is a draw.");
            $("#board tr td").css("pointer-events", "none");
        }
    }
});