import { useState } from 'react';
import { useDocEditor } from '../../lib/useDocEditor';
import { PQ_ICONS, type PorQueElegirnosContent, type PorQueElegirnosItem } from '../../lib/types';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import StringListEditor from '../ui/StringListEditor';
import ImageListEditor from '../ui/ImageListEditor';
import SaveBar from '../ui/SaveBar';
import Toast from '../ui/Toast';

const DEFAULT: PorQueElegirnosContent = {
  badge: '¿Por qué elegirnos?',
  titlePrefix: '',
  typewriterWords: [],
  paragraph: '',
  carouselImages: [],
  items: [],
};

export default function PorQueElegirnosEditor() {
  const editor = useDocEditor<PorQueElegirnosContent>('siteContent', 'porQueElegirnos', DEFAULT);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  async function handleSave() {
    const result = await editor.save();
    if (result.ok) setToast({ message: 'Sección actualizada.', variant: 'success' });
    else setToast({ message: result.error, variant: 'error' });
  }

  function updateItem(idx: number, key: keyof PorQueElegirnosItem, value: string) {
    editor.setDraft((d) => ({
      ...d,
      items: d.items.map((it, i) => (i === idx ? { ...it, [key]: value } : it)),
    }));
  }
  function addItem() {
    editor.setDraft((d) => ({
      ...d,
      items: [...d.items, { title: 'Nuevo ítem', description: '', icon: 'document' }],
    }));
  }
  function removeItem(idx: number) {
    editor.setDraft((d) => ({ ...d, items: d.items.filter((_, i) => i !== idx) }));
  }
  function moveItem(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    editor.setDraft((d) => {
      if (target < 0 || target >= d.items.length) return d;
      const items = [...d.items];
      [items[idx], items[target]] = [items[target], items[idx]];
      return { ...d, items };
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

  return (
    <div className="pb-32">
      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        <Block label="Encabezado" description="Badge y título con typewriter en color lima.">
          <TextField
            label="Badge"
            value={draft.badge}
            onChange={(v) => editor.update('badge', v)}
            maxLength={40}
          />
          <TextField
            label="Título — texto fijo"
            value={draft.titlePrefix}
            onChange={(v) => editor.update('titlePrefix', v)}
            maxLength={120}
            placeholder="Soluciones integrales con"
          />
          <StringListEditor
            label="Palabras del typewriter"
            value={draft.typewriterWords}
            onChange={(v) => editor.update('typewriterWords', v)}
            placeholder="responsabilidad ambiental"
          />
        </Block>

        <Block label="Descripción" description="Párrafo introductorio.">
          <TextArea
            label="Texto"
            value={draft.paragraph}
            onChange={(v) => editor.update('paragraph', v)}
            rows={5}
            maxLength={600}
          />
        </Block>

        <Block label="Carrusel de imágenes" description="Imágenes que rotan a la izquierda de la sección.">
          <ImageListEditor
            label="Imágenes"
            value={draft.carouselImages}
            onChange={(v) => editor.update('carouselImages', v)}
            path="site/por-que-elegirnos"
            aspect="4/5"
            hint="Recomendado: imágenes verticales (4:5) o cuadradas."
          />
        </Block>

        <Block label="Ítems destacados" description="Bloques con ícono lima, título y descripción.">
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-gray-500">
              {draft.items.length} {draft.items.length === 1 ? 'ítem' : 'ítems'}
            </p>
            <button
              type="button"
              onClick={addItem}
              className="text-[11px] uppercase tracking-[0.15em] text-black hover:text-eco-lime hover:bg-black px-2 py-1 cursor-pointer font-medium transition"
            >
              + Agregar ítem
            </button>
          </div>

          {draft.items.length === 0 ? (
            <div className="border border-dashed border-gray-300 px-4 py-8 text-center text-xs text-gray-400">
              No hay ítems. Agrega el primero.
            </div>
          ) : (
            <div className="space-y-4">
              {draft.items.map((item, idx) => (
                <fieldset key={idx} className="border border-gray-200 p-4 space-y-4 relative">
                  <legend className="px-2 text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">
                    Ítem #{idx + 1}
                  </legend>

                  <div className="absolute top-2 right-2 flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                      title="Subir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === draft.items.length - 1}
                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                      title="Bajar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-1 text-gray-400 hover:text-red-600 cursor-pointer transition"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <TextField
                    label="Título"
                    value={item.title}
                    onChange={(v) => updateItem(idx, 'title', v)}
                    maxLength={80}
                  />
                  <TextArea
                    label="Descripción"
                    value={item.description}
                    onChange={(v) => updateItem(idx, 'description', v)}
                    rows={3}
                    maxLength={400}
                  />
                  <Select
                    label="Ícono"
                    value={item.icon}
                    onChange={(v) => updateItem(idx, 'icon', v)}
                    options={PQ_ICONS}
                  />
                </fieldset>
              ))}
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
