Hello,

Thank you for your interest in contributing to `flatpickr`!
Contributions are welcome from beginners and seasoned developers alike.

### Bugs

If you've found a bug, create a new issue first, then submit a pull request. 

If at any point you are having trouble navigating/understanding the code base, please don't hesitate to ask for help :)

### Feature Requests

If you'd like to see a certain feature in flatpickr, file an issue first with request for consideration.

While a lot of feature requests often don't make it to the core, they can be implemented as [plugins](https://github.com/chmln/flatpickr/tree/master/src/plugins).

### How to submit a pull request

1. Fork the repository.
2. Setup the necessary dependencies by running `npm install`. 
3. Then, `npm start` to launch the dev environment. 
4. `src/index.ts` is the entry point, `index.html` is where you can experiment with options. 
5. Make desired changes and push.
6. Go to https://github.com/flatpickr/flatpickr/compare?expand=1

### How to debug in vscode

1. Setup a local repo as above (How to submit a pull request).
2. Install the [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
3. Add the following configuration to `${workspaceFolder}/.vscode/launch.json`
```
{
    "version": "0.1.0",
    "configurations": [
        {
            "name": "Launch Flatpickr Quick Start",
            "type": "chrome",
            "request": "launch",
            "url": "http://localhost:8000/index.html",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```
4. Make sure the development server is started `npm start`
5. Set your desired breakpoints in the typescipt source files.
6. Click on the debug symbol on the actions bar.
7. Click on the play button to start the debug session in a new Chrome browser window.

## License

By submitting a contribution to this project, you agree to allow the project
owners to license your work as part of this project under this project's MIT
[license](LICENSE.md).
