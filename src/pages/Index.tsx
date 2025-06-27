
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeForm from "@/components/ResumeForm";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('resume-form')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ y: [-20, 20, -20] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
            />
            <motion.div 
              animate={{ y: [20, -20, 20] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-32 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-20"
            />
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-40 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-20"
            />
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            AI-Powered Resume Creator
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
          >
            Generate a stunning, HR-Ready Resume in seconds using AI
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              onClick={scrollToForm}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Now
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Input</h3>
              <p className="text-gray-600">
                Fill out your professional details in our intuitive form
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Writing</h3>
              <p className="text-gray-600">
                Our AI crafts professional content tailored to your experience
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Ready</h3>
              <p className="text-gray-600">
                Download your polished, HR-ready resume instantly
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Resume Form Section */}
      {showForm && (
        <motion.div 
          id="resume-form"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-lg"
        >
          <ResumeForm />
        </motion.div>
      )}
    </div>
  );
};

export default Index;
