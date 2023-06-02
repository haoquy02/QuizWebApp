# About my project
⦁	 Base on this video:https://www.youtube.com/watch?v=MV1rEWlcW7U&list=WL&index=3&t=1779s&ab_channel=CodAffection
- Font-End: React.js
- Back-end: ASP.NET core 6.0
- Data base: SQL Sever
# About Font-End:
 - Using MUI to support display
 ![Login](https://github.com/haoquy02/QuizWebApp/assets/73586324/b12ac4d9-ae32-4f6c-b869-d4c77402c353)
- Using axios to send/get API
- After check if data is not valid, page will send an API to find user information. If data in database match with data user type -> Login successfull
 ![CreatAccount](https://github.com/haoquy02/QuizWebApp/assets/73586324/fdb1c4a5-1825-43ee-b5fa-87cfba912b8e)
- Base on Login page, after check if data is not valid, page will send an API to find user information. If data not found in data base, then create account successfully.
 ![Question](https://github.com/haoquy02/QuizWebApp/assets/73586324/f802f4e2-79b8-446b-b5cb-2bfc91398c2d)
- Using setInterval to count time
- Using <on Click> event to store user answer
![Result](https://github.com/haoquy02/QuizWebApp/assets/73586324/bee8dbbc-4cd9-49a0-b765-b8c0b9fbd1c4)
- Send API to get list of correct answer 
- Compare user answer and correct answer for calculateScore and color the right/wrong question
# About Back-End (model MVC):
 - Design Pattern: Singleton, Factory, Builder, Dependency Injection, Auto mapper,ORM
 - Using HMACSHA512 and Salt for encode password
 - Using token for Authenticate
 - Using cookie to store user data for next login
