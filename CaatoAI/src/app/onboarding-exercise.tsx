import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type WorkoutType = "walking" | "home" | "gym" | "mixed" | "difficult";

const workoutOptions = [
  {
    id: "walking" as WorkoutType,
    emoji: "🚶",
    title: "Socod keliya",
    description:
      "Waxaan doorbidayaa inaan ku bilaabo socod iyo tallaabooyin badan.",
  },
  {
    id: "home" as WorkoutType,
    emoji: "🏠",
    title: "Jimicsiga guriga",
    description: "Waxaan rabaa jimicsiyo fudud oo aan guriga ku samayn karo.",
  },
  {
    id: "gym" as WorkoutType,
    emoji: "🏋️‍♀️",
    title: "Gym",
    description: "Waxaan gym-ka aadaa ama waxaan rabaa qorshe jimicsi gym ah.",
  },
  {
    id: "mixed" as WorkoutType,
    emoji: "✨",
    title: "Isku dhafan",
    description:
      "Waxaan jeclaan lahaa socod, guriga iyo gym-ka inaan isku daro.",
  },
  {
    id: "difficult" as WorkoutType,
    emoji: "🌱",
    title: "Jimicsigu hadda wuu igu adag yahay",
    description:
      "Waxaan rabaa inaan si tartiib ah ku bilaabo dhaqdhaqaaq fudud.",
  },
];

export default function OnboardingExerciseScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [workout, setWorkout] = useState<WorkoutType | null>(null);

  const selectedWorkout = workoutOptions.find((item) => item.id === workout);

  const continueNext = () => {
    if (!selectedWorkout) return;

    router.push({
      // Temporary until we build the next onboarding screen.
      pathname: "/onboarding-eating-behavior",
      params: {
        ...params,
        workout: selectedWorkout.id,
        workoutLabel: selectedWorkout.title,
      },
    });
  };

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
              Qorshahaaga waa inuu noloshaada ku shaqeeyaa
            </Text>
          </View>
        </View>

        <Text style={styles.smallGreeting}>
          {name ? `${name}, ` : ""}
          dooro waxa adiga kuu fudud 💚
        </Text>

        <Text style={styles.title}>
          Jimicsi noocee ah ayaa{"\n"}
          <Text style={styles.titleHighlight}>noloshaada kuugu fudud?</Text>
        </Text>

        <Text style={styles.subtitle}>
          Uma baahnid inaad doorato jimicsiga ugu adag. Waxaan rabnaa wax aad si
          dhab ah u sii wadi karto.
        </Text>

        <View style={styles.options}>
          {workoutOptions.map((item) => {
            const selected = workout === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setWorkout(item.id)}
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

        {selectedWorkout ? (
          <View style={styles.responseCard}>
            <Text style={styles.responseEmoji}>✨</Text>

            <View style={styles.responseTextArea}>
              <Text style={styles.responseTitle}>
                Taasi waa qorshe fiican oo laga bilaabo.
              </Text>

              <Text style={styles.responseText}>
                CaatoAI wuxuu ku siin doonaa jimicsi ku habboon heerkaaga hadda.
                Haddii uu wax kuu adkaado, waxaan kuu siin karnaa nooc ka fudud.
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.reminderCard}>
          <Text style={styles.reminderEmoji}>💚</Text>

          <View style={styles.reminderTextArea}>
            <Text style={styles.reminderTitle}>
              Uma baahnid inaad si adag ku bilowdo
            </Text>

            <Text style={styles.reminderText}>
              Socod 10 daqiiqo ah ama jimicsi yar ayaa sidoo kale noqon kara
              bilow wanaagsan. Joogteynta ayaa ka muhiimsan inaad hal maalin wax
              badan samayso.
            </Text>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <Pressable
            disabled={!selectedWorkout}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !selectedWorkout && styles.buttonDisabled,
              pressed && selectedWorkout && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>

            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.privacyText}>
            🔒 Jimicsigaaga iyo horumarkaaga qofna lama wadaagayo ilaa aad adigu
            doorato.
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
    width: "68%",
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

  reminderCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 12,
  },

  reminderEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  reminderTextArea: {
    flex: 1,
  },

  reminderTitle: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  reminderText: {
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
