import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import styles from '@/src/styles/AppStyles'; 
import { Colors } from "@/src/styles/Colors";

const NumericInput = ({
  label,
  value,
  onChangeText,
  prefix,
  suffix,
  placeholder,
  keyboardType = "numeric",
  ...rest
}) => {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {prefix && <Text style={styles.affix}>{prefix}</Text>}
        <TextInput
          style={styles.inputWithAffix}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          keyboardType={keyboardType}
          {...rest} 
        />
        {suffix && <Text style={styles.affix}>{suffix}</Text>}
      </View>
    </View>
  );
};

export default NumericInput;