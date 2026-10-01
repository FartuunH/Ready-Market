import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const START_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Salaan 🌷 Waxaan ahay CaatoAI. Waxaad i weydiin kartaa su'aalo ku saabsan qorshaha cuntadaada, calories-ka, protein-ka, jimicsiga iyo soonka.",
  },
];

const DAILY_PLAN_KEY = "caatoai-daily-meal-plan-v5";
const MEAL_TRACKER_KEY = "caatoai-meal-tracker";
const FASTING_SETTINGS_KEY = "caatoai-fasting-settings-v1";

export default function AIChatScreen() {
  const params = useLocalSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>(START_MESSAGES);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: message,
    };

    setMessages((old) => [...old, userMessage]);
    setInput("");
    setSending(true);

    try {
      // Load today's real meal plan.
      const dailyPlanRaw = await AsyncStorage.getItem(DAILY_PLAN_KEY);
      const dailyPlanSaved = dailyPlanRaw ? JSON.parse(dailyPlanRaw) : null;

      const today = new Date().toDateString();

      const todayMealPlan =
        dailyPlanSaved?.date === today ? (dailyPlanSaved?.meal_plan ?? {}) : {};

      // Load what the user actually ate today.
      const trackerRaw = await AsyncStorage.getItem(MEAL_TRACKER_KEY);
      const trackerSaved = trackerRaw ? JSON.parse(trackerRaw) : null;

      const todayTracker = trackerSaved?.date === today ? trackerSaved : null;

      const caloriesEaten =
        typeof todayTracker?.calories === "number" ? todayTracker.calories : 0;

      const proteinEaten =
        typeof todayTracker?.protein === "number" ? todayTracker.protein : 0;

      // Load the user's saved fasting selection.
      const fastingRaw = await AsyncStorage.getItem(FASTING_SETTINGS_KEY);
      const fastingSettings = fastingRaw ? JSON.parse(fastingRaw) : null;
      const fastingPlan = fastingSettings?.plan ?? null;

      const eatingStyle =
        fastingPlan === "OMAD"
          ? "omad"
          : fastingPlan
            ? "fasting"
            : typeof params.eatingStyle === "string"
              ? params.eatingStyle
              : "regular";

      // Use the same onboarding/route values as the meal-plan screen.
      const calorieTarget =
        typeof params.calorieTarget === "string"
          ? Number(params.calorieTarget)
          : 1400;

      const proteinTarget =
        typeof params.proteinTarget === "string"
          ? Number(params.proteinTarget)
          : 114;

      const foodPreferences =
        typeof params.foodPreferenceLabel === "string"
          ? params.foodPreferenceLabel
          : "Somali food, simple meals";

      const foodRestrictions =
        typeof params.foodRestrictionLabel === "string"
          ? params.foodRestrictionLabel
          : "";

      const foodCulture =
        typeof params.foodCultureLabel === "string"
          ? params.foodCultureLabel
          : "Somali";

      const response = await fetch("http://127.0.0.1:8001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          calorie_target: calorieTarget,
          protein_target: proteinTarget,
          food_preferences: foodPreferences,
          food_restrictions: foodRestrictions,
          food_culture: foodCulture,
          eating_style: eatingStyle,
          calories_eaten: caloriesEaten,
          protein_eaten: proteinEaten,
          today_meals: todayMealPlan,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: data?.message ?? "Waan ka xumahay, jawaabta CaatoAI lama helin.",
      };

      setMessages((old) => [...old, assistantMessage]);
    } catch (error) {
      console.log("CaatoAI chat error:", error);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        text: "Waan ka xumahay 🌷 CaatoAI hadda lama xiriiri karo. Fadlan mar kale isku day.",
      };

      setMessages((old) => [...old, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🌷</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>CAATOAI • KAALIYAHAAGA</Text>
            <Text style={styles.title}>La hadal CaatoAI ✨</Text>
            <Text style={styles.subtitle}>
              Weydii su&apos;aal ku saabsan cuntadaada iyo qorshahaaga.
            </Text>
          </View>
        </View>

        <View style={styles.quickSection}>
          <Text style={styles.quickLabel}>Su&apos;aalo degdeg ah</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRow}
          >
            <Pressable
              style={styles.quickButton}
              onPress={() => setInput("Maxaan casho ahaan u cuni karaa?")}
            >
              <Text style={styles.quickText}>🍽️ Maxaan casho u cunaa?</Text>
            </Pressable>

            <Pressable
              style={styles.quickButton}
              onPress={() => setInput("Immisa calories ayaan maanta cunay?")}
            >
              <Text style={styles.quickText}>🔥 Calories-kayga</Text>
            </Pressable>

            <Pressable
              style={styles.quickButton}
              onPress={() => setInput("Ma beddeli karaa cuntadayda?")}
            >
              <Text style={styles.quickText}>↻ Beddel cunto</Text>
            </Pressable>
          </ScrollView>
        </View>

        <ScrollView
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.role === "user"
                  ? styles.userMessageRow
                  : styles.assistantMessageRow,
              ]}
            >
              {message.role === "assistant" ? (
                <View style={styles.smallAvatar}>
                  <Text>🌷</Text>
                </View>
              ) : null}

              <View
                style={[
                  styles.bubble,
                  message.role === "user"
                    ? styles.userBubble
                    : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === "user" && styles.userMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}

          {sending ? (
            <View style={[styles.messageRow, styles.assistantMessageRow]}>
              <View style={styles.smallAvatar}>
                <Text>🌷</Text>
              </View>

              <View style={[styles.bubble, styles.assistantBubble]}>
                <Text style={styles.messageText}>
                  CaatoAI wuxuu fikirayaa...
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.inputArea}>
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="U qor CaatoAI..."
              placeholderTextColor="#9CA3AF"
              multiline
              style={styles.input}
              onSubmitEditing={sendMessage}
              editable={!sending}
            />

            <Pressable style={styles.voiceButton}>
              <Text style={styles.voiceIcon}>🎤</Text>
            </Pressable>

            <Pressable
              onPress={sendMessage}
              disabled={!input.trim() || sending}
              style={[
                styles.sendButton,
                (!input.trim() || sending) && styles.sendButtonDisabled,
              ]}
            >
              <Text style={styles.sendText}>➤</Text>
            </Pressable>
          </View>

          <Text style={styles.note}>
            CaatoAI wuxuu kaa caawinayaa qorshahaaga, laakiin ma beddelayo
            talada xirfadle caafimaad.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF5",
  },

  content: {
    flex: 1,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E5E4",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 25,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#15803D",
    marginBottom: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1F2937",
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: "#6B7280",
    marginTop: 3,
  },

  quickSection: {
    paddingVertical: 12,
  },

  quickLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#78716C",
    marginBottom: 8,
  },

  quickRow: {
    gap: 8,
    paddingRight: 12,
  },

  quickButton: {
    borderWidth: 1,
    borderColor: "#BBF7D0",
    backgroundColor: "#F0FDF4",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  quickText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "800",
  },

  messages: {
    flex: 1,
  },

  messagesContent: {
    paddingVertical: 10,
    gap: 14,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  assistantMessageRow: {
    justifyContent: "flex-start",
  },

  userMessageRow: {
    justifyContent: "flex-end",
  },

  smallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  bubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  assistantBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    borderBottomLeftRadius: 5,
  },

  userBubble: {
    backgroundColor: "#166534",
    borderBottomRightRadius: 5,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },

  userMessageText: {
    color: "#FFFFFF",
  },

  inputArea: {
    borderTopWidth: 1,
    borderTopColor: "#E7E5E4",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: "#D6D3D1",
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F2937",
  },

  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
  },

  voiceIcon: {
    fontSize: 19,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    opacity: 0.4,
  },

  sendText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  note: {
    fontSize: 10,
    lineHeight: 15,
    color: "#A8A29E",
    textAlign: "center",
    marginTop: 8,
  },
});
