import {Redirect} from "expo-router";
import {useAuth} from "@/hooks/useAuth";
import {createDrawerNavigator} from "@react-navigation/drawer";
import HomeScreen from "@/app/(auth)/index";
import UserInfo from "@/app/(auth)/user-info";
import Activities from "@/app/(auth)/activities";
import CalendarScreen from "@/app/(auth)/google-calendar";
import LogoutScreen from "@/app/(auth)/logout";
import AboutScreen from "@/app/(public)/about";

const Drawer = createDrawerNavigator();

export default function AuthTabs() {
    const {isAuthenticated} = useAuth();
    const screens = [
        {name: "index", component: HomeScreen, title: "Home"},
        {name: "user-info", component: UserInfo, title: "User Info"},
        {name: "activities", component: Activities, title: "Activities"},
        {name: "google-calendar", component: CalendarScreen, title: "Calendar"},
        {name: "logout", component: LogoutScreen, title: "Logout"},
        {name: "about", component: AboutScreen, title: "About"},
    ];

    if (!isAuthenticated) {
        return <Redirect href="/(public)"/>;
    }

    return (
        <Drawer.Navigator
            key={isAuthenticated ? "auth" : "noauth"}
            screenOptions={{
                lazy: true,
                drawerPosition: "left",
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
