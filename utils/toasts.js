import Toast from 'react-native-root-toast';

export const addToast = (message) => {
  let toast = Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
  });
}