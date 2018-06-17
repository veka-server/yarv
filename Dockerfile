FROM php:apache

MAINTAINER VANHAEZEBROUCK Nicolas "veka610@gmail.com"

#######################################
#   CONFIG DE APACHE
#######################################

# ajout du vhost
ADD docker/host-apache2.conf /etc/apache2/sites-enabled/000-default.conf

#######################################
#   COPY DES SOURCES
#######################################

ADD ./sources/ /var/www/html

#######################################
#   VOLUME
#######################################

RUN mkdir /var/www/html/data

RUN chown -R www-data:www-data /var/www/html/data

VOLUME /var/www/html/data

#######################################
#   DEMARER LES SERVEURS
#######################################

ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]