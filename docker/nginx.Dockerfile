# Pull nginx base image
FROM nginx:latest

# Expost port 4021
EXPOSE 4088

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static assets into var/www
COPY ./www /var/www


# Start up nginx server
CMD ["nginx"]