ammo.js
=======

This is an updated version of [ammo.js](https://github.com/kripken/ammo.js) with additional classes and members exported and typings integrated, following the example of [ammojs-typed](https://github.com/giniedp/ammojs-typed)

Demos
-----

 * [Cubes](https://rawcdn.githack.com/kripken/ammo.js/99d0ec0b1e26d7ccc13e013caba8e8a5c98d953b/examples/webgl_demo/ammo.html)
 * [Cubes (WebAssembly)](https://rawcdn.githack.com/kripken/ammo.js/99d0ec0b1e26d7ccc13e013caba8e8a5c98d953b/examples/webgl_demo/ammo.wasm.html)
 * [SoftBody-Rope](https://rawcdn.githack.com/kripken/ammo.js/99d0ec0b1e26d7ccc13e013caba8e8a5c98d953b/examples/webgl_demo_softbody_rope/index.html)
 * [SoftBody-Cloth](https://rawcdn.githack.com/kripken/ammo.js/99d0ec0b1e26d7ccc13e013caba8e8a5c98d953b/examples/webgl_demo_softbody_cloth/index.html)
 * [SoftBody-Volume](https://rawcdn.githack.com/kripken/ammo.js/99d0ec0b1e26d7ccc13e013caba8e8a5c98d953b/examples/webgl_demo_softbody_volume/index.html)
 * [Heightmap](https://rawcdn.githack.com/kripken/ammo.js/99d0ec0b1e26d7ccc13e013caba8e8a5c98d953b/examples/webgl_demo_terrain/index.html)
 * [Vehicle](https://rawcdn.githack.com/kripken/ammo.js/99d0ec0b1e26d7ccc13e013caba8e8a5c98d953b/examples/webgl_demo_vehicle/index.html)


Overview
--------

**Example code to give you an idea of the API**:

 * https://github.com/kripken/ammo.js/blob/master/examples/webgl_demo/worker.js#L6 which interacts with https://github.com/kripken/ammo.js/blob/master/examples/webgl_demo/ammo.html#L14

ammo.js is a direct port of the [Bullet physics
engine](http://bulletphysics.org/) to JavaScript, using Emscripten. The source
code is translated directly to JavaScript, without human rewriting, so
functionality should be identical to the original Bullet.

'ammo' stands for "Avoided Making My Own js physics engine by compiling bullet
from C++" ;)

ammo.js is zlib licensed, just like Bullet.

Discussion takes place on IRC at #emscripten on Mozilla's server
(irc.mozilla.org)


Instructions
------------

The `dist` directory contains prebuilt javascript and WebAssembly files along with typings.

`builds/ammo.js` contains a prebuilt version of ammo.js. This is probably what you want.

You can also [build](#building) ammo.js yourself.

Usage
-----

The most straightforward thing is if you want to write your code in C++, and
run that on the web. If so, then you can build your C++ code with emscripten
normally and either build and link Bullet using

https://emscripten.org/docs/compiling/Building-Projects.html

or you can use Bullet directly from emscripten-ports, with `-s USE_BULLET=1`.
In both cases, you don't need ammo.js, just plain Bullet.

If, on the other hand, you want to write code in JavaScript, you can use the
autogenerated binding code in ammo.js. A complete example appears in

  `examples/hello_world.js`

That is HelloWorld.cpp from Bullet, translated to JavaScript. Other examples
in that directory might be useful as well. In particular see the WebGL
demo code in

  `examples/webgl_demo/ammo.html`

Bindings API
------------

ammo.js autogenerates its API from the Bullet source code, so it should
be basically identical. There are however some differences and things
to be aware of:

  * See https://github.com/kripken/emscripten/wiki/WebIDL-Binder
    for a description of the bindings tool we use here, which includes
    instructions for how to use the wrapped objects.

  * All ammo.js elements should be accessed through `Ammo.*`. For example,
    `Ammo.btVector3`, etc., as you can see in the example code.

  * Member variables of structs and classes can be accessed through
    setter and getter functions, that are prefixed with `|get_|` or `|set_|`.
    For example,

      `rayCallback.get_m_rayToWorld()`

    will get `m_rayToWorld` from say a `ClosestRayResultCallback`. Native
    JavaScript getters and setters could give a slightly nicer API here,
    however their performance is potentially problematic.

  * Functions returning or getting `float&` or `btScalar&` are converted to
    float. The reason is that `float&` is basically `float*` with nicer syntax
    in C++, but from JavaScript you would need to write to the heap every
    time you call such a function, making usage very ugly. With this change,
    you can do `|new btVector3(5, 6, 7)|` and it will work as expected. If
    you find a case where you need the float& method, please file an issue.

  * Not all classes are exposed, as only what is described in ammo.idl is
    wrapped. Please submit pull requests with extra stuff that you need
    and add.

  * There is experimental support for binding operator functions. The following
    might work:

    | Operator  | Name in JS |
    |-----------|------------|
    | `=`       | `op_set`   |
    | `+`       | `op_add`   |
    | `-`       | `op_sub`   |
    | `*`       | `op_mul`   |
    | `/`       | `op_div`   |
    | `[]`      | `op_get`   |
    | `==`      | `op_eq`    |

Building
--------

After setting up, you can build ammo.js with the `build` script: `npm run build`.

In order to build ammo.js yourself, you will need
[Emscripten](http://emscripten.org) and [cmake](https://cmake.org/download).

For more information about setting up Emscripten, see the [getting started
guide](https://emscripten.org/docs/getting_started).

To configure and build ammo into the `builds` directory, run the following:

  ```bash
  $ cmake -B builds
  $ cmake --build builds
  ```

There are also some key options that can be specified during cmake
configuration, for example:

  ```bash
  $ cmake -B builds -DCLOSURE=1                # compile with closure
  $ cmake -B builds -DTOTAL_MEMORY=268435456   # allocate a 256MB heap
  $ cmake -B builds -DALLOW_MEMORY_GROWTH=1    # enable a resizable heap
  ```

On windows, you can build using cmake's
[mingw](https://chocolatey.org/packages/mingw) generator:

  ```bat
  > cmake -B builds -G 'MinGW Makefiles'
  > cmake --build builds
  ```

Note that if you have not installed emscripten via the emsdk, you can configure
its location with `-DEMSCRIPTEN_ROOT`.

### Building using Docker

ammo.js can also be built with [Docker](https://www.docker.com).
This offers many advantages (keeping its native environment clean, portability, etc.).
To do this, you just have to install Docker and run:

  ```bash
  $ docker-compose build        # to create the Docker image
  $ docker-compose up           # to create the Docker container and build ammo.js
  $ docker-compose run builder  # to build again the ammojs targets after any modification
  ```

If you want to add arguments to cmake, you have to edit the `docker-compose.yml` file.

Reducing Build Size
-------------------

The size of the ammo.js builds can be reduced in several ways:

  * Removing uneeded interfaces from ammo.idl. Some good examples of this are `btIDebugDraw` and `DebugDrawer`, which are both only needed if visual debug rendering is desired.

  * Removing methods from the `-s EXPORTED_RUNTIME_METHODS=[]` argument in make.py. For example, `UTF8ToString` is only needed if printable error messages are desired from `DebugDrawer`.

Testing
-------

You can run the automatic tests with `npm test`, which in turn will run [ava](https://github.com/avajs/ava) against both the javascript and WebAssembly builds:

```bash
$ npm run test-js      # --> AMMO_PATH=builds/ammo.js ava
$ npm run test-wasm    # --> AMMO_PATH=builds/ammo.wasm.js ava
```

It's also possible to run ava directly for more options:

```bash
$ npx ava --verbose
$ npx ava --node-arguments inspect
```

When no `AMMO_PATH` is defined, `builds/ammo.js` is tested by default.

Running the Examples
--------------------

[http-server](https://github.com/http-party/http-server) is included as a dev
dependency as an easy way to run the examples. Make sure to serve everything
from the repo root so that the examples can find ammo in the `builds`
directory:

  ```bash
  $ npx http-server -p 3000 .
  ```

Troubleshooting
---------------

  * It's easy to forget to write |new| when creating an object, for
    example

      `var vec = Ammo.btVector3(1,2,3); // This is wrong! Need 'new'!`

    This can lead to error messages like the following:

      `Cannot read property 'a' of undefined`
      `Cannot read property 'ptr' of undefined`

    This is an annoying aspect of JavaScript, sadly.

Reporting Issues
----------------

If you find a bug in ammo.js and file an issue, please include a script
that reproduces the problem. That way it is easier to debug, and we can
then include that script in our automatic tests.


Release Process
---------------

Pushing a new build in `builds/ammo.js` should be done only after the
following steps:

  * Configure with [closure](https://github.com/google/closure-compiler)
    enabled: `cmake -B builds -DCLOSURE=1`

  * Build both the asm.js and wasm libraries: `cmake --build builds`

  * Make sure they pass all automatic tests: `npm test`

  * Run the WebGL demo in examples/webgl_demo and make sure it looks
    ok, using something like `firefox examples/webgl_demo/ammo.html`
    (chrome will need a webserver as it doesn't like file:// urls)

Upstream Version
----------------

Bullet is now a submodule within this repository. Ammo.js was last built with [Bullet 3.26](https://github.com/bulletphysics/bullet3/commit/6bb8d1123d8a55d407b19fd3357c724d0f5c9d3c).
