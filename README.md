


Funcionaliity Overivew:

1.1 Prompt/Search
Request with topic, subtopic, grade sent to webserver(WS) and sent to Database(DB) with prompt
WS retrieves 5 articles or books -> DB

1.2 Quiz Generation
DB.book and DB.prompt -> Api_call for 10 questions(Q’s) with a why correct for each

1.3 Adaptiveness 
Q answered into correctness(C) checker -> C
Q and C -> DB
DB.Q and DB.C -> Api_call for Q to append

1.4 Summary
DB-> Q with Correctness and why correct

