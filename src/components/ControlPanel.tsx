import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Loader2, BarChart3, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/lib/api";

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
      console.log("Fetching crimes from:", API_ENDPOINTS.crimes);
      const response = await axios.get(API_ENDPOINTS.crimes);
      console.log("Crimes response:", response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        setCrimes(response.data);
        setSelectedCrime(response.data[0]);
        toast.success(`Loaded ${response.data.length} crime categories`);
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("No crime categories available");
      }
    } catch (error: any) {
      console.error("Error fetching crimes:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed to load crime categories: ${errorMessage}`, {
        description: "Make sure your Flask backend is running on http://127.0.0.1:5000",
      });
    }
  };

  const handlePredict = async () => {
    if (!selectedCrime) {
      toast.error("Please select a crime category");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Predicting for:", selectedCrime, selectedYear);
      const predictUrl = API_ENDPOINTS.predict(selectedCrime, selectedYear);
      console.log("Predict URL:", predictUrl);
      
      const response = await axios.get(predictUrl);
      console.log("Prediction response:", response.data);
      
      onPredict({
        ...response.data,
        crime: selectedCrime,
        year: selectedYear,
        graphUrl: API_ENDPOINTS.predictGraph(selectedCrime, selectedYear),
      });
      toast.success("Prediction generated successfully!");
    } catch (error: any) {
      console.error("Error predicting:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed to generate prediction: ${errorMessage}`, {
        description: "Check console for details",
      });
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
            {crimes.length === 0 ? (
              <div className="glass-card border-destructive/50 p-4 rounded-md">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Backend not connected</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ensure Flask is running on http://127.0.0.1:5000
                </p>
              </div>
            ) : (
              <Select value={selectedCrime} onValueChange={setSelectedCrime}>
                <SelectTrigger className="glass-card border-primary/20 hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="Select crime type" />
                </SelectTrigger>
                <SelectContent>
                  {crimes.map((crime) => (
                    <SelectItem key={crime} value={crime}>
                      {crime}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
