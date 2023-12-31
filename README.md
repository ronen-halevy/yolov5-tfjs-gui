## Note - This repo is still WIP till v1.0 is published (soon)

##

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

#########################################3

### Model Conversion to JS

Ref:
https://www.tensorflow.org/js/guide/conversion

1. Install converter:
   pip install tensorflowjs
2. run conversion:

tensorflowjs_converter --input_format=tf_saved_model yolov5s-seg_saved_model /tmp/tfjs_model

### CDN modules

### Deployment

The React application is deployed to gh-pages. This section describes the steps required for the deployment:
(Ref: https://github.com/gitname/react-gh-pages)

1. Install the gh-pages npm package and designate it as a development dependency:

$ npm install gh-pages --save-dev

2. Add a homepage property https://{username}.github.io/{repo-name} to package.json

3.Add a predeploy property and a deploy property to the scripts object of `package.json`:

"scripts": {

- "predeploy": "npm run build",
- "deploy": "gh-pages -d build",
  "start": "react-scripts start",
  "build": "react-scripts build",

4. Add a "remote" to the local Git repository.

git remote add origin https://github.com/{username}/{repo-name}.git

5. Push the React app to the GitHub repository

$ npm run deploy
