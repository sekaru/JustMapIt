export const toPlaceName = (link) => {
  let trimmedLink = link;
  if(trimmedLink.startsWith("http://")) {
    trimmedLink = trimmedLink.substring(7);
  } else if(trimmedLink.startsWith("https://")) {
    trimmedLink = trimmedLink.substring(8);
  }

  if(trimmedLink.startsWith("www.")) trimmedLink = trimmedLink.substring(4);
  let dot = trimmedLink.indexOf(".");
  if(dot!==-1) trimmedLink = trimmedLink.substring(0, dot);
  trimmedLink = trimmedLink.replace("-", " ");

  return trimmedLink.toUpperCase();
}