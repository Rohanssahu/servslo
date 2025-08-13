import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const colors = {
  bg: "#f6f5fb",
  purple: "#3a1162", // darker for text/button
  accent: "#5A2EA6", // brand purple
  softPurple: "#efe9fb",
  white: "#fff",
  grayText: "#6b6b7b",
  pillBorder: "#eae7f3",
};

export default function WalletScreen({navigation}) {
  const [amount, setAmount] = useState<string>("1000");
  const [activeTab, setActiveTab] = useState<"all" | "add" | "deduct">("all");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Top nav */}
          <View style={styles.topRow}>
            <TouchableOpacity 
            onPress={()=>{
              navigation.goBack()
            }}
            style={styles.backBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.purple} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & Support</Text>
          
          </View>

          {/* Referral banner */}
          <TouchableOpacity style={styles.referral}>
            <View style={styles.refLeft}>
              <View style={styles.gift}>
                <Ionicons name="gift" size={18} color="#fff" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.refTitle}>
                  Earn <Text style={styles.rupee}>₹50</Text> for every referral
                </Text>
              </View>
            </View>
            <View style={styles.refBtn}>
              <Text style={styles.refBtnText}>Refer now</Text>
            </View>
          </TouchableOpacity>

          {/* Wallet card */}
          <View style={styles.walletCard}>
            <View style={styles.walletTop}>
              {/* <Image
                source={require("../../assets/images/wallet.png")}
                style={styles.walletIcon}
                // replace with your wallet image
              /> */}
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={styles.walletLabel}>Wallet Balance</Text>
                <Text style={styles.walletAmount}>₹0</Text>
              </View>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.divider} />

            <View style={styles.splitRow}>
              <View style={styles.splitItem}>
                <Text style={styles.splitLabel}>Cash</Text>
                <Text style={styles.splitAmount}>₹0</Text>
              </View>
              <View style={styles.splitItem}>
                <Text style={styles.splitLabel}>Bonus</Text>
                <Text style={styles.splitAmount}>₹0</Text>
              </View>
            </View>
          </View>

          {/* Add money block */}
          <View style={styles.card}>
            <Text style={styles.addTitle}>Add money to Wallet</Text>

            <View style={styles.inputBox}>
              <Text style={styles.inputSymbol}>₹</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.couponRow}>
              <Text style={styles.couponText}>Have a coupon code?</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.accent} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.proceedBtn}>
              <Text style={styles.proceedText}>Proceed to pay</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions & pills */}
          <View style={styles.card}>
            <View style={styles.pillRow}>
              <TouchableOpacity
                onPress={() => setActiveTab("all")}
                style={[
                  styles.pill,
                  activeTab === "all" && styles.pillActive,
                ]}
              >
                <Text style={[styles.pillText, activeTab === "all" && styles.pillTextActive]}>
                  All transactions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("add")}
                style={[styles.pill, activeTab === "add" && styles.pillActive, { marginLeft: 8 }]}
              >
                <Text style={[styles.pillText, activeTab === "add" && styles.pillTextActive]}>
                  Addition
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("deduct")}
                style={[styles.pill, activeTab === "deduct" && styles.pillActive, { marginLeft: 8 }]}
              >
                <Text style={[styles.pillText, activeTab === "deduct" && styles.pillTextActive]}>
                  Deduction
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions in this category</Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: 16,
    paddingBottom: 48,
    paddingTop:40
  },

  /* Top row */
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    // subtle shadow
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.purple,
  },

  /* referral */
  referral: {
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#f2e9ff",
  },
  refLeft: { flexDirection: "row", alignItems: "center" },
  gift: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#ff6b6b",
    alignItems: "center",
    justifyContent: "center",
  },
  refTitle: { fontWeight: "700", color: "#222" },
  rupee: { color: "#f6a623", fontWeight: "900" },
  refBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  refBtnText: { color: colors.accent, fontWeight: "700" },

  /* wallet card */
  walletCard: {
    marginBottom: 14,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    // shadow
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 12 },
      android: { elevation: 3 },
    }),
  },
  walletTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  walletIcon: { width: 64, height: 64, resizeMode: "contain" },
  walletLabel: { color: colors.grayText, fontWeight: "600" },
  walletAmount: { fontSize: 30, fontWeight: "800", color: colors.purple, marginTop: 6 },

  divider: {
    borderTopWidth: 1,
    borderTopColor: "#f1edf8",
    marginVertical: 12,
  },

  splitRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  splitItem: { flex: 1, alignItems: "center" },
  splitLabel: { color: colors.grayText, fontWeight: "600" },
  splitAmount: { fontSize: 18, color: colors.purple, fontWeight: "800", marginTop: 6 },

  /* generic card */
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f2e9ff",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 12 },
      android: { elevation: 2 },
    }),
  },

  addTitle: { fontWeight: "800", fontSize: 18, marginBottom: 12 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  inputSymbol: { fontSize: 18, fontWeight: "800", marginRight: 8, color: colors.purple },
  input: { flex: 1, fontSize: 16, fontWeight: "700", color: "#222" },

  couponRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  couponText: { color: colors.accent, fontWeight: "700" },

  proceedBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  proceedText: { color: colors.white, fontWeight: "800", fontSize: 16 },

  /* pills */
  pillRow: { flexDirection: "row", alignItems: "center" },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.pillBorder,
    backgroundColor: "#fff",
  },
  pillActive: {
    backgroundColor: "transparent",
    borderColor: colors.accent,
    shadowColor: "transparent",
  },
  pillText: { color: "#777", fontWeight: "700" },
  pillTextActive: { color: colors.accent },

  emptyState: {
    paddingVertical: 26,
    alignItems: "center",
  },
  emptyText: { color: colors.grayText, fontWeight: "600" },
});
