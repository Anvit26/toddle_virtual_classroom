- *Virtual Classroom!*
- This project contains API's and controller logic for virtual classroom application.It has API of signin, assignments and submissions.

- *Run Application* 
- 1. run - npm i
- 2. run - node index.js

- *Note*
- For notification demonstration please enter valid emailId of studens in students field of addAssignment,Also notificaton will note work in local environment as it uses cloud service to send notification the access key is not in the project;however it is functioning in given url.
- Design Architecture and Description of Notification is attached in the zip file.
- API Collection as well as API Documentation is attached in zip file. 

- *Folder Structure*
- controller :- It contains logic impelemantaion of all the API's of the system.
- models :- It contains mongodb models of all the collection of virtual classroom.
- routes :- Contails API routes of virtual classroom. 

- *API routes*
- *SAMPLE REQUESTS ARE ADDED IN POSTMEN COLLECTION*
- *signin*
- (POST)/signin :- (tutor,student) users can signin and get token.(Public)

- *assignment*
- (GET)/assignment :- (tutor,student) students and tutor can get their assignments *filter options* are includedn in this api.(Protected)
- (POST)/assignment :- (tutor) tutor can add new assignments.(Protected)
- (PUT)/assignment :- (tutor) tutor can update existing assignments.(Protected)
- (DELETE)/assignment :- (tutor) tutor can delete existing assignments.(Protected)

- *submission*
- (GET)/submission :- (tutor,student) student will get his/her all submission and tutor will get submissions of his/her assignmets from all students.(Protected)
- (POST)/submission :- (student) student can submit his/her assignment on this route.(Protected)