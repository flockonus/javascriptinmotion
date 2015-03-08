(project halted in October 2011)

# JavaScript InMotion

The designer friendly 2D Canvas animation framework. Check **LIVE DEMO** on the description.

## What is the idea ?

This will be a JS Library that will have a Tween functionality like the ones seen in Flash for a while.
The main advantage will be the ease of use, make the animation process simple and productive, while maintaining the code customizable.
Several animations may run in parallel, through the handy InMotion.step() method
This library is able to paint on the same canvas along other librarys ('unobtrusive')

#### Code example

```js
var im = new InMotion('canvas_id'); // Set a InMotion

im.register( 'base', 'Some editor exported string here' ); // Bind a model structure to a name

im.create_animation('preview', 'base'); // Create a new animation from the registered model

im.play('preview'); // Set the animation as playing

routine = setInterval(loopPreview, 30 ); // set a animation routine

function loopPreview(){
  if( im.step(true) ) clearInterval( routine );
}
```


### Progress

Being able to preview animations - 21/10/2010
I decided that I would start by the editor leaving the animation core for when I had the data structure concise. *Done!*


### Features

* Animation Preview!
* There is an GUI bone (primitive) editor
* The shape supported now is: 'linear'
* Multiple Key Frames (shading the last bones from the past KF)
* Supporting a image(by url) as 'skin' to the bones
* Being able to move Bones
* Added a primitive bone edition panel
* Keyboard shortcuts
* Exporting the code in the console
* A simple help


### Bugs

1. Bone's skins (images) are loading pretty bad

fabianosoriani on [gmailzzz[ com
