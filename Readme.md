# LSDG Light Site

This is a simple webpage for controlling the light controller (a Raspberry Pi) for our lighting show. It's optimized for
a phone screen, since it's more likely that people will be using phones to control it, rather than laptops.

## Raspberry Pi Communication

The Raspberry Pi (rPi) connects to the site, and then sends a special `authenticate` message. This starts an
authentication process that allows us to be sure that the rPi is actually our rPi, and no one's attempting to spoof it.

After that, there's a very limited lexicon the rPi and website can speak to each other. Mostly it's event based from the
rPi, and command based from the website.

### Namespaces

The rPi communication will happen in a namespace called `rpi`, and the client side communication of the website will
happen in a namespace called `songctrl`.

### The `rpi` namespace

#### Authentication

The rPi will sign a challenge message sent by the site. Details TBD.

#### Raspberry Pi Events

These are events sent from the rPi to the website.

##### `song finished` Event

```javascript
{
    song: "song_filename.mp3"
}
```

This event is fired whenever the rPi finished playing a song. The `song` parameter is the filename of the song that
finished playing.

##### `song started` Event

** This event may not be useful. **

```javascript
{
    song: "song_filename.mp3"
}
```

This event is fired whenever the rPi starts playing a song. The `song` parameter is the filename of the song that
finished playing.

#### Raspberry Pi Commands

These are commands send from the website to the rPi.

##### `get status` Command

`No data`

Asks the rPi for it's current status.

###### Reply

```javascript
{
    playing: "song_filename.mp3" | "none"
}
```

The rPi is either playing a song, in which case `playing` will be the filename of the song, or it isn't playing anything,
in which case `playing` will be `"none"`.

##### `list songs` Command

`No data`

This asks the rPi to give us a list of all the songs it currently knows how to play. We expect the songs to be in the
format specified in the response.

###### Reply

```javascript
{
    songs: [
        {
            title: "Winter Wizard (Instrumental)",
            artist: "Trans-Siberian Orchestra",
            duration: 185,
            image: {
                small: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg',
                medium: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg',
                large: 'http://ecx.images-amazon.com/images/I/618lJLbXCiL._SL500_AA280_.jpg'
            },
            filename: "TSO - Winter Wizard.mp3"
        },
        ...
    ]
}
```

The rPi is expected to respond with a list, either empty or populated with song objects, as specified above.

##### `play next` Command

```javascript
{
    song: "song_filename.mp3"
}
```

This queues up the next song for the rPi to play as soon as it finished playing the current song. The `song` parameter
is the filename of the song to play next.

###### Reply

```javascript
{
    confirm: true
}
```

This is just a simple confirmation message that lets the website know the song has actually started playing, so it
should start updating it's display.

##### `stop` Command

`No data`

Tells the rPi to stop playing after the current song.

###### Reply

```javascript
{
    confirm: true
}
```

This is just a simple confirmation message that lets the website know once the rPi has finally stopped.

##### `stop immediately` Command

`No data`

Tells the rPi to stop playing immediately.

###### Reply

```javascript
{
    confirm: true
}
```

This is just a simple confirmation message that lets the website know once the rPi has finally stopped.

### The `songctrl` namespace

API TBD.