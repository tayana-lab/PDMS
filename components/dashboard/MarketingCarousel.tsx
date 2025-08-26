import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useAppSettings } from '@/hooks/useAppSettings';

const { width } = Dimensions.get('window');

// Sample banner images - replace with your actual image URLs
const bannerImages = [
  'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ey3mskj2ddqzez0hlke95',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=800&h=400&fit=crop'
];

export default function MarketingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useAppSettings();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;
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

  const handleBannerPress = (index: number) => {
    console.log('Banner pressed:', index);
    // Handle banner press
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
        {bannerImages.map((imageUrl, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bannerSlide}
            onPress={() => handleBannerPress(index)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: imageUrl }} style={styles.bannerImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.indicators}>
        {bannerImages.map((_, index) => (
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
  scrollContainer: {
    paddingHorizontal: Spacing.lg
  },
  bannerSlide: {
    width: width - (Spacing.lg * 2),
    marginRight: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden'
  },
  bannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover'
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