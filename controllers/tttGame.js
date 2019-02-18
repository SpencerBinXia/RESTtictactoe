module.exports = {

    play: function play(board){

        var emptyCounter = 0;
        for (i = 0;i < board.length;i++)
        {
            if (board[i] === " ")
            {
                emptyCounter++;
                board[i] = "O";
                if (this.winner(board) === "O")
                {
                    return board;
                }
                else
                {
                    board[i] = " ";
                }
            }
            //console.debug("inside play for loop" + board);
        }

        if (emptyCounter === 0)
        {
            board.winner = "t";
            return board;
        }

        for (i = 0;i < board.length;i++)
        {
            if (board[i] === " ")
            {
                board[i] = "X";
                if (this.winner(board) === "X")
                {
                    board[i] = "O";
                    return board;
                }
                else
                {
                    board[i] = " ";
                }
            }
        }

        for (i = 0;i < board.length;i++)
        {
            //console.debug("empty board[i]" + board[i]);
            if (board[i] === " ")
            {
                //console.debug("inside empty board[i] input");
                board[i] = "O";
                return board;
            }
            //console.debug("inside play for empty" + board);

        }
    },

    winner: function getWinner(board)
    {
        if (board.winner === "t")
        {
            return board.winner;
        }
        else if ((board[0] === board[1] && board[0] === board[2]) ||
            (board[0] === board[3] && board[0] === board[6]) ||
            (board[0] === board[4] && board[0] === board[8]))
        {
            //console.debug("inside if reached");
            return board[0];
        }
        else if ((board[1] === board[4] && board[1] === board[7])) {
            return board[1];
        }
        else if ((board[2] === board[5] && board[2] === board[8])) {
            return board[2];
        }
        else if ((board[3] === board[4] && board[3] === board[5])) {
            return board[3];
        }
        else if ((board[6] === board[7] && board[6] === board[8]) ||
                  (board[6] === board[4] && board[6] === board[2]))
        {
            return board[6];
        }
    }
}