import type { NavigatorScreenParams } from '@react-navigation/native';

export type PostsStackParamList = {
  PostsList: undefined;
  PostView: { id: number };
  PostForm: { id?: number } | undefined; // без id — создание, с id — редактирование
};

export type TabParamList = {
  Home: undefined;
  Counter: undefined;
  Name: undefined;
  Timer: undefined;
  Posts: NavigatorScreenParams<PostsStackParamList>;
  About: undefined;
};
