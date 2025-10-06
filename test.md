week 5 test for authorisation
Time to test
Ensure that all files are saved.
In a VSC terminal, run the server - type pnpm run dev, press "Enter".
Open a browser tab and attempt to gain access to the account-management view by manipulating the URL, like this: localhost:5500/account/
You should be re-routed to the login page and see the flash message.
If you are not sent to the login view, check the cookies. If the JWT cookie exists, delete it. Then try getting to the account management view again.
Register three new accounts with the following information using your registration form:
account_firstname: Basic
account_lastname: Client
account_email: basic@340.edu
account_password: I@mABas1cCl!3nt
account_firstname: Happy
account_lastname: Employee
account_email: happy@340.edu
account_password: I@mAnEmpl0y33
account_firstname: Manager
account_lastname: User
account_email: manager@340.edu
account_password: I@mAnAdm!n1strat0r
Save these accounts' information as you will be using it often in the future.
Login to your database and change the account_type of the Employee account to "Employee".
Change the account_type of the Manager account to "Admin".
Login as "Basic Client". The account-management view should appear indicating you are logged in. Check the jwt cookie using the Web Development Tool > Cookies tab > View Cookie Information. Look at the value of the token, perhaps writing down the last 4 or 5 characters of the token. Delete the cookie and close the tab where you were looking at the cookie information.
Login as either the "Happy Employee" or "Manager User". Again, you should be directed to the account-management view. Examine the value of the jwt token in the cookie. The jwt token value should be different from that of the first token. This is because the payload is different.
Conclusion
Assuming that everything worked, you can log in and the cookie containing the token is set and sent to the browser, and it is checked to allow the client access to the account-management view, then the authentication is working. Notice the general nature of the check. All three accounts are allowed access, even though all three are different types of account. Yay! Do a happy dance. If not, then talk to your learning team, the TA or the professor. But, get it working before moving on to the enhancement.

Creative Commons License All materials (except as noted) are by Blaine Robertson and licensed under a Creative Commons Attribution-ShareAlike 3.0 License.

https://www.youtube.com/watch?v=3uX21GNYUyc