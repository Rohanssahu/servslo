import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { icon } from '../../component/Image';
import { height } from '../../component/utils/Constant';
import CustomHeader from '../Feature/CustomHeader';

const states = [
  { label: 'Madhya Pradesh', value: 'MP' },
  { label: 'Maharashtra', value: 'MH' },
  { label: 'Delhi', value: 'DL' },
  { label: 'Karnataka', value: 'KA' },
];

const EditProfile = ({navigation}) => {
  const [name, setName] = useState('Rohan sahj');
  const [dob, setDob] = useState(new Date('2000-01-01'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('Male');
  const [state, setState] = useState('MP');
  const [phone, setPhone] = useState('7828690192');
  const [email, setEmail] = useState('kunalsahusahi@gmail.com');
  const [editing, setEditing] = useState(false);

  const onSave = () => {
    setEditing(false);
    // Add actual save logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
              <StatusBar backgroundColor={'#eb2c3c'} />
        
              <CustomHeader title="Personal details" />
      <Text style={styles.header}>Personal details</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        editable={editing}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={styles.input}
        onPress={() => editing && setShowDatePicker(true)}
        activeOpacity={editing ? 0.8 : 1}
      >
        <Text style={styles.inputText}>
          {dob.toDateString()}
        </Text>
        <Icon name="calendar" size={20} color="#888" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setDob(date);
          }}
        />
      )}

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        {['Male', 'Female'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genderButton,
              gender === g && styles.genderSelected,
            ]}
            onPress={() => editing && setGender(g)}
          >
            <Text style={styles.genderText}>{g}</Text>
            {gender === g && (
              <Icon name="check-circle" size={18} color="#d11" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.header}>Contact details</Text>

      <Dropdown
        data={states}
        value={state}
        labelField="label"
        valueField="value"
        placeholder="State of residence"
        placeholderStyle={styles.dropdownPlaceholder}
        style={styles.dropdown}
        selectedTextStyle={styles.inputText}
        onChange={(item) => editing && setState(item.value)}
        disable={!editing}
      />

      <Text style={styles.smallLabel}>Required for GST Tax Invoicing</Text>

      <View style={styles.phoneRow}>
        <TextInput
          style={[styles.phoneCode, { backgroundColor: '#f8f8f8' }]}
          value="+91 (IND)"
          editable={false}
        />
        <TextInput
          style={[styles.phoneInput, { flex: 1 }]}
          value={phone}
          editable={editing}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <TextInput
        style={styles.input}
        value={email}
        editable={editing}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={editing ? onSave : () => setEditing(true)}
      >
        <Text style={styles.saveButtonText}>
          {editing ? 'Save changes' : 'Edit Information'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    gap: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 15,
    color: '#222',
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 14,
    color: '#555',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#aaa',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  genderSelected: {
    borderColor: '#d11',
    backgroundColor: '#fff0f0',
  },
  genderText: {
    fontSize: 14,
    color: '#333',
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  dropdownPlaceholder: {
    color: '#888',
    fontSize: 14,
  },
  smallLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: -2,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  phoneCode: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#666',
  },
  phoneInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#d11',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default EditProfile;


