import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, AlertCircle, X } from "lucide-react";

interface Prediction {
  crime: string;
  year: number;
  predicted_cases?: number;
  rmse?: number;
  graphUrl?: string;
}

interface ResultsDisplayProps {
  predictions: Prediction[];
  onClear: () => void;
}

export const ResultsDisplay = ({ predictions, onClear }: ResultsDisplayProps) => {
  if (predictions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full"
      >
        <Card className="glass-card p-12 text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            No predictions yet. Select a crime category and year to begin.
          </p>
        </Card>
      </motion.div>
    );
  }

  const latestPrediction = predictions[predictions.length - 1];
  
  // Transform predictions for chart
  const chartData = predictions.map((p, idx) => ({
    name: `${p.crime.substring(0, 15)}... (${p.year})`,
    cases: p.predicted_cases || 0,
    index: idx,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Prediction Results
        </h2>
        {predictions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="glass-card border-secondary/50 hover:border-secondary hover:bg-secondary/10"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-card p-6">
          <p className="text-sm text-muted-foreground mb-2">Predicted Cases</p>
          <p className="text-4xl font-bold text-primary glow-text">
            {latestPrediction.predicted_cases?.toLocaleString() || "N/A"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {latestPrediction.crime} ({latestPrediction.year})
          </p>
        </Card>

        {latestPrediction.rmse && (
          <Card className="glass-card p-6">
            <p className="text-sm text-muted-foreground mb-2">Model Accuracy (RMSE)</p>
            <p className="text-4xl font-bold text-secondary glow-text">
              {latestPrediction.rmse.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Lower is better</p>
          </Card>
        )}
      </div>

      {/* Chart */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Prediction Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cases" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 5 }}
              activeDot={{ r: 8 }}
              name="Predicted Cases"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Backend Graph */}
      {latestPrediction.graphUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Model Visualization</h3>
            <img
              src={latestPrediction.graphUrl}
              alt="Prediction Graph"
              className="w-full rounded-lg border border-primary/20"
              onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.alt = "Graph failed to load";
              }}
            />
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};
