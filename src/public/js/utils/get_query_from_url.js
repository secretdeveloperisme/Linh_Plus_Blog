function getQueryFromMUrl(key = "", searchUrl){
  let querySearchURL = searchUrl;
  let urlSearchParams = new URLSearchParams(querySearchURL);
  return urlSearchParams.get(key);
}
export default getQueryFromMUrl;