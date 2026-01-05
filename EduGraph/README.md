# EduGraph

A simple Python application to visualize student academic performance.

## Project Overview
EduGraph reads student data from a CSV file, processes it using Pandas, and generates subject-wise performance visualizations (Pie Chart and Bar Graph) using Matplotlib.

## Technologies Used
- **Python 3**
- **Pandas**: For data manipulation.
- **Matplotlib**: For generating charts.

## Setup Instructions

1.  **Install Dependencies**:
    Ensure you have Python installed. Then run:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Prepare Data**:
    Ensure the `data/students.csv` file exists with columns: `student_id`, `student_name`, `subject`, `marks`.

## How to Run
Run the script from the command line:

```bash
python edugraph.py
```

## Example Usage

1.  Run the script.
2.  View the list of available students.
3.  Enter the Student ID (e.g., `101`).
4.  The application will display the marks and save a visualization image (e.g., `student_101_performance.png`) in the current directory.
