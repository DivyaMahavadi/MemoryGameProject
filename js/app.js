/*
 * List that holds all of the cards
 */
var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
    "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
    "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

/* Variables of the Game */
var open = [];
var matched = 0;
var moveCounter = 0;
var numOfStars = 3;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

/* Max number of moves which is used to determine the stars */
var levelOne = 15;
var levelTwo = 20;

var modalWindow = $("#win-modal");

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/***Functions used by main event functions.***/

/*This function will be called every second and increments timer and updates HTML.
  Also the timer will start only when the clicked counter is greater than 0.
*/
var timerStart = function () {
    if (moveCounter > 0) {
        if (timer.seconds === 59) {
            timer.minutes++;
            timer.seconds = 0;
        } else {
            timer.seconds++;
        }

        var formattedSec = "0";
        if (timer.seconds < 10) {
            formattedSec += timer.seconds
        } else {
            formattedSec = String(timer.seconds);
        }

        var time = String(timer.minutes) + ":" + formattedSec;
        $(".timer").text(time);
    }
};

/* Resets the timer and restarts the timer. */
function timerReset() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");
    timer.clearTime = setInterval(timerStart, 1000);
};

/* Displays modal window. */
function displayModalWindow() {
    modalWindow.css("display", "block");
};

/* Puts the cards randomly on the board and updates HTML. */
function updateCards() {
    deck = shuffle(deck);
    var index = 0;
    $.each($(".card i"), function () {
        $(this).attr("class", "fa " + deck[index]);
        index++;
    });
    timerReset();
};


/* Removes last star from remaining stars, updates modal HTML. */
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numOfStars--;
    $(".num-stars").text(String(numOfStars));
};

/* Restores star icons to 3 stars, updates modal HTML */
function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numOfStars = 3;
    $(".num-stars").text(String(numOfStars));
};

/* Updates movecounter in the HTML, removes star is necessary based on difficulty variables. */
function updateMoveCounter() {
    $(".moves").text(moveCounter);

    if (moveCounter === levelOne || moveCounter === levelTwo) {
        removeStar();
    }
};

/* Checks if card is a valid move. */
function isCardValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

/* verifies if the the card is matched or not. */
function checkForMatch() {
    if (open[0].children().attr("class") === open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};

/* Returns win condition. */
function hasWon() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
};

/* Sets currently open cards to the match state, checks win condition. */
var setMatch = function () {
    open.forEach(function (card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        displayModalWindow();
    }
};

/* Sets currently opened cards back to default state. */
var resetOpen = function () {
    open.forEach(function (card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};

/* Sets selected card to the open and shown state. */
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

/*** Event callback functions ***/

/* Resets all game state variables */
var resetTheGame = function () {
    open = [];
    matched = 0;
    moveCounter = 0;
    timerReset();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};

/* Handling main game logic */
var onClick = function () {
    if (isCardValid($(this))) {

        if (open.length === 0) {
            openCard($(this));

        } else if (open.length === 1) {
            openCard($(this));
            moveCounter++;
            updateMoveCounter();

            if (checkForMatch()) {
                setTimeout(setMatch, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};

/* Resets the game when 'play again' is clicked */
var playAgain = function () {
    resetTheGame();
    modalWindow.css("display", "none");
};

/* Initalizing event listeners */

$(".card").click(onClick);
$(".restart").click(resetTheGame);
$(".play-again").click(playAgain);

/* Provides a randomized game board on page load */
$(updateCards);


