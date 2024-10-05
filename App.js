import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import {
  Platform,
  FlatList,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  Text,
  Image,
  View,
  Pressable,
} from "react-native";

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState([]);

  const get10NewUsers = async () => {
    await axios
      .get(
        "https://random-data-api.com/api/v2/users?size=10&response_type=json"
      )
      .then((response) => {
        setUserData([...userData, ...response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getOneUser = async () => {
    await axios
      .get("https://random-data-api.com/api/v2/users?size=1&response_type=json")
      .then((response) => {
        setUserData([response.data, ...userData]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    get10NewUsers();
    setRefreshing(false);
  }, []);

  const onPress = useCallback(() => {
    getOneUser();
  }, []);

  useEffect(() => {
    get10NewUsers();
  }, []);

  const renderItem = ({ item }) =>
    Platform.OS === "ios" ? (
      <View style={styles.user}>
        <View style={styles.userName}>
          <Text style={styles.name}>{item.first_name}</Text>
          <Text style={styles.name}>{item.last_name}</Text>
        </View>
        <Image source={{ uri: item.avatar }} style={styles.image} />
      </View>
    ) : (
      <View style={styles.user}>
        <Image source={{ uri: item.avatar }} style={styles.image} />
        <View style={styles.userName}>
          <Text style={styles.name}>{item.first_name}</Text>
          <Text style={styles.name}>{item.last_name}</Text>
        </View>
      </View>
    );

  const keyExtractor = (item) => item.uid;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Pressable style={styles.btn} onPress={onPress}>
        <Icon name="user-plus" size={25} color={"white"} />
      </Pressable>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 0 : 50,
  },
  image: {
    backgroundColor: "#aaa",
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  list: {
    width: "100%",
    marginTop: 20,
  },
  user: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    padding: 20,
    borderWidth: 2,
    borderColor: "#99d",
    borderRadius: 15,
  },
  userName: {
    flex: 1,
    flexDirection: "column",
    alignItems: Platform.OS === "ios" ? "flex-start" : "flex-end",
    fontSize: 24,
  },
  name: {
    fontSize: 18,
  },
  btn: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#449",
    padding: 20,
    borderRadius: 45,
    margin: 10,
  },
});
