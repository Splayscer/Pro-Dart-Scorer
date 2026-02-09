document.addEventListener('DOMContentLoaded', () => {
    let state = {
        startScore: 501,
        players: [],
        currentPlayerIdx: 0,
        throwsInTurn: 0,
        currentTurnPoints: [],
        multiplier: 1
    };

    const synth = window.speechSynthesis;
    const canvas = document.getElementById('dart-canvas');
    const ctx = canvas.getContext('2d');

    const el = {
        setup: document.getElementById('setup-screen'),
        game: document.getElementById('game-screen'),
        inputName: document.getElementById('new-player-name'),
        btnAdd: document.getElementById('btn-add-player'),
        list: document.getElementById('added-players-list'),
        btnStart: document.getElementById('btn-start'),
        scoreboard: document.getElementById('scoreboard'),
        monitorMod: document.getElementById('monitor-mod'),
        monitorVal: document.getElementById('monitor-val'),
        checkoutBox: document.getElementById('checkout-suggestion'),
        checkoutPath: document.getElementById('suggestion-path'),
        customScore: document.getElementById('custom-score-input')
    };

    function speak(text) {
        if (synth.speaking) synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'de-DE';
        synth.speak(utter);
    }

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        let sum = 0;
        for (let i = 0; i < 3; i++) {
            let val = state.currentTurnPoints[i] !== undefined ? state.currentTurnPoints[i] : "-";
            if (typeof val === 'number') sum += val;
            ctx.strokeRect(20 + i * 95, 10, 70, 25);
            ctx.fillText(val, 55 + i * 95, 28);
        }
        ctx.fillStyle = "#00e676";
        ctx.font = "bold 18px monospace";
        ctx.fillText("AUFNAHME: " + sum, canvas.width / 2, 65);
    }

    // --- PROFESSIONELLE CHECKOUT LOGIK ---
    function updateCheckout() {
        let score = state.players[state.currentPlayerIdx].score;
        let dartsLeft = 3 - state.throwsInTurn;
        
        if (score > 170 || score <= 1) {
            el.checkoutBox.classList.add('hidden');
            return;
        }

        let path = calculatePath(score, dartsLeft);
        if (path) {
            el.checkoutPath.textContent = path.join(" → ");
            el.checkoutBox.classList.remove('hidden');
        } else {
            el.checkoutBox.classList.add('hidden');
        }
    }

    function calculatePath(score, darts) {
        // Einfache Heuristik für alle Restwerte (121, 63, etc.)
        let result = [];
        let tempScore = score;

        for (let i = 0; i < darts; i++) {
            if (tempScore <= 0) break;

            // Sieg-Wurf (Double)
            if (tempScore <= 40 && tempScore % 2 === 0) {
                result.push("D" + (tempScore / 2));
                tempScore = 0;
            } else if (tempScore === 50) {
                result.push("Bullseye");
                tempScore = 0;
            } 
            // Setup Würfe
            else {
                let target = findBestSegment(tempScore, (darts - i));
                result.push(target.label);
                tempScore -= target.value;
            }
        }
        return result.length > 0 ? result : null;
    }

    function findBestSegment(rem, dartsLeft) {
        // Höchste Priorität: T20, T19 etc.
        if (rem > 60) return { label: "T20", value: 60 };
        if (rem > 40) {
            // Versuche auf ein gerades Doppel zu stellen
            for (let t of [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10]) {
                if ((rem - t) % 2 === 0 && (rem - t) <= 40) return { label: "S" + t, value: t };
                if ((rem - t*3) % 2 === 0 && (rem - t*3) <= 40) return { label: "T" + t, value: t*3 };
            }
            return { label: "T" + Math.floor(rem/3), value: Math.floor(rem/3)*3 };
        }
        // Kleiner Rest: Single Treffer um auf Doppel zu kommen
        return { label: "S" + (rem % 2 === 0 ? 2 : 1), value: (rem % 2 === 0 ? 2 : 1) };
    }

    // --- EVENT HANDLER ---
    el.btnAdd.addEventListener('click', () => {
        let name = el.inputName.value.trim();
        if (!name) return;
        state.players.push({ name: name, score: state.startScore, legs: 0 });
        let li = document.createElement('li'); li.textContent = name; el.list.appendChild(li);
        el.inputName.value = ''; el.btnStart.disabled = false;
    });

    document.querySelectorAll('.btn-select').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.btn-select').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            state.startScore = parseInt(b.dataset.value);
        });
    });

    el.btnStart.addEventListener('click', () => {
        if (el.customScore.value) state.startScore = parseInt(el.customScore.value);
        state.players.forEach(p => p.score = state.startScore);
        el.setup.classList.add('hidden');
        el.game.classList.remove('hidden');
        initScoreboard(); updateUI(); drawCanvas(); updateCheckout(); speak("Spiel gestartet.");
    });

    document.querySelectorAll('.btn-mod').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.btn-mod').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            state.multiplier = parseInt(b.dataset.factor);
            el.monitorMod.textContent = b.textContent;
        });
    });

    document.querySelectorAll('.btn-num').forEach(b => {
        b.addEventListener('click', () => {
            let val = parseInt(b.dataset.val);
            handleThrow(val * state.multiplier, (state.multiplier > 1 ? (state.multiplier === 3 ? "Triple " : "Double ") : "") + val);
        });
    });

    document.querySelector('.btn-bull').addEventListener('click', () => handleThrow(25, "25"));
    document.querySelector('.btn-bullseye').addEventListener('click', () => handleThrow(50, "BULLSEYE"));
    document.querySelector('.btn-miss').addEventListener('click', () => handleThrow(0, "Null"));
    document.getElementById('btn-reset').addEventListener('click', () => location.reload());

    function handleThrow(pts, speakText) {
        let p = state.players[state.currentPlayerIdx];
        speak(speakText);
        
        if (p.score - pts < 0 || p.score - pts === 1) {
            speak("Überworfen");
            state.currentTurnPoints.push("BUST");
            drawCanvas();
            setTimeout(nextTurn, 1000);
            return;
        }

        p.score -= pts;
        state.throwsInTurn++;
        state.currentTurnPoints.push(pts);
        
        updateUI(); drawCanvas(); updateCheckout();

        if (p.score === 0) {
            speak("Sieg für " + p.name);
            p.legs++;
            setTimeout(() => location.reload(), 3000);
            return;
        }

        if (state.throwsInTurn >= 3) {
            let sum = state.currentTurnPoints.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
            setTimeout(() => {
                speak(sum === 180 ? "ONE HUNDRED AND EIGHTY" : sum + " Punkte");
                nextTurn();
            }, 600);
        } else {
            resetMod();
        }
    }

    function nextTurn() {
        state.throwsInTurn = 0;
        state.currentTurnPoints = [];
        state.currentPlayerIdx = (state.currentPlayerIdx + 1) % state.players.length;
        resetMod(); updateUI(); drawCanvas(); updateCheckout();
    }

    function resetMod() {
        state.multiplier = 1;
        document.querySelectorAll('.btn-mod').forEach(x => x.classList.remove('active'));
        document.querySelector('.btn-mod[data-factor="1"]').classList.add('active');
        el.monitorMod.textContent = "Single";
    }

    function initScoreboard() {
        el.scoreboard.innerHTML = '';
        state.players.forEach((p, i) => {
            let div = document.createElement('div');
            div.className = 'player-panel';
            div.id = 'p-panel-' + i;
            div.innerHTML = `<h2>${p.name}</h2><div class="score-display" id="p-score-${i}">${p.score}</div><div class="legs-display">Legs: <span id="p-legs-${i}">0</span></div>`;
            el.scoreboard.appendChild(div);
        });
    }

    function updateUI() {
        state.players.forEach((p, i) => {
            document.getElementById('p-score-' + i).textContent = p.score;
            document.getElementById('p-legs-' + i).textContent = p.legs;
            document.getElementById('p-panel-' + i).classList.toggle('active', i === state.currentPlayerIdx);
        });
    }
});