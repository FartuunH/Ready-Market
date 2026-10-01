import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Notifications from "expo-notifications";

import { useEffect, useState } from "react";

import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

const REMINDER_KEY = "caatoai-reminder-settings-v1";

type DailyReminder = {
  enabled: boolean;

  time: string;
};

type WeeklyReminder = DailyReminder & {
  weekday: number; // 1 Sunday ... 7 Saturday (Expo calendar trigger)
};

type ReminderSettings = {
  water: DailyReminder;
  breakfast: DailyReminder;
  lunch: DailyReminder;
  dinner: DailyReminder;
  walking: DailyReminder;

  workout: DailyReminder;
  fasting: DailyReminder;
  lesson: DailyReminder;

  weighIn: WeeklyReminder;
  weeklyPlan: WeeklyReminder;
};

const DEFAULTS: ReminderSettings = {
  water: { enabled: true, time: "10:00" },
  breakfast: { enabled: true, time: "08:00" },
  lunch: { enabled: true, time: "13:00" },
  dinner: { enabled: true, time: "18:30" },
  walking: { enabled: true, time: "17:00" },

  workout: { enabled: true, time: "18:00" },
  fasting: { enabled: false, time: "18:00" },
  lesson: { enabled: true, time: "20:00" },

  weighIn: { enabled: true, time: "09:00", weekday: 1 },
  weeklyPlan: { enabled: true, time: "19:00", weekday: 1 },
};
const DAYS = [
  { value: 1, label: "Axad" },

  { value: 2, label: "Isniin" },

  { value: 3, label: "Talaado" },

  { value: 4, label: "Arbaco" },

  { value: 5, label: "Khamiis" },

  { value: 6, label: "Jimco" },

  { value: 7, label: "Sabti" },
];

function parseTime(value: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());

  if (!match) return null;

  return { hour: Number(match[1]), minute: Number(match[2]) };
}

function to12Hour(value: string) {
  const parsed = parseTime(value);

  if (!parsed) return { time: value, period: "AM" as "AM" | "PM" };

  const period: "AM" | "PM" = parsed.hour >= 12 ? "PM" : "AM";

  const hour12 = parsed.hour % 12 || 12;

  return {
    time: `${hour12}:${String(parsed.minute).padStart(2, "0")}`,

    period,
  };
}

function to24Hour(value: string, period: "AM" | "PM") {
  const match = /^(0?[1-9]|1[0-2]):([0-5]\d)$/.exec(value.trim());

  if (!match) return null;

  let hour = Number(match[1]);

  const minute = Number(match[2]);

  if (period === "AM" && hour === 12) hour = 0;

  if (period === "PM" && hour !== 12) hour += 12;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

async function requestNotificationPermission() {
  if (Platform.OS === "web") return false;

  const current = await Notifications.getPermissionsAsync();

  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();

  return requested.granted;
}

async function scheduleDaily(
  identifier: string,

  title: string,

  body: string,

  time: string,
) {
  const parsed = parseTime(time);

  if (!parsed) throw new Error(`Waqtiga ${time} sax ma aha.`);

  await Notifications.scheduleNotificationAsync({
    identifier,

    content: { title, body, sound: true },

    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,

      hour: parsed.hour,

      minute: parsed.minute,
    },
  });
}

async function scheduleWeekly(
  identifier: string,

  title: string,

  body: string,

  time: string,

  weekday: number,
) {
  const parsed = parseTime(time);

  if (!parsed) throw new Error(`Waqtiga ${time} sax ma aha.`);

  await Notifications.scheduleNotificationAsync({
    identifier,

    content: { title, body, sound: true },

    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,

      weekday,

      hour: parsed.hour,

      minute: parsed.minute,
    },
  });
}

