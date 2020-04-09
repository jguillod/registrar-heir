const RegistryError = require('./registry-error');
const {
    isKeyTypeOK,
} = require('./helpers');

/**
 * @protected0
 * @description
 * > IMPORTANT : you dont access directly to this class but instanciate it
 * with a {@link Registrar#registry}.
 * A map inherting from another map, i.e. if you get a data property
 * with a key which is not owned by this map, then it will follows
 * the inheritance from its ancestors maps.
 * @param {string|Symbol} namespace The namespace for this registry.
 * @param {Registry|null} parent The parent registry.
 */

class RegistryHeir {

    constructor(namespace, parent = null) {
        this._namespace = namespace; // used for errors
        this._parent = parent;
        const values = parent === null ? null : parent._values;
        this._values = Object.create(values);
    }

    /**
     * namespace of this registry.
     * @type {string|symbol}
     * @example
     * let ns = registry.namespace;
     */
    get namespace() {
        return this._namespace;
    }

    /**
     * Given a key returns the values for this key from this registry down to top.
     * If key is missing, returns the full own values of each registry.  
     * @param {String|Symbol} key - id or alias used for the value key. May be prefixed by the name of a registry, like "registry_name@key".
     * @returns {Array<object>}
     * - formatted : `[ {<namespace>: <own value for key> | <value>}, ... ]`
     * IMPORTANT : if you modify any object property a  level any value object it could be changed in the registry.
     * @example
     * let keyvalsToRoot = registry.getDownToRoot(key);
     * let valuesToRoot = registry.getDownToRoot();
     */
    getToTop(key = null) {
        let registry = this;
        const entries = [];
        if (key == null) {
            // i.e. null or undefined
            do {
                entries.push({
                    [registry._namespace]: registry._values
                });
            } while ((registry = registry._parent) !== null);
        } else
            do {
                entries.push({
                    [registry._namespace]: (registry.own(key) ? registry.get(key) : undefined)
                });
            } while ((registry = registry._parent) !== null);
        return entries;
    }

    /**
     * get the value for key from this registry.
     * @param {String|Symbol} key - id or alias used for the value key. May be prefixed by the name of a registry, like "registry_name@key".
     * @returns {*} - Returns the value.
     * @example
     * let color = registry.get('color');
     */
    get(key) {
        return this._values[key];
    }

    /**
     * Set a value for a key in this registry map.
     * @param {String|Symbol} key - Type or alias used for instanciating the value through the CharacteristicCoderFactory.
     * @param {*} value - value to set.
     * @param {boolean} [force=false] If there is alread a key-value in this map you must set force to `true`.
     * Not needed when the key-value is defined in an ancestor map,
     * @returns {*} 
     * - value that has been set.
     * @throws {RegistryError}
     * - when `force !== true && registry.own(key)`,
     * i.e. when key-value is already owned by this registry you must set `force` to `true`.
     * - when key is neither a `string` nor a `symbol`, or if value is `undefined` (use {@link RegistryHeir#remove}).
     * @example
     * registry.set('color', 'blue') // => blue
     * registry.set('color', 'red') // => RegistryError
     * registry.set('color', 'red', true) // => red
     */
    set(key, value, force = false) {
        // if (typeof key === 'undefined') throw new RegistryError(`#set : undefined key (registry '${this.namespace}')`);
        if (!isKeyTypeOK(key)) throw new RegistryError(`#set : key type string or symbol expected, found ${typeof key} (registry '${this.namespace}')`);
        if (typeof value === 'undefined') throw new RegistryError(`#set : undefined value (registry '${this.namespace}')`);
        var values = this._values;
        const exists = this.ownKeys.includes(key);
        if (exists && force !== true) throw new RegistryError(`#set : value name '${key.toString()}' already owned by registry '${this.namespace}', use force option`);
        values[key] = value;
        return value;
    }

    /**
     * 
     * @param {string|symbol} key 
     * @returns {boolean} `true` if key is an owned key of this map (and not an inherited key).
     * @example
     * if (registry.own('color')){ } // value is set in this registry (ignoring inherited one)
     */
    own(key) {
        return this.ownKeys.includes(key);
    }

    /**
     * 
     * @param {string|symbol} key 
     * @returns {boolean} `true` if key is an owned or inherited key of this map.
     * @example
     * if (registry.has('color')){ } // value is set in this registry or an inherited one
     */
    has(key) {
        return key in this._values; // in operator inherit proto
    }

    /**
     * All own keys for this map (not inherited ones).
     * @type {Array}
     * @example
     * if ('color' in regitry.ownKeys) console.log('registry has its own key color value');
     */
    get ownKeys() {
        return Reflect.ownKeys(this._values); // property : names + symbols
    }

    /**
     * All keys for this map, including inherited ones.
     * @type {Array}
     * @example
     * if ('color' in regitry.keys) console.log('registry can get a key color value');
     */
    get keys() {
        let keys = [],
            values = this._values;
        do {
            keys = keys.concat(Reflect.ownKeys(values));
        } while ((values = Object.getPrototypeOf(values)) !== null);
        return [...new Set(keys)]; // removes duplicates
    }

    /**
     * Remove an own key from this registry.
     * @param {string|symbol} key 
     * @returns {boolean} `true` if owned key value has been deleted.
     * @example
     * console.log(registry.remove('color') ? 'removed' : 'not removed');
     */
    remove(key) {
        return this.ownKeys.includes(key) ? delete this._values[key] : false;
    }

    /**
     * Define one or a list of alias for a key.
     * @type {object<key, alias>}
     * @example
     * map.setAlias('add', 'addition');
     * map.setAlias('add', ['addition', 'add-op']);
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
    setAlias(key, aliases) {
        if (!aliases || !key) return;
        if (!isKeyTypeOK(key)) throw new RegistryError(`#setAlias : key type string or symbol expected, found ${typeof key} (registry '${this.namespace}')`);
        // if (!values[key]) throw new RegistryError(`set alias : unknown key '${key}' (registry '${this.namespace}')`);
        const values = this._values;
        aliases = [].concat(aliases);
        const keys = this.ownKeys;
        aliases.forEach(alias => {
            if (!isKeyTypeOK(alias)) throw new RegistryError(`#setAlias : alias type string or symbol expected, found ${typeof alias} (registry '${this.namespace}')`);
            if (keys.includes(alias)) throw new RegistryError(`#setAlias : alias '${alias}' for key '${key}' already exists in map (registry '${this.namespace}')`);
            values[alias] = values[key];
        });
        return key;
    }

}

module.exports = RegistryHeir;