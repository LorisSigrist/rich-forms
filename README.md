# Rich Forms

A simple, framework-agnostic form-processing library for front-end developers.

Have you ever tried to make a form to input an array of Addresses? It's was a pain, right?
Modeling nested arrays and objects in HTML forms is a pain. Rich forms allows you to parse
a key-value based FormData object into a rich, nested object.

It uses the `name` attribute of the form elements to index into the final object.

## Example

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

    let number_of_addresses = 1;

    function handle_submit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = parse(formData);
        console.log(data); // { addresses: [ {street: '123 Main St', city: 'Anytown', zip: '12345'}] }
    }
</script>

<form>
    {#each Array(number_of_addresses) as _, i (i)}
        <input type="text" name="addresses[{i}].street" />
        <input type="text" name="addresses[{i}].city" />
        <input type="text" name="addresses[{i}]zip" />
    {/each}
    <button on:click={() => number_of_addresses++}>Add Address</button>
</form>
```

Rich-Forms only gives you the raw objects / arrays, it does not provide any validation. We recommend using
a schema-validation library like [Zod](https://www.zod.dev/) to validate the data.

## Installation

```bash
npm install rich-forms
```