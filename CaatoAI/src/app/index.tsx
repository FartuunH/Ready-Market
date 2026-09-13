import { router } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.brandRow}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>

            <View>
              <Text style={styles.brandName}>CaatoAI</Text>
              <Text style={styles.brandSubtitle}>Caafimaad kuu gaar ah</Text>
            </View>
          </View>

          <View style={styles.coachBadge}>
            <Text style={styles.coachBadgeText}>✨ Tababarahaaga AI</Text>
          </View>

          <View style={styles.heroArea}>
            <View style={styles.welcomeIcon}>
              <Text style={styles.welcomeEmoji}>👋</Text>
            </View>

            <Text style={styles.welcomeText}>Salaan</Text>

            <Text style={styles.heroTitle}>
              Waxaan ahay <Text style={styles.heroHighlight}>CaatoAI.</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Waxaan kaa caawin doonaa inaad dhisto hab nololeed caafimaad leh
              oo ku habboon cuntadaada, dhaq-dhaqaaqaaga iyo noloshaada.
            </Text>
          </View>

          <View style={styles.messageCard}>
            <Text style={styles.messageEmoji}>💚</Text>

            <Text style={styles.messageTitle}>Ma aha cunto adag.</Text>

            <Text style={styles.messageText}>
              Uma baahnid inaad wax walba hal mar beddesho.
            </Text>

            <Text style={styles.messageText}>
              Waxaan ku bilaabaynaa tallaabooyin yar-yar oo aad sii wadi karto.
            </Text>
          </View>

          <View style={styles.whatHappensCard}>
            <Text style={styles.smallLabel}>SAFARKAAGA</Text>

            <View style={styles.journeyRow}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>1</Text>
              </View>

              <View style={styles.journeyTextArea}>
                <Text style={styles.journeyTitle}>Waxaan ku baran doonaa</Text>
                <Text style={styles.journeyText}>
                  Hadafkaaga, caadooyinkaaga iyo waxa kuu adag.
                </Text>
              </View>
            </View>

            <View style={styles.journeyLine} />

            <View style={styles.journeyRow}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>2</Text>
              </View>

              <View style={styles.journeyTextArea}>
                <Text style={styles.journeyTitle}>
                  Waxaan kuu samayn doonaa qorshe
                </Text>
                <Text style={styles.journeyText}>
                  Cunto, dhaq-dhaqaaq iyo caadooyin adiga kuu gaar ah.
                </Text>
              </View>
            </View>

            <View style={styles.journeyLine} />

            <View style={styles.journeyRow}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>3</Text>
              </View>

              <View style={styles.journeyTextArea}>
                <Text style={styles.journeyTitle}>
                  Maalin kasta waan kula socon doonaa
                </Text>
                <Text style={styles.journeyText}>
                  Casharro gaaban, check-ins iyo taageero joogto ah.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomArea}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={() => router.push("/onboarding")}
            >
              <Text style={styles.primaryButtonText}>Aan bilowno</Text>

              <Text style={styles.primaryButtonArrow}>→</Text>
            </Pressable>

            <Text style={styles.bottomText}>
              Wax yar ayaan ku weydiin doonaa si aan kuu barto. 🌿
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFBF5",
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 18,
  },

  container: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  logoEmoji: {
    fontSize: 22,
  },

  brandName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#14532D",
  },

  brandSubtitle: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
  },

  coachBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 18,
  },

  coachBadgeText: {
    color: "#166534",
    fontSize: 11,
    fontWeight: "900",
  },

  heroArea: {
    marginBottom: 22,
  },

  welcomeIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  welcomeEmoji: {
    fontSize: 28,
  },

  welcomeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#166534",
    marginBottom: 5,
  },

  heroTitle: {
    fontSize: 33,
    lineHeight: 39,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 12,
  },

  heroHighlight: {
    color: "#14532D",
  },

  heroSubtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6B7280",
  },

  messageCard: {
    backgroundColor: "#14532D",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },

  messageEmoji: {
    fontSize: 22,
    marginBottom: 10,
  },

  messageTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  messageText: {
    color: "#DCFCE7",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },

  whatHappensCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#DDE8DE",
    padding: 17,
  },

  smallLabel: {
    color: "#166534",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 14,
  },

  journeyRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  numberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },

  numberText: {
    color: "#14532D",
    fontSize: 13,
    fontWeight: "900",
  },

  journeyTextArea: {
    flex: 1,
  },

  journeyTitle: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },

  journeyText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 16,
  },

  journeyLine: {
    width: 2,
    height: 18,
    backgroundColor: "#DCFCE7",
    marginLeft: 16,
    marginVertical: 3,
  },

  bottomArea: {
    marginTop: 18,
    marginBottom: 8,
  },

  primaryButton: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#14532D",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,

    shadowColor: "#14532D",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
  },

  primaryButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  primaryButtonArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 8,
  },

  bottomText: {
    marginTop: 12,
    paddingHorizontal: 10,
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
});
