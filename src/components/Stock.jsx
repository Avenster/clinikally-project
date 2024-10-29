import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Stock = ({ stockData }) => {
  const calculateStockAvailability = (data) => {
    const totalProducts = data.length;
    const inStockCount = data.filter(product => product['Stock Available'] === 'True').length;
    const inStockPercentage = (inStockCount / totalProducts) * 100;
    return inStockPercentage.toFixed(2);
  };

  const inStockPercentage = calculateStockAvailability(stockData);

  return (
    
      <Text style={[styles.text, { fontWeight: 'bold', color: '#AE70FF' }]}>
        ({inStockPercentage}% in stock)
      </Text>
    
  );
};

const styles = StyleSheet.create({

  text: {
    paddingRight:10,
    fontSize: 12.5,
    color: '#AE70FF',
  },
});

export default Stock;