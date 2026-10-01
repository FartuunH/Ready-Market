import { router } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HiringInviteScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        <Text style={styles.eyebrow}>HIRING</Text>

        <Text style={styles.title}>Send Driver Application</Text>

        <Text style={styles.description}>
          Send a secure application invitation for the driver to complete from
          their phone.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Driver Information</Text>

          <Text style={styles.sectionDescription}>
            Enter who you are sending the application to.
          </Text>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>First Name *</Text>

              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Last Name *</Text>

              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
              />
            </View>
          </View>

          <Text style={styles.label}>Mobile Phone *</Text>

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(320) 555-1234"
            keyboardType="phone-pad"
          />

          <Text style={styles.helper}>
            Taragle will eventually be able to send the application link by text
            message.
          </Text>

          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="driver@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>INVITATION PREVIEW</Text>

          <Text style={styles.previewTitle}>
            Driver Application — Ugaas Transportation
          </Text>

          <Text style={styles.previewText}>
            You've been invited to complete a driver application for Ugaas
            Transportation through Taragle Systems.
          </Text>

          <View style={styles.previewButton}>
            <Text style={styles.previewButtonText}>
              Complete Driver Application
            </Text>
          </View>

          <Text style={styles.securityText}>
            🔒 Secure application • No Taragle account required
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What happens next?</Text>

          <Text style={styles.infoItem}>
            1. Taragle creates a secure application invitation.
          </Text>

          <Text style={styles.infoItem}>
            2. The driver receives the application link.
          </Text>

          <Text style={styles.infoItem}>
            3. Application progress appears in your Hiring Center.
          </Text>

          <Text style={styles.infoItem}>
            4. You are notified when the driver submits the application.
          </Text>

          <Text style={styles.infoItem}>
            5. Approved information can move into Drivers and Compliance.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Create Application Link →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  content: {
    width: "100%",
    maxWidth: 850,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
  },

  back: {
    color: "#1473E6",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 22,
  },

  eyebrow: {
    color: "#1473E6",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
  },

  title: {
    color: "#102A43",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 5,
  },

  description: {
    color: "#62748A",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 7,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 16,
    padding: 22,
  },

  sectionTitle: {
    color: "#102A43",
    fontSize: 18,
    fontWeight: "800",
  },

  sectionDescription: {
    color: "#62748A",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  field: {
    flex: 1,
    minWidth: 220,
  },

  label: {
    color: "#334E68",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E1EA",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#102A43",
    fontSize: 14,
  },

  helper: {
    color: "#7A8A9A",
    fontSize: 11,
    marginTop: 6,
  },

  previewCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E1EA",
    borderRadius: 16,
    padding: 22,
    marginTop: 18,
  },

  previewLabel: {
    color: "#1473E6",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  previewTitle: {
    color: "#102A43",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 10,
  },

  previewText: {
    color: "#62748A",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  previewButton: {
    backgroundColor: "#1473E6",
    borderRadius: 9,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginTop: 16,
  },

  previewButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  securityText: {
    color: "#62748A",
    fontSize: 11,
    marginTop: 13,
  },

  infoCard: {
    backgroundColor: "#EAF3FF",
    borderRadius: 14,
    padding: 18,
    marginTop: 18,
  },

  infoTitle: {
    color: "#102A43",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },

  infoItem: {
    color: "#45637D",
    fontSize: 12,
    lineHeight: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 18,
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: "#D8E1EA",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  cancelText: {
    color: "#334E68",
    fontSize: 13,
    fontWeight: "800",
  },

  sendButton: {
    backgroundColor: "#1473E6",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
