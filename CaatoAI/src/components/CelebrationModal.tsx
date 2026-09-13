import {
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type CelebrationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  emoji?: string;
  onClose: () => void;
};

export default function CelebrationModal({
  visible,
  title,
  message,
  emoji = "🎉",
  onClose,
}: CelebrationModalProps) {
  const isGoalReached = emoji === "🏆";

  if (isGoalReached) {
    return (
      <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
        <SafeAreaView style={styles.goalScreen}>
          <View style={styles.goalDecorTop}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>🎉</Text>
            <Text style={styles.sparkle}>✨</Text>
          </View>

          <View style={styles.goalContent}>
            <View style={styles.trophyCircle}>
              <Text style={styles.trophy}>🏆</Text>
            </View>

            <Text style={styles.goalSmallTitle}>CAATOAI</Text>

            <Text style={styles.goalTitle}>Hambalyo!</Text>

            <Text style={styles.goalSubtitle}>Hadafkaagii waad gaartay!</Text>

            <Text style={styles.goalMessage}>{message}</Text>

            <View style={styles.successBadge}>
              <Text style={styles.successBadgeText}>
                ✓ 100% Hadafka waa la gaaray
              </Text>
            </View>
          </View>

          <View style={styles.goalBottom}>
            <Text style={styles.bottomMessage}>
              Dadaalkaaga joogtada ah ayaa maanta miro dhalay. 💚
            </Text>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.goalButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.goalButtonText}>Sii wad safarkayga 💚</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>

          <Text style={styles.sparkles}>✨ 💜 ✨</Text>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad 💜</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  goalScreen: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 24,
  },

  goalDecorTop: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 40,
  },

  sparkle: {
    fontSize: 30,
  },

  goalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  trophyCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#D1FAE5",
    borderWidth: 5,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  trophy: {
    fontSize: 82,
  },

  goalSmallTitle: {
    color: "#059669",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },

  goalTitle: {
    color: "#047857",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
  },

  goalSubtitle: {
    color: "#065F46",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 6,
  },

  goalMessage: {
    color: "#4B5563",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    maxWidth: 400,
    marginTop: 20,
  },

  successBadge: {
    backgroundColor: "#D1FAE5",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 25,
  },

  successBadgeText: {
    color: "#047857",
    fontWeight: "900",
    fontSize: 14,
  },

  goalBottom: {
    paddingBottom: 26,
  },

  bottomMessage: {
    color: "#047857",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 16,
  },

  goalButton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },

  goalButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(46, 16, 101, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 24,
    alignItems: "center",
  },

  emojiCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emoji: {
    fontSize: 46,
  },

  sparkles: {
    fontSize: 22,
    marginBottom: 14,
  },

  title: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: "900",
    color: "#6D28D9",
    textAlign: "center",
    marginBottom: 10,
  },

  message: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },

  button: {
    width: "100%",
    minHeight: 52,
    backgroundColor: "#EC4899",
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    opacity: 0.88,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
