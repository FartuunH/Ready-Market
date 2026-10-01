import json

import os

from datetime import datetime, timedelta



from dotenv import load_dotenv

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from openai import OpenAI

from pydantic import BaseModel



load_dotenv()



app = FastAPI(

    title="CaatoAI API",

    version="1.0.0",

)



app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=False,

    allow_methods=["*"],

    allow_headers=["*"],

)



client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))



class MealPlanRequest(BaseModel):

    calorie_target: int

    protein_target: int

    food_preferences: str = ""

    food_restrictions: str = ""

    food_culture: str = ""

    budget: str = ""

    location: str = ""

    eating_style: str = "regular"





class WeeklyMealPlanRequest(BaseModel):

    calorie_target: int

    protein_target: int

    food_preferences: str = ""

    food_restrictions: str = ""

    food_culture: str = ""

    budget: str = ""

    location: str = ""

    eating_style: str = "regular"

    start_date: str = ""

    weekly_protein: str = "ai-choice"

    add_tuna: bool = False
    carb_style: str = "low-carb"
    pantry_items: list[str] = []

class MealImageRequest(BaseModel):

    meal_name: str

    meal_items: list[str]





class MealSwapRequest(BaseModel):

    meal_type: str

    current_meal_name: str

    calorie_target: int

    protein_target: int

    food_preferences: str = ""

    food_restrictions: str = ""

    food_culture: str = ""

    budget: str = ""

    location: str = ""

class ChatRequest(BaseModel):
    message: str

    calorie_target: int = 0
    protein_target: int = 0

    food_preferences: str = ""
    food_restrictions: str = ""
    food_culture: str = ""
    eating_style: str = "regular"

    calories_eaten: float = 0
    protein_eaten: float = 0

    today_meals: dict = {}

@app.get("/")

def home():

    return {

        "status": "ok",

        "service": "CaatoAI API",

    }





@app.get("/health")

def health():

    return {

        "status": "healthy",

        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),

    }





@app.get("/ai-test")

def ai_test():

    response = client.responses.create(

        model="gpt-5.6-luna",

        input="Reply with exactly: CaatoAI AI is connected",

    )



    return {

        "status": "ok",

        "message": response.output_text,

    }



@app.post("/meal-plan/generate")

