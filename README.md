# Rich Forms

A simple, framework-agnostic form-processing library for front-end developers.

Have you ever tried to make a form to input an array of Addresses? It's was a pain, right?
Modeling nested arrays and objects in HTML forms is a pain. Rich forms allows you to parse
a key-value based FormData object into a rich, nested object.

It uses the `name` attribute of the form elements to index into the final object.

## Installation

```bash
npm install rich-forms
```

## Example Usage

```html
<form>
	<input type="text" name="name" />
	<input type="text" name="address.street" />
	<input type="text" name="address.city" />
	<input type="text" name="address.zip" />
</form>
```

```javascript
import { parse } from "rich-forms";
const form = document.querySelector("form");
const formData = new FormData(form);
const data = parse(formData);
console.log(data);
/* 
{ 
    name: 'John Doe', 
    address: { 
        street: '123 Main St', 
        city: 'Anytown', 
        zip: '12345' 
    }
}
*/
```

It also integrates very well with component libraries like Svelte and Vue.

```html
<script>
    import { parse } from "rich-forms";

    function handle_submit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = parse(formData);
        console.log(data); // { addresses: [ {street: '123 Main St', city: 'Anytown', zip: '12345'}] }
    }

    let address_fields = [{id: 0}];

    function add_address() {
        address_fields.push({ id: Math.random() })
        address_fields = address_fields
    }

    function remove_address(id) {
        address_fields = address_fields.filter(f => f.id !== id)
    }
</script>

<form on:submit={handle_submit}>
    {#each address_fields as field, i (field.id)}
        <fieldset>
            <legend>Address {i}</legend>
            <input type="text" name="addresses[{i}].street" />
            <input type="text" name="addresses[{i}].city" />
            <input type="text" name="addresses[{i}]zip" />
            <button type="button" on:click={()=>remove_address(field.id)}>Remove Address</button>
        </fieldset>
    {/each}
    <button type="button" on:click={add_address}>Add Address</button>
</form>
```

Rich-Forms only gives you the raw objects / arrays, it does not provide any validation. We recommend using
a schema-validation library like [Zod](https://www.zod.dev/) to validate the data.

This could look something like this:

```javascript
import { parse } from "rich-forms";
import { z } from "zod";

const AddressSchema = z.object({
	street: z.string(),
	city: z.string(),
	zip: z.string()
});

const UserSchema = z.object({
	name: z.string(),
	addresses: z.array(AddressSchema)
});

const form = document.querySelector("form");
const formData = new FormData(form);

try {
	const data = parse(formData);
	const user = UserSchema.parse(data); // Validates that the Data has the correct shape. Returned object is typed.
} catch (error) {
	//Handle invalid data
}
```
