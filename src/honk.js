// Basic state management for Vanilla JS
// Git repository: https://github.com/urtubeycarlos/honk-js
// Author: Carlos Urtubey

class Honk {
	constructor() {
		this.stores = new Map();
		this.drivers = {
			INDEXEDDB: localforage.INDEXEDDB,
			LOCALSTORAGE: localforage.LOCALSTORAGE,
			WEBSQL: localforage.WEBSQL,
		};
	}

	defineStore(store) {
		if (store instanceof HonkStore) {
			this.stores.set(store.name, store);
			return this.useStore(store.name);
		} else {
			throw new Error('Store must be an instance of "HonkStore"');
		}
	}

	useStore(name) {
		return this.stores.get(name);
	}
}

class HonkStore {
	constructor(name, driver) {
		this.name = name;
		this.states = {};
		this.actions = {};
		this.getters = {};
		localforage.setDriver(driver);
	}

	clear() {
		this.states = {};
		this.actions = {};
		this.getters = {};
		localforage.clear();
	}

	async defineState(name, value) {
		value = value || value === 0 ? 0 : await localforage.getItem(name);
		await localforage.setItem(name, value);
		this.states[name] = async (newValue) => {
			if (newValue !== undefined) {
				await localforage.setItem(name, newValue);
			}
			return await localforage.getItem(name);
		};
	}

	defineGetter(name, requiredStates, getter) {
		this.getters[name] = async () => {
			const stateValues = await Promise.all(
				requiredStates.map(async (state) => {
					const storedValueRef = this.states[state];
					if (storedValueRef) {
						return await storedValueRef();
					}
				})
			);

			const stateValuesObject = requiredStates.reduce(
				(acc, state, index) => {
					acc[state] = stateValues[index];
					return acc;
				},
				{}
			);

			return getter(stateValuesObject);
		};
	}

	defineAction(name, requiredStates, action) {
		this.actions[name] = (...args) => {
			const stateValues = requiredStates.reduce((acc, state) => {
				const storedValueRef = this.states[state];
				if (storedValueRef) {
					acc[state] = storedValueRef;
				}
				return acc;
			}, {});

			try {
				return action(stateValues, ...args);
			} catch (error) {
				console.error(`Error in action: ${name}`);
				console.error(error);
			}
		};
	}
}

window.honk = new Honk();
window.Honk = Honk;
window.HonkStore = HonkStore;
