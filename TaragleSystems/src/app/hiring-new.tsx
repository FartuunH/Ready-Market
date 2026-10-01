import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewApplicantScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back to Hiring</Text>
        </Pressable>

        <Text style={styles.eyebrow}>HIRING</Text>

        <Text style={styles.title}>Add Driver Applicant</Text>

        <Text style={styles.description}>
          Choose how you would like to start the driver's application.
        </Text>

        <View style={styles.options}>
          {/* Enter application manually */}
          <Pressable
            style={styles.optionCard}
            onPress={() => router.push("/hiring-add")}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>👤</Text>
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Enter Application Myself</Text>

              <Text style={styles.optionDescription}>
                Enter the driver's information directly into Taragle Systems.
              </Text>

              <Text style={styles.optionLink}>Start Application →</Text>
            </View>
          </Pressable>

          {/* Send application to driver */}
          <Pressable
            style={styles.optionCard}
            onPress={() => router.push("/hiring-invite")}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🔗</Text>
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Send Application to Driver</Text>

              <Text style={styles.optionDescription}>
                Send the driver a secure application link so they can complete
                the application from their phone.
              </Text>

              <View style={styles.featureRow}>
                <Text style={styles.feature}>
                  ✓ No Taragle account required
                </Text>
                <Text style={styles.feature}>✓ Track application progress</Text>
                <Text style={styles.feature}>
                  ✓ Get notified when submitted
                </Text>
              </View>

              <Text style={styles.optionLink}>Send Application →</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Taragle Hiring</Text>

          <Text style={styles.infoText}>
            Driver information can move from the application into onboarding,
            driver management, and compliance after the application is reviewed
            and approved.
          </Text>
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
    maxWidth: 900,
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
    marginBottom: 24,
  },

  options: {
    gap: 16,
  },

  optionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 16,
    padding: 22,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#EAF3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  icon: {
    fontSize: 23,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    color: "#102A43",
    fontSize: 17,
    fontWeight: "800",
  },

  optionDescription: {
    color: "#62748A",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
  },

  featureRow: {
    marginTop: 12,
    gap: 5,
  },

  feature: {
    color: "#45637D",
    fontSize: 12,
    fontWeight: "600",
  },

  optionLink: {
    color: "#1473E6",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 15,
  },

  infoCard: {
    backgroundColor: "#EAF3FF",
    borderRadius: 14,
    padding: 18,
    marginTop: 20,
  },

  infoTitle: {
    color: "#102A43",
    fontSize: 14,
    fontWeight: "800",
  },

  infoText: {
    color: "#45637D",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },
});
