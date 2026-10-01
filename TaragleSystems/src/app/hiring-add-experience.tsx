import { useHiringApplication } from "@/context/HiringApplicationContext";
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

export default function HiringExperienceScreen() {
  const { application, updateApplication } = useHiringApplication();

  const [yearsDriving, setYearsDriving] = useState(application.yearsDriving);

  const [tractorTrailerYears, setTractorTrailerYears] = useState(
    application.tractorTrailerYears,
  );

  const [equipmentTypes, setEquipmentTypes] = useState(
    application.equipmentTypes,
  );

  const [statesOperated, setStatesOperated] = useState(
    application.statesOperated,
  );

  const [endorsements, setEndorsements] = useState(application.endorsements);

  const [restrictions, setRestrictions] = useState(application.restrictions);

  const [canDriveInterstate, setCanDriveInterstate] = useState<
    "yes" | "no" | null
  >(application.canDriveInterstate);

  const [hasMedicalCard, setHasMedicalCard] = useState<"yes" | "no" | null>(
    application.hasMedicalCard,
  );

  const [medicalExpiration, setMedicalExpiration] = useState(
    application.medicalExpiration,
  );

  function saveStep2() {
    updateApplication({
      yearsDriving,
      tractorTrailerYears,
      equipmentTypes,
      statesOperated,
      endorsements,
      restrictions,
      canDriveInterstate,
      hasMedicalCard,
      medicalExpiration,
    });
  }
  function handleContinue() {
    saveStep2();
    router.push("/hiring-add-employment");
  }

  function handlePrevious() {
    saveStep2();
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={handlePrevious}>
          <Text style={styles.back}>← Back to Step 1</Text>
        </Pressable>

        <Text style={styles.eyebrow}>HIRING</Text>
        <Text style={styles.title}>Driver Application</Text>

        <Text style={styles.description}>
          Tell us about the driver's commercial driving experience and
          qualifications.
        </Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressStep}>STEP 2 OF 6</Text>
          <Text style={styles.progressTitle}>
            Driving Experience & Qualifications
          </Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Driving Experience</Text>

          <Text style={styles.sectionDescription}>
            Enter the applicant's commercial driving experience.
          </Text>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>
                Total Commercial Driving Experience
              </Text>

              <TextInput
                style={styles.input}
                value={yearsDriving}
                onChangeText={setYearsDriving}
                placeholder="Example: 5 years"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tractor-Trailer Experience</Text>

              <TextInput
                style={styles.input}
                value={tractorTrailerYears}
                onChangeText={setTractorTrailerYears}
                placeholder="Example: 3 years"
              />
            </View>
          </View>

          <Text style={styles.label}>Equipment Experience</Text>

          <TextInput
            style={styles.input}
            value={equipmentTypes}
            onChangeText={setEquipmentTypes}
            placeholder="Dry van, reefer, flatbed, box truck..."
          />

          <Text style={styles.label}>States / Areas Operated</Text>

          <TextInput
            style={styles.input}
            value={statesOperated}
            onChangeText={setStatesOperated}
            placeholder="Example: Midwest, MN, WI, IL, IA..."
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>CDL Qualifications</Text>

          <Text style={styles.label}>Endorsements</Text>

          <TextInput
            style={styles.input}
            value={endorsements}
            onChangeText={setEndorsements}
            placeholder="HazMat, Tanker, Doubles/Triples, Passenger..."
          />

          <Text style={styles.label}>CDL Restrictions</Text>

          <TextInput
            style={styles.input}
            value={restrictions}
            onChangeText={setRestrictions}
            placeholder="Enter restrictions or None"
          />

          <Text style={styles.question}>Qualified for interstate driving?</Text>

          <View style={styles.choiceRow}>
            <Pressable
              style={[
                styles.choiceButton,
                canDriveInterstate === "yes" && styles.choiceSelected,
              ]}
              onPress={() => setCanDriveInterstate("yes")}
            >
              <Text
                style={[
                  styles.choiceText,
                  canDriveInterstate === "yes" && styles.choiceSelectedText,
                ]}
              >
                Yes
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.choiceButton,
                canDriveInterstate === "no" && styles.choiceSelected,
              ]}
              onPress={() => setCanDriveInterstate("no")}
            >
              <Text
                style={[
                  styles.choiceText,
                  canDriveInterstate === "no" && styles.choiceSelectedText,
                ]}
              >
                No
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Medical Certificate</Text>

          <Text style={styles.question}>
            Does the applicant currently have a medical certificate?
          </Text>

          <View style={styles.choiceRow}>
            <Pressable
              style={[
                styles.choiceButton,
                hasMedicalCard === "yes" && styles.choiceSelected,
              ]}
              onPress={() => setHasMedicalCard("yes")}
            >
              <Text
                style={[
                  styles.choiceText,
                  hasMedicalCard === "yes" && styles.choiceSelectedText,
                ]}
              >
                Yes
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.choiceButton,
                hasMedicalCard === "no" && styles.choiceSelected,
              ]}
              onPress={() => setHasMedicalCard("no")}
            >
              <Text
                style={[
                  styles.choiceText,
                  hasMedicalCard === "no" && styles.choiceSelectedText,
                ]}
              >
                No
              </Text>
            </Pressable>
          </View>

          {hasMedicalCard === "yes" && (
            <>
              <Text style={styles.label}>Medical Certificate Expiration</Text>

              <TextInput
                style={styles.input}
                value={medicalExpiration}
                onChangeText={setMedicalExpiration}
                placeholder="MM/DD/YYYY"
                keyboardType="number-pad"
              />
            </>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.backButton} onPress={handlePrevious}>
            <Text style={styles.backButtonText}>← Previous</Text>
          </Pressable>

          <Pressable style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Save & Continue →</Text>
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
    maxWidth: 1000,
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
    marginBottom: 20,
  },

  progressCard: {
    backgroundColor: "#EAF3FF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
  },

  progressStep: {
    color: "#1473E6",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  progressTitle: {
    color: "#102A43",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },

  progressTrack: {
    height: 7,
    backgroundColor: "#D4E5FA",
    borderRadius: 10,
    marginTop: 13,
    overflow: "hidden",
  },

  progressFill: {
    width: "33.33%",
    height: "100%",
    backgroundColor: "#1473E6",
    borderRadius: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 16,
    padding: 22,
    marginBottom: 18,
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
    marginBottom: 10,
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
    marginTop: 14,
  },

  question: {
    color: "#334E68",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
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

  choiceRow: {
    flexDirection: "row",
    gap: 10,
  },

  choiceButton: {
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#D8E1EA",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
    alignItems: "center",
  },

  choiceSelected: {
    backgroundColor: "#1473E6",
    borderColor: "#1473E6",
  },

  choiceText: {
    color: "#334E68",
    fontSize: 13,
    fontWeight: "700",
  },

  choiceSelectedText: {
    color: "#FFFFFF",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 4,
  },

  backButton: {
    borderWidth: 1,
    borderColor: "#D8E1EA",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  backButtonText: {
    color: "#334E68",
    fontSize: 13,
    fontWeight: "800",
  },

  continueButton: {
    backgroundColor: "#1473E6",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
