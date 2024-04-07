// project.js - purpose and description here
// Author: Shloak Sinha
// Date: April 6, 2024

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    sibling: ["gene mutual", "DNA duo", "sibling", "chromosome comrade", "wombmate", "inherited collaborator of shared lineage", "branchmate of the family oak tree", "biological birthmate"],
    babysitter: ["babysitter", "Juvenile Supervision Specialist", "Miniature Minion Manager", "Infant Oversight Consultant", "Wee Folk Whisperer"],
    child: ["child", "infantile instigator of mischief", "chromosomal combination","hellion", "genetic offspring", "heir of our gene pool", "dastardly devilish descendant"],
    num: ["1", "2", "3"],
    action: ["reckless game of book Jenga", "initiating paperbound pandemonium", "propelling an orchestrated symphony of falling folios", 
             "inducing a cascade of paperbound chaos in the library realm", "propagating a textual tumult amidst the towering stacks of knowledge"],
    ride: ["confront the atrocious reverberations", "navigate the tumultuous tempest", "deal with the aftermath", "endure the byproducts of the stampede"],
    conqueror: ["Genghis Khan", "Atilla the Hun", "Napoleon"],
    screaming: ["producing sounds akin to a pterodactyl's rendition of 'Wrecking Ball'", "wailing as if it had experienced the sins of all homosapiens", 
               "howling with the souls it had contained within its devilish soul", "screeching like a caffeinated squirrel on a rollercoaster", "screaming"],
    face: ["ugly mug", "face", "visage vestibule", "facial framework", "physiognomic panorama", "cursed grimace"],
  };
  
  const template = ` My $sibling recently became a parent. I cannot overstate how terrifying their $child is. I was asked to be a $babysitter for $num hours. 
  
  As soon as they left, chaos ensued. The baby, barely able to crawl, immediately enaged in $action, toppling an entire mound of books onto the floor. 
  
  I sighed, knowing I would have to $ride of the $child.
  
  Minutes later, during what I thought was a calm moment, I turned around to see the second coming of $conqueror perched triumphantly on top of the couch, $screaming. 
  
  How she got up there, I'll never know. As I cleaned up a trail of overturned toys, I caught a glimpse of my $face in a mirror smeared with sticky fingerprints. 
  
  "This," I muttered to myself, "is why I'm not a parent."`;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  
}

// let's get this party started - uncomment me
main();