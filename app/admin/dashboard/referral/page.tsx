'use client'

import React, { useState, useEffect } from 'react';
import { API_URL } from '@/app/services/api_url';
import api from '@/app/services/api';

interface ServiceHeader {
  id: number;
  title: string;
}

interface ServiceBody {
  id: number;
  title: string;
  image: string;
  description: string;
  alt_img_text: string | null;
  alt_img_title: string | null;
  alt_img_caption: string | null;
  alt_img_description: string | null;
  slug: string;
  service_header: number;
}

const initialBody: Partial<ServiceBody> = {
  image: '',
  description: '',
  alt_img_text: '',
  alt_img_title: '',
  alt_img_caption: '',
  alt_img_description: '',
  slug: '',
};

export default function ReferralServicePage() {
  const [services, setServices] = useState<ServiceBody[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ServiceHeader & ServiceBody>>({ ...initialBody, title: '' });
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(API_URL.SERVICES.GET_SERVICE_DETAILS);
      setServices(res.data);
    } catch (e) {
      console.log(e);
      
      setError('Failed to load services.');
    } finally {
      setLoading(false);
    }
  }

  function openModal(service?: ServiceBody & { title?: string }) {
    setModalOpen(true);
    if (service) {
      setEditId(service.id);
      setForm({ ...service, title: service.title || '' });
    } else {
      setEditId(null);
      setForm({ ...initialBody, title: '' });
    }
  }

  function closeModal() {
    setModalOpen(false);
    setForm({ ...initialBody, title: '' });
    setEditId(null);
    setError(null);
    setSuccess(null);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: target.files ? target.files[0] : '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // 1. Create or update Service Header
      let headerId = form.service_header;
      if (!editId || (form.title && form.title !== '')) {
        const headerRes = editId
          ? await api.patch(API_URL.SERVICES.PATCH_SERVICE_HEADING(String(headerId)), { title: form.title })
          : await api.post(API_URL.SERVICES.CREATE_SERVICE_HEADING, { title: form.title });
        headerId = headerRes.data.id;
      }
      // 2. Create or update Service Body
      const bodyForm = new FormData();
      bodyForm.append('title', form.title || '');
      bodyForm.append('description', form.description || '');
      bodyForm.append('alt_img_text', form.alt_img_text || '');
      bodyForm.append('alt_img_title', form.alt_img_title || '');
      bodyForm.append('alt_img_caption', form.alt_img_caption || '');
      bodyForm.append('alt_img_description', form.alt_img_description || '');
      bodyForm.append('slug', form.slug || '');
      bodyForm.append('service_header', String(headerId));
      if (form.image && (form.image as any) instanceof File) {
        bodyForm.append('image', form.image);
      }
      const bodyRes = editId
        ? await api.patch(
            API_URL.SERVICES.PATCH_SERVICE_DETAILS(String(editId)),
            bodyForm,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
        : await api.post(
            API_URL.SERVICES.CREATE_SERVICE_DETAILS,
            bodyForm,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );

      console.log(bodyRes);
      if (!bodyRes || !bodyRes.data) throw new Error('Failed to save service.');
      setSuccess('Service saved successfully!');
      fetchServices();
      closeModal();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, headerId: number) {
    console.log(headerId);
    
    if (!confirm('Are you sure you want to delete this service?')) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(API_URL.SERVICES.DELETE_SERVICE_DETAILS(String(id)));
      // Optionally delete header if not reused (not implemented here)
      setSuccess('Service deleted.');
      fetchServices();
    } catch (e) {
      console.log(e);
      
      setError('Failed to delete service.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6 rounded-lg bg-violet-500 p-4 py-6">
        <h1 className="text-3xl font-bold text-white">Services Management</h1>
        <button
          className="bg-gray-200 text-purple-600 px-4 py-2 rounded hover:bg-gray-700 transition"
          onClick={() => openModal()}
        >
          + Add Service
        </button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}
      <div className="bg-white rounded shadow p-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
                <div className="w-full h-40 bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden">
                  {service.image ? (
                    <img src={service.image} alt="service" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div className="flex-1">
                  {/* ServiceBody does not have a title property; display placeholder or form.title if available */}
                  <h3 className="text-lg font-bold text-purple-700 mb-2">{service.title || 'No Title'}</h3>
                  <p className="text-gray-700 text-sm mb-2 line-clamp-3">{service.description}</p>
                  <div className="text-xs text-gray-500 mb-4">Slug: {service.slug}</div>
                </div>
                <div className="flex gap-2 mt-auto">
                  <button
                    className="flex-1 bg-violet-500 text-white py-1 rounded hover:bg-blue-700 transition text-sm"
                    onClick={() => openModal(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700 transition text-sm"
                    onClick={() => handleDelete(service.id, service.service_header)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-purple-700">{editId ? 'Edit' : 'Add'} Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title || ''}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description || ''}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Image Text</label>
                  <input
                    type="text"
                    name="alt_img_text"
                    value={form.alt_img_text || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Image Title</label>
                  <input
                    type="text"
                    name="alt_img_title"
                    value={form.alt_img_title || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Image Caption</label>
                  <input
                    type="text"
                    name="alt_img_caption"
                    value={form.alt_img_caption || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Image Description</label>
                  <input
                    type="text"
                    name="alt_img_description"
                    value={form.alt_img_description || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug || ''}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              {error && <div className="text-red-600 mt-2">{error}</div>}
              {success && <div className="text-green-600 mt-2">{success}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
