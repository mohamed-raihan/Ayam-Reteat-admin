interface SeoData {
  title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
}

export default function SeoCard({ data }: { data: SeoData }) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 space-y-3">
        <div>
          <h3 className="font-semibold">Title:</h3>
          <p>{data.title || '—'}</p>
        </div>
        <div>
          <h3 className="font-semibold">Meta Description:</h3>
          <p>{data.meta_description || '—'}</p>
        </div>
        <div>
          <h3 className="font-semibold">Canonical URL:</h3>
          <p>{data.canonical_url || '—'}</p>
        </div>
        <div>
          <h3 className="font-semibold">Open Graph Title:</h3>
          <p>{data.og_title || '—'}</p>
        </div>
        {/* Add more fields as needed */}
      </div>
    );
  }
  