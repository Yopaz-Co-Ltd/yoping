rm -rf screen/dist
npm run screen:build 
rsync -rv ../screen/dist/ screen/dist/ 
npm run app:build