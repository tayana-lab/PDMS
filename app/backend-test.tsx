import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDashboardAnalytics } from '@/hooks/useApi';

export default function BackendTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dashboardQuery = useDashboardAnalytics();

  const handleTest = async () => {
    setIsLoading(true);
    try {
      await dashboardQuery.refetch();
      if (dashboardQuery.data) {
        setTestResult(`API Test Successful! Found ${dashboardQuery.data.total_applications} applications and ${dashboardQuery.data.total_voters} voters.`);
      } else {
        setTestResult('API connected but no data received.');
      }
    } catch {
      Alert.alert('Error', 'Failed to connect to API');
      setTestResult('API connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Test</Text>
      <Text style={styles.subtitle}>Test your REST API backend connection</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </Text>
      </TouchableOpacity>
      
      {testResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{testResult}</Text>
        </View>
      ) : null}
      
      {dashboardQuery.data ? (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Dashboard Data:</Text>
          <Text style={styles.dataText}>Applications: {dashboardQuery.data.total_applications}</Text>
          <Text style={styles.dataText}>Voters: {dashboardQuery.data.total_voters}</Text>
          <Text style={styles.dataText}>Schemes: {dashboardQuery.data.total_schemes}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },

  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  resultText: {
    color: '#2E7D32',
    fontSize: 16,
    textAlign: 'center',
  },
  dataContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    marginTop: 10,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
    textAlign: 'center',
  },
  dataText: {
    color: '#1976D2',
    fontSize: 14,
    marginBottom: 5,
  },
});