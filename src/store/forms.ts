import { create } from 'zustand'
import type { Form } from '@/types'

const STORAGE_KEY = 'react-form-generator.forms'

interface FormsState {
  forms: Form[]
  activeFormId: string | null
  setActiveForm: (id: string | null) => void
  upsertForm: (form: Form) => void
  deleteForm: (id: string) => void
  loadFromStorage: () => void
  saveToStorage: () => void
  fetchForms: () => Promise<Form[]>
}

export const useFormsStore = create<FormsState>((set, get) => ({
  forms: [],
  activeFormId: null,
  setActiveForm: (id) => set({ activeFormId: id }),
  upsertForm: (form) => {
    const forms = get().forms
    const idx = forms.findIndex(f => f.id === form.id)
    const updated = idx >= 0 ? [...forms.slice(0, idx), form, ...forms.slice(idx+1)] : [...forms, form]
    set({ forms: updated })
    get().saveToStorage()
  },
  deleteForm: (id) => {
    set({ forms: get().forms.filter(f => f.id !== id), activeFormId: null })
    get().saveToStorage()
  },
  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed: Form[] = JSON.parse(raw)
      set({ forms: parsed, activeFormId: parsed[0]?.id ?? null })
    } catch (e) {
      console.warn('خطا در دریافت مقادیر', e)
    }
  },
  saveToStorage: () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(get().forms)) }
    catch (e) { console.warn('خطا در ذخیره مقادیر', e) }
  },
  async fetchForms() {
    const res = await fetch("/api/forms");
    const data = await res.json(); 
    set({ forms: data.forms, activeFormId: data.forms[0]?.id ?? null });
    return data.forms;
  },
}))
