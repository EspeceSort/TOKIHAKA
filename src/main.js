import '../Tsukuyomi/tsukuyomi.es.js';
import { Timer } from './timer.js';
import html2canvas from 'html2canvas';

// Tsukuyomi auto-initializes on DOMContentLoaded

const timerDisplay = document.getElementById('timer-display');
const sessionStatus = document.getElementById('session-status');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const completedSessionsDisplay = document.getElementById('completed-sessions');
const tkToasts = document.getElementById('tk-toasts');

// New Share Buttons
const shareXBtn = document.getElementById('share-x-btn');
const shareFbBtn = document.getElementById('share-fb-btn');
const shareLineBtn = document.getElementById('share-line-btn');
const shareCopyBtn = document.getElementById('share-copy-btn');
const shareDownloadBtn = document.getElementById('share-download-btn');

// For Image Sharing Card
const shareCardSessions = document.getElementById('share-card-sessions');
const shareCardMinutes = document.getElementById('share-card-minutes');
const shareCard = document.getElementById('share-card');

let completedSessions = 0;
let totalWorkMinutes = 0;

function showToast(title, message, isAccent = false) {
    const toast = document.createElement('div');
    toast.className = `tk-toast ${isAccent ? 'tk-toast-accent' : ''}`;
    toast.innerHTML = `
        <button class="tk-toast-close" onclick="this.parentElement.remove()">&times;</button>
        <div style="font-weight:bold;margin-bottom:4px;color:var(--tk-color-${isAccent ? 'accent' : 'primary'})">${title}</div>
        <div>${message}</div>
    `;
    tkToasts.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        setTimeout(() => toast.classList.add('is-active'), 50);
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('is-active');
        setTimeout(() => toast.remove(), 400); // Wait for transition
    }, 5000);
}

function notifyUser(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
    }
}

function renderTimerText(timeString) {
    const chars = timeString.split('');
    const html = chars.map(char => {
        // Increase width for more spacing between characters
        const width = char === ':' ? '0.5em' : '0.8em';
        return `<span style="display:inline-block; width:${width}; text-align:center;">${char}</span>`;
    }).join('');
    timerDisplay.innerHTML = html;
}

// Initial render to prevent jump on first tick
renderTimerText('25:00');

const timer = new Timer({
    onTick: (timeString) => {
        renderTimerText(timeString);
        document.title = `${timeString} - TOKIHAKA`;
    },
    onModeChange: (isWorkMode) => {
        sessionStatus.textContent = isWorkMode ? '作業中' : '休憩中';
        sessionStatus.className = `tk-badge tk-mb-md ${isWorkMode ? 'tk-badge-outline' : 'tk-badge-outline tk-badge-accent'}`;

        if (!isWorkMode) {
            completedSessions++;
            totalWorkMinutes += 25;
            completedSessionsDisplay.textContent = completedSessions;
            showToast('作業完了', 'お疲れ様でした！5分間の休憩に入ります。');
            notifyUser('TOKIHAKA - 作業完了', 'お疲れ様でした！5分間の休憩に入ります。');
        } else {
            showToast('休憩終了', '休憩終わり！作業を再開します。', true);
            notifyUser('TOKIHAKA - 休憩終了', '休憩終わり！作業を再開します。');
        }
    }
});

startBtn.addEventListener('click', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    timer.start();
    startBtn.disabled = true;
    sessionStatus.textContent = timer.isWorkMode ? '作業中' : '休憩中';
    sessionStatus.className = `tk-badge tk-mb-md ${timer.isWorkMode ? 'tk-badge-outline' : 'tk-badge-outline tk-badge-accent'}`;
});

stopBtn.addEventListener('click', () => {
    timer.reset();
    startBtn.disabled = false;
    sessionStatus.textContent = '待機中';
    sessionStatus.className = 'tk-badge tk-badge-outline tk-mb-md';
    document.title = 'TOKIHAKA - Pomodoro Timer';
});

function getShareText() {
    return `今日の作業結果！\n【TOKIHAKA】ポモドーロタイマー\n完了: ${completedSessions}セッション\n合計作業時間: ${totalWorkMinutes}分\n#TOKIHAKA\n`;
}

function getAppUrl() {
    return 'https://especesort.github.io/TOKIHAKA/'; // Change this to actual URL if deployed elsewhere
}

// 1. X (Twitter)
shareXBtn.addEventListener('click', () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getAppUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
});

// 2. Facebook
shareFbBtn.addEventListener('click', () => {
    const url = encodeURIComponent(getAppUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
});

// 3. LINE
shareLineBtn.addEventListener('click', () => {
    const text = encodeURIComponent(getShareText() + '\n' + getAppUrl());
    window.open(`https://line.me/R/msg/text/?${text}`, '_blank', 'width=600,height=500');
});

// 4. Text Copy
shareCopyBtn.addEventListener('click', () => {
    const text = getShareText() + '\n' + getAppUrl();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('コピー完了', 'クリップボードにコピーしました！');
        }).catch(() => showToast('エラー', 'コピーに失敗しました', true));
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('コピー完了', 'クリップボードにコピーしました！');
        } catch {
            showToast('エラー', 'コピーに失敗しました', true);
        }
        document.body.removeChild(textarea);
    }
});

// 5. Image Download (For Instagram etc.)
shareDownloadBtn.addEventListener('click', async () => {
    shareCardSessions.textContent = completedSessions.toString();
    shareCardMinutes.textContent = totalWorkMinutes.toString();

    shareDownloadBtn.disabled = true;
    const originalText = shareDownloadBtn.innerHTML;
    shareDownloadBtn.innerHTML = '<span style="font-size: 1.5rem; font-weight: bold;">⏳</span><span style="font-size: 0.8rem;">生成中...</span>';

    try {
        const canvas = await html2canvas(shareCard, {
            backgroundColor: null,
            scale: 2
        });

        canvas.toBlob((blob) => {
            if (!blob) {
                showToast('エラー', '画像の生成に失敗しました', true);
            } else {
                downloadImageFallback(blob);
                showToast('ダウンロード完了', 'リザルト画像を保存しました。Instagram等でご利用ください。');
            }
            resetDownloadBtn(originalText);
        }, 'image/png');
    } catch (error) {
        console.error('Error creating image canvas:', error);
        showToast('エラー', '画像生成処理でエラーが発生しました', true);
        resetDownloadBtn(originalText);
    }
});

function resetDownloadBtn(originalText) {
    shareDownloadBtn.disabled = false;
    shareDownloadBtn.innerHTML = originalText;
}

function downloadImageFallback(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tokihaka-result.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
