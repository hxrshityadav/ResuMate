import { useTheme } from "../../context/ThemeContext";
import { CareerAtlasLight } from "./CareerAtlasLight";
import { CareerAtlasDark } from "./CareerAtlasDark";

export default function CareerAtlasLanding() {
  const { isDark } = useTheme();

  return isDark ? <CareerAtlasDark /> : <CareerAtlasLight />;
}
