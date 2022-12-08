# What does this library do?

- Handles most of the setup required for fetching data from the Notion API
- Automatically generates types based on your database properties if you're using typescript
- Provides components to render your Notion Pages
- Downloads all of the media from your database into your public folder, to get around Notion API's 1 hr media expiration.

## Why is this library only in Next? Why not make it a broader React library?

The honest answer is because this started out with me wanting to play with Next 13 and React experimental features. I used a lot of those features and patterns in this library. However, this could be refactored to work for vanilla React. If you're interested in that, let me know. With enough interest I may re-write the library.

# React/Next Experimental Feature Documentation

https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#example-use-in-client-components-and-hooks (to read about cache)
