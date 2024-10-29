import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { memo, useMemo, useCallback } from 'react';
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

// Memoized icon components
const HomeIcon = memo(({ color }) => (
  <MaterialIcons name="home" size={24} color={color} />
));

const ShopIcon = memo(({ color }) => (
  <MaterialIcons name="shopping-bag" size={24} color={color} />
));

const OffersIcon = memo(({ color }) => (
  <MaterialIcons name="local-offer" size={24} color={color} />
));

const QuizIcon = memo(({ color }) => (
  <FontAwesome name="question-circle" size={24} color={color} />
));

const WhatsappIcon = memo(({ color }) => (
  <FontAwesome name="whatsapp" size={24} color={color} />
));

// Navigation items with memoized icons
const navigationItems = [
  {
    name: "Home",
    displayName: "Home",
    icon: HomeIcon
  },
  {
    name: "Shop",
    displayName: "Products",
    icon: ShopIcon
  },
  {
    name: "Offers",
    displayName: "Offers",
    icon: OffersIcon
  },
  {
    name: "Quiz",
    displayName: "Quiz",
    icon: QuizIcon
  },
  {
    name: "Whatsapp",
    displayName: "Whatsapp",
    icon: WhatsappIcon,
    specialColor: "#25D366"
  }
];

// Memoized NavItem component
const NavItem = memo(({ item, isActive, onPress }) => {
  const iconColor = isActive ? "#9747FF" : (item.specialColor || "#666");
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.navItem, isActive && styles.activeNavItem]}
      activeOpacity={0.7}
    >
      <item.icon color={iconColor} />
      <Text style={[styles.navText, { color: iconColor }]}>
        {item.displayName}
      </Text>
    </TouchableOpacity>
  );
});

const Bottom = memo(({ currentRoute }) => {
  const navigation = useNavigation();

  // Memoize the entire navigation items array with their press handlers
  const navItemsWithHandlers = useMemo(() => 
    navigationItems.map(item => ({
      ...item,
      isActive: currentRoute === item.name,
      onPress: () => navigation.navigate(item.name)
    })),
    [currentRoute, navigation]
  );

  return (
    <View style={styles.bottomNav}>
      {navItemsWithHandlers.map((item) => (
        <NavItem
          key={item.name}
          item={item}
          isActive={item.isActive}
          onPress={item.onPress}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  bottomNav: {
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
    transform: [{ scale: 1.05 }],
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default Bottom;