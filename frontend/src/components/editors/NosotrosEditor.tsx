import { useState } from 'react';
import { useDocEditor } from '../../lib/useDocEditor';
import type { NosotrosContent } from '../../lib/types';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import ImageUploader from '../ui/ImageUploader';
import StringListEditor from '../ui/StringListEditor';
import SaveBar from '../ui/SaveBar';
import Toast from '../ui/Toast';

const DEFAULT: NosotrosContent = {
  badge: 'Sobre Nosotros',
  titlePrefix: '',
  typewriterWords: [],
  paragraph: '',
  mision: { title: 'Misión', text: '' },
  vision: { title: 'Visión', text: '' },
  images: ['', '', ''],
};

export default function NosotrosEditor() {
  const editor = useDocEditor<NosotrosContent>('siteContent', 'nosotros', DEFAULT);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  async function handleSave() {
    const result = await editor.save();
    if (result.ok) setToast({ message: 'Sobre Nosotros actualizado.', variant: 'success' });
    else setToast({ message: result.error, variant: 'error' });
  }

  function updateMV(which: 'mision' | 'vision', key: 'title' | 'text', value: string) {
    editor.setDraft((d) => ({ ...d, [which]: { ...d[which], [key]: value } }));
  }

  function updateImage(idx: number, url: string) {
    editor.setDraft((d) => {
      const images = [...(d.images.length === 3 ? d.images : ['', '', ''])];
      images[idx] = url;
      return { ...d, images };
    });
  }

  if (editor.loading) {
    return (
      <div className="grid place-items-center py-24">
        <div className="h-6 w-6 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
      </div>
    );
  }

  const { draft } = editor;
  const [img1, img2, img3] = [draft.images[0] ?? '', draft.images[1] ?? '', draft.images[2] ?? ''];

  return (
    <div className="pb-32">
      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        {/* Bloque: Encabezado */}
        <Block label="Encabezado" description="Etiqueta y título con efecto typewriter sobre la palabra cambiante.">
          <TextField
            label="Badge (etiqueta verde)"
            value={draft.badge}
            onChange={(v) => editor.update('badge', v)}
            maxLength={40}
            placeholder="Sobre Nosotros"
          />
          <TextField
            label="Título — texto fijo"
            value={draft.titlePrefix}
            onChange={(v) => editor.update('titlePrefix', v)}
            maxLength={120}
            placeholder="+ de 10 años comprometidos con la"
            hint="Texto que aparece antes de la palabra que cambia."
          />
          <StringListEditor
            label="Palabras del typewriter"
            value={draft.typewriterWords}
            onChange={(v) => editor.update('typewriterWords', v)}
            placeholder="seguridad"
            emptyLabel="Agrega palabras que se irán alternando."
            hint="Aparecen una tras otra como animación al final del título."
          />
        </Block>

        {/* Bloque: Descripción */}
        <Block label="Descripción" description="Texto introductorio debajo del título.">
          <TextArea
            label="Párrafo"
            value={draft.paragraph}
            onChange={(v) => editor.update('paragraph', v)}
            rows={6}
            maxLength={800}
          />
        </Block>

        {/* Bloque: Misión y Visión */}
        <Block label="Misión y Visión" description="Dos bloques con título e ícono de check.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <fieldset className="space-y-4 border border-gray-200 p-4">
              <legend className="px-2 text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">Misión</legend>
              <TextField
                label="Título"
                value={draft.mision.title}
                onChange={(v) => updateMV('mision', 'title', v)}
                maxLength={40}
              />
              <TextArea
                label="Texto"
                value={draft.mision.text}
                onChange={(v) => updateMV('mision', 'text', v)}
                rows={5}
                maxLength={500}
              />
            </fieldset>

            <fieldset className="space-y-4 border border-gray-200 p-4">
              <legend className="px-2 text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">Visión</legend>
              <TextField
                label="Título"
                value={draft.vision.title}
                onChange={(v) => updateMV('vision', 'title', v)}
                maxLength={40}
              />
              <TextArea
                label="Texto"
                value={draft.vision.text}
                onChange={(v) => updateMV('vision', 'text', v)}
                rows={5}
                maxLength={500}
              />
            </fieldset>
          </div>
        </Block>

        {/* Bloque: Imágenes */}
        <Block label="Imágenes" description="Grid de 3 imágenes a la derecha del texto. La primera es la grande arriba.">
          <ImageUploader
            label="Imagen 1 — grande (arriba)"
            value={img1}
            onChange={(url) => updateImage(0, url)}
            path="site/nosotros"
            aspect="16/9"
            hint="Aparece a lo ancho de las dos columnas."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="Imagen 2 — abajo izquierda"
              value={img2}
              onChange={(url) => updateImage(1, url)}
              path="site/nosotros"
              aspect="4/3"
            />
            <ImageUploader
              label="Imagen 3 — abajo derecha"
              value={img3}
              onChange={(url) => updateImage(2, url)}
              path="site/nosotros"
              aspect="4/3"
            />
          </div>
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
