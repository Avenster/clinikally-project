import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import products from '../../assets/products.json';
import stockData from '../../assets/stock.json';
import { useNavigation } from "@react-navigation/native";
import { useCart } from './layout/CartContext';

const ProductItem = memo(({ product, onAddToCart, onRemoveFromCart, isInCart }) => {
  const handleCartAction = () => {
    if (isInCart) {
      onRemoveFromCart(product['Product ID']);
    } else {
      onAddToCart(product);
    }
  };

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/p5.png')}
          defaultSource={require('../../assets/p5.png')}
          style={styles.productImage}
        />
        <View style={styles.saveTag}>
          <Text style={styles.saveText}>SAVE 15%</Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product['Product Name']}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{product.Price}</Text>
          <Text style={styles.originalPrice}>
            ₹{(parseFloat(product.Price) * 1.2).toFixed(2)}
          </Text>
        </View>
        {product.isInStock ? (
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              isInCart && styles.removeFromCartButton
            ]}
            onPress={handleCartAction}
          >
            <Text style={[
              styles.addToCartText,
              isInCart && styles.removeFromCartText
            ]}>
              {isInCart ? 'Remove from Cart' : 'Add to Cart'}
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
});

const ProductList = () => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [totalAvailableProducts, setTotalAvailableProducts] = useState(0);
  const [totalProducts, setTotalProducts] = useState(products.length);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  useEffect(() => {
    calculateTotalAvailableProducts();
    loadMoreProducts();
    setLoading(false);
  }, []);

  const calculateTotalAvailableProducts = () => {
    let availableProducts = 0;
    products.forEach((product) => {
      const stockInfo = stockData.find(item => item["Product ID"] === product["Product ID"]);
      const isInStock = stockInfo?.["Stock Available"] !== "False";
      if (isInStock) {
        availableProducts++;
      }
    });
    setTotalAvailableProducts(availableProducts);
    setTotalProducts(products.length);
  };

  const loadMoreProducts = () => {
    if (!hasMore || loading) return;

    setLoading(true);
    
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newProducts = products.slice(startIndex, endIndex).map((product, index) => {
      const stockInfo = stockData.find(item => item["Product ID"] === product["Product ID"]);
      const isInStock = stockInfo?.["Stock Available"] !== "False";
      if (isInStock) {
        setTotalAvailableProducts(prev => prev + 1);
      }

      return {
        ...product,
        isInStock,
        uniqueId: `${startIndex + index}-${product['Product ID']}`
      };
    });

    if (endIndex >= products.length) {
      setHasMore(false);
    }

    setTimeout(() => {
      setDisplayedProducts(prev => [...prev, ...newProducts]);
      setCurrentPage(prev => prev + 1);
      setLoading(false);
    }, 500);
  };

  const handleEndReached = () => {
    loadMoreProducts();
  };

  const renderHeader = useMemo(() => {
    const availabilityPercentage = (totalAvailableProducts / totalProducts) * 100;

    return (
      <View style={styles.headerContainer}>
        <View style={styles.img}>
          <Image
            source={require('../../assets/p1.png')}
            defaultSource={require('../../assets/p1.png')}
            style={styles.img2}
          />
        </View>
        <View style={[styles.headerSection, styles.headerSpacing]}>
          <Text style={styles.headerTitle}>
            Showing {displayedProducts.length} of {totalProducts} items  (<Text style={styles.boldText}>{availabilityPercentage.toFixed(2)}%available</Text> )
          </Text>
        </View>
      </View>
    );
  }, [displayedProducts.length, totalProducts, totalAvailableProducts]);

  const renderFooter = () => {
    if (!loading && !hasMore) {
      return (
        <View style={styles.endMessageContainer}>
          <Text style={styles.endMessage}>No more products to load</Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#9747FF" />
        </View>
      );
    }

    return null;
  };

  if (loading && displayedProducts.length === 0) {
    return (
      <View style={styles.initialLoaderContainer}>
        <ActivityIndicator size="large" color="#9747FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={displayedProducts}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            isInCart={isInCart(item['Product ID'])}
          />
        )}
        keyExtractor={item => item.uniqueId}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={styles.footerComponentStyle}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10} // Render 10 items initially
        maxToRenderPerBatch={5} // Render 5 items per batch
        updateCellsBatchingPeriod={50} // Update cells every 50ms
        windowSize={11} // Render 11 viewable items
        removeClippedSubviews={true} // Improves scroll performance
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: '100%',
    height: 140,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    padding: 0,
    margin: 0,
  },
  headerSection: {
    borderBottomColor: '#eee',
    width: '100%',
    height: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerSpacing: {
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 14,
    color: '#666',
  },
  productsGrid: {
    paddingBottom: 30,
    padding: 0,
    margin: 0,
  },
  img: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 120,
    overflow: 'hidden',
  },
  img2: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  saveTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#9747FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    height: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  removeFromCartButton: {
    backgroundColor: '#9747FF',
    borderColor: '#9747FF',
  },
  removeFromCartText: {
    color: '#FFF',
  },
  addToCartButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#9747FF',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  outOfStockButton: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  addToCartText: {
    color: '#9747FF',
    fontSize: 12,
    fontWeight: '500',
  },
  outOfStockText: {
    color: '#FFF',
  },
  initialLoaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  loaderContainer: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  footerComponentStyle: {
    marginVertical: 10,
    marginBottom: 10,
  },
  endMessageContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  endMessage: {
    color: '#666',
    fontSize: 14,
  },boldText: {
    fontWeight: 'bold',
  },
});

export default ProductList;