# HonkJS

HonkJS is a lightweight state management library for vanilla JavaScript.

## Features

-   **Store Management**: Define and use stores to manage application state.

-   **State Definition**: Define states within a store to hold data.

-   **Getter Definition**: Define getters to compute derived state based on existing states.

-   **Action Definition**: Define actions to modify states within a store.

-   **Asynchronous Actions**: Define asynchronous actions that can perform async operations.

-   **Persistence**: Choose between local storage or session storage for state persistence.

-   **Easy Integration**: Simple and easy-to-use API for integrating into your application.

## Installation

-   Just download HonkJS from [this link](https://github.com/urtubeycarlos/honk-js/releases/tag/v1) or from the releases section and include it in your project.
    `<script src="/example.com/path/to/honk.js"></script>`

Make sure to replace `/example.com/path/to/honk.js` with the actual path where the `honk.js` file is hosted.

By providing a download link and including the `honk.js` file using a `<script>` tag, users will be able to download and use the file by accessing your web page.
`<script src="https://example.com/path/to/honk.js"></script>`

## Usage

### Initialize Honk

    const honk = new Honk();

### Define a Store

    const store = new HonkStore('myStore', true);

    // Add the store to container and return it
    honk.defineStore(store);

### Define states

    store.defineState('count', 0);

### Define getters

    store.defineGetter('isPositive', ['count'], function (states)
    {
    	return states.count > 0;
    });

### Define actions

    store.defineAction('increment', ['count'], function (states) {
        states.count(states.count() + 1);
    });

### Use the store

    // Use the store
    const store = honk.useStore('myStore');

    // Access states
    console.log(store.states.count()); // Output: 0

    // Execute actions
    store.actions.increment();
    console.log(store.states.count()); // Output: 1

    // Access getters
    console.log(store.getters.isPositive()); // Output: true

## Development

To contribute to the project or develop additional features, follow these steps:

### Prerequisites

-   Node.js (version X.X.X)
-   NPM (version X.X.X)

### Installation

1. Clone the repository:
   `git clone https://github.com/urtubeycarlos/honk-js.git`

2. Navigate to the project directory:
   `cd honk-js`
3. Install the dependencies:
   `npm install`

### Development Server

To run the project in development mode with a live-reloading server, use the following command:

`npm run dev`

The development server will start, and you can access the project at `http://localhost:3000`. Any changes you make to the source code will automatically reload the application.

### Building for Production

To build the project for production, use the following command:

`npm run build`

The compiled and optimized files will be generated in the `dist` directory.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit/).
