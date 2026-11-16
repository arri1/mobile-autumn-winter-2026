import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import WelcomeScreen from "./screens/WelcomeScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import CounterScreen from "./screens/CounterScreen";
import TextInputScreen from "./screens/TextInputScreen";
import UseEffectScreen from "./screens/UseEffectScreen";
import PostsScreen from "./screens/PostsScreen";
import PostViewScreen from "./screens/PostViewScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import EditPostScreen from "./screens/EditPostScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PostsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostsList"
        component={PostsScreen}
        options={{ title: "Посты" }}
      />

      <Stack.Screen
        name="PostView"
        component={PostViewScreen}
        options={{ title: "Просмотр поста" }}
      />

      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: "Создание поста" }}
      />

      <Stack.Screen
        name="EditPost"
        component={EditPostScreen}
        options={{ title: "Редактирование поста" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            backgroundColor: "#fffdf7",
            borderTopWidth: 0,
            height: 100,
            paddingBottom: 40,
            padding: 15,
          },

          tabBarItemStyle: {
            borderWidth: 3,
            borderColor: "#111111",
            borderRadius: 12,
            marginHorizontal: 5,
          },

          tabBarActiveTintColor: "#111111",
          tabBarInactiveTintColor: "#111111",
        }}
      >
        <Tab.Screen
          name="Главная"
          component={WelcomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Счетчик"
          component={CounterScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flask" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Ввод текста"
          component={TextInputScreen}
          options={{
            title: "Ввод текста",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="text" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="UseEffect"
          component={UseEffectScreen}
          options={{
            title: "UseEffect",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="refresh" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Посты"
          component={PostsStack}
          options={{
            title: "Посты",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="О нас"
          component={AboutUsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="information-circle" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
