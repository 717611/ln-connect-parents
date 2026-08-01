# LN Parent Connect

# PROJECT CONTEXT



Build a production-ready Parent Portal for LN International School, Ranchi.



IMPORTANT:

This application is ONLY the Parent Portal.



This is NOT the School Admin ERP.



The SchoolOS (Super Admin, Admin, Teachers & Staff) already exists as a completely separate application built using Google AI Studio.



This Parent Portal must become another frontend connected to the SAME backend in the future.



Do NOT create any fake backend.



Do NOT create mock APIs.



Do NOT change the database structure.



Do NOT introduce a different architecture.



For now, Firebase integration should remain isolated inside a single configuration file (firebase.ts). Leave placeholders/TODOs for Firebase configuration because the Firebase keys will be added later.



The application should be completely ready for Firebase integration with minimal changes later.



------------------------------------------------------------



# TECH STACK



Build using:



• Vite

• React

• TypeScript

• TailwindCSS

• React Router

• Framer Motion

• Lucide React Icons

• TanStack Query

• React Hook Form



Architecture



SPA (Single Page Application)



Completely responsive



Mobile-first



Vercel deployment ready



Production folder structure



Clean reusable components



Proper TypeScript interfaces



No unnecessary libraries.



------------------------------------------------------------



# BACKEND ARCHITECTURE (VERY IMPORTANT)



The future backend already exists.



This application will connect to ONE Firebase Project.



Firebase Services



• Firebase Authentication

• Firestore

• Firebase Storage

• Firebase Cloud Messaging



The SchoolOS and Parent Portal will share:



Authentication



Firestore



Storage



Business Rules



Security Rules



Everything.



There is ONLY ONE Firebase project.



This Parent Portal should never assume a separate backend.



It is only another frontend.



DO NOT write Firebase implementation now.



Instead,



Create clean service layers and repository structure so later we only need to paste Firebase configuration and connect the methods.



Example



services/



authService.ts



studentService.ts



noticeService.ts



galleryService.ts



complaintService.ts



homeworkService.ts



classworkService.ts



These should contain placeholder methods and proper interfaces.



------------------------------------------------------------



# DESIGN DIRECTION



I'm attaching a UI inspiration board.



Take inspiration from it.



DO NOT copy literally.



Create an original premium EdTech UI.



The app should feel like



Apple



+



Google Material 3



+



Modern EdTech



+



Duolingo friendliness



+



Notion cleanliness



Avoid old-school ERP designs.



Lots of white space.



Rounded cards.



Beautiful typography.



Subtle animations.



Modern shadows.



Professional spacing.



Premium interactions.



------------------------------------------------------------



# BRAND



School



LN International School



Module



LN Parent



Theme



Light Theme



Primary



#FFB000



Secondary



#1C2340



Accent



#5B7CFA



Background



#F8FAFC



Cards



White



Success



#22C55E



Rounded radius



20-24px



Typography



Poppins



Inter



------------------------------------------------------------



# LOGIN SCREEN



Premium login experience.



Background



School building photograph



Blurred with elegant dark gradient overlay.



School logo.



Heading



LN International School



Subtitle



Parents Portal



Tagline



Stay connected with your child's academic journey.



Fields



Admission Number



Password



Forgot Password



Primary Login Button



No Google Login.



No social logins.



Modern micro animations.



------------------------------------------------------------



# NAVIGATION



Bottom Navigation



Home



Academic Work



Notices



Profile



Complaint Portal should NOT be a bottom tab.



Instead,



Place it as a featured card on Home.



------------------------------------------------------------



# HOME SCREEN



Display



Good Morning



Parent Name



Student Name



Class



Section



Student Avatar



Large Hero Card



Attendance percentage



(Currently demo UI only)



Quick Access



Homework



Classwork



Gallery



Complaint



Today's Academic Timeline



Homework



Classwork



Lesson Updates



Recent School Notices



Recent Class Notices



Complaint Status Card



Gallery Preview



Latest four photographs



Everything should look modern.



------------------------------------------------------------



# WORK PAGE



Tabs



Homework



Classwork



Modern academic cards.



Teacher



Subject



Description



Due Date



Status badge



------------------------------------------------------------



# NOTICES



Tabs



School Notices



Class Notices



Cards



Priority badges



Dates



Icons



Beautiful reading experience.



------------------------------------------------------------



# ATTENDANCE



DO NOT build attendance functionality yet.



Create a premium "Coming Soon" page.



Illustration



Short explanation



Beautiful empty state.



------------------------------------------------------------



# GALLERY



Responsive masonry grid.



Beautiful cards.



Fullscreen preview UI.



No download option.



------------------------------------------------------------



# COMPLAINT PORTAL



Very important.



Looks like a modern support center.



Features



Complaint List



Ticket Status



Open Complaint



Private Conversation Screen



Message Composer



Status Badge



Resolved



In Progress



Closed



UI only for now.



No backend implementation.



------------------------------------------------------------



# PROFILE



Student Photograph



Student Name



Admission Number



Class



Section



Parent Name



Mobile Number



Buttons



Change Password



Contact School



Privacy Policy



About



Logout



------------------------------------------------------------



# ANIMATIONS



Use Framer Motion.



Subtle only.



Fade



Slide



Scale



Fast



Professional



Never flashy.



------------------------------------------------------------



# CODE QUALITY



Use reusable components.



Separate folders.



No duplicated code.



Strong TypeScript typing.



Clean architecture.



Production-ready.



No inline styles.



Proper naming.



------------------------------------------------------------



# PLACEHOLDER DATA



Create a single mockData.ts file.



All UI should consume data from this file.



Later, replacing mock data with Firebase should require minimal code changes.



------------------------------------------------------------



# FINAL GOAL



The final result should look like a premium commercial EdTech mobile application rather than a traditional school ERP.



Parents should immediately feel that they are using a modern, polished, trustworthy product.



The codebase must be fast, maintainable, scalable, and fully Vercel deployment ready.

Mobile UI ready.

The Firebase integration will be added later by simply inserting the Firebase configuration and implementing the service methods without changing the UI or application architecture.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ln-connect-parents.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/117ad633-1338-4900-b9a5-ce338ec11715).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
