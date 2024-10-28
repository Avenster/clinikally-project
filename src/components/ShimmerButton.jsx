import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const ShimmerButton = ({ text, style }) => {
  const shimmerAnimatedValue = new Animated.Value(-150);

  useEffect(() => {
    const createShimmerAnimation = () => {
      return Animated.sequence([
        Animated.timing(shimmerAnimatedValue, {
          toValue: Dimensions.get('window').width + 150,
          duration: 2500, // Slower animation
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimatedValue, {
          toValue: -150,
          duration: 0,
          useNativeDriver: true,
        }),
      ]);
    };

    Animated.loop(createShimmerAnimation()).start();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.shimmerContainer}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [
                { translateX: shimmerAnimatedValue },
                { rotate: '25deg' }
              ],
            },
          ]}
        >
          <View style={styles.shimmerGradient}>
            <View style={styles.shimmerColor} />
            <View style={styles.shimmerColorMiddle} />
            <View style={styles.shimmerColor} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff9800',
    width: '90%',
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  shimmerContainer: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  shimmerGradient: {
    flexDirection: 'row',
    width: 40, // Reduced width
    height: '200%',
  },
  shimmerColor: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  shimmerColorMiddle: {
    flex: 2,
    backgroundColor: 'white',
    opacity: 0.4, // Reduced opacity for softer effect
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ShimmerButton;