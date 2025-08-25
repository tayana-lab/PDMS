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
const cardWidth = width - (Spacing.lg * 2);

export default function MarketingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % marketingAds.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (cardWidth + Spacing.lg),
          animated: true
        });
        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleEventPress = (eventId: number) => {
    console.log('Event pressed:', eventId);
    // Navigate to event details
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (cardWidth + Spacing.lg));
          setCurrentIndex(index);
        }}
        contentContainerStyle={styles.scrollContainer}
      >
        {marketingAds.map((ad) => (
          <TouchableOpacity
            key={ad.id}
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
  title: {
    ...Typography.subtitle,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg
  },
  scrollContainer: {
    paddingHorizontal: Spacing.lg
  },
  card: {
    width: cardWidth,
    marginRight: Spacing.lg,
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