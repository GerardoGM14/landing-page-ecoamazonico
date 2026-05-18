import { useState } from 'react';
import { useDocEditor } from '../../lib/useDocEditor';
import { SOCIAL_PLATFORMS, type FooterContent, type Office, type SocialLink } from '../../lib/types';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import SaveBar from '../ui/SaveBar';
import Toast from '../ui/Toast';

const DEFAULT: FooterContent = {
  phone: '',
  email: '',
  social: [],
  offices: [],
};

export default function FooterEditor() {
  const editor = useDocEditor<FooterContent>('siteContent', 'footer', DEFAULT);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  async function handleSave() {
    const result = await editor.save();
    if (result.ok) setToast({ message: 'Footer actualizado.', variant: 'success' });
    else setToast({ message: result.error, variant: 'error' });
  }

  function updateSocial(idx: number, key: keyof SocialLink, value: string) {
    editor.setDraft((d) => ({
      ...d,
      social: d.social.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    }));
  }
  function addSocial() {
    editor.setDraft((d) => ({ ...d, social: [...d.social, { platform: 'facebook', url: '' }] }));
  }
  function removeSocial(idx: number) {
    editor.setDraft((d) => ({ ...d, social: d.social.filter((_, i) => i !== idx) }));
  }
  function moveSocial(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    editor.setDraft((d) => {
      if (target < 0 || target >= d.social.length) return d;
      const social = [...d.social];
      [social[idx], social[target]] = [social[target], social[idx]];
      return { ...d, social };
    });
  }

  function updateOffice(idx: number, key: keyof Office, value: string | boolean) {
    editor.setDraft((d) => ({
      ...d,
      offices: d.offices.map((o, i) => (i === idx ? { ...o, [key]: value } : o)),
    }));
  }
  function addOffice() {
    editor.setDraft((d) => ({
      ...d,
      offices: [...d.offices, { name: 'Nueva oficina', address: '', mapEmbedUrl: '', primary: false }],
    }));
  }
  function removeOffice(idx: number) {
    editor.setDraft((d) => ({ ...d, offices: d.offices.filter((_, i) => i !== idx) }));
  }
  function moveOffice(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    editor.setDraft((d) => {
      if (target < 0 || target >= d.offices.length) return d;
      const offices = [...d.offices];
      [offices[idx], offices[target]] = [offices[target], offices[idx]];
      return { ...d, offices };
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
        <Block label="Contacto" description="Teléfono y correo principal.">
          <TextField
            label="Teléfono"
            value={draft.phone}
            onChange={(v) => editor.update('phone', v)}
            placeholder="+51 945 775 810"
            type="tel"
          />
          <TextField
            label="Correo electrónico"
            value={draft.email}
            onChange={(v) => editor.update('email', v)}
            placeholder="hola@ejemplo.com"
            type="email"
          />
        </Block>

        <Block label="Redes sociales" description="Aparecen como íconos debajo del correo.">
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-gray-500">
              {draft.social.length} {draft.social.length === 1 ? 'red' : 'redes'}
            </p>
            <button
              type="button"
              onClick={addSocial}
              className="text-[11px] uppercase tracking-[0.15em] text-black hover:text-eco-lime hover:bg-black px-2 py-1 cursor-pointer font-medium transition"
            >
              + Agregar red
            </button>
          </div>

          {draft.social.length === 0 ? (
            <div className="border border-dashed border-gray-300 px-4 py-8 text-center text-xs text-gray-400">
              No hay redes sociales.
            </div>
          ) : (
            <div className="space-y-3">
              {draft.social.map((s, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_2fr_auto] gap-3 items-end bg-gray-50 border border-gray-200 p-3">
                  <Select
                    label="Plataforma"
                    value={s.platform}
                    onChange={(v) => updateSocial(idx, 'platform', v)}
                    options={SOCIAL_PLATFORMS}
                  />
                  <TextField
                    label="URL"
                    value={s.url}
                    onChange={(v) => updateSocial(idx, 'url', v)}
                    placeholder="https://facebook.com/..."
                    type="url"
                  />
                  <div className="flex items-center gap-0.5 pb-1">
                    <button
                      type="button"
                      onClick={() => moveSocial(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                      title="Subir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSocial(idx, 1)}
                      disabled={idx === draft.social.length - 1}
                      className="p-1.5 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                      title="Bajar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSocial(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer transition"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Block>

        <Block label="Oficinas" description="La marcada como “Principal” se muestra grande arriba; las demás van en grid de 2 columnas.">
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-gray-500">
              {draft.offices.length} {draft.offices.length === 1 ? 'oficina' : 'oficinas'}
            </p>
            <button
              type="button"
              onClick={addOffice}
              className="text-[11px] uppercase tracking-[0.15em] text-black hover:text-eco-lime hover:bg-black px-2 py-1 cursor-pointer font-medium transition"
            >
              + Agregar oficina
            </button>
          </div>

          {draft.offices.length === 0 ? (
            <div className="border border-dashed border-gray-300 px-4 py-8 text-center text-xs text-gray-400">
              No hay oficinas.
            </div>
          ) : (
            <div className="space-y-4">
              {draft.offices.map((office, idx) => (
                <fieldset key={idx} className="border border-gray-200 p-4 space-y-4 relative">
                  <legend className="px-2 text-[11px] uppercase tracking-[0.15em] text-gray-500 font-medium flex items-center gap-2">
                    Oficina #{idx + 1}
                    {office.primary && (
                      <span className="bg-eco-lime text-black px-1.5 py-0.5 text-[9px] tracking-wider font-bold">PRINCIPAL</span>
                    )}
                  </legend>

                  <div className="absolute top-2 right-2 flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveOffice(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                      title="Subir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveOffice(idx, 1)}
                      disabled={idx === draft.offices.length - 1}
                      className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                      title="Bajar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeOffice(idx)}
                      className="p-1 text-gray-400 hover:text-red-600 cursor-pointer transition"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <TextField
                    label="Nombre"
                    value={office.name}
                    onChange={(v) => updateOffice(idx, 'name', v)}
                    maxLength={60}
                    placeholder="Sede Central - Lima"
                  />
                  <TextField
                    label="Dirección"
                    value={office.address}
                    onChange={(v) => updateOffice(idx, 'address', v)}
                    maxLength={140}
                    placeholder="Av. ..."
                  />
                  <TextArea
                    label="URL del iframe de Google Maps"
                    value={office.mapEmbedUrl}
                    onChange={(v) => updateOffice(idx, 'mapEmbedUrl', v)}
                    rows={3}
                    hint="Google Maps → Compartir → Insertar un mapa → copia solo el src de la URL (lo que va entre comillas en src=&quot;…&quot;)."
                  />

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={office.primary}
                      onChange={(e) => updateOffice(idx, 'primary', e.target.checked)}
                      className="h-4 w-4 cursor-pointer accent-black"
                    />
                    <span className="text-sm text-gray-700">
                      Marcar como oficina principal (grande arriba)
                    </span>
                  </label>
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
