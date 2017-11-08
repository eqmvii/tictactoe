// tictactoe.js
// tic tac toe game using no libraries, only HTML/CSS/JavaScript
// By eqmvii / Eric Mancini

// State object holds the board and info about the player and the turns
var state = {};

state.player = ""; // X or O, whichever player chooses
state.computer = ""; // X or O, whichever player did NOT choose
state.results = [0, 0, 0, 0] // wins, ties, losses, total games played
state.turn = "a"; // a is pre-game, x is x turn, o is o turn, v when game complete. 
state.difficulty = 1; // start the game on easy

// Dom object holds nodes for event listeners and updates
var dom = {}; // 
dom.board = []; // array to hold board nodes

dom.board[0] = document.getElementById("box1");
dom.board[1] = document.getElementById("box2");
dom.board[2] = document.getElementById("box3");
dom.board[3] = document.getElementById("box4");
dom.board[4] = document.getElementById("box5");
dom.board[5] = document.getElementById("box6");
dom.board[6] = document.getElementById("box7");
dom.board[7] = document.getElementById("box8");
dom.board[8] = document.getElementById("box9");
dom.text = document.getElementById("text");
dom.scoreboard = document.getElementById("scoreboard");
dom.boardcontainer = document.getElementById("boardcontainer");
dom.updif = document.getElementById("updif"); // increase difficulty button
dom.curdif = document.getElementById("curdif"); // current difficulty text

// Find clicks on the board and take appropriate action
boardcontainer.addEventListener("click", function (event) {
    let click = event.target.id; // find which box was clicked
    //console.log(event.srcElement);
    //console.log(event.target.id);

    // If the game hasn't started yet, assign sides
    if (state.turn === "a") {
        switch (click) {
            case "box4": // player clicked on 'X'
                state.player = "X";
                state.computer = "O";
                reset();
                game_loop();
                break;
            case "box6": // player clicked on 'O'
                state.player = "O";
                state.computer = "X";
                reset();
                game_loop();
                break;
        }
        return;
    }

    // If it is not the start of the game, do something based on where the click was
    if (click.slice(0, 3) === "box") {
        board_click(click);
    }

});

// Handle clicks on the board
function board_click(location) {
    // If the game is over and the board is clicked again
    if (state.turn === "z") {
        reset();
        game_loop();
        return;
    }

    // Get the game board model array location of the box clicked
    let array_loc = parseInt(location.slice(3)) - 1;

    // Only allow clicking if it's the player's turn
    if (state.player === state.turn) {
        if (!state.board[array_loc]) {
            state.board[array_loc] = state.player;
            state.turn = state.computer;
            dom.board[array_loc].innerHTML = state.player;
            game_loop();
        }
    }
};

// Update the board
// TODO: This looks better on Chrome/Windows than it does on iPhone
// iPhone has the entire screen flash when it's updated for some reason
function draw_board() {
    for (let i = 0; i < state.board.length; i++) {
        if (state.board[i] === 'X') {
            dom.board[i].innerHTML = "X";
            dom.board[i].classList.add("exes"); // add X color
        }
        else if (state.board[i] === 'O') {
            dom.board[i].innerHTML = "O";
            dom.board[i].classList.add("ohs"); // add O color            
        }
        else // remove any text and color classes
        {
            dom.board[i].innerHTML = "";
            dom.board[i].classList.remove("exes");
            dom.board[i].classList.remove("ohs");
            dom.board[i].classList.remove("victory");
        }
    }
};

// Process each move and do the computer's move if necessary
function game_loop() {
    draw_board();

    // Check to see if the game was won, if so stop
    let winner = check_win();
    if (winner) {
        state.turn = "z"; // game over flag
        dom.text.innerHTML = winner + " won! Click the board to play again.";
        if (winner === state.player) {
            state.results[0] += 1; // add a win
            state.results[3] += 1; // add a game played
            update_score();
        }
        else if (winner === state.computer) {
            state.results[2] += 1; // add a loss
            state.results[3] += 1; // add a game played
            update_score();
        }
        return;
    }

    // Check to see if the game is a draw
    if (state.board.join('').length === 9) // i.e. if the board array has 9 characters, and thus no blanks
    {
        state.turn = "z"; // game over flag
        state.results[1] += 1; // add a tie
        state.results[3] += 1; // add a game played
        dom.text.innerHTML = "Draw! Click the board to play again.";
        update_score();
        return;
    }

    // If we get down here, neither player won
    // Prompt for further play & show what turn it is
    let addon = "";
    if (state.turn === state.player) {
        addon = " (player)";
    }
    else {
        addon = " (computer)";
    }
    dom.text.innerHTML = "Move: " + state.turn + addon;

    // Wait for ~0.5 seconds, then let the computer move if it's the computer's turn
    if (state.computer === state.turn) {
        setTimeout(function () {
            sky_net();
        }, 550);
    }

};

// See if the game is won, and if so, return the winner
function check_win() {
    // Check columns and rows
    let check = "";
    for (let i = 0; i < 3; i++) {
        // Check rows for victory
        check = state.board[3 * i] + state.board[(3 * i) + 1] + state.board[(3 * i) + 2];
        if (check === 'XXX' || check === 'OOO') {
            console.log("Winner: " + check[0]);
            victory([3 * i, (3 * i) + 1, (3 * i) + 2]); // color in the winning tiles
            return check[0]; // return the winning letter
        }

        // Check columns for victory
        check = state.board[i] + state.board[i + 3] + state.board[i + 6];
        if (check === 'XXX' || check === 'OOO') {
            console.log("Winner: " + check[0]);
            victory([i, i + 3, i + 6]);
            return check[0];
        }
    }

    // Check two diags for victory
    check = state.board[0] + state.board[4] + state.board[8];
    if (check === 'XXX' || check === 'OOO') {
        victory([0, 4, 8]);
        console.log("Winner: " + check[0]);
        return check[0];
    }
    check = state.board[2] + state.board[4] + state.board[6];
    if (check === 'XXX' || check === 'OOO') {
        victory([2, 4, 6]);
        console.log("Winner: " + check[0]);
        return check[0];
    }
    return false; // no winner
};

