// ==========================================
// REGISTRASI SERVICE WORKER (PWA & OFFLINE)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((reg) => console.log('PWA Service Worker terdaftar sukses!', reg.scope))
            .catch((err) => console.error('PWA Service Worker gagal didaftarkan:', err));
    });
}

// ==========================================
// KONFIGURASI USER & NAVIGASI
// ==========================================
const USERS = {
    "Membervip": "123",
    "RyzziSiber": "999"
};

function navigateToTab(tabName) {
    document.querySelectorAll('.menu-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    if(tabName === 'home') {
        document.getElementById('page-home').classList.add('active');
        document.getElementById('nav-home').classList.add('active');
    } else if(tabName === 'stats') {
        document.getElementById('page-stats').classList.add('active');
        document.getElementById('nav-stats').classList.add('active');
    } else if(tabName === 'profile') {
        document.getElementById('page-profile').classList.add('active');
        document.getElementById('nav-profile').classList.add('active');
    }
}

function navigateToPage(pageId) {
    document.querySelectorAll('.menu-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById('page-' + pageId).classList.add('active');
    document.getElementById('nav-tools').classList.add('active');
}

// ==========================================
// SISTEM LOGIN & LOGOUT
// ==========================================
function handleLogin() {
    const userInp = document.getElementById('username').value.trim();
    const passInp = document.getElementById('password').value.trim();

    if (USERS[userInp] && USERS[userInp] === passInp) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        
        document.getElementById('profile-name').textContent = userInp;
        if(userInp === 'RyzziSiber') {
            document.getElementById('profile-role').textContent = "USER ADMIN";
        } else {
            document.getElementById('profile-role').textContent = "USER MEMBER";
        }
        
        if (!isPlaying) { toggleMusic(); }
        addHistoryLog("Login berhasil sebagai " + userInp);
    } else {
        alert("Username atau Password yang anda masukkan salah!");
    }
}

function handleLogout() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
}

// ==========================================
// SPLASH SCREEN & LOADING TIMER
// ==========================================
let detik = 10;
const splash = document.getElementById('splash-screen');
const loginScreen = document.getElementById('login-screen');
const progress = document.getElementById('progress-bar');
const countdown = document.getElementById('countdown');

const timer = setInterval(() => {
    detik--;
    progress.style.width = ((10 - detik) / 10 * 100) + '%';
    countdown.textContent = 'SISA WAKTU: ' + detik + ' DETIK';
    if (detik <= 0) {
        clearInterval(timer);
        progress.style.width = '100%';
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            loginScreen.classList.remove('hidden');
        }, 500);
    }
}, 1000);

// ==========================================
// BACKGOUND MUSIC CONTROLLER
// ==========================================
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.style.color = '#ff0000';
        musicIcon.style.animation = 'none';
        isPlaying = false;
    } else {
        bgMusic.play().catch(() => {});
        musicIcon.style.color = '#ff0000';
        musicIcon.style.animation = 'music-pulse 0.5s infinite alternate';
        isPlaying = true;
    }
}

// ==========================================
// SPAMMER TELEGRAM ENGINE
// ==========================================
function setCount(count) {
    document.getElementById('spam-count').value = count;
    document.querySelectorAll('.count-btn').forEach(btn => {
        if (parseInt(btn.textContent) === count) {
            btn.classList.add('active');
            btn.style.setProperty('color', '#000000', 'important');
        } else {
            btn.classList.remove('active');
            btn.style.setProperty('color', '#ffffff', 'important');
        }
    });
}
setCount(20);

const terminal = document.getElementById('terminal');
const startBtn = document.getElementById('start-btn');

function logToTerminal(text, type) {
    const span = document.createElement('span');
    span.className = 'log-line';
    if (type === 'success') span.classList.add('log-success');
    else if (type === 'error') span.classList.add('log-error');
    else if (type === 'warn') span.classList.add('log-warn');
    span.textContent = '[' + new Date().toLocaleTimeString() + '] ' + text;
    terminal.appendChild(span);
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    terminal.innerHTML = '<span class="log-muted">Terminal dibersihkan...</span>';
}

async function startSpam() {
    const token = document.getElementById('bot-token').value.trim();
    const target = document.getElementById('target-id').value.trim();
    const msg = document.getElementById('spam-message').value.trim();
    const count = parseInt(document.getElementById('spam-count').value);

    if (!token || !target || !msg) {
        logToTerminal('❌ Semua form wajib diisi!', 'error');
        return;
    }

    startBtn.disabled = true;
    startBtn.textContent = 'PROSES...';
    document.body.classList.add('lag-effect', 'pointer-events-none');
    clearTerminal();
    logToTerminal('🚀 Mulai spam ' + count + ' pesan', 'warn');
    await sleep(500);

    let ok = 0, fail = 0;
    for (let i = 1; i <= count; i++) {
        await sleep(Math.random() * 80 + 40);
        try {
            const res = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: target, text: msg })
            });
            const data = await res.json();
            if (data.ok) { ok++; logToTerminal('✅ [' + i + '/' + count + '] Berhasil', 'success'); }
            else { fail++; logToTerminal('❌ [' + i + '/' + count + '] Gagal: ' + data.description, 'error'); }
        } catch (e) {
            fail++;
            logToTerminal('⚠️ [' + i + '/' + count + '] Error: ' + e.message, 'error');
        }
    }

    document.body.classList.remove('lag-effect', 'pointer-events-none');
    startBtn.disabled = false;
    startBtn.textContent = 'MULAI SPAM';
    logToTerminal('━━━ SUKSES: ' + ok + ' | GAGAL: ' + fail + ' ━━━', 'warn');
    addHistoryLog("Melakukan Spam Tele sebanyak " + count + " ke ID " + target);
}

