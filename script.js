// Registers the GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis = new Lenis({
  duration: 1.5, // controls smoothness
  smoothWheel: true, // smooths mouse wheel scrolling
});

// Whenever Lenis updates the scroll position, it tells ScrollTrigger to recalculate trigger positions.
lenis.on("scroll", ScrollTrigger.update);

// GSAP's ticker runs every animation frame. GSAP provides time in seconds. Lenis expects milliseconds. converts seconds → milliseconds.
gsap.ticker.add((time) => lenis.raf(time * 1000));

// Disables GSAP's lag smoothing.
gsap.ticker.lagSmoothing(0);

// Get all headings
let headings = gsap.utils.toArray(".row h1");

// Store SplitText instances
let splits = [];

// Split Each Heading Into Characters
headings.forEach((heading) => {
  // Split Text
  let split = SplitText.create(heading, { type: "chars", charsClass: "ch" });
  splits.push(split);

  // Loops through every character
  split.chars.forEach((char, index) => {
    // Alternate Up and Down
    let startY = index % 2 === 0 ? -150 : 150;

    // Sets the starting vertical position
    gsap.set(char, { y: startY });
  });
});

// Loop Through Rows
gsap.utils.toArray(".row").forEach((row, rowIndex) => {
  // Find Track Element
  let track = row.querySelector(".track");

  // Determine Slide Direction
  let slideFrom = rowIndex === 1 ? -100 : 100;

  // Get Corresponding Split
  let split = splits[rowIndex];

  // Count Characters
  let charCount = split.chars.length;

  // Creates a scroll-based animation
  ScrollTrigger.create({
    trigger: row, // Trigger Element
    start: "top bottom", // Means row top hits viewport bottom
    end: "top top", // Means row top hits viewport top
    scrub: 1, // Animation progress follows scroll position smoothly
    // Update During Scroll
    onUpdate(self) {
      gsap.set(track, {
        // self.progress is a value between 0 and 1. 0 = trigger just started, 0.5 = halfway through, 1 = trigger finished
        x: `${slideFrom - self.progress * slideFrom}%`,
      });

      // Processes each character individually.
      split.chars.forEach((char, index) => {
        let staggerIndex = rowIndex === 1 ? charCount - 1 - index : index;
        let delay = 0.1 + (staggerIndex / charCount) * 0.675;
        let duration = 0.9 - (0.675 * (charCount - 1)) / charCount;

        let charProgress = 0;
        if (self.progress >= delay) {
          charProgress = Math.min(1, (self.progress - delay) / duration);
        }

        let startY = index % 2 === 0 ? -150 : 150;
        gsap.set(char, { y: startY * (1 - charProgress) });
      });
    },
  });
});
