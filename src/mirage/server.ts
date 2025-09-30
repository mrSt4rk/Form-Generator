import type { Form } from '@/types';
import { createServer, Model } from 'miragejs'

type MirageForm = Form;
const uid = () => Math.random().toString(36).slice(2, 10);

export function startMirage() {
  createServer({
    models: { form: Model.extend<Partial<MirageForm>>({}) },
    seeds(server) {
      server.create("form", {
        id: uid(),
        name: "Customer Intake",
        elements: [
          { id: "name", type: "text", label: "Full name", isRequired: true },
          {
            id: "topics",
            type: "checkbox",
            label: "Topics",
            choices: [{ id: "tech", name: "Tech" }, { id: "music", name: "Music" }],
          },
        ],
      } as MirageForm);
    },
    routes() {
      this.namespace = 'api'
      this.get("/forms", (schema: any) => {
        const all = schema.all("form").models;
        return { forms: all };
      });
    }
  })
}
