import { Request, Response } from 'express';

import { Controller, Get, Put, Post } from '@overnightjs/core';
import fetch from 'node-fetch';
import API from "./API";

@Controller('api/')
export class MealController extends API {

  private someMeals: string[];
  private min_num: number;
  private errors: string[];
  // private error :string;


  /**
   *Creates an instance of MealController.
   * @memberof MealController
   */

  constructor() {
    super();
    this.someMeals = ['52961', '52962', '52963', "52966", "52958"];
    this.min_num = Number.MAX_VALUE;
    this.errors=[];

  }


  /**
   *
   *
   * @param {Request} req
   * @param {Response} res
   * @returns
   * @memberof MealController
   */

  @Post('meals/')
  public async meal(req: Request, res: Response) {
    // make sure no previous errors in errors
    this.errors=[];
    const { mealIds } = req.body
    const queryMeals = mealIds || this.someMeals;
    

    if(!(Array.isArray(queryMeals)) || (Array.isArray(queryMeals) && queryMeals.length<1)){
      return res.status(400).json({message:"Expects an array of mealIds"})
    }

    // make sure every id is a number
    for(let id of queryMeals){
      if(isNaN(id)){
        this.errors.push(`the id - ${id} supplied is not valid`)
        continue;
      }
    }

    if(this.errors.length>0){
      return res.status(400).json({message:[...this.errors]})
    }

    try {

      const meals = await this.getMeals(queryMeals);

      const structuredMeals = this.structureMeals(meals);

      const getMealIdWithLeastIngredients = this.getMealIdWithLeastIngredients(this.min_num, structuredMeals)

      return res.json({ mealId: getMealIdWithLeastIngredients.idMeal })
    }
    catch (err) {
      console.log(err)
      return res.status(500).send({ error: err.message });
    }

  }


  /**
   *
   *
   * @private
   * @param {any[]} mealIds
   * @memberof MealController
   */

  private async getMeals(mealIds: string[]) {
    let meals = mealIds.map(async (meal) => {

      let aMeal = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.toString()}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      return await aMeal.json()
    });


    return await Promise.all(meals);
  }



  /**
   *
   *
   * @private
   * @param {any[]} meals
   * @returns
   * @memberof MealController
   */
  private structureMeals(meals: any[]) {
    let structuredMeals = meals.map((meal) => {
      meal = meal.meals[0]
      return {
        ...meal,
        ingredients: Object.keys(meal)
          .filter(o => o.includes('strIngredient'))
          .map((value) => meal[value])
          .filter((result) => result.length > 0)

      }
    })

    return structuredMeals;
  }


  /**
   *
   *
   * @private
   * @param {*} min_num
   * @param {*} meals
   * @memberof MealController
   */
  private getMealIdWithLeastIngredients(minimum: number, meals: any[]) {

    let theMeal;

    for (let meal of meals) {
      if (meal.ingredients.length < minimum) {
        minimum = meal.ingredients.length
        theMeal = meal
      }
    }

    return theMeal;

  }

}
