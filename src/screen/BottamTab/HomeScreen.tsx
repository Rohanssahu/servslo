import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import ScreenNameEnum from "../../routes/screenName.enum";
import LinearGradient from "react-native-linear-gradient";
import BottomSheet from "@gorhom/bottom-sheet";
import ServiceBottomSheet, { ServiceBottomSheetRef } from "../Feature/ServiceBottomSheet";
import QuickServiceCards from "../Feature/QuickServiceCard";
import SearchBar from "../Feature/SearchBar";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.round((width - 64) / 3); // three small promo cards inside a horizontal area

export default function HomeScreen({navigation}) {

  const sheetRef = useRef<ServiceBottomSheetRef>(null);


  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchText);
    // Here you can filter services or call API
  };

  const isFocus = useIsFocused()

  useEffect(()=>{
    sheetRef.current?.close()
  },[isFocus])
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.purple} />
     <LinearGradient
            colors={['#6E39F7', '#8E57FF', '#B78CFF']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 1 }} style={styles.topBar}>
    

        <TouchableOpacity
        onPress={()=>{
          navigation.navigate(ScreenNameEnum.AddressesScreen)
        }}
        style={styles.addressBlock}>
          <Text style={styles.addressLabel}>Address</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            404 Applications Numbf Muland Road...
          </Text>
        </TouchableOpacity>

        <View style={styles.topButtons}>
          <TouchableOpacity
          
          
          onPress={()=>{
            
            navigation.navigate(ScreenNameEnum.ReferralScreen)
          }}
          style={styles.earnBtn}>
            <Text style={styles.earnText}>Earn ₹50</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={()=>{
            navigation.navigate(ScreenNameEnum.WalletScreen)
          }}
          style={styles.walletBtn}>
            <Text style={styles.walletText}>₹0</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <QuickServiceCards />
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        onSearch={handleSearch}
      />
        
        <View style={{flex:1,padding:10}}>
              {/* Snabbit card */}
              <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.brand}>ServsLo</Text>
            <View style={styles.nowBadge}><Text style={styles.nowText}>NOW</Text></View>
          </View>

          <Text style={styles.arriveText}>Arriving in <Text style={{color: colors.pink}}>⚡ 10 min</Text></Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll} contentContainerStyle={{paddingVertical: 12}}>
            {[
              { time: "60 min", price: "₹149", old: "₹169", off: "11% OFF" },
              { time: "90 min", price: "₹219", old: "₹255", off: "14% OFF" },
              { time: "120 min", price: "₹289", old: "₹320", off: "10% OFF" },
            ].map((p, i) => (
              <View key={i} style={styles.promoCard}>
                <View style={styles.offBadge}><Text style={styles.offText}>{p.off}</Text></View>
                <Text style={styles.promoTime}>{p.time}</Text>
                <Text style={styles.promoPrice}>{p.price} <Text style={styles.oldPrice}>{p.old}</Text></Text>
                <TouchableOpacity 
                
                
                onPress={()=>{
                  sheetRef.current?.open()
                }}
                style={styles.bookBtn}><Text style={styles.bookBtnText}>Book</Text></TouchableOpacity>
              </View>
            ))}
            
          </ScrollView>
        </View>
        {/* Most booked services */}
