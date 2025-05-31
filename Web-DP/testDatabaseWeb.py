import requests
import json

url = "https://script.google.com/macros/s/AKfycbzNVNhEWMvMN9oRrQFeTbztv_Lm0dJmd6_fe3GGAF2OIR89ug4iS1lUE6XugGyTv0XqDg/exec"
data = {"status": "attempt"} # attempt or success

response = requests.post(url, json=data)
print(response.text)
