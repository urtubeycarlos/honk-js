// Initialize an instance of Honk for testing
const honk = new Honk();

// Tests for the Honk class
QUnit.module('Honk', function () {
	QUnit.test('defineStore() should add a new store', function (assert) {
		const store = new HonkStore('myStore', honk.drivers.INDEXEDDB);
		honk.defineStore(store);
		assert.strictEqual(
			honk.stores.size,
			1,
			'The store was added successfully'
		);
	});

	QUnit.test(
		'useStore() should return the specified store',
		function (assert) {
			const store = honk.useStore('myStore');
			assert.ok(
				store instanceof HonkStore,
				'The store was returned successfully'
			);
		}
	);
});

// Tests for the HonkStore class
QUnit.module('HonkStore', async function () {
	QUnit.test('Testing Honk', async function (assert) {
		// Create a new Honk instance
		const honk = new Honk();

		// Define a store
		const store = new HonkStore('myStore', localforage.INDEXEDDB);
		honk.defineStore(store);

		// Define a state in the store
		await store.defineState('counter', 0);

		console.log(await store.states.counter());

		// Get the store and the state value
		const myStore = honk.useStore('myStore');
		const value = await myStore.states.counter();
		assert.equal(value, 0, 'State "counter" is initialized with 0');

		// Update the state value
		await myStore.states.counter(10);
		const newValue = await myStore.states.counter();
		assert.equal(newValue, 10, 'State "counter" is updated to 10');

		store.defineGetter('doubleCounter', ['counter'], async (states) => {
			return states.counter * 2;
		});

		// Get the getter value
		const result = await store.getters.doubleCounter();
		assert.equal(
			result,
			20,
			'Getter "doubleCounter" returns 20 (double of 10)'
		);

		// Define an action
		myStore.defineAction(
			'incrementCounter',
			['counter'],
			async ({ counter }) => {
				const actualCounter = await counter();
				await counter(actualCounter + 1);
			}
		);

		// Call the action
		await myStore.actions.incrementCounter();

		// Get the updated state value
		const updatedValue = await myStore.states.counter();
		assert.equal(
			updatedValue,
			11,
			'Action "incrementCounter" increases the counter to 11'
		);
	});
});
