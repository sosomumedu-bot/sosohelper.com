import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { apiFetch } from "./lib/api";
import { cacheGet, cacheSet } from "./lib/offline";

export default function App() {
  const [token, setToken] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    (async () => {
      const cached = await cacheGet<any[]>("jobs_cache");
      if (cached) setJobs(cached);
    })();
  }, []);

  async function loadJobs() {
    setStatus("Loading…");
    try {
      const r = await apiFetch("/jobs", { token });
      setJobs(r.jobs);
      await cacheSet("jobs_cache", r.jobs);
      setStatus("Loaded");
    } catch (e: any) {
      setStatus(e?.message ?? "Failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <StatusBar style="auto" />
      <Text style={{ fontSize: 20, fontWeight: "700" }}>SosoHelper (Mobile shell)</Text>
      <Text style={{ marginTop: 8 }}>Paste JWT then load jobs (offline cache enabled).</Text>

      <TextInput
        value={token}
        onChangeText={setToken}
        placeholder="Bearer token"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, marginTop: 12, borderRadius: 8 }}
        autoCapitalize="none"
      />

      <TouchableOpacity
        onPress={loadJobs}
        style={{ backgroundColor: "#111", padding: 14, borderRadius: 10, marginTop: 12 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Load Jobs</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 8 }}>{status}</Text>

      <View style={{ marginTop: 12, gap: 10 }}>
        {jobs.map((j) => (
          <View key={j.id} style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 }}>
            <Text style={{ fontWeight: "700" }}>{j.location}</Text>
            <Text>Tasks: {(j.tasks || []).slice(0, 3).join(", ")}</Text>
            <Text>WhatsApp: {j.whatsapp}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
