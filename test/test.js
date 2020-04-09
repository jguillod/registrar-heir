return;

// Try this step by step in a shell terminal:
const Factory = require('..');
let registrar = Factory.Registrar('city');
let standardRegistry = registrar.Registry('org.standard');
let imedRegistry = registrar.Registry('ch.imed', standardRegistry); // inherit from standard registry
let topRegistry = registrar.Registry();
registrar.set('@image', {type: 'tiff'}); // => { type: 'tiff' }
  // in top registry, same as : topRegistry.set('image', {type: 'tiff'});
topRegistry.get('image'); // => tiff
standardRegistry.set('image', {type: 'GIF'}); // => { type: 'GIF' }
 // or : registrar.set('org.standard@image', {type: 'GIF'});
 try {
	registrar.set('org.standard@image', {type: 'GIF'}); // => RegistryError: [registrar] #set : value name 'image' already owned by registry 'org.standard', use force option
 } catch (error) {
	 console.error('CATCHED :', error.message);
 }
standardRegistry.set('image', {type: 'png'}, true); // => { type: 'png' }
topNamespace = topRegistry.namespace; // => Symbol(top registry of registrar 'city')
registrar.get(topNamespace, 'image'); // => { type: 'tiff' }
imedRegistry.get('image'); // => { type: 'png' }
 // or: registrar.get('ch.imed@image'); // => { type: 'png' }
 const jpegType = {type: 'jpeg'};
imedRegistry.set('image', jpegType); // => {type: 'jpeg'}
 // or : registrar.set('ch.imed@image', {type: 'jpeg'});
imedRegistry.get('image'); // => {type: 'jpeg'}
 // or registrar.get('ch.imed@image'); // => {type: 'jpeg'}
imedRegistry.get('image'); // => {type: 'jpeg'}
 // or : registrar.get('ch.imed', 'image'); // => {type: 'jpeg'}
standardRegistry.get('image'); // => { type: 'png' }
 // or : registrar.get('org.standard', 'image'); // => { type: 'png' }
topRegistry.get('image'); // => tiff
 // or : registrar.get(null, 'image'); // => tiff
topRegistry.get('image'); // => tiff
imedRegistry.set('video', 'mp4'); // => {type: 'jpeg'}
standardRegistry.set('music', 'classic'); // => { type: 'png' }

// #getToTop - getting values from a registry traversing to top registry:
const inspect = (o) => JSON.stringify(o, null, 2);
['music', 'image', 'video', null].forEach(key => console.log(key, '=>', inspect(imedRegistry.getToTop(key))));
let values = imedRegistry.getToTop()[0]['ch.imed']; // imedRegistry values assigned to an object
console.log('imedRegistry values :', inspect(values));
console.warn('-- Be aware that you can update any object variable and it will be reflected to values inside registries');
console.log('before tagging :', inspect(imedRegistry.get('image'))); // => {type: 'jpeg'}
jpegType.tag = 'modified';
console.log('after tagging  :', inspect(imedRegistry.get('image'))); // => {type: 'jpeg', tag: 'modified'}
console.warn('-- To prevent this behavior freeze your value before storing them in a registry, see Object#freeze');
values.tag = 'ch.imed tagged';
console.log('after tagging ch.imed :', inspect(imedRegistry.getToTop(), null, 2));
