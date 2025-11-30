/* ============================================
   BodyRevolution - muscle.js
   Exercise Database & Workout Plans
   ============================================ */

window.MuscleModule = {
  exercises: [
    /* ==================== CHEST & PUSH ==================== */
    {
      id: "gym_chest_1",
      name: "Flat Barbell Bench Press",
      muscle: "upper",
      difficulty: "Intermediate",
      tutorial: "https://www.youtube.com/embed/rT7DgCr-3pg"
    },
    {
      id: "gym_chest_2",
      name: "Incline Dumbbell Press",
      muscle: "upper",
      difficulty: "Beginner",
      tutorial: "https://www.youtube.com/embed/8bP3eDkX9W8"
    },
    {
      id: "gym_chest_4",
      name: "Cable Crossovers",
      muscle: "upper",
      difficulty: "Intermediate",
      tutorial: "https://www.youtube.com/embed/taI4X2c7_2w"
    },

    /* ==================== BACK & PULL ==================== */
    {
      id: "gym_back_1",
      name: "Pull-ups / Chin-ups",
      muscle: "upper",
      difficulty: "Hard",
      tutorial: "https://www.youtube.com/embed/eGo4IYlbE5g"
    },
    {
      id: "gym_back_2",
      name: "Bent Over Barbell Rows",
      muscle: "upper",
      difficulty: "Intermediate",
      tutorial: "https://www.youtube.com/embed/FWJR5Ve8bnQ"
    },
    {
      id: "gym_back_3",
      name: "Lat Pulldowns",
      muscle: "upper",
      difficulty: "Beginner",
      tutorial: "https://www.youtube.com/embed/CAwf1XhA9Ac"
    },

    /* ==================== SHOULDERS ==================== */
    {
      id: "gym_shld_1",
      name: "Standing Military Press",
      muscle: "upper",
      difficulty: "Intermediate",
      tutorial: "https://www.youtube.com/embed/5yWaNO6sMCg"
    },
    {
      id: "gym_shld_2",
      name: "Dumbbell Lateral Raises",
      muscle: "upper",
      difficulty: "Beginner",
      tutorial: "https://www.youtube.com/embed/3VcKaXpzqRo"
    },

    /* ==================== LEGS ==================== */
    {
      id: "gym_legs_1",
      name: "Barbell Back Squats",
      muscle: "lower",
      difficulty: "Hard",
      tutorial: "https://www.youtube.com/embed/SW_C1A-rejs"
    },
    {
      id: "gym_legs_2",
      name: "Romanian Deadlifts (RDL)",
      muscle: "lower",
      difficulty: "Intermediate",
      tutorial: "https://www.youtube.com/embed/JCXUYuzwNrM"
    },
    {
      id: "gym_legs_3",
      name: "Leg Press",
      muscle: "lower",
      difficulty: "Beginner",
      tutorial: "https://www.youtube.com/embed/IZQRsfb8A4U"
    },

    /* ==================== ARMS ==================== */
    {
      id: "gym_arms_1",
      name: "Barbell Bicep Curls",
      muscle: "upper",
      difficulty: "Beginner",
      tutorial: "https://www.youtube.com/embed/ykJmrZ5v0Oo"
    },
    {
      id: "gym_arms_2",
      name: "Tricep Pushdowns",
      muscle: "upper",
      difficulty: "Beginner",
      tutorial: "https://www.youtube.com/embed/Ls1a3xN6EMU"
    },

    /* ==================== HOME / BODYWEIGHT ==================== */
    {
      id: "home_chest_1",
      name: "Push-up Variations",
      muscle: "upper",
      difficulty: "Beginner",
      tutorial: "https://www.youtube.com/embed/IODxDxX7oi4"
    },
    {
      id: "home_legs_1",
      name: "Bulgarian Split Squats",
      muscle: "lower",
      difficulty: "Hard",
      tutorial: "https://www.youtube.com/embed/D7KaRcUTQeE"
    },
    {
      id: "home_core_1",
      name: "Plank Variations",
      muscle: "core",
      difficulty: "Beginner",
      tutorial: "https://www.youtube.com/embed/ASdvN_X4jMQ"
    },
    {
      id: "cardio_1",
      name: "Burpees",
      muscle: "cardio",
      difficulty: "Hard",
      tutorial: "https://www.youtube.com/embed/ml6cT4AZdqI"
    }
  ],

  workoutPlans: {
    gym: {
      push: ["Bench Press", "Overhead Press", "Incline DB", "Lateral Raises", "Tricep Pushdown"],
      pull: ["Pull-ups", "Bent Over Rows", "Face Pulls", "Bicep Curls", "Hammer Curls"],
      legs: ["Squats", "RDL", "Leg Press", "Calf Raises", "Plank"]
    },
    home: {
      push: ["Push-ups", "Pike Push-ups", "Dips (Chair)", "Lateral Raises (Water Bottles)"],
      pull: ["Inverted Rows (Table)", "Door Pull-ins", "Bicep Curls (Bag)", "Superman Holds"],
      legs: ["Bulgarian Split Squats", "Lunges", "Glute Bridges", "Calf Raises"]
    }
  }
};