// ==========================================
// WHATSAPP BUG ENGINE (VIRTEX)
// ==========================================
const bugTerminal = document.getElementById('bug-terminal');
let bugMode = 1;

const VIRTEX = {
    1: '⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿\n[VIRTEX FORCLOSE]',
    2: '꧁༺RYZZI CRASHER༻꧂\n꧁༺RYZZI CRASHER༻꧂\n꧁༺RYZZI CRASHER༻꧂\n꧁༺RYZZI CRASHER༻꧂\n꧁༺RYZZI CRASHER༻꧂\n[VIRTEX BEKU]',
    3: '꧁༺RYZZI EXTREME༻꧂\n꧁༺RYZZI EXTREME༻꧂\n꧁༺RYZZI EXTREME༻꧂\n꧁༺RYZZI EXTREME༻꧂\n[VIRTEX EXTREME]'
};

function setBugMode(mode) {
    bugMode = mode;
    document.querySelectorAll('.bug-btn').forEach(b => {
        b.classList.remove('active');
        b.style.setProperty('color', '#ffffff', 'important');
    });
    const activeBtn = document.getElementById('bug-' + mode);
    if(activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.setProperty('color', '#000000', 'important');
    }
    
    document.getElementById('bug-mode').value = mode;
    const names = ['', 'FORCLOSE 🔥', 'BEKU ❄️', 'EXTREME 💀'];
    logBugTerminal('📌 Mode: ' + names[mode], 'warn');
}
setTimeout(() => { setBugMode(1); }, 100);

function logBugTerminal(text, type) {
    const span = document.createElement('span');
    span.className = 'log-line';
    if (type === 'success') span.classList.add('log-success');
    else if (type === 'error') span.classList.add('log-error');
    else if (type === 'warn') span.classList.add('log-warn');
    span.textContent = '[' + new Date().toLocaleTimeString() + '] ' + text;
    bugTerminal.appendChild(span);
    bugTerminal.scrollTop = bugTerminal.scrollHeight;
}

function clearBugTerminal() {
    bugTerminal.innerHTML = '<span class="log-muted">Terminal dibersihkan...</span>';
}

function sendBug() {
    const nomor = document.getElementById('bug-target').value.trim();
    if (!nomor) {
        logBugTerminal('❌ Masukkan nomor target!', 'error');
        return;
    }
    const virtex = VIRTEX[bugMode] || VIRTEX[1];
    const url = 'https://wa.me/' + nomor + '?text=' + encodeURIComponent(virtex);
    
    logBugTerminal('📤 Mengirim bug ke ' + nomor + '...', 'warn');
    logBugTerminal('📌 Mode: ' + ['', 'FORCLOSE', 'BEKU', 'EXTREME'][bugMode], 'warn');
    logBugTerminal('✅ Membuka WhatsApp...', 'success');
    
    window.open(url, '_blank');
    addHistoryLog("Kirim Bug WA Mode " + bugMode + " ke nomor " + nomor);
}

// ==========================================
// RIWAYAT AKTIVITAS (HISTORY LOG)
// ==========================================
const historyContainer = document.getElementById('history-container');
function addHistoryLog(activityText) {
    const emptyMsg = historyContainer.querySelector('.empty-history');
    if(emptyMsg) { emptyMsg.remove(); }

    const logDiv = document.createElement('div');
    logDiv.style.background = '#0a0a0a';
    logDiv.style.border = '1px solid #550000';
    logDiv.style.padding = '12px';
    logDiv.style.borderRadius = '12px';
    logDiv.style.marginBottom = '10px';
    logDiv.style.fontSize = '12px';
    logDiv.style.display = 'flex';
    logDiv.style.justifyContent = 'space-between';

    const txtSpan = document.createElement('span');
    txtSpan.textContent = activityText;
    txtSpan.style.color = '#ff3333';

    const timeSpan = document.createElement('span');
    timeSpan.textContent = new Date().toLocaleTimeString();
    timeSpan.style.color = '#883333';

    logDiv.appendChild(txtSpan);
    logDiv.appendChild(timeSpan);
    historyContainer.insertBefore(logDiv, historyContainer.firstChild);
}

function clearHistory() {
    historyContainer.innerHTML = '<div class="empty-history">No history yet :3</div>';
}

// Helper Utility
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
