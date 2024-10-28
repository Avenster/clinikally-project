import { FontAwesome } from "@expo/vector-icons";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import React from 'react';
import { MaterialIcons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const Bottom = ({ currentRoute }) => {
  const navigation = useNavigation();

  // Debug log to verify current route
  console.log('Current route in Bottom:', currentRoute);

  const navigationItems = [
    { name: "Home", icon: (color) => <MaterialIcons name="home" size={24} color={color} /> },
    { name: "Shop", icon: (color) => <Feather name="shopping-bag" size={24} color={color} /> },
    { name: "Offers", icon: (color) => <MaterialIcons name="local-offer" size={24} color={color} /> },
    { name: "Quiz", icon: (color) => <MaterialIcons name="quiz" size={24} color={color} /> },
    { 
      name: "Whatsapp", 
      icon: (color) => <FontAwesome name="whatsapp" size={24} color={color} />,
      specialColor: "#25D366"
    },
  ];

  const isActiveRoute = (routeName) => {
    const isActive = currentRoute === routeName;
    console.log(`Checking ${routeName} against ${currentRoute}: ${isActive}`);
    return isActive;
  };

  const getIconColor = (routeName, specialColor) => {
    return isActiveRoute(routeName) ? "#9747FF" : (specialColor || "#666");
  };

  const getTextStyle = (routeName) => ({
    ...styles.navText,
    color: isActiveRoute(routeName) ? "#9747FF" : "#666",
    fontWeight: isActiveRoute(routeName) ? "600" : "500",
  });

  return (
    <View style={styles.bottomNav}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.navItem,
            isActiveRoute(item.name) && styles.activeNavItem
          ]}
          onPress={() => {
            console.log(`Navigating to ${item.name}`);
            navigation.navigate(item.name);
          }}
        >
          {item.icon(getIconColor(item.name, item.specialColor))}
          <Text style={getTextStyle(item.name)}>
            {item.name === "Shop" ? "Products" : item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 1000,
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 4,
  },
  activeNavItem: {
    transform: [{scale: 1.05}],
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default Bottom;