import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useSubmitReport, useGetReports } from "@workspace/api-client-react";
import { AlertTriangle, MapPin, Camera, CheckCircle2, Clock, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Wrench },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
};

export default function Reports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: reports = [], refetch } = useGetReports();
  const { mutate: submitReport, isPending } = useSubmitReport({
    mutation: {
      onSuccess: () => {
        toast({ title: "Report Submitted!", description: "Municipal officers have been notified. Thank you for helping keep our city clean." });
        setLocation("");
        setDescription("");
        setSubmitted(true);
        refetch();
        setTimeout(() => setSubmitted(false), 3000);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to submit report. Please try again.", variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !description) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    submitReport({ data: { location, description, userId: user?.id } });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 font-medium text-sm border border-amber-200 mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>Report an Issue</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Waste Issue Reporting</h1>
          <p className="text-muted-foreground text-lg">Help keep your neighbourhood clean by reporting garbage problems to municipal authorities.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit a New Report</CardTitle>
            <CardDescription>Fill in the details about the waste issue. Municipal officers will review and act on it.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-700">Report Submitted!</h3>
                <p className="text-muted-foreground mt-2">Thank you for helping keep your community clean.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" /> Location *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="e.g. Andheri East, near Metro Station"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button type="button" variant="outline" className="flex-shrink-0" onClick={() => {
                      setLocation("Current Location (GPS)");
                      toast({ title: "Location Detected", description: "Using your current GPS location." });
                    }}>
                      <MapPin className="w-4 h-4 mr-1" /> GPS
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the waste issue (e.g. overflowing dustbin, garbage dump, illegal disposal...)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-muted-foreground" /> Photo (Optional)
                  </Label>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload a photo of the issue</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit Report"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Reports</h2>
          <div className="space-y-4">
            {reports.slice(0, 10).map((report) => {
              const status = statusConfig[report.status] ?? statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-medium text-sm truncate">{report.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(report.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          {report.resolvedAt && ` · Resolved: ${new Date(report.resolvedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                        </p>
                      </div>
                      <Badge className={`${status.color} flex items-center gap-1 flex-shrink-0 text-xs`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
