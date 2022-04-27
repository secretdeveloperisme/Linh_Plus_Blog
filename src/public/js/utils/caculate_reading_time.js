function calculateReadingTime(text){
  const wpm = 225;
  let words = text.trim().split(/\s+/).length;
  let time = Math.ceil(words/wpm);
  return time;
}

export default calculateReadingTime;