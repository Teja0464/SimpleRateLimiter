import config from './config.js';

class LogQueue {
    threshold = config.RATE_LIMIT_THRESHOLD;
    window = config.RATE_LIMIT_WINDOW;
    data = {};
    front = 0;
    back = 0;
    size = 0;

    push(entry) {
        this.front = this.front % this.threshold;
        this.back = this.back % this.threshold;
        if (this.size < this.threshold) { // Limit not exceeded, Happy flow, Adding the timestamp to the queue
            this.data[this.back++] = entry;
            this.size++;
            return { success: true }
        } else { // Request limit exceeded
            const front = this.data[this.front];
            // If the first request in the queue is expired/out of the window, we can remove it to allow the latest request
            if ((entry - front) > this.window) {
                this.pop();
                this.data[this.back++] = entry;
                return { success: true }
            } else {
                console.log(`Request blocked at ${new Date(entry)}`); // For future debugging.
                // Negative case: Cannot allow the request
                const wait_till = this.window + this.data[this.front];
                return { success: false, time: new Date(wait_till)}
            }
        }
    }

    pop() {
        delete this.data[this.front];
        this.front++;
    };

}

export default LogQueue;
