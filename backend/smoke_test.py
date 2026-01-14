from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

print('health', client.get('/health').status_code, client.get('/health').json())

from PIL import Image
import io, base64
img = Image.new('RGB',(224,224),(120,120,120))
buf = io.BytesIO(); img.save(buf, format='PNG')
b = buf.getvalue()
print('predict-file status', client.post('/predict-file', files={'file':('i.png', b, 'image/png')}).status_code)
print('predict-base64 status', client.post('/predict-base64', json={'image_base64': base64.b64encode(b).decode()}).status_code)
