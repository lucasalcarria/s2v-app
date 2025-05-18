import { TarifaProvider } from "@/src/contexts/TarifaContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <TarifaProvider>
      <Stack screenOptions={{ headerShown: false }} />;
    </TarifaProvider>
  )
}