def generate_meal_plan(request: MealPlanRequest):

    prompt = f"""

You are CaatoAI, a supportive AI nutrition coach.



Create ONE personalized daily meal plan for this user.



USER:

Daily calorie target: {request.calorie_target} calories

Daily protein target: {request.protein_target} grams

Food preferences: {request.food_preferences or "Not specified"}

Foods/restrictions to avoid: {request.food_restrictions or "None specified"}

Food culture: {request.food_culture or "Not specified"}

Budget: {request.budget or "Not specified"}

Location: {request.location or "Not specified"}

Eating style: {request.eating_style}



RULES:

- Respect food allergies and restrictions.

- Prefer foods that fit the user's stated culture and preferences.

- Generally create lower-carbohydrate, higher-protein meals.

- Prioritize protein foods such as eggs, chicken, fish, lean meat, tuna, yogurt, and other appropriate protein sources.

- Include vegetables regularly.

- Keep carbohydrate portions intentionally small. For rice, pasta, cambuulo, or similar starches, generally use about 1/2 to 3/4 cup cooked per meal. For muufo or bread, generally use 1 piece/serving per meal. Build the rest of the meal mainly around protein and vegetables.- Use realistic portions.

- Aim for the full day's calories and protein to be reasonably close to the targets.

- Do not make the plan unnecessarily restrictive.

- Do not include foods listed under restrictions.

- Give concrete quantities such as cups, ounces, pieces, tablespoons, or grams.

- This is a daily meal plan, not medical treatment.

- Return ONLY valid JSON.

- Do not use markdown.

- Keep the snack very simple and small.

- A snack should contain only 1 item, or at most 2 simple items.

- Prefer one whole fruit such as an apple, banana, orange, pear, or similar fruit.

- Do not make the snack look like a full meal.

- Do not combine many ingredients into the snack.

- The snack must contain exactly ONE whole fruit only.

- The snack must be a FRUIT, not a vegetable.

- Do not use carrots, cucumbers, tomatoes, celery, or other vegetables as the snack.

- Valid snack examples include apple, banana, orange, pear, peach, plum, or similar whole fruits.

- Do not combine the fruit with any other food.

- Good snack examples include one apple, one banana, one orange, one pear, or another whole fruit.

- Do not use yogurt, nuts, eggs, bread, protein shakes, or multiple foods for the snack.

- The snack must have exactly one item in the "items" array.

- Breakfast must feel like a normal healthy breakfast.

- Prefer foods such as eggs, Greek yogurt or plain yogurt, oats in moderate portions, fruit, cottage cheese, or other simple breakfast foods.

- Do not include canjeero in the default meal plan.

- Do not normally serve chicken, steak, fish with vegetables, salad-style meals, or other lunch/dinner-style meals for breakfast.

- Do not include canjeero in replacement meals.


LANGUAGE RULES:

- Write all user-facing meal-plan content in Somali.

- Meal names must be in Somali.

- Ingredient and portion descriptions must be in Somali.

- The coach_message must be in Somali.

- Do not write ingredient descriptions in English.

- Common units such as g, ml, oz, calories, and protein may remain as standard units.

- Keep Somali natural, simple, and easy to understand.



- When appropriate, prefer familiar Somali food names such as muufo, suqaar, bariis, baasto, cambuulo, hilib, kalluun, ukun, and caano.

- Do not force every meal to be traditional Somali food. Respect the user's food preferences, restrictions, budget, location, and nutrition targets.

Return exactly this structure:





{{

  "breakfast": {{

    "name": "",

    "time": "8:00 AM",

    "calories": 0,

    "protein": 0,

    "items": []

  }},

  "lunch": {{

    "name": "",

    "time": "1:00 PM",

    "calories": 0,

    "protein": 0,

    "items": []

  }},

  "dinner": {{

    "name": "",

    "time": "6:30 PM",

    "calories": 0,

    "protein": 0,

    "items": []

  }},

  "snacks": [

    {{

      "name": "",

      "time": "",

      "calories": 0,

      "protein": 0,

      "items": []

    }}

  ],

  "daily_totals": {{

    "calories": 0,

    "protein": 0

  }},

  "coach_message": ""

}}

"""



    response = client.responses.create(

        model="gpt-5.6-luna",

        input=prompt,

    )



    meal_plan = json.loads(response.output_text)



    return {

        "status": "ok",

        "meal_plan": meal_plan,

    }

@app.post("/meal-plan/weekly")

