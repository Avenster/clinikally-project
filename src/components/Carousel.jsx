import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');
const handleImagePress = (index) => {
    // Add navigation based on which carousel image was pressed
    switch(index) {
      case 0:
        navigation.navigate('Shop');
        break;
      case 1:
        navigation.navigate('DoctorConsult');
        break;
      case 2:
        navigation.navigate('Offers');
        break;
      // Add more cases as needed
      default:
        navigation.navigate('Shop');
    }
  };

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);

  const images = [
    require('../../assets/1.webp'),
    require('../../assets/2.webp'),
    require('../../assets/3.webp'),
    require('../../assets/4.webp'),
    require('../../assets/5.webp'),
  ];
  const handleImagePress = (index) => {
    // Add navigation based on which carousel image was pressed
    switch(index) {
      case 0:
        navigation.navigate('Shop');
        break;
      case 1:
        navigation.navigate('DoctorConsult');
        break;
      case 2:
        navigation.navigate('Offers');
        break;
      // Add more cases as needed
      default:
        navigation.navigate('Shop');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeIndex === images.length - 1) {
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
    const newIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    slideRef.current.scrollTo({ x: width * newIndex, animated: true });
  };

  const handleNext = () => {
    const newIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
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
      <Animated.ScrollView
        ref={slideRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <TouchableOpacity 
            key={index}
            onPress={() => handleImagePress(index)}
          >
            <Image
              source={image}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      <View style={styles.cara}>
      {/* Navigation Buttons */}
      <TouchableOpacity
        style={[styles.navButton, styles.prevButton]}
        onPress={handlePrevious}
      >
        <MaterialIcons name="chevron-left" size={30} color="black" />
      </TouchableOpacity>

      

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: width,
    height: width * 0.5, 
    justifyContent:'center',
    alignItems:'center'// Adjust this ratio based on your image aspect ratio
  },
  image: {
    width: width,
    height: '100%',
  },
  navButton: {
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems:'center',
    borderRadius: 100,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cara:{
    flexDirection:'row',
    width: '95%',
    // backgroundColor:'blue',
    justifyContent:'space-between'
  },
  prevButton: {
    width:40,
    height:40,
    // justifyContent:'center',
    // alignItems:'center',
    // flexDirection:'row',
  },
  nextButton: {
    width:40,
    height:40,
  },
  pagination: {
    // position: 'absolute',
    // bottom: 15,
    flexDirection:'row',
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'center',
    // backgroundColor:'black',
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
});

export default Carousel;