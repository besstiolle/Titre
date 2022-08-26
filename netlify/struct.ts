
export class Reaction {

    type: string
    user: string
    reaction: string
    item_user: string
    item:Item
    event_ts:string

    constructor(o: object){
        this.type=o['type']
        this.user=o['user']
        this.reaction=o['reaction']
        this.item_user=o['item_user']
        this.item = new Item(o['item']['it_type'], o['item']['it_channel'], o['item']['it_ts'])
        this.event_ts = o['event_ts']
    }
}

export class Item{
    type:string
    channel:string
    ts:string

    constructor(type, channel, ts){
        this.type=type
        this.channel=channel
        this.ts=ts
    }
}

/**
 * 
//https://api.slack.com/events/reaction_added
{
    "type": "reaction_added",
    "user": "U024BE7LH",
    "reaction": "thumbsup",
    "item_user": "U0G9QF9C6",
    "item": {
        "type": "message",
        "channel": "C0G9QF9GZ",
        "ts": "1360782400.498405"
    },
    "event_ts": "1360782804.083113"
}
 */