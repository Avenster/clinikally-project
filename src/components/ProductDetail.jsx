import React, { useState, useEffect } from "react";
import ProductCarousel from './ProductCarousel';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { useRoute } from "@react-navigation/native";
import stockData from "../../assets/stock.json";
import pincodeData from "../../assets/pincodes.json";
import productsData from "../../assets/products.json"; 
import Navbar from "./layout/Navbar";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Cart from "./Cart";
import CountdownTimer from './CountdownTimer';
import FlashingButton from './ShimmerButton';

const ProductDetail = () => {
  const route = useRoute();
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState("30 gm");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [isInStock, setIsInStock] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [isValidPincode, setIsValidPincode] = useState(true);
  const [pincodeError, setPincodeError] = useState(""); // New state for error message

  const baseProduct = route.params?.product;
  const productInfo = productsData.find(p => p["Product ID"] === baseProduct["Product ID"]);
  const baseSalePrice = productInfo?.Price || baseProduct["Sale Price"] || 989;
  const baseOriginalPrice = (baseSalePrice * 1.2).toFixed(2);
  
  // State for dynamic prices
  const [currentPrices, setCurrentPrices] = useState({
    salePrice: baseSalePrice,
    originalPrice: baseOriginalPrice
  });

  // Initialize product with base data
  const [product] = useState({
    ...baseProduct,
    benefits: ["Reduce Fineline", "Hydrates", "Lightens Skin"],
  });

  // Update prices when pack size changes
  const handlePackChange = (packSize) => {
    const multiplier = packSize === "2 x 30 gm" ? 2 : 1;
    setCurrentPrices({
      salePrice: baseSalePrice * multiplier,
      originalPrice: baseOriginalPrice * multiplier
    });
    setSelectedPack(packSize);
  };

  const validatePincode = (code) => {
    // Basic validation for 6-digit numeric pincode
    return /^[0-9]{6}$/.test(code);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const carouselImages = Array(8).fill(null);

  // Check stock status on component mount
  useEffect(() => {
    const stockInfo = stockData.find(
      (item) => item["Product ID"] === product["Product ID"]
    );
    console.log("Stock Info:", stockInfo); // Debug log
    setIsInStock(stockInfo?.["Stock Available"] !== "False");
  }, [product]);

  const checkDelivery = () => {
    setLoading(true);
    setShowTimer(false);
    setPincodeError(""); // Reset error message
    
    // First validate pincode format
    if (!validatePincode(pincode)) {
      setIsValidPincode(false);
      setPincodeError("Please enter a valid 6-digit pincode");
      setLoading(false);
      return;
    }

    const stockInfo = stockData.find(
      (item) => item["Product ID"] === product["Product ID"]
    );
    
    if (stockInfo?.["Stock Available"] === "False") {
      setDeliveryInfo({
        available: false,
        message: "Currently out of stock",
        isOutOfStock: true
      });
      setLoading(false);
      return;
    }

    // Find pincode information
    const pincodeInfo = pincodeData.find((item) => item.Pincode === pincode);
    if (!pincodeInfo) {
      setIsValidPincode(false);
      setPincodeError("Invalid pincode. We currently don't deliver to this location");
      setDeliveryInfo({
        available: false,
        message: "Delivery not available at this location",
        isOutOfStock: false
      });
      setLoading(false);
      return;
    }

    // Reset validation state if pincode is valid
    setIsValidPincode(true);
    setPincodeError("");

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let deliveryDate = new Date();
    let message = "";

    // Delivery logic based on provider
    switch (pincodeInfo["Logistics Provider"]) {
      case "Provider A":
        if (currentHour < 17) {
          deliveryDate = new Date();
          message = "Same-day delivery available if ordered before 5 PM";
        } else {
          deliveryDate.setDate(deliveryDate.getDate() + 1);
          message = `Next-day delivery by ${deliveryDate.toLocaleDateString(
            "en-US",
            { weekday: "long", month: "short", day: "numeric" }
          )}`;
        }
        break;

      case "Provider B":
        if (currentHour < 9) {
          deliveryDate = new Date();
          message = "Same-day delivery available if ordered now";
        } else {
          deliveryDate.setDate(deliveryDate.getDate() + 1);
          message = `Next-day delivery by ${deliveryDate.toLocaleDateString(
            "en-US",
            { weekday: "long", month: "short", day: "numeric" }
          )}`;
        }
        break;

      case "General Partners":
        const tat = parseInt(pincodeInfo.TAT);
        deliveryDate.setDate(deliveryDate.getDate() + tat);
        message = `Estimated delivery by ${deliveryDate.toLocaleDateString(
          "en-US",
          { weekday: "long", month: "short", day: "numeric" }
        )} (${tat} days)`;
        break;

      default:
        message = "Delivery information not available";
        break;
    }

    setDeliveryInfo({
      available: true,
      message,
      provider: pincodeInfo["Logistics Provider"],
      tat: pincodeInfo.TAT,
      deliveryDate,
    });

    setShowTimer(true);
    setLoading(false);
  };


  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView 
            style={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Home / Skin Cream</Text>
        </View>

        <Text style={styles.productTitle}>{product?.["Product Name"]}</Text>

        <View style={styles.benefitsContainer}>
          {product.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.checkmarkBadge}>
                <Icon
                  name="check-circle"
                  size={20}
                  color="green"
                  style={styles.checkmarkIcon}
                />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            </View>
          ))}
        </View>

        <ProductCarousel />
         
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Image
              source={require("../../assets/original.webp")}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>101% Original</Text>
          </View>
          <View style={styles.featureItem}>
            <Image
              source={require("../../assets/lowprice.png")}
              style={styles.featureIcon1}
            />
            <Text style={styles.featureText}>Lowest Price</Text>
          </View>
          <View style={styles.featureItem1}>
            <Image
              source={require("../../assets/free.png")}
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>Free Shipping</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <View style={styles.l}>
                <View style={styles.lBaacha}>
                  <Text style={styles.originalPrice}>₹{currentPrices.originalPrice}</Text>
                  <Text style={styles.salePrice}>₹{currentPrices.salePrice}</Text>
                  <View style={styles.saveTag}>
                    <Text style={styles.saveTagText}>SAVE 10%</Text>
                  </View>
                </View>
                <View style={styles.tax}>
                  <Text style={styles.taxInfo}>(incl. of all taxes)</Text>
                </View>
              </View>

              <View style={styles.r}>
                {!isInStock ? (
                  <View style={[styles.hurryButton, { backgroundColor: '#ff4444' }]}>
                    <Text style={styles.hurryButtonText}>Out of Stock</Text>
                  </View>
                ) : (
                  <FlashingButton text="Hurry, Few Left!" />
                )}
              </View>
            </View>
          </View>

          {isInStock && (
            <>
              <View style={styles.packContainer}>
                <View style={styles.packText}>
                  <Text style={styles.packLabel}>Pack:</Text>
                </View>
                <View style={styles.packOptions}>
                  <TouchableOpacity
                    style={[styles.packButton, selectedPack === "30 gm" && styles.selectedPack]}
                    onPress={() => handlePackChange("30 gm")}
                  >
                    <Text style={[styles.packButtonText, selectedPack === "30 gm" && styles.selectedPackText]}>
                      30 gm
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.packButton, selectedPack === "2 x 30 gm" && styles.selectedPack]}
                    onPress={() => handlePackChange("2 x 30 gm")}
                  >
                    <Text style={[styles.packButtonText, selectedPack === "2 x 30 gm" && styles.selectedPackText]}>
                      2 x 30 gm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Qty:</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentlyInCart}>
                <Image
                  source={require("../../assets/graph.png")}
                  style={styles.featureIcon}
                />
                <Text style={styles.recentlyInCartText}>Recently in 1575 carts</Text>
              </View>
            </View>

            <View style={styles.offers}>
              <View style={styles.offersContainer}>
                <Text style={styles.offersTitle}>Available offers</Text>
                <View style={styles.offerItem}>
                  <View style={styles.offerIconContainer}>
                    <Image
                      source={require("../../assets/checkstar.png")}
                      style={styles.OfferIcon}
                    />
                  </View>
                  <View style={styles.offerDetails}>
                    <Text style={styles.offerText}>₹10 off on prepaid orders</Text>
                    <Text style={styles.offerSubtext}>Auto applied at checkout.</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.deliveryContainer}>
      <Text style={styles.deliveryText}>Select Delivery Location</Text>
      <View style={styles.pincodeInputContainer}>
        <TextInput
          style={[
            styles.pincodeInput,
            !isValidPincode && styles.invalidPincode
          ]}
          placeholder="Enter Pincode"
          value={pincode}
          onChangeText={(text) => {
            setPincode(text);
            setIsValidPincode(true); // Reset validation on new input
            setPincodeError(""); // Clear error message on new input
          }}
          keyboardType="numeric"
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.checkButton, pincode.length !== 6 && styles.disabledButton]}
          onPress={checkDelivery}
          disabled={pincode.length !== 6}
        >
          <Text style={styles.checkButtonText}>Check</Text>
        </TouchableOpacity>
      </View>
      
      {pincodeError ? (
        <Text style={styles.errorMessage}>{pincodeError}</Text>
      ) : null}

      {loading && (
        <Text style={styles.loadingText}>Checking delivery information...</Text>
      )}

      {showTimer && deliveryInfo?.available && (
        <CountdownTimer 
          provider={deliveryInfo.provider} 
          tat={parseInt(deliveryInfo.tat)}
        />
      )}

            

            {/* <CountdownTimer provider={deliveryInfo.provider}/> */}
            


        {loading && (
          <Text style={styles.loadingText}>Checking delivery information...</Text>
        )}

        {/* {deliveryInfo && (
          <View style={styles.deliveryInfo}>
            <Text style={[styles.deliveryMessage, !deliveryInfo.available && styles.errorMessage]}>
              {deliveryInfo.message}
            </Text>
            {deliveryInfo.available && (
              <Text style={styles.providerInfo}>Delivery by: {deliveryInfo.provider}</Text>
            )}
          </View>
        )} */}

        
      </View>
          </>
        
        )}
       <View style={styles.keyboardSpacing} />
          </ScrollView>
        </TouchableWithoutFeedback>
        {isInStock && (
  <Cart deliveryInfo={deliveryInfo} />
)}
      </KeyboardAvoidingView>

      
      
  );
};

