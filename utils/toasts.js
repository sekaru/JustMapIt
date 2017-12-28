import Toast from 'react-native-root-toast';

export const addToast = (message, duration = Toast.durations.SHORT) => {
  return Toast.show(message, {
    duration: duration,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
  });
}