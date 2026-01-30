import { useState } from "react";
import { CVData, emptyCVData, Experience, Education } from "@/types/cv";
import { TemplateId } from "@/types/templates";

export function useCVBuilder() {
  const [cvData, setCVData] = useState<CVData>(emptyCVData);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("modern");

  const updatePersonalInfo = (field: keyof CVData["personalInfo"], value: string) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addExperience = (experience: Omit<Experience, "id">) => {
    const newExperience: Experience = {
      ...experience,
      id: crypto.randomUUID(),
    };
    setCVData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = (education: Omit<Education, "id">) => {
    const newEducation: Education = {
      ...education,
      id: crypto.randomUUID(),
    };
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !cvData.skills.includes(skill.trim())) {
      setCVData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const setCVDataDirectly = (data: CVData) => {
    setCVData(data);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

  return {
    cvData,
    currentStep,
    selectedTemplate,
    setSelectedTemplate,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    setCVDataDirectly,
    nextStep,
    prevStep,
    goToStep,
  };
}
