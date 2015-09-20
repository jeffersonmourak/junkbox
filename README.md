# Twitter-Spotify Junkbox

This is a ranking of musics based on hastag.

this module, track a hastag specified by you.
Ex:
``` node index.js "#hastag" ```

and based this hastag the module find the music on spotify. Simply.


# How this works

Using Twitter Stream API, they track a hastag, and launch web sockets to front-end.
Where has two views,

The index, who is a "feed", showing every 5 seconds a new twitter, of this hastag. ``` localhost:3000/ ```

The DJ, who is a "Administrator" page, they have all musics requesteds based on number of requests, and a feed showing the last twitters of this hastag. ``` localhost:3000/DJ ```


# That's all folks.

Thanks to use the Junkbox. :smile:

## licence
- MIT