import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const Cart = ({ deliveryInfo }) => {
  const getDeliveryText = () => {
    if (!deliveryInfo) {
      return "Check delivery date";
    }

    if (!deliveryInfo.available) {
      return deliveryInfo.message;
    }

    // Format the delivery date
    if (deliveryInfo.deliveryDate) {
      const date = new Date(deliveryInfo.deliveryDate);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
      return `Get it by ${formattedDate}`;
    }

    return "Check delivery date";
  };

  return (
    <View style={styles.buttonsContainer}>
      <View style={styles.up}>
        <View style={styles.uprev}>
          <Text style={styles.text2}>
            <Text style={styles.star}>★</Text> 4.8 (30 Reviews)
          </Text>
        </View>
        <TouchableOpacity style={styles.upnxt}>
          <Image
            source={require("../../assets/download.png")}
            style={styles.ico}
          />
          <Text style={styles.icoText}>{getDeliveryText()}</Text>
          <Icon name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.down}>
        <TouchableOpacity style={styles.cartButton}>
          <View style={styles.buttonContent}>
            <Icon name="add-shopping-cart" size={20} color="#9747FF" />
            <Text style={styles.cartButtonText}>Add to cart</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton}>
          <View style={styles.buttonContent}>
            <Image
              source={require("../../assets/bolt.png")}
              style={styles.boltIcon}
            />
            <Text style={styles.buyButtonText}>Buy it now</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "column",
    paddingBottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    height: 120,
    justifyContent: "space-between",
    width: "100%",
  },
  up: {
    display: "flex",
    textAlign: "center",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f7f7f7",
    flexDirection: "row",
  },
  uprev: {
    textAlign: "center",
    textAlignVertical: "center",
    borderRightWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    height: "100%",
    paddingRight: 20,
  },
  upnxt: {
    textAlign: "center",
    paddingLeft: 20,
    textAlignVertical: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderColor: "#ddd",
    height: "100%",
  },
  down: {
    height: "60%",
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  boltIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartButton: {
    width: "43%",
    height: 50,
    borderWidth: 1,
    borderColor: "#9747FF",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButton: {
    width: "43%",
    height: 50,
    backgroundColor: "#9747FF",
    borderRadius: 10,
    padding: 12,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cartButtonText: {
    color: "#9747FF",
    fontSize: 16,
    fontWeight: "500",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  ico: {
    width: 20,
    height: 20,
  },
  text2: {
    fontSize: 10,
  },
  star: {
    color: "#FFD700",
  },
  icoText: {
    fontSize: 10,
    color: "#333",
  },
});

export default Cart;