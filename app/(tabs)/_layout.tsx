import { createDrawerNavigator } from "@react-navigation/drawer";
import {useAuth} from "@/hooks/useAuth";
import HomeScreen from "@//app/(tabs)/index";
import RegisterScreen from "@/app/(tabs)/register";
import UserInfo from "@/app/(tabs)/user-info";
import Activities from "@/app/(tabs)/activities";
import CalendarScreen from "@/app/(tabs)/google-calendar";
import LogoutScreen from "@/app/(tabs)/logout";
import AboutScreen from "@/app/(tabs)/about";

const Drawer = createDrawerNavigator();

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
        <Drawer.Navigator
            key={isAuthenticated ? "auth" : "noauth"}
            screenOptions={{
                lazy: true,
                drawerPosition: "left", // menu à gauche
                drawerType: "slide",
                swipeEnabled: true,
            }}
        >
            {screens.map((s) => (
                <Drawer.Screen
                    key={s.name}
                    name={s.name}
                    component={s.component}
                    options={{title: s.title}}
                />
            ))}
        </Drawer.Navigator>
    );
}
