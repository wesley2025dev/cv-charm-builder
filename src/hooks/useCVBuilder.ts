import { useState, useEffect } from "react";
import { CVData, emptyCVData, Experience, Education, Reference } from "@/types/cv";
import { TemplateId } from "@/types/templates";

const STORAGE_KEY = "cv-builder-data";
const TEMPLATE_KEY = "cv-builder-template";
const STEP_KEY = "cv-builder-step";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function useCVBuilder() {
  const [cvData, setCVData] = useState<CVData>(() => loadFromStorage(STORAGE_KEY, emptyCVData));
  const [currentStep, setCurrentStep] = useState(() => loadFromStorage(STEP_KEY, 0));
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(() => loadFromStorage(TEMPLATE_KEY, "modern"));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem(STEP_KEY, JSON.stringify(currentStep));
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(selectedTemplate));
  }, [selectedTemplate]);

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

  const addReference = (reference: Omit<Reference, "id">) => {
    const newReference: Reference = {
      ...reference,
      id: crypto.randomUUID(),
    };
    setCVData((prev) => ({
      ...prev,
      references: [...prev.references, newReference],
    }));
  };

  const updateReference = (id: string, updates: Partial<Reference>) => {
    setCVData((prev) => ({
      ...prev,
      references: prev.references.map((ref) =>
        ref.id === id ? { ...ref, ...updates } : ref
      ),
    }));
  };

  const removeReference = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      references: prev.references.filter((ref) => ref.id !== id),
    }));
  };

  const setCVDataDirectly = (data: CVData) => {
    setCVData(data);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
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
    addReference,
    updateReference,
    removeReference,
    setCVDataDirectly,
    nextStep,
    prevStep,
    goToStep,
  };
}
