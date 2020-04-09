function X_describe() {}
function X_it() {}

// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
// REQUIRE
// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
const chai = require('chai'),
	expect = chai.expect;
	
const {
	Registrar: getRegistrar,
	ids,
	SafeRegistrar
} = require('..');
const RegistryError = require('../lib/registry-error');

// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
// CONSTANTS & UTILITIES
const DEFAULT_NS = 'my.namespace',
	MY_REGISTRAR_ID = 'civil officer';


function dumpRegistrar(registrar = REGISTRAR) {
	const namespaces = registrar.namespaces;
	console.log(' >---------------- DUMP ------------------->\n', ...namespaces);
	namespaces.forEach(ns => {
		console.log('==========');
		const reg = registrar.Registry(ns);
		console.log('ownKeys of', ns.toString(), ':', reg.ownKeys.map(key => `@${key} = ${reg.get(key)}`).join(', '));
		console.log('keys    of', ns.toString(), ':', reg.keys.map(key => `@${key} = ${reg.get(key)}`).join(', '));
	});
	console.log(' <---------------- DUMP -------------------<');
}

// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
// TESTS
// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
describe('registrar', function () {
	var REGISTRAR;

	describe('#factory', () => {

		const obj_as_id = {};

		it('throws an error when trying to make a registrar with no id', () => {
			expect(getRegistrar).to.throw();
		});
		it('its ids should be empty on startup', () => {
			const idss = ids();
			expect(idss).to.be.an('array');
			expect(idss).to.be.empty;
		});

		it('should make a new registrar when getting with unknown id', () => {
			REGISTRAR = getRegistrar(MY_REGISTRAR_ID);
		});

		it('can make registrar with an object as id', () => {
			const ra = getRegistrar(obj_as_id);
			expect(ra).to.have.any.keys('ownKeys', 'setAlias, keys' /* etc */ );
			expect(ra).to.equals(getRegistrar(obj_as_id));
		});

		it('returns an existing registrar when getting an existing id', () => {
			const ra = getRegistrar(obj_as_id);
			expect(ra.id).to.equals(getRegistrar(obj_as_id).id);
			expect(MY_REGISTRAR_ID).to.equals(REGISTRAR.id);
		});

		it('return the ids of all registrars', () => {
			expect(ids()).to.be.an('array').that.include(MY_REGISTRAR_ID, obj_as_id);
		});

		it('can safely get a registrar with an existing id or undefined with an unknown id', () => {
			expect(SafeRegistrar(MY_REGISTRAR_ID)).to.equals(REGISTRAR);
			expect(SafeRegistrar(obj_as_id)).to.equal(getRegistrar(obj_as_id));
		});
	});
});

