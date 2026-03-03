export class Timer {
    constructor({ onTick, onModeChange }) {
        this.workDuration = 25 * 60; // 25 minutes in seconds
        this.breakDuration = 5 * 60; // 5 minutes in seconds

        this.timeRemaining = this.workDuration;
        this.isWorkMode = true;
        this.isRunning = false;
        this.intervalId = null;

        this.onTick = onTick;
        this.onModeChange = onModeChange;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        this.intervalId = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.onTick(this.formatTime(this.timeRemaining));
            } else {
                this.switchMode();
            }
        }, 1000);
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearInterval(this.intervalId);
    }

    reset() {
        this.stop();
        this.isWorkMode = true;
        this.timeRemaining = this.workDuration;
        this.onModeChange(this.isWorkMode);
        this.onTick(this.formatTime(this.timeRemaining));
    }

    switchMode() {
        this.isWorkMode = !this.isWorkMode;
        this.timeRemaining = this.isWorkMode ? this.workDuration : this.breakDuration;
        this.onModeChange(this.isWorkMode);
        this.onTick(this.formatTime(this.timeRemaining));
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}
