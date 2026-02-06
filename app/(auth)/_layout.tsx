import {Redirect} from "expo-router";
import {useAuth} from "@/hooks/useAuth";
import {createDrawerNavigator} from "@react-navigation/drawer";
import HomeScreen from "@/app/(auth)/index";
import UserInfo from "@/app/(auth)/user-info";
import Activities from "@/app/(auth)/activities";
import CalendarScreen from "@/app/(auth)/google-calendar";
import LogoutScreen from "@/app/(auth)/logout";
import AboutScreen from "@/app/(public)/about";
import LocalCalendarScreen from "@/app/(auth)/local-calendar";

const Drawer = createDrawerNavigator();

export default function AuthTabs() {
    const {isAuthenticated} = useAuth();
    const screens = [
        {name: "index", component: HomeScreen, title: "Accueil"},
        {name: "user-info", component: UserInfo, title: "Infos Utilisateur"},
        {name: "activities", component: Activities, title: "Activités"},
        {name: "google-calendar", component: CalendarScreen, title: "Calendrier Google "},
        {name: "local-calendar", component: LocalCalendarScreen, title: "Calendrier Local"},
        {name: "logout", component: LogoutScreen, title: "Déconnexion"},
        {name: "about", component: AboutScreen, title: "A Propos"},
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
