/* 

A Code Walk with Hasan Seirafi.

A Code Walk Summary 

Talking Points

1.	Server Architecture MVC

2.	JSON models 
	
    1. pros 
	2. cons 

3.	Views (controls how data flows)

4.	Composable Controllers (navigable data components) 
	
    1. pros
	2. cons

5. 	Dynamic and static Routing

6.  Single Purpose Services

7. 	Test First Based Development

8.  Scaling a web crawling service (and other time limited services)
 
*/



/*

1. How many calls are we expecting every hour on avg?

1. Is it reasonable for the server to take 500ms to fulfill a request?
    1. Is there more than one instance of the capture service running? 
    2. Do we round robin our request to each server, or are we using a more sophisticated algorithm?  

1. Is registration required to use the service?
    1. Is this a tiered service? Can categories of users access higher-quality images and options?
    2. Would this be a factor in lowering the average latency? 

1. Are we caching requests? 
    1. What caching algorithm will be most appropriate for this use case? 
    2. Do we expect the assets associated with any request to change over time?
    3. If we cache, will caches expire after some time?

1. Are we validating the perimeters? 
    2. Does there need to be a valid URL and CSS selector? 
    3. Do we always return a success call with a failed 1x1 pixel image, 
       irrespective of the validity of the input parameters? 

*/