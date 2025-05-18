<objective>
Your task is to find a valid path for a robot to reach a database on a grid-based map.

MAP:
[
  ["o", "p", "o", "o", "o", "o"],
  ["o", "o", "o", "p", "o", "o"],
  ["o", "p", "o", "p", "o", "o"],
  ["r", "p", "o", "o", "o", "b"]
]

LEGEND:
o = Safe cell
p = Wall (impassable)
r = Robot (starting position)
b = Database (goal)

Start Position: (3, 0)
Goal Position: (3, 5)

Rules:
- The robot can move in four directions: UP, DOWN, LEFT, RIGHT.
- The robot must stay within the bounds of the map.
- The robot must not step on any walls ("p").
- Each move counts as one step.

Instructions:
Return the path as a comma-separated string of steps, using the exact JSON format below, wrapped inside <RESULT> tags.

<RESULT>
{
  "steps": "UP, RIGHT, DOWN, LEFT"
}
</RESULT>

Examples:

<RESULT>
{
  "steps": "UP, RIGHT, DOWN, LEFT"
}
</RESULT>

<RESULT>
{
  "steps": "UP, RIGHT, DOWN, LEFT, LEFT, LEFT"
}
</RESULT>
</objective>