function TimeField({
  value,

  onChange,
}: {
  value: string;

  onChange: (value: string) => void;
}) {
  const display = to12Hour(value);

  const changeTime = (newTime: string) => {
    const converted = to24Hour(newTime, display.period);

    if (converted) {
      onChange(converted);
    }
  };

  const changePeriod = (period: "AM" | "PM") => {
    const converted = to24Hour(display.time, period);

    if (converted) {
      onChange(converted);
    }
  };

  return (
    <View style={styles.timePickerRow}>
      <TextInput
        value={display.time}
        onChangeText={(text) => {
          const converted = to24Hour(text, display.period);

          if (converted) {
            onChange(converted);
          }
        }}
        placeholder="8:00"
        placeholderTextColor="#9CA3AF"
        keyboardType="numbers-and-punctuation"
        maxLength={5}
        selectTextOnFocus
        style={styles.timeInput}
      />

      <View style={styles.periodWrap}>
        {(["AM", "PM"] as const).map((period) => (
          <Pressable
            key={period}
            onPress={() => changePeriod(period)}
            style={[
              styles.periodButton,

              display.period === period && styles.periodButtonOn,
            ]}
          >
            <Text
              style={[
                styles.periodText,

                display.period === period && styles.periodTextOn,
              ]}
            >
              {period}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ReminderRow({
  icon,

  title,

  subtitle,

  reminder,

  onToggle,

  onTime,
}: {
  icon: string;

  title: string;

  subtitle: string;

  reminder: DailyReminder;

  onToggle: (value: boolean) => void;

  onTime: (value: string) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>
            {icon} {title}
          </Text>

          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>

        <Switch value={reminder.enabled} onValueChange={onToggle} />
      </View>

      {reminder.enabled ? (
        <View style={styles.timeLine}>
          <Text style={styles.timeLabel}>Waqtiga</Text>

          <TimeField value={reminder.time} onChange={onTime} />
        </View>
      ) : null}
    </View>
  );
}

function WeeklyRow({
  icon,

  title,

  subtitle,

  reminder,

  onToggle,

  onTime,

  onDay,
}: {
  icon: string;

  title: string;

  subtitle: string;

  reminder: WeeklyReminder;

  onToggle: (value: boolean) => void;

  onTime: (value: string) => void;

  onDay: (value: number) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowTop}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>
            {icon} {title}
          </Text>

          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>

        <Switch value={reminder.enabled} onValueChange={onToggle} />
      </View>

      {reminder.enabled ? (
        <>
          <Text style={styles.dayLabel}>Maalinta</Text>

          <View style={styles.dayWrap}>
            {DAYS.map((day) => (
              <Pressable
                key={day.value}
                onPress={() => onDay(day.value)}
                style={[
                  styles.dayButton,

                  reminder.weekday === day.value && styles.dayButtonOn,
                ]}
              >
                <Text
                  style={[
                    styles.dayButtonText,

                    reminder.weekday === day.value && styles.dayButtonTextOn,
                  ]}
                >
                  {day.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.timeLine}>
            <Text style={styles.timeLabel}>Waqtiga</Text>

            <TimeField value={reminder.time} onChange={onTime} />
          </View>
        </>
      ) : null}
    </View>
  );
}

export default function RemindersScreen() {
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULTS);

  const [loaded, setLoaded] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(REMINDER_KEY);

        if (raw) {
          setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
        }
      } catch (error) {
        console.log("Reminder settings load error:", error);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const updateDaily = (
    key:
      | "water"
      | "breakfast"
      | "lunch"
      | "dinner"
      | "walking"
      | "workout"
      | "fasting"
      | "lesson",
    patch: Partial<DailyReminder>,
  ) => {
    setSettings((old) => ({
      ...old,
      [key]: { ...old[key], ...patch },
    }));
  };

  const updateWeekly = (
    key: "weighIn" | "weeklyPlan",

    patch: Partial<WeeklyReminder>,
  ) => {
    setSettings((old) => ({
      ...old,

      [key]: { ...old[key], ...patch },
    }));
  };

  const validate = () => {
    const entries = [
      settings.water,
      settings.breakfast,
      settings.lunch,
      settings.dinner,
      settings.walking,
      settings.workout,
      settings.fasting,
      settings.lesson,
      settings.weighIn,
      settings.weeklyPlan,
    ];

    return entries.every((item) => !item.enabled || parseTime(item.time));
  };

  const save = async () => {
    if (!validate()) {
      Alert.alert(
        "Waqti sax ah geli",

        "Isticmaal waqtiga sida 8:00 AM ama 6:30 PM.",
      );

      return;
    }

    setSaving(true);

    try {
      await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(settings));

      if (Platform.OS === "web") {
        Alert.alert(
          "Waa la kaydiyay",

          "Doorashooyinka waa la kaydiyay. Ogeysiisyada dhabta ah waxaa lagu tijaabin doonaa iPhone ama Android.",
        );

        return;
      }

      const allowed = await requestNotificationPermission();

      if (!allowed) {
        Alert.alert(
          "Ogeysiisyada lama oggolaan",

          "Doorashooyinka waa la kaydiyay, laakiin telefoonku weli ma oggola ogeysiisyada.",
        );

        return;
      }

      // Only cancel CaatoAI reminder identifiers managed by this screen.

      const ids = [
        "caato-water",
        "caato-breakfast",
        "caato-lunch",
        "caato-dinner",
        "caato-walking",
        "caato-workout",
        "caato-fasting",
        "caato-lesson",
        "caato-weigh-in",
        "caato-weekly-plan",
      ];

      await Promise.all(
        ids.map((id) =>
          Notifications.cancelScheduledNotificationAsync(id).catch(() => {}),
        ),
      );

      if (settings.water.enabled) {
        await scheduleDaily(
          "caato-water",

          "💧 Waqtiga biyaha",

          "Cab biyo oo ku dar koobkaaga CaatoAI.",

          settings.water.time,
        );
      }

      if (settings.breakfast.enabled) {
        await scheduleDaily(
          "caato-breakfast",

          "🌅 Quraac",

          "Waa waqtigii qorshaha quraacda maanta.",

          settings.breakfast.time,
        );
      }

      if (settings.lunch.enabled) {
        await scheduleDaily(
          "caato-lunch",

          "☀️ Qado",

          "Eeg qorshaha qadada maanta ee CaatoAI.",

          settings.lunch.time,
        );
      }

      if (settings.dinner.enabled) {
        await scheduleDaily(
          "caato-dinner",

          "🌙 Casho",

          "Waa waqtigii qorshaha cashada maanta.",

          settings.dinner.time,
        );
      }

      if (settings.walking.enabled) {
        await scheduleDaily(
          "caato-walking",

          "🚶 Dhaqdhaqaaq",

          "Waqti yar oo socod ama dhaqdhaqaaq ah samee haddii ay kuu habboon tahay.",

          settings.walking.time,
        );
      }

      if (settings.workout.enabled) {
        await scheduleDaily(
          "caato-workout",
          "🏃 Jimicsiga maanta",
          "Waa waqtigii jimicsigaaga CaatoAI. Samee waxa maanta kuu qorshaysan.",
          settings.workout.time,
        );
      }

      if (settings.fasting.enabled) {
        await scheduleDaily(
          "caato-fasting",
          "⏱️ Soonka",
          "Waa waqtigii aad eegi lahayd qorshaha soonkaaga CaatoAI.",
          settings.fasting.time,
        );
      }

      if (settings.lesson.enabled) {
        await scheduleDaily(
          "caato-lesson",
          "📖 Casharka maanta",
          "Qaado dhowr daqiiqo oo baro casharkaaga maanta.",
          settings.lesson.time,
        );
      }

      if (settings.workout.enabled) {
        await scheduleDaily(
          "caato-workout",
          "🏃 Jimicsiga maanta",
          "Waa waqtigii jimicsigaaga CaatoAI. Samee jimicsiga maanta kuu qorshaysan.",
          settings.workout.time,
        );
      }

      if (settings.fasting.enabled) {
        await scheduleDaily(
          "caato-fasting",
          "⏱️ Soonka",
          "Waa waqtigii aad eegi lahayd qorshaha soonkaaga CaatoAI.",
          settings.fasting.time,
        );
      }

      if (settings.lesson.enabled) {
        await scheduleDaily(
          "caato-lesson",
          "📖 Casharka maanta",
          "Qaado dhowr daqiiqo oo baro casharkaaga maanta.",
          settings.lesson.time,
        );
      }

      if (settings.weighIn.enabled) {
        await scheduleWeekly(
          "caato-weigh-in",

          "⚖️ Miisaanka toddobaadka",

          "Haddii aad rabto, geli miisaankaaga toddobaadkan.",

          settings.weighIn.time,

          settings.weighIn.weekday,
        );
      }

      if (settings.weeklyPlan.enabled) {
        await scheduleWeekly(
          "caato-weekly-plan",

          "📅 Qorshaha toddobaadka",

          "Eeg cuntooyinka iyo qorshaha CaatoAI ee toddobaadka cusub.",

          settings.weeklyPlan.time,

          settings.weeklyPlan.weekday,
        );
      }

      Alert.alert("✓ Waa la kaydiyay", "Xasuusiyeyaashaada waa la diyaariyay.");
    } catch (error) {
      console.log("Reminder save error:", error);

      Alert.alert(
        "Waxbaa qaldamay",

        "Doorashooyinka waa la kaydiyay, laakiin ogeysiisyada lama diyaarin karin.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>
          Xasuusiyeyaasha waa la soo furayaa...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>CAATOAI • XASUUSIYEYAASHA</Text>

      <Text style={styles.title}>Xasuusiyeyaasha 🔔</Text>

      <Text style={styles.subtitle}>
        Dooro waxa aad rabto in CaatoAI ku xasuusiyo. Dooro waqtiga iyo AM ama
        PM, tusaale 8:00 AM ama 6:30 PM.
      </Text>

      {Platform.OS === "web" ? (
        <View style={styles.webNotice}>
          <Text style={styles.webNoticeText}>
            💻 Browser-ka: settings-ka waa la kaydin karaa. Ogeysiisyada
            telefoonka waxaa lagu tijaabin doonaa iPhone ama Android.
          </Text>
        </View>
      ) : null}

      <ReminderRow
        icon="💧"
        title="Biyaha"
        subtitle="Xasuusin maalinle ah oo biyaha ah."
        reminder={settings.water}
        onToggle={(enabled) => updateDaily("water", { enabled })}
        onTime={(time) => updateDaily("water", { time })}
      />

      <ReminderRow
        icon="🌅"
        title="Quraac"
        subtitle="Xasuusi qorshaha quraacda."
        reminder={settings.breakfast}
        onToggle={(enabled) => updateDaily("breakfast", { enabled })}
        onTime={(time) => updateDaily("breakfast", { time })}
      />

      <ReminderRow
        icon="☀️"
        title="Qado"
        subtitle="Xasuusi qorshaha qadada."
        reminder={settings.lunch}
        onToggle={(enabled) => updateDaily("lunch", { enabled })}
        onTime={(time) => updateDaily("lunch", { time })}
      />

      <ReminderRow
        icon="🌙"
        title="Casho"
        subtitle="Xasuusi qorshaha cashada."
        reminder={settings.dinner}
        onToggle={(enabled) => updateDaily("dinner", { enabled })}
        onTime={(time) => updateDaily("dinner", { time })}
      />

      <ReminderRow
        icon="🚶"
        title="Dhaqdhaqaaq"
        subtitle="Xasuusin socod ama dhaqdhaqaaq maalinle ah."
        reminder={settings.walking}
        onToggle={(enabled) => updateDaily("walking", { enabled })}
        onTime={(time) => updateDaily("walking", { time })}
      />
      <ReminderRow
        icon="🏃"
        title="Jimicsiga"
        subtitle="Xasuusi jimicsigaaga maalinlaha ah."
        reminder={settings.workout}
        onToggle={(enabled) => updateDaily("workout", { enabled })}
        onTime={(time) => updateDaily("workout", { time })}
      />

      <ReminderRow
        icon="⏱️"
        title="Soonka"
        subtitle="Xasuusi waqtiga qorshaha soonkaaga."
        reminder={settings.fasting}
        onToggle={(enabled) => updateDaily("fasting", { enabled })}
        onTime={(time) => updateDaily("fasting", { time })}
      />

      <ReminderRow
        icon="📖"
        title="Casharka maanta"
        subtitle="Xasuusi casharkaaga gaaban ee maalinlaha ah."
        reminder={settings.lesson}
        onToggle={(enabled) => updateDaily("lesson", { enabled })}
        onTime={(time) => updateDaily("lesson", { time })}
      />
      <WeeklyRow
        icon="⚖️"
        title="Miisaanka toddobaadka"
        subtitle="Dooro maalinta iyo waqtiga miisaanka."
        reminder={settings.weighIn}
        onToggle={(enabled) => updateWeekly("weighIn", { enabled })}
        onTime={(time) => updateWeekly("weighIn", { time })}
        onDay={(weekday) => updateWeekly("weighIn", { weekday })}
      />

      <WeeklyRow
        icon="📅"
        title="Qorshaha toddobaadka"
        subtitle="Xasuusi inaad eegto ama beddesho qorshaha toddobaadka."
        reminder={settings.weeklyPlan}
        onToggle={(enabled) => updateWeekly("weeklyPlan", { enabled })}
        onTime={(time) => updateWeekly("weeklyPlan", { time })}
        onDay={(weekday) => updateWeekly("weeklyPlan", { weekday })}
      />

      <Pressable
        disabled={saving}
        onPress={save}
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
      >
        <Text style={styles.saveText}>
          {saving ? "Waa la kaydinayaa..." : "🔔 Kaydi xasuusiyeyaasha"}
        </Text>
      </Pressable>

      <Text style={styles.note}>
        Waxaad mar kasta dib uga beddeli kartaa xasuusiyeyaashan.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#FFFBF5",
  },

  center: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#FFFBF5",
  },

  loading: {
    color: "#166534",

    fontWeight: "800",
  },

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

  backText: {
    fontSize: 16,

    fontWeight: "800",

    color: "#166534",
  },

  eyebrow: {
    fontSize: 11,

    fontWeight: "900",

    letterSpacing: 1.1,

    color: "#15803D",

    marginBottom: 7,
  },

  title: {
    fontSize: 30,

    fontWeight: "900",

    color: "#1F2937",
  },

  subtitle: {
    fontSize: 14,

    lineHeight: 21,

    color: "#6B7280",

    marginTop: 7,

    marginBottom: 16,
  },

  webNotice: {
    backgroundColor: "#EFF6FF",

    borderWidth: 1,

    borderColor: "#BFDBFE",

    borderRadius: 16,

    padding: 14,

    marginBottom: 14,
  },

  webNoticeText: {
    fontSize: 12,

    lineHeight: 19,

    color: "#1E3A8A",

    fontWeight: "700",
  },

  row: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 20,

    padding: 17,

    marginBottom: 12,
  },

  rowTop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    gap: 12,
  },

  rowText: {
    flex: 1,
  },

  rowTitle: {
    fontSize: 16,

    fontWeight: "900",

    color: "#1F2937",
  },

  rowSubtitle: {
    fontSize: 12,

    lineHeight: 18,

    color: "#6B7280",

    marginTop: 4,
  },

  timeLine: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 14,

    paddingTop: 12,

    borderTopWidth: 1,

    borderTopColor: "#F3F4F6",
  },

  timeLabel: {
    fontSize: 13,

    fontWeight: "800",

    color: "#4B5563",
  },

  timePickerRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,
  },

  periodWrap: {
    flexDirection: "row",

    borderWidth: 1,

    borderColor: "#D1D5DB",

    borderRadius: 12,

    overflow: "hidden",
  },

  periodButton: {
    minHeight: 42,

    minWidth: 46,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#FFFFFF",
  },

  periodButtonOn: {
    backgroundColor: "#DCFCE7",
  },

  periodText: {
    fontSize: 12,

    fontWeight: "900",

    color: "#6B7280",
  },

  periodTextOn: {
    color: "#166534",
  },

  timeInput: {
    width: 88,

    minHeight: 42,

    borderWidth: 1,

    borderColor: "#D1D5DB",

    borderRadius: 12,

    backgroundColor: "#FAFAF9",

    textAlign: "center",

    fontSize: 15,

    fontWeight: "800",

    color: "#1F2937",

    paddingHorizontal: 8,
  },

  dayLabel: {
    fontSize: 12,

    fontWeight: "800",

    color: "#4B5563",

    marginTop: 14,

    marginBottom: 8,
  },

  dayWrap: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 7,
  },

  dayButton: {
    borderWidth: 1,

    borderColor: "#D1D5DB",

    borderRadius: 999,

    paddingHorizontal: 10,

    paddingVertical: 7,

    backgroundColor: "#FFFFFF",
  },

  dayButtonOn: {
    borderColor: "#16A34A",

    backgroundColor: "#DCFCE7",
  },

  dayButtonText: {
    fontSize: 11,

    fontWeight: "800",

    color: "#6B7280",
  },

  dayButtonTextOn: {
    color: "#166534",
  },

  saveButton: {
    minHeight: 54,

    borderRadius: 16,

    backgroundColor: "#166534",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 18,

    marginTop: 10,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "900",
  },

  note: {
    textAlign: "center",

    fontSize: 11,

    lineHeight: 17,

    color: "#78716C",

    marginTop: 12,
  },
});
