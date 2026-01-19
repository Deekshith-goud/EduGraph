# EduGraph – Student Performance Analyzer

EduGraph is a Python-based command-line tool that analyzes student performance data from a CSV file and generates professional visual reports in the form of pie charts and bar graphs.

It allows users to select a student by ID and automatically produces a graphical summary of their subject-wise marks.

---

## Features

* Loads and validates student data from a CSV file
* Displays a clean list of available students
* Allows interactive selection by Student ID
* Generates:

  * Pie chart for subject-wise performance distribution
  * Bar chart for marks per subject
* Saves graphs as PNG files
* Handles missing files and invalid input gracefully

---

## Project Structure

```
project_root/
│
├── main.py              # Your main script
├── data/
│   └── students.csv     # Input dataset
└── student_<id>_performance.png   # Auto-generated output files
```

---

## Requirements

Make sure you have Python 3.8+ installed.

Install required libraries:

```bash
pip install pandas matplotlib
```

---

## CSV File Format

Your `students.csv` file should look like this:

```csv
student_id,student_name,subject,marks
1,John Doe,Math,85
1,John Doe,Science,90
1,John Doe,English,78
2,Jane Smith,Math,92
2,Jane Smith,Science,88
```

Required columns:

* `student_id`
* `student_name`
* `subject`
* `marks`

---

## How to Run

1. Place your CSV file inside the `data/` folder as `students.csv`
2. Open terminal in the project folder
3. Run:

```bash
python main.py
```

4. Choose a Student ID when prompted
5. The system will generate a performance image like:

```
student_1_performance.png
```

---

## Sample Output

* Terminal displays selected student’s subject-wise marks
* Image file contains:

  * Pie chart of subject distribution
  * Bar graph of marks per subject

---

## Error Handling

EduGraph handles common issues:

* Missing CSV file
* Invalid student ID input
* No records for selected student
* Corrupted CSV format

---

## Customization

You can modify:

* Output directory: change `OUTPUT_DIR`
* Graph size: edit `figsize`
* Marks range: change `ax2.set_ylim()`
* Color styles: update matplotlib styles

---

## License

This project is free to use for educational and personal projects.

---

## Author

Developed as a student performance visualization tool using Python, Pandas, and Matplotlib.
