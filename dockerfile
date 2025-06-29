# Gunakan base image Node.js versi 18
FROM node:18-slim

# Set direktori kerja di dalam kontainer
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin sisa file proyek ke dalam direktori kerja
COPY . .

# Expose port yang digunakan aplikasi
EXPOSE 8080

# Perintah untuk menjalankan aplikasi saat kontainer dimulai
CMD [ "node", "index.js" ]
