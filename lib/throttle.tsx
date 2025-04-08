export default function throttle(callback, limit) {
    let wait = false;
    return function (...args) {
        if(!wait) {
            callback(...args);
            wait = true;
            setTimeout(() => {
                wait = false;
            }, limit);
        }
    }
}