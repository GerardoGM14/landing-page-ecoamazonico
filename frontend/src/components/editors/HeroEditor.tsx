import { useState } from 'react';
import { useDocEditor } from '../../lib/useDocEditor';
import type { HeroContent } from '../../lib/types';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import ImageUploader from '../ui/ImageUploader';
import StringListEditor from '../ui/StringListEditor';
import SaveBar from '../ui/SaveBar';
import Toast from '../ui/Toast';

const HERO_DEFAULT: HeroContent = {
  title: 'Eco Amazónico Peru SRL',
  paragraph: '',
  ctaPrimary: { label: 'Nuestros Servicios', href: '#servicios' },
  ctaSecondary: { label: 'Conócenos', href: '#nosotros' },
  videos: [],
  posterUrl: '',
};

export default function HeroEditor() {
  const editor = useDocEditor<HeroContent>('siteContent', 'hero', HERO_DEFAULT);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  async function handleSave() {
    const result = await editor.save();
    if (result.ok) setToast({ message: 'Hero actualizado.', variant: 'success' });
    else setToast({ message: result.error, variant: 'error' });
  }

  function updateCta(which: 'ctaPrimary' | 'ctaSecondary', key: 'label' | 'href', value: string) {
    editor.setDraft((d) => ({ ...d, [which]: { ...d[which], [key]: value } }));
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
        {/* SECTION: Texto */}
        <Block label="Texto" description="Aparece sobre el video de fondo.">
          <TextField
            label="Título principal"
            value={draft.title}
            onChange={(v) => editor.update('title', v)}
            maxLength={80}
            placeholder="Eco Amazónico Peru SRL"
          />
          <TextArea
            label="Párrafo"
            value={draft.paragraph}
            onChange={(v) => editor.update('paragraph', v)}
            rows={5}
            maxLength={500}
            hint="Descripción breve de la empresa. Acepta saltos de línea."
          />
        </Block>

        {/* SECTION: Botones */}
        <Block label="Botones" description="Llamadas a la acción debajo del párrafo.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset className="space-y-4 border border-gray-200 p-4">
              <legend className="px-2 text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">
                Botón primario · verde
              </legend>
              <TextField
                label="Texto"
                value={draft.ctaPrimary.label}
                onChange={(v) => updateCta('ctaPrimary', 'label', v)}
                maxLength={40}
              />
              <TextField
                label="Enlace"
                value={draft.ctaPrimary.href}
                onChange={(v) => updateCta('ctaPrimary', 'href', v)}
                placeholder="#servicios o https://…"
                hint="Use #seccion para enlaces internos."
              />
            </fieldset>

            <fieldset className="space-y-4 border border-gray-200 p-4">
              <legend className="px-2 text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">
                Botón secundario · transparente
              </legend>
              <TextField
                label="Texto"
                value={draft.ctaSecondary.label}
                onChange={(v) => updateCta('ctaSecondary', 'label', v)}
                maxLength={40}
              />
              <TextField
                label="Enlace"
                value={draft.ctaSecondary.href}
                onChange={(v) => updateCta('ctaSecondary', 'href', v)}
                placeholder="#nosotros o https://…"
              />
            </fieldset>
          </div>
        </Block>

        {/* SECTION: Fondo */}
        <Block label="Fondo" description="Videos que se reproducen detrás del texto. Cambian cada 15 segundos.">
          <ImageUploader
            label="Imagen de poster (fallback)"
            value={draft.posterUrl}
            onChange={(url) => editor.update('posterUrl', url)}
            path="site/hero"
            aspect="16/9"
            hint="Se muestra mientras cargan los videos o si el navegador no los soporta."
          />
          <StringListEditor
            label="URLs de videos"
            value={draft.videos}
            onChange={(v) => editor.update('videos', v)}
            placeholder="/selva-video.mp4 o https://…"
            hint="Rutas relativas (/selva-video.mp4) o URLs absolutas. Los archivos en /landing/public/ se sirven en la raíz."
            emptyLabel="No hay videos. Agrega al menos uno."
          />
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
