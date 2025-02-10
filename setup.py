import os
import subprocess
import time
import shutil

# Repository details
REPO_LINK = "https://github.com/j0hnnym1/chess-club-app.git"
PROJECT_NAME = "chess-club-app"

# Get script directory
SCRIPT_DIR = os.getcwd()
PROJECT_DIR = os.path.join(SCRIPT_DIR, PROJECT_NAME)

# Step 1: Clone Repository
def clone_repository():
    if not os.path.exists(PROJECT_DIR):
        print("📂 Cloning repository...")
        subprocess.run(["git", "clone", REPO_LINK], check=True)
    else:
        print("✅ Repository already exists. Skipping cloning.")

# Step 2: Install Dependencies
def install_dependencies(path):
    if os.path.exists(path):
        print(f"📦 Installing dependencies in {path}...")
        subprocess.run("npm install", shell=True, cwd=path, check=True)
    else:
        print(f"❌ Error: {path} directory not found!")

# Step 3: Create .env file for backend
def create_env_file():
    env_file_path = os.path.join(PROJECT_DIR, "backend", ".env")
    
    if not os.path.exists(env_file_path):
        print("📝 Creating .env file in backend...")
        with open(env_file_path, "w") as f:
            f.write("PORT=3000\n")
            f.write("JWT_SECRET=6f8c9bdc0f8b4912a5a5c4f3d9f1b3b097e6ef45ad5d0e3b80eaf74e1bca6b7d\n")
            f.write("MONGO_URI=mongodb+srv://cfuser:eleosre1@cluster0.chvrm.mongodb.net/\n")
        print("✅ .env file created successfully!")
    else:
        print("✅ .env file already exists. Skipping creation.")

# Step 4: Start Backend & Frontend Servers
def start_server(path, name):
    if os.path.exists(path):
        print(f"🚀 Starting {name} server...")
        if os.name == "nt":  # Windows
            subprocess.Popen(f"start cmd /k \"cd /d {path} && npm start\"", shell=True)
        else:  # macOS / Linux
            subprocess.Popen(["osascript", "-e", f'tell application "Terminal" to do script "cd {path} && npm start"'])
    else:
        print(f"❌ Error: {path} directory not found!")

# Step 5: Populate Dummy Data (if the script exists)
def populate_dummy_data():
    populate_script = os.path.join(SCRIPT_DIR, "populate_dummy_data.py")

    if os.path.exists(populate_script):
        print("🛠️ Populating dummy data...")
        subprocess.run(["python", populate_script], check=True)
    else:
        print(f"❌ Error: {populate_script} not found!")

# Main Execution
if __name__ == "__main__":
    clone_repository()
    install_dependencies(os.path.join(PROJECT_DIR, "backend"))
    install_dependencies(os.path.join(PROJECT_DIR, "frontend"))
    create_env_file()

    # Start backend & frontend
    start_server(os.path.join(PROJECT_DIR, "backend"), "backend")
    start_server(os.path.join(PROJECT_DIR, "frontend"), "frontend")

    # Wait for servers to be ready
    print("⏳ Waiting for servers to start...")
    time.sleep(10)

    # Populate data
    populate_dummy_data()

    print("\n✅ Setup complete! Backend running on http://localhost:3000, Frontend on http://localhost:5173")
