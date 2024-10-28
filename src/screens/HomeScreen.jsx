import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from "@expo/vector-icons";
import Carousel from "../components/Carousel";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Bottom from "../components/Bottom";
import Navbar from "../components/layout/Navbar";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const serviceCardScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(serviceCardScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(serviceCardScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderServiceCard = (image, title, price = null, onPress = null) => (
    <AnimatedTouchableOpacity
      style={[
        styles.serviceCard,
        {
          transform: [{ scale: serviceCardScale }],
        },
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <Image source={image} style={styles.serviceImage} />
      {price && (
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{price}</Text>
        </View>
      )}
      <Text style={styles.serviceTitle}>{title}</Text>
    </AnimatedTouchableOpacity>
  );

  return (
      <ScrollView>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Carousel navigation={navigation} />
        </Animated.View>

        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Expert guidance only</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderServiceCard(
              require("../../assets/12.webp"),
              "Doctor Consult",
              "AT JUST RS. 249",
              () => navigation.navigate("DoctorConsult")
            )}
            {renderServiceCard(
              require("../../assets/13.webp"),
              "Pediatric Derm Care"
            )}
            {renderServiceCard(
              require("../../assets/14.webp"),
              "Pediatric Derm Care"
            )}
            {renderServiceCard(
              require("../../assets/15.webp"),
              "Pediatric Derm Care"
            )}
            {renderServiceCard(
              require("../../assets/16.webp"),
              "Pediatric Derm Care"
            )}
          </ScrollView>
        </Animated.View>

        <Animated.View
          style={[
            styles.section2,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>
            Backed by cutting-edge science
          </Text>
          <Image
            source={require("../../assets/i1.png")}
            style={styles.scienceImage}
            resizeMode="contain"
          />
        </Animated.View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    padding: 16,
  },
  section2: {
    padding: 16,
    backgroundColor: "rgba(244, 245, 247,1)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  serviceCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  serviceImage: {
    width: "100%",
    height: 180,
  },
  priceBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#9747FF",
    padding: 8,
    borderRadius: 8,
  },
  priceText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 11,
  },
  serviceTitle: {
    fontSize: 13,
    paddingBottom: 30,
    fontWeight: "bold",
    padding: 12,
  },
  scienceImage: {
    width: "100%",
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  }
});

export default HomeScreen;