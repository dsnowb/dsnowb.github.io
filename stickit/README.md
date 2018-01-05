# StickIt
StickIt is a sticky note emulating web app that places an emphasis on simplicity and ease of use. It allows users to create, move, resize and re-color virtual sticky notes on a virtual corkboard. For users, interactivity is familiar and intutive.

For developers, creating and modifying new notes is a simple process:
```
var someNote = new Note();  // instantiate a note
someNote.setfColor('#fff'); // set its color to white
someNote.sfx = someEffect;  // add a CSS animation effect 'someEffect'
```

## Features
- Practically unlimited sticky note creation
- Movement, resizing, and recoloring of sticky notes
- A title and content section per note
- Interaction-free persistence through local storage

## Installation
1. Download the source files from StickIt's repository: <https://www.github.com/dsnowb/stickit>
2. Open the index.html file in your browser of choice

## "API" Usage
Each note displayed on screen is a Note object. The Note() constructor function offers no parameters.
#### Global variables
###### mouseX and mouseY
the current xy-coordinates of the cursor, relative to the viewport.

#### Note function constructor properties
###### Note.arrCurlNames - *Array - Default: ['curl1','curl2','curl3','curl4','curl5','curl6']*
Used by *curl* on instantiation. Array of class names that correspond to note corner 'curl' effects found in style.css.
###### Note.notes - *Array - Default: []*
Array of all notes that currently exist (either rendered or unrendered as a result of *trashed*. Notes are added at instantiation.
###### Note.saveNotes()
Called by *save()* and *Note.onExit()*. Stores *Note.notes* into local storage.
###### Note.loadNotes()
Called by *init()*. Loads local storage into a temporary array, converts the (as a result of stringify) now generic objects back into Note objects, loads them into *Note.notes*, and renders them if they do not have a *trashed* value of true.
###### Note.onExit()
Called by *unload* events. Sets the sfx values for all notes to *'loadnote'* so that they will animate when the page reloads, then calls *Note.saveNotes()*

#### Note instance primitive properties:
###### coords - *Array - Default: [500,200]*
Elements [x,y] where x and y represent the top-left corner's position relative to the viewport.
###### height - *Number - Default: 250*
The note's height in pixels.
###### width - *Number - Default: 250*
The note's width in pixels.
###### title - *String - Default: 'My Note'*
The first of two content sections. Contains slightly enlarged "title" text. 12 character limit.
###### contents - *String - Default: empty string*
The second content section. Contains the "body" of the note text.
###### id - *String - Default: 'note'+Note.notes.length*
A unique identifier given to the top level DOM node of the note as its id property. It is of the format 'note'+*num* where *num* is the instance's position in the array of all notes that currently exist (*Note.notes*).
###### filterColor - *String - Default: '#ff0'*
The color of the note, which is created by applying filterColor's value as a background color to a semi-opaque element that is absolutely positioned directly over the note's highest level container, but under the content containers. **Note:** This value is not an exact representation of the background color, as the highest level container contains grey gradient shading.
###### maxTilt - *Number - Default: 5*
Sets the lowest and highest possible values generated for *tilt* on instantiation.
###### tilt - *Number - Default: random float between -maxTilt and maxTilt*
The amount of rotate (in degrees), performed using CSS's transform property, placed on the note's highest level container.
###### trashed - *Boolean - Default: false*
Determines whether a note will be rendered on page load. If trashed is true, the item will simply not be rendered to the screen. All other attributes remain unchanged.
###### sfx - *String - Default: 'newnote'*
Will be placed as a class in the class attribute of the highest level container of the object. This in turn correlates to CSS animations attached to that class name in style.css. 'newnote' makes the note waggle when rendered. 'loadednote' makes the note pop out of the screen. sfx is assigned to an empty string at the end of render(). 
###### curl - *String - Default: randomly selected element in Note.arrCurlNames*
Like sfx, will be a class on the highest level container. This correlates to CSS classes that define the type of 'curl' effect that note corners exhibit. This value is randomly assigned on instantiation from the array of possible curls.

#### Note instance function properties
###### unrender()
Unrenders the note from the screen by removing all of its elements from the DOM
###### render()
Renders the note to the screen. In order to do this, the render function:
1. Checks to see if the note is already on screen. If so, it unrenders the note before rendering it.
2. Creates all necessary DOM elements
3. Sets all relevant attributes of those DOM elements
4. Adds event listeners
5. Appends the created elements to the DOM
In addition, at a last step, render() sets the value of *sfx* to an empty string to avoid performing animations every time a note is re-rendered.
###### move(offsetX, offsetY)
Primarly called by *startMove()*. Updates *coords* with new xy-values based on the current mouse position relative to the viewport, as well as the two passed parameters, *offsetX* and *offsetY*. Following this update, *move()* calls *render()* which re-renders the note to the screen using the new *coord* values. The offset parameters represent the xy-distances between the cursor position and the top-left corner of the note.
###### nwseResize()
Primarily called by *startNWSEResize()*. Updates *width* and *height* based on the current cursor position relative to the viewport, then calls *render()* which re-renders the note with the new property values.
###### nsResize()
Primarily called by *startNSResize()*. Updates *height* based on the current cursor position relative to the viewport, then calls *render()* which re-renders the note with the new property values.
###### rewResize()
Primarily called by *startREWResize()*. Updates *width* based on the current cursor position relative to the viewport, then calls *render()* which re-renders the note with the new property values.
###### lewResize()
Primarily called by *startLEWResize()*. Updates *coord[0]* (the top-left corner's X value), as well as *width* based on the current cursor position relative to the viewport, then calls *render()* which re-renders the note with the new property values.
###### startMove()
Called by *mousedown* events on two of a note's DOM elements: the top margin and the filter, both of which can be clicked on near the top of the note. Determines the xy-offsets from the cursor to the top-left corner of the note, then calls *move()* in an interval, using the determined offsets as arguments.
###### startNWSEResize()
Called by *mousedown* events on one of a note's DOM elements: the resize element in the lower-right corner. Calls *nwseResize()* in an interval.
###### startNSResize()
Called by *mousedown* events on one of a note's DOM elements: the bottom margin. Calls *nsResize()* in an interval.
###### startLEWResize()
Called by *mousedown* events on one of a note's DOM elements: the left margin. Calls *lewResize()* in an interval.
###### startREWResize()
Called by *mousedown* events on one of a note's DOM elements: the right margin. Calls *rewResize()* in an interval.
###### stopInterval()
Called by *mouseup* events anywhere within the window. Clears any interval that is currently running.
###### save()
Called by both *keyup* and *change* events within the content elements of a note. Assigns both *title* and *contents* the values in their respective elements, and calls *Note.saveNotes()*, which saves those changes to local storage.
###### setfColor(color)
Called by *click* events on any of the color picker elements on a note. Assigns *filterColor* the value of *color*, then calls *render()* which re-renders the note with the updated color.
###### trash()
Called by *click* events on one of a note's DOM elements: the trash element in the upper-right corner. Assign *trashed* the value of true, calls *unrender()* to remove the note from the DOM, and calls *Note.saveNotes()* to save that change to local storage.

## Contribute
Issue tracker: <https://www.github.com/dsnowb/stickit/issues>

Source: <https://www.github.com/dsnowb/stickit>

## Support
Unsupported

## License
Stickit is licensed under the MIT license
