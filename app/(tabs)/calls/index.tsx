import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { SegmentedControl } from "@/components/SegmentedControl";

const Page = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    const isNewEditing = !isEditing;
    setIsEditing(true);
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <SegmentedControl
              options={["All", "Missed"]}
              selectedOption="All"
            />
          ),
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={handleEdit}>
              <Text style={{ color: Colors.primary, fontSize: 18 }}>
                {isEditing ? "Edit" : "Done"}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Text>Page</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
