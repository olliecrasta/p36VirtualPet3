//Create variables here

var database, dog, happyDog, dogImg, foodObj, feedPet, addFood, fs, gameState;
function preload() {
  sadDogImg = loadImage("images/dogImg.png")
  happyDogImg = loadImage("images/dogImg1.png")
  lazyDogImg = loadImage("images/Lazy.png")
  //load images here
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
  bedroomImg = loadImage("images/Bed Room.png");
  livingroomImg = loadImage("images/Living Room.png")

}

function setup() {
  createCanvas(800, 500);

  //init database
  database = firebase.database();

  //create dog sprite
  dog = createSprite(650, 300, 20, 20);
  dog.addImage("happy", happyDogImg)
  dog.addImage("sad", sadDogImg);
  dog.scale = 0.2;

  //food object
  foodObj = new Food();
  //foodObj.start();
  foodObj.getFoodStock();
   //read gameState
   foodObj.getState();

  //buttons for feeding pet and adding food
  feedPet = createButton("Feed the dog");
  feedPet.position(700, 100);
  feedPet.mousePressed(feedDog);

  //button for adding food
  addStock = createButton("Add food");
  addStock.position(800, 100);
  addStock.mousePressed(addFood);

  //button to start feed
  startFeed = createButton("Start Feed");
  startFeed.position(800, 200);
  startFeed.mousePressed(() => {
    foodObj.updateState("hungry");
    feedDog();
  });
 

  background(46, 139, 87);
}


function draw() {

  if (gameState === "hungry") {
    background(46, 139, 87);

    foodObj.display();
    feedPet.show();
    addStock.show();
    startFeed.hide();
    dog.visible = true;
  }
  //if not hungry, choose the respective background
  else {
    feedPet.hide();
    addStock.hide();
    startFeed.show();
    dog.visible = false;
    if (gameState === "playing") {
      foodObj.garden();
    }
    if (gameState === "sleepy") {
      foodObj.bedroom();
    }
    if (gameState === "bathing") {
      foodObj.washroom();
    }
    if (gameState === "living") {
      foodObj.livingroom();
    }

  }
updateDogActivity();
  


  drawSprites();
  fill(255)
  text("Last Feed - " + foodObj.lastFed, 500, 20);
  text(mouseX + "," + mouseY, mouseX, mouseY)

}

function feedDog() {
  foodObj.getFoodStock();
  console.log(foodObj.foodStock)
  if (foodObj.foodStock > 0) {
    imageMode(CENTER);
    image(foodObj.image, 550, 330, 70, 70)

    var hh = hour();
    var mm = minute();
    if (hh <= 9) {
      hh = "0" + hh;
    }
    if (mm <= 9) {
      mm = "0" + mm;
    }
    // console.log(hh + ":" + mm)
    foodObj.lastFed = hh + ":" + mm;
    foodObj.updateFoodStock(foodObj.foodStock - 1, foodObj.lastFed);
    dog.changeImage("happy");
  }
  else {
    dog.changeImage("sad");
  }

}

function addFood() {
  //console.log(foodObj.foodStock)
  foodObj.updateFoodStock(foodObj.foodStock + 1, foodObj.lastFed);
}

function updateDogActivity() {
  var lastFedhour = foodObj.lastFed.slice(0, 2);
  var currentHour = hour();
  var diff = 0;
  if (currentHour >= lastFedhour) {
    diff = abs(currentHour - lastFedhour)
  }
  if (currentHour < lastFedhour) {
    diff = (24 - lastFedhour) + currentHour;
  }
  console.log(diff);
  if(diff===0){
    foodObj.updateState("hungry");
  }
  else if (diff === 1) {
    foodObj.updateState("playing");
  }
  else if (diff === 2) {
    foodObj.updateState("sleeping");
  }
  else if (diff <= 4) {
    foodObj.updateState("bathing");
  }
  else if (diff <= 6) {
    foodObj.updateState("living");
  }
  else {
    foodObj.updateState("hungry");
  }

}
