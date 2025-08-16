import React, {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ScreenNameEnum from '../../routes/screenName.enum';

type TabType =
  | 'Weekly Cleaning'
  | 'Laundry'
  | 'Dishwashing'
  | 'Bathroom Cleaning';

export type ServiceBottomSheetRef = {
  open: () => void;
  close: () => void;
};

interface Props {
  onClose?: () => void;
}

const ServiceBottomSheet = forwardRef<ServiceBottomSheetRef, Props>(
  ({ onClose }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);


const navigation = useNavigation()
    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.snapToIndex(0),
      close: () => sheetRef.current?.close(),
    }));

    const activeTab: TabType = 'Laundry'; // later this can be from state

    const TabButton = ({ title }: { title: TabType }) => {
      const isActive = activeTab === title;
      return (
        <TouchableOpacity
          style={[styles.tabBtn, isActive && styles.tabBtnActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
            {title}
          </Text>
        </TouchableOpacity>
      );
    };

    const BulletItem = ({
      icon,
      text,
      success,
    }: {
      icon?: string;
      text: string;
      success?: boolean;
    }) => {
      return (
        <View style={styles.bulletRow}>
          <Ionicons
            name={success ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={success ? '#2DBE65' : '#FF4B55'}
          />
          <Text style={styles.bulletText}>{text}</Text>
        </View>
      );
    };

    const InfoBanner = ({ text }: { text: string }) => (
      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    );

    const RequirementCard = ({ icon, label }: { icon: string; label: string }) => (
      <View style={styles.reqCard}>
        <Ionicons name={icon} size={26} color="#1C1C1C" />
        <Text style={styles.reqLabel}>{label}</Text>
      </View>
    );
    const handleScroll = useCallback((event) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      if (offsetY <= 0) {
        // agar user scroll top pe hai, sheet ko snap top kare
        sheetRef.current?.snapToIndex(0);
      }
    }, []);
    return (
     
      
      <BottomSheet
      ref={sheetRef}
      index={-1} // initial snap point
      snapPoints={['70%']} // fixed height
      enablePanDownToClose
      enableOverDrag={false} // no over-drag
      enableContentPanningGesture={true} // scroll content without moving sheet
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}

      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" opacity={0.5} />
      )}
    >
        <View style={{ flex: 1 }}>
          {/* Tabs */}
          <View style={styles.tabRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TabButton title="Weekly Cleaning" />
              <TabButton title="Laundry" />
              <TabButton title="Dishwashing" />
              <TabButton title="Bathroom Cleaning" />
            </ScrollView>
          </View>
      
          {/* Scrollable content */}
         <BottomSheetScrollView
  onScroll={handleScroll}
  scrollEventThrottle={16}
  contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}>

  <View style={{
    borderWidth:1,padding:16,marginVertical:10,borderRadius:10,borderColor:'#ccc'
  }}>


            <Text style={styles.sectionTitle}>The expert is trained to</Text>
            
            <BulletItem text="Sort, wash, and dry clothes" success />
            <BulletItem text="Fold and iron clothes" success />
            </View>
            <View style={{
    borderWidth:1,padding:16,marginVertical:10,borderRadius:10,borderColor:'#ccc'
  }}>
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Service excludes</Text>
            <BulletItem text="Ironing clothes with rich zari, embroidery, or expensive fabrics" />
            <BulletItem text="Hand wash biohazard-stained clothes" />
            <BulletItem text="Clean washing machine" />
      </View>
      <View style={{
    borderWidth:1,padding:16,marginVertical:10,borderRadius:10,borderColor:'#ccc'
  }}>
            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>What we need from you</Text>
            <View style={styles.reqRow}>
              <RequirementCard icon="shirt-outline" label="Washing supplies" />
              <RequirementCard icon="settings-outline" label="Machine instruction" />
              <RequirementCard icon="water-outline" label="Drying rack" />
              <RequirementCard icon="cut-outline" label="Iron" />
            </View>
            </View>
      
            <InfoBanner text="Please provide tools and any specific instructions for the service" />
          </BottomSheetScrollView>
      
          {/* Fixed buttons */}
          <View style={{ flexDirection: 'row', padding: 16, backgroundColor: '#fff',position:'absolute',bottom:0 }}>
            <TouchableOpacity 
            
            
            onPress={()=>{

              navigation.navigate(ScreenNameEnum.ReviewBookingScreen)
            }}
            style={[styles.bookNowBtn, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.bookNowText}>Book now</Text>
            </TouchableOpacity>
           
          </View>
        </View>
      </BottomSheet>
      

    );
  }
);

export default ServiceBottomSheet;


const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius:20,
    backgroundColor: '#fff',
    paddingTop:25
   
  },
  handleIndicator: { backgroundColor: '#D8D8D8', width: 40 },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F6F6F6',
  },
  tabBtnActive: { backgroundColor: '#EEE8FF' },
  tabText: { color: '#555', fontSize: 14 },
  tabTextActive: { color: '#5D3DE2', fontWeight: '600' },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0D0D0D', marginBottom: 6 },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  bulletText: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  reqRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  reqCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '23%',
    alignItems: 'center',
  },
  reqLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    color: '#333',
  },
  infoBanner: {
    backgroundColor: '#DFF5E5',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  infoText: { color: '#2D5D44', fontSize: 13 },
  buttonRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bookNowBtn: {
    flex: 1,
    backgroundColor: '#FF007F',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius:15
  },
  preBookBtn: {
    flex: 1,
    backgroundColor: '#F2EFFF',
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookNowText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  preBookText: { color: '#5D3DE2', fontWeight: '700', fontSize: 15 },
});
