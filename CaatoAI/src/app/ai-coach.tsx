import { router } from "expo-router";
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

export default function AICoachScreen() {
  const [message, setMessage] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [greetingSpeaking, setGreetingSpeaking] = useState(false);
  const [responseSpeaking, setResponseSpeaking] = useState(false);

  const greetingText = "Salaan. Maxaan maanta kaa caawin karaa?";

  const greetingUrl =
    "http://localhost:3001/api/speech?text=" + encodeURIComponent(greetingText);

  const playGreeting = () => {
    console.log("Greeting button clicked");

    const audio = new Audio(greetingUrl);

    setGreetingSpeaking(true);

    audio.onended = () => {
      setGreetingSpeaking(false);
    };

    audio.onerror = () => {
      setGreetingSpeaking(false);
    };

    audio.play().catch((error) => {
      console.error("Greeting audio error:", error);
      setGreetingSpeaking(false);
    });
  };

  const playResponse = () => {
    if (!aiResponse) return;

    console.log("Response button clicked");

    const responseUrl =
      "http://localhost:3001/api/speech?text=" + encodeURIComponent(aiResponse);

    const audio = new Audio(responseUrl);

    setResponseSpeaking(true);

    audio.onended = () => {
      setResponseSpeaking(false);
    };

    audio.onerror = () => {
      setResponseSpeaking(false);
    };

    audio.play().catch((error) => {
      console.error("Response audio error:", error);
      setResponseSpeaking(false);
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Dib u noqo</Text>
        </Pressable>

        <Text style={styles.title}>✨ CaatoAI Coach</Text>

        <Text style={styles.subtitle}>
          Qor ama ku hadal Somali. CaatoAI wuxuu kuu jawaabi doonaa qoraal iyo
          cod.
        </Text>

        <View style={styles.aiMessage}>
          <Text style={styles.aiName}>✨ CaatoAI</Text>

          <Text style={styles.aiText}>
            Salaan 💜 Maxaan maanta kaa caawin karaa?
          </Text>

          <Pressable
            onPress={playGreeting}
            style={[
              styles.listenButton,
              greetingSpeaking && styles.listenButtonActive,
            ]}
          >
            <Text style={styles.listenButtonText}>
              {greetingSpeaking ? "🔊 Wuu hadlayaa..." : "🔊 Dhageyso"}
            </Text>
          </Pressable>
        </View>

        {sentMessage ? (
          <View style={styles.userMessage}>
            <Text style={styles.userName}>Adiga</Text>
            <Text style={styles.userText}>{sentMessage}</Text>
          </View>
        ) : null}

        {aiResponse ? (
          <View style={[styles.aiMessage, styles.responseMessage]}>
            <Text style={styles.aiName}>✨ CaatoAI</Text>

            <Text style={styles.aiText}>{aiResponse}</Text>

            <Pressable
              onPress={playResponse}
              style={[
                styles.listenButton,
                responseSpeaking && styles.listenButtonActive,
              ]}
            >
              <Text style={styles.listenButtonText}>
                {responseSpeaking ? "🔊 Wuu hadlayaa..." : "🔊 Dhageyso"}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Qor fariin..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          multiline
        />

        <Pressable style={styles.micButton}>
          <Text style={styles.micText}>🎤</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            const cleanMessage = message.trim();

            if (!cleanMessage) return;

            setSentMessage(cleanMessage);

            setAiResponse(
              "Waa hagaag 💜 Hal cunto oo badan ma burburinayso qorshahaaga. Ha iska gaajoon si aad u magdhawdo. Cuntadaada xigta si caadi ah u cun, protein iyo khudaar ku dar, biyo cab, oo socod yar samee haddii aad awooddo.",
            );

            setMessage("");
          }}
          style={styles.sendButton}
        >
          <Text style={styles.sendText}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7FC",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 120,
    maxWidth: 650,
    width: "100%",
    alignSelf: "center",
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 20,
    marginBottom: 8,
  },

  backText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C3AED",
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    color: "#6D28D9",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginBottom: 24,
  },

  aiMessage: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    borderRadius: 20,
    padding: 17,
    alignSelf: "flex-start",
    maxWidth: "90%",
  },

  aiName: {
    fontSize: 13,
    fontWeight: "900",
    color: "#7C3AED",
    marginBottom: 8,
  },

  aiText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    marginBottom: 12,
  },

  listenButton: {
    alignSelf: "flex-start",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  listenButtonActive: {
    opacity: 0.65,
    transform: [{ scale: 0.98 }],
  },

  listenButtonText: {
    color: "#6D28D9",
    fontWeight: "800",
  },

  inputArea: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3E8FF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },

  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
  },

  micText: {
    fontSize: 21,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#6D28D9",
    alignItems: "center",
    justifyContent: "center",
  },

  sendText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  userMessage: {
    backgroundColor: "#6D28D9",
    borderRadius: 20,
    padding: 15,
    alignSelf: "flex-end",
    maxWidth: "85%",
    marginTop: 16,
  },

  userName: {
    fontSize: 12,
    fontWeight: "900",
    color: "#E9D5FF",
    marginBottom: 6,
  },

  userText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#FFFFFF",
  },

  responseMessage: {
    marginTop: 16,
  },
});
