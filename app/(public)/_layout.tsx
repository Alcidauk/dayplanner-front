import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "@/app/index";
import RegisterScreen from "@/app/(public)/register";
import AboutScreen from "@/app/(public)/about";

const Drawer = createDrawerNavigator();

export default function TabsLayout() {
    const screens = [
        {name: "index", component: HomeScreen, title: "Accueil"},
        {name: "register", component: RegisterScreen, title: "Enregistrement"},
        {name: "about", component: AboutScreen, title: "A Propos"},
    ];

    return (
        <Drawer.Navigator
            screenOptions={{
                lazy: true,
                drawerPosition: "left",
                drawerType: "slide",
                swipeEnabled: true,
                drawerActiveTintColor: 'white',
                drawerInactiveTintColor: '#999',
                drawerStyle: {
                    backgroundColor: "black",
                },
                headerStyle: {
                    backgroundColor: "black",
                },
                headerTintColor: "white",
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

