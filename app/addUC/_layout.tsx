import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AddUCTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1a1a1a", // cor de fundo escura
          borderTopWidth: 0, // remove borda superior
          height: 80, // altura da tab bar
        },
        tabBarActiveTintColor: "#FFFFFF", // cor do item ativo
        tabBarInactiveTintColor: "#aaa", // cor dos inativos
        tabBarLabelStyle: {
          fontSize: 12, // tamanho do texto da label um pouco menor
          fontFamily: "Inter",
        },
      }}
    >
      <Tabs.Screen
        name="ucs"
        options={{
          title: "UC's",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size * 0.9} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dimensionamento"
        options={{
          title: "Dimension.",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size * 0.9} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projeto"
        options={{
          title: "Projeto",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size * 0.9} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="financeiro"
        options={{
          title: "Financeiro",
          tabBarIcon: ({ color, size }) => (
            <Feather name="dollar-sign" size={size * 0.9} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="impressao"
        options={{
          title: "Impressão",
          tabBarIcon: ({ color, size }) => (
            <Feather name="printer" size={size * 0.9} color={color} />
          ),
          tabBarItemStyle: {},
        }}
      />
    </Tabs>
  );
}
