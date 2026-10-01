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
          {/* Brand */}
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>

            <View>
              <Text style={styles.brandName}>CaatoAI</Text>
              <Text style={styles.brandSubtitle}>
                Isbeddel yar. Natiijo waarta.
              </Text>
            </View>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.eyebrow}>
              <Text style={styles.eyebrowText}>
                ✨ SAFARKAAGA ADIGA AYUU KU BILAABMAA
              </Text>
            </View>

            <Text style={styles.title}>
              Miisaanka oo keliya{"\n"}
              <Text style={styles.titleGreen}>ma aha hadafka.</Text>
            </Text>

            <Text style={styles.subtitle}>
              CaatoAI wuxuu kaa caawinayaa inaad fahanto cuntadaada,
              caadooyinkaaga iyo waxa kaa hor istaaga hadafkaaga — kadibna
              waxaan kula dhiseynaa isbeddel aad sii wadi karto.
            </Text>
          </View>

          {/* Main visual */}
          <View style={styles.visualCard}>
            <View style={styles.visualTop}>
              <View style={styles.coachIcon}>
                <Text style={styles.coachEmoji}>🌱</Text>
              </View>

              <View style={styles.visualHeading}>
                <Text style={styles.visualLabel}>CAATOAI</Text>
                <Text style={styles.visualTitle}>
                  Maalin kasta hal tallaabo
                </Text>
              </View>
            </View>

            <Text style={styles.visualText}>
              Ma doonayno inaad hal maalin wax walba beddesho. Waxaan rabnaa
              inaan ogaano waxa adiga kuu shaqeeya.
            </Text>

            <View style={styles.path}>
              <View style={styles.pathItem}>
                <View style={styles.pathIcon}>
                  <Text style={styles.pathEmoji}>🧠</Text>
                </View>

                <View style={styles.pathTextArea}>
                  <Text style={styles.pathTitle}>Faham caadooyinkaaga</Text>
                  <Text style={styles.pathText}>
                    Baro sababta aad wax u cunto iyo waxa kugu adkaada.
                  </Text>
                </View>
              </View>

              <View style={styles.connector} />

              <View style={styles.pathItem}>
                <View style={styles.pathIcon}>
                  <Text style={styles.pathEmoji}>🍽️</Text>
                </View>

                <View style={styles.pathTextArea}>
                  <Text style={styles.pathTitle}>
                    Cun cuntada aad jeceshahay
                  </Text>
                  <Text style={styles.pathText}>
                    Baro portions, protein iyo doorashooyin kuu shaqeeya.
                  </Text>
                </View>
              </View>

              <View style={styles.connector} />

              <View style={styles.pathItem}>
                <View style={styles.pathIcon}>
                  <Text style={styles.pathEmoji}>🌿</Text>
                </View>

                <View style={styles.pathTextArea}>
                  <Text style={styles.pathTitle}>Dhis caadooyin waara</Text>
                  <Text style={styles.pathText}>
                    Tallaabooyin yar-yar oo aad noloshaada ku sii wadi karto.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Reassurance */}
          <View style={styles.reassuranceCard}>
            <View style={styles.reassuranceIcon}>
              <Text style={styles.heart}>💚</Text>
            </View>

            <View style={styles.reassuranceTextArea}>
              <Text style={styles.reassuranceTitle}>Ma jiro cunto “xun.”</Text>

              <Text style={styles.reassuranceText}>
                CaatoAI wuxuu ku bari doonaa sida cuntada aad jeceshahay uga mid
                noqon karto qorshahaaga.
              </Text>
            </View>
          </View>

          {/* Start */}
          <View style={styles.bottomArea}>
            <Text style={styles.readyText}>
              Marka hore, aan wax yar kaa baranno.
            </Text>

            <Pressable
              onPress={() => router.push("/onboarding")}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Bilow safarkayga</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </Pressable>

            <Text style={styles.privacyText}>
              🔒 Jawaabahaaga waxaa loo isticmaalaa in qorshahaaga laguu
              waafajiyo.
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
    backgroundColor: "#FBF8F1",
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },

  container: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 22,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 34,
  },

  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#E3F1E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  logoEmoji: {
    fontSize: 23,
  },

  brandName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#173F2A",
  },

  brandSubtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    color: "#748078",
  },

  hero: {
    marginBottom: 25,
  },

  eyebrow: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF4EA",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 15,
  },

  eyebrowText: {
    color: "#3F6F4D",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900",
    color: "#202923",
    letterSpacing: -0.8,
  },

  titleGreen: {
    color: "#28623B",
  },

  subtitle: {
    marginTop: 15,
    maxWidth: 500,
    fontSize: 15,
    lineHeight: 23,
    color: "#667169",
  },

  visualCard: {
    backgroundColor: "#173F2A",
    borderRadius: 28,
    padding: 21,
    marginBottom: 14,
  },

  visualTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  coachIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#2B583B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  coachEmoji: {
    fontSize: 23,
  },

  visualHeading: {
    flex: 1,
  },

  visualLabel: {
    color: "#9BC6A5",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 3,
  },

  visualTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  visualText: {
    color: "#D7E7DA",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 16,
    marginBottom: 20,
  },

  path: {
    backgroundColor: "#204B32",
    borderRadius: 21,
    padding: 16,
  },

  pathItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  pathIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#315D40",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  pathEmoji: {
    fontSize: 18,
  },

  pathTextArea: {
    flex: 1,
  },

  pathTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 2,
  },

  pathText: {
    color: "#C8DCCA",
    fontSize: 11,
    lineHeight: 16,
  },

  connector: {
    width: 2,
    height: 13,
    backgroundColor: "#4E755A",
    marginLeft: 19,
    marginVertical: 4,
  },

  reassuranceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E7DF",
    borderRadius: 20,
    padding: 16,
  },

  reassuranceIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#EAF5EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  heart: {
    fontSize: 19,
  },

  reassuranceTextArea: {
    flex: 1,
  },

  reassuranceTitle: {
    color: "#243128",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3,
  },

  reassuranceText: {
    color: "#707A73",
    fontSize: 11,
    lineHeight: 16,
  },

  bottomArea: {
    marginTop: 23,
    marginBottom: 12,
  },

  readyText: {
    color: "#4D5B51",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 11,
  },

  button: {
    minHeight: 58,
    borderRadius: 19,
    backgroundColor: "#28623B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginLeft: 9,
  },

  privacyText: {
    color: "#8A928C",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 11,
    paddingHorizontal: 18,
  },
});
