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

type YesNo = "yes" | "no" | null;

type LocalEmployer = {
  id: string;
  companyName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  position: string;
  startDate: string;
  endDate: string;
  reasonForLeaving: string;
  dotRegulated: YesNo;
  subjectToDrugTesting: YesNo;
};

function emptyEmployer(): LocalEmployer {
  return {
    id: `${Date.now()}-${Math.random()}`,
    companyName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    position: "",
    startDate: "",
    endDate: "",
    reasonForLeaving: "",
    dotRegulated: null,
    subjectToDrugTesting: null,
  };
}

export default function HiringEmploymentScreen() {
  const { application, updateApplication } = useHiringApplication();

  const [employers, setEmployers] = useState<LocalEmployer[]>(
    application.employmentHistory.length > 0
      ? application.employmentHistory
      : [emptyEmployer()],
  );

  function updateEmployer(
    id: string,
    field: keyof LocalEmployer,
    value: string | YesNo,
  ) {
    setEmployers((current) =>
      current.map((employer) =>
        employer.id === id
          ? {
              ...employer,
              [field]: value,
            }
          : employer,
      ),
    );
  }

  function addEmployer() {
    setEmployers((current) => [...current, emptyEmployer()]);
  }

  function removeEmployer(id: string) {
    setEmployers((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter((employer) => employer.id !== id);
    });
  }

  function saveStep3() {
    updateApplication({
      employmentHistory: employers,
    });
  }

  function handleContinue() {
    saveStep3();
    router.push("/hiring-add-safety");
  }

  function handlePrevious() {
    saveStep3();
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
          <Text style={styles.back}>← Back to Step 2</Text>
        </Pressable>

        <Text style={styles.eyebrow}>HIRING</Text>

        <Text style={styles.title}>Driver Application</Text>

        <Text style={styles.description}>
          Enter the applicant&apos;s previous employment information.
        </Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressStep}>STEP 3 OF 6</Text>

          <Text style={styles.progressTitle}>Employment History</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {employers.map((employer, index) => (
          <View style={styles.card} key={employer.id}>
            <View style={styles.employerHeader}>
              <View>
                <Text style={styles.sectionTitle}>Employer #{index + 1}</Text>

                <Text style={styles.sectionDescription}>
                  Enter the applicant&apos;s previous employer information.
                </Text>
              </View>

              {employers.length > 1 && (
                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeEmployer(employer.id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.label}>Company Name *</Text>

            <TextInput
              style={styles.input}
              value={employer.companyName}
              onChangeText={(value) =>
                updateEmployer(employer.id, "companyName", value)
              }
              placeholder="Previous employer"
            />

            <Text style={styles.label}>Employer Phone</Text>

            <TextInput
              style={styles.input}
              value={employer.phone}
              onChangeText={(value) =>
                updateEmployer(employer.id, "phone", value)
              }
              placeholder="(320) 555-1234"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Street Address</Text>

            <TextInput
              style={styles.input}
              value={employer.address}
              onChangeText={(value) =>
                updateEmployer(employer.id, "address", value)
              }
              placeholder="Street address"
            />

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>City</Text>

                <TextInput
                  style={styles.input}
                  value={employer.city}
                  onChangeText={(value) =>
                    updateEmployer(employer.id, "city", value)
                  }
                  placeholder="City"
                />
              </View>

              <View style={styles.smallField}>
                <Text style={styles.label}>State</Text>

                <TextInput
                  style={styles.input}
                  value={employer.state}
                  onChangeText={(value) =>
                    updateEmployer(employer.id, "state", value)
                  }
                  placeholder="MN"
                  autoCapitalize="characters"
                  maxLength={2}
                />
              </View>

              <View style={styles.smallField}>
                <Text style={styles.label}>ZIP</Text>

                <TextInput
                  style={styles.input}
                  value={employer.zip}
                  onChangeText={(value) =>
                    updateEmployer(employer.id, "zip", value)
                  }
                  placeholder="56301"
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <Text style={styles.label}>Position / Job Title *</Text>

            <TextInput
              style={styles.input}
              value={employer.position}
              onChangeText={(value) =>
                updateEmployer(employer.id, "position", value)
              }
              placeholder="Example: Commercial Driver"
            />

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Start Date *</Text>

                <TextInput
                  style={styles.input}
                  value={employer.startDate}
                  onChangeText={(value) =>
                    updateEmployer(employer.id, "startDate", value)
                  }
                  placeholder="MM/DD/YYYY"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>End Date *</Text>

                <TextInput
                  style={styles.input}
                  value={employer.endDate}
                  onChangeText={(value) =>
                    updateEmployer(employer.id, "endDate", value)
                  }
                  placeholder="MM/DD/YYYY"
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <Text style={styles.label}>Reason for Leaving</Text>

            <TextInput
              style={[styles.input, styles.multiline]}
              value={employer.reasonForLeaving}
              onChangeText={(value) =>
                updateEmployer(employer.id, "reasonForLeaving", value)
              }
              placeholder="Reason for leaving"
              multiline
            />

            <Text style={styles.question}>
              Was this a DOT-regulated safety-sensitive position?
            </Text>

            <View style={styles.choiceRow}>
              <ChoiceButton
                label="Yes"
                selected={employer.dotRegulated === "yes"}
                onPress={() =>
                  updateEmployer(employer.id, "dotRegulated", "yes")
                }
              />

              <ChoiceButton
                label="No"
                selected={employer.dotRegulated === "no"}
                onPress={() =>
                  updateEmployer(employer.id, "dotRegulated", "no")
                }
              />
            </View>

            <Text style={styles.question}>
              Was the applicant subject to FMCSA drug and alcohol testing
              requirements at this employer?
            </Text>

            <View style={styles.choiceRow}>
              <ChoiceButton
                label="Yes"
                selected={employer.subjectToDrugTesting === "yes"}
                onPress={() =>
                  updateEmployer(employer.id, "subjectToDrugTesting", "yes")
                }
              />

              <ChoiceButton
                label="No"
                selected={employer.subjectToDrugTesting === "no"}
                onPress={() =>
                  updateEmployer(employer.id, "subjectToDrugTesting", "no")
                }
              />
            </View>
          </View>
        ))}

        <Pressable style={styles.addEmployerButton} onPress={addEmployer}>
          <Text style={styles.addEmployerText}>+ Add Another Employer</Text>
        </Pressable>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Employment Verification</Text>

          <Text style={styles.infoText}>
            Previous-employer verification and related hiring checks can be
            tracked through Taragle during the review process.
          </Text>
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
    width: "50%",
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

  employerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
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
    minWidth: 220,
  },

  smallField: {
    flex: 1,
    minWidth: 120,
  },

  question: {
    color: "#334E68",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 20,
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

  removeButton: {
    borderWidth: 1,
    borderColor: "#F3C7C7",
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  removeButtonText: {
    color: "#C53030",
    fontSize: 11,
    fontWeight: "800",
  },

  addEmployerButton: {
    borderWidth: 1,
    borderColor: "#1473E6",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  addEmployerText: {
    color: "#1473E6",
    fontSize: 13,
    fontWeight: "800",
  },

  infoCard: {
    backgroundColor: "#EAF3FF",
    borderRadius: 14,
    padding: 18,
    marginTop: 18,
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
    marginTop: 18,
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
