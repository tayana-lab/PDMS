import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { marketingAds } from '@/constants/mockData';

const { width } = Dimensions.get('window');

export default function MarketingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % marketingAds.length;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * width, // full width per page
            animated: true
          });
        }
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleEventPress = (eventId: number) => {
    console.log('Event pressed:', eventId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {marketingAds.map((ad) => (
          <View key={ad.id} style={{ width }}> 
            {/* full screen page */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleEventPress(ad.id)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: ad.image }} style={styles.image} />
              <View style={styles.content}>
                <Text style={styles.eventTitle}>{ad.title}</Text>
                <Text style={styles.description}>{ad.description}</Text>
                <Text style={styles.date}>{ad.date}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicators}>
        {marketingAds.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg
  },
  card: {
    flex: 1,
    marginHorizontal: Spacing.lg, // keep spacing INSIDE the card, not on the ScrollView
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.border
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover'
  },
  content: {
    padding: Spacing.md
  },
  eventTitle: {
    ...Typography.subtitle,
    marginBottom: Spacing.xs
  },
  description: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm
  },
  date: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600'
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.light,
    marginHorizontal: 4
  },
  activeIndicator: {
    backgroundColor: Colors.primary
  }
});
