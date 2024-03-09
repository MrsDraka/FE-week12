//Class below creates instances of the food submitted by users

class Food {
  constructor(mealName, description, countryOfOrigin) {
    this.mealName = mealName;
    this.description = description;
    this.countryOfOrigin = countryOfOrigin;
  }
}

// Class below has methods for CRUD operations with the API
class FoodService {
  static url = "https://65b497ef41db5efd2866a826.mockapi.io/api/v1/foods";

  static getAllFoods() {
    return $.get(this.url);
  }

  static addFood(food) {
    return $.post(this.url, food);
  }

  static deleteFood(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

//Class below will change/recreate the page's dom everytime a new class instance is created

class DOMManager {
  static foods;

  static getAllFoods() {
    FoodService.getAllFoods().then((foods) => this.render(foods));
  }

  static addFood(mealName, description, countryOfOrigin) {
    FoodService.addFood(new Food(mealName, description, countryOfOrigin))
      .then(() => {
        return FoodService.getAllFoods();
      })
      .then((foods) => this.render(foods));
  }

  static deleteFood(id) {
    FoodService.deleteFood(id)
      .then(() => {
        return FoodService.getAllFoods();
      })
      .then((foods) => this.render(foods));
  }

  //This method renders the new dish card on the website

  static render(foods) {
    this.foods = foods;
    $("#foodApp").empty();
    for (let dish of foods) {
      $("#foodApp").prepend(`
<div id="${dish.id}" class="card mb-3 text-bg-info my-4">
  <div class="card-header">
    <h2>${dish.mealName}</h2>
  </div>
  <div class="card-body">
    <div class="row">
      <div class="col-md-12">
        <p>Country of origin: ${dish.countryOfOrigin} </p>
        <p>Description: ${dish.description} </p>
        <button class="btn btn-warning" onclick="DOMManager.deleteFood('${dish.id}')">Delete</button>
      </div>
           
    </div>
  </div>
</div>
`);
    }
  }
}

//the code below adds a new dish whenever the submit button is pressed by the user

$("#submitFood").on("click", () => {
  DOMManager.addFood(
    $("#mealName").val(),
    $("#description").val(),
    $("#origin").val()
  );
  $("#mealName").val("");
  $("#description").val("");
  $("#origin").val("");
});

//Code below retrieves all the foods from the API
DOMManager.getAllFoods();
