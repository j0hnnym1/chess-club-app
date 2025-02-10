#!/bin/bash

# Set the repository link
REPO_LINK="https://github.com/j0hnnym1/chess-club-app.git"
PROJECT_NAME="chess-club-app"

# Get the absolute path of the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Clone the repository
echo "Cloning repository..."
git clone $REPO_LINK
cd $PROJECT_NAME

# Install dependencies in backend
echo "Installing backend dependencies..."
cd backend
npm install

# Install dependencies in frontend
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Define the .env file path
ENV_FILE="$SCRIPT_DIR/$PROJECT_NAME/backend/.env"

# Check if .env file already exists, if not, create it
if [ ! -f "$ENV_FILE" ]; then
    echo "Creating .env file in backend..."
    cat <<EOL > "$ENV_FILE"
PORT = 3000
JWT_SECRET=6f8c9bdc0f8b4912a5a5c4f3d9f1b3b097e6ef45ad5d0e3b80eaf74e1bca6b7d
MONGO_URI = mongodb+srv://cfuser:eleosre1@cluster0.chvrm.mongodb.net/ 
EOL
    echo ".env file created successfully!"
else
    echo ".env file already exists. Skipping creation."
fi

# Start Backend in a new Terminal tab
echo "Starting backend server in a new terminal..."
osascript -e 'tell application "Terminal" to do script "cd '"$SCRIPT_DIR"'/'"$PROJECT_NAME"'/backend && npm start"'

# Start Frontend in another Terminal tab
echo "Starting frontend server in another terminal..."
osascript -e 'tell application "Terminal" to do script "cd '"$SCRIPT_DIR"'/'"$PROJECT_NAME"'/frontend && npm start"'

echo "✅ Setup complete! Backend running on http://localhost:3000, Frontend on http://localhost:5173"

# # Wait for servers to be up before populating data
# sleep 10

# # Ensure `populate_dummy_data.sh` exists before execution
# POPULATE_SCRIPT="$SCRIPT_DIR/populate_dummy_data.sh"
# if [ -f "$POPULATE_SCRIPT" ]; then
#     echo "Populating dummy data..."
#     chmod +x "$POPULATE_SCRIPT"
#     "$POPULATE_SCRIPT"
# else
#     echo "❌ Error: populate_dummy_data.sh not found in $SCRIPT_DIR"
# fi
