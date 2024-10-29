import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import products from "../../assets/products.json";
import stockData from "../../assets/stock.json";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "./layout/CartContext";
import Stock from "./Stock";

const ITEMS_PER_PAGE = 10;
const LOADING_THRESHOLD = 0.5;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const QuantityControl = React.memo(({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  isInStock 
}) => (
  <View style={styles.quantityContainer}>
    <TouchableOpacity 
      style={[styles.quantityButton, !quantity && styles.quantityButtonDisabled]} 
      onPress={onDecrease}
      disabled={!quantity}
    >
      <Text style={[styles.quantityButtonText, !quantity && styles.quantityButtonTextDisabled]}>-</Text>
    </TouchableOpacity>
    <Text style={styles.quantityText}>{quantity}</Text>
    <TouchableOpacity 
      style={[styles.quantityButton, !isInStock && styles.quantityButtonDisabled]} 
      onPress={onIncrease}
      disabled={!isInStock}
    >
      <Text style={[styles.quantityButtonText, !isInStock && styles.quantityButtonTextDisabled]}>+</Text>
    </TouchableOpacity>
  </View>
));


const ProductItem = React.memo(({ 
  item, 
  onPress, 
  isInCart,
  quantity = 0,
  onQuantityChange
}) => (
  <TouchableOpacity
    style={styles.productCard}
    onPress={onPress}
  >
    <View style={styles.imageContainer}>
      <Image
        source={require("../../assets/p5.png")}
        style={styles.productImage}
        loading="lazy"
      />
      <View style={styles.saveTag}>
        <Text style={styles.saveText}>SAVE 10%</Text>
      </View>
    </View>

    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={2}>
        {item["Product Name"]}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{item.Price}</Text>
        <Text style={styles.originalPrice}>
          ₹{(parseFloat(item.Price) * 1.2).toFixed(2)}
        </Text>
      </View>
      {item.isInStock ? (
        <View style={styles.cartControlContainer}>
          {quantity === 0 ? (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => onQuantityChange(1)}
            >
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          ) : (
            <QuantityControl
              quantity={quantity}
              onIncrease={() => onQuantityChange(quantity + 1)}
              onDecrease={() => onQuantityChange(quantity - 1)}
              isInStock={item.isInStock}
            />
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.addToCartButton, styles.outOfStockButton]}
          disabled={true}
        >
          <Text style={[styles.addToCartText, styles.outOfStockText]}>
            Out of Stock
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
));

const processedProducts = products.map((product) => {
  const stockInfo = stockData.find(
    (item) => item["Product ID"] === product["Product ID"]
  );
  return {
    ...product,
    isInStock: stockInfo?.["Stock Available"] !== "False",
    uniqueId: `${product["Product ID"]}`,
  };
});

const LoadingIndicator = React.memo(() => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#9747FF" />
  </View>
));

const ListHeader = React.memo(({ displayedProducts }) => (
  <View style={styles.headerContainer}>
    <View style={styles.img}>
      <Image
        source={require("../../assets/p1.png")}
        defaultSource={require("../../assets/p1.png")}
        style={styles.img2}
        loading="lazy"
      />
    </View>
    <View style={[styles.headerSection, styles.headerSpacing]}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>
          Showing {displayedProducts.length} of {products.length} items
        </Text>
        <Stock stockData={stockData} />
      </View>
    </View>
  </View>
));

const ProductList = () => {
  const { addToCart, removeFromCart, isInCart, updateQuantity, getQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation();
  const handleQuantityChange = useCallback((item, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(item["Product ID"]);
    } else {
      if (!isInCart(item["Product ID"])) {
        addToCart(item);
      }
      updateQuantity(item["Product ID"], newQuantity);
    }
  }, [addToCart, removeFromCart, updateQuantity, isInCart]);

  const loadMoreProducts = useCallback(() => {
    if (loading || currentPage * ITEMS_PER_PAGE >= processedProducts.length) return;

    setLoading(true);
    
    setTimeout(() => {
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newProducts = processedProducts.slice(startIndex, endIndex);

      requestAnimationFrame(() => {
        setDisplayedProducts(prev => [...prev, ...newProducts]);
        setCurrentPage(prev => prev + 1);
        setLoading(false);
      });
    }, 500);
  }, [currentPage, loading]);

  useEffect(() => {
    loadMoreProducts();
  }, []);

  const renderItem = useCallback(({ item }) => {
    const quantity = getQuantity(item["Product ID"]);
    
    return (
      <ProductItem
        item={item}
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
        isInCart={isInCart(item["Product ID"])}
        quantity={quantity}
        onQuantityChange={(newQuantity) => handleQuantityChange(item, newQuantity)}
      />
    );
  }, [isInCart, handleQuantityChange, getQuantity, navigation]);

  const keyExtractor = useCallback((item) => item.uniqueId, []);

  const getItemLayout = useCallback((_, index) => ({
    length: 320,
    offset: 320 * Math.floor(index / 2),
    index,
  }), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={LOADING_THRESHOLD}
        ListHeaderComponent={<ListHeader displayedProducts={displayedProducts} />}
        ListFooterComponent={loading ? <LoadingIndicator /> : null}
        ListFooterComponentStyle={styles.footerStyle}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        windowSize={5}
        initialNumToRender={6}
        getItemLayout={getItemLayout}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    height: 140,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    padding: 0,
    margin: 0,
  },
  headerTitleContainer: {
    height: "100%",
    width: "100%",
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
  },
  headerSection: {
    borderBottomColor: "#eee",
    width: "100%",
    height: 20,
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: 14,
    color: "#666",
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  productsGrid: {
    paddingBottom: 30,
    padding: 0,
    margin: 0,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  saveTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#9747FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saveText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    height: 40,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: "#666",
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#9747FF",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  removeFromCartButton: {
    backgroundColor: "#9747FF",
    borderColor: "#9747FF",
  },
  outOfStockButton: {
    backgroundColor: "white",
    borderColor: "#CBA3FF",
  },
  addToCartText: {
    color: "#9747FF",
    fontSize: 12,
    fontWeight: "500",
  },
  removeFromCartText: {
    color: "#FFF",
  },
  outOfStockText: {
    color: "#CBA3FF",
  },
  img: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: 120,
    overflow: "hidden",
  },
  img2: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  loadingContainer: {
    width: SCREEN_WIDTH,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  footerStyle: {
    marginTop: 8,
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#9747FF',
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9747FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#CBA3FF',
  },
  quantityButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityButtonTextDisabled: {
    color: '#FFF',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 12,
    color: '#9747FF',
  },
  cartControlContainer: {
    width: '100%',
  },
});

export default React.memo(ProductList);