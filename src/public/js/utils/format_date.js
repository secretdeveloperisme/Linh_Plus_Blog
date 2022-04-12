function formatDate(timestamp){
  let date = new Date(timestamp);
  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;
}
export {formatDate}