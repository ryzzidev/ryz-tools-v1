// --- KONFIGURASI LOADING 10 DETIK ---
const totalTime = 10; 
let remainingTime = totalTime;
const splashScreen = document.getElementById('splash-screen');
const mainMenu = document.getElementById('main-menu');
const progressBar = document.getElementById('progress-bar');
const countdownElement = document.getElementById('countdown');
const appBody = document.getElementById('app-body');

const loadingInterval = setInterval(() => {
    remainingTime--;
    
    // Update progress bar
    const progressPercent = ((totalTime - remainingTime) / totalTime) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Update teks countdown
    const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
    const seconds = (remainingTime % 60).toString().padStart(2, '0');
    countdownElement.textContent = `SISA WAKTU: ${minutes}:${seconds}`;

    if (remainingTime <= 0) {
        clearInterval(loadingInterval);
        entryApp();
    }
}, 1000);

function entryApp() {
    splashScreen.classList.add('opacity-0');
    setTimeout(() => {
        splashScreen.style.display = 'none';
        mainMenu.classList.remove('hidden');
    }, 500);
}

// --- SELEKSI JUMLAH SPAM ---
function setCount(count) {
    document.getElementById('spam-count').value = count;
    const buttons = document.querySelectorAll('.count-btn');
    buttons.forEach(btn => {
        if(parseInt(btn.textContent) === count) {
            btn.classList.remove('bg-neutral-900', 'border-neutral-800', 'text-white');
            btn.classList.add('bg-white', 'text-black', 'border-white');
        } else {
            btn.classList.remove('bg-white', 'text-black', 'border-white');
            btn.classList.add('bg-neutral-900', 'border-neutral-800', 'text-white');
        }
    });
}
// Set default pilihan pertama ke 20
setCount(20);

// --- FITUR LOGO LAGU / MUSIK ---
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.style.color = '#ffffff';
        musicIcon.style.animation = 'none';
        isPlaying = false;
    } else {
        bgMusic.play().catch(err => console.log("User interaction required"));
        musicIcon.style.color = '#10b981';
        musicIcon.style.animation = 'music-pulse 0.5s infinite alternate';
        isPlaying = true;
    }
}

// --- LOGIKA TERMINAL & SPAM ENGINE ---
const terminal = document.getElementById('terminal');
const startBtn = document.getElementById('start-btn');

function logToTerminal(text, type = 'info') {
    const span = document.createElement('span');
    span.className = 'block';
    
    if (type === 'success') span.classList.add('text-emerald-400');
    else if (type === 'error') span.classList.add('text-rose-500');
    else if (type === 'warn') span.classList.add('text-amber-400');
    else span.classList.add('text-neutral-400');
    
    const timestamp = new Date().toLocaleTimeString();
    span.textContent = `[${timestamp}] ${text}`;
    
    terminal.appendChild(span);
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    terminal.innerHTML = '<span class="text-neutral-600">Terminal dibersihkan...</span>';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function startSpam() {
    const token = document.getElementById('bot-token').value.trim();
    const targetId = document.getElementById('target-id').value.trim();
    const message = document.getElementById('spam-message').value.trim();
    const count = parseInt(document.getElementById('spam-count').value);

    if (!token || !targetId || !message) {
        logToTerminal('Gagal: Semua input form wajib diisi!', 'error');
        return;
    }

    startBtn.disabled = true;
    startBtn.textContent = 'PROSES SPAM...';
    appBody.classList.add('lag-effect', 'pointer-events-none');
    clearTerminal();
    
    logToTerminal(`Menginisialisasi serangan spam sebanyak ${count} pesan...`, 'warn');
    await sleep(800); 

    for (let i = 1; i <= count; i++) {
        const lagTime = Math.floor(Math.random() * 50) + 50; 
        await sleep(lagTime);

        try {
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: targetId,
                    text: message
                })
            });

            const data = await response.json();

            if (data.ok) {
                logToTerminal(`[${i}/${count}] Sukses mengirim teks spam ke -> ${targetId}`, 'success');
            } else {
                logToTerminal(`[${i}/${count}] Gagal API: ${data.description}`, 'error');
            }
        } catch (err) {
            logToTerminal(`[${i}/${count}] Jaringan Error / Gagal mengirim`, 'error');
        }
    }

    appBody.classList.remove('lag-effect', 'pointer-events-none');
    startBtn.disabled = false;
    startBtn.textContent = 'MULAI SPAM';
    logToTerminal('== PROSES EKSEKUSI SELESAI ==', 'warn');
}