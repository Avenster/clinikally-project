import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProductCarousel = ({ images = [], onImagePress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);

  // If no images provided, use a default product image
  const defaultImage = require("../../assets/p5.png");
  const displayImages = images.length > 0 ? images : Array(8).fill(defaultImage);

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeIndex === displayImages.length - 1) {
        setActiveIndex(0);
        slideRef.current.scrollTo({ x: 0, animated: true });
      } else {
        setActiveIndex(activeIndex + 1);
        slideRef.current.scrollTo({ x: width * (activeIndex + 1), animated: true });
      }
    }, 6000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? displayImages.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    slideRef.current.scrollTo({ x: width * newIndex, animated: true });
  };

  const handleNext = () => {
    const newIndex = activeIndex === displayImages.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    slideRef.current.scrollTo({ x: width * newIndex, animated: true });
  };

  const handleMomentumScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/doctorIcon.png")}
        style={styles.cornerImage}
      />
      
      <Animated.ScrollView
        ref={slideRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {displayImages.map((image, index) => (
          <TouchableOpacity 
            key={index}
            onPress={() => onImagePress?.(index)}
            style={styles.imageContainer}
          >
            <Image
              source={image}
              style={styles.productImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      <View style={styles.cara}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton]}
          onPress={handlePrevious}
        >
          <MaterialIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.pagination}>
          {displayImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
        >
          <MaterialIcons name="chevron-right" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.magnifyButton}>
        <MaterialIcons name="search" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: width,
    height: 330,
    backgroundColor: '#f4f5f7',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor:"pink"
  },
  scrollView: {
    width: width,
    height: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  cornerImage: {
    height: 55,
    width: 55,
    position: 'absolute',
    zIndex: 10,
    left: 30,
    top: 15,
  },
  imageContainer: {
    width: width,
    height: '100%',
    // backgroundColor:"yellow",
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  productImage: {
    width: '100%',
    height: '85%',
    borderRadius: 20,
  },
  cara: {
    position: 'absolute',
    bottom: 10, // Changed from 20 to 10 to move buttons lower
    flexDirection: 'row',
    width: '100%', // Changed from 95% to 100% for better alignment
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15, // Added padding instead of width reduction
  },
  navButton: {
    borderRadius: 100,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly more opaque
    width: 40,
    height: 40,
    elevation: 2, // Added elevation for Android
    shadowColor: '#000', // Added shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  prevButton: {
    marginLeft: 5, // Added margin for better positioning
  },
  nextButton: {
    marginRight: 5, // Added margin for better positioning
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  magnifyButton: {
    position: 'absolute',
    right: 30,
    top:15, // Changed from 70 to 60 to maintain spacing with new button position
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
    elevation: 2, // Added elevation for Android
    shadowColor: '#000', // Added shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
});

export default ProductCarousel;