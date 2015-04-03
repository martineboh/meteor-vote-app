# Meteor Vote App

## Configure Social Login apps

### Facebook
Visit [https://developers.facebook.com](https://developers.facebook.com)  and set up an app with the Site URL set to http://localhost:3000/. Create a file called `private/local-settings.json` with App ID and App Secret of your Facebook app. See `local-settings.json.example` for a template. 

### Twitter

1. Visit [https://dev.twitter.com/apps/new](https://dev.twitter.com/apps/new).
2. Set Callback URL to: http://127.0.0.1:3000/_oauth/twitter
3. Select "Create your Twitter application".
4. On the Settings tab, enable "Allow this application to be used to Sign in with Twitter" and click "Update settings".
5. Switch to the "Keys and Access Tokens" tab. Enter values in `private/local-settings.json`.


### Set Admins
To grant certain user administrative access, add their Facebook ID in an array in `private/admins.json`. See `admins.json.example` for a template. To find an account Facebook ID, visit [FindMyFacebookId.com](http://findmyfacebookid.com/).

## Build

### Local development

```
$ meteor --settings private/local-settings.json
```

Your app will now be running at [http://localhost:3000](http://localhost:3000).
