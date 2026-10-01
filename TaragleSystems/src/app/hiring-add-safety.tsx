import {
    AccidentRecord,
    useHiringApplication,
    ViolationRecord,
} from "@/context/HiringApplicationContext";
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

type YesNo = "yes" | "no" | null;

function emptyAccident(): AccidentRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    date: "",
    location: "",
    description: "",
    fatalities: "",
    injuries: "",
    towAway: null,
  };
}

function emptyViolation(): ViolationRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    date: "",
    state: "",
    violation: "",
    disposition: "",
  };
}

export default function HiringSafetyScreen() {
  const { application, updateApplication } = useHiringApplication();

  const [hasAccidents, setHasAccidents] = useState<YesNo>(
    application.hasAccidents,
  );

  const [accidents, setAccidents] = useState<AccidentRecord[]>(
    application.accidents,
  );

  const [hasViolations, setHasViolations] = useState<YesNo>(
    application.hasViolations,
  );

  const [violations, setViolations] = useState<ViolationRecord[]>(
    application.violations,
  );

  const [licenseSuspended, setLicenseSuspended] = useState<YesNo>(
    application.licenseSuspended,
  );

  const [licenseSuspensionExplanation, setLicenseSuspensionExplanation] =
    useState(application.licenseSuspensionExplanation);

  const [licenseDenied, setLicenseDenied] = useState<YesNo>(
    application.licenseDenied,
  );

  const [licenseDenialExplanation, setLicenseDenialExplanation] = useState(
    application.licenseDenialExplanation,
  );

  function chooseAccidents(value: YesNo) {
    setHasAccidents(value);

    if (value === "yes" && accidents.length === 0) {
      setAccidents([emptyAccident()]);
    }

    if (value === "no") {
      setAccidents([]);
    }
  }

  function updateAccident(
    id: string,
    field: keyof AccidentRecord,
    value: string | YesNo,
  ) {
    setAccidents((current) =>
      current.map((accident) =>
        accident.id === id
          ? {
              ...accident,
              [field]: value,
            }
          : accident,
      ),
    );
  }

  function addAccident() {
    setAccidents((current) => [...current, emptyAccident()]);
  }

  function removeAccident(id: string) {
    setAccidents((current) => current.filter((accident) => accident.id !== id));
  }

  function chooseViolations(value: YesNo) {
    setHasViolations(value);

    if (value === "yes" && violations.length === 0) {
      setViolations([emptyViolation()]);
    }

    if (value === "no") {
      setViolations([]);
    }
  }

  function updateViolation(
    id: string,
    field: keyof ViolationRecord,
    value: string,
  ) {
    setViolations((current) =>
      current.map((violation) =>
        violation.id === id
          ? {
              ...violation,
              [field]: value,
            }
          : violation,
      ),
    );
  }

  function addViolation() {
    setViolations((current) => [...current, emptyViolation()]);
  }

  function removeViolation(id: string) {
    setViolations((current) =>
      current.filter((violation) => violation.id !== id),
    );
  }

  function saveStep4() {
    updateApplication({
      hasAccidents,
      accidents,
      hasViolations,
      violations,
      licenseSuspended,
      licenseSuspensionExplanation,
      licenseDenied,
      licenseDenialExplanation,
    });
  }

  function handlePrevious() {
    saveStep4();
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
          <Text style={styles.back}>← Back to Step 3</Text>
        </Pressable>

        <Text style={styles.eyebrow}>HIRING</Text>

        <Text style={styles.title}>Driver Application</Text>

        <Text style={styles.description}>
          Tell us about the applicant&apos;s driving and safety history.
        </Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressStep}>STEP 4 OF 6</Text>
          <Text style={styles.progressTitle}>Driving & Safety History</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* ACCIDENTS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Accident History</Text>

          <Text style={styles.question}>
            Has the applicant been involved in any motor vehicle accidents?
          </Text>

          <View style={styles.choiceRow}>
            <ChoiceButton
              label="Yes"
              selected={hasAccidents === "yes"}
              onPress={() => chooseAccidents("yes")}
            />

            <ChoiceButton
              label="No"
              selected={hasAccidents === "no"}
              onPress={() => chooseAccidents("no")}
            />
          </View>

          {hasAccidents === "yes" &&
            accidents.map((accident, index) => (
              <View style={styles.subCard} key={accident.id}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordTitle}>Accident #{index + 1}</Text>

                  {accidents.length > 1 && (
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeAccident(accident.id)}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </Pressable>
                  )}
                </View>

                <Text style={styles.label}>Accident Date *</Text>
                <TextInput
                  style={styles.input}
                  value={accident.date}
                  onChangeText={(value) =>
                    updateAccident(accident.id, "date", value)
                  }
                  placeholder="MM/DD/YYYY"
                  keyboardType="number-pad"
                />

                <Text style={styles.label}>Location *</Text>
                <TextInput
                  style={styles.input}
                  value={accident.location}
                  onChangeText={(value) =>
                    updateAccident(accident.id, "location", value)
                  }
                  placeholder="City, State"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.multiline]}
                  value={accident.description}
                  onChangeText={(value) =>
                    updateAccident(accident.id, "description", value)
                  }
                  placeholder="Briefly describe the accident"
                  multiline
                />

                <View style={styles.row}>
                  <View style={styles.field}>
                    <Text style={styles.label}>Fatalities</Text>
                    <TextInput
                      style={styles.input}
                      value={accident.fatalities}
                      onChangeText={(value) =>
                        updateAccident(accident.id, "fatalities", value)
                      }
                      placeholder="0"
                      keyboardType="number-pad"
                    />
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>Injuries</Text>
                    <TextInput
                      style={styles.input}
                      value={accident.injuries}
                      onChangeText={(value) =>
                        updateAccident(accident.id, "injuries", value)
                      }
                      placeholder="0"
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <Text style={styles.question}>
                  Did the accident require a vehicle to be towed?
                </Text>

                <View style={styles.choiceRow}>
                  <ChoiceButton
                    label="Yes"
                    selected={accident.towAway === "yes"}
                    onPress={() =>
                      updateAccident(accident.id, "towAway", "yes")
                    }
                  />

                  <ChoiceButton
                    label="No"
                    selected={accident.towAway === "no"}
                    onPress={() => updateAccident(accident.id, "towAway", "no")}
                  />
                </View>
              </View>
            ))}

          {hasAccidents === "yes" && (
            <Pressable style={styles.addButton} onPress={addAccident}>
              <Text style={styles.addButtonText}>+ Add Another Accident</Text>
            </Pressable>
          )}
        </View>

        {/* VIOLATIONS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Traffic Violations</Text>

          <Text style={styles.question}>
            Has the applicant received any traffic convictions or forfeitures?
          </Text>

          <View style={styles.choiceRow}>
            <ChoiceButton
              label="Yes"
              selected={hasViolations === "yes"}
              onPress={() => chooseViolations("yes")}
            />

            <ChoiceButton
              label="No"
              selected={hasViolations === "no"}
              onPress={() => chooseViolations("no")}
            />
          </View>

          {hasViolations === "yes" &&
            violations.map((violation, index) => (
              <View style={styles.subCard} key={violation.id}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordTitle}>Violation #{index + 1}</Text>

                  {violations.length > 1 && (
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeViolation(violation.id)}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </Pressable>
                  )}
                </View>

                <Text style={styles.label}>Date *</Text>
                <TextInput
                  style={styles.input}
                  value={violation.date}
                  onChangeText={(value) =>
                    updateViolation(violation.id, "date", value)
                  }
                  placeholder="MM/DD/YYYY"
                  keyboardType="number-pad"
                />

                <Text style={styles.label}>State *</Text>
                <TextInput
                  style={styles.input}
                  value={violation.state}
                  onChangeText={(value) =>
                    updateViolation(violation.id, "state", value)
                  }
                  placeholder="MN"
                  autoCapitalize="characters"
                  maxLength={2}
                />

                <Text style={styles.label}>Violation / Offense *</Text>
                <TextInput
                  style={styles.input}
                  value={violation.violation}
                  onChangeText={(value) =>
                    updateViolation(violation.id, "violation", value)
                  }
                  placeholder="Example: Speeding"
                />

                <Text style={styles.label}>Disposition</Text>
                <TextInput
                  style={styles.input}
                  value={violation.disposition}
                  onChangeText={(value) =>
                    updateViolation(violation.id, "disposition", value)
                  }
                  placeholder="Fine, dismissed, pending..."
                />
              </View>
            ))}

          {hasViolations === "yes" && (
            <Pressable style={styles.addButton} onPress={addViolation}>
              <Text style={styles.addButtonText}>+ Add Another Violation</Text>
            </Pressable>
          )}
        </View>

        {/* LICENSE HISTORY */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>License History</Text>

          <Text style={styles.question}>
            Has any driver&apos;s license, permit, or privilege ever been
            suspended or revoked?
          </Text>

          <View style={styles.choiceRow}>
            <ChoiceButton
              label="Yes"
              selected={licenseSuspended === "yes"}
              onPress={() => setLicenseSuspended("yes")}
            />

            <ChoiceButton
              label="No"
              selected={licenseSuspended === "no"}
              onPress={() => {
                setLicenseSuspended("no");
                setLicenseSuspensionExplanation("");
              }}
            />
          </View>

          {licenseSuspended === "yes" && (
            <>
              <Text style={styles.label}>Please Explain *</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={licenseSuspensionExplanation}
                onChangeText={setLicenseSuspensionExplanation}
                placeholder="Provide details"
                multiline
              />
            </>
          )}

          <Text style={styles.question}>
            Has the applicant ever been denied a license, permit, or privilege
            to operate a motor vehicle?
          </Text>

          <View style={styles.choiceRow}>
            <ChoiceButton
              label="Yes"
              selected={licenseDenied === "yes"}
              onPress={() => setLicenseDenied("yes")}
            />

            <ChoiceButton
              label="No"
              selected={licenseDenied === "no"}
              onPress={() => {
                setLicenseDenied("no");
                setLicenseDenialExplanation("");
              }}
            />
          </View>

          {licenseDenied === "yes" && (
            <>
              <Text style={styles.label}>Please Explain *</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={licenseDenialExplanation}
                onChangeText={setLicenseDenialExplanation}
                placeholder="Provide details"
                multiline
              />
            </>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Driving Record Review</Text>
          <Text style={styles.infoText}>
            The applicant&apos;s answers can later be reviewed alongside MVR and
            other authorized hiring records in Taragle.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.backButton} onPress={handlePrevious}>
            <Text style={styles.backButtonText}>← Previous</Text>
          </Pressable>

          <Pressable style={styles.continueButton} onPress={saveStep4}>
            <Text style={styles.continueText}>Save & Continue →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChoiceButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.choiceButton, selected && styles.choiceSelected]}
      onPress={onPress}
    >
      <Text style={[styles.choiceText, selected && styles.choiceSelectedText]}>
        {label}
      </Text>
    </Pressable>
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
    width: "66.66%",
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

  question: {
    color: "#334E68",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 18,
    marginBottom: 10,
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

  subCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 12,
    padding: 18,
    marginTop: 18,
  },

  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  recordTitle: {
    color: "#102A43",
    fontSize: 15,
    fontWeight: "800",
  },

  label: {
    color: "#334E68",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 14,
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

  multiline: {
    minHeight: 85,
    textAlignVertical: "top",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  field: {
    flex: 1,
    minWidth: 180,
  },

  addButton: {
    borderWidth: 1,
    borderColor: "#1473E6",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },

  addButtonText: {
    color: "#1473E6",
    fontSize: 13,
    fontWeight: "800",
  },

  removeButton: {
    borderWidth: 1,
    borderColor: "#F3C7C7",
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  removeText: {
    color: "#C53030",
    fontSize: 11,
    fontWeight: "800",
  },

  infoCard: {
    backgroundColor: "#EAF3FF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
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

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
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
