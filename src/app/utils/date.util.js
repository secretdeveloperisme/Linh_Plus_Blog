function formatDate(dateString){
  let date = new Date(dateString);
  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear},${date.getHours()}: ${date.getMinutes()}`;
}
module.exports = {
  formatDate
};