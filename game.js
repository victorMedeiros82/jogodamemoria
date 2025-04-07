// Configurações iniciais
const gameState = {
    difficulty: 'normal',
    pairs: 15,
    timeLimit: 240,
    score: 0,
    level: 'normal',
    stage: 1,
    timeLeft: 0,
    timer: null,
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    soundsEnabled: true,
    musicEnabled: true,
    animationsEnabled: true,
    gameActive: false,
    icons: [
        'fa-apple-alt', 'fa-atom', 'fa-bell', 'fa-bolt', 'fa-bomb', 
        'fa-brain', 'fa-car', 'fa-cat', 'fa-cloud', 'fa-cog', 
        'fa-crown', 'fa-dragon', 'fa-feather', 'fa-fire', 'fa-flask', 
        'fa-football-ball', 'fa-gamepad', 'fa-gem', 'fa-ghost', 'fa-gift', 
        'fa-globe', 'fa-heart', 'fa-helicopter', 'fa-key', 'fa-leaf', 
        'fa-lemon', 'fa-magic', 'fa-moon', 'fa-mountain', 'fa-music', 
        'fa-paper-plane', 'fa-paw', 'fa-pizza-slice', 'fa-plane', 'fa-rocket', 
        'fa-snowflake', 'fa-star', 'fa-sun', 'fa-tree', 'fa-trophy', 
        'fa-umbrella', 'fa-utensils', 'fa-volleyball-ball', 'fa-water', 'fa-wine-glass'
    ],
    difficultySettings: {
        easy: { pairs: 5, timeLimit: 300, pointsPerStage: 5, stagesToNextLevel: 10 },
        normal: { pairs: 10, timeLimit: 240, pointsPerStage: 10, stagesToNextLevel: 15 },
        medium: { pairs: 15, timeLimit: 180, pointsPerStage: 15, stagesToNextLevel: 20 },
        hard: { pairs: 20, timeLimit: 120, pointsPerStage: 20, stagesToNextLevel: 25 }
    }
};

// Sons do jogo (usando Data URLs para sons genéricos)
const sounds = {
    flip: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'),
    match: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'),
    win: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'),
    lose: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'),
    background: new Audio('data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'),
    click: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...')
};

// Elementos do DOM
const screens = {
    initialLoading: document.getElementById('initial-loading'),
    mainMenu: document.getElementById('main-menu'),
    gameScreen: document.getElementById('game-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    winScreen: document.getElementById('win-screen')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    optionsBtn: document.getElementById('options-btn'),
    creditsBtn: document.getElementById('credits-btn'),
    backBtn: document.getElementById('back-btn'),
    gameBoard: document.getElementById('game-board'),
    levelDisplay: document.getElementById('level-display'),
    scoreDisplay: document.getElementById('score-display'),
    timeDisplay: document.getElementById('time-display'),
    stageDisplay: document.getElementById('stage-display'),
    progressBar: document.getElementById('progress-bar'),
    initLoadBar: document.getElementById('init-load-bar'),
    tryAgainBtn: document.getElementById('try-again-btn'),
    backToMenuBtn: document.getElementById('back-to-menu-btn'),
    nextLevelBtn: document.getElementById('next-level-btn'),
    backToMenuWinBtn: document.getElementById('back-to-menu-win-btn'),
    endLevel: document.getElementById('end-level'),
    endScore: document.getElementById('end-score'),
    endStage: document.getElementById('end-stage'),
    winLevel: document.getElementById('win-level'),
    winScore: document.getElementById('win-score'),
    nextLevel: document.getElementById('next-level')
};

const modals = {
    options: new bootstrap.Modal('#optionsModal'),
    credits: new bootstrap.Modal('#creditsModal')
};

const optionsElements = {
    difficultyBtns: document.querySelectorAll('.difficulty-btn'),
    soundToggle: document.getElementById('soundToggle'),
    musicToggle: document.getElementById('musicToggle'),
    animationsToggle: document.getElementById('animationsToggle'),
    saveOptionsBtn: document.getElementById('saveOptions')
};

// Inicialização do jogo
document.addEventListener('DOMContentLoaded', function() {
    // Simular carregamento inicial
    simulateInitialLoading();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Carregar configurações salvas
    loadSettings();
});

function simulateInitialLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        elements.initLoadBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                screens.initialLoading.classList.add('hidden');
                screens.mainMenu.classList.remove('hidden');
                
                // Tocar música de fundo se estiver habilitada
                if (gameState.musicEnabled) {
                    sounds.background.loop = true;
                    sounds.background.volume = 0.3;
                    sounds.background.play().catch(e => console.log("Autoplay blocked:", e));
                }
            }, 500);
        }
    }, 50);
}

