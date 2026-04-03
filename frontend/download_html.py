import urllib.request

urls = {
    "complaint_detail": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzc1MDE4OWM2ZmU1ZDQxZjQ4MmMxMDEyMTA5OWNlZWFhEgsSBxC78bj0kBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTk1NjQwNDQ3NzkzNDA4MTY1OQ&filename=&opi=89354086",
    "dashboard": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzJjOTc3M2U1MDkzMDQ4NjVhNzBiMjZiOGVlYjZkZTk0EgsSBxC78bj0kBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTk1NjQwNDQ3NzkzNDA4MTY1OQ&filename=&opi=89354086",
    "escalations": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QyYTIwODIyZDk4ODQzM2U5NDgzOTA3MjRiOWQ1NzBjEgsSBxC78bj0kBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTk1NjQwNDQ3NzkzNDA4MTY1OQ&filename=&opi=89354086",
    "analytics": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzcxOGIzYzMzNmY5NDRkYTA4ZWE0NzE3OTViOWRkZWU1EgsSBxC78bj0kBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTk1NjQwNDQ3NzkzNDA4MTY1OQ&filename=&opi=89354086",
    "login": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ZhYzMyZTkyMTVjZjRkMWQ4YzhlZjg1Mjk3Njc0NmQ1EgsSBxC78bj0kBQYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTk1NjQwNDQ3NzkzNDA4MTY1OQ&filename=&opi=89354086"
}

for name, url in urls.items():
    print(f"Downloading {name}...")
    try:
        urllib.request.urlretrieve(url, f"{name}.html")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
