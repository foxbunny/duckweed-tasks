/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

"This line is intentionally left blank";

/**
 * Style for cross-fade transition
 *
 * Use on the root container in your view.
 */
const crossFade = () => ({
  delayed: {
    opacity: 1,
  },
  opacity: 0,
  remove: {
    opacity: 0,
  },
  transition: "opacity ease-in 0.3s",
});

/**
 * Styles for fly-in transition
 *
 * Use on the root container in your views.
 */
const flyIn = (direction: "left" | "right") => ({
  delayed: {
    opacity: 1,
    transform: "translateX(0)",
  },
  opacity: 0,
  remove: {
    opacity: 0,
    transform: `translateX(${direction === "left" ? -100 : 100}vw)`,
  },
  transform: `translateX(${direction === "left" ? -100 : 100}vw)`,
  transition: "transform ease-out 0.5s, opacity ease-in 0.3s",
});

export {
  crossFade,
  flyIn,
};
