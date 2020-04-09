> [![Build Status](https://travis-ci.com/jguillod/registrar-heir.svg?branch=master)](https://travis-ci.com/jguillod/registrar-heir)
[![NPM Version](https://img.shields.io/npm/v/@imed.ch/registrar-heir.svg)](https://npmjs.org/package/@imed.ch/registrar-heir)
[![Dependency Status](https://david-dm.org/jguillod/registrar-heir.svg?style=flat)](https://david-dm.org/jguillod/registrar-heir)
[![devDependency Status](https://img.shields.io/david/dev/jguillod/registrar-heir.svg?style=flat)](https://david-dm.org/jguillod/registrar-heir#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/jguillod/registrar-heir/badge.svg?branch=master)](https://coveralls.io/github/jguillod/registrar-heir?branch=master)
[![NPM](https://img.shields.io/github/license/jguillod/registrar-heir.svg)](LICENSE)


# @imed.ch/registrar-heir #

> A utility to manage registries with values having prototyping inheritance.

The idea is simply to have maps of (key, value) where a map can inherit from another map, i.e. if a key is missing in child map it can be found in parent map. This is like the standard proto inheritance of Javascript but this utility offers a transparent API and allows to manage many registries with a registrar manager.

## Install ##

	npm i -S @imed.ch/registrar-heir

## Nomenclature ##

This module manages 1..n registrars, each managing 1..n registries of values.

- a **factory** provides the interface to instanciate registrars or to retrieve existing ones.
- a **registrar** manages a set of registries.
- **id** is a unique value (any type) to identifiy a registrar.
- a **registry** contains a map of data properties (its values).
- a **registry** is identified by a **namespace** which is unique for a registrar and is of type `Symbol` or `string` (excluding character `@`).
- a **data property** is a (key value) tuple. When member of a registry values we say it is _owned_ by the registry.
- a **key** is a `Symbol` or `string` (excluding character `@`).
- a **fully qualified namespace** (FQN, fqn) for a registrar is the concatenation of `namespace` `@` `key` for strings or a tuple (namespace, key) if one is a Symbol. Valid namespace strings are : `ch.imed.types@device`, `@device` (default namespace is the top registry).
- a registry must **inherit** from another registry of the same registrar.
- a **top registry** is created with a new registrar and has no parent to inherit from.
- getting a value by key returns the owned `registry[key]` value or an ancestor registry value for the key, up to a top registry (namespace ''). Inheritance is prototype based

## API Summary ##
> see detailed [documentation](#documentation).

You should never instanciate a registrar or a registry with `new` but through factory:



### Factory

```js
const { ids, Registrar, SafeRegistrar } = require('@imed.ch/registrar-heir');

// Functions
ids() → {Array}                             // get registrar ids
Registrar(id) → {Registrar}                 // factory to make a new registrar or get an existing one
SafeRegistrar(id) → {Registrar|undefined}   // get an existing registry (do not make a new one)
```

### Registrar

```js
var id = 'city';
var officer = Registrar(id);              // make a registrar or get an existing one
// var topRegistry = officer.Registry();  // always instanciated at registrar instanciation

// Getters
officer.id → string|Symbol               // get the id this registrar was created with
officer.namespaces → Array               // get all namespaces for registry owned by this registrar

// Functions
officer.Registry(namespace [, parentRegistry = topRegistry]) → {RegistryHeir} // registry factory
officer.hasRegistry(namespaceOrFqnOrRegistry)                → {boolean} // test if registry exists
officer.get(namespaceOrFQN [, keyOrUndefined])               → {value} // alias to registry.key
officer.has(namespaceOrFQN [, keyOrUndefined])               → {boolean} // alias to registry.has
officer.keys(namespaceOrFQN)                                 → {Array} // alias to registry.keys
officer.own(namespaceOrFQN [, keyOrUndefinedopt])            → {boolean} // alias to registry.own
officer.ownKeys(namespaceOrFQN)                              → {Array} // alias to registry.ownKeys
officer.remove(namespaceOrFQN [, keyOrUndefinedopt])         → {boolean}  // alias to registry.remove
officer.set(namespaceOrFQN [, keyOrValue], value [, force])  → {*} // alias to registry.set
officer.setAlias(namespaceOrFQN, key, aliases)               → {string|Symbol}  // alias to registry.setAlias
```

### Registry

```js
// type of key => string | Symbol
var namespace = 'org.standard';
var registry = registrar.Registry(namespace);

// Getters
registry.namespace                 → string|symbol  // get the namespace of this registry
registry.keys                      → Array          // get the keys of this registry
registry.ownKeys                   → Array          // get the own of this registry

// Functions
registry.get(key)                  → value           // get value for a key
registry.set(key, value [, force]) → value | throw RegistryError if force !== true && key-value already owned
registry.remove(key)               → {boolean}       // remove a key value
registry.setAlias(key, aliases)    → key             // set an [array of] alias for the key
registry.has(key)                  → {boolean}       // test if registry has a value for the key
registry.own(key)                  → {boolean}       // test if a value for the key is owned by this registry
registry.getToTop(key)             → {Array}         // get a list of values for this key,
//                                                      from this registry to the top registry
```

### Error

In case of a malformed or wrong types of namespace or key, or any other error this module raises, a `RegistryError` is thrown with an explanation message.

## Usage by example ##

```js
// Try this step by step in a shell terminal:
const Factory = require('..');
let registrar = Factory.Registrar('city');
let standardRegistry = registrar.Registry('org.standard');
let imedRegistry = registrar.Registry('ch.imed', standardRegistry); // inherit from standard registry
let topRegistry = registrar.Registry();
registrar.set('@image', {type: 'tiff'}); // => { type: 'tiff' }
  // in top registry, same as : topRegistry.set('image', {type: 'tiff'});
topRegistry.get('image'); // => { type: 'tiff' }
standardRegistry.set('image', {type: 'GIF'}); // => { type: 'GIF' }
 // or : registrar.set('org.standard@image', {type: 'GIF'});
 try {
  registrar.set('org.standard@image', {type: 'GIF'});
  // => RegistryError: [registrar] #set : value name 'image' already owned by registry 'org.standard', use force option
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
topRegistry.get('image'); // => { type: 'tiff' }
 // or : registrar.get(null, 'image'); // => { type: 'tiff' }
topRegistry.get('image'); // => { type: 'tiff' }
imedRegistry.set('video', 'mp4'); // => mp4
standardRegistry.set('music', 'classic'); // => classic

// #getToTop - getting values from a registry traversing to top registry:
const inspect = (o) => JSON.stringify(o);
// =>
// music => [{},{"org.standard":"classic"},{}]
// image => [{"ch.imed":{"type":"jpeg"}},{"org.standard":{"type":"png"}},{}]
// video => [{"ch.imed":"mp4"},{},{}]
// null => [{"ch.imed":{"image":{"type":"jpeg"},"video":"mp4"}},{"org.standard":{"image":{"type":"png"},"music":"classic"}},{}]
// => etc. (i.e. for each key an array of key-value, each item being the value of the key in )

let values = imedRegistry.getToTop()[0]['ch.imed']; // imedRegistry values assigned to an object
console.log('imedRegistry values :', inspect(values));
// => imedRegistry values : {"image":{"type":"jpeg"},"video":"mp4"}

console.warn('-- Be aware that you can update any object variable and it will be reflected to values inside registries');
console.log('before tagging :', inspect(imedRegistry.get('image'))); // => {"type":"jpeg"}
jpegType.tag = 'modified';
console.log('after tagging  :', inspect(imedRegistry.get('image'))); // => {"type":"jpeg","tag":"modified"}
console.warn('-- To prevent this behavior freeze your value before storing them in a registry, see Object#freeze');

values.tag = 'ch.imed tagged';
console.log('after tagging ch.imed :', inspect(imedRegistry.getToTop(), null, 2));
// => [{"ch.imed":{"image":{"type":"jpeg","tag":"modified"},"video":"mp4","tag":"ch.imed tagged"}},{"org.standard":{"image":{"type":"png"},"music":"classic"}},{}]
```


Read [documentation](#Documentation) and tests for more details.

## Tests ##

Modules for testing should be installed globally or locally as dev dependencies with&nbsp;:

```bash
npm i -g chai coveralls mocha nyc           # global install
npm i --save-dev chai coveralls mocha nyc   # local to module
```

Execute tests with&nbsp;:

```bash
npm test
```

## Documentation ##

To generate documentation you should have some installed modules :

### (a) either **globally** allong side [with one of JSDoc template](https://github.com/jsdoc/jsdoc#templates)&nbsp;:

```bash
npm install -g jsdoc minami
## if you prefer another template =>
npm install -g jsdoc better-docs
```

also update the "opts" property in `jsdoc.json` file :

```json
"opts": {
        ...,
        "template": "/usr/local/lib/node_modules/minami"
    }
```

where

- `minami` can be replaced by name of template your installed, like `better-docs`.
- `/usr/local/lib/node_modules/` is the global path to modules (OSX). You can find the correct path with&nbsp;:

    ```bash
    npm root -g
    # => /usr/local/lib/node_modules
    ```

 ### (b) or as **local** module dev-dependencies&nbsp;
 
    npm install --save-dev jsdoc minami

Build documentation with&nbsp:

	npm run docs

It will generate the documentation and open its `index.html` file. It's a shortcut of:

	npm run generate-docs
	npm run show-docs

Last command should open file `./docs/node-ifconfig.me/<version>/index.html` (e.g. `./docs/node-ifconfig.me/0.1.0/index.html`) in your browser.


## Release History ##
* 1.0.4 first stable release.
  -- Thu Apr 09 2020 21:30:45 GMT+0200 (GMT+02:00)
* 0.9.0 README, doc and tests completed
  -- 2020-04-07T23:48:03.538Z
* 0.2.6 added support for [pre-commit](https://github.com/observing/pre-commit).
* 0.2.5 cleaning
  -- Sun Jul 28 10:33:51 CEST 2019
* 0.1.0 base template
  -- Wed Jul 17 19:33:38 CEST 2019

## BACKERS ##

Find **registrar** helpful? Become a [backer](https://opencollective.com/jguillod#support) and support **registrar** with a monthly donation.

## SPONSORS ##

Use **registrar** at Work? Feel free to be a one time sponsor. Thanks for using this module.

[![click me](https://ko-fi.com/img/Kofi_Logo_Blue.svg)](https://ko-fi.com/elojes)

## ABOUT US ##

Please, feel free to visit our personal website [imed.ch](http://imed.ch) and have a look to IoT projects for HealthCare we are involved in with [eliiot technology](http://eliiot-technology.ch).
