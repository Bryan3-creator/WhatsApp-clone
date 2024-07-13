import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export interface BoxedIconProps {
  name: typeof Ionicons.defaultProps;
  backgroundColor: string;
}

export const BoxedIcon = ({ name, backgroundColor }: BoxedIconProps) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Ionicons name={name} size={20} color={"#FFF"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
