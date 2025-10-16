type Func<T extends any[]> = (...args: T) => void;

function throttle<T extends any[]>(func: Func<T>, delay: number): Func<T> {
  let inThrottle: boolean;
  let lastFn: number | undefined;
  let lastTime: number;

  return function (this: any, ...args: T) {
    if (!inThrottle) {
      func.apply(this, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= delay) {
          func.apply(this, args);
          lastTime = Date.now();
        }
      }, Math.max(delay - (Date.now() - lastTime), 0)); // Ensure non-negative delay for setTimeout
    }
  };
}

export default throttle;
