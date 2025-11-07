import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ControlPanel } from "@/components/ControlPanel";
import { ResultsDisplay } from "@/components/ResultsDisplay";

interface Prediction {
  crime: string;
  year: number;
  predicted_cases?: number;
  rmse?: number;
  graphUrl?: string;
}

const Index = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = (data: Prediction) => {
    setPredictions((prev) => [...prev, data]);
  };

  const handleClearPredictions = () => {
    setPredictions([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <HeroSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1">
            <ControlPanel
              onPredict={handlePredict}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
          
          <div className="lg:col-span-2">
            <ResultsDisplay
              predictions={predictions}
              onClear={handleClearPredictions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
