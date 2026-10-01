import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1000;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.appShell, isDesktop && styles.appShellDesktop]}>
        {isDesktop && (
          <View style={styles.desktopSidebar}>
            <View style={styles.sidebarBrand}>
              <Text style={styles.sidebarBrandText}>TARAGLE</Text>
              <Text style={styles.sidebarBrandSubtext}>SYSTEMS</Text>
            </View>

            <Text style={styles.sidebarSection}>MAIN</Text>

            <Pressable style={[styles.sidebarItem, styles.sidebarItemActive]}>
              <Text style={styles.sidebarItemActiveText}>⌂ Command Center</Text>
            </Pressable>

            <Text style={styles.sidebarSection}>OPERATIONS</Text>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>📦 Loads</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>🔎 Load Finder</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>🗺️ Dispatch</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>🛣️ Trips</Text>
            </Pressable>

            <Text style={styles.sidebarSection}>PEOPLE</Text>

            <Pressable
              style={styles.sidebarItem}
              onPress={() => router.push("/hiring")}
            >
              <Text style={styles.sidebarItemText}>👥 Hiring</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>👤 Drivers</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>🛡️ Compliance</Text>
            </Pressable>

            <Text style={styles.sidebarSection}>FLEET</Text>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>🚛 Equipment</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>🔧 Maintenance</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>⏱️ ELD / HOS</Text>
            </Pressable>

            <Text style={styles.sidebarSection}>BUSINESS</Text>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>🤝 Customers & Brokers</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>📄 Documents</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>💵 Billing</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>📊 Reports</Text>
            </Pressable>

            <Text style={styles.sidebarSection}>SYSTEM</Text>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>🔔 Alerts & Tasks</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>✨ Taragle AI</Text>
            </Pressable>

            <Pressable style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>⚙️ Settings</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.mainContent}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              isDesktop && styles.desktopScrollContent,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Taragle Systems Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.brand}>TARAGLE SYSTEMS</Text>
                <Text style={styles.tagline}>
                  Complete Trucking Business Platform
                </Text>
              </View>

              <View style={styles.headerActions}>
                <View style={styles.languageBadge}>
                  <Text style={styles.languageText}>EN | SO</Text>
                </View>

                {!isDesktop && (
                  <Pressable
                    style={styles.menuButton}
                    onPress={() => setMenuOpen(!menuOpen)}
                  >
                    <Text style={styles.menuButtonText}>
                      {menuOpen ? "✕" : "☰"}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            {menuOpen && !isDesktop && (
              <View style={styles.menu}>
                <Text style={styles.menuSection}>MAIN</Text>

                <Pressable style={[styles.menuItem, styles.activeMenuItem]}>
                  <Text style={[styles.menuItemText, styles.activeMenuText]}>
                    🏠 Command Center
                  </Text>
                </Pressable>

                <Text style={styles.menuSection}>OPERATIONS</Text>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>📦 Loads</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>🔎 Load Finder</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>🗺️ Dispatch</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>🛣️ Trips</Text>
                </Pressable>

                <Text style={styles.menuSection}>PEOPLE & COMPLIANCE</Text>

                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuOpen(false);
                    router.push("/hiring");
                  }}
                >
                  <Text style={styles.menuItemText}>👥 Hiring</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>👤 Drivers</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>🛡️ Compliance</Text>
                </Pressable>

                <Text style={styles.menuSection}>FLEET</Text>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>🚛 Equipment</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>🔧 Maintenance</Text>
                </Pressable>

                <Text style={styles.menuSection}>BUSINESS</Text>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>
                    🤝 Customers & Brokers
                  </Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>📄 Documents</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>💵 Billing</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>👷 Settlements</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>⛽ Expenses</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>🧾 IFTA</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>📊 Reports</Text>
                </Pressable>

                <Text style={styles.menuSection}>SYSTEM</Text>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>🔔 Alerts & Tasks</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>🔌 Integrations</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>👥 Team</Text>
                </Pressable>

                <Pressable style={styles.menuItem}>
                  <Text style={styles.menuItemText}>⚙️ Settings</Text>
                </Pressable>
              </View>
            )}

            {/* Welcome */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Good morning</Text>
              <Text style={styles.companyName}>Ugaas Transportation</Text>

              <View style={styles.companyInfoRow}>
                <Text style={styles.companyInfo}>USDOT #1234567</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.companyInfo}>MC #765432</Text>
              </View>
            </View>

            {/* Command Center Placeholder */}
            <View style={styles.commandCard}>
              <Text style={styles.commandLabel}>COMMAND CENTER</Text>
              <Text style={styles.commandTitle}>
                Run your trucking business in one place.
              </Text>
              <Text style={styles.commandDescription}>
                Dispatch, compliance, drivers, fleet, documents, billing and
                more will come together here.
              </Text>
            </View>
            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.quickActionsLabel}>QUICK ACTIONS</Text>

              <View style={styles.quickActionsGrid}>
                <Pressable style={styles.quickAction}>
                  <Text style={styles.quickActionIcon}>📦</Text>
                  <Text style={styles.quickActionText}>Add Load</Text>
                </Pressable>

                <Pressable style={styles.quickAction}>
                  <Text style={styles.quickActionIcon}>👤</Text>
                  <Text style={styles.quickActionText}>Hire Driver</Text>
                </Pressable>

                <Pressable style={styles.quickAction}>
                  <Text style={styles.quickActionIcon}>🚛</Text>
                  <Text style={styles.quickActionText}>Add Truck</Text>
                </Pressable>

                <Pressable style={styles.quickAction}>
                  <Text style={styles.quickActionIcon}>📄</Text>
                  <Text style={styles.quickActionText}>Upload Document</Text>
                </Pressable>

                <Pressable style={styles.quickAction}>
                  <Text style={styles.quickActionIcon}>💵</Text>
                  <Text style={styles.quickActionText}>Create Invoice</Text>
                </Pressable>

                <Pressable style={[styles.quickAction, styles.aiQuickAction]}>
                  <Text style={styles.quickActionIcon}>✨</Text>
                  <Text style={styles.aiQuickActionText}>Ask Taragle AI</Text>
                </Pressable>
              </View>
            </View>

            <View
              style={[
                styles.dashboardRow,
                isDesktop && styles.dashboardRowDesktop,
              ]}
            >
              {/* Company Health */}
              <View
                style={[styles.section, isDesktop && styles.dashboardColumn]}
              >
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionLabel}>COMPANY HEALTH</Text>
                    <Text style={styles.sectionTitle}>Your company today</Text>
                  </View>

                  <View style={styles.healthScore}>
                    <Text style={styles.healthScoreText}>92%</Text>
                  </View>
                </View>

                <Text style={styles.healthSubtitle}>
                  3 items need your attention
                </Text>

                <View style={styles.healthList}>
                  <View style={styles.healthRow}>
                    <View>
                      <Text style={styles.healthName}>Authority</Text>
                      <Text style={styles.healthDescription}>
                        USDOT & operating authority
                      </Text>
                    </View>
                    <Text style={styles.statusGood}>● Active</Text>
                  </View>

                  <View style={styles.healthRow}>
                    <View>
                      <Text style={styles.healthName}>Insurance</Text>
                      <Text style={styles.healthDescription}>
                        Required coverage
                      </Text>
                    </View>
                    <Text style={styles.statusGood}>● Active</Text>
                  </View>

                  <View style={styles.healthRow}>
                    <View>
                      <Text style={styles.healthName}>Drivers</Text>
                      <Text style={styles.healthDescription}>
                        4 drivers ready
                      </Text>
                    </View>
                    <Text style={styles.statusGood}>● Ready</Text>
                  </View>

                  <View style={styles.healthRow}>
                    <View>
                      <Text style={styles.healthName}>Documents</Text>
                      <Text style={styles.healthDescription}>
                        2 documents expiring soon
                      </Text>
                    </View>
                    <Text style={styles.statusWarning}>● Review</Text>
                  </View>

                  <View style={styles.healthRow}>
                    <View>
                      <Text style={styles.healthName}>Maintenance</Text>
                      <Text style={styles.healthDescription}>
                        Unit 103 needs attention
                      </Text>
                    </View>
                    <Text style={styles.statusDanger}>● Action</Text>
                  </View>
                </View>
              </View>
              {/* Today's Operations */}
              <View
                style={[styles.section, isDesktop && styles.dashboardColumn]}
              >
                <View>
                  <Text style={styles.sectionLabel}>
                    TODAY&apos;S OPERATIONS
                  </Text>
                  <Text style={styles.sectionTitle}>Business at a glance</Text>
                </View>

                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statIcon}>🚛</Text>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statTitle}>Trucks</Text>
                    <Text style={styles.statDetail}>1 available</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Text style={styles.statIcon}>👤</Text>
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statTitle}>Drivers</Text>
                    <Text style={styles.statDetail}>1 available</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Text style={styles.statIcon}>📦</Text>
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statTitle}>Active Loads</Text>
                    <Text style={styles.statDetail}>2 in transit</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Text style={styles.statIcon}>💵</Text>
                    <Text style={styles.statNumber}>$7,850</Text>
                    <Text style={styles.statTitle}>Revenue</Text>
                    <Text style={styles.statDetail}>This week</Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.dashboardRow,
                isDesktop && styles.dashboardRowDesktop,
              ]}
            >
              {/* Hiring Snapshot */}
              <View
                style={[styles.section, isDesktop && styles.dashboardColumn]}
              >
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionLabel}>HIRING</Text>
                    <Text style={styles.sectionTitle}>Driver hiring</Text>
                  </View>

                  <Pressable style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>Hiring Center</Text>
                  </Pressable>
                </View>

                <View style={styles.hiringSummary}>
                  <View style={styles.hiringSummaryItem}>
                    <Text style={styles.hiringNumber}>2</Text>
                    <Text style={styles.hiringSummaryLabel}>Applicants</Text>
                  </View>

                  <View style={styles.complianceDivider} />

                  <View style={styles.hiringSummaryItem}>
                    <Text style={styles.hiringReviewNumber}>1</Text>
                    <Text style={styles.hiringSummaryLabel}>In Review</Text>
                  </View>

                  <View style={styles.complianceDivider} />

                  <View style={styles.hiringSummaryItem}>
                    <Text style={styles.hiringReadyNumber}>1</Text>
                    <Text style={styles.hiringSummaryLabel}>
                      Ready to Onboard
                    </Text>
                  </View>
                </View>

                <View style={styles.hiringList}>
                  {/* Applicant 1 */}
                  <View style={styles.applicantCard}>
                    <View style={styles.applicantTopRow}>
                      <View style={styles.applicantAvatar}>
                        <Text style={styles.applicantAvatarText}>AN</Text>
                      </View>

                      <View style={styles.applicantContent}>
                        <Text style={styles.applicantName}>Abdi Noor</Text>
                        <Text style={styles.applicantDetail}>
                          CDL verified • Application complete
                        </Text>
                      </View>

                      <View style={styles.readyBadge}>
                        <Text style={styles.readyBadgeText}>Ready</Text>
                      </View>
                    </View>

                    <View style={styles.applicationProgress}>
                      <View
                        style={[
                          styles.applicationProgressFill,
                          { width: "100%" },
                        ]}
                      />
                    </View>

                    <Text style={styles.applicationProgressText}>
                      Application 100% complete
                    </Text>
                  </View>

                  {/* Applicant 2 */}
                  <View style={styles.applicantCard}>
                    <View style={styles.applicantTopRow}>
                      <View style={styles.applicantAvatar}>
                        <Text style={styles.applicantAvatarText}>HA</Text>
                      </View>

                      <View style={styles.applicantContent}>
                        <Text style={styles.applicantName}>Hassan Ali</Text>
                        <Text style={styles.applicantDetail}>
                          Application needs additional information
                        </Text>
                      </View>

                      <View style={styles.reviewBadge}>
                        <Text style={styles.reviewBadgeText}>Review</Text>
                      </View>
                    </View>

                    <View style={styles.applicationProgress}>
                      <View
                        style={[
                          styles.applicationProgressFillWarning,
                          { width: "75%" },
                        ]}
                      />
                    </View>

                    <Text style={styles.applicationProgressText}>
                      Application 75% complete
                    </Text>
                  </View>
                </View>

                <View style={styles.hiringActions}>
                  <Pressable style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>
                      + Add Applicant
                    </Text>
                  </Pressable>

                  <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>
                      Hiring Center
                    </Text>
                  </Pressable>
                </View>
              </View>
              {/* Compliance Overview */}
              <View
                style={[styles.section, isDesktop && styles.dashboardColumn]}
              >
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionLabel}>COMPLIANCE</Text>
                    <Text style={styles.sectionTitle}>Compliance overview</Text>
                  </View>

                  <Pressable style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View All</Text>
                  </Pressable>
                </View>

                <View style={styles.complianceSummary}>
                  <View style={styles.complianceSummaryItem}>
                    <Text style={styles.complianceNumber}>4</Text>
                    <Text style={styles.complianceSummaryLabel}>Compliant</Text>
                  </View>

                  <View style={styles.complianceDivider} />

                  <View style={styles.complianceSummaryItem}>
                    <Text
                      style={[styles.complianceNumber, styles.warningNumber]}
                    >
                      2
                    </Text>
                    <Text style={styles.complianceSummaryLabel}>Due Soon</Text>
                  </View>

                  <View style={styles.complianceDivider} />

                  <View style={styles.complianceSummaryItem}>
                    <Text
                      style={[styles.complianceNumber, styles.dangerNumber]}
                    >
                      1
                    </Text>
                    <Text style={styles.complianceSummaryLabel}>
                      Action Needed
                    </Text>
                  </View>
                </View>

                <Text style={styles.attentionTitle}>Needs attention</Text>

                <View style={styles.complianceList}>
                  <View style={styles.complianceItem}>
                    <View style={styles.complianceIconWarning}>
                      <Text>📄</Text>
                    </View>

                    <View style={styles.complianceContent}>
                      <Text style={styles.complianceItemTitle}>
                        Annual Inspection
                      </Text>
                      <Text style={styles.complianceItemDescription}>
                        Unit 101 expires in 21 days
                      </Text>
                    </View>

                    <Text style={styles.statusWarning}>Due Soon</Text>
                  </View>

                  <View style={styles.complianceItem}>
                    <View style={styles.complianceIconWarning}>
                      <Text>🪪</Text>
                    </View>

                    <View style={styles.complianceContent}>
                      <Text style={styles.complianceItemTitle}>
                        Medical Certificate
                      </Text>
                      <Text style={styles.complianceItemDescription}>
                        Ahmed Hassan expires in 30 days
                      </Text>
                    </View>

                    <Text style={styles.statusWarning}>Due Soon</Text>
                  </View>

                  <View style={styles.complianceItem}>
                    <View style={styles.complianceIconDanger}>
                      <Text>⚠️</Text>
                    </View>

                    <View style={styles.complianceContent}>
                      <Text style={styles.complianceItemTitle}>
                        Driver File
                      </Text>
                      <Text style={styles.complianceItemDescription}>
                        Mohamed Ali has 1 missing document
                      </Text>
                    </View>

                    <Text style={styles.statusDanger}>Action</Text>
                  </View>
                </View>

                <Pressable style={styles.complianceButton}>
                  <Text style={styles.complianceButtonText}>
                    Open Compliance Center
                  </Text>
                </Pressable>
              </View>
            </View>
            {/* Dispatch Overview */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionLabel}>DISPATCH</Text>
                  <Text style={styles.sectionTitle}>Active loads</Text>
                </View>

                <Pressable style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View All</Text>
                </Pressable>
              </View>

              <View style={styles.loadList}>
                {/* Load 1 */}
                <View style={styles.loadCard}>
                  <View style={styles.loadTopRow}>
                    <View>
                      <Text style={styles.loadNumber}>Load #TA-1058</Text>
                      <Text style={styles.loadEquipment}>Dry Van</Text>
                    </View>

                    <View style={styles.inTransitBadge}>
                      <Text style={styles.inTransitText}>● In Transit</Text>
                    </View>
                  </View>

                  <View style={styles.routeRow}>
                    <View style={styles.routePoint}>
                      <Text style={styles.routeCity}>Minneapolis, MN</Text>
                      <Text style={styles.routeLabel}>PICKUP</Text>
                    </View>

                    <Text style={styles.routeArrow}>→</Text>

                    <View style={[styles.routePoint, styles.routeDestination]}>
                      <Text style={styles.routeCity}>Chicago, IL</Text>
                      <Text style={styles.routeLabel}>DELIVERY</Text>
                    </View>
                  </View>

                  <View style={styles.loadInfoRow}>
                    <View>
                      <Text style={styles.loadInfoLabel}>DRIVER</Text>
                      <Text style={styles.loadInfoValue}>Ahmed Hassan</Text>
                    </View>

                    <View>
                      <Text style={styles.loadInfoLabel}>UNIT</Text>
                      <Text style={styles.loadInfoValue}>102</Text>
                    </View>

                    <View>
                      <Text style={styles.loadInfoLabel}>ETA</Text>
                      <Text style={styles.loadInfoValue}>3:45 PM</Text>
                    </View>
                  </View>
                </View>

                {/* Load 2 */}
                <View style={styles.loadCard}>
                  <View style={styles.loadTopRow}>
                    <View>
                      <Text style={styles.loadNumber}>Load #TA-1059</Text>
                      <Text style={styles.loadEquipment}>Reefer</Text>
                    </View>

                    <View style={styles.pickupBadge}>
                      <Text style={styles.pickupText}>● Pickup Today</Text>
                    </View>
                  </View>

                  <View style={styles.routeRow}>
                    <View style={styles.routePoint}>
                      <Text style={styles.routeCity}>St. Cloud, MN</Text>
                      <Text style={styles.routeLabel}>PICKUP</Text>
                    </View>

                    <Text style={styles.routeArrow}>→</Text>

                    <View style={[styles.routePoint, styles.routeDestination]}>
                      <Text style={styles.routeCity}>Milwaukee, WI</Text>
                      <Text style={styles.routeLabel}>DELIVERY</Text>
                    </View>
                  </View>

                  <View style={styles.loadInfoRow}>
                    <View>
                      <Text style={styles.loadInfoLabel}>DRIVER</Text>
                      <Text style={styles.loadInfoValue}>Mohamed Ali</Text>
                    </View>

                    <View>
                      <Text style={styles.loadInfoLabel}>UNIT</Text>
                      <Text style={styles.loadInfoValue}>101</Text>
                    </View>

                    <View>
                      <Text style={styles.loadInfoLabel}>PICKUP</Text>
                      <Text style={styles.loadInfoValue}>1:00 PM</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.dispatchActions}>
                <Pressable style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>+ New Load</Text>
                </Pressable>

                <Pressable style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Dispatch Board</Text>
                </Pressable>
              </View>
            </View>
            <View
              style={[
                styles.dashboardRow,
                isDesktop && styles.dashboardRowDesktop,
              ]}
            >
              {/* Fleet & ELD Status */}
              <View
                style={[styles.section, isDesktop && styles.dashboardColumn]}
              >
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionLabel}>FLEET & ELD</Text>
                    <Text style={styles.sectionTitle}>Fleet status</Text>
                  </View>

                  <Pressable style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View All</Text>
                  </Pressable>
                </View>

                <View style={styles.fleetSummary}>
                  <View style={styles.fleetSummaryItem}>
                    <Text style={styles.fleetSummaryNumber}>5</Text>
                    <Text style={styles.fleetSummaryLabel}>Units</Text>
                  </View>

                  <View style={styles.complianceDivider} />

                  <View style={styles.fleetSummaryItem}>
                    <Text style={styles.fleetSummaryNumber}>3</Text>
                    <Text style={styles.fleetSummaryLabel}>On Load</Text>
                  </View>

                  <View style={styles.complianceDivider} />

                  <View style={styles.fleetSummaryItem}>
                    <Text style={styles.fleetAvailableNumber}>1</Text>
                    <Text style={styles.fleetSummaryLabel}>Available</Text>
                  </View>

                  <View style={styles.complianceDivider} />

                  <View style={styles.fleetSummaryItem}>
                    <Text style={styles.fleetWarningNumber}>1</Text>
                    <Text style={styles.fleetSummaryLabel}>Attention</Text>
                  </View>
                </View>

                <View style={styles.fleetList}>
                  {/* Unit 101 */}
                  <View style={styles.fleetCard}>
                    <View style={styles.fleetTopRow}>
                      <View>
                        <Text style={styles.unitNumber}>Unit 101</Text>
                        <Text style={styles.unitType}>
                          2024 Freightliner Cascadia • Dry Van
                        </Text>
                      </View>

                      <View style={styles.onLoadBadge}>
                        <Text style={styles.onLoadText}>● On Load</Text>
                      </View>
                    </View>

                    <View style={styles.fleetDriverRow}>
                      <View>
                        <Text style={styles.fleetLabel}>DRIVER</Text>
                        <Text style={styles.fleetValue}>Mohamed Ali</Text>
                      </View>

                      <View>
                        <Text style={styles.fleetLabel}>ELD</Text>
                        <Text style={styles.eldConnected}>● Connected</Text>
                      </View>
                    </View>

                    <View style={styles.hosBox}>
                      <View>
                        <Text style={styles.fleetLabel}>DRIVING AVAILABLE</Text>
                        <Text style={styles.hosTime}>7h 42m</Text>
                      </View>

                      <View>
                        <Text style={styles.fleetLabel}>CURRENT STATUS</Text>
                        <Text style={styles.fleetValue}>On Duty</Text>
                      </View>
                    </View>
                  </View>

                  {/* Unit 102 */}
                  <View style={styles.fleetCard}>
                    <View style={styles.fleetTopRow}>
                      <View>
                        <Text style={styles.unitNumber}>Unit 102</Text>
                        <Text style={styles.unitType}>Reefer</Text>
                      </View>

                      <View style={styles.availableBadge}>
                        <Text style={styles.availableText}>● Available</Text>
                      </View>
                    </View>

                    <View style={styles.fleetDriverRow}>
                      <View>
                        <Text style={styles.fleetLabel}>DRIVER</Text>
                        <Text style={styles.fleetValue}>Ahmed Hassan</Text>
                      </View>

                      <View>
                        <Text style={styles.fleetLabel}>ELD</Text>
                        <Text style={styles.eldConnected}>● Connected</Text>
                      </View>
                    </View>

                    <View style={styles.hosBox}>
                      <View>
                        <Text style={styles.fleetLabel}>DRIVING AVAILABLE</Text>
                        <Text style={styles.hosTime}>10h 18m</Text>
                      </View>

                      <View>
                        <Text style={styles.fleetLabel}>CURRENT STATUS</Text>
                        <Text style={styles.fleetValue}>Off Duty</Text>
                      </View>
                    </View>
                  </View>

                  {/* Unit 103 */}
                  <View style={styles.fleetCard}>
                    <View style={styles.fleetTopRow}>
                      <View>
                        <Text style={styles.unitNumber}>Unit 103</Text>
                        <Text style={styles.unitType}>Dry Van</Text>
                      </View>

                      <View style={styles.attentionBadge}>
                        <Text style={styles.attentionBadgeText}>
                          ● Attention
                        </Text>
                      </View>
                    </View>

                    <View style={styles.fleetDriverRow}>
                      <View>
                        <Text style={styles.fleetLabel}>DRIVER</Text>
                        <Text style={styles.fleetValue}>Unassigned</Text>
                      </View>

                      <View>
                        <Text style={styles.fleetLabel}>ELD</Text>
                        <Text style={styles.eldDisconnected}>● Offline</Text>
                      </View>
                    </View>

                    <View style={styles.fleetAlert}>
                      <Text style={styles.fleetAlertText}>
                        🔧 Maintenance inspection needs attention
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.dispatchActions}>
                  <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Fleet Center</Text>
                  </Pressable>

                  <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>ELD / HOS</Text>
                  </Pressable>
                </View>
              </View>
              {/* Business Money Snapshot */}
              <View
                style={[styles.section, isDesktop && styles.dashboardColumn]}
              >
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionLabel}>BUSINESS</Text>
                    <Text style={styles.sectionTitle}>Money snapshot</Text>
                  </View>

                  <Pressable style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Reports</Text>
                  </Pressable>
                </View>

                <View style={styles.moneyMainCard}>
                  <Text style={styles.moneyMainLabel}>
                    ESTIMATED GROSS PROFIT
                  </Text>
                  <Text style={styles.moneyMainAmount}>$5,510</Text>
                  <Text style={styles.moneyMainPeriod}>This week</Text>
                </View>

                <View style={styles.moneyGrid}>
                  <View style={styles.moneyCard}>
                    <Text style={styles.moneyIcon}>💵</Text>
                    <Text style={styles.moneyAmount}>$7,850</Text>
                    <Text style={styles.moneyLabel}>Revenue</Text>
                    <Text style={styles.moneyPeriod}>This week</Text>
                  </View>

                  <View style={styles.moneyCard}>
                    <Text style={styles.moneyIcon}>💳</Text>
                    <Text style={styles.moneyAmount}>$2,340</Text>
                    <Text style={styles.moneyLabel}>Expenses</Text>
                    <Text style={styles.moneyPeriod}>This week</Text>
                  </View>

                  <View style={styles.moneyCard}>
                    <Text style={styles.moneyIcon}>📄</Text>
                    <Text style={styles.moneyAmount}>$2,400</Text>
                    <Text style={styles.moneyLabel}>Ready to Invoice</Text>
                    <Text style={styles.moneyPeriod}>1 completed load</Text>
                  </View>

                  <View style={styles.moneyCard}>
                    <Text style={styles.moneyIcon}>⏳</Text>
                    <Text style={styles.moneyAmount}>$1,850</Text>
                    <Text style={styles.moneyLabel}>Unpaid Invoices</Text>
                    <Text style={styles.moneyPeriod}>Awaiting payment</Text>
                  </View>
                </View>

                <View style={styles.moneyActions}>
                  <Pressable style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Billing Center</Text>
                  </Pressable>

                  <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>View Reports</Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.dashboardRow,
                isDesktop && styles.dashboardRowDesktop,
              ]}
            >
              {/* Alerts & Tasks */}
              <View
                style={[styles.section, isDesktop && styles.dashboardColumn]}
              >
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionLabel}>ALERTS & TASKS</Text>
                    <Text style={styles.sectionTitle}>
                      What needs attention
                    </Text>
                  </View>

                  <View style={styles.alertCountBadge}>
                    <Text style={styles.alertCountText}>5</Text>
                  </View>
                </View>

                <View style={styles.taskList}>
                  {/* Urgent */}
                  <View style={styles.taskItem}>
                    <View style={styles.urgentTaskIcon}>
                      <Text>⚠️</Text>
                    </View>

                    <View style={styles.taskContent}>
                      <View style={styles.taskTitleRow}>
                        <Text style={styles.taskTitle}>
                          Driver file incomplete
                        </Text>
                        <Text style={styles.urgentText}>URGENT</Text>
                      </View>

                      <Text style={styles.taskDescription}>
                        Mohamed Ali is missing 1 required document.
                      </Text>

                      <Text style={styles.taskSource}>Compliance • Driver</Text>
                    </View>
                  </View>

                  {/* Load */}
                  <View style={styles.taskItem}>
                    <View style={styles.normalTaskIcon}>
                      <Text>📦</Text>
                    </View>

                    <View style={styles.taskContent}>
                      <View style={styles.taskTitleRow}>
                        <Text style={styles.taskTitle}>Pickup approaching</Text>
                        <Text style={styles.todayText}>TODAY</Text>
                      </View>

                      <Text style={styles.taskDescription}>
                        Load #TA-1059 pickup is scheduled for 1:00 PM.
                      </Text>

                      <Text style={styles.taskSource}>Dispatch • Unit 101</Text>
                    </View>
                  </View>

                  {/* Inspection */}
                  <View style={styles.taskItem}>
                    <View style={styles.warningTaskIcon}>
                      <Text>📄</Text>
                    </View>

                    <View style={styles.taskContent}>
                      <View style={styles.taskTitleRow}>
                        <Text style={styles.taskTitle}>
                          Annual inspection due soon
                        </Text>
                        <Text style={styles.dueSoonText}>21 DAYS</Text>
                      </View>

                      <Text style={styles.taskDescription}>
                        Unit 101 annual inspection expires soon.
                      </Text>

                      <Text style={styles.taskSource}>
                        Compliance • Equipment
                      </Text>
                    </View>
                  </View>

                  {/* Maintenance */}
                  <View style={styles.taskItem}>
                    <View style={styles.warningTaskIcon}>
                      <Text>🔧</Text>
                    </View>

                    <View style={styles.taskContent}>
                      <View style={styles.taskTitleRow}>
                        <Text style={styles.taskTitle}>
                          Maintenance attention
                        </Text>
                        <Text style={styles.dueSoonText}>REVIEW</Text>
                      </View>

                      <Text style={styles.taskDescription}>
                        Unit 103 has a maintenance item requiring review.
                      </Text>

                      <Text style={styles.taskSource}>Fleet • Maintenance</Text>
                    </View>
                  </View>

                  {/* Invoice */}
                  <View style={styles.taskItem}>
                    <View style={styles.normalTaskIcon}>
                      <Text>💵</Text>
                    </View>

                    <View style={styles.taskContent}>
                      <View style={styles.taskTitleRow}>
                        <Text style={styles.taskTitle}>Invoice ready</Text>
                        <Text style={styles.readyText}>READY</Text>
                      </View>

                      <Text style={styles.taskDescription}>
                        Load #TA-1057 has a POD and is ready to invoice.
                      </Text>

                      <Text style={styles.taskSource}>
                        Billing • Load #TA-1057
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.taskActions}>
                  <Pressable style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>View All Tasks</Text>
                  </Pressable>

                  <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>+ Add Task</Text>
                  </Pressable>
                </View>
              </View>
              {/* Taragle AI */}
              <View
                style={[styles.aiSection, isDesktop && styles.dashboardColumn]}
              >
                <View style={styles.aiHeader}>
                  <View style={styles.aiLogo}>
                    <Text style={styles.aiLogoText}>AI</Text>
                  </View>

                  <View style={styles.aiHeaderContent}>
                    <View style={styles.aiTitleRow}>
                      <Text style={styles.aiTitle}>Taragle AI</Text>

                      <View style={styles.aiOnlineBadge}>
                        <Text style={styles.aiOnlineText}>● Ready</Text>
                      </View>
                    </View>

                    <Text style={styles.aiSubtitle}>
                      Your trucking business assistant
                    </Text>
                  </View>
                </View>

                <View style={styles.aiMessage}>
                  <Text style={styles.aiMessageTitle}>Good morning 👋</Text>

                  <Text style={styles.aiMessageText}>
                    I found 3 things that need your attention today. I can walk
                    you through them one at a time.
                  </Text>
                </View>

                <View style={styles.aiPriority}>
                  <Text style={styles.aiPriorityLabel}>START HERE</Text>

                  <Text style={styles.aiPriorityTitle}>
                    Mohamed Ali&apos;s driver file is incomplete
                  </Text>

                  <Text style={styles.aiPriorityDescription}>
                    One required document is missing. I can help you finish the
                    driver file now.
                  </Text>

                  <Pressable style={styles.aiPrimaryButton}>
                    <Text style={styles.aiPrimaryButtonText}>
                      Help Me Fix It →
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.aiAskLabel}>YOU CAN ASK ME</Text>

                <View style={styles.aiSuggestions}>
                  <Pressable style={styles.aiSuggestion}>
                    <Text style={styles.aiSuggestionText}>
                      👥 Help me hire a driver
                    </Text>
                  </Pressable>

                  <Pressable style={styles.aiSuggestion}>
                    <Text style={styles.aiSuggestionText}>
                      🛡️ What compliance is due?
                    </Text>
                  </Pressable>

                  <Pressable style={styles.aiSuggestion}>
                    <Text style={styles.aiSuggestionText}>
                      🚛 Which truck is available?
                    </Text>
                  </Pressable>

                  <Pressable style={styles.aiSuggestion}>
                    <Text style={styles.aiSuggestionText}>
                      📦 Help me dispatch a load
                    </Text>
                  </Pressable>

                  <Pressable style={styles.aiSuggestion}>
                    <Text style={styles.aiSuggestionText}>
                      ⏱️ Check my drivers&apos; HOS
                    </Text>
                  </Pressable>

                  <Pressable style={styles.aiSuggestion}>
                    <Text style={styles.aiSuggestionText}>
                      💵 What is ready to invoice?
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.aiInputBox}>
                  <Text style={styles.aiMic}>🎙️</Text>

                  <View style={styles.aiInputContent}>
                    <Text style={styles.aiInputPlaceholder}>
                      Ask Taragle anything...
                    </Text>

                    <Text style={styles.aiInputLanguages}>
                      English • Soomaali
                    </Text>
                  </View>

                  <Pressable style={styles.aiSendButton}>
                    <Text style={styles.aiSendText}>↑</Text>
                  </Pressable>
                </View>

                <View style={styles.aiLanguageRow}>
                  <Text style={styles.aiLanguageText}>
                    🎙️ Speak to Taragle in English or Somali
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  header: {
    backgroundColor: "#0B2742",
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  tagline: {
    color: "#B9D4E8",
    fontSize: 12,
    marginTop: 3,
  },

  languageBadge: {
    borderWidth: 1,
    borderColor: "#3C91E6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  languageText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  welcomeSection: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
  },

  welcomeText: {
    color: "#6B7A90",
    fontSize: 15,
    marginBottom: 4,
  },

  companyName: {
    color: "#102A43",
    fontSize: 28,
    fontWeight: "800",
  },

  companyInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 8,
  },

  companyInfo: {
    color: "#62748A",
    fontSize: 13,
    fontWeight: "600",
  },

  dot: {
    color: "#A0AEC0",
    marginHorizontal: 8,
  },

  commandCard: {
    marginHorizontal: 22,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E4EAF1",
  },

  commandLabel: {
    color: "#1473E6",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  commandTitle: {
    color: "#102A43",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
    lineHeight: 31,
  },

  commandDescription: {
    color: "#62748A",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#153B5C",
    alignItems: "center",
    justifyContent: "center",
  },

  menuButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  menu: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E4EAF1",
  },

  menuSection: {
    color: "#8A98A8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 6,
  },

  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
    marginBottom: 2,
  },

  menuItemText: {
    color: "#334E68",
    fontSize: 14,
    fontWeight: "600",
  },

  activeMenuItem: {
    backgroundColor: "#EAF3FF",
  },

  activeMenuText: {
    color: "#1473E6",
    fontWeight: "800",
  },

  section: {
    marginHorizontal: 22,
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E4EAF1",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionLabel: {
    color: "#1473E6",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
  },

  sectionTitle: {
    color: "#102A43",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 4,
  },

  healthScore: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EAF8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  healthScoreText: {
    color: "#178A4B",
    fontSize: 18,
    fontWeight: "800",
  },

  healthSubtitle: {
    color: "#6B7A90",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 14,
  },

  healthList: {
    borderTopWidth: 1,
    borderTopColor: "#EDF1F5",
  },

  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F5",
    gap: 12,
  },

  healthName: {
    color: "#243B53",
    fontSize: 15,
    fontWeight: "700",
  },

  healthDescription: {
    color: "#829AB1",
    fontSize: 12,
    marginTop: 3,
  },

  statusGood: {
    color: "#178A4B",
    fontSize: 12,
    fontWeight: "800",
  },

  statusWarning: {
    color: "#C27A00",
    fontSize: 12,
    fontWeight: "800",
  },

  statusDanger: {
    color: "#C0392B",
    fontSize: 12,
    fontWeight: "800",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 18,
  },

  statCard: {
    width: "47%",
    minWidth: 140,
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E6ECF2",
  },

  statIcon: {
    fontSize: 22,
    marginBottom: 10,
  },

  statNumber: {
    color: "#102A43",
    fontSize: 22,
    fontWeight: "800",
  },

  statTitle: {
    color: "#334E68",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  statDetail: {
    color: "#829AB1",
    fontSize: 12,
    marginTop: 4,
  },

  viewButton: {
    backgroundColor: "#EAF3FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  viewButtonText: {
    color: "#1473E6",
    fontSize: 12,
    fontWeight: "800",
  },

  loadList: {
    gap: 12,
    marginTop: 18,
  },

  loadCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 14,
    padding: 16,
  },

  loadTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  loadNumber: {
    color: "#102A43",
    fontSize: 15,
    fontWeight: "800",
  },

  loadEquipment: {
    color: "#829AB1",
    fontSize: 12,
    marginTop: 3,
  },

  inTransitBadge: {
    backgroundColor: "#EAF8F0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  inTransitText: {
    color: "#178A4B",
    fontSize: 11,
    fontWeight: "800",
  },

  pickupBadge: {
    backgroundColor: "#EAF3FF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  pickupText: {
    color: "#1473E6",
    fontSize: 11,
    fontWeight: "800",
  },

  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 10,
  },

  routePoint: {
    flex: 1,
  },

  routeDestination: {
    alignItems: "flex-end",
  },

  routeCity: {
    color: "#243B53",
    fontSize: 13,
    fontWeight: "700",
  },

  routeLabel: {
    color: "#9AA9B8",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 3,
    letterSpacing: 0.7,
  },

  routeArrow: {
    color: "#1473E6",
    fontSize: 20,
    fontWeight: "700",
  },

  loadInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E6ECF2",
    gap: 10,
  },

  loadInfoLabel: {
    color: "#9AA9B8",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  loadInfoValue: {
    color: "#334E68",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  dispatchActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: "#1473E6",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  secondaryButtonText: {
    color: "#334E68",
    fontSize: 13,
    fontWeight: "800",
  },

  complianceSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E6ECF2",
  },

  complianceSummaryItem: {
    flex: 1,
    alignItems: "center",
  },

  complianceNumber: {
    color: "#178A4B",
    fontSize: 22,
    fontWeight: "800",
  },

  warningNumber: {
    color: "#C27A00",
  },

  dangerNumber: {
    color: "#C0392B",
  },

  complianceSummaryLabel: {
    color: "#6B7A90",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },

  complianceDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#E1E8EF",
  },

  attentionTitle: {
    color: "#334E68",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 20,
    marginBottom: 4,
  },

  complianceList: {
    marginTop: 4,
  },

  complianceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F5",
    gap: 10,
  },

  complianceIconWarning: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFF7E6",
    alignItems: "center",
    justifyContent: "center",
  },

  complianceIconDanger: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FDEEEE",
    alignItems: "center",
    justifyContent: "center",
  },

  complianceContent: {
    flex: 1,
  },

  complianceItemTitle: {
    color: "#243B53",
    fontSize: 13,
    fontWeight: "800",
  },

  complianceItemDescription: {
    color: "#829AB1",
    fontSize: 11,
    marginTop: 3,
  },

  complianceButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#1473E6",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },

  complianceButtonText: {
    color: "#1473E6",
    fontSize: 13,
    fontWeight: "800",
  },
  fleetSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E6ECF2",
  },

  fleetSummaryItem: {
    flex: 1,
    alignItems: "center",
  },

  fleetSummaryNumber: {
    color: "#102A43",
    fontSize: 20,
    fontWeight: "800",
  },

  fleetAvailableNumber: {
    color: "#178A4B",
    fontSize: 20,
    fontWeight: "800",
  },

  fleetWarningNumber: {
    color: "#C27A00",
    fontSize: 20,
    fontWeight: "800",
  },

  fleetSummaryLabel: {
    color: "#829AB1",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },

  fleetList: {
    gap: 12,
    marginTop: 18,
  },

  fleetCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 14,
    padding: 16,
  },

  fleetTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  unitNumber: {
    color: "#102A43",
    fontSize: 15,
    fontWeight: "800",
  },

  unitType: {
    color: "#829AB1",
    fontSize: 11,
    marginTop: 3,
  },

  onLoadBadge: {
    backgroundColor: "#EAF3FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  onLoadText: {
    color: "#1473E6",
    fontSize: 10,
    fontWeight: "800",
  },

  availableBadge: {
    backgroundColor: "#EAF8F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  availableText: {
    color: "#178A4B",
    fontSize: 10,
    fontWeight: "800",
  },

  attentionBadge: {
    backgroundColor: "#FFF7E6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  attentionBadgeText: {
    color: "#C27A00",
    fontSize: 10,
    fontWeight: "800",
  },

  fleetDriverRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 15,
  },

  fleetLabel: {
    color: "#9AA9B8",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  fleetValue: {
    color: "#334E68",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },

  eldConnected: {
    color: "#178A4B",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },

  eldDisconnected: {
    color: "#C0392B",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },

  hosBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E6ECF2",
  },

  hosTime: {
    color: "#1473E6",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 3,
  },

  fleetAlert: {
    backgroundColor: "#FFF7E6",
    borderRadius: 10,
    padding: 11,
    marginTop: 14,
  },

  fleetAlertText: {
    color: "#9A6200",
    fontSize: 11,
    fontWeight: "700",
  },

  alertCountBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FDEEEE",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  alertCountText: {
    color: "#C0392B",
    fontSize: 13,
    fontWeight: "800",
  },

  taskList: {
    marginTop: 18,
  },

  taskItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1F5",
  },

  urgentTaskIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#FDEEEE",
    alignItems: "center",
    justifyContent: "center",
  },

  warningTaskIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#FFF7E6",
    alignItems: "center",
    justifyContent: "center",
  },

  normalTaskIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#EAF3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  taskContent: {
    flex: 1,
  },

  taskTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },

  taskTitle: {
    flex: 1,
    color: "#243B53",
    fontSize: 13,
    fontWeight: "800",
  },

  taskDescription: {
    color: "#62748A",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  taskSource: {
    color: "#9AA9B8",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 5,
  },

  urgentText: {
    color: "#C0392B",
    fontSize: 9,
    fontWeight: "800",
  },

  todayText: {
    color: "#1473E6",
    fontSize: 9,
    fontWeight: "800",
  },

  dueSoonText: {
    color: "#C27A00",
    fontSize: 9,
    fontWeight: "800",
  },

  readyText: {
    color: "#178A4B",
    fontSize: 9,
    fontWeight: "800",
  },

  taskActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  aiSection: {
    marginHorizontal: 22,
    marginTop: 18,
    backgroundColor: "#0B2742",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#173D5E",
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  aiLogo: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#1473E6",
    alignItems: "center",
    justifyContent: "center",
  },

  aiLogoText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  aiHeaderContent: {
    flex: 1,
  },

  aiTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  aiOnlineBadge: {
    backgroundColor: "#123F3A",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  aiOnlineText: {
    color: "#6EE7A8",
    fontSize: 9,
    fontWeight: "800",
  },

  aiSubtitle: {
    color: "#AFC8DC",
    fontSize: 11,
    marginTop: 3,
  },

  aiMessage: {
    marginTop: 18,
  },

  aiMessageTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  aiMessageText: {
    color: "#C5D7E6",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },

  aiPriority: {
    backgroundColor: "#123451",
    borderRadius: 14,
    padding: 15,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#245173",
  },

  aiPriorityLabel: {
    color: "#73B7FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  aiPriorityTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 7,
  },

  aiPriorityDescription: {
    color: "#B9CDDD",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  aiPrimaryButton: {
    backgroundColor: "#1473E6",
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginTop: 12,
  },

  aiPrimaryButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  aiAskLabel: {
    color: "#8EABC1",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 9,
  },

  aiSuggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  aiSuggestion: {
    backgroundColor: "#123451",
    borderWidth: 1,
    borderColor: "#245173",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  aiSuggestionText: {
    color: "#D5E4EF",
    fontSize: 10,
    fontWeight: "700",
  },

  aiInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
    marginTop: 18,
    gap: 9,
  },

  aiMic: {
    fontSize: 20,
  },

  aiInputContent: {
    flex: 1,
  },

  aiInputPlaceholder: {
    color: "#334E68",
    fontSize: 12,
    fontWeight: "700",
  },

  aiInputLanguages: {
    color: "#9AA9B8",
    fontSize: 9,
    marginTop: 2,
  },

  aiSendButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#1473E6",
    alignItems: "center",
    justifyContent: "center",
  },

  aiSendText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  aiLanguageRow: {
    alignItems: "center",
    marginTop: 11,
  },

  aiLanguageText: {
    color: "#8EABC1",
    fontSize: 10,
    fontWeight: "600",
  },

  quickActionsSection: {
    marginHorizontal: 22,
    marginTop: 18,
  },

  quickActionsLabel: {
    color: "#6B7A90",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
  },

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  quickAction: {
    width: "30%",
    minWidth: 100,
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 13,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  quickActionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },

  quickActionText: {
    color: "#334E68",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  aiQuickAction: {
    backgroundColor: "#0B2742",
    borderColor: "#0B2742",
  },

  aiQuickActionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  moneyMainCard: {
    backgroundColor: "#EAF8F0",
    borderRadius: 14,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#D3EDDD",
  },

  moneyMainLabel: {
    color: "#527566",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  moneyMainAmount: {
    color: "#178A4B",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 5,
  },

  moneyMainPeriod: {
    color: "#6B7A90",
    fontSize: 11,
    marginTop: 2,
  },

  moneyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },

  moneyCard: {
    width: "47%",
    minWidth: 130,
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 13,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E6ECF2",
  },

  moneyIcon: {
    fontSize: 18,
    marginBottom: 8,
  },

  moneyAmount: {
    color: "#102A43",
    fontSize: 18,
    fontWeight: "800",
  },

  moneyLabel: {
    color: "#334E68",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },

  moneyPeriod: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 3,
  },

  moneyActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  hiringSummary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E6ECF2",
  },

  hiringSummaryItem: {
    flex: 1,
    alignItems: "center",
  },

  hiringNumber: {
    color: "#102A43",
    fontSize: 21,
    fontWeight: "800",
  },

  hiringReviewNumber: {
    color: "#C27A00",
    fontSize: 21,
    fontWeight: "800",
  },

  hiringReadyNumber: {
    color: "#178A4B",
    fontSize: 21,
    fontWeight: "800",
  },

  hiringSummaryLabel: {
    color: "#829AB1",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },

  hiringList: {
    gap: 10,
    marginTop: 16,
  },

  applicantCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E4EAF1",
    borderRadius: 14,
    padding: 14,
  },

  applicantTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  applicantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAF3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  applicantAvatarText: {
    color: "#1473E6",
    fontSize: 11,
    fontWeight: "900",
  },

  applicantContent: {
    flex: 1,
  },

  applicantName: {
    color: "#243B53",
    fontSize: 13,
    fontWeight: "800",
  },

  applicantDetail: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 3,
  },

  readyBadge: {
    backgroundColor: "#EAF8F0",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  readyBadgeText: {
    color: "#178A4B",
    fontSize: 9,
    fontWeight: "800",
  },

  reviewBadge: {
    backgroundColor: "#FFF7E6",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  reviewBadgeText: {
    color: "#C27A00",
    fontSize: 9,
    fontWeight: "800",
  },

  applicationProgress: {
    height: 6,
    backgroundColor: "#E4EAF1",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 13,
  },

  applicationProgressFill: {
    height: "100%",
    backgroundColor: "#178A4B",
    borderRadius: 10,
  },

  applicationProgressFillWarning: {
    height: "100%",
    backgroundColor: "#C27A00",
    borderRadius: 10,
  },

  applicationProgressText: {
    color: "#829AB1",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 5,
  },

  hiringActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  desktopSidebar: {
    width: 245,
    backgroundColor: "#0B2742",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 30,
  },

  sidebarBrand: {
    paddingHorizontal: 12,
    marginBottom: 22,
  },

  sidebarBrandText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sidebarBrandSubtext: {
    color: "#65A9E8",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 3,
    marginTop: 1,
  },

  sidebarSection: {
    color: "#6F91AC",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    paddingHorizontal: 12,
    marginTop: 17,
    marginBottom: 6,
  },

  sidebarItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9,
    marginBottom: 2,
  },

  sidebarItemText: {
    color: "#C3D4E1",
    fontSize: 12,
    fontWeight: "600",
  },

  sidebarItemActive: {
    backgroundColor: "#1473E6",
  },

  sidebarItemActiveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  appShell: {
    flex: 1,
  },

  appShellDesktop: {
    flexDirection: "row",
  },

  mainContent: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  desktopScrollContent: {
    width: "100%",
    maxWidth: 1400,
    alignSelf: "center",
    paddingBottom: 60,
  },

  dashboardRow: {
    width: "100%",
  },

  dashboardRowDesktop: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 22,
    gap: 18,
  },

  dashboardColumn: {
    flex: 1,
    marginHorizontal: 0,
  },
});
