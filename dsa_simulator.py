# This code runs a DSA fight simulation to find out, which weapon is the best.
"""DSA Fight Simulator."""

import sys
import random
import pandas as pd

WEAK_FIGHTER = {
    "name": "Weak Fighter",
    "base": 4,
    "talent": 4,
    "max_health": 25,
    "armor": 0,
}
MEDIUM_FIGHTER = {
    "name": "Medium Fighter",
    "base": 7,
    "talent": 7,
    "max_health": 35,
    "armor": 0,
}
STRONG_FIGHTER = {
    "name": "Strong Fighter",
    "base": 10,
    "talent": 10,
    "max_health": 45,
    "armor": 0,
}
VERY_STRONG_FIGHTER = {
    "name": "Very Strong Fighter",
    "base": 12,
    "talent": 12,
    "max_health": 55,
    "armor": 0,
}

HAMMER = {"name": "Hammer", "weapon_bonus": 0, "weapon_damage": 6, "defense": 0}
TWO_FLORETTS = {
    "name": "Two Floretts",
    "weapon_bonus": 6,
    "weapon_damage": 0,
    "defense": 0,
}
SHIELD = {"name": "Shield", "weapon_bonus": 0, "weapon_damage": 0, "defense": 6}
SWORD_AND_SHIELD = {
    "name": "Sword and Shield",
    "weapon_bonus": 2,
    "weapon_damage": 2,
    "defense": 2,
}
FIGHTERS = [WEAK_FIGHTER, MEDIUM_FIGHTER, STRONG_FIGHTER, VERY_STRONG_FIGHTER]
FIGHTERS_NAMES = [f["name"] for f in FIGHTERS]
WEAPONS = [HAMMER, SHIELD, TWO_FLORETTS, SWORD_AND_SHIELD]


def roll_die(n):
    """Würfle einen n-seitigen Würfel."""
    return random.randint(1, n)


def simulate_fight(character1, character2, rounds=1000):
    """Simuliere einen Kampf zwischen zwei Charakteren."""
    for _ in range(rounds):
        character1["health"] = character1["max_health"]
        character2["health"] = character2["max_health"]
        i = 0
        while character1["health"] > 0 and character2["health"] > 0 and i < 100:
            quality1 = max(
                0,
                min(
                    character1["talent"],
                    character1["base"]
                    + character1["talent"]
                    + character1["weapon_bonus"]
                    - character1["armor"]
                    - roll_die(20),
                ),
            )
            quality2 = max(
                0,
                min(
                    character2["talent"],
                    character2["base"]
                    + character2["talent"]
                    + character2["weapon_bonus"]
                    - character2["armor"]
                    - roll_die(20),
                ),
            )
            if quality1 > quality2:
                character2["health"] -= (
                    max(
                        character1["weapon_damage"]
                        + roll_die(6)
                        + (quality1 - quality2) / 2
                        - character2["defense"],
                        character1["weapon_damage"],
                    )
                    - character2["armor"]
                )
            if quality2 > quality1:
                character1["health"] -= (
                    max(
                        character2["weapon_damage"]
                        + roll_die(6)
                        + (quality2 - quality1) / 2
                        - character1["defense"],
                        character2["weapon_damage"],
                    )
                    - character1["armor"]
                )
            i += 1

        if character2["health"] <= 0:
            character1["wins"] += 1
            if character1["health"] >= character1["max_health"] * 0.8:
                character1["easy_wins"] += 1
        if character1["health"] <= 0:
            character2["wins"] += 1
            if character2["health"] >= character2["max_health"] * 0.8:
                character2["easy_wins"] += 1
    return character1, character2


def print_results(df, opponents="all"):
    """Drucke die Ergebnisse basierend auf den Gegnern."""
    if opponents == "equal":
        df = df[df["fighter"] == df["opponent"]]
    if opponents == "weaker":
        df = df[
            df.apply(
                lambda row: FIGHTERS_NAMES.index(row["opponent"]) + 1
                == FIGHTERS_NAMES.index(row["fighter"]),
                axis=1,
            )
        ]
    weapon_agg = df.groupby(["weapon"]).agg(
        {"fighter_wins": "sum", "fighter_easy_wins": "sum"}
    )
    opponent_agg = df.groupby(["opponent_weapon"]).agg(
        {"fighter_wins": "sum", "fighter_easy_wins": "sum"}
    )
    agg_df = pd.merge(
        weapon_agg.reset_index(),
        opponent_agg.reset_index(),
        left_on="weapon",
        right_on="opponent_weapon",
        suffixes=("_weapon", "_opponent_weapon"),
    )
    agg_df["win_ratio"] = (
        agg_df["fighter_wins_weapon"] / agg_df["fighter_wins_opponent_weapon"]
    ).round(2)
    agg_df["easy_win_ratio"] = (
        agg_df["fighter_easy_wins_weapon"] / agg_df["fighter_easy_wins_opponent_weapon"]
    ).round(2)
    agg_df.drop(columns=["opponent_weapon"], inplace=True)
    print(agg_df)


def fight(fighter, weapon, opponent, opponent_weapon):
    """Führe einen Kampf zwischen zwei Kämpfern mit ihren Waffen durch."""
    fighter_copy = fighter.copy()
    fighter_copy.update(weapon)
    fighter_copy["wins"] = 0
    fighter_copy["easy_wins"] = 0

    opponent_copy = opponent.copy()
    opponent_copy.update(opponent_weapon)
    opponent_copy["wins"] = 0
    opponent_copy["easy_wins"] = 0

    fighter_result, opponent_result = simulate_fight(fighter_copy, opponent_copy)

    return {
        "fighter": fighter["name"],
        "weapon": weapon["name"],
        "opponent": opponent["name"],
        "opponent_weapon": opponent_weapon["name"],
        "fighter_wins": fighter_result["wins"],
        "fighter_easy_wins": fighter_result["easy_wins"],
        "opponent_wins": opponent_result["wins"],
        "opponent_easy_wins": opponent_result["easy_wins"],
    }


def main(suffix="", fighter_armor=0, opponent_armor=0):
    """Hauptfunktion zum Ausführen der Simulation."""
    result = []
    for fighter in FIGHTERS:
        for weapon in WEAPONS:
            for opponent in FIGHTERS:
                for opponent_weapon in WEAPONS:
                    opponent["armor"] = opponent_armor
                    fighter["armor"] = fighter_armor
                    result.append(fight(fighter, weapon, opponent, opponent_weapon))

    df = pd.DataFrame(result)
    df.to_excel(f"fight_results{suffix}.xlsx", index=False)
    print("=== Results only for equal opponents ===")
    print_results(df, opponents="equal")
    print("\n=== Results for weaker opponents ===")
    print_results(df, opponents="weaker")
    print("\n=== Results for all opponents ===")
    print_results(df, opponents="all")


if __name__ == "__main__":
    fighter_armor = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    opponent_armor = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    print("Fighters with armor (+" + str(fighter_armor) + " defense)")
    print("Opponents with armor (+" + str(opponent_armor) + " defense)")
    main(fighter_armor=fighter_armor, opponent_armor=opponent_armor)