def generate_weekly_meal_plan(request: WeeklyMealPlanRequest):

    start_date = datetime.strptime(request.start_date, "%Y-%m-%d")



    somali_weekdays = [

        "Isniin",

        "Talaado",

        "Arbaco",

        "Khamiis",

        "Jimco",

        "Sabti",

        "Axad",

    ]



    week_days = []



    for i in range(7):

        current_date = start_date + timedelta(days=i)



        week_days.append({

            "day": somali_weekdays[current_date.weekday()],

            "date": current_date.strftime("%Y-%m-%d"),

        })

    prompt = f"""

You are CaatoAI, a supportive AI nutrition coach.



Create a personalized 7-day meal plan for this user.



USER:

Daily calorie target: {request.calorie_target} calories

Daily protein target: {request.protein_target} grams

Food preferences: {request.food_preferences or "Not specified"}

Foods/restrictions to avoid: {request.food_restrictions or "None specified"}

Food culture: {request.food_culture or "Not specified"}

Budget: {request.budget or "Not specified"}

Location: {request.location or "Not specified"}

Eating style: {request.eating_style}

SELECTED WEEKLY PROTEIN:
Main protein: {request.weekly_protein}
Tuna add-on allowed: {request.add_tuna}

CARB STYLE:
{request.carb_style}

FOOD THE USER ALREADY HAS / BOUGHT:
{json.dumps(request.pantry_items, ensure_ascii=False)}

Exact 7-day calendar: {json.dumps(week_days, ensure_ascii=False)}

WEEKLY PLAN RULES:

- The selected weekly main protein is: {request.weekly_protein}.
- Treat the selected weekly protein as a STRICT rule for lunch and dinner for all 7 days.
- Use that selected protein as the only main meat, poultry, fish, or seafood for lunch and dinner.
- Keep meals varied by changing vegetables, seasonings, cooking methods, sauces, and side dishes instead of changing the main protein.
- If main protein is "chicken", do not use beef, turkey, salmon, white fish, shrimp, or other meat/fish/seafood.
- If main protein is "beef", do not use chicken, turkey, fish, salmon, shrimp, or other meat/poultry/seafood.
- If main protein is "fish", use fish for lunch/dinner and do not use chicken, beef, turkey, or other meat/poultry.
- If main protein is "ai-choice", choose exactly ONE affordable main protein and keep it for the entire week.
- Eggs, yogurt, cottage cheese, and similar breakfast foods are allowed regardless of the weekly main protein.
- If Tuna add-on allowed is False, do not use tuna unless tuna itself is the selected weekly main protein.
- If Tuna add-on allowed is True, tuna may occasionally replace the selected protein for a lunch, while the selected protein remains primary for the week.
- The grocery list must obey the same protein rules and must not contain prohibited meats, poultry, fish, or seafood.
- Prefer ingredients listed under FOOD THE USER ALREADY HAS / BOUGHT when they fit the plan. Do not force them if they conflict with restrictions or nutrition targets.
- Still include the full weekly grocery list; the frontend will mark items the user already has.
- Carb style "regular": use moderate portions of whole-food carbohydrates.
- Carb style "low-carb": keep rice, pasta, couscous, quinoa, cambuulo, and similar cooked starches around 1/4 to 1/2 cup per meal; emphasize protein and non-starchy vegetables.
- Carb style "very-low-carb": make meals almost no-starch; usually omit rice, pasta, bread, couscous, quinoa, cambuulo, and potatoes, and use protein plus non-starchy vegetables instead. This does not mean zero carbohydrates.
- Do not automatically lower total calories just because carbohydrates are lower. Keep daily calories reasonably close to the user's calorie target and protein close to the protein target.


- Create exactly 7 days of meals.

- Each day must contain breakfast, lunch, dinner, and exactly one fruit snack.

- Keep each day's total calories reasonably close to the user's daily calorie target.

- Keep each day's total protein reasonably close to the user's daily protein target.

- Follow the selected carb style above.

- Prioritize the selected weekly main protein for lunch and dinner. Eggs, yogurt, cottage cheese, and similar foods may be used for breakfast.

- Do not include canjeero.

- Breakfast must feel like breakfast. Prefer eggs, yogurt, moderate portions of oats, fruit, cottage cheese, or other simple breakfast foods.

- Do not normally give lunch/dinner-style chicken, fish, steak, salad, or vegetable meals as breakfast.

- Lunch and dinner should be normal healthy weight-loss meals based mainly around lean protein and vegetables, with a small carbohydrate portion when appropriate.

- Vary meals throughout the week so the user is not eating exactly the same meals every day.

- The snack must be exactly ONE whole fruit only.

- Do not combine the snack fruit with yogurt, nuts, drinks, or another food.

- Respect all food allergies and restrictions.

- Consider the user's budget and location when choosing foods.

- Use realistic portions.



LANGUAGE RULES:

- Write all user-facing weekly meal-plan content in Somali.

- Meal names must be in Somali.

- Ingredient and portion descriptions must be in Somali.

- Grocery-list item names and category names must be in Somali.

- The weekly coach message must be in Somali.

- Keep the Somali natural, simple, and easy to understand.

- Common units such as g, kg, ml, oz, calories, and protein may remain as standard units.

Return ONLY valid JSON.

Do not use markdown.



Return exactly this structure:



{{

  "days": [

    {{

      "day": "",

"date": "",

      "breakfast": {{

        "name": "",

        "time": "8:00 AM",

        "calories": 0,

        "protein": 0,

        "items": []

      }},

      "lunch": {{

        "name": "",

        "time": "1:00 PM",

        "calories": 0,

        "protein": 0,

        "items": []

      }},

      "dinner": {{

        "name": "",

        "time": "6:30 PM",

        "calories": 0,

        "protein": 0,

        "items": []

      }},

      "snack": {{

        "name": "",

        "time": "3:30 PM",

        "calories": 0,

        "protein": 0,

        "items": []

      }},

      "daily_totals": {{

        "calories": 0,

        "protein": 0

      }}

    }}

  ],

  "weekly_grocery_list": {{

    "protein": [],

    "vegetables": [],

    "fruits": [],

    "dairy": [],

    "carbohydrates": [],

    "other": []

  }},

  "coach_message": ""

}}



IMPORTANT:

- The "days" array must contain exactly 7 day objects.

- Starting from the provided Week start date, assign the correct Somali weekday name to each of the 7 consecutive days.

- Use these Somali weekday names: Isniin, Talaado, Arbaco, Khamiis, Jimco, Sabti, Axad.

- The first day must correspond to the actual weekday of the Week start date, then continue in calendar order for 7 consecutive days.

- Put the Somali weekday name in the "day" field.

- The grocery list must combine the ingredients needed for the entire 7-day plan.

- Combine duplicate grocery items and give an approximate total quantity needed for the week.

- Use the "Exact 7-day calendar" provided above as the source of truth.

- Copy each "day" value from that calendar exactly and in the same order. Do not calculate or guess the weekday yourself.

- Copy both the "day" and "date" values from the Exact 7-day calendar exactly.

"""









    response = client.responses.create(

        model="gpt-5.6-luna",

        input=prompt,

    )



    weekly_plan = json.loads(response.output_text)



    return {

        "status": "ok",

        "weekly_plan": weekly_plan,

    }



