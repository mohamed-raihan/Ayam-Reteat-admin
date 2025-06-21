import { useState, ChangeEvent } from 'react';
import api from '@/app/services/api';
import { API_URL } from '@/app/services/api_url';

interface SeoModalProps {
  initialData?: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: File | null;
    icon?: File | null;
    slug?: string;
    meta_description?: string;
    meta_keywords?: string;
    canonical_url?: string;
    h1_tag?: string;
    content?: string;
    word_count?: number;
    internal_links?: string;
    external_links?: string;
    anchor_text?: string;
    schema_type?: string;
    json_ld_schema?: string;
    structured_schema?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_card?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
    noindex?: boolean;
    nofollow?: boolean;
    amp_enabled?: boolean;
    lazy_load_images?: boolean;
  };
  onClose: () => void;
  onSuccess: () => void;
}

function isFileOrBlob(value: unknown): value is File | Blob {
  return value instanceof File || value instanceof Blob;
}

export default function SeoModal({ initialData, onClose, onSuccess }: SeoModalProps) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    image: null,
    icon: null,
    slug: initialData?.slug || '',
    meta_description: initialData?.meta_description || '',
    meta_keywords: initialData?.meta_keywords || '',
    canonical_url: initialData?.canonical_url || '',
    h1_tag: initialData?.h1_tag || '',
    content: initialData?.content || '',
    word_count: initialData?.word_count || '',
    internal_links: initialData?.internal_links || '',
    external_links: initialData?.external_links || '',
    anchor_text: initialData?.anchor_text || '',
    schema_type: initialData?.schema_type || '',
    json_ld_schema: initialData?.json_ld_schema || '',
    structured_schema: initialData?.structured_schema || '',
    og_title: initialData?.og_title || '',
    og_description: initialData?.og_description || '',
    og_image: initialData?.og_image || '',
    twitter_card: initialData?.twitter_card || '',
    twitter_title: initialData?.twitter_title || '',
    twitter_description: initialData?.twitter_description || '',
    twitter_image: initialData?.twitter_image || '',
    noindex: initialData?.noindex || false,
    nofollow: initialData?.nofollow || false,
    amp_enabled: initialData?.amp_enabled || false,
    lazy_load_images: initialData?.lazy_load_images || false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).files?.[0] || null }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare form data for file upload
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (isFileOrBlob(value)) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await api.post(API_URL.SEO.CONTACT_SEO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        {/* Header */}
        <div className="px-8 pt-8 pb-4 relative">
          <h2 className="text-2xl font-bold">Add Contact SEO</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="border-b border-gray-300" />
        {/* Form */}
        <form className="px-8 py-6 space-y-8" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          {/* Basic SEO Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div >
              <label className="block text-sm font-medium mb-1">Title</label>
              <input name="title" placeholder="Title" value={form.title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <input name="meta_description" placeholder="Meta Description" value={form.meta_description || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Keywords</label>
              <input name="meta_keywords" placeholder="Meta Keywords" value={form.meta_keywords || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Canonical URL</label>
              <input name="canonical_url" placeholder="Canonical URL" value={form.canonical_url || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>

          {/* Content Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">H1 Tag</label>
              <input name="h1_tag" placeholder="H1 Tag" value={form.h1_tag || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Word Count</label>
              <input type="number" name="word_count" placeholder="Word Count" value={form.word_count || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Internal Links</label>
              <input name="internal_links" placeholder="Internal Links" value={form.internal_links || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">External Links</label>
              <input name="external_links" placeholder="External Links" value={form.external_links || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Anchor Text</label>
              <input name="anchor_text" placeholder="Anchor Text" value={form.anchor_text || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea name="content" placeholder="Content" value={form.content || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-28 resize-none" />
            </div>
          </div>

          {/* Schema Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Schema Type</label>
              <input name="schema_type" placeholder="Schema Type" value={form.schema_type || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">JSON-LD Schema</label>
              <textarea name="json_ld_schema" placeholder="JSON-LD Schema" value={form.json_ld_schema || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Structured Schema</label>
              <textarea name="structured_schema" placeholder="Structured Schema" value={form.structured_schema || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none" />
            </div>
          </div>

          {/* Social Media Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Open Graph</h3>
              <label className="block text-sm font-medium mb-1">OG Title</label>
              <input name="og_title" placeholder="OG Title" value={form.og_title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2" />
              <label className="block text-sm font-medium mb-1">OG Description</label>
              <input name="og_description" placeholder="OG Description" value={form.og_description || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2" />
              <label className="block text-sm font-medium mb-1">OG Image</label>
              <input name="og_image" placeholder="OG Image URL" value={form.og_image || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Twitter</h3>
              <label className="block text-sm font-medium mb-1">Twitter Card</label>
              <input name="twitter_card" placeholder="Twitter Card" value={form.twitter_card || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2" />
              <label className="block text-sm font-medium mb-1">Twitter Title</label>
              <input name="twitter_title" placeholder="Twitter Title" value={form.twitter_title || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2" />
              <label className="block text-sm font-medium mb-1">Twitter Description</label>
              <input name="twitter_description" placeholder="Twitter Description" value={form.twitter_description || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2" />
              <label className="block text-sm font-medium mb-1">Twitter Image</label>
              <input name="twitter_image" placeholder="Twitter Image URL" value={form.twitter_image || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="noindex"
                checked={form.noindex || false}
                onChange={handleChange}
                className="checkbox"
              />
              <label className="text-sm">No Index</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="nofollow"
                checked={form.nofollow || false}
                onChange={handleChange}
                className="checkbox"
              />
              <label className="text-sm">No Follow</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="amp_enabled"
                checked={form.amp_enabled || false}
                onChange={handleChange}
                className="checkbox"
              />
              <label className="text-sm">AMP Enabled</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="lazy_load_images"
                checked={form.lazy_load_images || false}
                onChange={handleChange}
                className="checkbox"
              />
              <label className="text-sm">Lazy Load Images</label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-[#A020F0] text-white font-medium" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
