# Changelog


### 11th May 2016

#### Add templates for section lists

Sections such as www.example.com/foo/ will now be rendered with a list of all pages that are part of this section. The list shows the pages' title and a summary of their content.

[Show me the diff](https://github.com/digitalcraftsman/hugo-material-docs/commit/1f8393a8d4ce1b8ee3fc7d87be05895c12810494)

### 22nd March 2016

#### Changing setup for Google Analytics

Formerly, the tracking id for Google Analytics was set like below:

```toml
[params]
    google_analytics = ["UA-XXXXXXXX-X", "auto"]
```

Now the theme uses Hugo's own Google Analytics config option. The variable moved outside the scope of `params` and the setup requires only the tracking id as a string:

```toml
googleAnalytics = "UA-XXXXXXXX-X"
```

[Show me the diff](https://github.com/digitalcraftsman/hugo-material-docs/commit/fa10c8eef935932426d46b662a51f29a5e0d48e2)