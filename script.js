let gameboard = (function() {
    let squares = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const displayGameboard = function() {
        let outputString = "";
        for(let x = 0; x < 3; x++)
        {
            outputString += (`${squares[x][0]} ${squares[x][1]} ${squares[x][2]}\n`);
        }
        console.log(outputString);
    }

    const clearBoard = function() {
        squares = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }

    const changeSquare = function(newValue, positionX, positionY) {
        squares[positionY][positionX] = newValue;
    }
    const getSquare = function(positionX, positionY) {
        return squares[positionY][positionX];
    }
    return {squares, displayGameboard, changeSquare, getSquare, clearBoard, };
})();

let gameManager = (function(gameboard, docu) {
    let turn = 0;
    let counter = 0;
    let finished = false;
    const displayText = docu.querySelector(".info-display");

    const startGame = function() {
        turn = 0;
        updateTurnText();
    }

    const getSymbol = function() {
        return turn === 0 ? "X":"O";
    }

    const updateTurnText = function() {
        displayText.textContent ="It is player " + getSymbol() + "'s turn.";
    }

    const acceptInput = function(positionX, positionY, elementToChange) {
        if(gameboard.getSquare(positionX, positionY) === 0 && !finished)
        {
            gameboard.changeSquare(turn + 1, positionX, positionY);
            elementToChange.textContent = getSymbol();
            gameboard.displayGameboard();
            counter++;
            
            
            if(checkForWin(positionX, positionY))
            {
                console.log('WIN!');
                finished = true;
                displayText.textContent = `Player ${getSymbol()} wins!`;
                return;
            }
            else if(counter === 9)
            {
                console.log("ITS A TIE");
                finished = true;
                displayText.textContent = "It's a tie!";
                return;
            }
            turn = turn === 0 ? 1 : 0;
            updateTurnText();
            
        }
    }

    const checkForWin = function(positionX, positionY) {
        const playerNumber = gameboard.getSquare(positionX, positionY);
        let win = false;
        // Primary Diagonal
        if(positionX === positionY) win = win || checkThreeSquares([0, 0, 1, 1, 2, 2]);
        if(positionX === 2 - positionY) win = win || checkThreeSquares([2, 0, 1, 1, 0, 2]);
        if(positionX === 0) win = win || checkThreeSquares([0, 0, 0, 1, 0, 2]);
        if(positionX === 1) win = win || checkThreeSquares([1, 0, 1, 1, 1, 2]);
        if(positionX === 2) win = win || checkThreeSquares([2, 0, 2, 1, 2, 2]);
        if(positionY === 0) win = win || checkThreeSquares([0, 0, 1, 0, 2, 0]);
        if(positionY === 1) win = win || checkThreeSquares([0, 1, 1, 1, 2, 1]);
        if(positionY === 2) win = win || checkThreeSquares([0, 2, 1, 2, 2, 2]);

        return win;
    };

    const checkThreeSquares = function(squareLocations) {
        const square1 = gameboard.getSquare(squareLocations[0], squareLocations[1]);
        const square2 = gameboard.getSquare(squareLocations[2], squareLocations[3]);
        const square3 = gameboard.getSquare(squareLocations[4], squareLocations[5]);
        if(square1 === square2 && square2 === square3) return true;
        else return false;
    }

    const getFinishedState = function() {
        return finished;
    }

    const resetState = function() {
        counter = 0;
        finished = false;
        turn = 0;
        updateTurnText();
    }


    return {startGame, acceptInput, getSymbol, getFinishedState, resetState, };
})(gameboard, document);

let displayManager = (function(docu, gameboard, gameManager) {
    const initializeDisplayInteraction = function() {

        const gridSquares = docu.querySelectorAll(".grid-square");
        let counter = 0;
        for(let x = 0; x < 3; x++)
        {
            for(let y = 0; y < 3; y++)
            {
                square = gridSquares[counter];
                console.log(counter);
                let clickFunction = function(event) {
                    console.log(event.target.posX, event.target.posY);
                    const text = event.target.querySelector(".grid-square-text");
                    gameManager.acceptInput(event.target.posX, event.target.posY, text);

                }
                square.posX = y;
                square.posY = x;
                square.addEventListener("click", clickFunction, false);
                counter++;
                console.log("Added for element " + counter);
            }
            
        }

        const restartButton = docu.querySelector(".restart-button");
        restartButton.gridSquares = gridSquares;
        restartButton.addEventListener("click", (event) => {
            gameboard.clearBoard();
            for(const square of event.target.gridSquares)
            {
                square.querySelector(".grid-square-text").textContent = "";
            }
            gameManager.resetState();
        })
    }
    
    return {initializeDisplayInteraction, };
})(document, gameboard, gameManager);


gameboard.displayGameboard();

gameManager.startGame();
displayManager.initializeDisplayInteraction();

