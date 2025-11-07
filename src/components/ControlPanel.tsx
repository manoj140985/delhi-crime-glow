import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Loader2, BarChart3 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface ControlPanelProps {
  onPredict: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ControlPanel = ({ onPredict, isLoading, setIsLoading }: ControlPanelProps) => {
  const [crimes, setCrimes] = useState<string[]>([]);
  const [selectedCrime, setSelectedCrime] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  useEffect(() => {
    fetchCrimes();
  }, []);

  const fetchCrimes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/crimes");
      setCrimes(response.data);
      if (response.data.length > 0) {
        setSelectedCrime(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching crimes:", error);
      toast.error("Failed to load crime categories");
    }
  };

  const handlePredict = async () => {
    if (!selectedCrime) {
      toast.error("Please select a crime category");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/predict?crime=${encodeURIComponent(selectedCrime)}&year=${selectedYear}`
      );
      onPredict({
        ...response.data,
        crime: selectedCrime,
        year: selectedYear,
        graphUrl: `http://127.0.0.1:5000/predict/graph?crime=${encodeURIComponent(selectedCrime)}&year=${selectedYear}`,
      });
      toast.success("Prediction generated successfully!");
    } catch (error) {
      console.error("Error predicting:", error);
      toast.error("Failed to generate prediction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Control Panel</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Crime Category</label>
            <Select value={selectedCrime} onValueChange={setSelectedCrime}>
              <SelectTrigger className="glass-card border-primary/20 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Select crime type" />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/20">
                {crimes.map((crime) => (
                  <SelectItem key={crime} value={crime}>
                    {crime}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Year</label>
              <span className="text-2xl font-bold text-primary glow-text">{selectedYear}</span>
            </div>
            <Slider
              value={[selectedYear]}
              onValueChange={(value) => setSelectedYear(value[0])}
              min={2011}
              max={2026}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2011</span>
              <span>2026</span>
            </div>
          </div>

          <Button
            onClick={handlePredict}
            disabled={isLoading || !selectedCrime}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground hover-glow font-semibold py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Predicting...
              </>
            ) : (
              "Generate Prediction"
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
