cd ../open-hotel-resources
yarn dev &
RESOURCES_PID=$!
cd ../orion-emulator

yarn docker:dev &
ORION_PID=$!

cd ../open-hotel-client
yarn dev
kill -9 RESOURCES_PID
kill -9 ORION_PID
