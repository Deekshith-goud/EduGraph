import pandas as pd
import matplotlib.pyplot as plt
import os
import sys

# Define constants
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'students.csv')
OUTPUT_DIR = BASE_DIR

def load_data(file_path):
    """Loads student data from a CSV file."""
    if not os.path.exists(file_path):
        print(f"Error: Data file not found at {file_path}")
        sys.exit(1)
    try:
        df = pd.read_csv(file_path)
        # Ensure column names are stripped of whitespace
        df.columns = df.columns.str.strip()
        return df
    except Exception as e:
        print(f"Error loading CSV: {e}")
        sys.exit(1)

def get_student_list(df):
    """Returns a DataFrame of unique students."""
    return df[['student_id', 'student_name']].drop_duplicates()

def process_student_data(df, student_id):
    """Filters data for a specific student."""
    student_data = df[df['student_id'] == student_id]
    if student_data.empty:
        return None
    return student_data

def generate_visualizations(student_data, student_id, student_name):
    """Generates and saves pie and bar charts for the student."""
    subjects = student_data['subject']
    marks = student_data['marks']

    # Create figure with 2 subplots
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    fig.suptitle(f'Academic Performance: {student_name} (ID: {student_id})', fontsize=16)

    # 1. Pie Chart
    ax1.pie(marks, labels=subjects, autopct='%1.1f%%', startangle=140, colors=plt.cm.Paired.colors)
    ax1.set_title('Subject-wise Performance Distribution')

    # 2. Bar Graph
    bars = ax2.bar(subjects, marks, color='skyblue')
    ax2.set_title('Marks by Subject')
    ax2.set_xlabel('Subjects')
    ax2.set_ylabel('Marks')
    ax2.set_ylim(0, 100) # Assuming marks are out of 100
    
    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax2.annotate(f'{height}',
                     xy=(bar.get_x() + bar.get_width() / 2, height),
                     xytext=(0, 3),  # 3 points vertical offset
                     textcoords="offset points",
                     ha='center', va='bottom')

    # Save logic
    output_filename = os.path.join(OUTPUT_DIR, f'student_{student_id}_performance.png')
    plt.tight_layout()
    plt.savefig(output_filename)
    plt.close()
    print(f"\n[SUCCESS] Graph saved as: {output_filename}")

def main():
    print("--------------------------------------------------")
    print("Welcome to EduGraph - Student Performance Analyzer")
    print("--------------------------------------------------")

    # Load Data
    print(f"Loading data from {DATA_FILE}...")
    df = load_data(DATA_FILE)

    # Show available students
    print("\nAvailable Students:")
    students = get_student_list(df)
    print(students.to_string(index=False))

    # User Selection
    try:
        user_input = input("\nEnter Student ID to analyze: ").strip()
        student_id = int(user_input)
    except ValueError:
        print("Error: Invalid ID format. Please enter a numeric ID.")
        return

    # Process Data
    student_data = process_student_data(df, student_id)

    if student_data is None:
        print(f"Error: No records found for Student ID {student_id}.")
    else:
        student_name = student_data['student_name'].iloc[0]
        print(f"\nAnalyzing data for: {student_name}")
        print("-" * 30)
        print(student_data[['subject', 'marks']].to_string(index=False))
        
        # Visualize
        generate_visualizations(student_data, student_id, student_name)
    
    print("\nanalysis complete.")
    print("--------------------------------------------------")

if __name__ == "__main__":
    main()
