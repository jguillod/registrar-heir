// Mandatory top registry, all other registries will inherit from default.

const RegistryHeir = require('./registry-heir');
const RegistryError = require('./registry-error');
const {
    isKeyTypeOK,
    resolveArgs, // {namespace, key, fqnFound}
} = require('./helpers');

/**
 * Public API  
 * This manager is wrapping registry functions and properties.
 * @module Registrar
 * @see {@link factory}
 */

// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
// console.log(...Reflect.ownKeys(REGISTRAR).sort());
// => id registry hasRegistry namespaces get set setAlias has own keys ownKeys
// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ

module.exports = function RegistrarManager(registrarId) {

    const id = registrarId; // store registrarId just for debugging, remember that it can be any value (see {@link factory})
    const ROOT_REGISTRY_NAME = Symbol(`top registry of registrar '${registrarId}'`);
    // set a map to store registries for this registrar:
    const REGISTRIES = {};
    // add it the top registry:
    REGISTRIES[ROOT_REGISTRY_NAME] = new RegistryHeir(ROOT_REGISTRY_NAME); // default top registry

    // ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
    // THE MANAGER as a proxy to registries 

    /**
     * @exports Registrar
    /** @lends module:Registrar
    */

    let manager = {

        /** @namespace */

        /**
         * instance
         * @property id - The id of this registrar.
         * @type {string|Symbol}
         * @instance
         */
        get id() {
            return id;
        },

        /**
         * Get a list of all namespaces registries in this registrar.
         * @property namespaces
         * @instance
         * @type {Array}
         */
        get namespaces() {
            return Object.keys(REGISTRIES).concat(Object.getOwnPropertySymbols(REGISTRIES));
        },

        // registry
        // ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
        Registry,

        /*
         * remove all registries and values from this registrar
         * TODO - VERSION 2
         */
        // clear: () => Registry.clear(),

        // registry
        // ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
        /**
         * Test if this registrar has a registry with a given namespace or QNF or registry.
         * @instance
s         * @param {string|symbol|Registry} namespaceOrFqnOrRegistry - The namespace registry or a FQN or a Registry.
         * @returns {boolean} - `true` if there is a registry with such a namespace name.
         */
        hasRegistry: (namespaceOrFqnOrRegistry) => {
            let namespace;
            if (namespaceOrFqnOrRegistry instanceof RegistryHeir) namespace = namespaceOrFqnOrRegistry._namespace;
            else {
                const solved = resolveArgs(namespaceOrFqnOrRegistry); // {namespace, key, fqnFound}
                namespace = ('namespace' in solved) ? solved.namespace : ROOT_REGISTRY_NAME;
            }
            return namespace in REGISTRIES;
        },


        // values
        // ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ        
        get, // (namespaceOrFQN, keyOrUndefined)
        set, // (namespaceOrFQN, keyOrValue, valueOrForce, forceOrUndefined)
        remove, // (namespaceOrFQN, keyOrUndefined)

        setAlias,

        /**
         * Test if a registry has a key value. See {@link Registry#has}
         * @instance
         * @param {string|symbol} namespaceOrFQN namespace (if key is given) or a fully qualifier name. See {@link Registrar#get}
         * @param {string|symbol} [keyOrUndefined] The key if not fqn.
         * @returns {boolean} - `true` if registry has the key. See {@link Registry#get}
         */
        has: (namespaceOrFQN, keyOrUndefined) => {
            const {
                key,
                registry
            } = namespaceKeyWithRegistry(namespaceOrFQN, keyOrUndefined);
            return registry.has(key);
        },
        /**
         * Test if a registry owns a key value. See {@link Registry#own}
         * @method own
         * @instance
         * @param {string|symbol} namespaceOrFQN namespace (if key is given) or a fully qualifier name. See {@link Registrar#get}
         * @param {string|symbol} [keyOrUndefined] The key if not fqn.
         * @returns {boolean} - `true` if registry has the key. See {@link Registry#get}
         */
        own: (namespaceOrFQN, keyOrUndefined) => {
            const {
                key,
                registry
            } = namespaceKeyWithRegistry(namespaceOrFQN, keyOrUndefined);
            return registry.own(key);
        },
        /**
         * Test if a registry has a key value. See {@link Registry#has}
         * @method keys
         * @instance
         * @param {string|symbol} namespaceOrFQN namespace (if key is given) or a fully qualifier name. See {@link Registrar#get}
         * @returns {Array} - List of accessible keys. See {@link Registry#ownKeys}
         */
        keys: (namespaceOrFQN) => {
            const registry = registryFor(namespaceOrFQN);
            return registry.keys;
        },
        /**
         * Get the keys owned by a registry. See {@link Registry#has}
         * @method ownKeys
         * @instance
         * @param {string|symbol} namespaceOrFQN namespace (if key is given) or a fully qualifier name. See {@link Registrar#get}
         * @returns {Array} - List of owned keys. See {@link Registry#ownKeys}
         */
        ownKeys: (namespaceOrFQN) => {
            const registry = registryFor(namespaceOrFQN);
            return registry.ownKeys;
        }

    };
    return Object.freeze(manager);


    /**
     * a Registry Maker for this registrar
     * @method registry
     * @instance
     * @param {string|symbol} namespace - The namespace registry.
     * @param {string|symbol|registry} [parentRegistry] - A registry this new instance values should inherit from (default is top parent.
     * This param is useless if registry with namespace already exists.
     * @returns {registry} The registry corresponding to namespace.
     */
    function Registry(namespace, parentRegistry) {
        const registry = registryFor(namespace);
        if (registry) return registry;
        parentRegistry = registryFor(parentRegistry);
        return registry ? registry : (REGISTRIES[namespace] = new RegistryHeir(namespace, (parentRegistry instanceof RegistryHeir) ? parentRegistry : ROOT_REGISTRY_NAME));
    }

    /*
     * @private
     * @param {string|symbol} namespace 
     * @param {string|symbol} [key]
     * @returns {object} as `{namespace, key, fqnFound, registry}`
     * - `fqnFound === true` when argument namespace was a FQN (argument key was ignored).
     */
    function namespaceKeyWithRegistry(namespace, key) {
        const solved = resolveArgs(namespace, key); // {namespace, key, fqnFound}
        if (!('namespace' in solved)) solved.namespace = ROOT_REGISTRY_NAME;
        solved.registry = REGISTRIES[solved.namespace];
        return solved;
    }

    /*
     * @private
     * @param {string|symbol} namespaceOrFQN namespace or a fully qualifier name. See {@link Registry#get}
     * @param {*} keyOrUndefined 
     */
    function registryFor(namespaceOrFQN) {
        // (namespace, key) or (fqn)
        if (namespaceOrFQN instanceof RegistryHeir) return namespaceOrFQN;
        const namespace = namespaceOrFQN ? (resolveArgs(namespaceOrFQN).namespace || ROOT_REGISTRY_NAME) : ROOT_REGISTRY_NAME;
        return REGISTRIES[namespace];
    }

    /**
     * For this registrar get the key value for a registery given by namespace
     * @see {@link Registry#get}
     * @method get
     * @instance
     * @param {string|symbol} namespaceOrFQN namespace (if key is given) or a fully qualifier name.
     * @param {string|symbol} [keyOrUndefined] The key if not fqn.
     * **Parameters together are one of:**
     * - ('namespace@key')
     * - ('@key')
     * - (namespace, key)
     * @returns {value} - the corresponding value.
     * @example 
     * value = registrar.get('some.namespace@some.key');
     * value = registrar.get('@key');
     * value = registrar.get(namespace, key); // use this form if either of namespace or key is a Symbol!
     */
    function get(namespaceOrFQN, keyOrValue) {
        // (namespace, key) or (fqn)
        const {
            fqnFound,
            key,
            namespace,
            registry
        } = namespaceKeyWithRegistry(namespaceOrFQN, keyOrValue);
        if (!registry) throw new RegistryError(`missing registry with namespace ${namespace}`);
        return registry.get(key);
    }

    /**
     * For this registrar set the key value for a registery given by namespace.
     * @method set
     * @instance
     * @param {string|symbol} namespaceOrFQN namespace (if key is given) or a fully qualifier name. See {@link Registrar#get}
     * @param {string|symbol} [keyOrValue]
     * @param {*} value A value to set.
     * @param {boolean} [force=false] If you update the data value then set force to `true`, otherwise
     * a ErrorRegistry will be thrown.
     * @returns {*} the value owned by this registry or an inherited value.
     * @throws {RegistryError} when a registry can not be deduced from namespaceOrFQN.
     */
    function set(namespaceOrFQN, keyOrValue, value /* or Force */ , force /* or undefined */ ) {
        // (namespace, key, ...rest) or (fqn, ...rest)
        const {
            fqnFound,
            key,
            namespace,
            registry
        } = namespaceKeyWithRegistry(namespaceOrFQN, keyOrValue);
        if (fqnFound) {
            force = value;
            value = keyOrValue;
        }
        if (!registry) throw new RegistryError(`missing registry with namespace ${namespace}`);
        return registry.set(key, value, force);
    }

    /**
     * Delete a key value.
     * @method remove
     * @instance
     * @param {string|symbol} namespaceOrFQN namespace (if key is given) or a fully qualifier name. See {@link Registrar#get}
     * @param {string|symbol} [keyOrUndefined] The key if not fqn.
     * @returns {boolean}
     * - `true` if own key value has been removed.
     * @example 
     * registrar.remove('some.namespace@some.key');
     * console.log(registrar.remove('@key') ? 'removed' : 'not removed');
     * registrar.remove(namespace, key); // use this form if either of namespace or key is a Symbol!
     */
    function remove(namespaceOrFQN, keyOrValue) {
        // (namespace, key) or (fqn)
        const {
            fqnFound,
            key,
            namespace,
            registry
        } = namespaceKeyWithRegistry(namespaceOrFQN, keyOrValue);
        if (!registry) throw new RegistryError(`missing registry with namespace ${namespace}`);
        return registry.remove(key);
    }

    /**
     * Define one or a list of alias for a key.
     * @method setAlias
     * @instance
     * @example
     * map.setAlias('add', 'addition');
     * map.setAlias('add', ['addition', 'add-op']);
     * @param {string|symbol} namespaceOrFQN namespace (if key is given) or a fully qualifier name. See {@link Registry#get}
     * @param {string|Symbol} key the key for data property
     * @param {string|Symbol|Array<string|Symbol>} aliases one alias or an list of aliases.
     * @returns {string|Symbol} `key`
     * @throws RegistryError if any alias is neither a symbol, nor a string,
     * or if it is already an owned key of this map.
     * @description CAVEATS :
     * - If `alias` is not owned by this registry but an inherited one it will be set and overloaded.
     * - If `value` for the key is a primitive, its value is copied for the alias but
     * any subsequent change to key value will not be reflected to alias, and neither
     * will it be if your set a new object as key value.
     * - If a key value is an inherited one (i.e. not owned by this registry), alias will point to it.
     */
    function setAlias(namespaceOrFQN, keyOrAlias, alias) {
        const {
            fqnFound,
            key,
            namespace,
            registry
        } = namespaceKeyWithRegistry(namespaceOrFQN, keyOrAlias);
        if (fqnFound) {
            alias = keyOrAlias;
        }
        return registry.setAlias(key, alias);
    }


};