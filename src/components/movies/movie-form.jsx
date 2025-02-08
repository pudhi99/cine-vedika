"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Helper function to ensure consistent date format
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString();
};

const formSchema = z.object({
  file: z.any().refine((file) => file?.name?.endsWith(".json"), {
    message: "File must be a JSON document",
  }),
});

export default function MovieForm() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setStats(null);

      const formData = new FormData();
      formData.append("file", data.file);

      const response = await fetch("/api/movies", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to upload");

      setStats(result.updates);
      toast({
        title: "Success",
        description: result.message,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process movies data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="file"
            accept=".json"
            onChange={(e) => form.setValue("file", e.target.files[0])}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Upload JSON"}
          </Button>
        </form>
      </Form>
      {stats && (
        <Alert>
          <AlertDescription>
            <div className="space-y-1">
              <p>✨ New movies created: {stats.created}</p>
              <p>🔄 Existing movies updated: {stats.updated}</p>
              {stats.errors > 0 && (
                <p className="text-red-500">
                  ❌ Errors encountered: {stats.errors}
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
