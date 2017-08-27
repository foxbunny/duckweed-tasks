/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const asyncPause = (delay: number = 0): Promise<void> => {
  return new Promise((res) => {
    setTimeout(() => res(), delay);
  });
};

export default asyncPause;
