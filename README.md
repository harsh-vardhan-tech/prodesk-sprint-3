# Dev Detective GitHub Search Client and Battle Arena

this is my sprint 3 project for prodesk IT internship called Dev Detective i built it using html css and vanilla javascript using fetch api async await and promises no react or external framework


## what this project does

basically its a github profile search client where you can search any github username like octocat or torvalds and it fetches live data from github rest api showing avatar name bio joined date repo count followers following and links it also has a battle mode where you can put two usernames together and it fetches both at the same time using promise all and calculates total stars across their repositories to show who wins with green card and who loses with red card


## what i used

html for building the semantic page structure
css for styling dark and light mode and responsive layout
vanilla javascript fetch api and async await for http requests
promises and promise all for handling asynchronous data
dom manipulation for creating cards and rendering live data
localstorage for saving dark light theme and optional api token


## features i added

search bar where user enters github username and clicks search or presses enter
loading state with a spinner indicator while api call is fetching
error state with clean user not found message when api gives 404 so app never crashes
profile card showing user avatar name joined date formatted properly bio and github handle
numerical stats showing public repos followers and following
metadata grid showing location portfolio blog website twitter and company with clickable links
endpoint chaining using repos url from first response to fetch user repositories
top 5 latest repositories listed below the profile card with direct links opening in new tab
repository cards show description language star count fork count and last updated date
custom date formatter utility converting iso timestamps like 2023 01 25 into clean readable date like 25 Jan 2023
battle mode tab where two developers can be compared side by side
simultaneous fetching of two users using promise all
total stars calculation by reducing stargazers count across repositories array
conditional winner and loser card rendering with green border and winner badge for winner and red border for runner up
dark mode and light mode toggle with localstorage saving
quick suggestion chips to instantly search popular accounts like octocat and torvalds
optional github personal access token field in settings to prevent 60 request per hour rate limit


## project files

index html has the search bar profile card repo list battle arena and modal
style css has the colors dark mode light mode responsive layout and animations
script js has all async await functions fetch logic promise all reduce and dom handling
Prompts md has the prompts i used during development
README md is this file


## ai help

i used ai to help me understand how async await and promises work in javascript how to handle 404 response in fetch without breaking the app how to chain repos url to fetch second endpoint and how to use promise all and reduce for calculating total stars in battle mode the styling colors and layout i built myself


## how to run

open index html directly in browser or use live server extension in vs code
