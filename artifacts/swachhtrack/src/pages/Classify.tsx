import { useState, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Camera, CheckCircle2, AlertCircle, MapPin, X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ClassificationResultCategory } from "@workspace/api-client-react";

export default function Classify() {
  const { user, updatePoints } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [wasteImage, setWasteImage] = useState<string | null>(null);
  const [binImage, setBinImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Mock Result Data
  const classificationResult = {
    category: "plastic" as ClassificationResultCategory,
    itemName: "Crushed Water Bottle",
    confidence: 94.2,
    binColor: "Blue Bin",
    disposalInstructions: "Ensure it is completely empty. Crush it to save space before throwing it in the blue dry waste bin.",
    points: 15
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isVerification = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (!isVerification) {
        setWasteImage(base64);
      } else {
        setBinImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeWaste = () => {
    if (!wasteImage) return;
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(2);
    }, 2000);
  };

  const getLocation = () => {
    // Mock GPS location retrieval
    setTimeout(() => {
      setLocation({ lat: 19.0760, lng: 72.8777 }); // Mumbai coords
      toast({
        title: "Location Verified",
        description: "You are at a valid disposal zone.",
      });
    }, 1000);
  };

  const verifyDisposal = () => {
    if (!binImage) return;
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
      updatePoints(classificationResult.points);
    }, 2000);
  };

  const resetFlow = () => {
    setStep(1);
    setWasteImage(null);
    setBinImage(null);
    setLocation(null);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold">Smart Waste Classification</h1>
          <p className="text-muted-foreground mt-2">Let our AI help you segregate and earn rewards.</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between relative mb-12 max-w-lg mx-auto">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-secondary/20 -z-10 -translate-y-1/2 rounded-full" />
          <div className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500" 
               style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
          
          {[
            { num: 1, label: "Upload Image" },
            { num: 2, label: "AI Result" },
            { num: 3, label: "Verify Disposal" }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 bg-background px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                step >= s.num ? 'bg-primary border-primary text-white' : 'bg-background border-muted-foreground/30 text-muted-foreground'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: UPLOAD */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-border/50 shadow-md">
                <CardContent className="p-8">
                  {!wasteImage ? (
                    <div 
                      className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => fileInputRef1.current?.click()}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef1}
                        onChange={(e) => handleImageUpload(e, false)}
                      />
                      <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                        <Upload className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Tap to upload waste image</h3>
                      <p className="text-muted-foreground text-sm">Support JPG, PNG files. Ensure clear lighting.</p>
                      <Button className="mt-6 pointer-events-none hover-elevate">Browse Files</Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/5 flex items-center justify-center">
                        <img src={wasteImage} alt="Uploaded waste" className="max-h-full max-w-full object-contain" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-4 right-4 rounded-full"
                          onClick={() => setWasteImage(null)}
                          disabled={isAnalyzing}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button 
                        className="w-full h-14 text-lg font-bold shadow-lg rounded-xl hover-elevate" 
                        onClick={analyzeWaste}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing via AI...</>
                        ) : (
                          "Analyze Image"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: AI RESULT & VERIFICATION */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Result Card */}
              <Card className="border-2 border-blue-200 bg-blue-50/50 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 bg-black/5 relative h-48 md:h-auto">
                    <img src={wasteImage!} alt="Analyzed waste" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-background/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md border border-border shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {classificationResult.confidence}% Match
                    </div>
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 bg-blue-100 text-blue-700">
                      {classificationResult.category} Waste
                    </div>
                    <h2 className="text-2xl font-display font-bold mb-2">{classificationResult.itemName}</h2>
                    
                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm mt-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">Throw in {classificationResult.binColor}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{classificationResult.disposalInstructions}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Verification Section */}
              <Card className="border-border/50 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Verification Step (Required for Points)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-accent/30 text-sm">
                    <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    <p>To prevent fraud, please take a photo of the item <strong>actually being thrown</strong> into the correct municipality bin. GPS location must be enabled.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Button 
                      variant={location ? "outline" : "secondary"} 
                      className={`h-14 rounded-xl flex items-center gap-2 ${location ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-50' : ''}`}
                      onClick={getLocation}
                    >
                      {location ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                      {location ? "Location Verified" : "Verify GPS Location"}
                    </Button>
                    
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      className="hidden" 
                      ref={fileInputRef2}
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                    <Button 
                      variant={binImage ? "outline" : "secondary"}
                      className={`h-14 rounded-xl flex items-center gap-2 ${binImage ? 'border-green-500 text-green-700 bg-green-50 hover:bg-green-50' : ''}`}
                      onClick={() => fileInputRef2.current?.click()}
                    >
                      {binImage ? <CheckCircle2 className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                      {binImage ? "Photo Captured" : "Take Bin Photo"}
                    </Button>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-bold shadow-lg rounded-xl hover-elevate mt-4" 
                    disabled={!location || !binImage || isVerifying}
                    onClick={verifyDisposal}
                  >
                    {isVerifying ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                    ) : (
                      "Submit Verification"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-card border border-border/50 rounded-3xl p-10 shadow-xl"
            >
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </motion.div>
              
              <h2 className="text-3xl font-display font-bold mb-2">Disposal Verified!</h2>
              <p className="text-muted-foreground text-lg mb-8">Thank you for segregating smart and recycling right.</p>
              
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 max-w-xs mx-auto mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                <div className="relative z-10">
                  <div className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Earned</div>
                  <div className="text-5xl font-display font-black text-primary">+{classificationResult.points}</div>
                  <div className="text-sm text-primary font-medium mt-1">Green Points</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="h-12 px-6 rounded-xl hover-elevate" onClick={resetFlow}>
                  Classify Another Item
                </Button>
                <Link href="/dashboard">
                  <Button className="h-12 px-6 rounded-xl shadow-lg hover-elevate w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
