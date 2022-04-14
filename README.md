# Async Race
## Async Race is a SPA to manage the collection of the cars, operate its engines, and show races statistics
![image](https://user-images.githubusercontent.com/85354736/163404457-90e6a955-d45e-4467-be85-75d7560b2421.png)

## For testing this app you should setup and running this repo https://github.com/mikhama/async-race-api

## Functional requirements
1. Basic structure:
   - [x] There should be two views on the site: "Garage" and "Winners".
   - [x] "Garage" view should contain its name, page number, and the full amount of items in the database (how many car user has in his garage).
   - [x] "Winners" view should contain its name, page number, and the full amount of items in the database (how many records the winners table contains).
   - [x] View state should be saved when user switches from one view to another. For example, page number shouldn't be reset, input controls should contain that they contained before switching, etc.
2. "Garage" view:
   - [x] User should be able to create, update, delete a car, and see the list of the cars. Car has only two attributes: "name" and "color". For "delete"-operation car should be deleted from "garage" table as well as from "winners".
   - [x] User should be able to select any color from an RGB-Palete [like here](https://www.colorspire.com/rgb-color-wheel/) and see the picture of the car colored with the color selected and car's name.
   - [x] Near the car's picture should be buttons to update its attributes or delete it.
   - [x] There should be pagination on the "Garage" view (7 cars per one page).
   - [x] There should be a button to create random cars (100 cars per click). Name should be assembled from two random parts, for example "Tesla" + "Model S", or "Ford" + "Mustang" (At least 10 different names for each part). Color should be also generated randomly.
3. Car animation:
   - [x] Near the car's picture should be buttons for starting / stoping the car engine.
   - [x] User clicks to the engine start button -> UI is waiting for car's velocity answer -> animate the car and makes another request to drive. In case api returned 500 error car animation should be stopped.
   - [x] User clicks to the engine stop button -> UI is waiting for answer for stopping engine -> car returned to it's initial place.
   - [x] Start engine button should be disabled in case car is already in driving mode. As well as stop engine button should be disabled when car is on it's initial place.
   - [x] Car animation should work fine on any screen (smallest screen size is 500px).
4. Race animation:
   - [x] here should be a button to start race. After user clicks this button all the cars on the current page start driving.
   - [x] There should be a button to reset race. After user clicks this button all the cars return to it's initial places.
   - [x] After some car finishes first user should see the message contains car's name that shows which one has won.
5. "Winners" view:
   - [x] After some car wins it should be displayed at the "Winners view" table.
   - [x] There should be pagination (10 winners per one page).
   - [x] Table should include the next culumns: "№", "Image of the car", "Name of the car", "Wins number", "Best time in seconds" (names of the columns can differ). If the same car wins more than once the number of wins should be incremented while best time should be saved only if it's better than the stored one.
   - [x] User should be able to sort cars by wins number and by best time (ASC, DESC).
