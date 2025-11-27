// app/(tabs)/index.tsx
import { ThemedText } from '@/components/themed-text';
import {
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';

import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ---- Minimal types for now ----

type IncidentValence = 'positive' | 'negative' | 'mixed' | 'neutral';

type LifeEvent = {
  id: string;
  description: string;
  startTime?: string;
  endTime?: string;
};

type Incident = {
  id: string;
  time: string; // e.g. "09:12"
  mainSymptom: string;
  valence: IncidentValence;
  lifeEventName?: string;
};

// ---- Mock data ----

const MOCK_LAST_INCIDENT: Incident | null = {
  id: 'i1',
  time: '14:03',
  mainSymptom: 'Intrusive thoughts',
  valence: 'negative',
  lifeEventName: 'At home',
};

const MOCK_LIFE_EVENTS: LifeEvent[] = [
  {
    id: 'e1',
    description: 'Pub night',
    startTime: '19:30',
    endTime: '23:00',
  },
  {
    id: 'e2',
    description: 'Work day',
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    id: 'e3',
    description: 'Storm outside',
    startTime: 'Now',
  },
];

const MOCK_TODAY_INCIDENTS: Incident[] = [
  {
    id: 'i2',
    time: '09:12',
    mainSymptom: 'Intrusive thoughts',
    valence: 'negative',
    lifeEventName: 'Work day',
  },
  {
    id: 'i3',
    time: '13:05',
    mainSymptom: 'Calm walk in park',
    valence: 'positive',
    lifeEventName: 'Lunch break',
  },
  {
    id: 'i4',
    time: '21:17',
    mainSymptom: 'Panic spike',
    valence: 'negative',
    lifeEventName: 'Pub night',
  },
];

// ---- Helper functions & small components ----

const valenceEmoji = (valence: IncidentValence) => {
  switch (valence) {
    case 'positive':
      return '🙂';
    case 'negative':
      return '😟';
    case 'mixed':
      return '😐';
    case 'neutral':
    default:
      return '😶';
  }
};

const PrimaryButton: React.FC<{
  label: string;
  onPress?: () => void;
}> = ({ label, onPress }) => (
  <Pressable style={styles.primaryButton} onPress={onPress}>
    <Text style={styles.primaryButtonText}>{label}</Text>
  </Pressable>
);

const SecondaryButton: React.FC<{
  label: string;
  onPress?: () => void;
}> = ({ label, onPress }) => (
  <Pressable style={styles.secondaryButton} onPress={onPress}>
    <Text style={styles.secondaryButtonText}>{label}</Text>
  </Pressable>
);

// ---- Log Now bottom sheet (using @gorhom/bottom-sheet) ----

const QUICK_SYMPTOMS = [
  'Intrusive thoughts',
  'Heart racing',
  'Frozen up / can’t speak',
];

type LogNowSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
};


