import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { colors, fonts, shadow } from '../theme';

// Screens
import HomeScreen       from '../screens/HomeScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import PassportScreen   from '../screens/PassportScreen';
import AddBookScreen    from '../screens/AddBookScreen';
import LibraryScreen    from '../screens/LibraryScreen';
import MessagesScreen   from '../screens/MessagesScreen';
import ThreadScreen     from '../screens/ThreadScreen';
import ProfileScreen    from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NeighboursScreen from '../screens/NeighboursScreen';
import PaywallScreen    from '../screens/PaywallScreen';
import SignupScreen     from '../screens/SignupScreen';
import ConsentScreen    from '../screens/ConsentScreen';
import LegalScreen, { PrivacyDataScreen } from '../screens/LegalScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const noHeader = { headerShown: false };

// ── Tab icons ─────────────────────────────────────────────────────────
const ICONS = {
  Home:     { idle: '⌂',  active: '⌂'  },
  Library:  { idle: '📚', active: '📚' },
  Messages: { idle: '💬', active: '💬' },
  Profile:  { idle: '👤', active: '👤' },
};

function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={s.tabOuter}>
      <View style={[s.tabBar, shadow.tab]}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const isAdd   = route.name === 'Add';
          const color   = focused ? colors.terra : colors.sage;
          if (isAdd) {
            return (
              <TouchableOpacity key={route.key} onPress={() => navigation.navigate('Add')}
                style={s.addBtn} activeOpacity={0.82}>
                <View style={s.addCircle}>
                  <Text style={{ color: '#fff', fontSize: 26, lineHeight: 28 }}>+</Text>
                </View>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity key={route.key} style={s.tabItem} activeOpacity={0.75}
              onPress={() => navigation.navigate(route.name)}>
              <Text style={{ fontSize: 22 }}>{ICONS[route.name]?.idle}</Text>
              <Text style={[s.tabLabel, { color }]}>{route.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Main tab navigator ────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props}/>} screenOptions={noHeader}>
      <Tab.Screen name="Home"     component={HomeStackNav}/>
      <Tab.Screen name="Library"  component={LibraryScreen}/>
      <Tab.Screen name="Add"      component={AddBookScreen}/>
      <Tab.Screen name="Messages" component={MessagesStackNav}/>
      <Tab.Screen name="Profile"  component={ProfileStackNav}/>
    </Tab.Navigator>
  );
}

function HomeStackNav() {
  return (
    <Stack.Navigator screenOptions={noHeader}>
      <Stack.Screen name="HomeMain"    component={HomeScreen}/>
      <Stack.Screen name="BookDetail"  component={BookDetailScreen}/>
      <Stack.Screen name="Passport"    component={PassportScreen}/>
      <Stack.Screen name="Neighbours"  component={NeighboursScreen}/>
      <Stack.Screen name="Profile"     component={ProfileScreen}/>
    </Stack.Navigator>
  );
}

function MessagesStackNav() {
  return (
    <Stack.Navigator screenOptions={noHeader}>
      <Stack.Screen name="MessagesList" component={MessagesScreen}/>
      <Stack.Screen name="Thread"        component={ThreadScreen}/>
      <Stack.Screen name="BookDetail"    component={BookDetailScreen}/>
    </Stack.Navigator>
  );
}

function ProfileStackNav() {
  return (
    <Stack.Navigator screenOptions={noHeader}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen}/>
      <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
      <Stack.Screen name="Paywall"     component={PaywallScreen}/>
      <Stack.Screen name="PrivacyData" component={PrivacyDataScreen}/>
      <Stack.Screen name="Legal"       component={LegalScreen}/>
      <Stack.Screen name="Privacy"     component={LegalScreen}
        initialParams={{ doc: 'privacy' }}/>
    </Stack.Navigator>
  );
}

// ── Auth stack ────────────────────────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={noHeader}>
      <Stack.Screen name="Signup"  component={SignupScreen}/>
      <Stack.Screen name="Consent" component={ConsentScreen}/>
      <Stack.Screen name="Legal"   component={LegalScreen}/>
    </Stack.Navigator>
  );
}

// ── Root navigator ────────────────────────────────────────────────────
export default function RootNavigator() {
  const { isAuthenticated, consent, loading } = useAuth();

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.cream }}>My Bookshelf</Text>
    </View>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={noHeader}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack}/>
        ) : !consent ? (
          <Stack.Screen name="Consent" component={ConsentScreen}/>
        ) : (
          <Stack.Screen name="Main" component={MainTabs}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  tabOuter:  { position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 26, pointerEvents: 'box-none' },
  tabBar:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginHorizontal: 14, height: 64, backgroundColor: colors.card, borderRadius: 24, paddingHorizontal: 6 },
  tabItem:   { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 8 },
  tabLabel:  { fontFamily: fonts.sansBd, fontSize: 10, letterSpacing: 0.2 },
  addBtn:    { flex: 'none', marginTop: -28 },
  addCircle: { width: 56, height: 56, borderRadius: 19, backgroundColor: colors.terra, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.paper, ...shadow.cta },
});
