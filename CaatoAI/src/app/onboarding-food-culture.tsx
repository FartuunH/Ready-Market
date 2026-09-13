import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type FoodCulture = "somali" | "mixed" | "simple" | "high-protein";

const foodOptions = [
  {
    id: "somali" as FoodCulture,
    emoji: "🍚",
    title: "Cunto Somali ah",
    description:
      "Waxaan inta badan cunaa bariis, baasto, canjeero, hilib, suugo iyo cuntooyin Somali ah.",
  },
  {
    id: "mixed" as FoodCulture,
    emoji: "🌍",
    title: "Cuntooyin isku dhafan",
    description: "Waxaan isku daraa cunto Somali ah iyo cuntooyin kale.",
  },
  {
    id: "simple" as FoodCulture,
    emoji: "🥗",
    title: "Cunto fudud oo sahlan",
    description:
      "Waxaan jeclahay cuntooyin sahlan oo degdeg loo diyaarin karo.",
  },
  {
    id: "high-protein" as FoodCulture,
    emoji: "💪",
    title: "Protein badan",
    description:
      "Waxaan rabaa inaan diiradda saaro cuntooyin protein badan leh.",
  },
];

export default function OnboardingFoodCultureScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [foodCulture, setFoodCulture] = useState<FoodCulture | null>(null);

  const selectedFood = foodOptions.find((item) => item.id === foodCulture);

  const continueNext = () => {
    if (!selectedFood) return;

    router.push({
      // Temporary until we create the next onboarding screen.
      pathname: "/onboarding-womens-health",
      params: {
        ...params,
        foodCulture: selectedFood.id,
        foodCultureLabel: selectedFood.title,
      },
    });
  };

  const getCoachResponse = () => {
    if (!selectedFood) return null;

    switch (selectedFood.id) {
      case "somali":
        return {
          title: "Uma baahnid inaad ka tagto cuntada Somaliyeed.",
          text: "CaatoAI wuxuu kaa caawin doonaa portions-ka, protein-ka iyo isku dheelitirka cuntada adigoo weli cunaya cuntooyinka aad taqaan oo aad jeceshahay.",
        };

      case "mixed":
        return {
          title: "Waxaan kuu samayn karnaa qorshe dabacsan.",
          text: "Waxaan isku dari karnaa cuntooyinka Somaliyeed iyo cuntooyin kale si qorshahaagu ula jaanqaado sida aad dhab ahaan u cunto.",
        };

      case "simple":
        return {
          title: "Qorshuhu ma aha inuu adag noqdo.",
          text: "Waxaan diiradda saari doonaa cuntooyin sahlan, la awoodi karo oo aan waqti badan kaa qaadan.",
        };

      default:
        return {
          title: "Protein-ku wuxuu kaa caawin karaa qorshahaaga.",
          text: "CaatoAI wuxuu kaa caawin doonaa inaad hesho protein ku filan adigoo isticmaalaya cuntooyin kuu fudud oo aad heli karto.",
        };
    }
  };

  const coachResponse = getCoachResponse();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Coach */}
        <View style={styles.coachRow}>
          <View style={styles.coachIcon}>
            <Text style={styles.coachEmoji}>🌿</Text>
          </View>

          <View style={styles.coachTextArea}>
            <Text style={styles.coachName}>CaatoAI</Text>

            <Text style={styles.coachLabel}>
              Cuntada aad jeceshahay waa qayb ka mid ah qorshaha
            </Text>
          </View>
        </View>

        <Text style={styles.smallGreeting}>
          {name ? `${name}, ` : ""}
          ma doonayno qorshe kaa fog noloshaada 💚
        </Text>

        <Text style={styles.title}>
          Cunto noocee ah ayaad{"\n"}
          <Text style={styles.titleHighlight}>inta badan cuntaa?</Text>
        </Text>

        <Text style={styles.subtitle}>
          Dooro midka sida ugu dhow kuu sharaxaya. Waxaad mar dambe dooran
          kartaa cuntooyin gaar ah oo aad jeceshahay ama aad iska ilaaliso.
        </Text>

        <View style={styles.options}>
          {foodOptions.map((item) => {
            const selected = foodCulture === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setFoodCulture(item.id)}
                style={[
                  styles.optionCard,
                  selected && styles.optionCardSelected,
                ]}
              >
                <View
                  style={[
                    styles.optionIcon,
                    selected && styles.optionIconSelected,
                  ]}
                >
                  <Text style={styles.optionEmoji}>{item.emoji}</Text>
                </View>

                <View style={styles.optionTextArea}>
                  <Text
                    style={[
                      styles.optionTitle,
                      selected && styles.optionTitleSelected,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {item.description}
                  </Text>
                </View>

                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {coachResponse ? (
          <View style={styles.responseCard}>
            <Text style={styles.responseEmoji}>✨</Text>

            <View style={styles.responseTextArea}>
              <Text style={styles.responseTitle}>{coachResponse.title}</Text>

              <Text style={styles.responseText}>{coachResponse.text}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.cultureCard}>
          <Text style={styles.cultureEmoji}>🍲</Text>

          <View style={styles.cultureTextArea}>
            <Text style={styles.cultureTitle}>
              Cuntada dhaqankaaga ma aha “cunto xun”
            </Text>

            <Text style={styles.cultureText}>
              CaatoAI wuxuu kaa caawin doonaa inaad barato portions, protein iyo
              isku dheelitirnaan halkii uu kaa mamnuuci lahaa bariis, baasto,
              canjeero ama cuntooyinka aad jeceshahay.
            </Text>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <Pressable
            disabled={!selectedFood}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !selectedFood && styles.buttonDisabled,
              pressed && selectedFood && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.privacyText}>
            🔒 Doorashooyinka cuntadaadu waa kuu gaar. Qofna lama wadaagayo ilaa
            aad adigu doorato.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFBF5",
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },

  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  progressTrack: {
    width: "100%",
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 26,
  },

  progressFill: {
    width: "78%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },

  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  coachIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  coachEmoji: {
    fontSize: 21,
  },

  coachTextArea: {
    flex: 1,
  },

  coachName: {
    color: "#14532D",
    fontSize: 15,
    fontWeight: "900",
  },

  coachLabel: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 2,
  },

  smallGreeting: {
    color: "#15803D",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },

  title: {
    color: "#1F2937",
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "900",
    marginBottom: 11,
  },

  titleHighlight: {
    color: "#14532D",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  options: {
    gap: 10,
  },

  optionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DDE8DE",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  optionCardSelected: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  optionIconSelected: {
    backgroundColor: "#DCFCE7",
  },

  optionEmoji: {
    fontSize: 20,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitle: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },

  optionTitleSelected: {
    color: "#14532D",
  },

  optionDescription: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 15,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: "#16A34A",
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },

  responseCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 14,
  },

  responseEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  responseTextArea: {
    flex: 1,
  },

  responseTitle: {
    color: "#14532D",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
  },

  responseText: {
    color: "#4B5563",
    fontSize: 11,
    lineHeight: 17,
  },

  cultureCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 12,
  },

  cultureEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  cultureTextArea: {
    flex: 1,
  },

  cultureTitle: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  cultureText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
  },

  bottomArea: {
    marginTop: "auto",
    paddingTop: 25,
  },

  button: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#14532D",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.35,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 8,
  },

  privacyText: {
    marginTop: 13,
    paddingHorizontal: 12,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "600",
  },
});
