document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("mainVideo");
  const marker = document.querySelector(".video-marker");
  const timeline = document.querySelector(".video-timeline");
  const cursor = document.querySelector(".cursor");
  const cursorText = document.querySelector(".cursor p");

  let isPlaying = true;

  video.addEventListener("timeupdate", function () {
    const percentage = (video.currentTime / video.duration) * 100;
    marker.style.left = `calc(${percentage}% - 1px)`;
  });

  timeline.addEventListener("click", function (e) {
    e.stopPropagation();
    const rect = timeline.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    video.currentTime = percentage * video.duration;
    marker.style.left = `calc(${percentage * 100}% - 1px)`;
  });

  document.addEventListener("click", function (e) {
    if (!timeline.contains(e.target)) {
      if (isPlaying) {
        video.pause();
        cursorText.textContent = "Play";
      } else {
        video.play();
        cursorText.textContent = "Pause";
      }
      isPlaying = !isPlaying;
    }
  });

  document.addEventListener("mousemove", function (e) {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
});
