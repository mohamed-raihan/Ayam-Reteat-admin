"use client";

import { FC, useEffect, useState } from "react";
import { X, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import api from "@/app/services/api";
import { API_URL } from "@/app/services/api_url";

interface Resort {
  id: string;
  uuid: string;
  name: string;
  location: string;
  place: {
    id: string;
    name: string;
  };
  image: string;
  price: string;
  is_featured: boolean;
}

interface Place {
  id: string;
  name: string;
}

interface ResortFormData {
  id: string;
  name: string;
  location: string;
  place: Place;
  image: File | null;
  price: string;
  is_featured: boolean;
}

interface FormDataSection {
  id: string;
  logo: File | null;
  title: string;
  image: File | null;
  description: string;
  resort: string;
  additionalImages: File[];
}

interface WelcomeSection {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  image_url: File | null;
  form_data: string;
}

interface WhyChooseSection {
  id: string;
  title: string;
  description: string;
  image_url: File | null;
  form_data: string;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResortFormData & { place_id: string }) => Promise<{ data: { id: string } }>;
  resortUuid: Resort | null;
}


export const FormModal: FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  resortUuid,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form Data States
  const [basicFormData, setBasicFormData] = useState<ResortFormData>({
    id: "",
    name: "",
    location: "",
    place: { id: "", name: "" },
    image: null,
    price: "",
    is_featured: false,
  });

  const [formDataSection, setFormDataSection] = useState<FormDataSection>({
    id: "",
    logo: null,
    title: "",
    image: null,
    description: "",
    resort: "",
    additionalImages: [],
  });

  const [welcomeSection, setWelcomeSection] = useState<WelcomeSection>({
    id: "",
    title: "",
    highlight: "",
    subtitle: "",
    image_url: null,
    form_data: "",
  });

  const [whyChooseSection, setWhyChooseSection] = useState<WhyChooseSection>({
    id: "",
    title: "",
    description: "",
    image_url: null,
    form_data: "",
  });

  // Response UUIDs
  const [resortResponseUuid, setResortResponseUuid] = useState("");
  const [formDataUuid, setFormDataUuid] = useState("");

  // Add new state to track field updates for each section
  const [isFieldsUpdated, setIsFieldsUpdated] = useState({
    basicForm: false,
    formData: false,
    welcome: false,
    whyChoose: false
  });

  useEffect(() => {
    if (resortUuid) {
      setBasicFormData({
        id: resortUuid.id || "",
        name: resortUuid.name || "",
        location: resortUuid.location || "",
        place: {
          id: resortUuid.place.id || "",
          name: resortUuid.place.name || "",
        },
        image: null,
        price: resortUuid.price || "",
        is_featured: resortUuid.is_featured || false,
      });
    }
  }, [resortUuid]);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      if (e.target.files?.[0]) {
        setFormDataSection(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, e.target.files[0]]
        }));
      }
    };
    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Step 1: Create Resort
      let place_id: string;
      if (resortUuid) {
        place_id = resortUuid.place.id;
      } else {
        const placeResponse = await api.post(API_URL.PLACE.CREATE_PLACE, {
          name: basicFormData.place.name,
          location: basicFormData.location,
        });
        place_id = placeResponse.data.id;
      }

      console.log(basicFormData,place_id);
      const resortResponse = await onSubmit({ ...basicFormData, place_id });
      console.log(resortResponse);
      setResortResponseUuid(resortResponse.data.id);
      handleNextStep();

    } catch (error) {
      console.error("Error in step 1:", error);
    }
  };

  const handleFormDataSubmit = async () => {
    try {
      console.log(resortResponseUuid);
      // Step 2: Submit Form Data
      const formData = new FormData();
      formData.append('logo', formDataSection.logo as File);
      formData.append('title', formDataSection.title);
      formData.append('image', formDataSection.image as File);
      formData.append('description', formDataSection.description);
      formData.append('resort', resortResponseUuid);

      let formDataResponse;
      if (formDataSection.id) {
        // If id exists, use PATCH request
        formDataResponse = await api.patch(API_URL.RESORT_FORMDATA.EDIT_RESORT_FORMDATA(formDataSection.id), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // If no id, use POST request for new creation
        formDataResponse = await api.post(API_URL.RESORT_FORMDATA.CREATE_RESORT_FORMDATA, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      
      console.log(formDataResponse);
      setFormDataUuid(formDataResponse.data.id);

      // Upload additional images
      if (formDataSection.additionalImages.length > 0) {
        const imagesFormData = new FormData();
        formDataSection.additionalImages.forEach(image => {
          imagesFormData.append('images', image);
        });
        await api.post(API_URL.RESORT_FORMDATA.IMAGE_UPLOAD(formDataResponse.data.id), imagesFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      handleNextStep();
    } catch (error) {
      console.error("Error in step 2:", error);
    }
  };

  // const handleWelcomeSectionSubmit = async () => {
  //   try {
  //     // Step 3: Submit Welcome Section
  //     await api.post(API_URL.RESORT_WELLCOME.CREATE_RESORT_WELLCOME, {
  //       ...welcomeSection,
  //       form_data: formDataUuid
  //     },{
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     handleNextStep();
  //   } catch (error) {
  //     console.error("Error in step 3:", error);
  //   }
  // };

  const handleWelcomeSectionSubmit = async () => {
    try {
      // Step 3: Submit Welcome Section
      const formData = new FormData();
      formData.append('title', welcomeSection.title);
      formData.append('highlight', welcomeSection.highlight);
      formData.append('subtitle', welcomeSection.subtitle);
      if (welcomeSection.image_url) {
        formData.append('image_url', welcomeSection.image_url);
      }
      formData.append('form_data', formDataUuid);
  
      await api.post(API_URL.RESORT_WELLCOME.CREATE_RESORT_WELLCOME, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleNextStep();
    } catch (error) {
      console.error("Error in step 3:", error);
    }
  };

  // const handleWhyChooseSectionSubmit = async () => {
  //   try {
  //     // Step 4: Submit Why Choose Section
  //     await api.post(API_URL.RESORT_WHYCHOOSE.CREATE_RESORT_WHYCHOOSE, {
  //       ...whyChooseSection,
  //       form_data: formDataUuid
  //     },{
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     onClose();
  //   } catch (error) {
  //     console.error("Error in step 4:", error);
  //   }
  // };

  const handleWhyChooseSectionSubmit = async () => {
    try {
      console.log(whyChooseSection, "whyChooseSection");
      console.log(formDataUuid, "formDataUuid");
      // Step 4: Submit Why Choose Section
      if(whyChooseSection.id){
        const formData = new FormData();
        formData.append('title', whyChooseSection.title);
        formData.append('description', whyChooseSection.description);
        if (whyChooseSection.image_url) {
          formData.append('image_url', whyChooseSection.image_url);
        }
        formData.append('form_data', formDataUuid); 

        const response = await api.patch(API_URL.RESORT_WHYCHOOSE.EDIT_RESORT_WHYCHOOSE(whyChooseSection.id), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }); 
        console.log(response, "response");
      }else{
        const formData = new FormData();
        formData.append('title', whyChooseSection.title);
        formData.append('description', whyChooseSection.description);
        if (whyChooseSection.image_url) {
          formData.append('image_url', whyChooseSection.image_url);
        }
        formData.append('form_data', formDataUuid);     

        const response = await api.post(API_URL.RESORT_WHYCHOOSE.CREATE_RESORT_WHYCHOOSE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response, "response");
      }
    } catch (error) {
      console.error("Error in step 4:", error);
    }
  };

  // Common change handlers for each section
  const handleBasicFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setBasicFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setIsFieldsUpdated(prev => ({ ...prev, basicForm: true }));
  };

  const handleBasicFormPlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBasicFormData(prev => ({
      ...prev,
      place: { ...prev.place, name: value },
    }));
    setIsFieldsUpdated(prev => ({ ...prev, basicForm: true }));
  };

  const handleBasicFormFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setBasicFormData(prev => ({
        ...prev,
        image: e.target.files![0],
      }));
      setIsFieldsUpdated(prev => ({ ...prev, basicForm: true }));
    }
  };

  const handleFormDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDataSection(prev => ({
      ...prev,
      [name]: value,
    }));
    setIsFieldsUpdated(prev => ({ ...prev, formData: true }));
  };

  const handleFormDataFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormDataSection(prev => ({
        ...prev,
        [name]: files[0],
      }));
      setIsFieldsUpdated(prev => ({ ...prev, formData: true }));
    }
  };

  const handleWelcomeSectionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setWelcomeSection(prev => ({
      ...prev,
      [name]: value,
    }));
    setIsFieldsUpdated(prev => ({ ...prev, welcome: true }));
  };

  const handleWelcomeSectionFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      setWelcomeSection(prev => ({
        ...prev,
        image_url: e.target.files![0],
      }));
      setIsFieldsUpdated(prev => ({ ...prev, welcome: true }));
    }
  };

  const handleWhyChooseSectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWhyChooseSection(prev => ({
      ...prev,
      [name]: value,
    }));
    setIsFieldsUpdated(prev => ({ ...prev, whyChoose: true }));
  };

  const handleWhyChooseSectionFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      setWhyChooseSection(prev => ({
        ...prev,
        image_url: e.target.files![0],
      }));
      setIsFieldsUpdated(prev => ({ ...prev, whyChoose: true }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Resort Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resort Name
              </label>
              <input
                type="text"
                name="name"
                value={basicFormData.name}
                onChange={handleBasicFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={basicFormData.location}
                onChange={handleBasicFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Place
              </label>
              <input
                type="text"
                value={basicFormData.place.name}
                onChange={handleBasicFormPlaceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resort Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBasicFormFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required={!resortUuid}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={basicFormData.price}
                onChange={handleBasicFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={basicFormData.is_featured}
                onChange={handleBasicFormChange}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                Featured Resort
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resort Form Data</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleFormDataFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formDataSection.title}
                onChange={handleFormDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFormDataFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formDataSection.description}
                onChange={handleFormDataChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Images
              </label>
              <div className="space-y-2">
                {formDataSection.additionalImages.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Image {index + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormDataSection((prev) => ({
                          ...prev,
                          additionalImages: prev.additionalImages.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-md"
                >
                  <Plus className="h-4 w-4" />
                  Add Image
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Welcome Section</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={welcomeSection.title}
                onChange={handleWelcomeSectionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Highlight
              </label>
              <input
                type="text"
                name="highlight"
                value={welcomeSection.highlight}
                onChange={handleWelcomeSectionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={welcomeSection.subtitle}
                onChange={handleWelcomeSectionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleWelcomeSectionFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
              {welcomeSection.image_url && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected file: {welcomeSection.image_url.name}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Choose Section</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={whyChooseSection.title}
                onChange={handleWhyChooseSectionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={whyChooseSection.description}
                onChange={handleWhyChooseSectionChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleWhyChooseSectionFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
              {whyChooseSection.image_url && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected file: {whyChooseSection.image_url.name}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  // const handleStepSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   switch (currentStep) {
  //     case 1:
  //       await handleSubmit(e);
  //       break;
  //     case 2:
  //       await handleFormDataSubmit();
  //       break;
  //     case 3:
  //       await handleWelcomeSectionSubmit();
  //       break;
  //     case 4:
  //       await handleWhyChooseSectionSubmit();
  //       break;
  //   }
  // };

  console.log(isFieldsUpdated, "isFieldsUpdated");

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    switch (currentStep) {
      case 1:
        if (isFieldsUpdated.basicForm) {
          await handleSubmit(e);
        } else {
          handleNextStep();
        }
        break;
        
      case 2:
        if (isFieldsUpdated.formData) {
          await handleFormDataSubmit();
        } else {
          handleNextStep();
        }
        break;
        
      case 3:
        if (isFieldsUpdated.welcome) {
          await handleWelcomeSectionSubmit();
        } else {
          handleNextStep();
        }
        break;
        
      case 4:
        if (isFieldsUpdated.whyChoose) {
          await handleWhyChooseSectionSubmit();
        } else {
          onClose();
        }
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {resortUuid ? "Edit Resort" : "Add New Resort"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-1/4 text-center ${
                  step === currentStep
                    ? "text-violet-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Step {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleStepSubmit} className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
            )}
            <div className="ml-auto flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md"
              >
                {currentStep === totalSteps ? (
                  "Finish"
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
