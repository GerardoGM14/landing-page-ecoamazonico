import { useState } from 'react';
import { useDocEditor } from '../../lib/useDocEditor';
import type { ServicesPageHeroContent } from '../../lib/types';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import SaveBar from '../ui/SaveBar';
import Toast from '../ui/Toast';

const DEFAULT: ServicesPageHeroContent = {
  title: 'Nuestros Servicios',
  subtitle: '',
  videoUrl: '',
};

export default function ServicesPageHeroEditor() {
  const editor = useDocEditor<ServicesPageHeroContent>('siteContent', 'servicesPageHero', DEFAULT);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  async function handleSave() {
    const result = await editor.save();
    if (result.ok) setToast({ message: 'Hero actualizado.', variant: 'success' });
    else setToast({ message: result.error, variant: 'error' });
  }

  if (editor.loading) {
    return (
      <div className="grid place-items-center py-24">
        <div className="h-6 w-6 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
      </div>
    );
  }

  const { draft } = editor;

  return (
    <div className="pb-32">
      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        <Block label="Texto" description="Aparece centrado sobre el video.">
          <TextField
            label="Título"
            value={draft.title}
            onChange={(v) => editor.update('title', v)}
            maxLength={60}
            placeholder="Nuestros Servicios"
          />
          <TextField
            label="Subtítulo"
            value={draft.subtitle}
            onChange={(v) => editor.update('subtitle', v)}
            maxLength={140}
            placeholder="Soluciones integrales para el desarrollo sostenible"
          />
        </Block>

        <Block label="Video de fondo" description="Se reproduce en loop con opacidad reducida detrás del texto.">
          <TextArea
            label="URL del video"
            value={draft.videoUrl}
            onChange={(v) => editor.update('videoUrl', v)}
            rows={2}
            hint="Ruta relativa (ej: /nuestros-servicios.mp4) o URL absoluta a un MP4."
          />

          {draft.videoUrl && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium mb-2">
                Vista previa
              </p>
              <div className="relative bg-green-950 aspect-video overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  key={draft.videoUrl}
                  className="w-full h-full object-cover opacity-40"
                >
                  <source src={draft.videoUrl} type="video/mp4" />
                </video>
                <div className="absolute inset-0 grid place-items-center text-center px-4">
                  <div>
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">{draft.title || 'Título'}</h3>
                    <p className="text-eco-lime/80 text-sm md:text-base">{draft.subtitle || 'Subtítulo'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Block>
      </div>

      <SaveBar dirty={editor.dirty} saving={editor.saving} onSave={handleSave} onDiscard={editor.discard} />
      {toast && <Toast message={toast.message} variant={toast.variant} onDone={() => setToast(null)} />}
    </div>
  );
}

function Block({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="px-6 md:px-8 py-8">
      <header className="mb-6">
        <h2 className="text-base font-bold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {label}
        </h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </header>
      <div className="space-y-6 max-w-2xl">{children}</div>
    </section>
  );
}
