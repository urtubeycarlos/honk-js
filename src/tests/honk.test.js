// Initialize an instance of Honk for testing
const honk = new Honk();

// Tests for the Honk class
QUnit.module('Honk', function () {
	QUnit.test('defineStore() should add a new store', function (assert) {
		const store = new HonkStore('myStore', false);
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
QUnit.module('HonkStore', function () {
	QUnit.test('defineState() should define a new state', function (assert) {
		const store = new HonkStore('myStore', false);
		store.defineState('count', 0);
		assert.strictEqual(
			store.states.count(),
			0,
			'The state was defined successfully'
		);
	});

	QUnit.test('defineGetter() should define a new getter', function (assert) {
		const store = new HonkStore('myStore', false);
		store.defineState('count', 0);
		store.defineGetter('isPositive', ['count'], function (states) {
			return states.count > 0;
		});
		assert.strictEqual(
			store.getters.isPositive(),
			false,
			'The getter was defined successfully'
		);
	});

	QUnit.test('defineAction() should define a new action', function (assert) {
		const store = new HonkStore('myStore', false);
		store.defineState('count', 0);
		store.defineAction('increment', ['count'], function (states) {
			states.count(states.count() + 1);
		});
		store.actions.increment();
		assert.strictEqual(
			store.states.count(),
			1,
			'The action was executed successfully'
		);
	});

	QUnit.test(
		'defineActionAsync() should define a new async action',
		async function (assert) {
			try {
				const done = assert.async(); // Get the "done" function from QUnit to control test completion

				const store = new HonkStore('myStore', false);
				store.defineActionAsync('fetchData', [], async function () {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve('Data received');
						}, 1000); // Simulate a 1000ms delay
					});
				});

				const result = await store.actions.fetchData();
				assert.strictEqual(
					result,
					'Data received',
					'The async action was executed successfully and returned the expected data'
				);

				done(); // Marca el test como completado
			} catch (error) {
				console.error(error);
			}
		}
	);
});