const LogNowSheet: React.FC<LogNowSheetProps> = ({ bottomSheetRef }) => {
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(
    null,
  );

  const snapPoints = useMemo(() => ['40%', '70%'], []);

  const handleSymptomPress = (symptom: string) => {
    console.log('LOG INCIDENT NOW', {
      symptom,
      lifeEventId: selectedEventId,
      time: new Date().toISOString(),
    });
    // Close the sheet
    bottomSheetRef.current?.dismiss();
  };

  const handleEventPress = (eventId: string) => {
    setSelectedEventId((prev) => (prev === eventId ? null : eventId));
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetHandle}
    >
      <View style={styles.sheetContent}>
        <Text style={styles.sheetTitle}>What’s happening right now?</Text>
        <Text style={styles.sheetSubtitle}>
          Choose the closest match. We’ll make this faster later.
        </Text>

        {/* Quick symptoms */}
        <View style={styles.chipRow}>
          {QUICK_SYMPTOMS.map((symptom) => (
            <Pressable
              key={symptom}
              style={styles.chip}
              onPress={() => handleSymptomPress(symptom)}
            >
              <Text style={styles.chipText}>{symptom}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => console.log('TODO: open full symptom picker')}
        >
          <Text style={styles.linkText}>More symptoms…</Text>
        </Pressable>

        {/* Life event association */}
        <Text style={[styles.sheetSubtitle, { marginTop: 16 }]}>
          Is this happening during something?
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.lifeEventsList}
        >
          {MOCK_LIFE_EVENTS.map((event) => {
            const selected = selectedEventId === event.id;
            return (
              <Pressable
                key={event.id}
                style={[
                  styles.lifeEventCard,
                  selected && styles.lifeEventCardSelected,
                ]}
                onPress={() => handleEventPress(event.id)}
              >
                <Text
                  style={[
                    styles.lifeEventTitle,
                    selected && styles.lifeEventTitleSelected,
                  ]}
                >
                  {event.description}
                </Text>
                <Text
                  style={[
                    styles.lifeEventTime,
                    selected && styles.lifeEventTimeSelected,
                  ]}
                >
                  {event.startTime}
                  {event.endTime ? ` – ${event.endTime}` : ''}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </BottomSheetModal>
  );
};


// ---- Home screen ----

function HomeScreenInner() {
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  const handleLogNow = () => {
    console.log('Presenting bottom sheet, ref =', bottomSheetRef.current);
    bottomSheetRef.current?.present();
  };

  const handleQuickMoment = () => {
    console.log('Quick moment');
  };

  const handleLogSameAgain = () => {
    console.log('Log same again');
  };

  const handleLifeEventPress = (event: LifeEvent) => {
    console.log('Life event pressed', event.id);
  };

  const handleIncidentPress = (incident: Incident) => {
    console.log('Incident pressed', incident.id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>Journal</Text>
          <Text style={styles.appSubtitle}>Track what happens, gently.</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerPill}>Beta</Text>
        </View>
      </View>

      {/* Main content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Primary CTA block */}
        <View style={styles.ctaBlock}>
          <PrimaryButton
            label="Log what's happening now"
            onPress={handleLogNow}
          />
          <SecondaryButton
            label="Quick moment (thought / spike)"
            onPress={handleQuickMoment}
          />
        </View>

        {/* Last logged snippet */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Last logged</Text>
          {MOCK_LAST_INCIDENT ? (
            <>
              <Text style={styles.lastLoggedText}>
                {MOCK_LAST_INCIDENT.time} · {MOCK_LAST_INCIDENT.mainSymptom}
                {MOCK_LAST_INCIDENT.lifeEventName
                  ? ` (${MOCK_LAST_INCIDENT.lifeEventName})`
                  : ''}
              </Text>
              <Pressable
                style={styles.logSameButton}
                onPress={handleLogSameAgain}
              >
                <Text style={styles.logSameButtonText}>Log same again</Text>
              </Pressable>
            </>
          ) : (
            <Text style={styles.lastLoggedText}>
              Nothing yet today. Start with a quick log.
            </Text>
          )}
        </View>

        {/* Life events summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Today’s life events</Text>
            <Pressable onPress={() => console.log('View all events')}>
              <Text style={styles.linkText}>View all</Text>
            </Pressable>
          </View>

          <FlatList
            data={MOCK_LIFE_EVENTS}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lifeEventsList}
            renderItem={({ item }) => (
              <Pressable
                style={styles.lifeEventCard}
                onPress={() => handleLifeEventPress(item)}
              >
                <Text style={styles.lifeEventTitle}>
                  {item.description}
                </Text>
                <Text style={styles.lifeEventTime}>
                  {item.startTime}
                  {item.endTime ? ` – ${item.endTime}` : ''}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* Today’s timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              Today’s incidents & moments
            </Text>
            <Pressable onPress={() => console.log('Open full timeline')}>
              <Text style={styles.linkText}>Timeline</Text>
            </Pressable>
          </View>

          {MOCK_TODAY_INCIDENTS.length === 0 ? (
            <Text style={styles.emptyText}>
              Nothing logged yet today.
            </Text>
          ) : (
            <View style={styles.timeline}>
              {MOCK_TODAY_INCIDENTS.map((incident, index) => (
                <Pressable
                  key={incident.id}
                  style={[
                    styles.timelineRow,
                    index === 0 && styles.timelineRowFirst,
                  ]}
                  onPress={() => handleIncidentPress(incident)}
                >
                  <View style={styles.timelineTimeCol}>
                    <Text style={styles.timelineTimeText}>
                      {incident.time}
                    </Text>
                  </View>
                  <View style={styles.timelineMainCol}>
                    <Text style={styles.timelineSymptomText}>
                      {valenceEmoji(incident.valence)}{' '}
                      {incident.mainSymptom}
                    </Text>
                    {incident.lifeEventName && (
                      <Text style={styles.timelineSubText}>
                        {incident.lifeEventName}
                      </Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Bottom sheet portal */}
      <LogNowSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}

// Wrap with BottomSheetModalProvider so the modal works
export default function HomeScreen() {
  return (
      <><HomeScreenInner />

      <Link href="/modal" asChild>
        <Pressable style={styles.modalButton}>
          <ThemedText type="link">Open modal</ThemedText>
        </Pressable>
      </Link>
      </>
  );
}

// ---- Styles ----

const styles = StyleSheet.create({
  modalButton: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  appSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 12,
    color: '#555',
    backgroundColor: '#fff',
  },
  ctaBlock: {
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e0ebff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  linkText: {
    fontSize: 13,
    color: '#2563eb',
  },
  lastLoggedText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  logSameButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#eff6ff',
  },
  logSameButtonText: {
    fontSize: 13,
    color: '#1d4ed8',
    fontWeight: '500',
  },
  lifeEventsList: {
    paddingVertical: 4,
  },
  lifeEventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    minWidth: 130,
    elevation: 1,
  },
  lifeEventCardSelected: {
    backgroundColor: '#1d4ed8',
  },
  lifeEventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  lifeEventTitleSelected: {
    color: '#f9fafb',
  },
  lifeEventTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  lifeEventTimeSelected: {
    color: '#e5e7eb',
  },
  emptyText: {
    fontSize: 13,
    color: '#6b7280',
  },
  timeline: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 4,
    elevation: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  timelineRowFirst: {
    borderTopWidth: 0,
  },
  timelineTimeCol: {
    width: 60,
    paddingRight: 8,
  },
  timelineTimeText: {
    fontSize: 13,
    color: '#6b7280',
  },
  timelineMainCol: {
    flex: 1,
  },
  timelineSymptomText: {
    fontSize: 14,
    color: '#111827',
  },
  timelineSubText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  // --- bottom sheet styles ---
  sheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHandle: {
    backgroundColor: '#d1d5db',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#eff6ff',
  },
  chipText: {
    fontSize: 13,
    color: '#1d4ed8',
  },
});