// Reset all of the game state for a new game
function reset() {
    state.board = ["", "", "", "", "", "", "", "", ""]; // 9 falsy empty strings
    state.turn = "X"; // X starts, and removes the game over flag
    draw_board();
};

// Color in the winning tiles if somebody wins
var victory = function (arr) {
    for (let i = 0; i < arr.length; i++) {
        dom.board[arr[i]].classList.remove("exes");
        dom.board[arr[i]].classList.remove("ohs");
        dom.board[arr[i]].classList.add("victory");
    }
};

// Re-draw the win/loss/draw stats after a game ends
function update_score() {
    dom.scoreboard.innerHTML = "Wins : " + state.results[0] + " Draws: " + state.results[1] + " Losses: " + state.results[2];
};

// Increase the difficulty when difficulty button is pressed
dom.updif.addEventListener("click", function () {
    state.difficulty += 1;
    if (state.difficulty > 3) // 3 is max difficulty
    {
        state.difficulty = 3;
    }
    switch (state.difficulty) {
        case 1:
            dom.curdif.innerHTML = "Easy (sequential)";
            break;
        case 2:
            dom.curdif.innerHTML = "Normal (random)";
            break;
        case 3:
            dom.curdif.innerHTML = "Hard (some strategy)";
            dom.updif.classList.add("hidden"); // hide button after difficulty maxes out
            break;
    }
});

// AI for the computer player
function sky_net() {
    // Very poor sequential strategy: 
    // Always moves in order left to right, top to bottom, in sequence
    if (state.difficulty === 1) {
        for (let i = 0; i < state.board.length; i++) {
            if (!state.board[i]) {
                state.board[i] = state.computer;
                state.turn = state.player;
                dom.board[i].innerHTML = state.computer;
                game_loop();
                return;
            }
        }
    }
    else {
        // On hardest difficulty, look for a good move before choosing randomly
        // Can still be beaten if player moves first, not a perfect strategy
        if (state.difficulty === 3) {
            let good_move = opportunity_check(); // will be an integer move or false            
            if (good_move !== false) {
                //console.log("AI picked: " + good_move);
                state.board[good_move] = state.computer;
                state.turn = state.player;
                dom.board[good_move].innerHTML = state.computer;
                game_loop();
                return;
            }
        }
        // Choose randomly if no good move or on normal difficulty        
        while (true) {
            let selection = Math.floor(Math.random() * 9); // get a random integer from 0 to 9
            //console.log("Try place: " + selection);
            if (!state.board[selection]) {
                state.board[selection] = state.computer;
                state.turn = state.player;
                dom.board[selection].innerHTML = state.computer;
                game_loop();
                return;
            }
        }
    }
};

// Look for good move opportunities
// Not a perfect tic-tac-toe strategy, just better than random
function opportunity_check() {
    // First, see if I can win with this move or 
    // directly stop the opponent from winning with this move
    let moves = []; // to store all such moves
    let check = "";
    for (let i = 0; i < 3; i++) {
        // Rows
        check = state.board[3 * i] + state.board[(3 * i) + 1] + state.board[(3 * i) + 2];
        if (check === 'XX' || check === 'OO') {
            // Consider a move in this row
            moves.push(move_builder([3 * i, (3 * i) + 1, (3 * i) + 2]));
        }
        // Columns
        check = state.board[i] + state.board[i + 3] + state.board[i + 6];
        if (check === 'XX' || check === 'OO') {
            // Consider a move in this column
            moves.push(move_builder([i, i + 3, i + 6]));
        }
    }

    // Check diags
    check = state.board[0] + state.board[4] + state.board[8];
    if (check === 'XX' || check === 'OO') {
        // Consider a diag move
        moves.push(move_builder([0, 4, 8]));
    }
    check = state.board[2] + state.board[4] + state.board[6];
    //console.log(check);
    if (check === 'XX' || check === 'OO') {
        // Consider a diag move
        moves.push(move_builder([2, 4, 6]));
    }

    // Take the center if it's free and no moves found
    if (moves.length === 0 && !state.board[4]) {
        return 4;
    }

    // Otherwise, if no blocking/winning moves found, return false
    if (moves.length === 0) {
        return false;
    }

    // Return the one move if only one is found
    if (moves.length === 1) {
        return moves[0][0]; // each move has the move itself and a classification as winning or blocking
    }

    // Since there is more than one move,
    // loop through moves looking for a winner, and if it exists, return it
    for (let j = 0; j < moves.length; j++) {
        if (moves[j][1] === 'w') {
            return moves[j][0]; // return the winning position
        }
    }

    // If all of the moves are blocking moves, return the first
    return moves[0][0];
};

// Pick the move to win or block
// 1st array value is the position
// 2nd 'b' for block 'w' for win
function move_builder(arr) {
    let move = [-1, "E"]; // dummy values that should be obvious errors if testing
    for (let i = 0; i < arr.length; i++) {
        if (!state.board[arr[i]]) {
            move[0] = arr[i]; // the move is the empty spot
        }
        else if (state.board[arr[i]] === state.player) {
            move[1] = 'b'; // this move blocks a player victory
        }
        else if (state.board[arr[i]] === state.computer) {
            move[1] = 'w'; // this move causes the computer to win
        }
        else {
            console.log("Unexpected error in choosing computer's move"); // shouldn't ever happen
        }
    }
    return move;
};