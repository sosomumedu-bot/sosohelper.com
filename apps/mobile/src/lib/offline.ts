import AsyncStorage from "@react-native-async-storage/async-storage";

export async function cacheSet(key: string, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify({ value, savedAt: Date.now() }));
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return (parsed?.value ?? null) as T | null;
  } catch {
    return null;
  }
}
