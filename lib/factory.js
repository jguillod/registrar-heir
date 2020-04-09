const RegistrarManager = require('./registrar');
const RegistryError = require('./registry-error');

const REGISTRAR_MANAGERS = new Map();

/**
 * Public API
 * IMPORTANT : real registry and value instances are never exposed!
 * @module factory
 * @example
 * const Factory = require('.');
 * let registrar = Factory.Registrar('city');
 * let standardRegistry = registrar.Registry('org.standard');
 * let imedRegistry = registrar.Registry('ch.imed', standardRegistry); // inherit from standard registry
 * let topRegistry = registrar.Registry();
 * registrar.set('@image', {type: 'tiff'}); // => { type: 'tiff' }
 *   // in top registry, same as : topRegistry.set('image', {type: 'tiff'});
 * topRegistry.get('image'); // => tiff
 * standardRegistry.set('image', {type: 'GIF'}); // => { type: 'GIF' }
 *  // or : registrar.set('org.standard@image', {type: 'GIF'});
 * registrar.set('org.standard@image', {type: 'GIF'}); // => RegistryError: [registrar] #set : value name 'image' already owned by registry 'org.standard', use force option
 * standardRegistry.set('image', {type: 'png'}, true); // => { type: 'png' }
 * topNamespace = topRegistry.namespace; // => Symbol(top registry of registrar 'city')
 * registrar.get(topNamespace, 'image'); // => { type: 'tiff' }
 * imedRegistry.get('image'); // => { type: 'png' }
 *  // or: registrar.get('ch.imed@image'); // => { type: 'png' }
 * imedRegistry.set('image', {type: 'jpeg'}); // => {type: 'jpeg'}
 *  // or : registrar.set('ch.imed@image', {type: 'jpeg'});
 * imedRegistry.get('image'); // => {type: 'jpeg'}
 *  // or registrar.get('ch.imed@image'); // => {type: 'jpeg'}
 * imedRegistry.get('image'); // => {type: 'jpeg'}
 *  // or : registrar.get('ch.imed', 'image'); // => {type: 'jpeg'}
 * standardRegistry.get('image'); // => { type: 'png' }
 *  // or : registrar.get('org.standard', 'image'); // => { type: 'png' }
 * topRegistry.get('image'); // => tiff
 *  // or : registrar.get(null, 'image'); // => tiff
 * topRegistry.get('image'); // => tiff
 * valuesToRoot = imedRegistry.getDownToRoot('image'); // => [ { type: 'jpeg' }, { type: 'png' }, { type: 'tiff' } ]
 * let valuesToRoot = registry.getDownToRoot(); // => 
 */
const factory = module.exports = {

    /**
     * registrar maker or retriever
     * @function
     * @param {*} id The unique registrar key. Can be any value.
     * @returns {registrar} A registrar object with 
     */
    Registrar: (registrarId) => {
        // no duplicate registrar with same id
        if (registrarId === undefined) throw new RegistryError('undefined registrar ID');
        let manager = REGISTRAR_MANAGERS.get(registrarId);
        if (manager) return manager;

        // safely make one
        manager = RegistrarManager(registrarId);
        REGISTRAR_MANAGERS.set(registrarId, manager); // safely make one
        return manager; // actually it is a wrapped one
    },

    /**
     * Return a list of ids to get registrars.
     * @function
     * @returns {Array}
     * @example
     * let registrar = factory.ids.length > -1 && factory.Registrar(factory.ids[0]); // provoded there is at least one
     */
    ids() {
        return [...REGISTRAR_MANAGERS.keys()];
    },

    /**
     * registrar retriever
     * @param {*} id The unique registrar key. Can be any value.
     * @returns {registrar|undefined}
     * - The corresponding registrar.
     * - `undefined` if there is no registrar for this id.
     */
    SafeRegistrar(registrarId) {
        return REGISTRAR_MANAGERS.get(registrarId);
    }

};