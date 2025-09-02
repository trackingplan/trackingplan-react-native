import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Trackingplan from '@trackingplan/react-native';
import { useRouter } from 'expo-router';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';

export default function MainScreen() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('en-US');
  const [userTier, setUserTier] = useState('free');

  const updateLocale = (newLocale: string) => {
    setCurrentLocale(newLocale);
    Trackingplan.updateTags({
      country: newLocale.split('-')[1] || 'US',
      language: newLocale.split('-')[0] || 'en',
    });
    Alert.alert('Locale Updated', `Tags updated with locale: ${newLocale}`);
  };

  const updateUserTier = (newTier: string) => {
    setUserTier(newTier);
    Trackingplan.updateTags({ user_type: newTier });
    Alert.alert('User Tier Updated', `Tags updated with tier: ${newTier}`);
  };

  const sendFirebaseAnalyticsEvent = async () => {
    try {
      const analytics = getAnalytics();
      await logEvent(analytics, 'button_clicked', {
        timestamp: new Date().toISOString(),
        screen: 'MainScreen',
      });
      Alert.alert(
        'Firebase Event Sent',
        'button_clicked event has been sent to Firebase Analytics'
      );
    } catch (error) {
      Alert.alert('Error', `Failed to send event: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trackingplan React Native SDK</Text>
      <Text style={styles.subtitle}>updateTags Demo</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Locale: {currentLocale}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => updateLocale('en-US')}
          >
            <Text style={styles.buttonText}>English (US)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => updateLocale('es-ES')}
          >
            <Text style={styles.buttonText}>Español (ES)</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => updateLocale('fr-FR')}
        >
          <Text style={styles.buttonText}>Français (FR)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current User Tier: {userTier}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => updateUserTier('free')}
          >
            <Text style={styles.buttonText}>Free</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => updateUserTier('premium')}
          >
            <Text style={styles.buttonText}>Premium</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.aboutButton]}
          onPress={() => router.push('/about')}
        >
          <Text style={styles.buttonText}>About</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firebase Analytics</Text>
        <TouchableOpacity
          style={[styles.button, styles.firebaseButton]}
          onPress={sendFirebaseAnalyticsEvent}
        >
          <Text style={styles.buttonText}>Send Firebase Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  section: {
    marginBottom: 30,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  aboutButton: {
    backgroundColor: '#8E8E93',
  },
  firebaseButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
