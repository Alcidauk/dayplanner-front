import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {useAuth} from "@/hooks/useAuth";
import HomeScreen from "@//app/(tabs)/index";
import RegisterScreen from "@/app/(tabs)/register";
import UserInfo from "@/app/(tabs)/user-info";
import Activities from "@/app/(tabs)/activities";
import CalendarScreen from "@/app/(tabs)/google-calendar";
import LogoutScreen from "@/app/(tabs)/logout";
import AboutScreen from "@/app/(tabs)/about";

const TopTabs = createMaterialTopTabNavigator();

export default function TabsLayout() {
    const {isAuthenticated} = useAuth();
    const screens = [
        {name: "index", component: HomeScreen, title: "Home"},
        {name: "register", component: RegisterScreen, title: "Register"},
        ...(isAuthenticated
            ? [
                {name: "user-info", component: UserInfo, title: "User Info"},
                {name: "activities", component: Activities, title: "Activities"},
                {name: "google-calendar", component: CalendarScreen, title: "Calendar"},
                {name: "logout", component: LogoutScreen, title: "Logout"},
            ]
            : []),
        {name: "about", component: AboutScreen, title: "About"},
    ];

    return (
        <TopTabs.Navigator
            key={isAuthenticated ? "auth" : "noauth"}
            screenOptions={{
                lazy: true,
                tabBarIndicatorStyle: {backgroundColor: "#000"},
                tabBarStyle: {backgroundColor: "#fff"},
                tabBarLabelStyle: {fontWeight: "600"},
                swipeEnabled: true,
            }}
        >
            {screens.map((s) => (
                <TopTabs.Screen
                    key={s.name}
                    name={s.name}
                    component={s.component}
                    options={{title: s.title}}
                />
            ))}
        </TopTabs.Navigator>
    );
}
