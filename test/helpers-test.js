function X_describe() {}
const chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    assert = chai.assert;

const {
    isKeyTypeOK,
    isFullyQualifiedName,
    fqnToNamespaceKey,
    resolveArgs,
} = require('../lib/helpers');
const RegistryError = require('../lib/registry-error');

describe('#resolveArgs', () => {

    const NAME = 'any string';

    it('should throw an error if arguments are missing or wrong types', () => {
        expect(resolveArgs).to.throw(RegistryError);
        expect(resolveArgs.bind(null, Date)).to.throw(RegistryError);
        expect(resolveArgs.bind(null, {})).to.throw(RegistryError);
        expect(resolveArgs.bind(null, 1, 2)).to.throw(RegistryError);
    });

    it('should resolve a (fqn) arguments', () => {
        expect(resolveArgs('namespacename@keyname')).to.deep.equal({
            fqnFound: true,
            key: "keyname",
            namespace: "namespacename"

        });
    });

    it('should resolve a (fqn, two) arguments', () => {
        expect(resolveArgs('namespacename@keyname', 'some date')).to.deep.equal({
            fqnFound: true,
            key: "keyname",
            namespace: "namespacename"
        });
    });

    it('should resolve a (symbol, keyname) arguments', () => {
        const s = Symbol('namespace only');
        expect(resolveArgs(s, 'keyname')).to.deep.equal({
            key: "keyname",
            namespace: s
        });
    });
    it('should resolve a (symbol) arguments', () => {
        const s = Symbol('namespace only');
        expect(resolveArgs(NAME)).to.deep.equal({
            namespace: NAME
        });
    });

    it('should resolve a (string) arguments', () => {
        expect(resolveArgs(NAME)).to.deep.equal({
            namespace: NAME
        });
    });

    it('should resolve a (string, {}) arguments to namespace', () => {
        expect(resolveArgs(NAME)).to.deep.equal({
            namespace: NAME
        });
    });

    it('should resolve a (string, key) arguments', () => {
        let namespace = 'a-namespace',
        key = 'a-key';
        expect(resolveArgs(namespace, key)).to.deep.equal({
            namespace,
            key
        });
        namespace = Symbol(namespace);
        expect(resolveArgs(namespace, key)).to.deep.equal({
            namespace,
            key
        });
        key = Symbol(key);
        expect(resolveArgs(namespace, key)).to.deep.equal({
            namespace,
            key
        });
        namespace = 'a.string namespace';
        expect(resolveArgs(namespace, key)).to.deep.equal({
            namespace,
            key
        });
    });

});

describe('#isKeyTypeOK', () => {

    it('should returns true when key is a non empty string or a symbol', () => {
        expect(isKeyTypeOK('a string')).to.be.true;
        expect(isKeyTypeOK(Symbol())).to.be.true;
    });

    it('should returns false in any other cases', () => {
        expect(isKeyTypeOK('')).to.be.false;
        expect(isKeyTypeOK(0)).to.be.false;
        expect(isKeyTypeOK(false)).to.be.false;
        expect(isKeyTypeOK(true)).to.be.false;
        expect(isKeyTypeOK(Date)).to.be.false;
        expect(isKeyTypeOK({})).to.be.false;
        expect(isKeyTypeOK(Math)).to.be.false;
    });

});

describe('#isFullyQualifiedName', () => {
    const pattern = /^([^@\n\r]*)@([^@\n\r]+)$/,
        fqns = ['namespace@key', '@key'],
        bads = ['name@space@key', {}, Date, 'namespace@key\nkey', 'names\rpace@keykey', 'name@'];

    it('should be suffixed by @key', () => {
        expect(fqns.every(fqn => isFullyQualifiedName(fqn))).to.be.true;
    });

    it('should be a string with 1 line and 1 @', () => {
        expect(bads.every(bad => isFullyQualifiedName(bad))).to.be.false;
    });
});

// describe('#fqnToNamespaceKey', () => {
//     /*
//      * @param {string} fqn fully qualified name
//      * @returns {object} with either of:
//      * - `{ namespace, key, fqnFound: true }`
//      * - `{ key, fqnFound: true }` when fqn is `@key`
//      * - `{fqnFound: false}` when fqn is not a well formatted FQN.
//      */
//     it('should return { namespace, key, fnqFound } with a plain FQN', () => {
//         expect(fqnToNamespaceKey('namespace@key')).to.have.all.keys('namespace', 'key', 'fqnFound');

//     });

//     it('should return { key, fnqFound } with a a default namespace FQN', () => {
//         result = fqnToNamespaceKey('@key');
//         expect(result).to.have.all.keys('key', 'fqnFound');
//         expect(result).to.not.have.any.keys('namespace');
//         expect(result.key).to.equal('key');
//         expect(result.fqnFound).to.be.true;
//     });

//     it('should return { fnqFound: false } with an invalid FQN', () => {
//         result = fqnToNamespaceKey('namespace key');
//         expect(result).to.have.all.keys('fqnFound');
//         expect(result).to.not.have.any.keys('namespace', 'key');
//         expect(result.fqnFound).to.be.false;
//         result = fqnToNamespaceKey('namespace\nkey');
//         expect(result).to.not.have.any.keys('namespace', 'key');
//         expect(result.fqnFound).to.be.false;
//     });

// });