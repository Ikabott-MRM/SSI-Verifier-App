import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

type LanguageItem = {
  label: string;
  value: string;
  flag: ImageSourcePropType;
};

export default function CustomDropdown() {
  const { i18n, t } = useTranslation();
  const languages = useMemo(
    () => [
      {
        label: t('languageSpanish'),
        value: 'es',
        flag: require('../assets/images/spain.png'),
      },
      {
        label: t('languageEnglish'),
        value: 'en',
        flag: require('../assets/images/united-kingdom.png'),
      },
    ],
    [t],
  );
  const [modalVisible, setModalVisible] = useState(false);

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    setModalVisible(false);
  };

  const renderDropdownItem = ({ item }: { item: LanguageItem }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => changeLanguage(item.value)}
    >
      <Image source={item.flag} style={styles.flag} />
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const getFlagForCurrentLanguage = () => {
    const currentLanguage = languages.find(
      lang => lang.value === i18n.language,
    );
    return currentLanguage ? currentLanguage.flag : null;
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>{i18n.language}</Text>
        <Image source={getFlagForCurrentLanguage()} style={styles.flag} />
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={languages}
              renderItem={renderDropdownItem}
              keyExtractor={item => item.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#696d6b',
    borderRadius: 5,
  },
  dropdownButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
    marginRight: 8,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 250,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  flag: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    opacity: 0.8,
  },
  dropdownItemText: {
    fontSize: 14,
    color: 'black',
  },
});
