import { useState } from 'react';
import { useDocEditor } from '../../lib/useDocEditor';
import { STAT_ICONS, type ExperienciaContent, type ExperienciaStat } from '../../lib/types';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import StringListEditor from '../ui/StringListEditor';
import SaveBar from '../ui/SaveBar';
import Toast from '../ui/Toast';

const DEFAULT: ExperienciaContent = {
  badge: 'NUESTRA EXPERIENCIA',
  titlePrefix: 'Experiencia y',
  typewriterWords: [],
  paragraphFull: '',
  stats: [],
};

export default function ExperienciaEditor() {
  const editor = useDocEditor<ExperienciaContent>('siteContent', 'experiencia', DEFAULT);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  async function handleSave() {
    const result = await editor.save();
    if (result.ok) setToast({ message: 'Sección actualizada.', variant: 'success' });
    else setToast({ message: result.error, variant: 'error' });
  }

  function updateStat(idx: number, key: keyof ExperienciaStat, value: string) {
    editor.setDraft((d) => ({
      ...d,
      stats: d.stats.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    }));
  }
  function addStat() {
    editor.setDraft((d) => ({
      ...d,
      stats: [...d.stats, { value: '0', label: 'Etiqueta', icon: 'briefcase' }],
    }));
  }
  function removeStat(idx: number) {
    editor.setDraft((d) => ({ ...d, stats: d.stats.filter((_, i) => i !== idx) }));
  }
  function moveStat(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    editor.setDraft((d) => {
      if (target < 0 || target >= d.stats.length) return d;
      const stats = [...d.stats];
      [stats[idx], stats[target]] = [stats[target], stats[idx]];
      return { ...d, stats };
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
        <Block label="Encabezado" description="Badge y título con typewriter.">
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
            placeholder="Experiencia y"
          />
          <StringListEditor
            label="Palabras del typewriter"
            value={draft.typewriterWords}
            onChange={(v) => editor.update('typewriterWords', v)}
            placeholder="Cobertura Nacional"
          />
        </Block>

        <Block label="Descripción larga" description="Aparece con animación de typewriter al hacer scroll. Usa saltos de línea para separar párrafos.">
          <TextArea
            label="Texto"
            value={draft.paragraphFull}
            onChange={(v) => editor.update('paragraphFull', v)}
            rows={10}
            maxLength={2000}
            hint="Usa Enter para separar párrafos. La animación recorre todo el texto una sola vez."
          />
        </Block>

        <Block label="Métricas" description="Tarjetas con valor, etiqueta e ícono debajo del párrafo.">
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-gray-500">
              {draft.stats.length} {draft.stats.length === 1 ? 'métrica' : 'métricas'}
            </p>
            <button
              type="button"
              onClick={addStat}
              className="text-[11px] uppercase tracking-[0.15em] text-black hover:text-eco-lime hover:bg-black px-2 py-1 cursor-pointer font-medium transition"
            >
              + Agregar métrica
            </button>
          </div>

          {draft.stats.length === 0 ? (
            <div className="border border-dashed border-gray-300 px-4 py-8 text-center text-xs text-gray-400">
              No hay métricas.
            </div>
          ) : (
            <div className="space-y-4">
              {draft.stats.map((stat, idx) => (
                <fieldset key={idx} className="border border-gray-200 p-4 space-y-4 relative">
                  <legend className="px-2 text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium">
                    Métrica #{idx + 1}
                  </legend>

                  <div className="absolute top-2 right-2 flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveStat(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                      title="Subir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStat(idx, 1)}
                      disabled={idx === draft.stats.length - 1}
                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                      title="Bajar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStat(idx)}
                      className="p-1 text-gray-400 hover:text-red-600 cursor-pointer transition"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Valor"
                      value={stat.value}
                      onChange={(v) => updateStat(idx, 'value', v)}
                      maxLength={20}
                      placeholder="+10 o Nacional"
                      hint="Texto destacado grande."
                    />
                    <Select
                      label="Ícono"
                      value={stat.icon}
                      onChange={(v) => updateStat(idx, 'icon', v)}
                      options={STAT_ICONS}
                    />
                  </div>
                  <TextArea
                    label="Etiqueta"
                    value={stat.label}
                    onChange={(v) => updateStat(idx, 'label', v)}
                    rows={2}
                    maxLength={60}
                    hint="Texto pequeño debajo del valor. Usa Enter para forzar un salto de línea."
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
