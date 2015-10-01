# Junkbox™

This is a ranking of musics based on hastag.

this module, track a hastag specified by you.
Ex:
``` node index.js -it hashtag ```

and based this hastag the module find the music on spotify. Simply.


# How this works

Using Twitter Stream API, and recents Posts on Instagram, they track a hastag, and launch web sockets to front-end.
Where has two views,

The index, who is a "feed", showing every 5 seconds a new twitter, of this hastag. ``` localhost:3001/ ```

# Administrators

The Junkbox™ now have a Admin Zone where you can take a overview about all data.
In Admin you can start the Junkbox with a especific hashtag, and you can change it any time,
you have a analytic from the number of posts, in each social network, and the DJ's zone.

All in a beautyful interface...

to use Junkbox™ with ADMIN, just run
``` node main.js ```
and go to 
``` localhost:3000 ```


# NEW FEATURE

The junkbox now has a amazing feature, now you can save the tracked photos, to share.
to use this you just need run
``` node index.js -its hashtag ```
or use the adminstrator, they will save it for you :smile:


# That's all folks.

Thanks to use the Junkbox. :smile:

## licence
- MIT