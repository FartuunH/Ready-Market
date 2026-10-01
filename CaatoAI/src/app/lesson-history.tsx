import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const KEY = "caatoai-daily-lessons-v1";

type Progress = {
  completed: number[];
  lastCompletedDate?: string;
  streak: number;
};

const lessons = [
  {
    day: 1,
    category: "Faham jirkaaga",
    title: "Gaajo dhab ah mise rabitaan cunto?",
  },
  {
    day: 2,
    category: "Faham jirkaaga",
    title: "Maxaan u gaajoodaa habeenkii?",
  },
  { day: 3, category: "Faham jirkaaga", title: "Protein iyo dhereg" },
  { day: 4, category: "Faham jirkaaga", title: "Biyaha iyo calaamadaha jirka" },
  { day: 5, category: "Faham jirkaaga", title: "Qaybaha cuntada" },
  { day: 6, category: "Faham jirkaaga", title: "Goorma ayaan dhergaa?" },
  { day: 7, category: "Dib-u-eegis", title: "Toddobaadkaaga koowaad" },
  { day: 8, category: "Caadooyinka", title: "Cunista dareenka" },
  { day: 9, category: "Caadooyinka", title: "Ogow waxa ku kiciya" },
  { day: 10, category: "Caadooyinka", title: "Si tartiib ah u cun" },
  { day: 11, category: "Caadooyinka", title: "Qorshee ka hor gaajada" },
  { day: 12, category: "Caadooyinka", title: "Dukaameysi qorshaysan" },
  { day: 13, category: "Caadooyinka", title: "Cunista bannaanka" },
  { day: 14, category: "Dib-u-eegis", title: "Toddobaadka 2aad" },
  { day: 15, category: "Maskaxda", title: "Maalin qorshaha kaa baxday" },
  {
    day: 16,
    category: "Maskaxda",
    title: "Miisaanku maalin walba wuu dhaqaaqaa",
  },
  { day: 17, category: "Maskaxda", title: "Joogteyn ka badan kaamilnimo" },
  { day: 18, category: "Maskaxda", title: "Hurdada iyo caadooyinka" },
  { day: 19, category: "Maskaxda", title: "Walbahaarka" },
  { day: 20, category: "Maskaxda", title: "Dhaqdhaqaaq yar ayaa xisaabtamaya" },
  { day: 21, category: "Dib-u-eegis", title: "Ka fogow 'dhammaan ama waxba'" },
  { day: 22, category: "Guul waarta", title: "Weekend-ka" },
  { day: 23, category: "Guul waarta", title: "Cuntada qoyska" },
  { day: 24, category: "Guul waarta", title: "Xafladaha iyo munaasabadaha" },
  { day: 25, category: "Guul waarta", title: "La shaqee rabitaanka cuntada" },
  { day: 26, category: "Guul waarta", title: "Markaad qorshaha seegto" },
  { day: 27, category: "Guul waarta", title: "Guul aan miisaan ahayn" },
  { day: 28, category: "Guul waarta", title: "Deegaankaaga kuu shaqaysii" },
  {
    day: 29,
    category: "Guul waarta",
    title: "Qorshahaaga adiga ayuu kuu shaqeeyaa",
  },
  {
    day: 30,
    category: "Dhammaad & bilow cusub",
    title: "30 maalmood — maxaa xiga?",
  },
];

export default function LessonHistoryScreen() {
  const [progress, setProgress] = useState<Progress>({
    completed: [],
    streak: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const raw = await AsyncStorage.getItem(KEY);
          if (active && raw) setProgress(JSON.parse(raw));
        } finally {
          if (active) setLoaded(true);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const nextDay = Math.min(progress.completed.length + 1, 30);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        onPress={() => router.replace("/daily-lesson")}
        style={styles.back}
      >
        <Text style={styles.backText}>‹ Dib u noqo</Text>
      </Pressable>

      <Text style={styles.eyebrow}>CAATOAI • CASHARRADA</Text>
      <Text style={styles.title}>Taariikhda casharrada 📚</Text>
      <Text style={styles.subtitle}>
        Dib u eeg casharradii aad dhammaysay. Casharrada mustaqbalka way xiran
        yihiin ilaa aad gaarto.
      </Text>

      <View style={styles.summary}>
        <Text style={styles.summaryBig}>{progress.completed.length}/30</Text>
        <Text style={styles.summaryText}>
          casharro dhammaatay • 🔥 {progress.streak} maalmood
        </Text>
      </View>

      {!loaded ? (
        <Text style={styles.loading}>Casharrada waa la soo gelinayaa...</Text>
      ) : (
        lessons.map((lesson) => {
          const done = progress.completed.includes(lesson.day);
          const current =
            lesson.day === nextDay && progress.completed.length < 30;
          const locked = !done && !current;
          return (
            <Pressable
              key={lesson.day}
              disabled={locked}
              onPress={() =>
                router.push({
                  pathname: "/daily-lesson",
                  params: { day: String(lesson.day) },
                })
              }
              style={[
                styles.card,
                done && styles.doneCard,
                current && styles.currentCard,
                locked && styles.lockedCard,
              ]}
            >
              <View style={styles.row}>
                <View style={[styles.number, done && styles.doneNumber]}>
                  <Text
                    style={[styles.numberText, done && styles.doneNumberText]}
                  >
                    {done ? "✓" : lesson.day}
                  </Text>
                </View>
                <View style={styles.copy}>
                  <Text style={styles.category}>
                    {locked ? "🔒 " : done ? "✓ " : "🌿 "}
                    {lesson.category}
                  </Text>
                  <Text
                    style={[styles.lessonTitle, locked && styles.lockedText]}
                  >
                    {lesson.title}
                  </Text>
                  <Text style={styles.status}>
                    {done
                      ? "Dhammaatay • Taabo si aad dib ugu akhrido"
                      : current
                        ? "Casharka maanta"
                        : "Weli lama furin"}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBF5" },
  content: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 60,
  },
  back: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 20,
    marginBottom: 12,
  },
  backText: { fontSize: 16, fontWeight: "800", color: "#166534" },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: "#15803D",
    marginBottom: 7,
  },
  title: { fontSize: 29, fontWeight: "900", color: "#1F2937" },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginTop: 7,
    marginBottom: 18,
  },
  summary: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  summaryBig: { fontSize: 23, fontWeight: "900", color: "#166534" },
  summaryText: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 3,
    fontWeight: "700",
  },
  loading: { color: "#166534", fontWeight: "800", marginTop: 20 },
  card: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
  },
  doneCard: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
  currentCard: { borderColor: "#166534", borderWidth: 2 },
  lockedCard: { opacity: 0.58 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  number: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  doneNumber: { backgroundColor: "#DCFCE7" },
  numberText: { fontSize: 14, fontWeight: "900", color: "#374151" },
  doneNumberText: { color: "#166534" },
  copy: { flex: 1 },
  category: {
    fontSize: 10,
    fontWeight: "900",
    color: "#15803D",
    marginBottom: 3,
  },
  lessonTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    color: "#1F2937",
  },
  lockedText: { color: "#6B7280" },
  status: { fontSize: 10, color: "#78716C", marginTop: 4 },
});
