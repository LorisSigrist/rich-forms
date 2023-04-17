import { makeObject } from "./populate";

export function parse(form: FormData | HTMLFormElement): Record<string, unknown> {
  const formData = form instanceof FormData ? form : new FormData(form);
  
  const key_val : Record<string, FormDataEntryValue> = {};

  for(const [key, value] of formData.entries()) {
    key_val[key] = value;
  }

  const object = makeObject(key_val);
  return object;
}