import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Loader2, Download, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkExperience {
  position: string;
  company: string;
  duration: string;
  description: string;
}

const ResumeForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    summary: "",
    skills: "",
    degree: "",
    institution: "",
    graduationYear: "",
  });

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    { position: "", company: "", duration: "", description: "" }
  ]);

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, { position: "", company: "", duration: "", description: "" }]);
  };

  const removeWorkExperience = (index: number) => {
    if (workExperiences.length > 1) {
      setWorkExperiences(workExperiences.filter((_, i) => i !== index));
    }
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = workExperiences.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setWorkExperiences(updated);
  };

  const checkPDFExists = async (fileName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.storage
        .from('pdfs')
        .list('', {
          search: fileName
        });
      
      return !error && data && data.length > 0;
    } catch (error) {
      console.log('Error checking PDF existence:', error);
      return false;
    }
  };

  const pollForPDF = async (fileName: string) => {
    setIsPolling(true);
    const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds max
    let attempts = 0;

    const poll = async () => {
      attempts++;
      const pdfExists = await checkPDFExists(fileName);
      
      if (pdfExists) {
        setIsPolling(false);
        setIsLoading(false);
        setIsSuccess(true);
        toast({
          title: "Resume Generated!",
          description: "Your AI-powered resume is ready for download.",
        });
        return;
      }

      if (attempts >= maxAttempts) {
        setIsPolling(false);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Resume generation is taking longer than expected. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Poll again after 2 seconds
      setTimeout(poll, 2000);
    };

    poll();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = [
      'fullName', 'email', 'phone', 'jobTitle', 'summary', 'skills', 
      'degree', 'institution', 'graduationYear'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: "destructive",
        });
        return;
      }
    }

    // Validate work experiences
    for (const exp of workExperiences) {
      if (!exp.position || !exp.company || !exp.duration || !exp.description) {
        toast({
          title: "Missing Work Experience",
          description: "Please fill in all work experience fields.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        workExperiences,
      };

      const response = await fetch('https://platform.copilotgigs.com/webhook-test/600c6682-6936-4147-93f2-bc533422574a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Start polling for PDF instead of fixed timeout
        pollForPDF(formData.fullName);
      } else {
        throw new Error('Failed to generate resume');
      }
    } catch (error) {
      setIsLoading(false);
      setIsPolling(false);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || isPolling) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isPolling ? "Finalizing Your Resume..." : "Generating Your Resume..."}
          </h2>
          <p className="text-gray-600">
            {isPolling ? "Please wait while we prepare your PDF" : "Our AI is crafting your professional resume"}
          </p>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Resume is Ready!</h2>
          <p className="text-gray-600 mb-6">Your AI-generated resume is ready for download</p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            onClick={() => {
              window.open(`https://toyjxqogwsoqmxhedpgj.supabase.co/storage/v1/object/public/pdfs/${formData.fullName}`, '_blank');
            }}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Resume
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Resume</h2>
          <p className="text-gray-600">Fill in your details and let AI craft your perfect resume</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Role/Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    placeholder="Senior Software Engineer"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Professional Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">2</span>
                </div>
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="Brief description of your professional background and key achievements..."
                className="mt-1 min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">3</span>
                </div>
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="skills">Skills (comma separated) *</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                placeholder="JavaScript, React, Node.js, Python, AWS"
                className="mt-1"
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">4</span>
                </div>
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {workExperiences.map((exp, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Experience {index + 1}</h4>
                    {workExperiences.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeWorkExperience(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Position *</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                        placeholder="Software Engineer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Company *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                        placeholder="Tech Corp"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label>Duration *</Label>
                    <Input
                      value={exp.duration}
                      onChange={(e) => updateWorkExperience(index, 'duration', e.target.value)}
                      placeholder="Jan 2020 - Present"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                      placeholder="Describe your key responsibilities and achievements..."
                      className="mt-1"
                    />
                  </div>
                </motion.div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addWorkExperience}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Work Experience
              </Button>
            </CardContent>
          </Card>

          <Separator />

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-sm">5</span>
                </div>
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="degree">Degree *</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    placeholder="Bachelor of Computer Science"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    placeholder="University of Technology"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="graduationYear">Year *</Label>
                <Input
                  id="graduationYear"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                  placeholder="2020"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-8">
            <Button 
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-12 py-3 text-lg"
            >
              Generate Resume
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResumeForm;
