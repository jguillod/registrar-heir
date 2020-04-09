/**
 * @module helpers
 * @private
 */

/**
 * @param {string} key Test if a key is a fully qualified name (FQN). It contains one and only one '@'.
 * Form '@key' mean key of top registry.
 * @returns {boolean}
 * - `true` if FQN.
 * - `false`otherwise.
 */
const RegistryError = require('./registry-error');

/**
 * Pattern for a valid fqn as "namespace@key" or "@key".
 */
const pattern = /^([^@\n\r]*)@([^@\n\r]+)$/;

/**
 * Test if a key is a fully qualified name.
 * @param {string|symbol} key 
 * @returns `true` if valid.
 */
function isFullyQualifiedName(key) {
    return typeof key === 'string' && pattern.test(key);
}

/**
 * Test if namespace or key is of valid types (string or symbol).
 * @param {string|symbol|*} key 
 * @returns `true` if valid.
 */
function isKeyTypeOK(key) {
    return (typeof key === 'string' && key.length > 0) || typeof key === 'symbol';
}

// /**
//  * 
//  * @param {string} fqn fully qualified name
//  * @returns {object} with either of:
//  * - `{ namespace, key, fqnFound: true }`
//  * - `{ key, fqnFound: true }` when fqn is `@key`
//  * - `{fqnFound: false}` when fqn is not a well formatted FQN.
//  */
// function fqnToNamespaceKey(fqn) {
//     const res = pattern.exec(fqn);
//     return res ? (res[1] === '' ? {
//         key: res[2],
//         fqnFound: true
//     } : {
//         namespace: res[1],
//         key: res[2],
//         fqnFound: true
//     }) : {
//         fqnFound: false
//     };
// }

/**
 * Check if params can construct an object {namespace, key, fqnFound}
 * @param {string|symbol} ns either of : Symbol | namespace string | fqn
 * @param {string|symbol} [key] either of (Symbol | string | *). The key if namespace is not a fqn.
 * Parameters together are one of:
 * - ('namespace@key')
 * - ('@key')
 * - (namespace, key)
 * @returns {object} like `{namespace, key, fqnFound}`.  
 * - `fqnFound` is `true` if namespace is a FQN.
 * @throws RegistryError when tuple (namespace, key) was not resolved.
 */
function resolveArgs(ns, key) {
    const result = {};
    if (typeof ns === 'symbol') {
        result.namespace = ns;
        if (key != null) result.key = key;
        return result;
    };
    if (isFullyQualifiedName(ns)) {
        const res = pattern.exec(ns);
        return (res[1] === '') ? {
            key: res[2],
            fqnFound: true
        } : {
            namespace: res[1],
            key: res[2],
            fqnFound: true
        };
    }
    if (isKeyTypeOK(ns)) {
        result.namespace = ns;
        if (isKeyTypeOK(key)) result.key = key;
        return result;
    }
    throw new RegistryError(`(namespace, key) | (fqn) : invalid arguments types, found:'${ns}', '${key}'`);
}

module.exports = {
    isKeyTypeOK,
    isFullyQualifiedName,
    // fqnToNamespaceKey, // exported for test
    resolveArgs,
};