import { Toaster } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";

const ThemedToaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      key={resolvedTheme}
      position="bottom-right"
      toastOptions={{
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  );
};

export default ThemedToaster;
