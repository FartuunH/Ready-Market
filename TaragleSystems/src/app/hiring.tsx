import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HiringScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>PEOPLE</Text>

        <Text style={styles.title}>Hiring Center</Text>

        <Text style={styles.description}>
          Recruit, review, onboard, and prepare drivers for your company.
        </Text>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Applicants</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>In Review</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Ready to Onboard</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Hired</Text>
          </View>
        </View>

        <View style={styles.applicantsSection}>
          <View style={styles.applicantsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Driver Applicants</Text>
              <Text style={styles.sectionSubtitle}>
                Review applications and move qualified drivers into onboarding.
              </Text>
            </View>

            <Pressable
              style={styles.addButton}
              onPress={() => router.push("/hiring-new")}
            >
              <Text style={styles.addButtonText}>+ Add Applicant</Text>
            </Pressable>
          </View>

          <View style={styles.applicantCard}>
            <View style={styles.applicantTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AN</Text>
              </View>

              <View style={styles.applicantInfo}>
                <Text style={styles.applicantName}>Abdi Noor</Text>
                <Text style={styles.applicantDetails}>
                  CDL Class A • Application complete
                </Text>
              </View>

              <View style={styles.readyBadge}>
                <Text style={styles.readyBadgeText}>Ready</Text>
              </View>
            </View>

            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Application progress</Text>
              <Text style={styles.progressValue}>100%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "100%" }]} />
            </View>
          </View>

          <View style={styles.applicantCard}>
            <View style={styles.applicantTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>HA</Text>
              </View>

              <View style={styles.applicantInfo}>
                <Text style={styles.applicantName}>Hassan Ali</Text>
                <Text style={styles.applicantDetails}>
                  Application needs additional information
                </Text>
              </View>

              <View style={styles.reviewBadge}>
                <Text style={styles.reviewBadgeText}>Review</Text>
              </View>
            </View>

            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Application progress</Text>
              <Text style={styles.progressValue}>75%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "75%" }]} />
            </View>
          </View>
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
    maxWidth: 1400,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 60,
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
    marginBottom: 24,
  },

  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  statCard: {
    minWidth: 170,
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 14,
    padding: 18,
  },

  statNumber: {
    color: "#102A43",
    fontSize: 26,
    fontWeight: "800",
  },

  statLabel: {
    color: "#62748A",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },

  placeholder: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 16,
    padding: 22,
    marginTop: 20,
  },

  placeholderTitle: {
    color: "#102A43",
    fontSize: 18,
    fontWeight: "800",
  },

  placeholderText: {
    color: "#62748A",
    fontSize: 14,
    marginTop: 6,
  },

  applicantsSection: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 16,
    padding: 22,
    marginTop: 20,
  },

  applicantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#102A43",
    fontSize: 18,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#62748A",
    fontSize: 13,
    marginTop: 4,
  },

  addButton: {
    backgroundColor: "#1473E6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  applicantCard: {
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },

  applicantTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EAF3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#1473E6",
    fontSize: 13,
    fontWeight: "800",
  },

  applicantInfo: {
    flex: 1,
    marginLeft: 12,
  },

  applicantName: {
    color: "#102A43",
    fontSize: 15,
    fontWeight: "800",
  },

  applicantDetails: {
    color: "#62748A",
    fontSize: 12,
    marginTop: 3,
  },

  readyBadge: {
    backgroundColor: "#E9F8EF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  readyBadgeText: {
    color: "#18864B",
    fontSize: 11,
    fontWeight: "800",
  },

  reviewBadge: {
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  reviewBadgeText: {
    color: "#B56A00",
    fontSize: 11,
    fontWeight: "800",
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  progressLabel: {
    color: "#62748A",
    fontSize: 12,
    fontWeight: "600",
  },

  progressValue: {
    color: "#102A43",
    fontSize: 12,
    fontWeight: "800",
  },

  progressTrack: {
    height: 7,
    backgroundColor: "#E8EEF5",
    borderRadius: 10,
    marginTop: 7,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1473E6",
    borderRadius: 10,
  },
});
