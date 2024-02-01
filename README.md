webcola-wasm [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
=======

This is a fork of **WebCola**, a JavaScript constraint based layout for high-quality graph visualization and exploration using D3.js and other web-based graphics libraries.

It uses Rust compiled to WebAssembly to speed up the performance of the library leading to up to 4x performance gains compared to just JavaScript code.

## Important Note

This port isn't 100% complete and differs very slightly in API from the original.  Notably:

 * The `start()` function now returns a `Promise` and must be awaited before interacting more with the WebCola instance.  This is due to the need to asynchronously compile WebAssembly under the hood.
 * Some features involving constraints are not yet ported to Wasm.
   * The `.flowLayout()` function doesn't work, and there may be others as well.
   * Setting `.constraints` on the layout doesn't work either

<p>
  <a href="http://marvl.infotech.monash.edu/webcola/examples/smallworldwithgroups.html">
    <img width="400" alt="Graph with simple groups" src="website/examples/smallworldwithgroups.png" />
  </a>
  <a href="http://marvl.infotech.monash.edu/webcola/examples/alignment.html">
    <img width="400" alt="Graph with alignment constraints" src="website/examples/alignment.png" />
  </a>
</p>

[Homepage with code and more examples](http://marvl.infotech.monash.edu/webcola)

Note: While D3 adaptor supports both D3 v3 and D3 v4, WebCoLa's interface is styled like D3 v3. Follow the setup in our homepage for more details.

Installation
------------

#### Browser:
```html
<!-- Minified version -->
<script src="https://webcola-wasm.ameo.design/cola.umd.production.min.js"></script>
<!-- Full version -->
<script src="https://webcola-wasm.ameo.design/cola.umd.development.js"></script>
```

#### Npm:

	npm install webcola --save

You can also install it through npm by first adding it to `package.json`:

    "dependencies": {
      "webcola": "latest"
    }
Then by running `npm install`.

#### Bower:

	bower install webcola --save

If you use TypeScript, you can get complete TypeScript definitions by installing [tsd 0.6](https://github.com/DefinitelyTyped/tsd) and running `tsd link`.

Building
--------

*Linux/Mac/Windows Command Line:*

 - install [node.js](http://nodejs.org)
 - install [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) and [Rust](https://rustup.rs/)
 - install the [Just](https://github.com/casey/just) command runner: `cargo install just`
 - Add WebAssembly support for Rust:

        rustup target add wasm32-unknown-unknown

 - from the WebCola directory:

        npm install

 - build + minify:

        npm run build

This creates the `cola.js` and `cola.min.js` files in the `WebCola` directory and generates `index.js` for npm

*Visual Studio:*

 - get the [typescript plugin](http://www.typescriptlang.org/#Download)
 - open webcola.sln

Running
-------

*Linux/Mac/Windows Command Line:*

Install the Node.js http-server module:

    npm install -g http-server

After installing http-server, we can serve out the example content in the WebCola directory.

    npm run website
    http-server website

The default configuration of http-server will serve the exampes on [http://localhost:8080](http://localhost:8080).
