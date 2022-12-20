const test = require('ava')
const createDiscreteDynamicsWorld = require('./helpers/create-discrete-dynamics-world.js')
const loadAmmo = require('./helpers/load-ammo.js')

// Load global Ammo once for all tests:
test.before(async t => await loadAmmo())

test.cb('setInternalTickCallback', t => {

  const world = createDiscreteDynamicsWorld()
  const timestep = 1 // integer is easy to assert
  const maxSubsteps = 0 // required for a stable callback timestep

  // Set up the callback:
  let expectedInvocations = 1
  const callback = (_world, _timestep) => {
    _world = Ammo.wrapPointer(_world, Ammo.btDiscreteDynamicsWorld)
    t.assert(Ammo.compare(_world, world))
    t.is(_timestep, timestep)
    if (--expectedInvocations < 1) t.end()
  }
  callback.pointer = Ammo.addFunction(callback, Ammo.INTERNAL_TICK_CALLBACK_SIGNATURE)
  Ammo.AdapterFunctions.prototype.setInternalTickCallback(world, callback.pointer)
  t.teardown(() => Ammo.AdapterFunctions.prototype.setInternalTickCallback(world, null))

  // Step the simulation and assert the behavior:
  world.stepSimulation(timestep, maxSubsteps)
})