<View style={styles.card}>
  <Text style={styles.sectionTitle}>Most booked services</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingVertical: 12 }}
  >
    {[
      {
        title: "Intense bathroom cleaning",
        rating: "4.79",
        reviews: "2.8M",
        price: "₹519",
        image: require("../../assets/images/bathromm.jpeg"),
      },
      {
        title: "Intense cleaning (2 bathrooms)",
        rating: "4.79",
        reviews: "2.8M",
        price: "₹950",
        oldPrice: "₹1,038",
        off: "8% OFF",
        image: require("../../assets/images/bathromm.jpeg"),
      },
      {
        title: "Automatic washing machine cleaning",
        rating: "4.80",
        reviews: "319K",
        price: "₹160",
        image: require("../../assets/images/bathromm.jpeg"),
      },
    ].map((item, index) => (
      <TouchableOpacity key={index} style={styles.serviceCard}>
        {item.off && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.off}</Text>
          </View>
        )}
        <Image source={item.image} style={styles.serviceImg} />
        <Text style={styles.serviceTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.serviceRating}>
          ⭐ {item.rating} ({item.reviews})
        </Text>
        <Text style={styles.servicePrice}>
          {item.price}{" "}
          {item.oldPrice && (
            <Text style={styles.oldPrice}>{item.oldPrice}</Text>
          )}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>


             {/* Services */}
             <View style={styles.card}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <Text style={styles.sectionSub}>Avail one or multiple services in your booking</Text>

          <View style={styles.servicesRow}>
            <TouchableOpacity style={styles.bigService}>
              <Text style={styles.bigServiceText}>Everyday{"\n"}Cleaning</Text>
              <Image source={require("../../assets/images/mop.png")} style={styles.serviceImage} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.bigService}>
              <Text style={styles.bigServiceText}>Weekly{"\n"}Cleaning</Text>
              <Image source={require("../../assets/images/cleaning.jpg")} style={styles.serviceImage} />
            </TouchableOpacity>
          </View>

          <View style={styles.smallServicesRow}>
            {[
              { label: "Laundry", img: require("../../assets/images/laundry.jpg") },
              { label: "Dishwashing", img: require("../../assets/images/laundry.jpg") },
              { label: "Bathroom", img: require("../../assets/images/laundry.jpg") },
              { label: "Kitchen Prep", img: require("../../assets/images/laundry.jpg") },
            ].map((s, i) => (
              <TouchableOpacity key={i} style={styles.smallService}>
                <Image source={s.img} style={styles.smallServiceImg} />
                <Text style={styles.smallServiceLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Card with rounded image */}
        <View style={[styles.card, {overflow: "hidden"}]}>
          <View style={styles.infoRow}>
            <View style={{flex:1}}>
              <Text style={styles.infoTitle}>Trained Professional</Text>
              <Text style={styles.infoDesc}>Equipped with the latest best practices to deliver top-notch services</Text>
            </View>
            <Image source={require("../../assets/images/glove.jpg")} style={styles.infoImage} />
          </View>
        </View>


        {/* Categories Grid */}
<View style={styles.card}>
  <View style={styles.categoriesGrid}>
    {[
      { label: "Women's Salon", img: require("../../assets/images/cleaning.jpg") },
      { label: "Men's Salon & Massage", img: require("../../assets/images/cleaning.jpg") },
      { label: "AC & Appliance Repair", img: require("../../assets/images/cleaning.jpg") },
      { label: "Cleaning", img: require("../../assets/images/cleaning.jpg") },
      { label: "Electrician, Plumber & Carpenter", img: require("../../assets/images/cleaning.jpg") },
      { label: "Native Water Purifier", img: require("../../assets/images/cleaning.jpg") },
    ].map((cat, idx) => (
      <TouchableOpacity key={idx} style={styles.categoryItem}>
        <Image source={cat.img} style={styles.categoryIcon} />
        <Text style={styles.categoryLabel}>{cat.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

{/* Horizontal section - Salon for Women */}
<View style={styles.card}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Salon for Women</Text>
    <Text style={styles.seeAll}>See all</Text>
  </View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {[
      { label: "Waxing", img: require("../../assets/images/cleaning.jpg") },
      { label: "Cleanup", img: require("../../assets/images/cleaning.jpg") },
      { label: "Manicure", img: require("../../assets/images/cleaning.jpg") },
    ].map((srv, idx) => (
      <TouchableOpacity key={idx} style={styles.horizontalCard}>
        <Image source={srv.img} style={styles.horizontalImg} />
        <Text style={styles.horizontalLabel}>{srv.label}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>

{/* Horizontal section - Appliance repair */}
<View style={styles.card}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Appliance repair & service</Text>
    <Text style={styles.seeAll}>See all</Text>
  </View>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {[
      { label: "AC Service and Repair", img: require("../../assets/images/cleaning.jpg") },
      { label: "Washing Machine Repair", img: require("../../assets/images/cleaning.jpg") },
      { label: "Water Purifier Repair", img: require("../../assets/images/cleaning.jpg") },
    ].map((srv, idx) => (
      <TouchableOpacity key={idx} style={styles.horizontalCard}>
        <Image source={srv.img} style={styles.horizontalImg} />
        <Text style={styles.horizontalLabel}>{srv.label}</Text>
      </TouchableOpacity>
    ))}
    
  </ScrollView>
</View>
        <View style={{height: 16}} />
</View>
        </ScrollView>
     

      {/* Floating promo banner above tab */}
      <LinearGradient
            colors={['#6E39F7', '#8E57FF', '#B78CFF']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 1 }}  style={styles.promoBanner}>
        <View style={styles.promoLeft}>
          <Image source={require("../../assets/images/glove.jpg")} style={styles.promoIcon} />
          <View style={{marginLeft: 12}}>
            <Text style={styles.promoTitle}>Buy STARTER PACK</Text>
            <Text style={styles.promoTimer}>Valid For 14h: 43m: 49s</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.promoBuy}>
          <Text style={styles.promoBuyText}>Buy for ₹149</Text>
        </TouchableOpacity>
      </LinearGradient>
      <ServiceBottomSheet
        ref={sheetRef}
        onClose={() => console.log('Sheet closed')}
      />
    </SafeAreaView>
  );
}

/* ---------- styles & colors ---------- */
const colors = {
  purple: "#5A2EA6",
  lightPurple: "#f3eef9",
  cardBg: "#fff",
  grayText: "#6b6b7b",
  pink: "#ff2d7a",
  softBg: "#f6f5fb",
  pillBg: "#eef3ff",
  brand: "#ff2d7a",
};

const styles = StyleSheet.create({
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: "#333",
  },
  
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5A2EA6",
  },
  
  horizontalCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f1f4",
  },
  horizontalImg: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  horizontalLabel: {
    fontSize: 13,
    fontWeight: "600",
    padding: 6,
    textAlign: "center",
  },
  
  serviceCard: {
    width: CARD_WIDTH + 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#f1f1f4",
    padding: 8,
  },
  serviceImg: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    resizeMode: "cover",
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
  serviceRating: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  oldPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#e8fbf0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 1,
  },
  discountText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#21865b",
  },
  
  safe: {
    flex: 1,
    backgroundColor: colors.softBg,
  },
  topBar: {
    backgroundColor: colors.purple,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight+20 || 16 : 16,
    paddingBottom: 18,
   
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
  },
  addressBlock: {
    flex: 1,
    marginLeft: 12,
  },
  addressLabel: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 2,
  },
  addressText: {
    color: "#fff",
    opacity: 0.9,
  },
  topButtons: {
    flexDirection: "row",
    gap: 8,
  },
  earnBtn: {
    backgroundColor: "#6f3bd7",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 18,
    marginRight: 8,
  },
  earnText: { color: "#fff", fontWeight: "700" },
  walletBtn: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 18,
  },
  walletText: { color: colors.purple, fontWeight: "700" },

  container: {

    paddingBottom: 96,
  },

  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    // shadow
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  brand: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ff2d7a",
  },
  nowBadge: {
    marginLeft: 8,
    backgroundColor: "#ff2d7a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nowText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  arriveText: {
    marginTop: 8,
    color: colors.grayText,
    fontWeight: "600",
  },

  promoScroll: {
    marginTop: 8,
  },

  promoCard: {
    width: CARD_WIDTH + 16,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  offBadge: {
    backgroundColor: "#e8fbf0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    position: "absolute",
    top: 8,
    left: 8,
  },
  offText: { color: "#21865b", fontWeight: "700", fontSize: 11 },
  promoTime: { marginTop: 12, fontWeight: "800", fontSize: 18, color: "#111" },
  promoPrice: { marginTop: 6, fontSize: 14, fontWeight: "800" },
  oldPrice: { textDecorationLine: "line-through", color: "#b0b0b5", fontWeight: "600", fontSize: 12 },

  bookBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ff2d7a",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  bookBtnText: {
    color: "#ff2d7a",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    color:colors.brand
  },
  sectionSub: {
    color: "#777",
    marginBottom: 12,
  },

  slotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  slotCard: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#f1f1f4",
  },
  slotMuted: {
    opacity: 0.5,
  },
  slotImg: { width: 48, height: 48, resizeMode: "contain" },
  slotLabel: { marginTop: 8, fontWeight: "700" },
  slotLabelMuted: { color: "#9aa0b2" },

  servicesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  bigService: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    minHeight: 110,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#f1f1f4",
  },
  bigServiceText: { fontWeight: "800", fontSize: 16, flex: 1 },
  serviceImage: { width: 80, height: 80, resizeMode: "contain", alignSelf: "flex-end" },

  smallServicesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    justifyContent: "space-between",
  },
  smallService: {
    width: Math.round((width - 64) / 4),
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f1f1f4",
  },
  smallServiceImg: { width: 48, height: 48, resizeMode: "contain" },
  smallServiceLabel: { marginTop: 6, textAlign: "center", fontSize: 12 },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8,color:colors.purple},
  infoDesc: { color: "#000" },
  infoImage: { width: 96, height: 96, resizeMode: "contain", marginLeft: 12 },

  expertsTitle: { fontWeight: "800", fontSize: 16 },

  /* promo banner */
  promoBanner: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#2d6aff",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderBottomRightRadius:0,
    borderBottomLeftRadius:0,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // shadow
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  promoLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  promoIcon: { width: 48, height: 48, resizeMode: "contain" },
  promoTitle: { color: "#fff", fontWeight: "800" },
  promoTimer: { color: "#dfe9ff", marginTop: 2 },
  promoBuy: { backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginLeft: 12 },
  promoBuyText: { color: "#000", fontWeight: "800" },

  /* bottom tab */
  tabBar: {
    height: 64,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  tabItem: { alignItems: "center" },
  tabIcon: { width: 24, height: 24, resizeMode: "contain", marginBottom: 4, tintColor: "#666" },
  tabLabel: { fontSize: 12, color: "#666" },
});
