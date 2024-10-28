import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';

const CountdownTimer = ({ provider, tat }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0
  });
  const [deliveryInfo, setDeliveryInfo] = useState({
    day: '',
    date: ''
  });
  const [isSameDay, setIsSameDay] = useState(false);

  useEffect(() => {
    const calculateDeliveryTime = () => {
      const now = new Date();
      let cutoffTime = new Date();
      let deliveryDate = new Date();
      let sameDayPossible = false;
      let useTatDelivery = false;

      if (provider === "Provider A") {
        cutoffTime.setHours(17, 0, 0); // 5 PM cutoff
        if (now > cutoffTime) {
          // If past cutoff, use TAT from JSON
          useTatDelivery = true;
          deliveryDate.setDate(deliveryDate.getDate() + tat);
        } else {
          sameDayPossible = true;
        }
      } else if (provider === "General Partners") {
        useTatDelivery = true;
        deliveryDate.setDate(deliveryDate.getDate() + tat);
      } else if (provider === 'Provider B') {
        cutoffTime.setHours(9, 0, 0); // 9 AM cutoff
        if (now > cutoffTime) {
          deliveryDate.setDate(deliveryDate.getDate() + 1);
        } else {
          sameDayPossible = true;
        }
      }

      // Skip weekends for TAT-based delivery
      if (useTatDelivery) {
        while (deliveryDate.getDay() === 0) { // Skip Sundays
          deliveryDate.setDate(deliveryDate.getDate() + 1);
        }
        sameDayPossible = false;
      }

      setIsSameDay(sameDayPossible);

      // Calculate time remaining until cutoff only for same day delivery
      if (sameDayPossible) {
        const timeDiff = cutoffTime - now;
        if (timeDiff > 0) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft({ hours, minutes });
        }
      }

      // Format the delivery date
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${deliveryDate.getDate()} ${months[deliveryDate.getMonth()]}`;

      // Calculate if it's next day delivery
      const isNextDay = deliveryDate.getDate() - now.getDate() === 1 ||
        (now.getDate() === lastDayOfMonth(now) && deliveryDate.getDate() === 1);

      // Set delivery info based on calculated date
      if (sameDayPossible) {
        setDeliveryInfo({
          day: 'Today',
          date: formattedDate
        });
      } else if (isNextDay && deliveryDate.getDay() !== 0 && !useTatDelivery) {
        setDeliveryInfo({
          day: 'Tomorrow',
          date: formattedDate
        });
      } else {
        setDeliveryInfo({
          day: days[deliveryDate.getDay()],
          date: formattedDate
        });
      }
    };

    // Helper function to get last day of month
    const lastDayOfMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    calculateDeliveryTime();
    const timer = setInterval(calculateDeliveryTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [provider, tat]);

  return (
    <View style={styles.container}>
      <Clock size={16} color="#15803d" />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {isSameDay ? (
            <>
              Order within <Text style={styles.boldText}>{timeLeft.hours} hrs {timeLeft.minutes} mins</Text> to get it by Today
            </>
          ) : (
            <>
              {provider === "General Partners" || (provider === "Provider A" && !isSameDay) ? (
                <>
                  Estimated delivery by{' '}
                  <Text style={styles.boldText}>
                    {deliveryInfo.day}, {deliveryInfo.date} ({tat} days)
                  </Text>
                </>
              ) : (
                <>
                  Get it by{' '}
                  <Text style={styles.boldText}>
                    {deliveryInfo.day === 'Tomorrow' ? 
                      `Tomorrow, ${deliveryInfo.date}` : 
                      `${deliveryInfo.day}, ${deliveryInfo.date}`}
                  </Text>
                </>
              )}
            </>
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: "flex-start",
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    padding: 16,
    paddingLeft: 2,
    paddingTop: 2,
    borderRadius: 8,
    gap: 8,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: '#15803d',
  },
  boldText: {
    fontWeight: '600',
  },
});

export default CountdownTimer;