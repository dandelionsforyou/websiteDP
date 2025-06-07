import requests
import json

url = "https://script.google.com/macros/s/AKfycby8rKVhToeZtXW3A72rh_JWSX_4n9ZvTS-AJ7wVUEnzHohByqjUCjvgTt4tDgbNdHKzYA/exec"
data = {"status": "success", "device": "2"} # attempt or success, 1 or 2

response = requests.post(url, json=data) # url
print(response.text)
