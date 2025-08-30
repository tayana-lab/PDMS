import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function VotersScreen() {
  useEffect(() => {
    // Redirect to search-voter page immediately when this tab is accessed
    router.replace('/search-voter');
  }, []);

  // Return null since we're redirecting
  return null;
}