@app.post("/meal-image/generate")

def generate_meal_image(request: MealImageRequest):

    items = "\n".join(f"- {item}" for item in request.meal_items)



    prompt = f"""

Create a realistic food photography image for the CaatoAI nutrition app.



Meal:

{request.meal_name}



Ingredients and portions:

{items}



IMAGE RULES:

- Show the meal described above as closely as reasonably possible.

- Make the food look realistic and appetizing.

- Use a clean plate or bowl.

- Natural soft lighting.

- Simple clean dining-table background.

- Overhead or slightly angled food photography.

- Show approximately the portions described.

- Do not add unrelated foods.

- No people.

- No hands.

- No text.

- No labels.

- No logos.

- No watermark.

- This is a visual illustration of the meal, not an exact calorie measurement.

"""



    result = client.images.generate(

        model="gpt-image-2",

        prompt=prompt,

        size="1024x1024",

        quality="low",

        output_format="jpeg",

    )



    return {

        "status": "ok",

        "image_base64": result.data[0].b64_json,

    }



@app.post("/meal/swap")

def swap_meal(request: MealSwapRequest):

    prompt = f"""

You are CaatoAI, a supportive AI nutrition coach.



The user wants to replace ONE meal from today's meal plan.



MEAL TO REPLACE:

Meal type: {request.meal_type}

Current meal: {request.current_meal_name}



USER:

Daily calorie target: {request.calorie_target} calories

Daily protein target: {request.protein_target} grams

Food preferences: {request.food_preferences or "Not specified"}

Foods/restrictions to avoid: {request.food_restrictions or "None specified"}

Food culture: {request.food_culture or "Not specified"}

Budget: {request.budget or "Not specified"}

Location: {request.location or "Not specified"}



RULES:

- Create a DIFFERENT meal from the current meal.

- Do not return the same meal with only a different name.

- Respect all food allergies and restrictions.

- Prefer foods that fit the user's culture and preferences.

- Generally create lower-carbohydrate, higher-protein replacement meals.

- Prioritize protein foods such as eggs, chicken, fish, lean meat, tuna, yogurt, and other appropriate protein sources.

- Include vegetables regularly.

- Keep carbohydrate portions intentionally small. For rice, pasta, cambuulo, or similar starches, generally use about 1/2 to 3/4 cup cooked per meal. For canjeero, muufo, or bread, generally use 1 piece/serving per meal. Build the rest of the meal mainly around protein and vegetables.

- Do not make the replacement keto or extremely low-carbohydrate.

- Do not compensate for smaller carbohydrate portions by making the replacement unnecessarily low in calories.

- Use realistic portions.

- Keep the replacement reasonably similar in calories and protein to an appropriate meal within the user's daily targets.

- Do not unnecessarily lower the user's calories.

- Give concrete quantities such as cups, ounces, pieces, tablespoons, or grams.

- Return only ONE replacement meal.

- This is a meal suggestion, not medical treatment.

- Return ONLY valid JSON.

- Do not use markdown.

- SPECIAL SNACK RULE: If meal_type is "snack", the replacement must be exactly ONE whole fruit only.

- For a snack replacement, return one fruit such as an apple, banana, orange, pear, peach, or similar whole fruit.

- A snack replacement must have exactly one item in the "items" array.

- Do not add yogurt, nuts, eggs, bread, drinks, protein shakes, or any second food to a snack.

- If replacing a fruit snack, choose a DIFFERENT fruit from the current snack.

- MEAL TYPE RULES:

- Breakfast must feel like a normal breakfast. Prefer foods such as eggs, yogurt, oats, fruit, or other simple breakfast foods.

- Do not include canjeero in breakfast, lunch, dinner, or snack replacement meals.- Do not normally serve chicken, steak, fish with vegetables, salad-style meals, or other lunch/dinner-style meals for breakfast.

- Lunch should be a normal healthy weight-loss lunch built mainly around lean protein and vegetables, with a small carbohydrate portion when appropriate.

- Dinner should be a normal healthy weight-loss dinner built mainly around lean protein and vegetables, with a small carbohydrate portion when appropriate.

- Do not normally use canjeero, muufo, or breakfast-style foods for lunch or dinner.

- Keep lunch and dinner varied. Examples of appropriate main proteins include chicken, fish, lean beef, turkey, tuna, or other suitable lean proteins.

- Continue following the lower-carbohydrate rules for all meals.



LANGUAGE RULES:

- Write all user-facing content in Somali.

- The meal name must be in Somali.

- Ingredient and portion descriptions must be in Somali.

- Do not write ingredient descriptions in English.

- Common units such as g, ml, oz, calories, and protein may remain as standard units.

- Keep the Somali natural and easy to understand.



Return exactly this structure:



{{

  "name": "",

  "time": "",

  "calories": 0,

  "protein": 0,

  "items": []

}}

"""



    response = client.responses.create(

        model="gpt-5.6-luna",

        input=prompt,

    )



    replacement_meal = json.loads(response.output_text)



    return {

        "status": "ok",

        "meal": replacement_meal,

    }

