import Toast from 'react-native-root-toast';

export const addToast = (message, bottom, duration = Toast.durations.SHORT) => {
  return Toast.show(message, {
    duration: duration,
    position: bottom ? Toast.positions.BOTTOM : Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
  });
}