# Using the contact form

The contact form is at the page `/contact` of the site (for example `http://localhost:4321/contact`).

## Send a message

1. Open the `/contact` page.
2. Fill in your **name**, your **e-mail address** and your **message**. All three are required.
3. Press **Send**.

If a field is empty, or the e-mail address is not valid, a message appears next to that field and nothing is sent. Correct the field and press **Send** again. The site checks the form a second time on its own server, so the same messages appear even if your browser skipped its check.

When the message is accepted, the page shows "Thank you! Your message was received."

The site does not send any e-mail: nobody is notified, and you receive no copy.

## Where the saved messages are

Messages are saved on the computer running the site, in the file `data/messages.jsonl`. The `data` folder is inside the folder the site is started from. The folder and the file are created when the first message arrives.

The file holds one message per line. Each line contains the date and time received (`receivedAt`, in UTC), the `name`, the `email` and the `message`. For example:

```
{"receivedAt":"2026-11-04T10:15:00.000Z","name":"Ada","email":"ada@example.com","message":"Hello"}
```

Any text editor can open the file. Back it up if the messages matter: the site never deletes it.
