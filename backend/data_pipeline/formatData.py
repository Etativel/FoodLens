import os
import json
import re

# Directory containing your raw recipe JSON files
input_dir = "../scraper/storage/datasets/default"

output_file = "formatted_recipes.json"

def clean_nutrition(nutrition):
    cleaned = {}
    for k, v in nutrition.items():
        # Remove label prefixes like "Protein: ", "Total Fat: ", etc.
        if ":" in v:
            v = v.split(":", 1)[1].strip()
        # Extract only number + unit (e.g., "31g", "202mg", "75")
        match = re.search(r"[\d.]+\s*[a-zA-Z]*", v)
        cleaned[k] = match.group(0) if match else v.strip()
    return cleaned

def format_ingredients(ingredients):
    return [f"{i['quantity']} {i['unit']} {i['name']}".strip() for i in ingredients]

def clean_directions(steps):
    cleaned = []
    for i, step in enumerate(steps):
        # Remove any part starting from "Allrecipes" (and preceding newline if present)
        step = re.sub(r'\n?Allrecipes.*', '', step).strip()
        if step:  # Only add if there's something left
            cleaned.append(f"Step {i + 1}: {step}")
    return cleaned


def format_recipe(data):
    return {
        "title": data.get("name"),
        "url": data.get("url"),
        "thumbnail": data.get("thumbnail"),
        "rating": f"{data.get('rating')} stars ({data.get('ratingCount')} reviews)",
        "time": {
            "prep": data.get("prepTime"),
            "cook": data.get("cookTime"),
            "total": data.get("totalTime")
        },
        "servings": data.get("servings"),
        "ingredients": format_ingredients(data.get("ingredients", [])),
        "directions": clean_directions(data.get("directions", [])),
        "nutrition": clean_nutrition(data.get("nutrition", {}))
    }

def load_and_format_all_recipes(directory):
    all_recipes = []

    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)

                    # Handle single recipe or list of recipes
                    recipes = data if isinstance(data, list) else [data]

                    for recipe in recipes:
                        cleaned = format_recipe(recipe)
                        all_recipes.append(cleaned)

                except Exception as e:
                    print(f"Error processing {filename}: {e}")

    return all_recipes

if __name__ == "__main__":
    formatted_recipes = load_and_format_all_recipes(input_dir)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(formatted_recipes, f, indent=4, ensure_ascii=False)

    print(f"Saved {len(formatted_recipes)} recipes to {output_file}")
