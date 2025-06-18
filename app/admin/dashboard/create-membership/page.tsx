'use client'
import React, { useEffect, useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Globe, GraduationCap, Star, Image, MapPin } from 'lucide-react';
import { API_URL } from '@/app/services/api_url';
import api from '@/app/services/api';

interface Country {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: string;
  slug: string;
  status: string;
  universities: University[];
  why_choose_reasons: WhyChooseReason[];
}

interface University {
  id: number;
  title: string;
  logo: string;
  country: number;
}

interface WhyChooseReason {
  id: number;
  title: string;
  description: string;
  icon: string;
  country: number;
}

interface FormDataType {
  title: string;
  subtitle: string;
  description: string;
  image: string | File;
  icon: string | File;
  slug: string;
  country: string | number;
  logo: string | File;
}

type EditingItem = Country | University | WhyChooseReason | null;

const StudyAbroadCMS = () => {
  const [activeTab, setActiveTab] = useState('countries');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<EditingItem>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample data
  const [countries, setCountries] = useState<Country[]>([
    {
      id: 1,
      title: "Study in",
      subtitle: "Australia",
      description: "Australia offers world-class education with a focus on innovation and research. Known for its beautiful landscapes and multicultural environment.",
      image: "/api/placeholder/400/300",
      icon: "/api/placeholder/100/100",
      slug: "study-in-australia",
      status: "Published",
      universities: [],
      why_choose_reasons: []
    },
    {
      id: 2,
      title: "Study in",
      subtitle: "United States",
      description: "The United States takes pride in its technical development, and it has ensured that all levels of education are well-equipped with cutting-edge equipment.",
      image: "/api/placeholder/400/300",
      icon: "/api/placeholder/100/100",
      slug: "study-in-usa",
      status: "Published",
      universities: [],
      why_choose_reasons: []
    },
    {
      id: 3,
      title: "Study in",
      subtitle: "Canada",
      description: "Canada provides high-quality education with affordable tuition fees and excellent post-graduation opportunities in a safe, welcoming environment.",
      image: "/api/placeholder/400/300",
      icon: "/api/placeholder/100/100",
      slug: "study-in-canada",
      status: "Draft",
      universities: [],
      why_choose_reasons: []
    }
  ]);

  const [universities, setUniversities] = useState<University[]>([
    { id: 1, title: "University of Melbourne", logo: "/api/placeholder/100/100", country: 1 },
    { id: 2, title: "Harvard University", logo: "/api/placeholder/100/100", country: 2 },
    { id: 3, title: "University of Toronto", logo: "/api/placeholder/100/100", country: 3 }
  ]);

  const [whyChooseReasons, setWhyChooseReasons] = useState<WhyChooseReason[]>([
    {
      id: 1,
      title: "GLOBALLY RANKING INSTITUTIONS",
      description: "36 of Australian Universities make it to the top 1000 list released by QS for World University Ranking 2021. Seven of these are ranked among the top 100 world universities.",
      icon: "/api/placeholder/100/100",
      country: 1
    },
    {
      id: 2,
      title: "RESEARCH OPPORTUNITIES",
      description: "Access to cutting-edge research facilities and opportunities to work with world-renowned faculty members.",
      icon: "/api/placeholder/100/100",
      country: 2
    }
  ]);

  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    icon: '',
    slug: '',
    country: '',
    logo: ''
  });

  const openModal = (type: string, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        title: type === 'country' ? 'Study in' : '',
        subtitle: '',
        description: '',
        image: '',
        icon: '',
        slug: '',
        country: '',
        logo: ''
      });
    }
    setShowModal(true);
  };

  const getCountries = async () => {
    const response = await api.get (API_URL.COUNTRIES.GET_COUNTRIES);
    const data = await response.data
    setCountries(data);
  }

  const getUniversities = async () => {
    const response = await api.get(API_URL.UNIVERSITIES.GET_UNIVERSITIES);
    const data = await response.data;
    setUniversities(data);
  }

  const getWhyChooseReasons = async () => {
    const response = await api.get(API_URL.WHY_CHOOSE_REASONS.GET_WHY_CHOOSE_REASONS);
    const data = await response.data;
    setWhyChooseReasons(data);
  }

  useEffect(() => {
    getCountries();
    getUniversities();
    getWhyChooseReasons();
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      icon: '',
      slug: '',
      country: '',
      logo: ''
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (modalType === 'country') {
        if (editingItem) {
          const response = await api.patch(API_URL.COUNTRIES.PATCH_COUNTRY(editingItem.id), formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setCountries(countries.map(c => c.id === editingItem.id ? response.data : c));
        } else {
          const response = await api.post(API_URL.COUNTRIES.POST_COUNTRY, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setCountries([...countries, response.data]);
        }
      } else if (modalType === 'university') {
        if (editingItem) {
          const response = await api.patch(API_URL.UNIVERSITIES.PATCH_UNIVERSITY(editingItem.id), formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setUniversities(universities.map(u => u.id === editingItem.id ? response.data : u));
        } else {
          const response = await api.post(API_URL.UNIVERSITIES.POST_UNIVERSITY, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setUniversities([...universities, response.data]);
        }
      } else if (modalType === 'reason') {
        if (editingItem) {
          const response = await api.patch(API_URL.WHY_CHOOSE_REASONS.PATCH_WHY_CHOOSE_REASON(editingItem.id), formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setWhyChooseReasons(whyChooseReasons.map(r => r.id === editingItem.id ? response.data : r));
        } else {
          const response = await api.post(API_URL.WHY_CHOOSE_REASONS.POST_WHY_CHOOSE_REASON, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setWhyChooseReasons([...whyChooseReasons, response.data]);
        }
      }
      
      closeModal();
    } catch (err) {
      console.log(err);
      // setError(err.response?.data?.message || 'An error occurred while saving the data');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: number, type: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (type === 'country') {
        await api.delete(API_URL.COUNTRIES.DELETE_COUNTRY(id));
        setCountries(countries.filter(c => c.id !== id));
      } else if (type === 'university') {
        await api.delete(API_URL.UNIVERSITIES.DELETE_UNIVERSITY(id));
        setUniversities(universities.filter(u => u.id !== id));
      } else if (type === 'reason') {
        await api.delete(API_URL.WHY_CHOOSE_REASONS.DELETE_WHY_CHOOSE_REASON(id));
        setWhyChooseReasons(whyChooseReasons.filter(r => r.id !== id));
      }
    } catch (err) {
      console.log(err);
      
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryName = (countryId: number) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.subtitle : 'Unknown';
  };

  const filteredData = () => {
    if (activeTab === 'countries') {
      return countries.filter(c => 
        c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'universities') {
      return universities.filter(u => 
        u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCountryName(u.country).toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return whyChooseReasons.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCountryName(r.country).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Study Abroad</h1>
        <p className="text-purple-100">Manage your study abroad content</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('countries')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'countries'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Countries ({countries.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('universities')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'universities'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Universities ({universities.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reasons')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'reasons'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Why Choose ({whyChooseReasons.length})</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
            />
          </div>
          <button
            onClick={() => openModal(activeTab.slice(0, -1) === 'countrie' ? 'country' : activeTab.slice(0, -1) === 'universitie' ? 'university' : 'reason')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab.slice(0, -1) === 'countrie' ? 'Country' : activeTab.slice(0, -1) === 'universitie' ? 'University' : 'Reason'}</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="space-y-4">
          {filteredData().map((item: any) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Image/Icon */}
                  <div className="flex space-x-2">
                    {(item.image || item.logo || item.icon) && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {activeTab === 'countries' && item.image ? (
                          <img src={item.image} alt={item.subtitle} className="w-full h-full object-cover" />
                        ) : activeTab === 'universities' && item.logo ? (
                          <img src={item.logo} alt={item.title} className="w-full h-full object-cover" />
                        ) : item.icon ? (
                          <img src={item.icon} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    )}
                    {activeTab === 'countries' && item.icon && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img src={item.icon} alt={`${item.subtitle} icon`} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {activeTab === 'countries' ? `${item.title} ${item.subtitle}` : item.title}
                      </h3>
                      {activeTab === 'countries' && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      )}
                      {(activeTab === 'universities' || activeTab === 'reasons') && (
                        <span className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{getCountryName(item.country)}</span>
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    
                    {activeTab === 'countries' && (
                      <div className="text-xs text-gray-500">
                        Slug: {item.slug} • ID: {item.id}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openModal(activeTab.slice(0, -1) === 'countrie' ? 'country' : activeTab.slice(0, -1) === 'universitie' ? 'university' : 'reason', item)}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteItem(item.id, activeTab.slice(0, -1) === 'countrie' ? 'country' : activeTab.slice(0, -1) === 'universitie' ? 'university' : 'reason')}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredData().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {activeTab === 'countries' ? <Globe className="w-12 h-12 mx-auto" /> :
               activeTab === 'universities' ? <GraduationCap className="w-12 h-12 mx-auto" /> :
               <Star className="w-12 h-12 mx-auto" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} found
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search terms.' : `Get started by adding your first ${activeTab.slice(0, -1)}.`}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingItem ? 'Edit' : 'Add'} {modalType === 'country' ? 'Country' : modalType === 'university' ? 'University' : 'Why Choose Reason'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {modalType === 'country' && (
                <>
                  <div className="grid grid-cols-2 gap-4 ">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Country)</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                      <input
                        type="file"
                        onChange={(e) => setFormData({...formData, image: e.target.files?.[0] ?? ''})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                      <input
                        type="file"
                        onChange={(e) => setFormData({...formData, icon: e.target.files?.[0] ?? ''})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {modalType === 'university' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input
                      type="file"
                      onChange={(e) => setFormData({...formData, logo: e.target.files?.[0] ?? ''})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={formData.country?.toString()}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a country</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id.toString()}>{country.subtitle}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {modalType === 'reason' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                    <input
                      type="file"
                      onChange={(e) => setFormData({...formData, icon: e.target.files?.[0] ?? ''})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={formData.country?.toString()}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a country</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id.toString()}>{country.subtitle}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add error message display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Add loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyAbroadCMS;