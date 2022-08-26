# FaunaDB

To enabling FaunaDb, you need
 * A account on the website of [FaunaDb](https://dashboard.fauna.com/accounts/login)
 * A [Database with a choosen "Region Group"](https://dashboard.fauna.com/?createDb=true) (save the region endpoint on your computer)
 * A secret key for this Database with Role : "Admin". (save it on your computer)

You can copy/past this code bellow to create the Collections & the Indexes 

```shell
CreateCollection({
  name: "ReactionCollection",
  history_days: 30,
  ttl_days: null
})

```

And after that : 

```shell
CreateIndex({
    name: "getReactionByEmoteAndItemChannelAndItemTs",
    unique: false,
    serialized: true,
    source: Collection("ReactionCollection"),
    terms: [{field: ["data", "reaction"]},{field: ["data", "item", "it_channel"]},{field: ["data", "item", "it_ts"]}]
  })
CreateIndex({
    name: "countReactionsByEmoteAndItemChannelAndItemTsFilteredByReactionsAndChannels",
    unique: false,
    serialized: true,
    source: Collection("ReactionCollection"),
    terms: [{field: ["data", "reaction"]},{field: ["data", "item", "it_channel"]},{field: ["data", "item", "it_ts"]}]
  })
```