interface SeoData {
  title?: string;
  meta_description?: string;
  og_title?: string;
}

export default function SeoCard({ data }: { data: SeoData[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-6">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-3 border-b w-fit last:border-b-0 pb-4 last:pb-0">
          <div>
            <h3 className="font-semibold">Title:</h3>
            <p>{item.title || '—'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Meta Description:</h3>
            <p>{item.meta_description || '—'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Open Graph Title:</h3>
            <p>{item.og_title || '—'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
  