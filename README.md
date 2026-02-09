# Dart
🎯 PRO DARTS SCORER
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pro Darts Scorer</title>
    <style>
        /* CSS BEREICH */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #121212; color: #e0e0e0; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; }
        .hidden { display: none !important; }
        header { background: #1f1f1f; padding: 15px; text-align: center; border-bottom: 2px solid #333; }
        main { flex: 1; padding: 10px; max-width: 600px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; }
        .card { background: #1e1e1e; padding: 20px; border-radius: 8px; border: 1px solid #333; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; color: #888; margin-bottom: 5px; }
        .row { display: flex; gap: 8px; }
        input { background: #2c2c2c; border: 1px solid #444; color: white; padding: 10px; border-radius: 4px; flex: 1; }
        .btn-action { background: #1976d2; color: white; border: none; padding: 0 15px; font-size: 1.2rem; cursor: pointer; }
        .player-list-container { margin: 10px 0; background: #252525; padding: 10px; border-radius: 4px; }
        #added-players-list li { background: #333; padding: 8px; margin-bottom: 3px; border-left: 3px solid #4caf50; list-style: none; }
        .btn-select { flex: 1; padding: 10px; background: #333; border: 1px solid #444; color: #aaa; cursor: pointer; }
        .btn-select.active { background: #4caf50; color: white; }
        #btn-start { width: 100%; padding: 15px; background: #4caf50; color: white; border: none; font-weight: bold; cursor: pointer; }
        #btn-start:disabled { background: #444; cursor: not-allowed; }
        #scoreboard { display: flex; gap: 10px; margin-bottom: 10px; overflow-x: auto; }
        .player-panel { flex: 1; background: #1e1e1e; text-align: center; opacity: 0.4; padding: 10px; border-radius: 6px; min-width: 120px; border: 1px solid transparent; }
        .player-panel.active { opacity: 1; background: #252525; border: 1px solid #4caf50; }
        .score-display { font-size: 2.5rem; font-weight: bold; }
        #checkout-suggestion { background: #0288d1; padding: 10px; text-align: center; border-radius: 4px; font-weight: bold; margin-bottom: 10px; color: white; font-size: 1.2rem; }
        #display-wrapper { background: #000; padding: 10px; border-radius: 4px; margin-bottom: 10px; border: 1px solid #333; }
        #monitor { border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px; text-align: center; color: #00e676; font-family: monospace; }
        .grid-20 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin-bottom: 10px; }
        button { border: none; border-radius: 4px; cursor: pointer; color: white; font-weight: bold; }
        .btn-mod { background: #424242; padding: 10px 0; }
        .btn-mod.active { background: #ff9800; color: black; }
        .btn-num { background: #303030; padding: 15px 0; }
        .btn-bull { background: #388e3c; flex: 1; padding: 15px 0; }
        .btn-bullseye { background: #d32f2f; flex: 1; }
        .btn-miss { background: #555; flex: 1; }
        .btn-reset { background: #b71c1c; flex: 1; }
    </style>
</head>
<body>

    <header><h1>🎯 PRO DARTS SCORER</h1></header>

    <main>
        <section id="setup-screen">
            <div class="card">
                <div class="form-group">
                    <label>Punkte</label>
                    <div class="row">
                        <button class="btn-select active" data-value="501">501</button>
                        <button class="btn-select" data-value="301">301</button>
                        <input type="number" id="custom-score-input" placeholder="Manuell">
                    </div>
                </div>
                <div class="form-group">
                    <label>Spieler hinzufügen</label>
                    <div class="row">
                        <input type="text" id="new-player-name" placeholder="Name...">
                        <button id="btn-add-player" class="btn-action">+</button>
                    </div>
                </div>
                <div class="player-list-container"><ul id="added-players-list"></ul></div>
                <button id="btn-start" disabled>SPIEL STARTEN</button>
            </div>
        </section>

        <section id="game-screen" class="hidden">
            <div id="scoreboard"></div>
            <div id="checkout-suggestion" class="hidden">Weg: <span id="suggestion-path">-</span></div>
            <div id="controls">
                <div id="display-wrapper">
                    <div id="monitor">Wurf: <span id="monitor-mod">Single</span> <span id="monitor-val">-</span></div>
                    <canvas id="dart-canvas" width="300" height="80"></canvas>
                </div>
                <div class="row">
                    <button class="btn-mod active" data-factor="1">Single</button>
                    <button class="btn-mod" data-factor="2">Double</button>
                    <button class="btn-mod" data-factor="3">Triple</button>
                </div>
                <div class="grid-20">
                    <button class="btn-num" data-val="1">1</button><button class="btn-num" data-val="2">2</button><button class="btn-num" data-val="3">3</button><button class="btn-num" data-val="4">4</button><button class="btn-num" data-val="5">5</button><button class="btn-num" data-val="6">6</button><button class="btn-num" data-val="7">7</button><button class="btn-num" data-val="8">8</button><button class="btn-num" data-val="9">9</button><button class="btn-num" data-val="10">10</button><button class="btn-num" data-val="11">11</button><button class="btn-num" data-val="12">12</button><button class="btn-num" data-val="13">13</button><button class="btn-num" data-val="14">14</button><button class="btn-num" data-val="15">15</button><button class="btn-num" data-val="16">16</button><button class="btn-num" data-val="17">17</button><button class="btn-num" data-val="18">18</button><button class="btn-num" data-val="19">19</button><button class="btn-num" data-val="20">20</button>
                </div>
                <div class="row">
                    <button class="btn-bull" data-val="25">25</button>
                    <button class="btn-bullseye" data-val="50">BULL</button>
                    <button class="btn-miss" data-val="0">MISS</button>
                    <button class="btn-reset" id="btn-reset">ABBRUCH</button>
                </div>
            </div>
        </section>
    </main>

    <script>
        /* JAVASCRIPT BEREICH */
        document.addEventListener('DOMContentLoaded', () => {
            let state = { startScore: 501, players: [], currentPlayerIdx: 0, throwsInTurn: 0, currentTurnPoints: [], multiplier: 1 };
            const synth = window.speechSynthesis;
            const canvas = document.getElementById('dart-canvas');
            const ctx = canvas.getContext('2d');
            const el = {
                setup: document.getElementById('setup-screen'), game: document.getElementById('game-screen'),
                inputName: document.getElementById('new-player-name'), btnAdd: document.getElementById('btn-add-player'),
                list: document.getElementById('added-players-list'), btnStart: document.getElementById('btn-start'),
                scoreboard: document.getElementById('scoreboard'), monitorMod: document.getElementById('monitor-mod'),
                monitorVal: document.getElementById('monitor-val'), checkoutBox: document.getElementById('checkout-suggestion'),
                checkoutPath: document.getElementById('suggestion-path'), customScore: document.getElementById('custom-score-input')
            };

            function speak(text) { if (synth.speaking) synth.cancel(); const utter = new SpeechSynthesisUtterance(text); utter.lang = 'de-DE'; synth.speak(utter); }
            function drawCanvas() {
                ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "#fff"; ctx.font = "14px monospace"; ctx.textAlign = "center";
                let sum = 0; for (let i = 0; i < 3; i++) {
                    let val = state.currentTurnPoints[i] !== undefined ? state.currentTurnPoints[i] : "-";
                    if (typeof val === 'number') sum += val; ctx.strokeRect(20 + i * 95, 10, 70, 25); ctx.fillText(val, 55 + i * 95, 28);
                }
                ctx.fillStyle = "#00e676"; ctx.font = "bold 18px monospace"; ctx.fillText("AUFNAHME: " + sum, canvas.width / 2, 65);
            }
            function updateCheckout() {
                let score = state.players[state.currentPlayerIdx].score; let dartsLeft = 3 - state.throwsInTurn;
                if (score > 170 || score <= 1) { el.checkoutBox.classList.add('hidden'); return; }
                let path = calculateDartsPath(score, dartsLeft);
                if (path) { el.checkoutPath.textContent = path.join(" → "); el.checkoutBox.classList.remove('hidden'); }
            }
            function calculateDartsPath(score, darts) {
                let res = []; let temp = score; for (let i = 0; i < darts; i++) {
                    if (temp <= 0) break; if (temp <= 40 && temp % 2 === 0) { res.push("D" + (temp / 2)); temp = 0; }
                    else if (temp === 50) { res.push("BULL"); temp = 0; }
                    else { let b = getBest(temp); res.push(b.l); temp -= b.v; }
                } return res.length > 0 ? res : null;
            }
            function getBest(s) { if (s > 60) return { l: "T20", v: 60 }; if (s > 40) return { l: "S" + (s - 40), v: (s - 40) }; return { l: "S" + (s % 2 === 0 ? 2 : 1), v: (s % 2 === 0 ? 2 : 1) }; }
            el.btnAdd.addEventListener('click', () => {
                let n = el.inputName.value.trim(); if (!n) return;
                state.players.push({ name: n, score: state.startScore, legs: 0 });
                let li = document.createElement('li'); li.textContent = n; el.list.appendChild(li);
                el.inputName.value = ''; el.btnStart.disabled = false;
            });
            el.btnStart.addEventListener('click', () => {
                if (el.customScore.value) state.startScore = parseInt(el.customScore.value);
                state.players.forEach(p => p.score = state.startScore);
                el.setup.classList.add('hidden'); el.game.classList.remove('hidden');
                initScoreboard(); updateUI(); drawCanvas(); updateCheckout(); speak("Spiel gestartet.");
            });
            document.querySelectorAll('.btn-mod').forEach(b => {
                b.addEventListener('click', () => {
                    document.querySelectorAll('.btn-mod').forEach(x => x.classList.remove('active'));
                    b.classList.add('active'); state.multiplier = parseInt(b.dataset.factor);
                    el.monitorMod.textContent = b.textContent;
                });
            });
            document.querySelectorAll('.btn-num').forEach(b => { b.addEventListener('click', () => { let v = parseInt(b.dataset.val); handleThrow(v * state.multiplier, (state.multiplier > 1 ? (state.multiplier === 3 ? "Triple " : "Double ") : "") + v); }); });
            document.querySelector('.btn-bull').addEventListener('click', () => handleThrow(25, "25"));
            document.querySelector('.btn-bullseye').addEventListener('click', () => handleThrow(50, "BULLSEYE"));
            document.querySelector('.btn-miss').addEventListener('click', () => handleThrow(0, "Null"));
            document.getElementById('btn-reset').addEventListener('click', () => location.reload());

            function handleThrow(pts, txt) {
                let p = state.players[state.currentPlayerIdx]; speak(txt);
                if (p.score - pts < 0 || p.score - pts === 1) { speak("Bust"); state.currentTurnPoints.push("BUST"); drawCanvas(); setTimeout(nextTurn, 1000); return; }
                p.score -= pts; state.throwsInTurn++; state.currentTurnPoints.push(pts); updateUI(); drawCanvas(); updateCheckout();
                if (p.score === 0) { speak("Sieg"); p.legs++; setTimeout(() => location.reload(), 3000); return; }
                if (state.throwsInTurn >= 3) { let sum = state.currentTurnPoints.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0); setTimeout(() => { speak(sum === 180 ? "One Hundred and Eighty" : sum + " Punkte"); nextTurn(); }, 600); } else { resetMod(); }
            }
            function nextTurn() { state.throwsInTurn = 0; state.currentTurnPoints = []; state.currentPlayerIdx = (state.currentPlayerIdx + 1) % state.players.length; resetMod(); updateUI(); drawCanvas(); updateCheckout(); }
            function resetMod() { state.multiplier = 1; document.querySelectorAll('.btn-mod').forEach(x => x.classList.remove('active')); document.querySelector('.btn-mod[data-factor="1"]').classList.add('active'); el.monitorMod.textContent = "Single"; }
            function initScoreboard() {
                el.scoreboard.innerHTML = ''; state.players.forEach((p, i) => {
                    let d = document.createElement('div'); d.className = 'player-panel'; d.id = 'p-panel-' + i;
                    d.innerHTML = `<h2>${p.name}</h2><div class="score-display" id="p-score-${i}">${p.score}</div><div class="legs-display">Legs: <span id="p-legs-${i}">0</span></div>`;
                    el.scoreboard.appendChild(d);
                });
            }
            function updateUI() { state.players.forEach((p, i) => { document.getElementById('p-score-' + i).textContent = p.score; document.getElementById('p-legs-' + i).textContent = p.legs; document.getElementById('p-panel-' + i).classList.toggle('active', i === state.currentPlayerIdx); }); }
        });
    </script>
</body>
</html>
