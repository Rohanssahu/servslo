// LocationPickerScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";

const LocationPickerScreen: React.FC = () => {
  const [region, setRegion] = useState({
    latitude: 19.1712,
    longitude: 72.9565,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker coordinate={region}>
          <View style={styles.pinContainer}>
            <Image
              source={require("../../assets/icons/pin.png")}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
          </View>
        </Marker>
      </MapView>

      {/* Floating instruction */}
      <View style={styles.instruction}>
        <Text style={styles.instructionText}>
          Move the pin to place accurately
        </Text>
      </View>

      {/* Locate me button */}
      <TouchableOpacity style={styles.locateBtn}>
        <Text style={styles.locateBtnText}>Locate me</Text>
      </TouchableOpacity>

      {/* Bottom card */}
      <View style={styles.bottomSheet}>
        <View style={styles.dragIndicator} />
        <View style={styles.bottomContent}>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceTitle}>Service not available here</Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.serviceSub}>
            Sorry! We're not in your area just yet, but we're working on it.
          </Text>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmBtnDisabled} disabled>
          <Text style={styles.confirmBtnTextDisabled}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationPickerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1 },
  pinContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  instruction: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    backgroundColor: "#0B1033",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  instructionText: { color: "#fff", fontSize: 14 },
  locateBtn: {
    position: "absolute",
    bottom: 180,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  locateBtnText: { fontSize: 16, color: "#0B1033" },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  dragIndicator: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  bottomContent: { marginBottom: 20 },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0B1033",
  },
  changeText: { fontSize: 14, color: "#5B21B6", fontWeight: "500" },
  serviceSub: { fontSize: 14, color: "#6B7280" },
  confirmBtnDisabled: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 8,
  },
  confirmBtnTextDisabled: {
    textAlign: "center",
    color: "#9CA3AF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
