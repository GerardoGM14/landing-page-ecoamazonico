import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  writeBatch,
} from 'firebase/firestore';
import { getFirebase } from '../../lib/firebase';
import { SERVICE_ICONS, type Service } from '../../lib/types';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import ImageUploader from '../ui/ImageUploader';
import SaveBar from '../ui/SaveBar';
import Toast from '../ui/Toast';

type DraftService = Service & { _isNew?: boolean };

const ICON_SVGS: Record<Service['icon'], React.ReactNode> = {
  clipboard: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
  search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  users: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
  truck: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
  key: <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
};

function IconSvg({ name, className = 'h-5 w-5' }: { name: Service['icon']; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {ICON_SVGS[name]}
    </svg>
  );
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `nuevo-${Date.now().toString(36)}`;
}

export default function ServicesEditor() {
  const [services, setServices] = useState<DraftService[]>([]);
  const [original, setOriginal] = useState<Service[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { db } = getFirebase();
        const snap = await getDocs(query(collection(db, 'services'), orderBy('order')));
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service);
        setServices(items);
        setOriginal(items);
        setSelectedId(items[0]?.id ?? null);
      } catch (err) {
        console.error(err);
        setToast({ message: 'No se pudo cargar los servicios.', variant: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selected = services.find((s) => s.id === selectedId) ?? null;
  const selectedIdx = selected ? services.findIndex((s) => s.id === selected.id) : -1;

  const dirty = useMemo(() => {
    if (services.length !== original.length) return true;
    return JSON.stringify(services.map(stripMeta)) !== JSON.stringify(original);
  }, [services, original]);

  function update<K extends keyof Service>(key: K, value: Service[K]) {
    if (!selected) return;
    setServices((prev) => prev.map((s) => (s.id === selected.id ? { ...s, [key]: value } : s)));
  }

  function addNew() {
    const id = `nuevo-${Date.now().toString(36)}`;
    const newService: DraftService = {
      id,
      order: services.length + 1,
      title: 'Nuevo servicio',
      shortDesc: '',
      fullDesc: '',
      icon: 'clipboard',
      imageUrl: '',
      detailImages: [],
      _isNew: true,
    };
    setServices((prev) => [...prev, newService]);
    setSelectedId(id);
  }

  function removeSelected() {
    if (!selected) return;
    const remaining = services.filter((s) => s.id !== selected.id);
    setServices(remaining.map((s, i) => ({ ...s, order: i + 1 })));
    setConfirmDelete(null);
    setSelectedId(remaining[0]?.id ?? null);
  }

  function move(direction: -1 | 1) {
    if (!selected) return;
    const target = selectedIdx + direction;
    if (target < 0 || target >= services.length) return;
    setServices((prev) => {
      const copy = [...prev];
      [copy[selectedIdx], copy[target]] = [copy[target], copy[selectedIdx]];
      return copy.map((s, i) => ({ ...s, order: i + 1 }));
    });
  }

  function discard() {
    setServices(original);
    setSelectedId(original[0]?.id ?? null);
    setConfirmDelete(null);
  }

  async function save() {
    setSaving(true);
    try {
      const { db } = getFirebase();
      const batch = writeBatch(db);
      const currentIds = new Set(services.map((s) => s.id));

      for (const orig of original) {
        if (!currentIds.has(orig.id)) batch.delete(doc(db, 'services', orig.id));
      }

      for (const svc of services) {
        const finalId = svc._isNew ? slugify(svc.title) : svc.id;
        const { id, ...data } = stripMeta({ ...svc, id: finalId });
        batch.set(doc(db, 'services', finalId), data);
      }

      await batch.commit();

      const snap = await getDocs(query(collection(db, 'services'), orderBy('order')));
      const fresh = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service);
      setServices(fresh);
      setOriginal(fresh);
      if (selectedId && !fresh.find((s) => s.id === selectedId)) {
        setSelectedId(fresh[0]?.id ?? null);
      }
      setToast({ message: 'Cambios guardados.', variant: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'No se pudo guardar. Revisa tu conexión o permisos.', variant: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <div className="h-6 w-6 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* LIST PANEL */}
        <aside className="bg-white border border-gray-200 rounded-lg overflow-hidden h-fit lg:sticky lg:top-20">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Tarjetas</p>
              <h2 className="text-sm font-semibold text-black mt-0.5">
                {services.length} {services.length === 1 ? 'servicio' : 'servicios'}
              </h2>
            </div>
            <button
              type="button"
              onClick={addNew}
              className="group flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-black border border-black hover:bg-black hover:text-eco-lime px-3 py-1.5 cursor-pointer font-medium transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo
            </button>
          </div>

          <ul className="divide-y divide-gray-100">
            {services.map((svc, idx) => {
              const isSelected = svc.id === selectedId;
              return (
                <li key={svc.id}>
                  <button
                    type="button"
                    onClick={() => { setSelectedId(svc.id); setConfirmDelete(null); }}
                    className={`group w-full text-left px-4 py-3 flex items-center gap-3 relative transition cursor-pointer ${
                      isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {isSelected && <span className="absolute left-0 top-0 bottom-0 w-1 bg-eco-lime" />}

                    {/* Thumbnail */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-100 border ${isSelected ? 'border-black' : 'border-gray-200'} relative`}>
                      {svc.imageUrl ? (
                        <img src={svc.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-gray-300">
                          <IconSvg name={svc.icon} className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-400">#{idx + 1}</span>
                        {svc._isNew && (
                          <span className="text-[9px] uppercase tracking-wider bg-eco-lime text-black px-1.5 py-0.5 font-bold">Nuevo</span>
                        )}
                      </div>
                      <p className={`text-sm truncate mt-0.5 ${isSelected ? 'font-semibold text-black' : 'text-gray-700'}`}>
                        {svc.title || <em className="text-gray-400 font-normal">Sin título</em>}
                      </p>
                    </div>

                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
            {services.length === 0 && (
              <li className="px-4 py-16 text-center text-sm text-gray-400">
                No hay servicios.<br />Crea uno para empezar.
              </li>
            )}
          </ul>
        </aside>

        {/* EDITOR PANEL */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[600px]">
          {!selected ? (
            <div className="grid place-items-center h-full py-24 text-gray-400 text-sm">
              Selecciona un servicio para editarlo
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-6 md:px-8 py-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-eco-lime grid place-items-center text-black flex-shrink-0">
                      <IconSvg name={selected.icon} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-0.5">
                        Editando · #{selected.order}
                      </p>
                      <h2 className="text-lg font-bold text-black truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {selected.title || 'Sin título'}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => move(-1)}
                      disabled={selectedIdx === 0}
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition rounded"
                      title="Mover arriba"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => move(1)}
                      disabled={selectedIdx === services.length - 1}
                      className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition rounded"
                      title="Mover abajo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <div className="px-6 md:px-8 py-8 space-y-10">
                {/* Group: Content */}
                <FormGroup
                  number="01"
                  title="Contenido"
                  description="Texto que aparece en la card y en el modal de detalle."
                >
                  <TextField label="Título" value={selected.title} onChange={(v) => update('title', v)} maxLength={80} placeholder="Nombre del servicio" />
                  <TextArea label="Descripción corta" value={selected.shortDesc} onChange={(v) => update('shortDesc', v)} rows={2} maxLength={140} hint="Frase de una línea. Aparece en vistas resumen." />
                  <TextArea label="Descripción completa" value={selected.fullDesc} onChange={(v) => update('fullDesc', v)} rows={6} maxLength={600} hint="Se muestra en la card y en el modal cuando el usuario hace click en “Más detalles”." />
                </FormGroup>

                {/* Group: Visual */}
                <FormGroup
                  number="02"
                  title="Visual"
                  description="Cómo se ve la card en la landing."
                >
                  <Select label="Ícono" value={selected.icon} onChange={(v) => update('icon', v as Service['icon'])} options={SERVICE_ICONS} />
                  <ImageUploader
                    label="Imagen principal"
                    value={selected.imageUrl}
                    onChange={(url) => update('imageUrl', url)}
                    path="site/services"
                    aspect="16/9"
                    hint="Aparece como fondo de la card. Formato horizontal recomendado."
                  />
                </FormGroup>

                {/* Group: Danger zone */}
                <FormGroup
                  number="03"
                  title="Zona de peligro"
                  description="Acciones irreversibles. El cambio se aplica al guardar."
                  danger
                >
                  {confirmDelete === selected.id ? (
                    <div className="flex flex-wrap items-center gap-3 bg-red-50 border border-red-200 px-4 py-3 rounded">
                      <span className="text-sm text-red-900 flex-1">
                        ¿Eliminar “{selected.title}” de la lista?
                      </span>
                      <button
                        type="button"
                        onClick={removeSelected}
                        className="text-xs uppercase tracking-[0.15em] bg-red-600 text-white px-3 py-2 hover:bg-red-700 cursor-pointer font-medium rounded"
                      >
                        Sí, eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs uppercase tracking-[0.15em] text-gray-600 hover:text-black px-2 py-2 cursor-pointer font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(selected.id)}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-4 py-2.5 cursor-pointer font-medium transition rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3" />
                      </svg>
                      Eliminar servicio
                    </button>
                  )}
                </FormGroup>
              </div>
            </>
          )}
        </section>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
      {toast && <Toast message={toast.message} variant={toast.variant} onDone={() => setToast(null)} />}
    </div>
  );
}

function FormGroup({
  number,
  title,
  description,
  danger,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-10">
      <div className="md:pt-1">
        <div className="flex items-baseline gap-2">
          <span className={`text-[10px] font-mono ${danger ? 'text-red-400' : 'text-gray-300'}`}>{number}</span>
          <h3 className={`text-sm font-semibold ${danger ? 'text-red-700' : 'text-black'}`}>{title}</h3>
        </div>
        {description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>}
      </div>
      <div className="space-y-6 min-w-0">{children}</div>
    </div>
  );
}

function stripMeta(s: DraftService | Service): Service {
  const { _isNew, ...rest } = s as DraftService;
  return rest;
}
