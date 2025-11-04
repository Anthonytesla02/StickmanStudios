import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Hero from '../Hero';

export default function HeroExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <Hero />
    </QueryClientProvider>
  );
}
