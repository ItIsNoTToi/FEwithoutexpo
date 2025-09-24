/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const LoadingSpinner = ({ size = 50, color = '#007AFF', thickness = 3 }) => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Create a looping animation that rotates 360 degrees
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // Speed of rotation (adjust for faster/slower)
        easing: Easing.linear, // Smooth, continuous rotation
        useNativeDriver: true, // Better performance on native platforms
      })
    );
    spinAnimation.start();

    // Cleanup on unmount (optional but good practice)
    return () => spinAnimation.stop();
  }, [spinValue]);

  // Interpolate the rotation from 0 to 360 degrees
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness,
            borderColor: color,
            borderLeftColor: 'transparent', // Creates the "spinning" effect by hiding one side
            transform: [{ rotate: spin }],
          },
        ] as any}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    // Base styles for the spinner
  },
});

export default LoadingSpinner;