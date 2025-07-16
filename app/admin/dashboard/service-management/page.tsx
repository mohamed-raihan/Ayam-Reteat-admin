'use client'

import React, { useState, useEffect } from 'react';
import { API_URL } from '@/app/services/api_url';
import api from '@/app/services/api';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface ServiceHeader {
  id: number;
  title: string;
}

interface ServiceBody {
  id: number;
  title: string;
  image: string | File;
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
      if (form.image && (form.image as unknown) instanceof File) {
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
      // setSuccess('Service saved successfully!');
      toast.success("Service added successful", {
        autoClose: 1000,
      });
      fetchServices();
      closeModal();
    } catch (e) {
      console.log(e);
      toast.error("Failed adding service", {
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, headerId: number) {
    console.log(headerId,id);
    
    if (!confirm('Are you sure you want to delete this service?')) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(API_URL.SERVICES.DELETE_SERVICE_DETAILS(String(id)));
      await api.delete(API_URL.SERVICES.DELETE_SERVICE_HEADING(String(headerId)));
      // Optionally delete header if not reused (not implemented here)
      // setSuccess('Service deleted.');
      fetchServices();
      toast.success("Service delete successful", {
        autoClose: 1000,
      });
    } catch (e) {
      console.log(e);
      setError('Failed to delete service.');
      toast.error("Failed deleting service", {
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="">
      <div className="flex justify-between items-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Services Management</h1>
        <button
          className="bg-white text-purple-600 px-4 py-2 rounded  transition"
          onClick={() => openModal()}
        >
          + Add Service
        </button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}
      <div className="bg-white rounded-2xl shadow p-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-gradient-to-br from-white via-violet-50 to-purple-100 border border-gray-200 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 p-0 flex flex-col overflow-hidden"
              >
                <div className="w-full h-40 bg-gray-200 rounded-t-2xl mb-0 flex items-center justify-center overflow-hidden relative">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.alt_img_text || 'service'}
                      className="object-cover w-full h-full rounded-t-2xl"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                  {/* Optional: Overlay gradient for modern look */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none rounded-t-2xl" />
                </div>
                <div className="flex-1 flex flex-col px-5 py-4 gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {service.title || 'No Title'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3" /></svg>
                    <span className="line-clamp-2">{service.description}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0" /></svg>
                    <span>Slug: <span className="font-medium text-gray-700">{service.slug}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs text-gray-400">
                    {service.alt_img_title && <span className="bg-gray-100 px-2 py-0.5 rounded">{service.alt_img_title}</span>}
                    {service.alt_img_caption && <span className="bg-gray-100 px-2 py-0.5 rounded">{service.alt_img_caption}</span>}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex-1 bg-violet-500 text-white py-2 rounded-full hover:bg-violet-700 transition text-sm font-semibold shadow"
                      onClick={() => openModal(service)}
                    >
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6l9.293-9.293a1 1 0 00-1.414-1.414L9 13.586V21z" /></svg>
                        Edit
                      </span>
                    </button>
                    <button
                      className="flex-1 bg-red-500 text-white py-2 rounded-full hover:bg-red-700 transition text-sm font-semibold shadow"
                      onClick={() => handleDelete(service.id, service.service_header)}
                    >
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
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
                  className="w-full border border-gray-300 rounded-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {form.image && (
                    <Image
                      src={
                        form.image instanceof File
                          ? URL.createObjectURL(form.image)
                          : (form.image as string)
                      }
                      alt="Thumbnail Preview"
                      className='border rounded-lg border mt-2 w-30'
                      width={50}
                      height={50}
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Image Title</label>
                  <input
                    type="text"
                    name="alt_img_title"
                    value={form.alt_img_title || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Image Caption</label>
                  <input
                    type="text"
                    name="alt_img_caption"
                    value={form.alt_img_caption || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Image Description</label>
                  <input
                    type="text"
                    name="alt_img_description"
                    value={form.alt_img_description || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 transition"
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
