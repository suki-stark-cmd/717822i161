class SlidingWindow {
    constructor(size) {
        this.size = size;
        this.window = [];
    }

    addNumbers(newNumbers) {
        newNumbers.forEach(num => {
            if (!this.window.includes(num)) {
                if (this.window.length >= this.size) {
                    this.window.shift();
                }
                this.window.push(num);
            }
        });
    }

    getWindowState() {
        return [...this.window];
    }

    getAverage() {
        if (this.window.length === 0) return 0;
        const sum = this.window.reduce((a, b) => a + b, 0);
        return parseFloat((sum / this.window.length).toFixed(2));
    }
}

module.exports = SlidingWindow;
