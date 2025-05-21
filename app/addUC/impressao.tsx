import { useEffect } from "react";
import { router } from "expo-router";

export default function AddUCIndexRedirect() {
  useEffect(() => {
    // Redireciona para a página "Unidades Consumidoras"
    router.replace("/addUC/ucs");
  }, []);

  return null; // Não precisa renderizar nada, apenas redireciona
}