type Message = {
  optionId: string
  votes: number
} 

type Subscriber = (message: Message) => void

class VotingPubSub {
  private channels: Record<string, Subscriber[]> = {}// { 1218432: [ (message: Message) => void, (message: Message) => void ] }

  subscribe(pollId: string, subscriber: Subscriber) {
    if (!this.channels[pollId]) {
      this.channels[pollId] = []// [ 1218432: [] ]
    }

    this.channels[pollId].push(subscriber)// [ 1218432: [ (message: Message) => void ] ]
  }

  publish (pollId: string, message: Message) {
    if (!this.channels[pollId]) {
      return
    } 

    for (const subscriber of this.channels[pollId]) {
      subscriber(message)// (message: Message) => void
    }
  }
}

export const voting = new VotingPubSub()