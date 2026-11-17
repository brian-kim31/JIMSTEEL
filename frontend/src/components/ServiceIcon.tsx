import { Car, ClipboardCheck, Gauge, Gift, Snowflake, Wrench, Zap, type LucideProps } from "lucide-react";

const ICONS = {
  wrench: Wrench,
  "clipboard-check": ClipboardCheck,
  gauge: Gauge,
  zap: Zap,
  snowflake: Snowflake,
  gift: Gift,
  car: Car,
};

export function ServiceIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICONS[name as keyof typeof ICONS] ?? Wrench;
  return <Icon aria-hidden {...props} />;
}
