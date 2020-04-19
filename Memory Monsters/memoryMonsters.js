// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 3;

// Load an audio file
var gAudioWin = new Audio('sound/win.mp3');
var gAudioWrong = new Audio('sound/Wrong.mp3');
var gAudioRight = new Audio('sound/right.mp3');
var gIsProcessing = false;
var gUserName = localStorage.getItem('userName');
var gBestResultTime = localStorage.getItem('bestTime');
var gBestResultName = localStorage.getItem('bestName');
//var gStartingTime = 0;
var gCurrTime = 0;
var gClockRunning;

function init() {
    //get the user name from prompt and display on page after local Storage save
    if (!gUserName) {
        gUserName = prompt('what\'s you name?');
        localStorage.setItem('userName', gUserName);
    }
    if (!gBestResultTime) {
        document.querySelector('.best-result').innerHTML = 'Best time: Not Set Yet.';
    }
    var userNamePlaces = document.querySelectorAll('.user-name');
    userNamePlaces.forEach(function (userNamePlace) {
        userNamePlace.innerHTML = gUserName;
    })
    displayBestTime();
    var board = document.querySelector('.cards-container');
    for (var i = board.children.length; i >= 0; i--) {
        board.appendChild(board.children[Math.random() * i | 0]);
    }
}

function changeName() {
    //emptys the local storage from the username keyItem and keyValue;
    localStorage.removeItem('userName');
    location.reload();
}

function playAgain() {
    location.reload();
}

// This function is called whenever the user click a card
function cardClicked(elCard) {

    // if first card, start the timer with startTimer;
    if (gCurrTime === 0) {
        startTimer();
    }

    if (gIsProcessing) {
        return;
    }

    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }

    // Flip it
    elCard.classList.add('flipped');

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        var card1 = elPreviousCard.getAttribute('data-card');
        var card2 = elCard.getAttribute('data-card');

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2) {
            gIsProcessing = true;
            gAudioWrong.play();
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                gIsProcessing = false;
            }, 1000)

        } else {
            // Yes! a match!
            flippedCouplesCount++;
            elPreviousCard = null;
            gAudioRight.play();

            // All cards flipped!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                gAudioWin.play();
                clearInterval(gClockRunning);
                checkBestTime();

                document.querySelector('.play-again').style.display = 'inline-block';
            }
        }
    }
}

function startTimer() {
    gClockRunning = setInterval(() => {
        gCurrTime += 10;
        document.querySelector('.timer').innerHTML = millisecsToMMSSMS(gCurrTime);
    }, 10);
}


function checkBestTime() {
    var currBestTime = localStorage.getItem('bestTime');
    if (!currBestTime || gCurrTime < currBestTime) {
        localStorage.setItem('bestName', gUserName);
        localStorage.setItem('bestTime', gCurrTime);
        alert('You set a new best time!');
        displayBestTime();
    }

}

function displayBestTime() {
    var bestName = localStorage.getItem('bestName');
    var bestTime = localStorage.getItem('bestTime');
    if (!bestTime) {
        document.querySelector('.best-result').innerHTML = 'Best time: not set yet';
    } else {
        document.querySelector('.best-result').innerHTML = 'Best time: ' + bestName + ' \| ' + millisecsToMMSSMS(bestTime);
    }
}

function millisecsToMMSSMS(millisecs) {
    var MM = Math.floor(millisecs / 60000) >= 10 ? Math.floor(millisecs / 60000) : '0' + Math.floor(millisecs / 60000);
    var SS = Math.floor(millisecs / 1000) >= 10 ? Math.floor(millisecs / 1000) : '0' + Math.floor(millisecs / 1000);
    var MS = (millisecs % 1000) / 10;
    return MM + '\:' + SS + '\.' + MS;
}