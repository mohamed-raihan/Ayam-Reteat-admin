'use client';

import { useEffect, useState } from 'react';
import api from '@/app/services/api';
import SeoCard from '../../components/seoCard';
import SeoModal from './formModal';
import { API_URL } from '@/app/services/api_url';

interface SeoData {
  title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
}

export default function HomeSeo() {
  const [seoData, setSeoData] = useState<SeoData[] | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSeo = async () => {
    const res = await api.get(API_URL.SEO.HOME_SEO);
    console.log(res);
    
    setSeoData(res.data);
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 rounded-lg py-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Home SEO</h2>
          <p className="text-sm text-gray-500 text-white">Manage SEO details for your homepage</p>
        </div>
        <button onClick={() => setModalOpen(true)} className='rounded-lg shadow bg-purple-100 py-3 px-4'>+ Add </button>
      </div>

      {seoData ? (
        <SeoCard data={seoData} />
      ) : (
        <p className="text-gray-400">No SEO data found.</p>
      )}

      {modalOpen && (
        <SeoModal
          initialData={seoData?.[0]}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchSeo}
        />
      )}
    </div>
  );
}
