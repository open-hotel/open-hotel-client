cd ../open-hotel-resources
hs -p 8888 . --cors &
cd ../sirius-emulator
yarn start:dev &
cd ../client
yarn dev