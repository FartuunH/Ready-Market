import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type WomensHealthOption =
  | "pregnant"
  | "breastfeeding"
  | "neither"
  | "prefer_not_to_say";

const OPTIONS = [
  {
    id: "pregnant" as WomensHealthOption,
    emoji: "🤰",
    title: "Uur baan leeyahay",
    description: "Waxaan qorshahaaga ku waafajin doonaa marxaladda uurka.",
  },
  {
    id: "breastfeeding" as WomensHealthOption,
    emoji: "🤱",
    title: "Waan naasnuujiyaa",
    description: "Waxaan tixgelin doonaa baahidaada tamar iyo nafaqo.",
  },
  {
    id: "neither" as WomensHealthOption,
    emoji: "🌿",
    title: "Midkoodna",
    description: "Uur ma lihi, mana naasnuujiyo.",
  },
  {
    id: "prefer_not_to_say" as WomensHealthOption,
    emoji: "💚",
    title: "Waxaan doorbidayaa inaanan sheegin",
    description: "Waad sii wadan kartaa adigoon jawaabtan bixin.",
  },
];

export default function OnboardingWomensHealthScreen() {
  const params = useLocalSearchParams();

  const [selected, setSelected] = useState<WomensHealthOption | null>(null);

  const canContinue = selected !== null;

  const continueNext = () => {
    if (!selected) return;

    router.push({
      pathname: "/onboarding-activity",
      params: {
        ...params,
        womensHealth: selected,
      },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* TOP */}

        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>

          <View style={styles.progressArea}>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>

            <Text style={styles.progressText}>
              Waxaan kuu dhisaynaa qorshe kuu gaar ah
            </Text>
          </View>
        </View>

        {/* COACH */}

        <View style={styles.coachRow}>
          <View style={styles.coachIcon}>
            <Text style={styles.coachEmoji}>🌿</Text>
          </View>

          <View style={styles.coachTextArea}>
            <Text style={styles.coachName}>CaatoAI</Text>

            <Text style={styles.coachLabel}>
              Badbaadadaada ayaa muhiim noo ah
            </Text>
          </View>
        </View>

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>CAAFIMAADKAAGA</Text>
          </View>

          <Text style={styles.title}>
            Midkee ayaa hadda{"\n"}
            <Text style={styles.titleGreen}>adiga ku khuseeya?</Text>
          </Text>

          <Text style={styles.subtitle}>
            Jawaabtani waxay naga caawinaysaa inaan qorshaha cuntada iyo
            dhaqdhaqaaqa kuu waafajino si ka taxaddar badan.
          </Text>
        </View>

        {/* OPTIONS */}

        <View style={styles.optionsArea}>
          {OPTIONS.map((option) => {
            const active = selected === option.id;

            return (
              <Pressable
                key={option.id}
                onPress={() => setSelected(option.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  active && styles.optionCardActive,
                  pressed && styles.optionPressed,
                ]}
              >
                <View
                  style={[styles.optionIcon, active && styles.optionIconActive]}
                >
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                </View>

                <View style={styles.optionTextArea}>
                  <Text
                    style={[
                      styles.optionTitle,
                      active && styles.optionTitleActive,
                    ]}
                  >
                    {option.title}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>

                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* CONDITIONAL MESSAGE */}

        {selected === "pregnant" && (
          <View style={styles.specialCard}>
            <Text style={styles.specialEmoji}>💚</Text>

            <View style={styles.specialTextArea}>
              <Text style={styles.specialTitle}>
                Qorshahaagu wuu isbeddelayaa
              </Text>

              <Text style={styles.specialText}>
                Inta aad uurka leedahay, CaatoAI kuma saari doono qorshe
                miisaan-dhimis, fasting ama OMAD. Waxaan diiradda saari doonaa
                caadooyin caafimaad leh iyo taageero guud.
              </Text>
            </View>
          </View>
        )}

        {selected === "breastfeeding" && (
          <View style={styles.specialCard}>
            <Text style={styles.specialEmoji}>💚</Text>

            <View style={styles.specialTextArea}>
              <Text style={styles.specialTitle}>
                Waxaan tixgelin doonaa naasnuujinta
              </Text>

              <Text style={styles.specialText}>
                CaatoAI wuxuu ka fogaan doonaa qorshayaal aad u xaddidan,
                fasting iyo OMAD, wuxuuna mudnaanta siin doonaa nafaqo ku filan,
                protein, biyo iyo tamar.
              </Text>
            </View>
          </View>
        )}

        {/* WHY ASK */}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoEmoji}>🛡️</Text>
          </View>

          <View style={styles.infoTextArea}>
            <Text style={styles.infoTitle}>Maxaan tan kuu weydiinaynaa?</Text>

            <Text style={styles.infoText}>
              Baahida nafaqada iyo talooyinka miisaanka way kala duwanaan karaan
              xilliga uurka iyo naasnuujinta. Jawaabtani waxay naga caawinaysaa
              inaan ka fogaano talo aan ku habboonayn xaaladdaada.
            </Text>
          </View>
        </View>

        {/* PRIVACY */}

        <View style={styles.privacyCard}>
          <Text style={styles.privacyEmoji}>🔒</Text>

          <View style={styles.privacyTextArea}>
            <Text style={styles.privacyTitle}>Jawaabtani waa kuu gaar</Text>

            <Text style={styles.privacyDescription}>
              Waxaa loo isticmaalaa oo keliya shakhsiyeynta khibraddaada iyo
              qorshaha CaatoAI.
            </Text>
          </View>
        </View>

        {/* BUTTON */}

        <View style={styles.bottomArea}>
          <Pressable
            disabled={!canContinue}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !canContinue && styles.buttonDisabled,
              pressed && canContinue && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.bottomText}>
            💚 Waxaad dooran kartaa inaadan macluumaadkan nala wadaagin.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 18,
  },

  container: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 22,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  backArrow: {
    color: "#173F2A",
    fontSize: 30,
    lineHeight: 31,
    fontWeight: "500",
    marginTop: -2,
  },

  pressed: {
    opacity: 0.75,
  },

  progressArea: {
    flex: 1,
  },

  progressTrack: {
    height: 5,
    backgroundColor: "#E2E7E2",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    width: "44%",
    height: "100%",
    backgroundColor: "#4F7C5B",
    borderRadius: 999,
  },

  progressText: {
    color: "#8A938C",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 6,
  },

  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  coachIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#E3F1E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  coachEmoji: {
    fontSize: 22,
  },

  coachTextArea: {
    flex: 1,
  },

  coachName: {
    color: "#173F2A",
    fontSize: 15,
    fontWeight: "900",
  },

  coachLabel: {
    color: "#7B857E",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },

  hero: {
    marginBottom: 20,
  },

  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF4EA",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },

  stepBadgeText: {
    color: "#477253",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.9,
  },

  title: {
    color: "#202923",
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "900",
    letterSpacing: -0.6,
    marginBottom: 11,
  },

  titleGreen: {
    color: "#28623B",
  },

  subtitle: {
    color: "#68736B",
    fontSize: 14,
    lineHeight: 21,
  },

  optionsArea: {
    gap: 10,
  },

  optionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E6E0",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  optionCardActive: {
    backgroundColor: "#F1F7F0",
    borderColor: "#79A783",
  },

  optionPressed: {
    opacity: 0.88,
  },

  optionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#F2F5F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionIconActive: {
    backgroundColor: "#DDEDDD",
  },

  optionEmoji: {
    fontSize: 20,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitle: {
    color: "#303A33",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },

  optionTitleActive: {
    color: "#28563A",
  },

  optionDescription: {
    color: "#818A83",
    fontSize: 10,
    lineHeight: 15,
  },

  radio: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCD4CD",
    alignItems: "center",
    justifyContent: "center",
  },

  radioActive: {
    borderColor: "#4F7C5B",
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#4F7C5B",
  },

  specialCard: {
    marginTop: 13,
    backgroundColor: "#EAF4EA",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  specialEmoji: {
    fontSize: 18,
    marginRight: 10,
  },

  specialTextArea: {
    flex: 1,
  },

  specialTitle: {
    color: "#28563A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 4,
  },

  specialText: {
    color: "#607067",
    fontSize: 10,
    lineHeight: 16,
  },

  infoCard: {
    marginTop: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F0F4ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  infoEmoji: {
    fontSize: 17,
  },

  infoTextArea: {
    flex: 1,
  },

  infoTitle: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  infoText: {
    color: "#7B847D",
    fontSize: 10,
    lineHeight: 15,
  },

  privacyCard: {
    marginTop: 11,
    backgroundColor: "#F3F5F1",
    borderRadius: 17,
    padding: 13,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  privacyEmoji: {
    fontSize: 16,
    marginRight: 9,
  },

  privacyTextArea: {
    flex: 1,
  },

  privacyTitle: {
    color: "#4C5D50",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 2,
  },

  privacyDescription: {
    color: "#818A83",
    fontSize: 9,
    lineHeight: 14,
  },

  bottomArea: {
    marginTop: "auto",
    paddingTop: 25,
    paddingBottom: 8,
  },

  button: {
    minHeight: 58,
    backgroundColor: "#28623B",
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  buttonDisabled: {
    backgroundColor: "#C9D5CB",
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

  bottomText: {
    color: "#8A928C",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 11,
    paddingHorizontal: 15,
  },
});
