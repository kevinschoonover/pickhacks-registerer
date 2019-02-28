import requests
events = [
'Opening Ceremony',
    'Dinner (March 1st)',
    'Team Building',
    '"Intro to Hackathons" by MLH',
    '"Intro to Web Dev" by ACM',
    'Musical Chairs',
    'Midnight Snack (March 1st)',
    'Smash Tournament',
    'Breakfast (March 2nd)',
    '"Developing Software in an Agile World" by Express Scripts',
    '"Amazon Alexa Skills" by Panera Bread',
    'Lunch (March 2nd)',
    '"The future of IT, Cyberpunk without the Neon-Chrome" by Centene Corporation',
    'Yoga',
    'Dinner (March 2nd)',
    'Cup Stacking',
    'Reimbursement Open House',
    'Midnight Snack (March 2nd)',
    'Breakfast (March 3rd)',
    'How to Demo Workshop',
    'Table Flipping',
    'Judging',
    'Lunch (March 3rd)',
]


for event in events:
    requests.post(
        "http://kschoon.me:8000/api/v1/events/",
        json={"name": event}
    )
