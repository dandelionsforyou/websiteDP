import requests
import json

url = "https://script.google.com/macros/s/AKfycbzISEfGEs0ZLjFJFd63BUlMY8to4g7NoUtjgXt48raUSGWKwuEjtNxpcvK9q7kh36YFVg/exec"
data = {"status": "success", "device": "1"} # attempt or success, 1 or 2

response = requests.post(url, json=data) # url
print(response.text)
