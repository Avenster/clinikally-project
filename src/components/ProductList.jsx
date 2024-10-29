import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import products from "../../assets/products.json";
import stockData from "../../assets/stock.json";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "./layout/CartContext";
import Stock from "./Stock";

const ITEMS_PER_PAGE = 10;
const LOADING_THRESHOLD = 0.5;

const ProductList = () => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const navigation = useNavigation();

  // Pre-process products with stock information
  const processedProducts = useMemo(() => {
    return products.map((product) => {
      const stockInfo = stockData.find(
        (item) => item["Product ID"] === product["Product ID"]
      );
      return {
        ...product,
        isInStock: stockInfo?.["Stock Available"] !== "False",
        uniqueId: `${product["Product ID"]}`,
      };
    });
  }, []);

  // Calculate if there are more products to load
  const hasMore = useMemo(() => {
    return currentPage * ITEMS_PER_PAGE < processedProducts.length;
  }, [currentPage, processedProducts.length]);

  // Load more products function
  const loadMoreProducts = useCallback(() => {
    if (!hasMore || loading) return;

    setLoading(true);
    
    // Calculate the next batch of products
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newProducts = processedProducts.slice(startIndex, endIndex);

    // Delay to show loading state
    setTimeout(() => {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setCurrentPage(prev => prev + 1);
      setLoading(false);
      
      if (initialLoading) {
        setInitialLoading(false);
      }
    }, 500);
  }, [currentPage, hasMore, loading, processedProducts, initialLoading]);

  // Initial load
  useEffect(() => {
    loadMoreProducts();
  }, []);

  const renderItem = useCallback(({ item }) => {
    const productInCart = isInCart(item["Product ID"]);

    const handleCartAction = () => {
      if (productInCart) {
        removeFromCart(item["Product ID"]);
      } else {
        addToCart(item);
      }
    };

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/p5.png")}
            defaultSource={require("../../assets/p5.png")}
            style={styles.productImage}
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
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                productInCart && styles.removeFromCartButton,
              ]}
              onPress={handleCartAction}
            >
              <Text
                style={[
                  styles.addToCartText,
                  productInCart && styles.removeFromCartText,
                ]}
              >
                {productInCart ? "Remove from Cart" : "Add to Cart"}
              </Text>
            </TouchableOpacity>
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
    );
  }, [isInCart, removeFromCart, addToCart, navigation]);

  const ListHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <View style={styles.img}>
        <Image
          source={require("../../assets/p1.png")}
          defaultSource={require("../../assets/p1.png")}
          style={styles.img2}
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
  ), [displayedProducts.length]);

  const ListFooter = useCallback(() => {
    if (!hasMore && displayedProducts.length > 0) {
      return (
        <View style={styles.endMessageContainer}>
          <Text style={styles.endMessage}>No more products to load</Text>
        </View>
      );
    }

    if (loading && !initialLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#9747FF" />
        </View>
      );
    }

    return null;
  }, [loading, hasMore, initialLoading, displayedProducts.length]);

  if (initialLoading) {
    return (
      <View style={styles.initialLoaderContainer}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  const handleEndReached = () => {
    if (!loading && hasMore) {
      loadMoreProducts();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.uniqueId}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        onEndReached={handleEndReached}
        onEndReachedThreshold={LOADING_THRESHOLD}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListFooterComponentStyle={styles.footerComponentStyle}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
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
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  initialLoaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endMessageContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endMessage: {
    color: "#666",
    fontSize: 14,
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
});

export default ProductList;