function setupEventListeners() {
    // Botões principais
    elements.startBtn.addEventListener('click', startGame);
    elements.optionsBtn.addEventListener('click', showOptions);
    elements.creditsBtn.addEventListener('click', showCredits);
    elements.backBtn.addEventListener('click', returnToMenu);
    
    // Botões de game over/vitória
    elements.tryAgainBtn.addEventListener('click', tryAgain);
    elements.backToMenuBtn.addEventListener('click', returnToMenu);
    elements.nextLevelBtn.addEventListener('click', nextLevel);
    elements.backToMenuWinBtn.addEventListener('click', returnToMenu);
    
    // Opções
    optionsElements.saveOptionsBtn.addEventListener('click', saveOptions);
    
    optionsElements.difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            playSound('click');
            optionsElements.difficultyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            gameState.difficulty = this.dataset.difficulty;
        });
    });
}

function loadSettings() {
    const savedSettings = localStorage.getItem('memoryGameSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        gameState.difficulty = settings.difficulty || 'normal';
        gameState.soundsEnabled = settings.soundsEnabled !== false;
        gameState.musicEnabled = settings.musicEnabled !== false;
        gameState.animationsEnabled = settings.animationsEnabled !== false;
        
        // Atualizar UI com as configurações carregadas
        optionsElements.difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === gameState.difficulty) {
                btn.classList.add('active');
            }
        });
        
        optionsElements.soundToggle.checked = gameState.soundsEnabled;
        optionsElements.musicToggle.checked = gameState.musicEnabled;
        optionsElements.animationsToggle.checked = gameState.animationsEnabled;
    }
}

function saveSettings() {
    const settings = {
        difficulty: gameState.difficulty,
        soundsEnabled: gameState.soundsEnabled,
        musicEnabled: gameState.musicEnabled,
        animationsEnabled: gameState.animationsEnabled
    };
    localStorage.setItem('memoryGameSettings', JSON.stringify(settings));
}

function showOptions() {
    playSound('click');
    modals.options.show();
}

function showCredits() {
    playSound('click');
    modals.credits.show();
}

function saveOptions() {
    playSound('click');
    gameState.soundsEnabled = optionsElements.soundToggle.checked;
    gameState.musicEnabled = optionsElements.musicToggle.checked;
    gameState.animationsEnabled = optionsElements.animationsToggle.checked;
    
    // Atualizar música de fundo
    if (gameState.musicEnabled) {
        sounds.background.loop = true;
        sounds.background.volume = 0.3;
        sounds.background.play().catch(e => console.log("Music play blocked:", e));
    } else {
        sounds.background.pause();
    }
    
    saveSettings();
    modals.options.hide();
}

function startGame() {
    playSound('click');
    
    // Configurar o jogo baseado na dificuldade
    const settings = gameState.difficultySettings[gameState.difficulty];
    gameState.pairs = settings.pairs;
    gameState.timeLimit = settings.timeLimit;
    gameState.level = gameState.difficulty;
    gameState.stage = 1;
    gameState.score = 0;
    gameState.gameActive = true;
    
    // Atualizar displays
    elements.levelDisplay.textContent = `Nível: ${getLevelName(gameState.level)}`;
    elements.scoreDisplay.textContent = `Pontos: ${gameState.score}`;
    elements.stageDisplay.textContent = `Fase: ${gameState.stage}`;
    
    // Mostrar tela de jogo
    screens.mainMenu.classList.add('hidden');
    screens.gameScreen.classList.remove('hidden');
    
    // Preparar o jogo
    prepareGame();
    
    // Iniciar temporizador
    startTimer();
}

