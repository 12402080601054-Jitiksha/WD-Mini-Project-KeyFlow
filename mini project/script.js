
const paragraphs = [
    "technology gives us new ways to learn create and connect with the world every small step helps us improve our skills with patience and practice we can turn simple ideas into something wonderful",
    "every day is a new opportunity to learn something useful and discover what we are capable of doing with focus and effort we can build good habits and achieve our goals",
    "the world is full of interesting things to explore from beautiful forests to busy cities there is always something new to discover when we stay curious and keep learning",
    "reading helps us understand different ideas and see the world from new perspectives a little reading every day can improve our knowledge vocabulary and imagination",
    "creativity begins when we allow ourselves to think differently and try new things simple ideas can become amazing projects when we give them time patience and attention",
    "learning to code teaches us how to solve problems and build useful things with practice we can turn our thoughts into websites applications and tools that help people",
    "music can make ordinary moments feel special and bring people together it can help us relax focus on our work and express feelings that are difficult to explain",
    "small steps can lead to big achievements when we stay consistent and learn from our mistakes progress becomes easier and every new challenge becomes a chance to grow",
    "nature reminds us to slow down and notice the little things the sound of birds the movement of clouds and the warmth of sunlight can make a simple day feel peaceful",
    "a good routine helps us manage our time and make room for the things that matter when we plan our day carefully we can learn create rest and enjoy life"
];

const paragraph = document.getElementById("paragraph");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const timeDisplay = document.getElementById("time");
const statusDisplay = document.getElementById("status");
const restartButton = document.getElementById("restart");

let paragraphText = "";
let previousParagraph = "";
let typedText = "";
let timeLeft = 60;
let started = false;
let finished = false;
let timer = null;
let startTime = null;

function getRandomParagraph() {
    const choices = paragraphs.filter(
        text => text !== previousParagraph
    );

    const available = choices.length ? choices : paragraphs;
    const selected = available[
        Math.floor(Math.random() * available.length)
    ];

    previousParagraph = selected;
    return selected;
}

function renderParagraph() {
    paragraph.innerHTML = "";

    for (const character of paragraphText) {
        const span = document.createElement("span");
        span.textContent = character;
        paragraph.appendChild(span);
    }

    if (paragraph.children.length > 0) {
        paragraph.children[0].classList.add("current");
    }
}

function startTest() {
    if (started || finished) return;

    started = true;
    startTime = Date.now();

    statusDisplay.textContent = "you are in the zone";

    timer = setInterval(() => {
        timeLeft = Math.max(
            0,
            60 - Math.floor((Date.now() - startTime) / 1000)
        );

        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endTest(false);
        } else {
            updateStats();
        }
    }, 100);
}

function updateStats() {
    const spans = paragraph.children;
    let correctCharacters = 0;

    for (let i = 0; i < spans.length; i++) {
        spans[i].classList.remove(
            "correct",
            "incorrect",
            "current"
        );

        if (i < typedText.length) {
            if (typedText[i] === paragraphText[i]) {
                spans[i].classList.add("correct");
                correctCharacters++;
            } else {
                spans[i].classList.add("incorrect");
            }
        } else if (i === typedText.length && !finished) {
            spans[i].classList.add("current");
        }
    }

    const elapsedSeconds = started
        ? Math.max(0.1, (Date.now() - startTime) / 1000)
        : 0;

    const wpm = elapsedSeconds > 0
        ? Math.round(
            (correctCharacters / 5) / (elapsedSeconds / 60)
        )
        : 0;

    const accuracy = typedText.length > 0
        ? Math.round(
            (correctCharacters / typedText.length) * 100
        )
        : 100;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy + "%";
}

function endTest(completed) {
    if (finished) return;

    finished = true;
    clearInterval(timer);

    let correctCharacters = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === paragraphText[i]) {
            correctCharacters++;
        }
    }

    const elapsedSeconds = started
        ? Math.max(0.1, (Date.now() - startTime) / 1000)
        : 0;

    const wpm = elapsedSeconds > 0
        ? Math.round(
            (correctCharacters / 5) / (elapsedSeconds / 60)
        )
        : 0;

    const accuracy = typedText.length > 0
        ? Math.round(
            (correctCharacters / typedText.length) * 100
        )
        : 100;

    sessionStorage.setItem(
        "typeGlowResult",
        JSON.stringify({
            wpm: wpm,
            accuracy: accuracy,
            correct: correctCharacters,
            typed: typedText.length,
            completed: completed
        })
    );

    statusDisplay.textContent = "opening your results";

    window.location.href = "results.html";
}

paragraph.addEventListener("click", () => {
    if (!finished) {
        paragraph.focus();
    }
});

paragraph.addEventListener("keydown", event => {
    if (finished) {
        event.preventDefault();
        return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
    }

    if (event.key === "Backspace") {
        event.preventDefault();
        typedText = typedText.slice(0, -1);
        updateStats();
        return;
    }

    if (event.key.length !== 1) {
        event.preventDefault();
        return;
    }

    event.preventDefault();

    if (typedText.length >= paragraphText.length) {
        return;
    }

    startTest();

    typedText += event.key;
    updateStats();

    if (typedText.length === paragraphText.length) {
        endTest(true);
    }
});

function restartTest() {
    clearInterval(timer);

    paragraphText = getRandomParagraph();
    typedText = "";
    timeLeft = 60;
    started = false;
    finished = false;
    timer = null;
    startTime = null;

    timeDisplay.textContent = "60";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    statusDisplay.textContent = "click the paragraph to begin";

    renderParagraph();
    paragraph.focus();
}

restartButton.addEventListener("click", restartTest);

paragraphText = getRandomParagraph();
renderParagraph();
