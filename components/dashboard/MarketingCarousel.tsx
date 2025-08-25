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
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { marketingAds } from '@/constants/mockData';
import { useAppSettings } from '@/hooks/useAppSettings';

const { width } = Dimensions.get('window');

export default function MarketingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useAppSettings();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % marketingAds.length;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * (width - (Spacing.lg * 2)),
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
    // Navigate to event details
  };

  return (
    <View style={styles.container}>
      
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (width - (Spacing.lg * 2) + Spacing.lg));
          setCurrentIndex(index);
        }}
        contentContainerStyle={styles.scrollContainer}
      >
        {marketingAds.map((ad) => (
          <TouchableOpacity
            key={ad.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleEventPress(ad.id)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: ad.image }} style={styles.image} />
            <View style={styles.content}>
              <Text style={[styles.eventTitle, { color: colors.text.primary }]}>{ad.title}</Text>
              <Text style={[styles.description, { color: colors.text.secondary }]}>{ad.description}</Text>
              <Text style={[styles.date, { color: colors.primary }]}>{ad.date}</Text>
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
              { backgroundColor: index === currentIndex ? colors.primary : colors.text.light }
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
    width: width - (Spacing.lg * 2),
    marginRight: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
    borderWidth: 1
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
    marginBottom: Spacing.sm
  },
  date: {
    ...Typography.small,
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
    marginHorizontal: 4
  }
});