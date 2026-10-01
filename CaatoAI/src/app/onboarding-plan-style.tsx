import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type PlanStyle = "regular" | "intermittent-fasting" | "omad";

const OPTIONS: {
  id: PlanStyle;
  emoji: string;
  title: string;
  description: string;
  badge?: string;
}[] = [
  {
    id: "regular",
    emoji: "🍽️",
    title: "Qorshe caadi ah",
    description:
      "Cuntooyin joogto ah, portions, protein iyo caadooyin yar-yar oo aad sii wadi karto.",
    badge: "LAGU TALIYAY",
  },
  {
    id: "intermittent-fasting",
    emoji: "⏰",
    title: "Intermittent Fasting",
    description:
      "Waxaan rabaa inaan isticmaalo waqtiyo cunto iyo waqtiyo aanan wax cunin.",
  },
  {
    id: "omad",
    emoji: "🌙",
    title: "OMAD",
    description: "Waxaan xiiseynayaa qaabka hal cunto oo weyn maalintii.",
  },
];

export default function OnboardingPlanStyleScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [selected, setSelected] = useState<PlanStyle>("regular");

  const selectedOption = OPTIONS.find((option) => option.id === selected);

  const continueNext = () => {
    if (!selectedOption) return;

    router.push({
      pathname: "/onboarding-building-plan",
      params: {
        ...params,
        planStyle: selected,
        planStyleLabel: selectedOption.title,
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

            <Text style={styles.progressText}>Tallaabadii ugu dambeysay</Text>
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
              Aan dooranno qaabka aad ku bilaabayso
            </Text>
          </View>
        </View>

        {/* PERSONAL */}

        {name ? (
          <View style={styles.personalCard}>
            <Text style={styles.personalEmoji}>💚</Text>

            <Text style={styles.personalText}>
              {name}, ma jiro hal qaab oo qof walba u shaqeeya. Waxaad dooran
              kartaa sida aad rabto inaad ku bilowdo, waadna beddeli kartaa mar
              dambe.
            </Text>
          </View>
        ) : null}

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>QAABKA QORSHAHAAGA</Text>
          </View>

          <Text style={styles.title}>
            Sidee ayaad rabtaa inaad{"\n"}
            <Text style={styles.titleGreen}>ku bilowdo?</Text>
          </Text>

          <Text style={styles.subtitle}>
            CaatoAI wuxuu diiradda saarayaa caadooyin waara. Haddii aad doorato
            fasting, waxaan weli ilaalin doonaa nafaqada, protein-ka iyo tayada
            cuntada.
          </Text>
        </View>

        {/* OPTIONS */}

        <View style={styles.optionsArea}>
          {OPTIONS.map((option) => {
            const isSelected = selected === option.id;

            return (
              <Pressable
                key={option.id}
                onPress={() => setSelected(option.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <View
                  style={[
                    styles.optionIcon,
                    isSelected && styles.optionIconSelected,
                  ]}
                >
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                </View>

                <View style={styles.optionTextArea}>
                  <View style={styles.optionTitleRow}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.optionTitleSelected,
                      ]}
                    >
                      {option.title}
                    </Text>

                    {option.badge ? (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>
                          {option.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* DYNAMIC PLAN EXPLANATION */}

        <View style={styles.aiCard}>
          <View style={styles.aiTop}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiEmoji}>✨</Text>
            </View>

            <View style={styles.aiHeading}>
              <Text style={styles.aiLabel}>QORSHAHA CAATOAI</Text>

              <Text style={styles.aiTitle}>
                {selected === "regular"
                  ? "Bilow fudud oo la sii wadi karo"
                  : selected === "intermittent-fasting"
                    ? "Fasting-ku waa qaabka waqtiga cuntada"
                    : "OMAD wuxuu u baahan yahay qorshe taxaddar leh"}
              </Text>
            </View>
          </View>

          {selected === "regular" && (
            <Text style={styles.aiText}>
              Waxaan kuu dhisi doonaa cuntooyin joogto ah oo diiradda saaraya
              portions, protein, khudaar, biyo iyo caadooyin aad maalin kasta ku
              horumarin karto.
            </Text>
          )}

          {selected === "intermittent-fasting" && (
            <Text style={styles.aiText}>
              Haddii fasting-ku kuu habboon yahay, CaatoAI wuxuu kaa caawin
              karaa inaad doorato eating window macquul ah. Fasting-ku ma
              beddelayo muhiimadda nafaqada iyo qadarka cuntada.
            </Text>
          )}

          {selected === "omad" && (
            <Text style={styles.aiText}>
              OMAD waa qaab ka xaddidan qorshaha caadiga ah. CaatoAI wuxuu marka
              hore tixgelin doonaa xogtaada iyo xaaladaha kaa dhigaya fasting
              mid aan kugu habboonayn ka hor inta aan loo isticmaalin qorshe
              maalinle ah.
            </Text>
          )}
        </View>

        {/* NO BAD FOODS */}

        <View style={styles.philosophyCard}>
          <View style={styles.philosophyIcon}>
            <Text style={styles.philosophyEmoji}>🍲</Text>
          </View>

          <View style={styles.philosophyTextArea}>
            <Text style={styles.philosophyTitle}>
              Cuntada aad jeceshahay weli meel ayay leedahay
            </Text>

            <Text style={styles.philosophyText}>
              Qaabka aad doorato ma micnaheedu aha inaad ka tagto cuntadaada
              caadiga ah. Waxaan baran doonaa portions, isku dheelitirka iyo
              sida cuntadu ugu habboonaan karto hadafkaaga.
            </Text>
          </View>
        </View>

        {/* SAFETY */}

        <View style={styles.safetyCard}>
          <Text style={styles.safetyEmoji}>🛡️</Text>

          <View style={styles.safetyTextArea}>
            <Text style={styles.safetyTitle}>
              Fasting qof walba kuma habboona
            </Text>

            <Text style={styles.safetyText}>
              Uurka, naasnuujinta, xaalado caafimaad qaarkood, daawooyinka
              qaarkood ama taariikh dhibaatooyin cunto waxay beddeli karaan waxa
              kugu habboon. CaatoAI ma beddelayo talada dhakhtarkaaga.
            </Text>
          </View>
        </View>

        {/* CHANGE LATER */}

        <View style={styles.changeCard}>
          <Text style={styles.changeEmoji}>🔄</Text>

          <View style={styles.changeTextArea}>
            <Text style={styles.changeTitle}>Go'aankani joogto ma aha</Text>

            <Text style={styles.changeText}>
              Waxaad qaabkaaga mar dambe beddeli kartaa. Hadafku waa inaan helno
              waxa aad si caafimaad leh u sii wadi karto.
            </Text>
          </View>
        </View>

        {/* BUTTON */}

        <View style={styles.bottomArea}>
          <Pressable
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Samee qorshahayga</Text>

            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.bottomText}>
            🌿 CaatoAI wuxuu hadda isku dari doonaa jawaabahaaga si uu kuu tuso
            qorshahaaga bilowga ah.
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
    width: "100%",
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
    marginBottom: 16,
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
    lineHeight: 15,
    fontWeight: "600",
    marginTop: 2,
  },

  personalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF5EC",
    borderRadius: 16,
    padding: 13,
    marginBottom: 21,
  },

  personalEmoji: {
    fontSize: 17,
    marginRight: 9,
  },

  personalText: {
    flex: 1,
    color: "#52685A",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },

  hero: {
    marginBottom: 18,
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
    letterSpacing: 0.8,
  },

  title: {
    color: "#202923",
    fontSize: 30,
    lineHeight: 37,
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
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  optionCardSelected: {
    backgroundColor: "#F1F7F0",
    borderColor: "#79A783",
  },

  optionPressed: {
    opacity: 0.88,
  },

  optionIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: "#F2F5F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionIconSelected: {
    backgroundColor: "#DDEDDD",
  },

  optionEmoji: {
    fontSize: 21,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },

  optionTitle: {
    color: "#303A33",
    fontSize: 13,
    fontWeight: "900",
  },

  optionTitleSelected: {
    color: "#28563A",
  },

  optionDescription: {
    color: "#818A83",
    fontSize: 10,
    lineHeight: 15,
  },

  recommendedBadge: {
    backgroundColor: "#DDEDDD",
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },

  recommendedText: {
    color: "#376647",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCD4CD",
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterSelected: {
    borderColor: "#4F7C5B",
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4F7C5B",
  },

  aiCard: {
    marginTop: 13,
    backgroundColor: "#173F2A",
    borderRadius: 21,
    padding: 16,
  },

  aiTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#28563A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  aiEmoji: {
    fontSize: 18,
  },

  aiHeading: {
    flex: 1,
  },

  aiLabel: {
    color: "#9FC0A7",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,
    marginBottom: 2,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  aiText: {
    color: "#C9D9CC",
    fontSize: 10,
    lineHeight: 16,
  },

  philosophyCard: {
    marginTop: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  philosophyIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F0F4ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  philosophyEmoji: {
    fontSize: 17,
  },

  philosophyTextArea: {
    flex: 1,
  },

  philosophyTitle: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  philosophyText: {
    color: "#7B847D",
    fontSize: 10,
    lineHeight: 15,
  },

  safetyCard: {
    marginTop: 11,
    backgroundColor: "#FFF8E8",
    borderWidth: 1,
    borderColor: "#F2E4BE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  safetyEmoji: {
    fontSize: 17,
    marginRight: 10,
  },

  safetyTextArea: {
    flex: 1,
  },

  safetyTitle: {
    color: "#67582E",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  safetyText: {
    color: "#7D7355",
    fontSize: 10,
    lineHeight: 15,
  },

  changeCard: {
    marginTop: 11,
    backgroundColor: "#EAF4EA",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  changeEmoji: {
    fontSize: 17,
    marginRight: 10,
  },

  changeTextArea: {
    flex: 1,
  },

  changeTitle: {
    color: "#28563A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  changeText: {
    color: "#607067",
    fontSize: 10,
    lineHeight: 15,
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