const styles = StyleSheet.create({
  invalidPincode: {
    borderColor: '#f44336',
    color: '#f44336',
  },
  errorMessage: {
    color: '#f44336',
    marginTop: 8,
  },
  
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  breadcrumb: {
    paddingTop: 10,
    paddingLeft: 22,
  },
  breadcrumbText: {
    fontSize: 12,
    color: "#A7A8AB",
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "600",
    paddingLeft: 22,
    color: "#333",
  },
  benefitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    // padding: 16,
    paddingLeft: 12,
    paddingBottom: 10,
    gap: 3,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkmarkBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  checkmarkIcon: {
    color: "#008001",
    marginRight: 4,
  },
  benefitText: {
    color: "#008001",
    fontSize: 11,
    flexShrink: 1, // Prevents the text from wrapping to the next line
  },
  searchIcon: {
    color: "black",
  },
  cornerImage: {
    height: 55,
    width: 55,
    position: "absolute",
    zIndex: 10,
    left: 30,
    top: 20,
  },

  imageContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "90%",
    height: 300,
    borderRadius: 20,
  },
  magnifyButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
  },
  carouselIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  activeIndicator: {
    backgroundColor: "#1C1C1C",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 70,
    borderWidth: 1,
    borderColor: "#C5A1EF",
    // margin: 16,
    // marginBottom:"none !important",
    margin: 0,
    marginHorizontal: 10,
    marginTop:10,
    borderRadius: 8,
  },
  featureItem: {
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "black",
    // paddingRight:17,
    // padding:10,
    flex: 1,
    justifyContent: "center",
    borderColor: "#C5A1EF",
  },
  featureItem1: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  featureIcon: {
    width: 22,
    height: 22,
    marginBottom: 4,
  },
  featureIcon1: {
    width: 62,
    height: 29,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: "#666",
    fontWeight:"bold"
  },

  priceContainer: {
    padding: 16,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    height: 50,
    width: "100%",
    // flex: 1,
    justifyContent: "space-between",
  },
  l: {
    width: "60%",
    height: 80,
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "center",
  },
  lBaacha: {
    flexDirection: "row",
    
    justifyContent: "flex-start",
    gap: 7,
    alignItems: "center",
    height: "auto",
    width: "100%",
  },
  tax: {
    height: 15,
    width: "100%",
    justifyContent: "center",
  },
  r: {
    width: "40%",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    height: "auto",
  },
  originalPrice: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "line-through",
  },
  salePrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#008001",
  },
  saveTag: {
    backgroundColor: "#9747FF",
    // paddingHorizontal: 1,
    // paddingVertical: 4,

    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: "30%",
    // width:150,
    borderRadius: 4,
  },
  saveTagText: {
    color: "white",
    fontSize: 12,
  },
  taxInfo: {
    fontSize: 11,
    fontWeight: "normal",
    color: "#737479",
  },
  
  packContainer: {
    padding: 16,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center",
    
    paddingTop:0,
  },

  packText:{
    height:50,
    width:"15%",
    justifyContent:"center",
    alignItems: "flex-start",

    
  },

  packLabel: {
    fontSize: 16,
    // marginBottom: 8,
    height:40,
    textAlignVertical: "center",
    textAlign:"center",
    fontWeight:"bold",
    // backgroundColor:"purple",
  },


  packOptions: {
    flexDirection: "row",
    gap: 12,
    
    
  },
  packButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  selectedPack: {
    borderColor: "#9747FF",
    backgroundColor: "#f3e5f5",
  },
  packButtonText: {
    color: "black",
  },
  selectedPackText: {
    color: "black",
  },
  saveMoreText: {
    fontSize: 10,
    color: "#4caf50",
    marginTop: 2,
  },
  quantityContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 12,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  quantityButton: {
    padding: 8,
    width: 36,
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    color: "#666",
  },
  quantityText: {
    paddingHorizontal: 16,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },
  recentlyInCart: {
    marginLeft: "auto",
    flexDirection:"row",
    gap:8,
    justifyContent:"center",
    alignItems:"center"
  },
  recentlyInCartText: {
    fontSize: 13,
    color: "#008000",
    fontWeight:"500"
  },
  
  hurryButton: {
    backgroundColor: "#ff9800",
    // margin: 16,
    // padding: 12,
    width: "90%",
    height: 30,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    
  },
  deliveryContainer: {
    padding: 16,
  },
  deliveryText:{
    marginBottom:10,
  },
  pincodeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pincodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  checkButton: {
    backgroundColor: "#9747FF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  checkButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  deliveryInfo: {
    marginTop: 8,
  },
  deliveryMessage: {
    fontSize: 14,
    color: "#4caf50",
  },
  errorMessage: {
    color: "#f44336",
  },

  offers:{
    width:"100%",
    justifyContent:"center",
    alignItems:"center"
  },
  offersContainer: {
    // marginTop: 16,
    backgroundColor: "#ffefd2",
    padding: 16,
    paddingTop:10,
    borderRadius: 5,
    width:"95%",
    
  },
  offersTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#474a57",
    fontWeight: "600",
    letterSpacing: 0.5
  },
  offerItem: {
    flexDirection: "row",
    alignItems: "center",
    width:"100%",
    paddingTop:10,
    paddingBottom:10,
    gap:10,
    marginLeft:20,
  },
  OfferIcon:{
    width: 34,
    height: 34,
    
  },
  offerIcon: {
    width: 34,
    height: 34,
    marginRight: 8,
  },
  offerDetails: {
    flex: 1,
  },
  offerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  offerSubtext: {
    fontSize: 12,
    color: "#666",
  },
  
  hurryButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  keyboardSpacing: {
    height: Platform.OS === 'ios' ? 150 : 80, // Extra padding at bottom for keyboard
  },
  pincodeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Extra padding for iOS
  },
  pincodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    backgroundColor: '#fff', // Adding background color for better visibility
  },
  deliveryContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16, // Extra padding for iOS
  },
  invalidPincode: {
    borderColor: '#f44336',
    borderWidth: 1,
  },
  errorMessage: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
});

export default ProductDetail;
