import { createDrawerNavigator } from "@react-navigation/drawer";
import {useAuth} from "@/hooks/useAuth";
import HomeScreen from "@/app/(public)/index";
import RegisterScreen from "@/app/(public)/register";
import AboutScreen from "@/app/(public)/about";

const Drawer = createDrawerNavigator();

export default function TabsLayout() {
    const {isAuthenticated} = useAuth();
    const screens = [
        {name: "index", component: HomeScreen, title: "Home"},
        {name: "register", component: RegisterScreen, title: "Register"},
        {name: "about", component: AboutScreen, title: "About"},
    ];

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

