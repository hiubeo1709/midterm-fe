import { Slot, Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token); // Nếu có token thì true, không có thì false
      setIsLoading(false);
      if (token) {
        router.replace("../(auth)/login"); // Chuyển hướng đến login
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return null; // Hiển thị màn hình trống trong khi kiểm tra login

  return <Stack screenOptions={{ headerShown: false }} />;
}
