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

export default function AddApplicantScreen() {
  const { application, updateApplication } = useHiringApplication();

  const [firstName, setFirstName] = useState(application.firstName);
  const [lastName, setLastName] = useState(application.lastName);
  const [phone, setPhone] = useState(application.phone);
  const [email, setEmail] = useState(application.email);

  const [address, setAddress] = useState(application.address);
  const [city, setCity] = useState(application.city);
  const [state, setState] = useState(application.state);
  const [zip, setZip] = useState(application.zip);
  const [dateOfBirth, setDateOfBirth] = useState(application.dateOfBirth);

  const [cdlNumber, setCdlNumber] = useState(application.cdlNumber);
  const [cdlState, setCdlState] = useState(application.cdlState);
  const [cdlClass, setCdlClass] = useState(application.cdlClass);
  const [cdlExpiration, setCdlExpiration] = useState(application.cdlExpiration);

  function handleContinue() {
    updateApplication({
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      state,
      zip,
      dateOfBirth,
      cdlNumber,
      cdlState,
      cdlClass,
      cdlExpiration,
    });

    router.push("/hiring-add-experience");
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back to Hiring</Text>
        </Pressable>

        <Text style={styles.eyebrow}>HIRING</Text>
        <Text style={styles.title}>Add Driver Applicant</Text>

        <Text style={styles.description}>
          Start a new driver application for your company.
        </Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressStep}>STEP 1 OF 6</Text>
          <Text style={styles.progressTitle}>Personal & CDL Information</Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Text style={styles.sectionDescription}>
            Enter the applicant's basic contact information.
          </Text>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Street address"
          />

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="City"
              />
            </View>

            <View style={styles.smallField}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                value={state}
                onChangeText={setState}
                placeholder="MN"
                autoCapitalize="characters"
                maxLength={2}
              />
            </View>

            <View style={styles.smallField}>
              <Text style={styles.label}>ZIP</Text>
              <TextInput
                style={styles.input}
                value={zip}
                onChangeText={setZip}
                placeholder="ZIP"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <Text style={styles.label}>Date of Birth *</Text>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="MM/DD/YYYY"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>CDL Information</Text>
          <Text style={styles.sectionDescription}>
            Enter the applicant's commercial driver's license information.
          </Text>

          <Text style={styles.label}>CDL Number *</Text>
          <TextInput
            style={styles.input}
            value={cdlNumber}
            onChangeText={setCdlNumber}
            placeholder="CDL number"
          />

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>CDL State *</Text>
              <TextInput
                style={styles.input}
                value={cdlState}
                onChangeText={setCdlState}
                placeholder="MN"
                autoCapitalize="characters"
                maxLength={2}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>CDL Class *</Text>
              <TextInput
                style={styles.input}
                value={cdlClass}
                onChangeText={setCdlClass}
                placeholder="Class A"
              />
            </View>
          </View>

          <Text style={styles.label}>CDL Expiration Date *</Text>
          <TextInput
            style={styles.input}
            value={cdlExpiration}
            onChangeText={setCdlExpiration}
            placeholder="MM/DD/YYYY"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
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
    width: "16.67%",
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
    marginBottom: 20,
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

  label: {
    color: "#334E68",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12,
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

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 4,
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: "#D8E1EA",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  cancelText: {
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
