import { useEffect, useState } from 'react';
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
import { getFirebase } from '../../lib/firebase';
import { SERVICE_ICONS, type Service } from '../../lib/types';
import TextField from '../ui/TextField';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import ImageUploader from '../ui/ImageUploader';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';

const ICON_PATHS: Record<Service['icon'], string> = {
  clipboard: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  truck: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  key: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
};

function IconSvg({ name, className = 'h-5 w-5' }: { name: Service['icon']; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
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

type ModalMode = { kind: 'closed' } | { kind: 'edit'; service: Service } | { kind: 'new' };

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [modal, setModal] = useState<ModalMode>({ kind: 'closed' });
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  async function reload() {
    const { db } = getFirebase();
    const snap = await getDocs(query(collection(db, 'services'), orderBy('order')));
    setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Service));
  }

  useEffect(() => {
    (async () => {
      try {
        await reload();
      } catch (err) {
        console.error(err);
        setToast({ message: 'No se pudo cargar los servicios.', variant: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function move(id: string, direction: -1 | 1) {
    const idx = services.findIndex((s) => s.id === id);
    const target = idx + direction;
    if (target < 0 || target >= services.length) return;

    const reordered = [...services];
    [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
    const updated = reordered.map((s, i) => ({ ...s, order: i + 1 }));
    setServices(updated);

    setReordering(true);
    try {
      const { db } = getFirebase();
      const batch = writeBatch(db);
      updated.forEach((s) => batch.update(doc(db, 'services', s.id), { order: s.order }));
      await batch.commit();
    } catch (err) {
      console.error(err);
      setToast({ message: 'No se pudo cambiar el orden.', variant: 'error' });
      await reload();
    } finally {
      setReordering(false);
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            {services.length} {services.length === 1 ? 'servicio publicado' : 'servicios publicados'} en la landing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ kind: 'new' })}
          className="group inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 hover:bg-eco-lime hover:text-black transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm uppercase tracking-[0.15em] font-medium">Nuevo servicio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc, idx) => (
          <article
            key={svc.id}
            className="group bg-white border border-gray-200 flex flex-col overflow-hidden hover:border-black transition"
          >
            <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
              {svc.imageUrl ? (
                <img src={svc.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-300">
                  <IconSvg name={svc.icon} className="h-10 w-10" />
                </div>
              )}
              <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-mono px-2 py-1 shadow-sm">
                #{idx + 1}
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(svc.id, -1)}
                  disabled={idx === 0 || reordering}
                  className="bg-white text-black p-1.5 shadow-sm hover:bg-eco-lime disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Mover arriba"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => move(svc.id, 1)}
                  disabled={idx === services.length - 1 || reordering}
                  className="bg-white text-black p-1.5 shadow-sm hover:bg-eco-lime disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                  title="Mover abajo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-eco-lime grid place-items-center text-black flex-shrink-0">
                  <IconSvg name={svc.icon} className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-black leading-snug pt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {svc.title || <em className="text-gray-400 font-normal">Sin título</em>}
                </h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                {svc.shortDesc || svc.fullDesc || <em className="text-gray-300">Sin descripción</em>}
              </p>

              <button
                type="button"
                onClick={() => setModal({ kind: 'edit', service: svc })}
                className="mt-5 inline-flex items-center justify-center gap-2 border border-black text-black px-4 py-2 hover:bg-black hover:text-eco-lime transition cursor-pointer text-xs uppercase tracking-[0.15em] font-medium"
              >
                Editar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </article>
        ))}

        {services.length === 0 && (
          <div className="col-span-full border border-dashed border-gray-300 p-16 text-center text-gray-400">
            <p className="text-sm">No hay servicios todavía.</p>
            <button
              type="button"
              onClick={() => setModal({ kind: 'new' })}
              className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-black border border-black px-4 py-2 hover:bg-black hover:text-eco-lime transition cursor-pointer font-medium"
            >
              Crear el primero
            </button>
          </div>
        )}
      </div>

      <ServiceModal
        mode={modal}
        onClose={() => setModal({ kind: 'closed' })}
        onSaved={async (msg) => {
          setModal({ kind: 'closed' });
          await reload();
          setToast({ message: msg, variant: 'success' });
        }}
        onError={(msg) => setToast({ message: msg, variant: 'error' })}
        existingCount={services.length}
      />

      {toast && <Toast message={toast.message} variant={toast.variant} onDone={() => setToast(null)} />}
    </div>
  );
}

interface ServiceModalProps {
  mode: ModalMode;
  onClose: () => void;
  onSaved: (message: string) => void | Promise<void>;
  onError: (message: string) => void;
  existingCount: number;
}

function ServiceModal({ mode, onClose, onSaved, onError, existingCount }: ServiceModalProps) {
  const open = mode.kind !== 'closed';
  const isNew = mode.kind === 'new';

  const empty: Service = {
    id: '',
    order: existingCount + 1,
    title: '',
    shortDesc: '',
    fullDesc: '',
    icon: 'clipboard',
    imageUrl: '',
    detailImages: [],
  };

  const [draft, setDraft] = useState<Service>(empty);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (mode.kind === 'edit') {
      setDraft(mode.service);
      setConfirmDelete(false);
    } else if (mode.kind === 'new') {
      setDraft({ ...empty, order: existingCount + 1 });
      setConfirmDelete(false);
    }
  }, [mode]);

  function update<K extends keyof Service>(key: K, value: Service[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    if (!draft.title.trim()) {
      onError('El título es obligatorio.');
      return;
    }
    setSaving(true);
    try {
      const { db } = getFirebase();
      const id = isNew ? slugify(draft.title) : draft.id;
      const { id: _ignore, ...data } = draft;
      await setDoc(doc(db, 'services', id), data);
      await onSaved(isNew ? 'Servicio creado.' : 'Cambios guardados.');
    } catch (err) {
      console.error(err);
      onError('No se pudo guardar. Revisa tu conexión o permisos.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (mode.kind !== 'edit') return;
    setSaving(true);
    try {
      const { db } = getFirebase();
      await deleteDoc(doc(db, 'services', mode.service.id));
      await onSaved('Servicio eliminado.');
    } catch (err) {
      console.error(err);
      onError('No se pudo eliminar.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={isNew ? 'Nuevo servicio' : `Editar servicio · #${draft.order}`}
      title={isNew ? 'Crear servicio' : draft.title || 'Sin título'}
      footer={
        <>
          {!isNew && (
            confirmDelete ? (
              <div className="flex items-center gap-2 mr-auto bg-red-50 border border-red-200 px-3 py-1.5 rounded">
                <span className="text-xs text-red-900">¿Eliminar?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="text-xs uppercase tracking-[0.15em] bg-red-600 text-white px-3 py-1.5 hover:bg-red-700 cursor-pointer font-medium disabled:opacity-60"
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={saving}
                  className="text-xs uppercase tracking-[0.15em] text-gray-600 px-2 py-1.5 hover:text-black cursor-pointer font-medium"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={saving}
                className="sm:mr-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-2 cursor-pointer font-medium transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3" />
                </svg>
                Eliminar
              </button>
            )
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black cursor-pointer disabled:opacity-50 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 hover:bg-eco-lime hover:text-black transition cursor-pointer disabled:opacity-60 text-sm uppercase tracking-[0.15em] font-medium"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Guardando…
              </>
            ) : (
              <>
                {isNew ? 'Crear' : 'Guardar'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </>
      }
    >
      <TextField label="Título" value={draft.title} onChange={(v) => update('title', v)} maxLength={80} placeholder="Nombre del servicio" />
      <TextArea label="Descripción corta" value={draft.shortDesc} onChange={(v) => update('shortDesc', v)} rows={2} maxLength={140} hint="Frase de una línea." />
      <TextArea label="Descripción completa" value={draft.fullDesc} onChange={(v) => update('fullDesc', v)} rows={6} maxLength={600} hint="Se muestra en la card y en el modal de detalle." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select label="Ícono" value={draft.icon} onChange={(v) => update('icon', v as Service['icon'])} options={SERVICE_ICONS} />
        <div className="grid place-items-center md:place-items-end">
          <div className="w-16 h-16 rounded-full bg-eco-lime grid place-items-center text-black">
            <IconSvg name={draft.icon} className="h-7 w-7" />
          </div>
        </div>
      </div>

      <ImageUploader
        label="Imagen principal"
        value={draft.imageUrl}
        onChange={(url) => update('imageUrl', url)}
        path="site/services"
        aspect="16/9"
        hint="Aparece como fondo de la card en la landing."
      />
    </Modal>
  );
}
