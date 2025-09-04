##INstaructions 

TO:		New Data Science Analyst
FROM:		Silver Arena Management Team
DATE:		January 2023
SUBJECT: 	Recommendations for Silver Arena

Dear Analyst,
	The leadership team at Silver Arena is so glad you are willing to lend us your expertise. As you know we have both an NBA and NHL team that play in the arena. However, each team’s performance is headed in different directions, as our hockey team is moving up the standings while our basketball team is struggling. As such we can have attendance swing from 7,000 fans to 18,000 fans depending on several factors such as (but not limited to) event type, day of week, opponent, etc. Furthermore, economic pressures on both the food and labor markets have made it necessary to ensure our operation is as efficient as possible. We need your help in planning out the demand we might see for upcoming events.
We have provided some data from this season and last to aide in your analysis. We are hoping you can analyze this historical data to help us prepare for an upcoming event on MARCH 5th, 2023 where we will be playing the Oklahoma City Thunder. The game is at 2 PM Eastern and has an expected attendance of 10,000 fans. At a minimum we need to know what volume of transactions we can expect at each Concessions location for the event. In addition, please provide your thoughts on any cashier/point of sale staffing recommendations. If applicable, please highlight any additional risks or opportunities you notice in our arena. Note you may need to join some of the data sources together to complete your analysis.
	Please prepare a 10 to 15 minute presentation to deliver to the management team at Silver Arena. Feel free to use any platform/program to organize your thoughts and conduct your analysis. But the final recommendations need to be digestible by a non-technical audience. Please be prepared to show the team how you arrived at your findings. There will be a 10-15-minute Q&A period to follow as well.

Sincerely,
Silver Arena Management Team

 
Appendix 1: Data Dictionary
•	Transactions – A unique purchase interaction between guest and concessionaire
•	Units – Each individual product sold
•	Net Sales – Sales before taxes
•	Total POS – Number of unique devices that completed a sale
•	Point of Sale Type – Methodology of how a transaction is completed
o	Traditional POS – Cashier behind a register at a concessions location
o	Roving Hawkers – Vendors that roam concourse/seating bowl and sell direct to guests
o	Self-Checkout – Guest checks themselves out through upgraded technology
	Typically, these locations are roughly 1.66x faster than a human cashier
o	Autonomous Store – Guest authorizes a credit card upon entry and grabs whatever they want. Cameras and sensors identify what they bought and charges appropriately.
	Typically, these locations  are 2-5x faster than a human cashier
•	Total Attendance – Total guests scanned into building

Stand Group	Description
DEST – Action Station	Specialty cooking / prep happening at the station
DEST– Bars 	A full service bar; includes wine and/or liquor.  Could also be a social space
GC – Beverage Express	A stand selling majority, if not all, non-alcoholic beverages
GC – Fan Favorites	A stand with no cooking capability other than heat lamps/hot dog warmers, selling non-grilled/fried typical stadium items
GC – Grill Stand	A stand with cooking capabilities such as a fryer or grill, selling typical stadium food
GC – Snacks/Desserts	A stand where the majority of revenue generated comes from snacks or desserts; does not sell any "main meal" type items. 
GC – Pizza	A stand selling majority pizza
GC – Specialty	A stand selling main meals outside of traditional stadium fare.  This can be branded outside of the stadium or not.
Portable – Bars	A full service portable bar; includes wine and/or liquor
Portable – Beer	A portable selling majority, if not all, beer (if it sells liquor, should be categorized as a Portable – Bars)
Portable – Beverage Express	A portable selling majority, if not all, non-alcoholic beverages
Portable – Fan Favorites	A portable with no cooking capability other than heat lamps/hot dog warmers, selling non-grilled/fried typical stadium items
Portable – Grill 	A portable with cooking capabilities such as a fryer or grill, selling typical stadium food
Portable – Snacks/Desserts	A portable where the majority of revenue generated comes from snacks or desserts; does not sell any "main meal" type items
Portable – Specialty 	A portable selling main meals outside of traditional stadium fare.  This can be branded outside of the stadium or not.
Hawker Vending Room	Vending

