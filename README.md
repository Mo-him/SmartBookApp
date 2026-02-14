# Smart Bookmark App

A simple and clean bookmark manager built as part of an assignment using Next.js (App Router), Supabase, and Tailwind CSS.

This app allows users to log in with Google and manage their personal bookmarks in real time.

---

## Live Project

Live URL: https://smart-bookmark-app-nine-mu.vercel.app/  

---

## What This App Does

- Users can sign in using Google only (no email/password login).
- Each logged-in user can add bookmarks with a title and URL.
- Bookmarks are private — users can only see their own data.
- Real-time updates are enabled (if two tabs are open, changes appear instantly).
- Users can delete their own bookmarks.
- The app is deployed on Vercel.

---

## Tech Stack Used

- Next.js (App Router)
- Supabase (Authentication, Database, Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## How Authentication Works

Google OAuth is handled through Supabase Auth.  
After login, Supabase returns a session which is used to:

- Identify the logged-in user
- Attach bookmarks to that user's ID
- Restrict access using Row Level Security (RLS)

---

## Database Structure

Table: bookmarks

Columns:
- id (uuid)
- title (text)
- url (text)
- user_id (uuid)
- created_at (timestamp)

Row Level Security ensures:
- A user can insert their own bookmarks
- A user can view only their own bookmarks
- A user can delete only their own bookmarks

---

## Real-Time Feature

Supabase Realtime is enabled on the bookmarks table.

When a bookmark is:
- Added
- Deleted

The UI updates instantly without refreshing the page.

---

## Running Locally

1. Clone the repository
2. Install dependencies:

3.   npm install

4. Start the development server:

   npm run dev

Open http://localhost:3000

---

## Deployment

The project is deployed on Vercel.

---

## Assignment Requirements Checklist

✔ Google OAuth only  
✔ Private user data  
✔ Real-time updates  
✔ Delete functionality  
✔ Deployed live  

---

## Author

Mo-him  
GitHub: https://github.com/Mo-him


## Challenges Faced and How I Solved Them

While building this project, I faced a few practical issues:

1. Google OAuth Not Working Initially  
   At first, I received an “Unsupported provider” error while trying to log in with Google.  
   This happened because the Google provider was not enabled properly in Supabase.  
   I fixed this by enabling Google under Supabase Authentication settings and correctly configuring the redirect URLs.

2. OAuth Redirect Issues After Deployment  
   After deploying on Vercel, login failed due to incorrect redirect configuration.  
   The problem was that the production URL was not added in Supabase and Google Cloud Console.  
   I resolved this by:
   - Updating the Site URL in Supabase  
   - Adding the Vercel domain to Redirect URLs  
   - Adding the correct Authorized JavaScript Origin in Google Cloud  

3. Real-Time Updates Not Triggering  
   Initially, bookmarks were not updating across tabs.  
   I realized Realtime was not enabled for the bookmarks table.  
   After enabling Realtime in Supabase and subscribing properly in the frontend, it worked as expected.

4. Git Push Errors  
   I faced permission errors while pushing the project due to tracked system folders like `.vs`.  
   I solved this by updating the `.gitignore` file and removing cached files using:
   git rm -r --cached .vs

5. Repository Not Found Error  
   While pushing to GitHub, I got a "repository not found" error.  
   This was due to a mismatch in the repository name (case sensitivity).  
   After correcting the remote URL, the push worked successfully.

Overall, these issues helped me better understand authentication flows, deployment processes.

