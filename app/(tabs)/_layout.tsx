import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {withLayoutContext} from "expo-router";

const TopTabs = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(
    TopTabs.Navigator
);

export default function TabsLayout() {
    return (
        <MaterialTopTabs
            screenOptions={{
                lazy: true,
                tabBarIndicatorStyle: {backgroundColor: "#000"},
                tabBarStyle: {backgroundColor: "#fff"},
                tabBarLabelStyle: {fontWeight: "600"},
                swipeEnabled: true,
            }}
        >
            <MaterialTopTabs.Screen
                name="index"
                options={{title: "Home"}}
            />
            <MaterialTopTabs.Screen
                name="register"
                options={{title: "Register"}}
            />
            <MaterialTopTabs.Screen
                name="user-info"
                options={{title: "User Info"}}
            />
            <MaterialTopTabs.Screen
                name="activities"
                options={{title: "Activities"}}
            />
            <MaterialTopTabs.Screen
                name="google-calendar"
                options={{title: "Calendar"}}
            />
            <MaterialTopTabs.Screen
                name="logout"
                options={{title: "Logout"}}
            />
            <MaterialTopTabs.Screen
                name="about"
                options={{title: "About"}}
            />
        </MaterialTopTabs>
    );
}
