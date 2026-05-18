import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { getFirebase } from '../../lib/firebase';
import { SERVICE_ICONS, type Service } from '../../lib/types';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import ImageUploader from '../ui/ImageUploader';
import SaveBar from '../ui/SaveBar';
import Toast from '../ui/Toast';

type DraftService = Service & { _isNew?: boolean; _pendingDelete?: boolean };

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
    setServices((prev) => {
      const filtered = prev.filter((s) => s.id !== selected.id);
      return filtered.map((s, i) => ({ ...s, order: i + 1 }));
    });
    setConfirmDelete(null);
    const remaining = services.filter((s) => s.id !== selected.id);
    setSelectedId(remaining[0]?.id ?? null);
  }

  function move(direction: -1 | 1) {
    if (!selected) return;
    const idx = services.findIndex((s) => s.id === selected.id);
    const target = idx + direction;
    if (target < 0 || target >= services.length) return;
    setServices((prev) => {
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
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
      const originalIds = new Set(original.map((s) => s.id));

      for (const orig of original) {
        if (!currentIds.has(orig.id)) {
          batch.delete(doc(db, 'services', orig.id));
        }
      }

      for (const svc of services) {
        const finalId = svc._isNew ? slugify(svc.title) : svc.id;
        const payload = stripMeta({ ...svc, id: finalId });
        const { id, ...data } = payload;
        if (svc._isNew && svc.id !== finalId) {
          batch.set(doc(db, 'services', finalId), data);
        } else {
          batch.set(doc(db, 'services', svc.id), data);
        }
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
    <div className="pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-px bg-gray-200 border border-gray-200 min-h-[600px]">
        {/* LIST */}
        <div className="bg-white">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-semibold">
              {services.length} {services.length === 1 ? 'Servicio' : 'Servicios'}
            </h2>
            <button
              type="button"
              onClick={addNew}
              className="text-xs uppercase tracking-[0.15em] text-black hover:text-eco-lime hover:bg-black px-2 py-1 cursor-pointer font-medium transition"
              title="Agregar nuevo servicio"
            >
              + Nuevo
            </button>
          </div>
          <ul>
            {services.map((svc, idx) => {
              const isSelected = svc.id === selectedId;
              return (
                <li key={svc.id}>
                  <button
                    type="button"
                    onClick={() => { setSelectedId(svc.id); setConfirmDelete(null); }}
                    className={`group w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-100 relative transition ${
                      isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                    } cursor-pointer`}
                  >
                    {isSelected && <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-eco-lime" />}
                    <span className="text-[10px] text-gray-400 font-mono w-4 flex-shrink-0">{idx + 1}</span>
                    <span className="flex-1 text-sm truncate">{svc.title || <em className="text-gray-400">Sin título</em>}</span>
                    {svc._isNew && (
                      <span className="text-[9px] uppercase tracking-wider bg-eco-lime text-black px-1.5 py-0.5 font-bold">Nuevo</span>
                    )}
                  </button>
                </li>
              );
            })}
            {services.length === 0 && (
              <li className="px-4 py-12 text-center text-sm text-gray-400">
                No hay servicios. Crea uno nuevo.
              </li>
            )}
          </ul>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 md:p-8">
          {!selected ? (
            <div className="grid place-items-center h-full text-gray-400 text-sm">
              Selecciona un servicio para editarlo
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    disabled={services.findIndex((s) => s.id === selected.id) === 0}
                    className="p-1.5 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                    title="Mover arriba"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    disabled={services.findIndex((s) => s.id === selected.id) === services.length - 1}
                    className="p-1.5 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                    title="Mover abajo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <span className="text-[11px] uppercase tracking-[0.15em] text-gray-400 ml-2">
                    Orden #{selected.order}
                  </span>
                </div>

                {confirmDelete === selected.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">¿Eliminar?</span>
                    <button
                      type="button"
                      onClick={removeSelected}
                      className="text-xs uppercase tracking-[0.15em] bg-red-600 text-white px-3 py-1.5 hover:bg-red-700 cursor-pointer font-medium"
                    >
                      Sí, eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="text-xs uppercase tracking-[0.15em] text-gray-500 hover:text-black px-2 py-1.5 cursor-pointer font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(selected.id)}
                    className="text-xs uppercase tracking-[0.15em] text-red-600 hover:text-red-700 px-2 py-1.5 cursor-pointer font-medium"
                  >
                    Eliminar servicio
                  </button>
                )}
              </div>

              <TextField label="Título" value={selected.title} onChange={(v) => update('title', v)} maxLength={80} placeholder="Nombre del servicio" />
              <TextArea label="Descripción corta" value={selected.shortDesc} onChange={(v) => update('shortDesc', v)} rows={2} maxLength={140} hint="Frase de una línea. Aparece en algunas vistas resumen." />
              <TextArea label="Descripción completa" value={selected.fullDesc} onChange={(v) => update('fullDesc', v)} rows={6} maxLength={600} hint="Texto que se muestra en la tarjeta del servicio y en el modal de detalle." />
              <Select label="Ícono" value={selected.icon} onChange={(v) => update('icon', v as Service['icon'])} options={SERVICE_ICONS} />

              <div className="pt-2">
                <ImageUploader
                  label="Imagen principal"
                  value={selected.imageUrl}
                  onChange={(url) => update('imageUrl', url)}
                  path="site/services"
                  aspect="16/9"
                  hint="Esta imagen aparece en la card del servicio en la página de inicio."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />

      {toast && <Toast message={toast.message} variant={toast.variant} onDone={() => setToast(null)} />}
    </div>
  );
}

function stripMeta(s: DraftService | Service): Service {
  const { _isNew, _pendingDelete, ...rest } = s as DraftService;
  return rest;
}
