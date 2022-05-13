function pagination(current, max){
  let range = [];
  let rangeWithDot = [];
  let delta = 2;
  let previous = current - delta;
  let next = current + delta;
  let l = 0;
  for(let i = 1; i <= max ; i++){
    if( i == 1 || i == max || (i >= previous  && i <= next)){
      range.push(i)
    }
  }
  for(let i of range){
    if(l !== 0 ){
      if( i- l !== 1){
        rangeWithDot.push("...");
      }
    }
    rangeWithDot.push(i)
    l = i;
  }
  return rangeWithDot
}

export default pagination;