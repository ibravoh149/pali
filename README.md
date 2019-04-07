prerequisites: Ensure the following has been installed on the local machine
1. Nodejs,
2. Docker

Usage:
1. clone this repo
2. run "npm install" to install dependencies

To deploy the app on docker
1. Ensure docker has been installed on the machine
2. build the docker image with "docker build -t <name_your_image> ." (note the dot after the image name. it tells docker to build from the current working directory) e.g "docker build -t test-app ."
3. run "docker run -p <your_desired_port>:<app_port> <your_image_name>" (this will map the desired port to the app port. The app can now be access from the desired port specified) 
e.g "docker run -p 8000:3000 test-app"

endpoint:
POST - <host>:<your_desired_port>/api/meals
        req body-> {
                 mealIds:[mealid1, mealId2 mealId3 ...] //ids must be strings
        }

        response ://returns an id of meal with the least ingredients
