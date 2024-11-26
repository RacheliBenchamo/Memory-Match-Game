(function () {
    const playersList = [];
    let imgs = [];
    let last_card = [];
    let step = 0;
    let matches = 0;

    // a module for different validation functions that the game needs
    const validator = (function () {

        let nonEvenErrorMessage = "Number of cards (rows x columns) must be even,\nplease correct your choice.";

        // a module for string validation in the start screen
        const validateSetting = (setting, error_id, playBtn) => {

            if ((setting.cols * setting.rows) % 2 !== 0) {
                error_id.textContent = nonEvenErrorMessage;
                playBtn.disabled = true;
            } else {
                resetErrorsMsg();
                playBtn.disabled = false;
            }
        }

        // resets the errors messages to be empty
        const  resetErrorsMsg= () => {
            document.getElementById('cols error').textContent = '';
            document.getElementById('rows error').textContent = '';
        }

        return{
            validateSetting
        }
    })


    // a module dealing with our win screen data and with its functions
    const winScreen= (function () {

        const maxPlayers = 3;
        let leaderBoard = document.getElementById('Leaderboard table');
        let playerName = document.getElementById('name');

        /** dealing with all the things we need that will happen when the player win
         * as adding the player if needed to leaderBoard and to activate the
         * game over screen in the html file
         */
        const handleWin = (gameData) => {
            let player = {
                rank: "0",
                name: playerName.value.toLowerCase(),
                score: (getScore(gameData) | 0).toString()
            }
            addPlayerToList(player);
            leaderBoard.innerHTML = convertPlayersListToHtmlTable();
            playerName.value = ''
            handleGameOverScreen(player);
        }

        /** calculates the score of the current game and returns it */
        const getScore = (gameData) => {
            return ((gameData.columns * gameData.rows * 2 - (step)) / gameData.delay)
                + (gameData.columns * gameData.rows)
        }

        /** adds player to leader board list if his score good enough */
        const addPlayerToList = (player) => {
            let pos = playersList.findIndex(x => x.name === player.name)

            // the player not in the leaderboard table yet
            if (pos === -1) {
                if (playersList.length < maxPlayers || parseInt(player.score) > parseInt(playersList[maxPlayers - 1].score))
                    playersList.push(player);
            } else if (parseInt(playersList[pos].score) < parseInt(player.score))
                playersList[pos] = player;
            sortPlayerList();
            if (playersList.length > maxPlayers)
                playersList.pop();
        }

        /** sorts the leader board list from the greater score */
        const sortPlayerList = () => {
            playersList.sort((a, b) => parseFloat(a.score)- parseFloat(b.score));
            playersList.reverse();
            for (let i = 0; i < playersList.length; i++)
                playersList[i].rank = (i + 1).toString()
        }

        /** convert the leader board list from list to html table */
        const convertPlayersListToHtmlTable = () => {
            let res = "<table class='table table-striped'><tr><th>Rank</th><th>Player</th><th>Score</th></tr>";
            playersList.forEach(p => res += `<tr><td>${p.rank}</td><td>${p.name}</td><td>${p.score}</td></tr>`);
            res += "</table>";
            return res;
        }

        /** adds the right strings to the different elements in the game over
         * screen by the data of the current game */
        const handleGameOverScreen = (player) => {
            let rank = playersList.findIndex(x => x.name === player.name);
            let text = '';
            if (rank !== -1)
                text = "Score: " + player.score + ".\n" + "You are ranked " + (rank + 1) + " out of " + maxPlayers;
            else
                text = "Score: " + player.score + ".\n" + "You are not ranked in the leader board. try again! ";

            document.getElementById('cards played').textContent = "Num of cards played: " + matches * 2;
            document.getElementById('score and rank').textContent = text;
            document.getElementById('Leaderboard table copy').innerHTML =
                leaderBoard.innerHTML;
            screensHandler(true, true, false);
        }
        return{
            handleWin
        }
    })

    // a module dealing with our game screen data and with its functions
    const gameScreen = (function () {

        const cards_names = ["./images/1.png", "./images/2.png", "./images/3.png", "./images/4.png", "./images/5.png", "./images/6.png", "./images/7.png", "./images/8.png", "./images/9.png",
            "./images/10.png", "./images/11.png", "./images/12.png", "./images/13.png"]

        /** insert the cards pictures to a list of all the images.
         * the size of the list determinate by the user choice in the game settings
         * */
        const createBoardImgs = (gameData) => {
            let items = [...Array(13).keys()];
            for (let i = 0; i < gameData.rows * gameData.columns / 2; i++) {
                let val = items[Math.floor(Math.random() * items.length)];
                items = items.filter(item => item !== val);
                imgs.push(cards_names[val]);
                imgs.push(cards_names[val]);
            }
            imgs = imgs.sort((a, b) => 0.5 - Math.random());
        }

        /** creates all the elements in the game board */
        const createTable = (gameData) => {
            let counter = 0;

            for (let i = 0; i < gameData.rows; i++) {
                const row = document.createElement("tr");

                for (let j = 0; j < gameData.columns; j++) {
                    const cell = document.createElement("td");
                    const div = document.createElement('div');
                    div.className = "text-center";
                    let img = initializeImg(counter, gameData);
                    div.appendChild(img);
                    cell.appendChild(div);
                    row.appendChild(cell);
                    counter += 1;
                }
                gameData.game_board.appendChild(row);
            }
        }

        /** initializes all the image data before the game  */
        const initializeImg = (counter, gameData) => {
            const img = document.createElement('img');
            img.id = counter.toString();
            img.src = "./images/back.png";
            img.height = 850 / gameData.columns;
            img.width = 850 / gameData.columns;
            img.onclick = function () {
                handleClickImg(img, gameData)
            };
            return img;
        }

        /** adds mouse hover listener so each card will be marked when the
         * user go over it with mouse
         * */
        const addMouseHoverListener = () => {
            let tableRow = document.getElementsByTagName('img');
            [...tableRow].forEach(element => element.addEventListener('mouseover', (event) => {
                event.target.style.border = "7px solid dodgerblue"
            }));
            [...tableRow].forEach(element => element.addEventListener('mouseout', (event) => {
                event.target.style.border = ""
            }))
        }

        /** handles the clicks on cards during the game by the rules of
         * the memory game
         * */
        const handleClickImg = (img, gameData) => {
            if (last_card.length >= 2)
                return;

            img.src = imgs[parseInt(img.id)];
            if (last_card.length === 0) {
                handleFirstOpen(img, gameData)
            } else {
                handleSecondOpen(img, gameData)
            }
        }

        /** handles the clicks on the first card out of the two cards
         * that the user could open in the same turn
         */
        const handleFirstOpen = (img, gameData) => {
            last_card.push(img);
            step += 1;
            gameData.steps.textContent = "Steps: " + step;
        }

        /** handles the clicks on the second card out of the two cards
         * that the user could open in the same turn
         */
        const handleSecondOpen = (img, gameData) => {
            if (last_card[0].id === img.id)
                return;

            step += 1;
            gameData.steps.textContent = "Steps: " + step;
            last_card.push(img);

            if (last_card[0].src !== last_card[1].src) {
                handleNoMatch(gameData)
            } else {
                handleMatch(gameData)
            }
        }

        /** handles the cases when the user opens two unmatched cards */
        const handleNoMatch = (gameData) => {
            setTimeout(function () {
                last_card[0].src = "./images/back.png";
                last_card[1].src = "./images/back.png";
                last_card.splice(0, last_card.length);

            }, 1000 * gameData.delay);
        }

        /** handles the cases when the user opens two matched cards */
        const handleMatch = (gameData) => {
            matches += 1;
            last_card[0].onclick = function () {};
            last_card[1].onclick = function () {};
            last_card.splice(0, last_card.length);

            if (matches === gameData.columns * gameData.rows / 2) {
                let wnScreen = winScreen()
                wnScreen.handleWin(gameData);
            }
        }

        return{
            createBoardImgs,
            createTable,
            addMouseHoverListener,
            handleClickImg
        }
    })

    /** gets booleans variables who by them the function
     * changes the "hidden" attribute of each screen
     */
    const screensHandler = (startScreen, gameScreen, winScreen)=> {
        document.getElementById('start-screen').hidden = startScreen;
        document.getElementById('game-screen').hidden = gameScreen;
        document.getElementById('game_over-screen').hidden = winScreen;
    }

    /** resets all the needed elements in the game for the next play */
    const resetGame = () => {
        step = 0;
        matches = 0;
        imgs = [];
        last_card = [];
        document.getElementById('steps').textContent = "Steps: " + step;
        document.getElementById('game_board').innerHTML = "";
        screensHandler(false, true, true);
    }

    /** upon loading the page, we bind handlers to the form,
     * the screens and the buttons.
     */
    document.addEventListener("DOMContentLoaded", () => {

        let controller = {
            playBtn: document.getElementById('play-button'),
            backBtn: document.getElementById('abandon-button'),
            okBtn: document.getElementById('ok-button'),
            startScreen: document.getElementById('start-screen'),
        }

        /** checks that the rows and cols the user chosen are by the demands
         */
        function checkSetting(error_id) {
            let setting = {
                cols: document.getElementById('columns').value,
                rows: document.getElementById('rows').value,
            }
            let validate = validator()
            validate.validateSetting(setting, document.getElementById(error_id), controller.playBtn);
        }

        /** listens to the "play" button on the form and start the game if its clicked
         * and the data the user put in the form was by the demands
         */
        controller.startScreen.addEventListener("submit", (event) => {
            event.preventDefault();
            let gameData = {
                game_board: document.getElementById('game_board'),
                steps: document.getElementById('steps'),
                rows: document.getElementById('rows').value,
                columns: document.getElementById('columns').value,
                delay: document.getElementById('Delay').value
            }
            screensHandler(true, false, true);
            let game = gameScreen()
            game.createBoardImgs(gameData);
            game.createTable(gameData);
            game.addMouseHoverListener();
        })
        window.checkSetting = checkSetting;

        /** listens to the "ok" and "Abandon" buttons on the screens and reset the game
         * if the user clicks on them
         */
        controller.backBtn.addEventListener('click', () => { resetGame() })
        controller.okBtn.addEventListener('click', () => { resetGame() })
    });
}());
