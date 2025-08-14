// QuickServiceCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ServiceCardProps = {
  title: string;
  subtitle: string;
  iconName: string;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ title, subtitle, iconName }) => {
  return (
    <View style={styles.card}>
      <Ionicons name={iconName} size={24} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

export default function QuickServiceCards() {
  return (
    <LinearGradient
    colors={['#6E39F7', '#8E57FF', '#B78CFF']}
    start={{ x: 0.1, y: 0 }}
    end={{ x: 1, y: 1 }}  style={styles.container}>
      <ServiceCard
        title="India’s First Quick-Service App"
        subtitle=""
        iconName="flash-outline"
      />
      <ServiceCard
        title="Trusted by 50,000+ families"
        subtitle=""
        iconName="shield-checkmark-outline"
      />
      <ServiceCard
        title="One booking, Multiple services"
        subtitle=""
        iconName="hand-right-outline"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5B3CC4', // purple background
    paddingVertical:5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    

    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flexShrink: 1,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subtitle: {
    color: '#fff',
    fontSize: 10,
  },
});