@app.post("/chat")
def caato_chat(request: ChatRequest):
    prompt = f"""
You are CaatoAI, a supportive Somali-first nutrition and wellness assistant.

The user is using the CaatoAI weight-management app.

USER'S CURRENT PLAN:

Daily calorie target: {request.calorie_target}
Daily protein target: {request.protein_target} g

Calories eaten today: {request.calories_eaten}
Protein eaten today: {request.protein_eaten} g

Food preferences:
{request.food_preferences or "Not specified"}

Food restrictions:
{request.food_restrictions or "None specified"}

Food culture:
{request.food_culture or "Not specified"}

Eating style:
{request.eating_style}

TODAY'S MEAL PLAN:

{json.dumps(request.today_meals, ensure_ascii=False)}

USER MESSAGE:

{request.message}

RULES:

- Answer primarily in natural, simple Somali.
- If the user writes in English, you may answer in English.
- Be supportive, practical, and concise.
- Use the user's actual calorie target, protein target, food preferences, restrictions, eating style, and today's meal plan when relevant.
- Never invent foods that the user says they are allergic to or must avoid.
- Do not claim the user ate a meal merely because it appears in today's planned meals.
- Use calories_eaten and protein_eaten when discussing what the user has actually consumed today.
- If the user asks what they should eat today, use today's meal plan when available.
- If the user asks about changing a meal, suggest an appropriate alternative that respects their preferences and restrictions.
- If the user asks about calories or protein, use the supplied numbers when available.
- Do not diagnose medical conditions.
- Do not tell the user to stop or change prescribed medication.
- For urgent or potentially dangerous medical symptoms, tell the user to seek appropriate medical care.
- Keep normal answers fairly short and easy to read.
- Do not use JSON.
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt,
    )

    return {
        "status": "ok",
        "message": response.output_text,
    }