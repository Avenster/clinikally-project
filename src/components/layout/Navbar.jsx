import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useCart } from "./CartContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NavButton = ({ children, onPress, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
};

const Navbar = ({ navigation }) => {
  const cartBadgeScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const menuSlide = useRef(new Animated.Value(-50)).current;
  const { getCartQuantity } = useCart(); // Moved here from NavButton

  useEffect(() => {
    // Animate navbar elements on mount
    Animated.parallel([
      Animated.spring(logoOpacity, {
        toValue: 1,
        tension: 10,
        useNativeDriver: true,
      }),
      Animated.spring(menuSlide, {
        toValue: 0,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(500),
        Animated.spring(cartBadgeScale, {
          toValue: 1,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.header}>
      <Animated.View
        style={[styles.headerLeft, { transform: [{ translateX: menuSlide }] }]}
      >
        <NavButton onPress={() => navigation?.openDrawer()}>
          <MaterialIcons name="menu" size={24} color="black" />
        </NavButton>
        <NavButton>
          <MaterialIcons name="search" size={22} color="black" />
        </NavButton>
      </Animated.View>

      <Animated.View style={[styles.headerMiddle, { opacity: logoOpacity }]}>
        <Image
          source={require("../../../assets/logo.webp")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.headerRight}>
        <NavButton onPress={() => navigation?.navigate("Profile")}>
          <AntDesign name="user" size={24} color="#000" />
        </NavButton>

        <NavButton
          style={styles.cartContainer}
          onPress={() => navigation?.navigate("Cart")}
        >
          <Image
            source={require("../../../assets/shopping_bag.png")}
            style={styles.bagIcon}
          />
          <Animated.View
            style={[
              styles.cartBadge,
              {
                transform: [{ scale: cartBadgeScale }],
              },
            ]}
          >
            <Text style={styles.cartBadgeText}>{getCartQuantity()}</Text>
          </Animated.View>
        </NavButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bagIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    width: "33.33%",
    justifyContent: "flex-start",
  },
  headerMiddle: {
    width: "33.33%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    width: "33.33%",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    gap: 16,
  },
  logo: {
    height: 40,
    width: 120,
  },
  cartContainer: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#9747FF",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
  },
});

export default Navbar;
