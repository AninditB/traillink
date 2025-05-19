import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import SlidingUpPanel from 'rn-sliding-up-panel';

const { height } = Dimensions.get('window');

const NavigateScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [distance, setDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pace, setPace] = useState('0:00');
  const [speed, setSpeed] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  const [tracking, setTracking] = useState(false);
  const _panel = useRef(null);
  const startTime = useRef(null);
  const prevLocation = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      setUserLocation(location.coords);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (tracking) {
      startTime.current = Date.now();
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.current) / 1000));
      }, 1000);
      startTracking();
    } else {
      clearInterval(interval);
      stopTracking();
    }
    return () => clearInterval(interval);
  }, [tracking]);

  const startTracking = async () => {
    await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 1 },
      (location) => {
        if (prevLocation.current) {
          const newDistance = getDistance(prevLocation.current, location.coords);
          setDistance((prev) => prev + newDistance);

          const elevationChange = location.coords.altitude - prevLocation.current.altitude;
          if (elevationChange > 0) setElevationGain((prev) => prev + elevationChange);

          setSpeed(location.coords.speed * 2.237); // Convert m/s to MPH
          setPace(calculatePace(distance, elapsedTime));
        }
        prevLocation.current = location.coords;
      }
    );
  };

  const stopTracking = () => {
    prevLocation.current = null;
  };

  const getDistance = (prev, curr) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRad(prev.latitude);
    const φ2 = toRad(curr.latitude);
    const Δφ = toRad(curr.latitude - prev.latitude);
    const Δλ = toRad(curr.longitude - prev.longitude);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c) / 1609.34; // Convert to miles
  };

  const calculatePace = (distance, time) => {
    if (distance === 0) return '0:00';
    const paceInMinutes = (time / 60) / distance;
    const minutes = Math.floor(paceInMinutes);
    const seconds = Math.round((paceInMinutes - minutes) * 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={region => setRegion(region)}
        showsUserLocation={true}
        showsTraffic={true}
        showsPointsOfInterest={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
      >
        {userLocation && (
          <Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            title="Your Location"
            description="You are here"
          />
        )}
      </MapView>

      <SlidingUpPanel
        ref={_panel}
        draggableRange={{ top: height * 0.3, bottom: 60 }}
        animatedValue={new Animated.Value(0)}
        showBackdrop={false}
      >
        <View style={styles.panel}>
          <View style={styles.panelHandle} />
          <View style={styles.statsContainer}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{new Date(elapsedTime * 1000).toISOString().substr(14, 5)}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{distance.toFixed(2)} mi</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{elevationGain.toFixed(0)} ft</Text>
              <Text style={styles.statLabel}>Elev. gain</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>—</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{pace}/mi</Text>
              <Text style={styles.statLabel}>Pace</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{speed.toFixed(1)} MPH</Text>
              <Text style={styles.statLabel}>Speed</Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Add route</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.startButton]} 
              onPress={() => setTracking(!tracking)}
            >
              <Text style={styles.buttonText}>{tracking ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SlidingUpPanel>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  panel: {
    backgroundColor: '#1f1e1e',
    position: 'absolute',
    height: height * 0.3,
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statsContainerSecondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBlock: {
    width: '33%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
    color: 'white',
    opacity: 0.75,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#2a2929',
    padding: 12,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#10ac84',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NavigateScreen;
