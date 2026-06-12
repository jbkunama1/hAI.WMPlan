FROM nginx:1.27-alpine

# Nginx-Konfig
COPY nginx.conf /etc/nginx/conf.d/default.conf

# App-Dateien
COPY index.html /usr/share/nginx/html/
COPY style.css  /usr/share/nginx/html/
COPY app.js     /usr/share/nginx/html/
COPY sw.js      /usr/share/nginx/html/
COPY manifest.webmanifest /usr/share/nginx/html/
COPY logo.png   /usr/share/nginx/html/

EXPOSE 80
