// Basic state management for Vanilla JS
// Git repository: https://github.com/urtubeycarlos/honk-js
// Author: Carlos Urtubey

class Honk {
	constructor() {
		this.stores = new Map();
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
	constructor(name, persist) {
		this.name = name;
		this.states = {};
		this.actions = {};
		this.getters = {};
		this.__storage = persist ? localStorage : sessionStorage;
	}

	defineState(name, value) {
		this.__storage.setItem(name, JSON.stringify(value));
		this.states[name] = (newValue) => {
			if (newValue) {
				this.__storage.setItem(name, JSON.stringify(newValue));
			}
			const storedValue = this.__storage.getItem(name);
			return JSON.parse(storedValue);
		};
	}

	defineGetter(name, requiredStates, getter) {
		this.getters[name] = () => {
			const stateValues = requiredStates.reduce((acc, state) => {
				const storedValueRef = this.states[state];
				if (storedValueRef) {
					acc[state] = storedValueRef();
				}
				return acc;
			}, {});

			return getter(stateValues);
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

	defineActionAsync(name, requiredStates, asyncAction) {
		this.actions[name] = async (...args) => {
			const stateValues = requiredStates.reduce((acc, state) => {
				const storedValueRef = this.states[state];
				if (storedValueRef) {
					acc[state] = storedValueRef();
				}
				return acc;
			}, {});

			try {
				return await asyncAction(stateValues, ...args);
			} catch (error) {
				console.error(`Error in async action: ${name}`);
				console.error(error);
			}
		};
	}
}

window.Honk = Honk;
window.HonkStore = HonkStore;
