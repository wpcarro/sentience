let Transition = require('./transition.js')

class Agent {
  constructor(args) {
    this.object = args.object
    this.observables = args.observables
    this.policy = args.policy
    this.actions = args.actions
  }

  get state() {
    return this.observables.reduce(
      (arr, observable) => arr.concat(observable.features()), []
    )
  }

  beginTransition() {
    let state = this.state
    this.currentTransition = this._buildTransition(state)
  }

  rewardCurrentTransition(reward) {
    this.currentTransition.incrementReward(reward)
  }

  completeTransition() {
    let nextState = this.state
    let nextAction = this.policy.choose(nextState)

    this.currentTransition.complete(nextState, nextAction)
    this.policy.update(this.currentTransition)
  }

  perform(action) {
    this.object[action]()
  }

  _buildTransition(state) {
    let action = this.policy.choose(state)
    this.perform(action)

    return new Transition({
      state: state,
      action: action,
      reward: 0
    })
  }
}

module.exports = Agent
