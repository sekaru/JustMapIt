import { AsyncStorage } from 'react-native';

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

export const hasLatLng = (latlng) => {
  return Object.keys(latlng).length>0;
} 

export const saveLogin = async (data) => {
  try {
    await AsyncStorage.setItem('savedLogin', JSON.stringify(data));
    updatePrevLobbies(data.lobbyCode);
  } catch(error) {
    console.warn(error);
  }
}

updatePrevLobbies = async (code) => {
  try {
    const value = await AsyncStorage.getItem('prevLobbies');
    if (value !== null) {
      let lobbies = JSON.parse(value).lobbies;
      if(lobbies.indexOf(code)===-1) {
        lobbies.unshift(code);
        await AsyncStorage.setItem('prevLobbies', JSON.stringify({lobbies: lobbies}));            
      }  
    } else {
      await AsyncStorage.setItem('prevLobbies', JSON.stringify({lobbies: [code]}));            
    }
  } catch(error) {
    console.warn(error);
  }
}
