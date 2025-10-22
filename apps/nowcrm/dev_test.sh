#!/bin/sh
set -e

# 1. Bring up dependent services (e.g., redis and ntstrapi) via Docker Compose.
source ~/.nvm/nvm.sh && nvm use 22.0.0
echo "Starting dependencies using docker-compose..."
cd ..
sudo docker-compose -f docker-compose-vlad.yaml up -d redis ntstrapi
cd contactsapp

# 2. Start the Next.js client app in development mode.
echo "Starting Next.js client app (yarn build)..."
yarn build &
CLIENT_PID=$!

# 3. Wait until the client app is available.
#    This loop will check http://localhost:3000 every second until it gets a response.
echo "Waiting for the client app to be ready on http://localhost:3000..."
TIMEOUT=60  # wait up to 60 seconds
until curl -s http://localhost:3000 > /dev/null; do
  sleep 1
  TIMEOUT=$((TIMEOUT - 1))
  if [ $TIMEOUT -le 0 ]; then
    echo "ERROR: Client app did not start within expected time."
    kill $CLIENT_PID
    exit 1
  fi
done
echo "Client app is up and running."

# 4. Run the Playwright tests.
echo "Running Playwright tests..."
yarn playwright:test

# 5. Clean up: Kill the client app process after tests have finished.
echo "Shutting down the client app..."
kill $CLIENT_PID

echo "Done."