// get(key, registryOwner = DEFAULT_REGISTRY)
// set(key, coder, registryOwner = DEFAULT_REGISTRY)
// delete(key, registryOwner)
// extend(registryOwner, registryParent = DEFAULT_REGISTRY)
describe('registrar', function () {
	const honfleur = {
			visit: 'Honfleur',
			address: "159 chemin de l'Epinette, F- 27210 Foulbec",
			website: 'www.vergerdelepinette.fr'
		},
		car_colorizer = {},
		default_colorizer = {},
		contract = {},
		address = {},
		city_key = "city",
		painter_key = "painter",
		house_key = "the white house as a key",
		key_alias = 'some alias';
	var REGISTRAR, BICYCLES, TOYOTA, CARS, REPAIRMAN, WORKS, LOCATION, DEFAULT;
	var makeRegistry;

	before(() => {

		REGISTRAR = getRegistrar(MY_REGISTRAR_ID);
		makeRegistry = REGISTRAR.Registry;
		DEFAULT = makeRegistry();

		LOCATION = makeRegistry('LOCATION'); //			 			         LOCATION > DEFAULT
		BICYCLES = makeRegistry('BICYCLES', LOCATION); //		  BICYCLES > LOCATION > DEFAULT
		CARS = makeRegistry('CARS', 'LOCATION'); //			 	      CARS > LOCATION > DEFAULT
		TOYOTA = makeRegistry('TOYOTA', CARS); //		     TOYOTA > CARS > LOCATION > DEFAULT
		WORKS = makeRegistry('WORKS'); //		 					 WORKS > LOCATION > DEFAULT
		REPAIRMAN = makeRegistry('REPAIRMAN', 'WORKS'); // REPAIRMAN > WORKS > LOCATION > DEFAULT


		DEFAULT.set('color', 'violet');
		// console.log('REGISTRIES', REGISTRAR.namespaces);
		// console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!');

	});

	describe('can extend other registry', function () {

		it('should return the correct registry by namespace', function () {
			// Check that
			// Check that
			expect(makeRegistry('LOCATION')).to.equal(LOCATION);
			expect(makeRegistry('WORKS')).to.not.equal(REPAIRMAN);
		});
	});

	describe('can get all nsNames', () => {
		it('', () => {
			const nsNames = REGISTRAR.namespaces;
			expect(nsNames).to.be.an('array');
			// expect(nsNames).to.have.all.keys(...[DEFAULT_NS, 'LOCATION', 'WORKS', 'CARS', 'BICYCLES', 'REPAIRMAN', 'TOYOTA']);})
		});
	});

	describe('#hasRegistry evaluate correctly for a namespace or FQN or Registry or else', () => {
		it('should  when there is no register for parent', function () {
			expect(REGISTRAR.hasRegistry('registre inconnu')).to.be.false;
			expect(REGISTRAR.hasRegistry(LOCATION)).to.be.true;
			expect(REGISTRAR.hasRegistry('LOCATION@somekey')).to.be.true;
			expect(REGISTRAR.hasRegistry.bind(REGISTRAR, Date)).to.throw(RegistryError);
		});

	});

	describe('have a defaut top registry', () => {
		it('should be equal to DEFAULT imported property', () => {
			expect(DEFAULT).to.be.an('object');
			expect(DEFAULT).to.be.an('object');
			expect(makeRegistry()).to.be.equal(DEFAULT);

		});
	});

	describe('have a get function', () => {

		it('should get the top registry with no parameters', () => {
			// 	* registrar.get()                       // -> top registry
			expect(REGISTRAR.Registry()).to.be.equal(DEFAULT);

		});
		//  * registrar.get('@phone')               // -> value in top registry
		//  * registrar.get('my-register')          // -> registry my-registry
		//  * registrar.get('my-register@phone')    // -> value in registry my-registry
		//  * registrar.get('my-register', 'phone') // -> value in registry my-registry


	});
	describe('have a static get property to return a keyed registry', () => {
		var AAA;
		before(() => {
			AAA = makeRegistry('AAA', DEFAULT);
		});

		it('should query for a registry by key', () => {
			expect(AAA).to.be.equal(makeRegistry('AAA'));
		});
		it('should query for a registry by key', () => {
			expect(AAA).to.be.equal(makeRegistry('AAA'));
		});
	});


	describe('can set a {key, value}', function () {
		it('should set the codec for a inexistant key and return the value', function () {
			LOCATION.set(city_key, honfleur);
			expect(LOCATION.get(city_key)).to.equal(honfleur);
		});

		it('should throw when setting a value for an existing key if force is not passed', function () {
			expect(function () {
				LOCATION.set(city_key, honfleur);
			}).to.throw(RegistryError);
		});

		it('should setting a value for an existing key if force=true', function () {
			const force = true;
			expect(LOCATION.set(city_key, honfleur, force)).to.equal(honfleur);
		});

		it('should throw when key is undefined', function () {
			expect(function () {
				LOCATION.set(null, default_colorizer);
			}).to.throw(RegistryError);
		});

		it('should throw when codec is undefined', function () {
			expect(function () {
				LOCATION.set(city_key);
			}).to.throw(RegistryError);
		});

		it('should throw when key is not a string or symbol', function () {
			expect(function () {
				LOCATION.set(Date);
			}).to.throw(RegistryError);
		});
	});

	describe('child registry owners', function () {
		it('should inherit the value from parent registry', function () {
			expect(CARS.get(city_key)).to.equal(honfleur);
			expect(BICYCLES.get(city_key)).to.equal(honfleur);
		});
		it('can define their own value to overload the parent registry one', function () {
			expect(CARS.set(city_key, car_colorizer)).to.equal(car_colorizer);
			expect(CARS.get(city_key)).to.equal(car_colorizer);
			expect(BICYCLES.get(city_key)).to.equal(honfleur);
		});
	});

	describe('setting a default value when no owner is specified', function () {
		it('should all child object inherit from it', function () {
			expect(DEFAULT.set(painter_key, default_colorizer), 'get value from default registry').to.equal(DEFAULT.get(painter_key));
			expect(LOCATION.get(painter_key), 'get value from default registry').to.equal(default_colorizer);
			expect(CARS.get(painter_key), 'iA2 inherit from B').to.equal(default_colorizer);
			expect(BICYCLES.get(painter_key), 'iA1 inherit from A').to.equal(default_colorizer);
			expect(WORKS.get(painter_key), 'B inherit from A').to.equal(default_colorizer);
		});
		it('should be overloaded when an other owner redefine the key', function () {
			WORKS.set(painter_key, contract);
			expect(REPAIRMAN.get(painter_key), 'iB inherit from B').to.equal(contract);
		});
		it('but should not change inherited value for other children owner', function () {
			expect(LOCATION.get(painter_key), 'default registry').to.equal(default_colorizer);
			expect(LOCATION.get(painter_key), 'A.get').to.equal(default_colorizer);
			expect(BICYCLES.get(painter_key), 'iA2 owner').to.equal(default_colorizer);
			expect(CARS.get(painter_key), 'iA1 owner').to.equal(default_colorizer);
			expect(WORKS.get(painter_key), contract, 'B.get');
			expect(REPAIRMAN.get(painter_key), contract, 'iB.get');
		});
	});

	describe('can get keys defined in an owner object registry', function () {
		it('get values by fully qualified names', () => {
			// dumpRegistrar();
			expect(REGISTRAR.get(`@${painter_key}`)).to.equal(default_colorizer);
			expect(REGISTRAR.get(`LOCATION@${painter_key}`)).to.equal(REGISTRAR.Registry(LOCATION).get(painter_key));
			expect(REGISTRAR.get(`CARS@${painter_key}`)).to.equal(REGISTRAR.Registry(CARS).get(painter_key));
		});

		it('get values by partial fully qualified names providing a @key', () => {
			expect(REGISTRAR.get(`@${painter_key}`)).to.equal(DEFAULT.get(painter_key));
		});

		X_it('throws an error if not a fully qualified names', () => {
			expect(REGISTRAR.get(null, painter_key)).to.throw();
			expect(REGISTRAR.get()).to.throw();
		});

		it('keys should includes all the keys set but not the other', function () {
			TOYOTA.set(house_key, default_colorizer);
			var keys = TOYOTA.keys;
			// console.log('A allkeys', A.keys);
			// console.log('>>>>>>> ROOT allkeys', DEFAULT.keys);
			// console.log('iA1 allkeys', iA1.keys);
			// console.log('ea allkeys', keys);
			// [ 'a third key', 'a first key', 'a second key' ]
			// dumpRegistrar();
			expect(keys).to.be.an('array').that.includes(painter_key, house_key, city_key);
			expect(keys).to.be.an('array').that.not.includes(key_alias);
		});

	});

	describe('Registrar#has a key', () => {
		it('by (namespace, key)', () => {
			expect(REGISTRAR.has('TOYOTA', painter_key)).to.be.true;
			expect(REGISTRAR.has('LOCATION', painter_key)).to.be.true;
			expect(REGISTRAR.has('CARS', painter_key)).to.be.true;
		});

		it('by (FQN)', () => {
			expect(REGISTRAR.has('TOYOTA@' + painter_key)).to.be.true;
			expect(REGISTRAR.has('LOCATION@' + painter_key)).to.be.true;
			expect(REGISTRAR.has('CARS@' + painter_key)).to.be.true;
		});
	});
	describe('Registrar#own a key', () => {
		it('by (namespace, key)', () => {
			expect(REGISTRAR.own('TOYOTA', painter_key)).to.be.false;
			expect(REGISTRAR.own('TOYOTA', house_key)).to.be.true;
			expect(REGISTRAR.own('LOCATION', city_key)).to.be.true;
			expect(REGISTRAR.own('LOCATION', painter_key)).to.be.false;
			expect(REGISTRAR.own('CARS', painter_key)).to.be.false;
			expect(REGISTRAR.own('CARS', city_key)).to.be.true;
		});

		it('by (FQN)', () => {
			expect(REGISTRAR.own('TOYOTA@' + painter_key)).to.be.false;
			expect(REGISTRAR.own('TOYOTA@' + house_key)).to.be.true;
			expect(REGISTRAR.own('LOCATION@' + city_key)).to.be.true;
			expect(REGISTRAR.own('LOCATION@' + painter_key)).to.be.false;
			expect(REGISTRAR.own('CARS@' + painter_key)).to.be.false;
			expect(REGISTRAR.own('CARS@' + city_key)).to.be.true;
		});
	});

	describe('Registrar#keys', () => {
		it('by (namespace)', () => {
			expect(REGISTRAR.keys('TOYOTA')).to.be.an('array');
			expect(REGISTRAR.keys('TOYOTA')).to.deep.equal(TOYOTA.keys);
			expect(REGISTRAR.keys('LOCATION')).to.be.an('array');
			expect(REGISTRAR.keys('LOCATION')).to.deep.equal(LOCATION.keys);
			expect(REGISTRAR.keys('CARS')).to.be.an('array');
			expect(REGISTRAR.keys('CARS')).to.deep.equal(CARS.keys);
		});

		it('by (FQN)', () => {
			expect(REGISTRAR.keys('TOYOTA')).to.be.an('array');
			expect(REGISTRAR.keys('TOYOTA')).to.deep.equal(TOYOTA.keys);
			expect(REGISTRAR.keys('LOCATION')).to.be.an('array');
			expect(REGISTRAR.keys('LOCATION')).to.deep.equal(LOCATION.keys);
			expect(REGISTRAR.keys('CARS')).to.be.an('array');
			expect(REGISTRAR.keys('CARS')).to.deep.equal(CARS.keys);
		});
	});

	describe('Registrar#ownKeys', () => {
		it('by (namespace)', () => {
			expect(REGISTRAR.ownKeys('TOYOTA')).to.be.an('array');
			expect(REGISTRAR.ownKeys('TOYOTA')).to.deep.equal(TOYOTA.ownKeys);
			expect(REGISTRAR.ownKeys('LOCATION')).to.be.an('array');
			expect(REGISTRAR.ownKeys('LOCATION')).to.deep.equal(LOCATION.ownKeys);
			expect(REGISTRAR.ownKeys('CARS')).to.be.an('array');
			expect(REGISTRAR.ownKeys('CARS')).to.deep.equal(CARS.ownKeys);
		});

		it('by (FQN)', () => {
			expect(REGISTRAR.ownKeys('TOYOTA')).to.be.an('array');
			expect(REGISTRAR.ownKeys('TOYOTA')).to.deep.equal(TOYOTA.ownKeys);
			expect(REGISTRAR.ownKeys('LOCATION')).to.be.an('array');
			expect(REGISTRAR.ownKeys('LOCATION')).to.deep.equal(LOCATION.ownKeys);
			expect(REGISTRAR.ownKeys('CARS')).to.be.an('array');
			expect(REGISTRAR.ownKeys('CARS')).to.deep.equal(CARS.ownKeys);
		});
	});


	describe('child owners register', function () {
		it('should not return the keys inherited from parent, only the overloaded one', function () {
			var keys = makeRegistry(LOCATION).ownKeys;
			var keysA = LOCATION.keys;
			expect(keys.length).to.not.equal(keysA.length);
		});
		it('but should still get the value of the parent keys', function () {
			expect(makeRegistry().get(house_key)).to.equal(makeRegistry(LOCATION).get(house_key));
		});
	});


	describe('can manage alias from an existing key', function () {

		it('should add an unknown alias key', function () {
			WORKS.set(house_key, address);
			expect(WORKS.get(house_key)).to.equal(address);
			WORKS.setAlias(house_key, key_alias);
			expect(WORKS.get(house_key)).to.equal(WORKS.get(key_alias));
		});
		it('should add an alias key by namespace', function () {
			expect(WORKS.remove(key_alias)).to.be.true;
			REGISTRAR.setAlias(`${WORKS.namespace}@${house_key}`, key_alias);
			expect(WORKS.get(house_key)).to.equal(WORKS.get(key_alias));
		});
		it('should add an alias key list by namespace', function () {
			const key_alias_2 = key_alias + "-two";
			expect(WORKS.remove(key_alias)).to.be.true;
			REGISTRAR.setAlias(`${WORKS.namespace}@${house_key}`, [key_alias, key_alias_2]);
			expect(WORKS.get(house_key)).to.equal(WORKS.get(key_alias));
			expect(WORKS.get(house_key)).to.equal(WORKS.get(key_alias_2));
			expect(WORKS.remove(key_alias_2)).to.be.true;
		});
		it('should return the key on success', () => {
			expect(WORKS.remove(key_alias)).to.be.true;
			expect(REGISTRAR.setAlias(`${WORKS.namespace}@${house_key}`, key_alias)).to.equal(house_key);
			expect(WORKS.remove(key_alias)).to.be.true;
			expect(WORKS.setAlias(house_key, key_alias)).to.equal(house_key);
			expect(WORKS.get(house_key)).to.equal(WORKS.get(key_alias));
		});

		it('should return undefined without args', () => {
			expect(WORKS.setAlias()).to.be.undefined;
		});

		it('should throw on adding an existing alias key', function () {
			expect(function () {
				WORKS.setAlias(house_key, key_alias),
					`set alias : alias '${key_alias}' already exists (key '${house_key}')`;
			}).to.throw(RegistryError);
		});


		it('otherwise should throw when key or alias are not string or symbol', function () {
			const obj = {};
			expect(function () {
					WORKS.setAlias(obj, 'aliasse');
				},
				`[registrar] #setAlias : key type string or symbol expected, found ${typeof obj}`).to.throw(RegistryError);
			expect(function () {
					WORKS.setAlias(house_key, obj);
				},
				`[registrar] #setAlias : alias type string or symbol expected, found ${typeof obj}`).to.throw(RegistryError);
		});
	});

	describe('can remove (delete) key-value from own registry', function () {
		it('and return true if key existed before delete, false otherwise', function () {
			const obj = {};
			expect(LOCATION.set(house_key, address)).to.equal(address);
			expect(LOCATION.own(house_key), 'check that key is still owned by LOCATION').to.be.true;
			expect(CARS.set(house_key, obj), 'set by inherited key to CARS').to.equal(obj);
			expect(CARS.own(house_key), 'check that key is owned by CARS').to.be.true;
			expect(LOCATION.own(house_key), 'check that key is still owned by LOCATION').to.be.true;
			expect(CARS.get(house_key), 'same key, values ≠ for CARS and LOCATION').to.not.equal(LOCATION.get(house_key));
			expect(BICYCLES.own(house_key), 'check that key is NOT owned by BICYCLES').to.be.false;
			expect(CARS.remove(house_key), 'remove key-value').to.be.true;
			expect(CARS.remove(new Date()), 'remove with inexisting random key').to.be.false;
		});
		it('should then get an undefined value', function () {
			// expect(LOCATION.remove(house_key), 'remove key-value').to.be.true;
			expect(CARS.own(house_key)).to.be.false;
		});
		it('should then get false on remove retry', function () {
			// expect(LOCATION.remove(house_key), 'remove key-value').to.be.true;
			expect(CARS.remove(house_key), 'remove key-value').to.be.false;
		});
		it('should not affect parent and other subchildren', function () {
			expect(LOCATION.get(house_key)).to.equal(address);
			expect(BICYCLES.get(house_key, BICYCLES), 'check key access by iA2 and A are same object').to.equal(LOCATION.get(house_key));
		});

		it('should remove by REGISTRAR -> FQN and return true 1st time, false on remove retry', () => {
			expect(REGISTRAR.set('CARS@' + house_key, address), 'set address to house_key in CARS').to.equal(address);
			expect(REGISTRAR.remove('CARS@' + house_key), 'remove key-value').to.be.true;
			expect(REGISTRAR.remove('CARS@' + house_key), 'remove key-value').to.be.false;

		});
		it('should remove by REGISTRAR -> (namespace, key, …) and return true 1st time, false on remove retry', () => {
			expect(REGISTRAR.set('CARS', house_key, address), 'set address to house_key in CARS').to.equal(address);
			expect(REGISTRAR.remove('CARS', house_key), 'remove key-value').to.be.true;
			expect(REGISTRAR.remove('CARS', house_key), 'remove key-value').to.be.false;

		});
	});

	// ˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉˉ
	// TODO : tests for Registry #getToTop


	describe('#getToTop', () => {
		const inspect = (o) => JSON.stringify(o, null, 2);
		let registrar,
			standardRegistry,
			imedRegistry,
			topRegistry,
			topNamespace;
		const jpegType = {
			type: 'jpeg'
		};

		before(function () {
			registrar = getRegistrar('city');
			standardRegistry = registrar.Registry('org.standard');
			imedRegistry = registrar.Registry('ch.imed', standardRegistry); // inherit from standard registry
			topRegistry = registrar.Registry();
			topNamespace = topRegistry.namespace; // => Symbol(top registry of registrar 'city')

			registrar.set('@image', {
				type: 'tiff'
			}); // => { type: 'tiff' }
			// in top registry, same as : topRegistry.set('image', {type: 'tiff'});
			// topRegistry.get('image'); // => tiff
			// standardRegistry.set('image', {
			// type: 'GIF'
			// }); // => { type: 'GIF' }
			// or : registrar.set('org.standard@image', {type: 'GIF'});
			// try {
			// 	registrar.set('org.standard@image', {
			// 		type: 'GIF'
			// 	}); // => RegistryError: [registrar] #set : value name 'image' already owned by registry 'org.standard', use force option
			// } catch (error) {
			// 	console.error('CATCHED :', error.message);
			// }
			standardRegistry.set('image', {
				type: 'png'
			}, true); // => { type: 'png' }
			// registrar.get(topNamespace, 'image'); // => { type: 'tiff' }
			// imedRegistry.get('image'); // => { type: 'png' }
			// or: registrar.get('ch.imed@image'); // => { type: 'png' }
			imedRegistry.set('image', jpegType); // => {type: 'jpeg'}
			// or : registrar.set('ch.imed@image', {type: 'jpeg'});
			// imedRegistry.get('image'); // => {type: 'jpeg'}
			// or registrar.get('ch.imed@image'); // => {type: 'jpeg'}
			// imedRegistry.get('image'); // => {type: 'jpeg'}
			// or : registrar.get('ch.imed', 'image'); // => {type: 'jpeg'}
			// standardRegistry.get('image'); // => { type: 'png' }
			// or : registrar.get('org.standard', 'image'); // => { type: 'png' }
			// topRegistry.get('image'); // => tiff
			// or : registrar.get(null, 'image'); // => tiff
			// topRegistry.get('image'); // => tiff
			imedRegistry.set('video', 'mp4'); // => {type: 'jpeg'}
			standardRegistry.set('music', 'classic'); // => { type: 'png' }

			// #getToTop - getting values from a registry traversing to top registry:
			// let values = imedRegistry.getToTop()[0]['ch.imed']; // imedRegistry values assigned to an object
			// console.log('imedRegistry values :', inspect(values));
			// console.warn('-- Be aware that you can update any object variable and it will be reflected to values inside registries');
			// console.log('before tagging :', inspect(imedRegistry.get('image'))); // => {type: 'jpeg'}
			// jpegType.tag = 'modified';
			// console.log('after tagging  :', inspect(imedRegistry.get('image'))); // => {type: 'jpeg', tag: 'modified'}
			// console.warn('-- To prevent this behavior freeze your value before storing them in a registry, see Object#freeze');
			// values.tag = 'ch.imed tagged';
			// console.log('after tagging ch.imed :', inspect(imedRegistry.getToTop(), null, 2));
		});

		it('should get all the values for the key from registry to top', () => {
			const expected = {
				music: [{},
					{
						"org.standard": "classic"
					},
					{}
				],
				image: [{
						"ch.imed": {
							"type": "jpeg"
						}
					},
					{
						"org.standard": {
							"type": "png"
						}
					},
					{}
				],
				video: [{
						"ch.imed": "mp4"
					},
					{},
					{}
				]
			};
			['music', 'image', 'video'].forEach((key, i) => {
				const toTop = imedRegistry.getToTop(key);
				// console.log('TRACE in expected  --> key =', key, i, JSON.stringify(expected[key]));
				// console.log('TRACE in toTop     --> key =', key, i, JSON.stringify(toTop));
				expect(JSON.stringify(expected[key])).to.equal(JSON.stringify(toTop));
			});

		});
		it('should get the whole values from registry to top', () => {
			const expected = [{
					"ch.imed": {
						"image": {
							"type": "jpeg"
						},
						"video": "mp4"
					}
				},
				{
					"org.standard": {
						"image": {
							"type": "png"
						},
						"music": "classic"
					}
				},
				{}
			];
			const toTop = imedRegistry.getToTop();
			// console.log('TRACE in expected  --> key =', key, i, JSON.stringify(expected[key]));
			// console.log('TRACE in toTop     --> key =', key, i, JSON.stringify(toTop));
			expect(JSON.stringify(expected)).to.equal(JSON.stringify(toTop));
		});
		it('should get the whole values from registry to top', () => {
			const expected = {
				"image": {
					"type": "jpeg"
				},
				"video": "mp4"
			};
			const values = imedRegistry.getToTop()[0]['ch.imed']; // imedRegistry values assigned to an object
			expect(JSON.stringify(expected)).to.equal(JSON.stringify(values));
		});
		it('should get the whole values from registry to top', () => {
			const before = {
					"type": "jpeg"
				},
				after = {
					"type": "jpeg",
					"tag": "modified"
				},
				expected = [{
						"ch.imed": {
							"image": {
								"type": "jpeg",
								"tag": "modified"
							},
							"video": "mp4",
							"tag": "ch.imed tagged"
						}
					},
					{
						"org.standard": {
							"image": {
								"type": "png"
							},
							"music": "classic"
						}
					},
					{}
				];
			let values = imedRegistry.get('image');
			expect(JSON.stringify(before)).to.equal(JSON.stringify(values));
			jpegType.tag = 'modified';
			values = imedRegistry.get('image');
			expect(JSON.stringify(after)).to.equal(JSON.stringify(values));
			values = imedRegistry.get();
			expect(JSON.stringify(expect)).to.equal(JSON.stringify(values));
		});

	});

});