function prepareGame() {
    // Limpar tabuleiro
    elements.gameBoard.innerHTML = '';
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    
    // Atualizar barra de progresso
    updateProgressBar();
    
    // Selecionar ícones aleatórios para os pares
    const selectedIcons = [];
    const shuffledIcons = [...gameState.icons].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < gameState.pairs; i++) {
        selectedIcons.push(shuffledIcons[i]);
    }
    
    // Duplicar os ícones para formar pares
    const cardIcons = [...selectedIcons, ...selectedIcons];
    
    // Embaralhar os pares
    cardIcons.sort(() => 0.5 - Math.random());
    
    // Criar cartas
    cardIcons.forEach((icon, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.icon = icon;
        
        card.innerHTML = `
            <div class="card-face card-back">
                <i class="fas fa-question"></i>
            </div>
            <div class="card-face card-front">
                <i class="fas ${icon}"></i>
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        elements.gameBoard.appendChild(card);
        gameState.cards.push(card);
    });
    
    // Ajustar layout do tabuleiro baseado no número de cartas
    adjustBoardLayout();
}

function adjustBoardLayout() {
    // Calcula o número de colunas baseado no número de pares
    let columns;
    if (gameState.pairs <= 10) {
        columns = 5; // 5 colunas para até 10 pares (20 cartas)
    } else if (gameState.pairs <= 15) {
        columns = 6; // 6 colunas para até 15 pares (30 cartas)
    } else if (gameState.pairs <= 25) {
        columns = 8; // 8 colunas para até 25 pares (50 cartas)
    } else {
        columns = 10; // 10 colunas para 50 pares (100 cartas)
    }
    
    // Define o grid template columns
    elements.gameBoard.style.gridTemplateColumns = `repeat(${columns}, var(--card-size))`;
    
    // Centraliza o tabuleiro
    elements.gameBoard.style.justifyContent = 'center';
}

function flipCard() {
    // Não fazer nada se o jogo não estiver ativo ou já tiver 2 cartas viradas
    if (!gameState.gameActive || gameState.flippedCards.length === 2 || 
        this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }
    
    // Virar a carta
    this.classList.add('flipped');
    gameState.flippedCards.push(this);
    
    // Efeito visual
    if (gameState.animationsEnabled) {
        createSparkleEffect(this);
    }
    
    // Tocar som
    playSound('flip');
    
    // Verificar se duas cartas foram viradas
    if (gameState.flippedCards.length === 2) {
        setTimeout(checkForMatch, 500);
    }
}

function checkForMatch() {
    const [card1, card2] = gameState.flippedCards;
    const icon1 = card1.dataset.icon;
    const icon2 = card2.dataset.icon;
    
    if (icon1 === icon2) {
        // Par encontrado
        card1.classList.add('matched');
        card2.classList.add('matched');
        gameState.matchedPairs++;
        
        // Efeitos visuais
        if (gameState.animationsEnabled) {
            createSparkleEffect(card1, true);
            createSparkleEffect(card2, true);
        }
        
        // Tocar som de acerto
        playSound('match');
        
        // Atualizar progresso
        updateProgressBar();
        
        // Verificar se o jogo foi concluído
        if (gameState.matchedPairs === gameState.pairs) {
            completeStage();
        }
        
        // Limpar cartas viradas
        gameState.flippedCards = [];
    } else {
        // Não é um par - virar as cartas de volta após um delay
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            gameState.flippedCards = [];
        }, 1000);
    }
}

function updateProgressBar() {
    const progress = (gameState.matchedPairs / gameState.pairs) * 100;
    elements.progressBar.style.width = `${progress}%`;
}

function startTimer() {
    // Parar qualquer temporizador existente
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    gameState.timeLeft = gameState.difficultySettings[gameState.level].timeLimit;
    updateTimeDisplay();
    
    // Iniciar novo temporizador
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimeDisplay();
        
        if (gameState.timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

function updateTimeDisplay() {
    const minutes = Math.floor(gameState.timeLeft / 60);
    const seconds = gameState.timeLeft % 60;
    elements.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Mudar cor quando o tempo estiver acabando
    if (gameState.timeLeft <= 30) {
        elements.timeDisplay.style.color = 'var(--danger)';
    } else if (gameState.timeLeft <= 60) {
        elements.timeDisplay.style.color = 'var(--warning)';
    } else {
        elements.timeDisplay.style.color = 'inherit';
    }
}

function completeStage() {
    // Parar o temporizador
    clearInterval(gameState.timer);
    gameState.gameActive = false;
    
    // Adicionar pontos
    const pointsEarned = gameState.difficultySettings[gameState.level].pointsPerStage;
    gameState.score += pointsEarned;
    elements.scoreDisplay.textContent = `Pontos: ${gameState.score}`;
    
    // Tocar som de vitória
    playSound('win');
    
    // Criar efeito de confete
    if (gameState.animationsEnabled) {
        createConfetti();
    }
    
    // Verificar se o jogador avançou de nível
    const nextLevelThreshold = gameState.difficultySettings[gameState.level].stagesToNextLevel;
    if (gameState.stage >= nextLevelThreshold) {
        showWinScreen();
    } else {
        // Preparar próxima fase após um delay
        setTimeout(() => {
            gameState.stage++;
            gameState.gameActive = true;
            elements.stageDisplay.textContent = `Fase: ${gameState.stage}`;
            prepareGame();
            startTimer();
        }, 2000);
    }
}

function showWinScreen() {
    // Atualizar informações na tela de vitória
    elements.winLevel.textContent = getLevelName(gameState.level);
    elements.winScore.textContent = gameState.score;
    
    // Determinar próximo nível
    let nextLvl;
    if (gameState.level === 'easy') nextLvl = 'normal';
    else if (gameState.level === 'normal') nextLvl = 'medium';
    else if (gameState.level === 'medium') nextLvl = 'hard';
    else nextLvl = 'hard'; // Permanece no difícil
    
    elements.nextLevel.textContent = getLevelName(nextLvl);
    
    // Mostrar tela de vitória
    screens.gameScreen.classList.add('hidden');
    screens.winScreen.classList.remove('hidden');
}

function gameOver() {
    // Parar o temporizador
    clearInterval(gameState.timer);
    gameState.gameActive = false;
    
    // Atualizar informações na tela de game over
    elements.endLevel.textContent = getLevelName(gameState.level);
    elements.endScore.textContent = gameState.score;
    elements.endStage.textContent = gameState.stage;
    
    // Tocar som de derrota
    playSound('lose');
    
    // Mostrar tela de game over
    screens.gameScreen.classList.add('hidden');
    screens.gameOverScreen.classList.remove('hidden');
}

function tryAgain() {
    playSound('click');
    screens.gameOverScreen.classList.add('hidden');
    screens.gameScreen.classList.remove('hidden');
    
    // Reiniciar o jogo com as mesmas configurações
    gameState.stage = 1;
    gameState.score = 0;
    gameState.gameActive = true;
    
    elements.scoreDisplay.textContent = `Pontos: ${gameState.score}`;
    elements.stageDisplay.textContent = `Fase: ${gameState.stage}`;
    
    prepareGame();
    startTimer();
}

function nextLevel() {
    playSound('click');
    
    // Determinar próximo nível
    if (gameState.level === 'easy') gameState.level = 'normal';
    else if (gameState.level === 'normal') gameState.level = 'medium';
    else if (gameState.level === 'medium') gameState.level = 'hard';
    // Se já estiver no difícil, permanece no difícil
    
    // Reiniciar estágio e pontuação
    gameState.stage = 1;
    gameState.score = 0;
    gameState.gameActive = true;
    
    // Atualizar displays
    elements.levelDisplay.textContent = `Nível: ${getLevelName(gameState.level)}`;
    elements.scoreDisplay.textContent = `Pontos: ${gameState.score}`;
    elements.stageDisplay.textContent = `Fase: ${gameState.stage}`;
    
    // Mostrar tela de jogo
    screens.winScreen.classList.add('hidden');
    screens.gameScreen.classList.remove('hidden');
    
    // Preparar novo nível
    prepareGame();
    startTimer();
}

function returnToMenu() {
    playSound('click');
    
    // Parar qualquer temporizador
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    // Parar música de fundo
    sounds.background.pause();
    
    // Esconder todas as telas exceto o menu
    Object.values(screens).forEach(screen => {
        if (screen !== screens.mainMenu) {
            screen.classList.add('hidden');
        }
    });
    
    // Mostrar menu principal
    screens.mainMenu.classList.remove('hidden');
    
    // Tocar música de fundo se estiver habilitada
    if (gameState.musicEnabled) {
        sounds.background.play().catch(e => console.log("Autoplay blocked:", e));
    }
}

function getLevelName(level) {
    const names = {
        easy: 'Fácil',
        normal: 'Normal',
        medium: 'Médio',
        hard: 'Difícil'
    };
    return names[level] || level;
}

function playSound(sound) {
    if (!gameState.soundsEnabled) return;
    
    try {
        sounds[sound].currentTime = 0;
        sounds[sound].play().catch(e => console.log("Sound play blocked:", e));
    } catch (e) {
        console.log("Error playing sound:", e);
    }
}

function createConfetti() {
    if (!gameState.animationsEnabled) return;
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Posição aleatória na horizontal
        confetti.style.left = `${Math.random() * 100}vw`;
        
        // Cor aleatória
        const colors = ['#6a5acd', '#9370db', '#ff8c00', '#4caf50', '#00bcd4'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Tamanho aleatório
        const size = Math.random() * 15 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Delay de animação aleatório
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        
        document.body.appendChild(confetti);
        
        // Remover após a animação terminar
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function createSparkleEffect(element, isMatch = false) {
    if (!gameState.animationsEnabled) return;
    
    const rect = element.getBoundingClientRect();
    const colors = isMatch ? ['#4caf50', '#2e7d32', '#a5d6a7'] : ['#ff8c00', '#6a5acd', '#9370db'];
    
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Posição aleatória dentro do elemento
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.style.left = `${rect.left + x}px`;
        sparkle.style.top = `${rect.top + y}px`;
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(sparkle);
        
        // Remover após a animação terminar
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}