# stream-centre-player
Player for video streams in StreamCentre by Qoollo.

# Usage

## In Browser

1. Install
    ```
    npm install stream-centre-player
    ```
2. Use
    ```js
    //  if you use browserify
    var Player = require("stream-centre-player");
    
    var videoElement = document.getElementById('video-player'),
        player = new Player(videoElement),
        url = 'http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd';
    player.initialize(url);
    player.play();
    ```
    ```html
    <!-- If you just include script on your page -->
    <script src="/node_modules/stream-centre-player/player.js"></script>
    <script>
        var videoElement = document.getElementById('video-player'),
            player = new Qoollo.StreamCentre.Player(videoElement),
            url = 'http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd';
    </script>
    ```

## In Browser embedded into C# app (e.g. CefSharp with MSE)

Don't ask me where to get CefSharp with MSE. I had to compile it myself. 
MSE (Media Source Extensions) are mandatory - these are codecs to actually play video.
But if you are here, so here's the way.

1. Install
    ```
    Install-Package Qoollo.StreamCentre.Player
    ```
2. Serve files. I use [Qoollo.SharpHttpServer](https://www.nuget.org/packages/Qoollo.SharpHttpServer/) 
for that. 
3. Add CefSharp's WebBrowser control to your window and navigate to served player.html file.
4. Call js from C# and subscribe for callbacks if you need.
    ```csharp
    //  call js from C#
    chromiumWebBrowser.GetBrowser().MainFrame.ExecuteJavaScriptAsync(code); // chromiumWebBrowser is CefSharp.Wpf.ChromiumWebBrowser
    
    //  subscribe for callbacks from js to C#
    class BrowserCallback
    {
        public object Call(string method, Dictionary<string, object> arg)
        {
            //  handle call from js
        }
    }

    chromiumWebBrowser.RegisterJsObject("BrowserCallback", new BrowserCallback());
    ```

# Develop

Just run default gulp task to start dev server with live reload.
```
gulp
```
All the source code is located at `src/` directory. Everything in 
`dist/` directory is being overwritten on build, so don't do anything
there.

Currently StreamCentre supports MPEG-DASH video streams, so [dash.js](https://github.com/Dash-Industry-Forum/dash.js/)
is used under the hood. Source code is written in TypeScript and typings
for dash.js at `src/dashjs.d.ts` are written by me and, of course, those
typings only cover tiny percent of dash.js. You should see [dash.js API docs](http://cdn.dashjs.org/latest/jsdoc/index.html)
for actual dash.js APIs and add missing typings to `src/dashjs.d.ts` if you need.

TODO: add `src/dashjs.d.ts` to [typings registry](https://github.com/typings/typings).

# How to publish NuGet and npm packages

The following command builds and pushes npm and NuGet packages.
```
gulp publish
```

Pushing NuGet package requires NuGet Gallery API key. You should setup
your local environment to know this key before publishing package. 
```
node_modules/nuget/bin/NuGet.exe setApiKey YOUR_API_KEY
```
You can get YOUR_API_KEY at https://www.nuget.org/account