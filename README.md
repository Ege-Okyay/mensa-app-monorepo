1 - the old menus dont get cleaned, i may need another github actions that run on specific times (after mensas close) (a cron job) that send a post request to the api which cleans the menus for new ones

2 - Error handling in edge cases, i dont want the whole app to fuck up when something goes wrong etc it should show the user in a nice way + i need to handle every possible error on edge cases especially for the api

3 - I want to build an admin dashboard that shows basic stats + has like a kill switch or something like that + a notification system when there are too many requests etc etc i want to keep it non over engineered but effective